import { useNavigate } from "react-router-dom";

// Don't need a css file, use same styling from SelectLevelPage.css
function GoBackImage({ onClick }) {
  return (
    <button className="go-back-button" onClick={onClick}>
      <img src="/goback.png" alt="go-back-img" />
    </button>
  );
}

export default GoBackImage;
