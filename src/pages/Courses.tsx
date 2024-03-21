import { Button, Card, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import placeHolderPic from "../assets/default_courses.png";
import { useEffect, useState } from "react";

interface CourseCategory {
  name: string;
  completed: number;
  total: number;
}

function Courses() {
  const navigate = useNavigate();

  const navigateHome = () => {
    navigate("/");
  };

  const [courseCategories, setCourseCategories] = useState<CourseCategory[]>(
    []
  );

  const initialCourseCategories = (): CourseCategory[] => [
    { name: "Introductory", completed: 8, total: 12 },
    { name: "Intermediate", completed: 7, total: 12 },
    { name: "Advanced", completed: 10, total: 12 },
    { name: "Seminar", completed: 4, total: 8 },
    { name: "Language", completed: 18, total: 22 },
    { name: "Untitled", completed: 0, total: 0 },
  ];

  // Load course categories from localStorage on component mount
  useEffect(() => {
    const storedCategories = localStorage.getItem("courseCategories");
    if (storedCategories !== null && storedCategories !== "[]") {
      setCourseCategories(JSON.parse(storedCategories));
    } else {
      setCourseCategories(initialCourseCategories());
    }
  }, []);

  // Update localStorage whenever courseCategories changes
  useEffect(() => {
    localStorage.setItem("courseCategories", JSON.stringify(courseCategories));
  }, [courseCategories]);

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
          {courseCategories.map((category, index) => (
            <div key={index} className="g-col-6 g-col-md-4 mb-4">
              <Card className="course">
                <Card.Img
                  variant="top"
                  src={placeHolderPic}
                  className="card-image"
                />
                <Card.Body>
                  <Card.Title>{category.name}</Card.Title>
                  <Card.Text>{`${category.completed}/${category.total} completed`}</Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default Courses;
