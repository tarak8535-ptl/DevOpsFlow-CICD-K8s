const express = require("express");
const router = express.Router();
const crypto = require("crypto");

const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000;

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const clientIP = req.ip || req.connection.remoteAddress;
  const currentTime = Date.now();
  const attemptRecord = loginAttempts.get(clientIP);

  if (
    attemptRecord &&
    attemptRecord.count >= MAX_ATTEMPTS &&
    currentTime - attemptRecord.timestamp < LOCKOUT_TIME
  ) {
    return res
      .status(429)
      .json({ message: "Too many failed login attempts. Try again later." });
  }

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (username === "admin" && password === "password") {
    loginAttempts.delete(clientIP);
    res.json({ message: "Login successful", token: "fake-jwt-token" });
  } else {
    if (!attemptRecord) {
      loginAttempts.set(clientIP, { count: 1, timestamp: currentTime });
    } else {
      loginAttempts.set(clientIP, {
        count: attemptRecord.count + 1,
        timestamp: currentTime,
      });
    }
    res.status(401).json({ message: "Invalid credentials" });
  }
});

module.exports = router;
