const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

const logs = [
  { id: 1, type: "Blue-Green", service: "auth", status: "Success", timestamp: "2025-04-02T10:30:00Z" },
  { id: 2, type: "Canary", service: "dashboard", status: "Rolling", timestamp: "2025-04-02T11:15:00Z" },
  { id: 3, type: "Rolling", service: "monitoring", status: "Success", timestamp: "2025-04-01T09:00:00Z" },
  { id: 4, type: "Blue-Green", service: "logs", status: "Success", timestamp: "2025-03-31T14:45:00Z" },
  { id: 5, type: "Canary", service: "frontend", status: "Failed", timestamp: "2025-03-30T16:20:00Z" },
];

router.get("/", verifyToken, (req, res) => {
  res.json(logs);
});

module.exports = router;
