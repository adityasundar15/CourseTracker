import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function PopUp() {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Welcome to Course Tracker</Modal.Title>
        </Modal.Header>
        <Modal.Body>Track your course credits and progress</Modal.Body>
        <Modal.Footer>
          <Button variant="primary">Create Account</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PopUp;
