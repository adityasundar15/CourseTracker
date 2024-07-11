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
import { PiCardsThreeFill } from "react-icons/pi";
import { FaListUl } from "react-icons/fa6";
import { Grow } from "@mui/material";

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
      <div className="top-right-element position-absolute">
        <Button
          className="home-button"
          variant=""
          onClick={navigateHome}
          size="lg"
        >
          <span className="mini-title text-center">Credit Ledger</span>
        </Button>
      </div>
      <div className="w-75 h-100 d-flex flex-column mx-auto course-categories-body">
        <Row className="">
          <span className="course-page-title col">Course Categories</span>
        </Row>
        <div className="progress-container mt-2">
          <div
            className="progress-marker"
            style={{
              left: `calc(${
                Number(overallProgress) > 100 ? 100 : overallProgress
              }% - 1rem)`,
            }}
          >
            <div className="marker-label">{overallProgress + "%"}</div>
          </div>
          <Col>
            <ProgressBar
              now={Number(overallProgress)}
              className="bar-progress row"
            />
          </Col>
        </div>
        <span className="row d-flex justify-content-end text-body-tertiary mb-2">
          {totalCompleted} / {totalCourses} credits completed
        </span>
        <div className="view-toggle-container pb-3 d-flex align-items-center">
          <ButtonGroup className="view-toggle">
            <Button
              className={`toggle-button ${
                viewType === "card" ? "selected" : ""
              }`}
              onClick={() => setViewType("card")}
            >
              <PiCardsThreeFill size={25} />
            </Button>
            <div className="separator"></div>
            <Button
              className={`toggle-button ${
                viewType === "list" ? "selected" : ""
              }`}
              onClick={() => setViewType("list")}
            >
              <FaListUl size={25} />
            </Button>
          </ButtonGroup>
        </div>

        {viewType === "card" ? (
          <Row xs={1} md={2} lg={3}>
            {courseCategories.map((category, index) => (
              <Grow in={true} timeout={index * 500}>
                <div key={index} className="g-col-6 g-col-md-4 mb-4">
                  <Card
                    className="category-list"
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
                        className="overflow-visible card-progress"
                        style={{ height: "1.5rem" }}
                      />
                    </Card.Body>
                  </Card>
                </div>
              </Grow>
            ))}
          </Row>
        ) : (
          <div className="categories-list-view">
            {courseCategories.map((category, index) => (
              <div className="py-2">
                <Card
                  key={index}
                  className="category-list-view position-relative border border-0"
                  style={{ cursor: "pointer", height: "5rem" }}
                  onClick={() => handleCategorySelect(category)}
                >
                  {/* Progress Bar as Card Background */}
                  <ProgressBar
                    now={
                      category.total === 0
                        ? 0
                        : (category.completed / category.total) * 100
                    }
                    className="position-absolute w-100 h-100 p-3"
                    style={{ zIndex: 0 }}
                  />
                  {/* Text Content */}
                  <Card.Body className="position-relative text-black h-100">
                    <Row className="m-auto d-flex align-items-center h-100">
                      <Col className="d-flex align-items-center">
                        <Card.Text className="category-title-listview">
                          {category.name}
                        </Card.Text>
                      </Col>
                      <Col xs="auto" className="">
                        <Card.Text>{`${category.completed}/${category.total} completed`}</Card.Text>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </div>
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
