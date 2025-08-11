const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const winston = require("winston");
const expressWinston = require("express-winston");
const promClient = require("prom-client");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const logsRoutes = require("./routes/logs");
const monitoringRoutes = require("./routes/monitoring");
const terraformRoutes = require("./routes/terraform");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Setup Prometheus metrics collection
const collectDefaultMetrics = promClient.collectDefaultMetrics;
const Registry = promClient.Registry;
const register = new Registry();
collectDefaultMetrics({ register });

// HTTP request counter
const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
});

// Request duration histogram
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
});

// Middleware with enhanced security
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Enhanced security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'"],
    },
  },
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: 'same-origin' }
}));

app.use(compression()); // Compress responses
app.use(express.json({ limit: '100kb' })); // Limit payload size

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Request logging
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
}));

// Metrics middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestsTotal.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status: res.statusCode
    });
    httpRequestDurationMicroseconds.observe(
      {
        method: req.method,
        route: req.route ? req.route.path : req.path,
        status: res.statusCode
      },
      duration / 1000
    );
  });
  
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/monitoring", monitoringRoutes);
app.use("/api/terraform", terraformRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

// Debug endpoint to test services without auth
app.get("/debug/services", (req, res) => {
  const services = [
    { id: 'ec2', name: 'EC2 Instance', category: 'Compute' },
    { id: 'rds', name: 'RDS Database', category: 'Database' },
    { id: 's3', name: 'S3 Bucket', category: 'Storage' },
    { id: 'vpc', name: 'VPC Network', category: 'Networking' },
    { id: 'lambda', name: 'Lambda Function', category: 'Compute' },
    { id: 'iam_role', name: 'IAM Role', category: 'Security' },
    { id: 'iam_policy', name: 'IAM Policy', category: 'Security' },
    { id: 'iam_user', name: 'IAM User', category: 'Security' },
    { id: 'iam_group', name: 'IAM Group', category: 'Security' },
    { id: 'cloudwatch', name: 'CloudWatch', category: 'Monitoring' },
    { id: 'elb', name: 'Load Balancer', category: 'Networking' }
  ];
  res.json({ services });
});

// Metrics endpoint for Prometheus with authentication
const { verifyToken } = require("./middleware/auth");
app.get("/metrics", verifyToken, async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("CloudTarkk InfraGen Backend is Running!");
});

// Error logging
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  )
}));

// Global error handler with improved security
app.use((err, req, res, next) => {
  // Log error details for debugging but don't expose to client
  console.error(`[${new Date().toISOString()}] Error: ${err.message}`);
  console.error(`Stack: ${err.stack}`);
  
  // Send sanitized response to client
  res.status(500).json({
    error: "Internal Server Error",
    requestId: require('crypto').randomUUID(), // Add request ID for tracking
    message: 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});