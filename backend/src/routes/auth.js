const express = require("express");
const router = express.Router();

const crypto = require('crypto');

// Rate limiting for login attempts
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  
  // Check if IP is locked out
  const clientIP = req.ip || req.connection.remoteAddress;
  const currentTime = Date.now();
  const attemptRecord = loginAttempts.get(clientIP);
  
  if (attemptRecord && attemptRecord.count >= MAX_ATTEMPTS && currentTime - attemptRecord.timestamp < LOCKOUT_TIME) {
    return res.status(429).json({ 
      message: "Too many failed login attempts. Please try again later." 
    });
  }
  
  // Simple validation
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  
  // In a real app, you would use a secure password hashing library like bcrypt
  // and store hashed passwords in a database
  if (username === "admin" && password === "password") {
    // Reset login attempts on successful login
    loginAttempts.delete(clientIP);
    
    // In a real app, use a proper JWT library with a secure secret
    res.json({ message: "Login successful", token: "fake-jwt-token" });
  } else {
    // Track failed login attempts
    if (!attemptRecord) {
      loginAttempts.set(clientIP, { count: 1, timestamp: currentTime });
    } else {
      loginAttempts.set(clientIP, { 
        count: attemptRecord.count + 1, 
        timestamp: currentTime 
      });
    }
    
    res.status(401).json({ message: "Invalid credentials" });
  }
});

module.exports = router;
