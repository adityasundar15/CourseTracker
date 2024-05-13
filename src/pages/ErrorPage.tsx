import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/courses"); // Navigate back to the courses page
  };

  return (
    <div className="error-page-container">
      <h1>Oops!</h1>
      <p>That category doesn't exist.</p>
      <Button onClick={handleGoBack}>Go Back</Button>
    </div>
  );
};

export default ErrorPage;
