const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

// Apply authentication middleware to protect dashboard endpoint
router.get('/', verifyToken, (req, res) => {
    res.json({ message: 'Welcome to the Dashboard API!' });
});

module.exports = router;