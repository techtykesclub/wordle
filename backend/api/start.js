const { OpenAI } = require("openai");
const { db, admin } = require("../firebase");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

  try {
    const SYSTEM_PROMPT =
      process.env.SYSTEM_PROMPT ||
      "You are an educational assistant for a Wordle game designed for kids. Your answers should be kid-friendly, engaging, and educational. Always provide clear, concise responses.";
    const RECENT_WORDS_LIMIT = parseInt(process.env.RECENT_WORDS_LIMIT) || 50;
    const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o";
    const MIN_WORD_LENGTH = parseInt(process.env.MIN_WORD_LENGTH) || 4;
    const MAX_WORD_LENGTH = parseInt(process.env.MAX_WORD_LENGTH) || 5;
    const TARGET_AGE_MIN = parseInt(process.env.TARGET_AGE_MIN) || 8;
    const TARGET_AGE_MAX = parseInt(process.env.TARGET_AGE_MAX) || 13;
    const WORD_BLOCKLIST = process.env.WORD_BLOCKLIST
      ? process.env.WORD_BLOCKLIST.split(",").map((word) => word.trim())
      : ["death", "crime", "blood", "ghost", "scary"];

    const blocklist = WORD_BLOCKLIST;
    const wordLength = Math.random() < 0.5 ? MIN_WORD_LENGTH : MAX_WORD_LENGTH;

    const recentWordsSnapshot = await db
      .collection("recentWords")
      .orderBy("createdAt", "desc")
      .limit(RECENT_WORDS_LIMIT)
      .get();
    const recentWords = recentWordsSnapshot.docs.map((doc) =>
      doc.data().word.toUpperCase()
    );

    const wordPrompt = `Generate a ${wordLength}-letter English word suitable for kids aged ${TARGET_AGE_MIN}-${TARGET_AGE_MAX}, avoiding words in this blocklist: ${blocklist.join(
      ", "
    )}. Ensure the word is different from these recently used words: ${
      recentWords.join(", ") || "none"
    }. Return exactly in this format:\nWord: [WORD]\nDo not include extra text.`;

    const wordResponse = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: wordPrompt },
      ],
      max_tokens: 100,
    });

    const wordText = wordResponse.choices[0].message.content;
    const wordMatch = wordText.match(/Word: ["']?([A-Za-z]{4,5})["']?/i);
    if (!wordMatch) throw new Error("Failed to parse word from OpenAI");
    const word = wordMatch[1].toUpperCase();

    const explainPrompt = `Provide a kid-friendly definition and example sentence for the word "${word}". Return exactly in this format:\nDefinition: [DEFINITION]\nExample: [SENTENCE]\nDo not include extra text.`;
    const explainResponse = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: explainPrompt },
      ],
      max_tokens: 100,
    });

    const explanationText = explainResponse.choices[0].message.content;
    const definitionMatch = explanationText.match(/Definition: (.+)/);
    const exampleMatch = explanationText.match(/Example: (.+)/);
    if (!definitionMatch || !exampleMatch)
      throw new Error("Failed to parse explanation from OpenAI");
    const explanation = `${definitionMatch[1].trim()}\n${exampleMatch[1].trim()}`;

    const gameId = db.collection("games").doc().id;
    await db.collection("games").doc(gameId).set({
      gameId,
      word,
      guesses: [],
      hints: [],
      status: "active",
      explanation,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await db.collection("recentWords").add({
      word,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    if (recentWordsSnapshot.size >= RECENT_WORDS_LIMIT) {
      const oldestWord = recentWordsSnapshot.docs[recentWordsSnapshot.size - 1];
      await db.collection("recentWords").doc(oldestWord.id).delete();
    }

    res.json({ gameId, wordLength, explanation, word });
  } catch (err) {
    console.error("❌ /start error:", err.code, err.message);
    res.status(500).json({ error: "Failed to start game" });
  }
};
