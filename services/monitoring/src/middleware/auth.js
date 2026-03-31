const crypto = require("crypto");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const isValid = crypto.timingSafeEqual(
      Buffer.from(token),
      Buffer.from("fake-jwt-token")
    );
    if (!isValid) throw new Error("Invalid token");
    req.user = { authenticated: true };
    next();
  } catch (error) {
    res.status(403).json({ message: "Access denied" });
  }
};

module.exports = { verifyToken };
