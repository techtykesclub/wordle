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

app.use(
  cors({
    origin: (origin, cb) => cb(null, !origin || allowed.includes(origin)),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Additional CORS headers as fallback
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowed.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With"
    );
  }

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  next();
});

app.use(express.json());
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/openai", openaiRoutes);

// ✅ export a handler instead of listening on a port
module.exports = serverless(app);
