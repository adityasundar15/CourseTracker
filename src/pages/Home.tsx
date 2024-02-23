import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const navigateProfile = () => {
    navigate("/profile");
  };

  return (
    <div id="home-page">
      <div className="top-right-element">
        <Button
          className="profile-button"
          variant="outline-dark"
          onClick={navigateProfile}
          size="lg"
        >
          Profile
        </Button>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <span className="app-title left-title text-center">Credit</span>
        <div className="text-center d-flex flex-column">
          <span className="app-title right-title">Ledger</span>
          <span className="app-desc">Track your progress with us</span>
        </div>
      </div>
    </div>
  );
}

export default Home;
