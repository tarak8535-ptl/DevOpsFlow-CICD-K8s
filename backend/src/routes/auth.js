const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  res.json({ message: 'Login successful', token: 'dummy-jwt-token' });
});

module.exports = router;
