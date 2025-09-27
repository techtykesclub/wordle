const { db, admin } = require("../firebase");
const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const SYSTEM_PROMPT =
  process.env.SYSTEM_PROMPT ||
  "You are an educational assistant for a Wordle game designed for kids. Your answers should be kid-friendly, engaging, and educational. Always provide clear, concise responses.";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o";

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

  const { gameId, hintLevel } = req.body;

  try {
    const gameDoc = await db.collection("games").doc(gameId).get();
    if (!gameDoc.exists)
      return res.status(404).json({ error: "Game not found" });

    const { word, hints } = gameDoc.data();
    const prompt = `Provide a level-${hintLevel} hint for the ${
      word.length
    }-letter word "${word}" without revealing it. Level 1: broad context (e.g., "This word is a type of animal"). Level 2: more specific (e.g., "This word is an animal that lives in water"). Ensure hints are kid-friendly, random, and avoid repeating previous hints: ${hints
      .map((h) => h.hint)
      .join(", ")}. Return exactly in this format:\nHint: [HINT]`;
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      max_tokens: 50,
    });

    const responseText = response.choices[0].message.content;
    const hintMatch = responseText.match(/Hint: (.+)/);
    if (!hintMatch) {
      console.error("Invalid OpenAI hint response:", responseText);
      throw new Error("Failed to parse hint from OpenAI");
    }
    const hint = hintMatch[1].trim();
    hints.push({ level: hintLevel, hint });

    await db.collection("games").doc(gameId).update({
      hints,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ hint });
  } catch (err) {
    console.error("❌ /hint error:", err.message);
    res.status(500).json({ error: "Failed to generate hint" });
  }
};
