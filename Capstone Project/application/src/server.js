const app = require("./app");
const { initializeDatabase } = require("./db");

const port = Number(process.env.PORT || 3000);
async function start() {
  let attempt = 0;
  while (attempt < 20) {
    try { await initializeDatabase(); break; }
    catch (err) {
      attempt++;
      console.error(`Database not ready (${attempt}/20): ${err.message}`);
      if (attempt === 20) process.exit(1);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  app.listen(port, "0.0.0.0", () => console.log(`DevOpsFlow listening on ${port}`));
}
start();