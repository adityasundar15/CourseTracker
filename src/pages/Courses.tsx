import {
  Button,
  Card,
  Carousel,
  Modal,
  ProgressBar,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import placeHolderPic1 from "../assets/default_courses1.png";
import placeHolderPic2 from "../assets/default_courses2.png";
import placeHolderPic3 from "../assets/default_courses3.png";
import { useEffect, useState } from "react";
import SelectedCategory from "./Category";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface CourseCategory {
  name: string;
  completed: number;
  total: number;
  picture: number;
  courses: Course[];
}

interface Course {
  id: string;
  name: string;
  credit: number;
  completed: boolean;
}

function Courses() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);

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

  const initialCourseCategories = (): CourseCategory[] => [
    {
      name: "Introductory",
      completed: 8,
      total: 12,
      picture: 1,
      courses: [
        {
          id: "000001",
          name: "Introduction to AI",
          credit: 2,
          completed: true,
        },
        {
          id: "000002",
          name: "Introduction to Digital Humanities",
          credit: 2,
          completed: true,
        },
        {
          id: "000003",
          name: "Introduction to Statistics",
          credit: 3,
          completed: true,
        },
        {
          id: "000004",
          name: "Introduction to Media Studies",
          credit: 2,
          completed: false,
        },
      ],
    },
    {
      name: "Intermediate",
      completed: 7,
      total: 12,
      picture: 3,
      courses: [
        {
          id: "000001",
          name: "Intermediate to AI",
          credit: 2,
          completed: true,
        },
        {
          id: "000002",
          name: "Intermediate to Digital Humanities",
          credit: 2,
          completed: true,
        },
        {
          id: "000003",
          name: "Intermediate to Statistics",
          credit: 3,
          completed: true,
        },
        {
          id: "000004",
          name: "Intermediate to Media Studies",
          credit: 2,
          completed: false,
        },
      ],
    },
    {
      name: "Advanced",
      completed: 10,
      total: 12,
      picture: 3,
      courses: [
        {
          id: "000001",
          name: "Advanced to AI",
          credit: 2,
          completed: true,
        },
        {
          id: "000002",
          name: "Advanced to Digital Humanities",
          credit: 2,
          completed: true,
        },
        {
          id: "000003",
          name: "Advanced to Statistics",
          credit: 3,
          completed: true,
        },
        {
          id: "000004",
          name: "Advanced to Media Studies",
          credit: 2,
          completed: false,
        },
      ],
    },
    {
      name: "Seminar",
      completed: 4,
      total: 8,
      picture: 2,
      courses: [
        {
          id: "000001",
          name: "Seminar to AI",
          credit: 2,
          completed: true,
        },
        {
          id: "000002",
          name: "Seminar to Digital Humanities",
          credit: 2,
          completed: true,
        },
        {
          id: "000003",
          name: "Seminar to Statistics",
          credit: 3,
          completed: true,
        },
        {
          id: "000004",
          name: "Seminar to Media Studies",
          credit: 2,
          completed: false,
        },
      ],
    },
    {
      name: "Language",
      completed: 18,
      total: 22,
      picture: 3,
      courses: [
        {
          id: "000001",
          name: "Language to AI",
          credit: 2,
          completed: true,
        },
        {
          id: "000002",
          name: "Language to Digital Humanities",
          credit: 2,
          completed: true,
        },
        {
          id: "000003",
          name: "Language to Statistics",
          credit: 3,
          completed: true,
        },
        {
          id: "000004",
          name: "Language to Media Studies",
          credit: 2,
          completed: false,
        },
      ],
    },
    { name: "Untitled", picture: 1, completed: 0, total: 0, courses: [] },
  ];

  // Function to load course categories from local storage
  const loadCourseCategories = (): CourseCategory[] => {
    const storedCategories = localStorage.getItem("courseCategories");
    return storedCategories ? JSON.parse(storedCategories) : [];
  };

  // Load course categories from local storage on component mount
  useEffect(() => {
    const storedCategories = loadCourseCategories();
    console.log("storedCategories: ", storedCategories);
    if (storedCategories.length === 0) {
      setCourseCategories(initialCourseCategories);
    } else {
      setCourseCategories(storedCategories);
    }
    console.log("Course categories updated: ", courseCategories);
  }, []); // Only runs on component mount

  // Update localStorage whenever courseCategories changes
  useEffect(() => {
    localStorage.setItem("courseCategories", JSON.stringify(courseCategories));
  }, [courseCategories]); // Runs whenever courseCategories changes

  // Calculate overall progress
  const totalCompleted = courseCategories.reduce(
    (acc, course) => acc + course.completed,
    0
  );
  const totalCourses = courseCategories.reduce(
    (acc, course) => acc + course.total,
    0
  );
  const overallProgress = ((totalCompleted / totalCourses) * 100).toFixed(1);

  const [selectedCategory, setSelectedCategory] =
    useState<CourseCategory | null>(null);

  const handleCategorySelect = (category: CourseCategory) => {
    setSelectedCategory(category);
    console.log("Current Category: ", selectedCategory);
  };

  return (
    <div id="parent-container">
      <div className="top-right-element">
        <Button className="" variant="" onClick={navigateHome} size="lg">
          <span className="mini-title text-center">Credit Ledger</span>
        </Button>
      </div>
      {selectedCategory ? (
        <SelectedCategory
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      ) : (
        <>
          <div className="w-75 h-100 d-flex flex-column">
            <span className="course-page-title">Courses</span>
            <span className="progress-container">
              <div
                className="progress-marker"
                style={{ left: `calc(${overallProgress}% - 1.5rem)` }}
              >
                <div className="marker-label">{overallProgress + "%"}</div>
              </div>
              <ProgressBar
                now={Number(overallProgress)}
                className="bar-progress"
              ></ProgressBar>
            </span>
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
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </Row>
          </div>
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
                e.currentTarget.style.boxShadow =
                  "0 4px 8px 0 rgba(0, 0, 0, 0)";
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
              <div className="mb-3" style={{ marginTop: "2rem" }}>
                <h5>Required Credits</h5>
                <select
                  className="form-select"
                  style={{ width: "12rem" }}
                  id="requiredCreditsSelect"
                >
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
              <div className="mb-3" style={{ marginTop: "2rem" }}>
                <h5>Background Image</h5>
                <Carousel indicators={true}>
                  <Carousel.Item>
                    <img
                      className="d-block w-100"
                      src="/src/assets/default_courses1.png"
                      alt="First slide"
                      style={{ width: "500px", height: "300px" }}
                    />
                  </Carousel.Item>
                  <Carousel.Item>
                    <img
                      className="d-block w-100"
                      src="/src/assets/default_courses2.png"
                      alt="Second slide"
                      style={{ width: "500px", height: "300px" }}
                    />
                  </Carousel.Item>
                  <Carousel.Item>
                    <img
                      className="d-block w-100"
                      src="/src/assets/default_courses3.png"
                      alt="Third slide"
                      style={{ width: "500px", height: "300px" }}
                    />
                  </Carousel.Item>
                </Carousel>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={() => {}}
                style={{ backgroundColor: "black", borderColor: "black" }}
              >
                Add
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}

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
            src="/src/assets/image1.png"
            alt="First slide"
            style={{ width: '500px', height: '300px' }}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/src/assets/image2.png"
            alt="Second slide"
            style={{ width: '500px', height: '300px' }}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/src/assets/image3.png"
            alt="Third slide"
            style={{ width: '500px', height: '300px' }}
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
export type { CourseCategory, Course };
