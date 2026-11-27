const express = require("express");
const path = require("path");
const client = require("prom-client");
const { pool } = require("./db");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const registry = new client.Registry();
client.collectDefaultMetrics({ register: registry });
const httpRequests = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status"],
  registers: [registry]
});
const requestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route"],
  registers: [registry]
});

app.use((req, res, next) => {
  const end = requestDuration.startTimer({ method: req.method, route: req.path });
  res.on("finish", () => {
    end();
    httpRequests.inc({ method: req.method, route: req.route?.path || req.path, status: String(res.statusCode) });
    console.log(JSON.stringify({
      level: "info", message: "http_request", method: req.method,
      path: req.path, status: res.statusCode, timestamp: new Date().toISOString()
    }));
  });
  next();
});

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected", version: process.env.APP_VERSION || "local" });
  } catch {
    res.status(503).json({ status: "unhealthy", database: "disconnected" });
  }
});

app.get("/api/tasks", async (_req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) { next(err); }
});

app.post("/api/tasks", async (req, res, next) => {
  try {
    const title = String(req.body.title || "").trim();
    const description = String(req.body.description || "").trim();
    if (!title || title.length > 160) return res.status(400).json({ error: "Title is required (max 160 characters)." });
    const result = await pool.query(
      "INSERT INTO tasks(title, description) VALUES($1, $2) RETURNING *",
      [title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
});

app.patch("/api/tasks/:id", async (req, res, next) => {
  try {
    const status = req.body.status;
    if (!["pending", "in-progress", "done"].includes(status)) return res.status(400).json({ error: "Invalid status." });
    const result = await pool.query("UPDATE tasks SET status=$1 WHERE id=$2 RETURNING *", [status, req.params.id]);
    if (!result.rowCount) return res.status(404).json({ error: "Task not found." });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

app.delete("/api/tasks/:id", async (req, res, next) => {
  try {
    const result = await pool.query("DELETE FROM tasks WHERE id=$1", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ error: "Task not found." });
    res.status(204).end();
  } catch (err) { next(err); }
});

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", registry.contentType);
  res.end(await registry.metrics());
});

app.use((err, _req, res, _next) => {
  console.error(JSON.stringify({ level: "error", message: err.message, timestamp: new Date().toISOString() }));
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;