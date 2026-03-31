const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

router.get("/", verifyToken, (req, res) => {
  res.json({
    message: "Welcome to the Dashboard",
    stats: {
      deployments: 42,
      activeServices: 4,
      healthyPods: 8,
      cpuUsage: "34%",
      memoryUsage: "58%",
      lastDeployment: new Date().toISOString(),
    },
  });
});

module.exports = router;
