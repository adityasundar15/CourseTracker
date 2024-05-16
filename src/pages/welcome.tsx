import { useEffect, useState } from "react";
import { Button, Stack } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();

  const navigateHome = () => {
    navigate("/");
  };

  const navigateCourses = () => {
    navigate("/courses");
  };

  const [name, setName] = useState("");

  useEffect(() => {
    const userDataJSON = localStorage.getItem("userData");
    if (userDataJSON) {
      const userData = JSON.parse(userDataJSON);
      setName(userData.name);
    } else {
      navigateHome();
    }
  }, []);

  return (
    <div id="parent-container">
      <div className="top-right-element">
        <Button className="" variant="" onClick={navigateHome} size="lg">
          <span className="mini-title text-center">Credit Ledger</span>
        </Button>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <Stack>
          <span className="welcome-title text-center outfit">
            Welcome, {name}!
          </span>
          <div className="justify-content-center d-grid mt-4">
            <Button
              className="btn-dark welcome-button"
              size="lg"
              onClick={navigateCourses}
            >
              <div className="px-5 py-1">
                <span className="get-started">Go To Courses</span>
                {"  "}
                <FaArrowRight />
              </div>
            </Button>
          </div>
        </Stack>
      </div>
    </div>
  );
}

export default Welcome;
