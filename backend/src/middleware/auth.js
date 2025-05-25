const crypto = require('crypto');

// Secure token verification with constant-time comparison to prevent timing attacks
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // In a real application, you would verify the JWT token here using a proper JWT library
    // For example: const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // For this simple fix, we'll use a constant-time comparison to prevent timing attacks
    const isValid = crypto.timingSafeEqual(
      Buffer.from(token),
      Buffer.from('fake-jwt-token')
    );
    
    if (!isValid) {
      throw new Error('Invalid token');
    }
    
    // Add user info to request object
    req.user = { authenticated: true };
    next();
  } catch (error) {
    // Don't expose detailed error information
    res.status(403).json({ message: 'Access denied' });
  }
};

module.exports = { verifyToken };