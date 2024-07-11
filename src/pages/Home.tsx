import { Button, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const navigateProfile = () => {
    navigate("/profile");
  };

  return (
    <div id="parent-container" className="home-background">
      {/* <MouseTrail /> Add the MouseTrail component */}
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
      <Stack className="d-flex justify-content-center">
        <div className="d-flex justify-content-center align-items-center">
          <span className="app-title left-title text-center noselect">
            Credit
          </span>
          <div className="text-center d-flex flex-column ">
            <span className="app-title right-title noselect">Ledger</span>
            <span className="app-desc noselect fade-slide-in">
              Track your progress with us
            </span>
          </div>
        </div>
      </Stack>
    </div>
  );
}

export default Home;
