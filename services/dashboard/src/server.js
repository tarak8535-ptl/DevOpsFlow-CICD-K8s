const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const promClient = require("prom-client");
const dotenv = require("dotenv");

dotenv.config();

const dashboardRoutes = require("./routes/dashboard");

const app = express();
const PORT = process.env.PORT || 5002;

const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

app.use(cors({ origin: process.env.ALLOWED_ORIGINS || "*" }));
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "100kb" }));

app.use("/api/dashboard", dashboardRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", service: "dashboard" });
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.listen(PORT, () => {
  console.log(`Dashboard service running on port ${PORT}`);
});
