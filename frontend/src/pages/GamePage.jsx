import { useState, useEffect } from "react";
import Grid from "../components/Grid.jsx";
import Keyboard from "../components/Keyboard.jsx";
import GoBackImage from "../components/GoBackImage.jsx";
import SettingsImage from "../components/SettingsImage.jsx";
import { useNavigate } from "react-router-dom";
// wherever you call the API
import { API_BASE } from "../config.js";

import "./GamePage.css";

function GamePage({
  onKeyPress,
  keyStatuses,
  resetKeyStatuses,
  gameId,
  setGameId,
  setGameStatus,
  setHint,
  setExplanation,
  wordLength,
  setWordLength,
  gameStatus,
  setKeyStatuses,
  gridKeyPressRef,
}) {
  const navigate = useNavigate();
  const [hint, setLocalHint] = useState("");
  const [explanation, setLocalExplanation] = useState("");
  const [gameMessage, setGameMessage] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Welcome to Game Genie, guess a word and I will help u get it right. U got this!"
  );
  const [isGameReady, setIsGameReady] = useState(false);
  const [guessCount, setGuessCount] = useState(0);
  const [targetWord, setTargetWord] = useState("");
  const [isActualHint, setIsActualHint] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/openai/start`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        setGameId(data.gameId);
        setWordLength(data.wordLength);
        setGameStatus("active");
        resetKeyStatuses();
        setLocalExplanation(data.explanation);
        setExplanation(data.explanation);
        setGameMessage("");
        setLocalHint("");
        setWelcomeMessage(
          "Welcome to Game Genie, give us your best guess! I will be here to help you along the way!!"
        );
        setIsGameReady(true);
        setGuessCount(0);
        setTargetWord(data.word);
        setIsActualHint(false);
      })
      .catch((err) => console.error("Error starting game:", err));
  }, []);

  const handleGoSelectLevel = () => {
    resetKeyStatuses();
    navigate("/select-level");
  };

  const handleGoHome = () => {
    resetKeyStatuses();
    navigate("/");
  };

  if (!isGameReady) {
    return (
      <div className="loading-container">
        <h1 className="loading-text">Game Loading...</h1>
      </div>
    );
  }

  const [definition, example] = explanation
    ? explanation.split("\n")
    : ["", ""];

  return (
    <div className="game-page">
      <header className="game-page-header">
        <GoBackImage onClick={handleGoSelectLevel} />
        <SettingsImage />
      </header>
      <div className="game-container">
        <Grid
          onKeyPress={onKeyPress}
          onGoHome={handleGoHome}
          resetKeyBoard={resetKeyStatuses}
          gameId={gameId}
          setGameId={setGameId}
          setGameStatus={setGameStatus}
          setHint={setLocalHint}
          setExplanation={setLocalExplanation}
          wordLength={wordLength}
          setKeyStatuses={setKeyStatuses}
          explanation={explanation}
          gridKeyPressRef={gridKeyPressRef}
          setGameMessage={setGameMessage}
          setGuessCount={setGuessCount}
          targetWord={targetWord}
          setIsActualHint={setIsActualHint}
        />
        <div className="genie-container">
          <img src="/genie3.png" alt="genie" className="genie-image" />
          <div className="text-box">
            {gameStatus !== "active" ? (
              <div className="genie-text2 explanation-visible">
                <p className="game-message">{gameMessage || "Loading"}</p>
                <p className="genie-definition">
                  <strong>Definition:</strong> {definition || "Loading"}
                </p>
                <p className="genie-example">
                  <strong>Example:</strong> {example || "Loading"}
                </p>
                <button
                  className="next-button"
                  onClick={() => {
                    navigate("/rewards", {
                      state: {
                        guessCount,
                        points: gameMessage.startsWith("Nice")
                          ? 0
                          : guessCount <= 3
                          ? 30
                          : guessCount <= 5
                          ? 20
                          : 10,
                        gameId,
                        targetWord,
                      },
                    });
                  }}
                >
                  <img
                    src="/next-button.png"
                    alt="next"
                    className="next-image"
                  />
                </button>
              </div>
            ) : (
              <>
                <span className="genie-text">
                  {hint ? (
                    <div className="hint-container">
                      <>
                        {isActualHint ? (
                          <span className="hint-prefix">Here's a Hint...</span>
                        ) : (
                          <span className="encourage-prefix">Keep Going!</span>
                        )}
                        <span>{hint}</span>
                      </>
                    </div>
                  ) : (
                    <div className="welcome-container">
                      <span className="welcome-prefix">Welcome</span>
                      <span>{welcomeMessage}</span>
                    </div>
                  )}
                </span>
                <div className="explanation-hidden">
                  <p className="game-message">{gameMessage || "Game over!"}</p>
                  <p className="genie-definition">
                    <strong>Definition:</strong>{" "}
                    {definition || "No definition available"}
                  </p>
                  <p className="genie-example">
                    <strong>Example:</strong>{" "}
                    {example || "No example available"}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="keyboard-container">
        <Keyboard keyStatuses={keyStatuses} onKeyPress={onKeyPress} />
      </div>
    </div>
  );
}

export default GamePage;
