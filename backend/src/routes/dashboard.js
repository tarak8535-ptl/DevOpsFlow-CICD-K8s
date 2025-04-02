const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Dashboard API!' });
});

module.exports = router;