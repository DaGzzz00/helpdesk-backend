const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test route
app.get("/", (req, res) => {
  res.send("✅ Helpdesk backend is running on Render 🚀");
});

// Example API route
app.post("/api/request", (req, res) => {
  const data = req.body;
  console.log("New request received:", data);
  res.json({ message: "Request received successfully", data });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
