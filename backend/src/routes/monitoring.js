const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

// Apply authentication middleware to protect monitoring metrics
router.get('/metrics', verifyToken, (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

module.exports = router;
