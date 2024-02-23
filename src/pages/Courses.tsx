import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Courses() {
  const navigate = useNavigate();

  const navigateHome = () => {
    navigate("/");
  };

  return (
    <div id="home-page">
      <div className="top-right-element">
        <Button className="" variant="" onClick={navigateHome} size="lg">
          <span className="mini-title text-center">Credit Ledger</span>
        </Button>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <span className="app-title left-title text-center">Courses</span>
        <span className="app-title right-title">Page</span>
      </div>
    </div>
  );
}

export default Courses;
