const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const logsRoutes = require("./routes/logs");
const monitoringRoutes = require("./routes/monitoring");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/monitoring", monitoringRoutes);

app.get("/", (req, res) => {
    res.send("DevOps Flow Backend is Running!");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
