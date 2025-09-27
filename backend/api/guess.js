const { db, admin } = require("../firebase");
require("dotenv").config();

const MAX_GUESSES = parseInt(process.env.MAX_GUESSES) || 6;

const evaluateGuess = (guess, target) => {
  const feedback = Array(target.length).fill("incorrect");
  const targetLetters = target.split("");
  const guessLetters = guess.split("");

  guessLetters.forEach((letter, index) => {
    if (letter === targetLetters[index]) {
      feedback[index] = "correct";
      targetLetters[index] = null;
    }
  });

  guessLetters.forEach((letter, index) => {
    if (feedback[index] === "incorrect") {
      const targetIndex = targetLetters.indexOf(letter);
      if (targetIndex !== -1) {
        feedback[index] = "present";
        targetLetters[targetIndex] = null;
      }
    }
  });

  return feedback;
};

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

  const { gameId, guess } = req.body;

  try {
    const gameDoc = await db.collection("games").doc(gameId).get();
    if (!gameDoc.exists)
      return res.status(404).json({ error: "Game not found" });

    const { word, guesses } = gameDoc.data();
    if (guess.length !== word.length)
      return res.status(400).json({ error: "Invalid guess length" });

    const feedback = evaluateGuess(guess, word);
    guesses.push({ guess, feedback });

    const status =
      guess === word
        ? "won"
        : guesses.length >= MAX_GUESSES
        ? "lost"
        : "active";
    const guessCount = guesses.length;

    await db.collection("games").doc(gameId).update({
      guesses,
      status,
      guessCount,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ feedback, status, guessCount });
  } catch (err) {
    console.error("❌ /guess error:", err.message);
    res.status(500).json({ error: "Failed to process guess" });
  }
};
