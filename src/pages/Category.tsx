import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Course, CourseCategory } from "./Courses";
import placeHolderPic1 from "../assets/default_courses1.png";
import placeHolderPic2 from "../assets/default_courses2.png";
import placeHolderPic3 from "../assets/default_courses3.png";
import { Button, ProgressBar } from "react-bootstrap";
import ErrorPage from "./ErrorPage";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import AddCourseModal from "../components/AddCourseModal";
import { TiDelete } from "react-icons/ti";
import { GiGraduateCap } from "react-icons/gi";
import { Divider } from "@mui/material";

const SelectedCategory: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [showAddModal, setShowAddModal] = useState(false);
  const [courseList, setCourseList] = useState<Course[]>([]);

  const handleShowAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleGoBack = () => {
    navigate("/courses");
  };

  const navigateHome = () => {
    navigate("/");
  };

  let backgroundImage: string | undefined;

  const storedCategories = localStorage.getItem("courseCategories");
  const courseCategories: CourseCategory[] = storedCategories
    ? JSON.parse(storedCategories)
    : [];

  const selectedCategory: CourseCategory | undefined = useMemo(() => {
    return courseCategories.find((category) => category.id === id);
  }, [courseCategories, id]);

  useEffect(() => {
    if (selectedCategory && selectedCategory.courses !== courseList) {
      setCourseList(selectedCategory.courses);
    }
  }, []);

  if (!selectedCategory) {
    return <ErrorPage />;
  }

  const totalCredits = selectedCategory.total;
  const completedCredits = selectedCategory.courses.reduce(
    (total, course) => total + (course.progress ? course.credit : 0),
    0
  );
  const overallProgress =
    totalCredits === 0
      ? 0
      : ((completedCredits / totalCredits) * 100).toFixed(0);

  if (selectedCategory) {
    switch (selectedCategory.picture) {
      case 1:
        backgroundImage = `url(${placeHolderPic1})`;
        break;
      case 2:
        backgroundImage = `url(${placeHolderPic2})`;
        break;
      case 3:
        backgroundImage = `url(${placeHolderPic3})`;
        break;
      default:
        backgroundImage = `url(${placeHolderPic1})`;
        break;
    }
  }

  const addCourse = (newCourse: Course) => {
    setCourseList([...courseList, newCourse]);
  };

  const removeCourse = (courseID: string) => {
    const courseToRemove = courseList.find((course) => course.id === courseID);

    if (!courseToRemove) return;

    const updatedCourseList = courseList.filter(
      (course) => course.id !== courseID
    );
    setCourseList(updatedCourseList);

    const updatedCategories = courseCategories.map((category) => {
      if (category.id === id) {
        category.completed =
          category.completed -
          (courseToRemove.progress ? courseToRemove.credit : 0);
        return { ...category, courses: updatedCourseList };
      }
      return category;
    });

    localStorage.setItem("courseCategories", JSON.stringify(updatedCategories));
  };

  return (
    <div id="parent-container">
      <div className="top-right-element">
        <Button className="" variant="" onClick={navigateHome} size="lg">
          <span className="mini-title text-center">Credit Ledger</span>
        </Button>
      </div>
      <div className="w-100 h-100 d-flex flex-column">
        <div className="course-list-header" style={{ backgroundImage }}>
          <div className="row justify-content-center align-items-center h-90">
            <div className="col-8">
              <div className="category-page-title">
                {selectedCategory?.name}
              </div>
              <div className="d-flex flex-column mb-3">
                <span className="progress-container">
                  {/* <div
                    className="progress-marker"
                    style={{ left: `calc(${overallProgress}% - 1rem)` }}
                  >
                    <div className="marker-label">{overallProgress + "%"}</div>
                  </div> */}
                  <ProgressBar
                    now={Number(overallProgress)}
                    className="bar-progress"
                    label={overallProgress + "%"}
                  />
                </span>
                <Divider>
                  {completedCredits} / {totalCredits} credits completed
                </Divider>
              </div>
            </div>
          </div>
          <div className="arrow-icon-container">
            <IoIosArrowDropleftCircle
              onClick={handleGoBack}
              className="arrow-icon"
              size={50}
            />
          </div>
        </div>
        <div className="course-list-wrapper d-flex justify-content-center">
          <div className="course-list w-75 d-flex flex-column my-5">
            {courseList.map((course) => (
              <CourseItem
                id={course.id}
                name={course.name}
                name_jp={course.name_jp}
                credit={course.credit}
                progress={course.progress}
                removeCourse={removeCourse}
                school={course.school}
              />
            ))}
            <div className="course-item-wrapper my-2">
              <div
                className="add-course course-item p-3 row"
                onClick={handleShowAddModal}
                style={{ cursor: "pointer" }}
              >
                <div>+ Add Course</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddCourseModal
        categoryID={id}
        show={showAddModal}
        handleClose={handleCloseAddModal}
        onAddCourse={addCourse}
      ></AddCourseModal>
    </div>
  );
};

const CourseItem = ({
  id,
  name,
  credit,
  progress,
  removeCourse,
}: Course & { removeCourse: (id: string) => void }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = () => {
    removeCourse(id);
  };

  return (
    <div
      className="course-item-wrapper my-2 position-relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`course-item row p-3 ${progress === 1 ? "completed" : ""}`}
      >
        <div className="course-name col-9 align-self-start">{name}</div>
        <div className="course-credit col align-self-end d-flex justify-content-end">
          <div className="col-9 align-self-end d-flex justify-content-end">
            <GiGraduateCap size={25} />
          </div>
          <div className="col px-4">{credit}</div>
        </div>
      </div>
      {isHovered && (
        <span
          className="position-absolute top-0 start-100 translate-middle-y"
          onClick={handleDelete}
          style={{ cursor: "pointer" }}
        >
          <TiDelete className="delete-button" size={25} />
        </span>
      )}
    </div>
  );
};

export default SelectedCategory;
