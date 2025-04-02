const express = require('express');
const router = express.Router();

const logs = [
  { id: 1, type: 'Blue-Green', status: 'Success', timestamp: '2025-04-02' },
  { id: 2, type: 'Canary', status: 'Rolling', timestamp: '2025-04-02' }
];

router.get('/', (req, res) => {
  res.json(logs);
});

module.exports = router;
