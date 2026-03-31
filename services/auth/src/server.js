const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: process.env.ALLOWED_ORIGINS || "*" }));
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "100kb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", service: "auth" });
});

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
