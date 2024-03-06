import { Button, Card, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import placeHolderPic from "../assets/default_courses.png";

function Courses() {
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
      <div className="w-75 h-100 d-flex flex-column">
        <span className="course-page-title">Courses</span>
        <Row xs={1} md={2} lg={3}>
          <div className="g-col-6 g-col-md-4 mb-4">
            <Card className="course">
              <Card.Img
                variant="top"
                src={placeHolderPic}
                className="card-image"
              />
              <Card.Body>
                <Card.Title>Introductory</Card.Title>
                <Card.Text>8/12 completed</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="g-col-6 g-col-md-4 mb-4">
            <Card className="course">
              <Card.Img
                variant="top"
                src={placeHolderPic}
                className="card-image"
              />
              <Card.Body>
                <Card.Title>Intermediate</Card.Title>
                <Card.Text>7/12 completed</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="g-col-6 g-col-md-4 mb-4">
            <Card className="course">
              <Card.Img
                variant="top"
                src={placeHolderPic}
                className="card-image"
              />
              <Card.Body>
                <Card.Title>Advanced</Card.Title>
                <Card.Text>10/12 completed</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="g-col-6 g-col-md-4 mb-4">
            <Card className="course">
              <Card.Img
                variant="top"
                src={placeHolderPic}
                className="card-image"
              />
              <Card.Body>
                <Card.Title>Seminar</Card.Title>
                <Card.Text>4/8 completed</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="g-col-6 g-col-md-4 mb-4">
            <Card className="course">
              <Card.Img
                variant="top"
                src={placeHolderPic}
                className="card-image"
              />
              <Card.Body>
                <Card.Title>Language</Card.Title>
                <Card.Text>18/22 completed</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="g-col-6 g-col-md-4 mb-4">
            <Card className="course">
              <Card.Img
                variant="top"
                src={placeHolderPic}
                className="card-image"
              />
              <Card.Body>
                <Card.Title>Untitled</Card.Title>
                <Card.Text>0/0 completed</Card.Text>
              </Card.Body>
            </Card>
          </div>
        </Row>
      </div>
    </div>
  );
}

export default Courses;
