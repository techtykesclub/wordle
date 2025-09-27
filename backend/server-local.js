const express = require("express");
const cors = require("cors");
const openaiRoutes = require("./routes/openaiRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

// CORS configuration for local development
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Vite dev server
      "http://localhost:3000", // Alternative local port
    ],
    credentials: true,
  })
);

app.use(express.json());
app.get("/health", (_req, res) =>
  res.json({ ok: true, message: "Local server running!" })
);
app.use("/openai", openaiRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
});
