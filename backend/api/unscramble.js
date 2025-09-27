const { db, admin } = require("../firebase");
const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const SYSTEM_PROMPT =
  process.env.SYSTEM_PROMPT ||
  "You are an educational assistant for a Wordle game designed for kids. Your answers should be kid-friendly, engaging, and educational. Always provide clear, concise responses.";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o";
const TARGET_AGE_MIN = parseInt(process.env.TARGET_AGE_MIN) || 8;
const TARGET_AGE_MAX = parseInt(process.env.TARGET_AGE_MAX) || 13;
const SENTENCE_MIN_WORDS = parseInt(process.env.SENTENCE_MIN_WORDS) || 5;
const SENTENCE_MAX_WORDS = parseInt(process.env.SENTENCE_MAX_WORDS) || 7;

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
    const gameDoc = await db.collection("games").doc(gameId).get();
    if (!gameDoc.exists)
      return res.status(404).json({ error: "Game not found" });

    const { word, explanation } = gameDoc.data();
    const [, example] = explanation.split("\n");
    const sentencePrompt = `Generate a kid-friendly sentence (different from "${example}") using the word "${word}" for kids aged ${TARGET_AGE_MIN}-${TARGET_AGE_MAX}, with exactly ${SENTENCE_MIN_WORDS} to ${SENTENCE_MAX_WORDS} words. Return exactly in this format:\nSentence: [SENTENCE]\nDo not include extra text.`;
    const sentenceResponse = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: sentencePrompt },
      ],
      max_tokens: 100,
    });

    const sentenceText = sentenceResponse.choices[0].message.content;
    const sentenceMatch = sentenceText.match(/Sentence: (.+)/);
    if (!sentenceMatch) throw new Error("Failed to parse sentence from OpenAI");
    const sentence = sentenceMatch[1].trim();
    const words = sentence.split(" ");
    if (words.length < SENTENCE_MIN_WORDS || words.length > SENTENCE_MAX_WORDS)
      throw new Error(
        `Sentence must be ${SENTENCE_MIN_WORDS}-${SENTENCE_MAX_WORDS} words`
      );
    const scrambled = words.sort(() => Math.random() - 0.5).join(" ");

    res.json({ sentence, scrambled });
  } catch (err) {
    console.error("❌ /unscramble error:", err.message);
    res.status(500).json({ error: "Failed to generate sentence" });
  }
};
