import { Button, Card, Row, ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import placeHolderPic from "../assets/default_courses.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

function Courses() {
  const navigate = useNavigate();

  const navigateHome = () => {
    navigate("/");
  };

  const navigateToCourse = (course: string) => {
    navigate(`/${course.toLowerCase()}`);
  };

  const courses = [
    { name: "Introductory", completed: 8, total: 12 },
    { name: "Intermediate", completed: 7, total: 12 },
    { name: "Advanced", completed: 10, total: 12 },
    { name: "Seminar", completed: 4, total: 8 },
    { name: "Language", completed: 18, total: 22 },
    { name: "Unititled", completed: 0, total: 0 },
  ];

  // Calculate overall progress
  const totalCompleted = courses.reduce(
    (acc, course) => acc + course.completed,
    0
  );
  const totalCourses = courses.reduce((acc, course) => acc + course.total, 0);
  const overallProgress = ((totalCompleted / totalCourses) * 100).toFixed(1);

  return (
    <div id="parent-container">
      <div className="top-right-element">
        <Button className="" variant="" onClick={navigateHome} size="lg">
          <span className="mini-title text-center">Credit Ledger</span>
        </Button>
      </div>
      <div className="w-75 h-100 d-flex flex-column">
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
            color="green"
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
          <Card.Body className="cardtext">
            <Card.Title>Untitled</Card.Title>
            <Card.Text>0/0 completed</Card.Text>
          </Card.Body>
        </Row>
      </div>
    </div>
  );
}

export default Courses;
