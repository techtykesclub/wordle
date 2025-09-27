const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const openaiRoutes = require("../routes/openaiRoutes");
require("dotenv").config();

const app = express();

// Environment-based CORS origins
const allowed = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
  : [
      "http://localhost:5173", // Vite dev server
      "http://localhost:5174", // Alternative Vite port
      "http://localhost:3000", // Alternative local port
      "https://abdulrahman1121.github.io", // GitHub Pages
      "https://wordle-rose-eta.vercel.app", // Frontend Vercel deployment
      process.env.FRONTEND_URL, // Production frontend URL
    ].filter(Boolean); // Remove undefined values

// Simplified CORS - allow all origins for debugging
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept, Origin"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request");
    res.status(200).end();
    return;
  }

  next();
});

app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

app.get("/health", (_req, res) => res.json({ ok: true }));

// Test endpoint for debugging
app.get("/test", (req, res) => {
  res.json({
    message: "Test endpoint working",
    method: req.method,
    url: req.url,
    headers: req.headers,
  });
});

app.post("/test-post", (req, res) => {
  res.json({
    message: "POST test endpoint working",
    body: req.body,
    method: req.method,
    url: req.url,
  });
});

app.use("/openai", openaiRoutes);

// Catch all other routes
app.use((req, res) => {
  console.log(`Unmatched route: ${req.method} ${req.url}`);
  res.status(404).json({ error: "Route not found" });
});

// ✅ export handler for Vercel
const handler = serverless(app);
module.exports = handler;
module.exports.default = handler;
