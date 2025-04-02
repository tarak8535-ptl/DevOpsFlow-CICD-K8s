const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const logsRoutes = require('./routes/logs');
const monitoringRoutes = require('./routes/monitoring');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/logs', logsRoutes);
app.use('/monitoring', monitoringRoutes);

app.listen(3000, () => console.log('Backend running on port 3000'));
