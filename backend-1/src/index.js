const express = require('express');
const { verifyToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Use the verifyToken middleware for protected routes
app.use('/api/protected', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Access granted', user: req.user });
});

// Sample public route
app.get('/api/public', (req, res) => {
  res.status(200).json({ message: 'This is a public endpoint' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});