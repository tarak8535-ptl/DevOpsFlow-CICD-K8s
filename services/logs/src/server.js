const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const promClient = require("prom-client");
const dotenv = require("dotenv");

dotenv.config();

const logsRoutes = require("./routes/logs");

const app = express();
const PORT = process.env.PORT || 5003;

const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

app.use(cors({ origin: process.env.ALLOWED_ORIGINS || "*" }));
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "100kb" }));

app.use("/api/logs", logsRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", service: "logs" });
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.listen(PORT, () => {
  console.log(`Logs service running on port ${PORT}`);
});
