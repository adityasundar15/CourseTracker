import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../App.css";
import { useNavigate } from "react-router-dom";

function PopUp() {
  const [show, setShow] = useState(false); // Initially hide the modal
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (!userData) {
      // Show the modal only if no userData is stored in localStorage
      setShow(true);
    }
  }, []); // Run this effect only once on component mount

  const handleClose = () => setShow(false);

  const handleCreateProfile = () => {
    navigate("/profile");
    setShow(false); // Hide the modal
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        dialogClassName="modal-init"
        centered
        size="lg"
      >
        <Modal.Body>
          <div className="container py-5 align-content-center justify-content-center">
            <h1 className="text-center">Welcome to Course Tracker</h1>
            <p className="text-center">
              Track your course credits and progress
            </p>
            <div className="d-flex justify-content-center p-1">
              <Button variant="dark" size="lg" onClick={handleCreateProfile}>
                Create Profile
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PopUp;
