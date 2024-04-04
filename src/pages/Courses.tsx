import { useState } from "react";
import { Button, Card, Row, ProgressBar, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import placeHolderPic from "../assets/default_courses.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Carousel } from "react-bootstrap";


function Courses() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false); 

  const navigateHome = () => {
    navigate("/");
  };

  const navigateToCourse = (course: string) => {
    navigate(`/${course.toLowerCase()}`);
  };

  const handleShowAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const courses = [
    { name: "Introductory", completed: 8, total: 12 },
    { name: "Intermediate", completed: 7, total: 12 },
    { name: "Advanced", completed: 10, total: 12 },
    { name: "Seminar", completed: 4, total: 8 },
    { name: "Language", completed: 18, total: 22 },
  ];

  const totalCompleted = courses.reduce(
    (acc, course) => acc + course.completed,
    0
  );
  const totalCourses = courses.reduce((acc, course) => acc + course.total, 0);
  const overallProgress = ((totalCompleted / totalCourses) * 100).toFixed(1);

  return (
    <div id="parent-container">
      <header
        style={{
          position: "fixed",
          zIndex: 1000,
          width: "100%",
          backgroundColor: "white",
        }}
      >
        <div className="top-right-element">
          <Button className="" variant="" onClick={navigateHome} size="lg">
            <span className="mini-title text-center">Credit Ledger</span>
          </Button>
        </div>
      </header>
      <div className="w-75 h-100 d-flex flex-column position-relative">
        <span className="course-page-title">Courses</span>
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-indicator"
              style={{ width: `${overallProgress}%` }}
            >
              <span className="percentage">{`${overallProgress}%`}</span>
            </div>
          </div>
        </div>
        <div
          className="d-flex align-items-center"
          style={{ marginBottom: "10px" }}
        >
          <ProgressBar
            className="flex-grow-1 custom-progress-bar"
            now={parseFloat(overallProgress)}
          />
          <FontAwesomeIcon
            icon={faCheckCircle}
            size="lg"
            style={{ marginTop: "-20px", marginLeft: "5px" }}
          />
        </div>
        <Row xs={1} md={2} lg={3}>
          {courses.map((course, index) => (
            <div className="g-col-6 g-col-md-4 mb-4" key={index}>
              <button
                className="course"
                onClick={() => navigateToCourse(course.name)}
              >
                <Card.Img
                  variant="top"
                  src={placeHolderPic}
                  className="card-image"
                />
                <Card.Body className="cardtext">
                  <Card.Title>{course.name}</Card.Title>
                  <Card.Text>
                    {course.completed}/{course.total} completed
                  </Card.Text>
                </Card.Body>
              </button>
            </div>
          ))}
        </Row>
        <div className="floating-button-container">
          <Button
            className="floating-button"
            onClick={handleShowAddModal}
            style={{
              backgroundColor: "white",
              color: "black",
              borderColor: "black",
              opacity: "0.5",
              transition: "0.2s ease-in-out",
              borderRadius: "15px",
              width: "10rem",
              height: "3.5rem",
              position: "fixed",
              bottom: "2rem",
              right: "2rem",
              zIndex: 1000,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.boxShadow =
                "0 4px 8px 0 rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.5";
              e.currentTarget.style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0)";
            }}
          >
            <FontAwesomeIcon icon={faPlus} size="lg" /> Add Category
          </Button>
        </div>
        <Modal show={showAddModal} onHide={handleCloseAddModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Category</Modal.Title>
            <span className="modal-subtitle">Add a new course category</span>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <h5>Course Group</h5>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Course Group"
                id="courseGroupInput"
              />
              <span className="modal-info">e.g/Advanced</span>
            </div>
            <div className="mb-3" style={{marginTop:'2rem'}}>
              <h5>Required Credits</h5>
              <select className="form-select" style={{width:'12rem'}} id="requiredCreditsSelect">
                <option>Select Credit</option>
                <option value="1">1 Credit</option>
                <option value="2">2 Credits</option>
                <option value="3">3 Credits</option>
                <option value="4">4 Credits</option>
                <option value="5">5 Credits</option>
                <option value="6">6 Credits</option>
              </select>
              <span className="modal-info">e.g/15 credits</span>
            </div>
            <div className="mb-3" style={{marginTop:'2rem'}}>
      <h5>Background Image</h5>
      <Carousel indicators={true}>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://via.placeholder.com/800x400?text=Image+1"
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://via.placeholder.com/800x400?text=Image+2"
            alt="Second slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://via.placeholder.com/800x400?text=Image+3"
            alt="Third slide"
          />
        </Carousel.Item>
      </Carousel>
    </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => {}} style={{backgroundColor:'black', borderColor:'black'}}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default Courses;
