import { useNavigate } from "react-router-dom";

// Don't need a css file, use same styling from SelectLevelPage.css

function SettingsImage() {
  const navigate = useNavigate();

  return (
    <button className="settings-button" onClick={() => navigate("/signup")}>
      <img src="/settings.png" alt="Settings" className="settings-image" />
    </button>
  );
}

export default SettingsImage;
