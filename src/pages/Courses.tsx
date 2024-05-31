import {
  Button,
  Card,
  ProgressBar,
  Row,
  Col,
  ButtonGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import placeHolderPic1 from "../assets/default_courses1.png";
import placeHolderPic2 from "../assets/default_courses2.png";
import placeHolderPic3 from "../assets/default_courses3.png";
import { useEffect, useState } from "react";
import AddCategoryButton from "../components/AddCategoryButton";
import AddCategoryModal from "../components/AddCategoryModal";

interface CourseCategory {
  id: string;
  name: string;
  completed: number;
  total: number;
  picture: number;
  courses: Course[];
}

interface Course {
  id: string;
  name: string;
  name_jp: string;
  credit: number;
  progress: number;
  school: string;
}

function Courses() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewType, setViewType] = useState<"list" | "card">("card");

  const handleShowAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const navigateHome = () => {
    navigate("/");
  };

  const [courseCategories, setCourseCategories] = useState<CourseCategory[]>(
    []
  );

  const handleAddCategory = (newCategory: CourseCategory) => {
    setCourseCategories([...courseCategories, newCategory]);
  };

  const loadCourseCategories = (): CourseCategory[] => {
    const storedCategories = localStorage.getItem("courseCategories");
    return storedCategories ? JSON.parse(storedCategories) : [];
  };

  useEffect(() => {
    const storedCategories = loadCourseCategories();
    setCourseCategories(storedCategories);
  }, []);

  const totalCompleted = courseCategories.reduce(
    (acc, course) => acc + course.completed,
    0
  );
  const totalCourses = courseCategories.reduce(
    (acc, course) => acc + course.total,
    0
  );
  const overallProgress =
    totalCourses === 0 ? 0 : ((totalCompleted / totalCourses) * 100).toFixed(0);

  const handleCategorySelect = (category: CourseCategory) => {
    navigate(`/courses/${category.id}`);
  };

  return (
    <div id="parent-container">
      <div className="top-right-element">
        <Button
          className="home-button"
          variant=""
          onClick={navigateHome}
          size="lg"
        >
          <span className="mini-title text-center">Credit Ledger</span>
        </Button>
      </div>
      <div className="w-75 h-100 d-flex flex-column mx-auto">
        <span className="course-page-title">Courses</span>
        <span className="progress-container">
            {/* <div
              className="progress-marker"
              style={{ left: `calc(${overallProgress}% - 1.5rem)` }}
            >
              <div className="marker-label">{overallProgress + "%"}</div>
            </div> */}
            <ProgressBar
              now={Number(overallProgress)}
              className="bar-progress"
              label={overallProgress + "%"}
            />
          </span>
        <div className="view-toggle-container d-flex justify-content-end my-3">
          <ButtonGroup className="view-toggle">
            <Button
              variant={viewType === "card" ? "dark" : "light"}
              onClick={() => setViewType("card")}
            >
              Card View
            </Button>
            <Button
              variant={viewType === "list" ? "dark" : "light"}
              onClick={() => setViewType("list")}
            >
              List View
            </Button>
          </ButtonGroup>
        </div>
        {viewType === "card" ? (
          <Row xs={1} md={2} lg={3}>
            {courseCategories.map((category, index) => (
              <div key={index} className="g-col-6 g-col-md-4 mb-4">
                <Card
                  className="course"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleCategorySelect(category)}
                >
                  <Card.Img
                    variant="top"
                    src={
                      category.picture === 1
                        ? placeHolderPic1
                        : category.picture === 2
                        ? placeHolderPic2
                        : category.picture === 3
                        ? placeHolderPic3
                        : placeHolderPic1 // Default picture
                    }
                    className="card-image"
                  />
                  <Card.Body>
                    <Card.Title>{category.name}</Card.Title>
                    <Card.Text>{`${category.completed}/${category.total} completed`}</Card.Text>
                    <ProgressBar
                      now={Number(category.completed)}
                      max={category.total}
                      className="overflow-visible"
                      style={{ height: "1.5rem" }}
                    />
                  </Card.Body>
                </Card>
              </div>
            ))}
          </Row>
        ) : (
          <div className="course-list">
            {courseCategories.map((category, index) => (
              <Card
                key={index}
                className="mb-3 course rounded position-relative"
                style={{ cursor: "pointer", height: "5rem"}}
                onClick={() => handleCategorySelect(category)}
              >
                {/* Progress Bar as Card Background */}
                <ProgressBar
                  now={
                    category.total === 0
                      ? 0
                      : (category.completed / category.total) * 100
                  }
                  className="position-absolute w-100 h-100 py-3"
                style={{ zIndex: 0, padding: "0.6rem"}}
                  variant="SOME_NAME"
                />

                {/* Text Content */}
                <Card.Body className="position-relative text-black" style={{marginTop: "0.7rem"}}>
                  <Row>
                    <Col style={{marginLeft: "0.7rem"}}>
                      <Card.Title>{category.name}</Card.Title>
                    </Col>
                    <Col xs="auto" className="ml-auto">
                      <Card.Text>{`${category.completed}/${category.total} completed`}</Card.Text>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}

          </div>
        )}
        <AddCategoryButton onClick={handleShowAddModal} />
        <AddCategoryModal
          show={showAddModal}
          handleClose={handleCloseAddModal}
          onAddCategory={handleAddCategory}
        />
      </div>
    </div>
  );
}

export default Courses;
export type { CourseCategory, Course };

/*
<div className="course-list">
            {courseCategories.map((category, index) => (
              <Card
                key={index}
                className="mb-3 course rounded"
                style={{ cursor: "pointer" }}
                onClick={() => handleCategorySelect(category)}
              >
                <Row noGutters>
                  <Col md={4}>
                    <Card.Img
                      src={
                        category.picture === 1
                          ? placeHolderPic1
                          : category.picture === 2
                          ? placeHolderPic2
                          : category.picture === 3
                          ? placeHolderPic3
                          : placeHolderPic1 // Default picture
                      }
                      className="card-image"
                    />
                  </Col>
                  <Col md={8}>
                    <Card.Body>
                      <Card.Title>{category.name}</Card.Title>
                      <Card.Text>{`${category.completed}/${category.total} completed`}</Card.Text>
                      <ProgressBar
                        now={category.total === 0 ? 0 : (category.completed / category.total) * 100}
                        className="mt-2"
                      />
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            ))}
          </div>
*/
