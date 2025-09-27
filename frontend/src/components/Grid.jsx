import { useState, useEffect } from "react";
import Tile from "./Tile.jsx";
import "./Grid.css";

function Grid({
  gameId,
  setGameId,
  setGameStatus,
  setHint,
  setExplanation,
  wordLength,
  onKeyPress,
  onGoHome,
  resetKeyBoard,
  setKeyStatuses,
  explanation,
  gridKeyPressRef,
  setGameMessage,
  setGuessCount,
  targetWord,
  setIsActualHint,
}) {
  const [grid, setGrid] = useState(() => {
    return wordLength
      ? Array(6)
          .fill()
          .map(() => Array(wordLength).fill({ letter: "", status: "empty" }))
      : [];
  });
  const [currentRow, setCurrentRow] = useState(0);
  const [currentGuess, setCurrentGuess] = useState("");
  const [localGameStatus, setLocalGameStatus] = useState("active");

  const encouragingPhrases = [
    "You're doing great, keep it up!",
    "Awesome effort, try again!",
    "You're so close, give it another go!",
    "Keep guessing, you're learning fast!",
    "Super try, let's get that word!",
    "You're rocking it, one more guess!",
    "Great job, stay focused!",
    "You're a word wizard, keep going!",
    "Fantastic attempt, try another!",
    "You're getting better with every guess!",
  ];

  useEffect(() => {
    if (wordLength) {
      setGrid(
        Array(6)
          .fill()
          .map(() => Array(wordLength).fill({ letter: "", status: "empty" }))
      );
    }
  }, [wordLength]);

  const handleKeyPress = (key, status) => {
    if (localGameStatus !== "active") return;
    if (key === "BACKSPACE") {
      setCurrentGuess((prev) => prev.slice(0, -1));
      setGrid((prev) => {
        const newGrid = [...prev];
        newGrid[currentRow] = [...newGrid[currentRow]];
        const lastFilledIndex = prev[currentRow].findLastIndex(
          (t) => t.letter !== ""
        );
        newGrid[currentRow][lastFilledIndex >= 0 ? lastFilledIndex : 0] = {
          letter: "",
          status: "empty",
        };
        return newGrid;
      });
      onKeyPress(key, "empty");
      return;
    }
    if (key === "ENTER") {
      handleGuess();
      return;
    }
    if (currentGuess.length < wordLength && /^[A-Za-z]$/.test(key)) {
      setCurrentGuess((prev) => prev + key.toUpperCase());
      setGrid((prev) => {
        const newGrid = [...prev];
        newGrid[currentRow] = [...newGrid[currentRow]];
        newGrid[currentRow][currentGuess.length] = {
          letter: key.toUpperCase(),
          status: "empty",
        };
        return newGrid;
      });
      onKeyPress(key.toUpperCase(), "empty");
    }
  };

  useEffect(() => {
    gridKeyPressRef.current = handleKeyPress;
    return () => {
      gridKeyPressRef.current = null;
    };
  }, [gridKeyPressRef, handleKeyPress]);

  const handleGuess = async () => {
    setGuessCount(currentRow + 1);
    if (currentGuess.length !== wordLength || localGameStatus !== "active")
      return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/openai/guess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, guess: currentGuess }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const newGrid = [...grid];
      newGrid[currentRow] = currentGuess.split("").map((letter, i) => ({
        letter,
        status: data.feedback[i],
      }));
      setGrid(newGrid);
      setCurrentRow(currentRow + 1);
      setCurrentGuess("");
      setLocalGameStatus(data.status);
      setGameStatus(data.status);

      currentGuess.split("").forEach((letter, i) => {
        onKeyPress(letter.toUpperCase(), data.feedback[i]);
      });

      if (data.status !== "active") {
        setGameMessage(
          data.status === "won"
            ? `🎉 Congratulations! You guessed "${targetWord}"!`
            : `Nice try! The word was "${targetWord}".`
        );
        setIsActualHint(false);
      } else {
        if (
          currentRow === 0 ||
          currentRow === 1 ||
          currentRow === 3 ||
          currentRow === 5
        ) {
          const randomPhrase =
            encouragingPhrases[
              Math.floor(Math.random() * encouragingPhrases.length)
            ];
          setHint(randomPhrase);
          setIsActualHint(false);
        } else if (currentRow === 2) {
          const hintLevel = 1;
          const hintRes = await fetch(
            `${import.meta.env.VITE_API_URL}/openai/hint`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ gameId, hintLevel }),
            }
          );
          const hintData = await hintRes.json();
          setHint(hintData.hint);
          setIsActualHint(true);
        } else if (currentRow === 4) {
          const hintLevel = 2;
          const hintRes = await fetch(
            `${import.meta.env.VITE_API_URL}/openai/hint`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ gameId, hintLevel }),
            }
          );
          const hintData = await hintRes.json();
          setHint(hintData.hint);
          setIsActualHint(true);
        }
      }
    } catch (err) {
      console.error("Error submitting guess:", err);
    }
  };

  const resetGame = () => {
    fetch(`${import.meta.env.VITE_API_URL}/openai/start`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        setGrid(
          Array(6)
            .fill()
            .map(() =>
              Array(data.wordLength).fill({ letter: "", status: "empty" })
            )
        );
        setCurrentRow(0);
        setCurrentGuess("");
        setLocalGameStatus("active");
        setHint("");
        setGameStatus("active");
        setExplanation("");
        setGameMessage("");
        setGameId(data.gameId);
        setKeyStatuses({});
        resetKeyBoard();
        setGuessCount(0);
        setIsActualHint(false);
      })
      .catch((err) => console.error("Error starting new game:", err));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Backspace") {
        handleKeyPress("BACKSPACE", "empty");
      } else if (e.key === "Enter") {
        handleKeyPress("ENTER", "empty");
      } else if (/^[A-Za-z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase(), "empty");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  return (
    <div className={`grid grid-cols-${wordLength}`}>
      {grid.map((row, rowIndex) =>
        row.map((tile, colIndex) => (
          <Tile
            key={`${rowIndex}-${colIndex}`}
            letter={tile.letter}
            status={tile.status}
          />
        ))
      )}
    </div>
  );
}

export default Grid;
