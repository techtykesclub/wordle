import { useState, useEffect } from "react";
import "./Unscramble.css";

function Unscramble({ gameId, targetWord, onResult }) {
  const [scrambledWords, setScrambledWords] = useState([]);
  const [userWords, setUserWords] = useState([[], [], []]); // 3 lines, max 3 words each
  const [correctSentence, setCorrectSentence] = useState("");
  const [tries, setTries] = useState(0);
  const [selectedWordIndex, setSelectedWordIndex] = useState(null);
  const [originalIndices, setOriginalIndices] = useState([]); // Track original positions

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/openai/unscramble`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        const words = data.scrambled.split(" ");
        setScrambledWords(words);
        setCorrectSentence(data.sentence);
        setOriginalIndices(words.map((_, i) => i)); // Store original indices
      })
      .catch((err) => console.error("Error fetching sentence:", err));
  }, [gameId]);

  const handleWordClick = (index) => {
    if (selectedWordIndex === index) {
      setScrambledWords((prev) => [...prev, scrambledWords[index]]);
      setScrambledWords((prev) => prev.filter((_, i) => i !== index));
      setSelectedWordIndex(null);
      return;
    }

    let lineIndex = 0;
    let posIndex = 0;
    for (let i = 0; i < userWords.length; i++) {
      if (userWords[i].length < 3) {
        lineIndex = i;
        posIndex = userWords[i].length;
        break;
      }
    }

    if (posIndex < 3) {
      setUserWords((prev) => {
        const newWords = [...prev];
        newWords[lineIndex] = [...newWords[lineIndex], scrambledWords[index]];
        return newWords;
      });
      setScrambledWords((prev) => prev.filter((_, i) => i !== index));
      setSelectedWordIndex(null);
    }
  };

  const handlePlacedWordClick = (lineIndex, posIndex) => {
    const word = userWords[lineIndex][posIndex];
    const originalIndex = originalIndices.findIndex(
      (_, i) => scrambledWords[i] === word
    );
    setScrambledWords((prev) => {
      const newWords = [...prev];
      newWords.splice(originalIndex, 0, word);
      return newWords;
    });
    setUserWords((prev) => {
      const newWords = [...prev];
      newWords[lineIndex] = newWords[lineIndex].filter(
        (_, i) => i !== posIndex
      );
      return newWords;
    });
  };

  const handleCheck = () => {
    const userSentence = userWords.flat().join(" ");
    const isCorrect = userSentence === correctSentence;
    setTries(tries + 1);
    onResult(isCorrect, tries + 1, correctSentence);
    if (!isCorrect && tries < 2) {
      setUserWords([[], [], []]);
      setScrambledWords(
        correctSentence.split(" ").sort(() => Math.random() - 0.5)
      );
    }
  };

  const getCumulativeWidth = (lineIndex, posIndex, words) => {
    let width = 40;
    for (let i = 0; i < posIndex; i++) {
      const word = words[lineIndex][i];
      width += word.length * 10 + 20 + 20; // Word width + padding/border + 10px booster
    }
    return width;
  };

  return (
    <div className="unscramble-comp">
      <img
        src="/unscramble-image.png"
        alt="unscramble"
        className="unscramble-img"
      />
      <div className="word-bank">
        <img src="/word-bank.png" alt="word-bank" className="word-bank-img" />
        <div className="word-bank-words">
          {scrambledWords.map((word, index) => (
            <span
              key={index}
              className="word"
              onClick={() => handleWordClick(index)}
              style={{ "--word-width": `${word.length * 10 + 20}px` }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
      <div className="lines-container">
        {userWords.map((line, lineIndex) => (
          <div key={lineIndex} className={`line line-${lineIndex + 1}`}>
            {line.map((word, index) => (
              <span
                key={index}
                className="word placed"
                style={{
                  "--word-width": `${word.length * 10 + 20}px`,
                  "--cumulative-width": `${getCumulativeWidth(
                    lineIndex,
                    index,
                    userWords
                  )}px`,
                  "--prev-width-1":
                    index > 0
                      ? `${userWords[lineIndex][index - 1].length * 10 + 20}px`
                      : "0px",
                  "--prev-width-2":
                    index > 1
                      ? `${userWords[lineIndex][index - 2].length * 10 + 20}px`
                      : "0px",
                }}
                onClick={() => handlePlacedWordClick(lineIndex, index)}
              >
                {word}
              </span>
            ))}
          </div>
        ))}
      </div>
      <button className="check-button" onClick={handleCheck}>
        <img src="/check.png" alt="" />
      </button>
    </div>
  );
}

export default Unscramble;
