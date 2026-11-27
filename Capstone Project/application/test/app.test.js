const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("../src/app");
const request = require("supertest");

test("health endpoint returns 503 or 200 depending on database availability", async () => {
  const response = await request(app).get("/health");
  assert.ok([200, 503].includes(response.status));
});

test("task creation validates required title", async () => {
  const response = await request(app).post("/api/tasks").send({title:""});
  assert.equal(response.status, 400);
  assert.match(response.body.error, /Title is required/);
});

test("metrics endpoint is exposed", async () => {
  const response = await request(app).get("/metrics");
  assert.equal(response.status, 200);
  assert.match(response.text, /http_requests_total/);
});