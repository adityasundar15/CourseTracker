import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Course, CourseCategory } from "./Courses";
import placeHolderPic1 from "../assets/default_courses1.png";
import placeHolderPic2 from "../assets/default_courses2.png";
import placeHolderPic3 from "../assets/default_courses3.png";
import placeHolderPic4 from "../assets/default_courses4.png";
import { Button, Col, ProgressBar } from "react-bootstrap";
import ErrorPage from "./ErrorPage";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import AddCourseModal from "../components/AddCourseModal";
import { TiDelete } from "react-icons/ti";
import { FaRegCheckCircle } from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";
import { Box, Divider, Slide } from "@mui/material";
import DeleteConfirmationDialog from "../components/DeleteConfirmationDialog";
import { updateCourseCategoriesInFirestore } from "../firestoreUtils";
import { MdEdit } from "react-icons/md";
import AddCategoryModal from "../components/AddCategoryModal";
import { motion } from "framer-motion";

const SelectedCategory: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [showAddModal, setShowAddModal] = useState(false);
  const [courseList, setCourseList] = useState<Course[]>([]);
  const containerRef = React.useRef<HTMLElement>(null);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<
    CourseCategory | undefined
  >(undefined);

  const [totalCredits, setTotalCredits] = useState(0);
  const [completedCredits, setCompletedCredits] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState<
    CourseCategory | undefined
  >(undefined);

  const previousCategoryRef = useRef<CourseCategory | undefined>();

  const handleShowEditModal = (category: CourseCategory) => {
    setCategoryToEdit(category);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setCategoryToEdit(undefined);
  };

  const handleShowAddModal = () => {
    setCourseToEdit(null);
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setCourseToEdit(null);
  };

  const handleGoBack = () => {
    navigate("/courses");
  };

  const navigateHome = () => {
    navigate("/");
  };

  let backgroundImage: string | undefined;

  const storedCategories = localStorage.getItem("courseCategories");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const courseCategories: CourseCategory[] = storedCategories
    ? JSON.parse(storedCategories)
    : [];

  useEffect(() => {
    const category = courseCategories.find((category) => category.id === id);
    const previousCategoryJSON = JSON.stringify(previousCategoryRef.current);
    const currentCategoryJSON = JSON.stringify(category);

    if (currentCategoryJSON !== previousCategoryJSON) {
      setSelectedCategory(category);
      previousCategoryRef.current = category;
    }
  }, [courseCategories, id]);

  useEffect(() => {
    if (selectedCategory) {
      setCourseList(selectedCategory.courses);
      updateCreditsAndProgress(selectedCategory.courses);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  if (!selectedCategory) {
    return <ErrorPage />;
  }

  const updateCreditsAndProgress = (courses: Course[]) => {
    const newTotalCredits = selectedCategory ? selectedCategory.total : 0;
    const newCompletedCredits = courses.reduce(
      (total, course) => total + (course.progress ? course.credit : 0),
      0
    );
    const newOverallProgress =
      newTotalCredits === 0 ? 0 : (newCompletedCredits / newTotalCredits) * 100;

    setTotalCredits(newTotalCredits);
    setCompletedCredits(newCompletedCredits);
    setOverallProgress(newOverallProgress);
  };

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
      case 4:
        backgroundImage = `url(${placeHolderPic4})`;
        break;
      default:
        backgroundImage = `url(${placeHolderPic1})`;
        break;
    }
  }

  const addCourse = (newCourse: Course) => {
    setCourseList((prevCourseList) => {
      const existingCourseIndex = prevCourseList.findIndex(
        (course) => course.id === newCourse.id
      );

      if (existingCourseIndex !== -1) {
        const updatedCourseList = [...prevCourseList];
        updatedCourseList[existingCourseIndex] = newCourse;
        updateCreditsAndProgress(updatedCourseList);
        return updatedCourseList;
      } else {
        updateCreditsAndProgress([...prevCourseList, newCourse]);
        return [...prevCourseList, newCourse];
      }
    });
  };

  const editCourse = (course: Course) => {
    setCourseToEdit(course); // Set the course to edit
    setShowAddModal(true); // Show the modal
  };

  const removeCourse = async (courseID: string) => {
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

    // Sync local data with Firestore
    await updateCourseCategoriesInFirestore(updatedCategories);

    localStorage.setItem("courseCategories", JSON.stringify(updatedCategories));

    updateCreditsAndProgress(updatedCourseList);
  };

  const handleDeleteConfirmation = async () => {
    const updatedCategories = courseCategories.filter(
      (category) => category.id !== id
    );

    // Sync local data with Firestore
    await updateCourseCategoriesInFirestore(updatedCategories);

    localStorage.setItem("courseCategories", JSON.stringify(updatedCategories));
    navigate("/courses");
  };

  const handleCategoryUpdate = async (updatedCategory: CourseCategory) => {
    const updatedCategories = courseCategories.map((category) =>
      category.id === updatedCategory.id ? updatedCategory : category
    );

    await updateCourseCategoriesInFirestore(updatedCategories);
    localStorage.setItem("courseCategories", JSON.stringify(updatedCategories));

    setSelectedCategory(updatedCategory);
    updateCreditsAndProgress(updatedCategory.courses);
    setShowEditModal(false);
  };

  return (
    <div id="parent-container">
      <div className="top-right-element position-absolute z-3">
        <Button className="" variant="" onClick={navigateHome} size="lg">
          <span className="mini-title text-center">Credit Ledger</span>
        </Button>
      </div>
      <motion.div
        layout
        initial={{ opacity: 0, x: -200 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="w-100 h-100 d-flex flex-column"
      >
        <div className="course-list-header" style={{ backgroundImage }}>
          <div className="row justify-content-center align-items-center h-90">
            <div className="col-9 upper-course-list">
              <div className="d-flex flex-column mb-3">
                <div className="progress-container category-course-progress-container">
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
                <div className="pt-4">
                  <Divider>
                    {completedCredits} / {totalCredits} credits completed
                  </Divider>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="arrow-icon-container col">
              <IoArrowBackCircleSharp
                onClick={handleGoBack}
                className="arrow-icon"
                size={35}
              />
            </div>
            <div className="delete-icon-container col d-flex justify-content-end">
              <DeleteConfirmationDialog onDelete={handleDeleteConfirmation} />
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center align-items-center category-sub-header">
          <div className="w-75 row justify-content-between align-items-center">
            <div className="category-page-title d-flex col-9">
              {selectedCategory?.name}
            </div>
            <div className="col-auto justify-content-end">
              <Button
                className="category-edit-btn"
                onClick={() => handleShowEditModal(selectedCategory)}
              >
                Edit
              </Button>
            </div>
          </div>
        </div>
        <div className="course-list-wrapper d-flex justify-content-center">
          <div className="course-list w-75 d-flex flex-column">
            <Box ref={containerRef}>
              {courseList.map((course, index) => (
                <Slide
                  direction="up"
                  in={true}
                  container={containerRef.current}
                  timeout={index * 200}
                  key={index}
                >
                  <div>
                    <CourseItem
                      key={index}
                      id={course.id}
                      name={course.name}
                      name_jp={course.name_jp}
                      credit={course.credit}
                      progress={course.progress}
                      removeCourse={removeCourse}
                      editCourse={editCourse}
                      school={course.school}
                    />
                  </div>
                </Slide>
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
            </Box>
          </div>
        </div>
      </motion.div>
      <AddCourseModal
        categoryID={id}
        show={showAddModal}
        handleClose={handleCloseAddModal}
        onAddCourse={addCourse}
        courseToEdit={courseToEdit}
      ></AddCourseModal>
      <AddCategoryModal
        show={showEditModal}
        handleClose={handleCloseEditModal}
        onAddCategory={handleCategoryUpdate}
        categoryToEdit={categoryToEdit}
      />
    </div>
  );
};

interface CourseItemProps {
  id: string;
  name: string;
  name_jp?: string;
  credit: number;
  progress: number;
  school?: string;
  removeCourse: (id: string) => void;
  editCourse: (course: Course) => void;
}

const CourseItem: React.FC<CourseItemProps> = ({
  id,
  name,
  name_jp,
  credit,
  progress,
  school,
  removeCourse,
  editCourse,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = () => {
    removeCourse(id);
  };

  const handleEdit = () => {
    editCourse({
      id,
      name,
      name_jp: name_jp || "",
      credit,
      progress,
      school: school || "",
    });
  };

  return (
    <div
      className="course-item-wrapper mb-4 position-relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`course-item row p-3 ${progress === 1 ? "completed" : ""}`}
      >
        <span className="course-name col-9 align-self-start row">
          {name}{" "}
          {isHovered && (
            <div
              className="edit-course col d-flex align-items-center"
              onClick={handleEdit}
              style={{ cursor: "pointer" }}
            >
              <MdEdit className="edit-course-icon" size={20} />
            </div>
          )}
        </span>
        <div className="course-credit col align-self-end d-flex justify-content-end">
          <div className="col-9 align-self-end d-flex justify-content-end align-items-center">
            {progress === 1 && <FaRegCheckCircle className="me-3" size={15} />}
            <GiGraduateCap size={25} />
          </div>
          <div className="col-1 px-4">{credit}</div>
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
