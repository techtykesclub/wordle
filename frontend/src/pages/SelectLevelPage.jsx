import { useNavigate } from "react-router-dom";
import GoBackImage from "../components/GoBackImage";
import SettingsImage from "../components/SettingsImage";
import "./SelectLevelPage.css";

// This page allows users to select a level before starting the game
function SelectLevelPage() {
  const navigate = useNavigate();

  return (
    <div className="select-level-page">
      <header className="select-level-header">
        <GoBackImage onClick={() => navigate("/")} />
        <SettingsImage />
      </header>
      <div className="text-and-buttons">
        <div className="select-text">Select</div>
        <div className="grade-text">Grade</div>
        <button className="beginner" onClick={() => navigate("/game")}>
          <img src="/beginner.png" alt="beginner-image" />
        </button>
        <button className="intermediate" onClick={() => navigate("/game")}>
          <img src="/intermediate.png" alt="intermediate-image" />
        </button>
        <button className="advanced" onClick={() => navigate("/game")}>
          <img src="/advanced.png" alt="advanced-image" />
        </button>
      </div>
    </div>
  );
}

export default SelectLevelPage;
