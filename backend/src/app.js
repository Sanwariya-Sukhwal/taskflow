const express = require("express");
const cors = require("cors");

const boardRoutes = require("./routes/boardRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());

// IMPORTANT: This must come BEFORE routes
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "TaskFlow API is running",
  });
});

app.use("/api/boards", boardRoutes);
app.use("/api/tasks", taskRoutes);

module.exports = app;