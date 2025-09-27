import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <header className="landing-header">
        <span className="game-genie-text">Game Genie</span>
        <button className="signup-button" onClick={() => navigate("/signup")}>
          <img src="/signup2.png" alt="singup" />
        </button>
      </header>
      <div className="boxes-container">
        <div className="box top-box">start your</div>
        <div className="box middle-box">
          Learning
          <br />
          Adventure
        </div>
        <div className="box bottom-box">
          Where learning math, reading and coding feels like play.✧˖°.
        </div>
      </div>
      <button
        className="quickplay-button"
        onClick={() => navigate("/select-level")}
      >
        <img src="/quickplay.png" alt="quickplay" />
      </button>
    </div>
  );
}

export default LandingPage;
