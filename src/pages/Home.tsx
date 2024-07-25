import { useEffect, useState } from "react";
import { Button, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigateProfile = () => {
    navigate("/profile");
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        setIsLoggedIn(true);
      } else {
        // User is signed out
        setIsLoggedIn(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div id="parent-container" className="home-background">
      {/* <MouseTrail /> Add the MouseTrail component */}
      <div className="top-right-element">
        <Button
          className="profile-button"
          variant="outline-light"
          onClick={navigateProfile}
          size="lg"
        >
          {isLoggedIn ? "Profile" : "Login"}
        </Button>
      </div>
      <Stack className="d-flex justify-content-center">
        <div className="d-flex justify-content-center align-items-center">
          <span className="app-title left-title text-center noselect text-light">
            Credit
          </span>
          <div className="text-center d-flex flex-column">
            <span className="app-title right-title noselect text-light">
              Ledger
            </span>
            <span className="app-desc noselect fade-slide-in text-light">
              Track your progress with us
            </span>
          </div>
        </div>
      </Stack>
    </div>
  );
}

export default Home;
