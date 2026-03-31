const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

router.get("/metrics", verifyToken, (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    services: {
      auth: { status: "UP", latency: "12ms" },
      dashboard: { status: "UP", latency: "8ms" },
      logs: { status: "UP", latency: "15ms" },
      monitoring: { status: "UP", latency: "5ms" },
    },
    cluster: {
      nodes: 2,
      pods: 10,
      cpuUsage: "34%",
      memoryUsage: "58%",
    },
  });
});

module.exports = router;
