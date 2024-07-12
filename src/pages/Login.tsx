import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const navigateHome = () => {
    navigate("/");
  };

  return (
    <div id="parent-container">
      <div className="top-right-element">
        <Button className="" variant="" onClick={navigateHome} size="lg">
          <span className="mini-title text-center">Credit Ledger</span>
        </Button>
      </div>
      <div className="d-flex justify-content-center align-items-center"></div>
    </div>
  );
}

export default Login;
