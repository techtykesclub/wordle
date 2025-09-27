const { db, admin } = require("../firebase");

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { gameId } = req.body;

  try {
    await db.collection("games").doc(gameId).set({
      gameId,
      word: "",
      guesses: [],
      hints: [],
      status: "active",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.json({ gameId });
  } catch (err) {
    console.error("❌ /reset error:", err.message);
    res.status(500).json({ error: "Failed to reset game" });
  }
};
