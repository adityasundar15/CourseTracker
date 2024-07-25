import { Button, Collapse, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Course, CourseCategory } from "../pages/Courses";
import { database } from "../firebase-config"; // Make sure the path is correct
import { onValue, ref } from "firebase/database";
import { IoIosAddCircleOutline } from "react-icons/io";
import { updateCourseCategoriesInFirestore } from "../firestoreUtils";
import { MdOutlineBackpack } from "react-icons/md";

import silsIcon from "../assets/syllabus-icons/sils.png";
import pseIcon from "../assets/syllabus-icons/pse.png";
import sssIcon from "../assets/syllabus-icons/sss.png";
import fseIcon from "../assets/syllabus-icons/fse.png";
import cseIcon from "../assets/syllabus-icons/cse.png";
import aseIcon from "../assets/syllabus-icons/ase.png";
import cmsIcon from "../assets/syllabus-icons/cms.png";

// FirebaseCourse interface matching the structure
interface FirebaseCourse {
  a: string; // id
  b: string; // title
  c: string; // title_jp
  d: string; // instructor
  e: string; // instructor_jp
  f: string; // lang
  g: string; // type
  h: string; // term
  i: string; // occurrences
  j: string; // min_year
  k: string; // category
  l: number; // credit
  m: string; // level
  n: string; // eval
  o: string; // code
  p: string; // subtitle
}

interface AddCourseModalProps {
  categoryID: string | undefined;
  show: boolean;
  handleClose: () => void;
  onAddCourse: (newCourse: Course) => void;
}

function AddCourseModal({
  categoryID,
  show,
  handleClose,
  onAddCourse,
}: AddCourseModalProps) {
  const [showManualForm, setShowManualForm] = useState(false);
  const [courseKey, setCourseKey] = useState("");
  const [courseName, setCourseName] = useState("");
  const [requiredCredits, setRequiredCredits] = useState("");
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<FirebaseCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<FirebaseCourse[]>([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

  const handleIconClick = (iconName: string) => {
    setSelectedSchool(iconName);
  };

  useEffect(() => {
    // Fetch data from Firebase
    const coursesRef = ref(database, "FSE");
    onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fullCoursesArray: FirebaseCourse[] = Object.values(data);
        setCourses(fullCoursesArray);
      }
    });
  }, []);

  useEffect(() => {
    // Filter courses based on search term
    const filtered = courses.filter(
      (course) =>
        course.b.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.a.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  const handleAddManually = (selectedCourse?: FirebaseCourse) => {
    if (selectedCourse) {
      setCourseKey(selectedCourse.a);
      setCourseName(selectedCourse.b);
      setRequiredCredits(selectedCourse.l.toString());
      setCourseCompleted(false);
    }

    // Show the manual form
    setShowManualForm(true);
  };

  const handleAddCourse = async () => {
    const newCourse: Course = {
      id: courseKey,
      name: courseName,
      name_jp: "",
      credit: parseInt(requiredCredits),
      progress: courseCompleted ? 1 : 0,
      school: "",
    };

    const storedCategories = localStorage.getItem("courseCategories");
    const courseCategories: CourseCategory[] = storedCategories
      ? JSON.parse(storedCategories)
      : [];
    const updatedCategories = courseCategories.map((category) => {
      if (category.id === categoryID) {
        category.courses.push(newCourse);
        if (newCourse.progress === 1) {
          category.completed += newCourse.credit;
        }
      }
      return category;
    });

    // Sync local data with Firestore
    await updateCourseCategoriesInFirestore(updatedCategories);

    onAddCourse(newCourse);

    localStorage.setItem("courseCategories", JSON.stringify(updatedCategories));

    setCourseKey("");
    setCourseName("");
    setRequiredCredits("");
    setCourseCompleted(false);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setShowManualForm(false);
    handleClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleCloseModal}
      dialogClassName="add-category-modal add-course-modal"
    >
      <div className="add-category-modal-content">
        <Modal.Header className="add-category-modal-header" closeButton>
          <div className="col my-3">
            <Modal.Title className="text-center">Add Course</Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          {showManualForm ? (
            <div>
              <div className="mb-3">
                <span className="modal-sub-headers">Course Name</span>
                <div className="mt-2">
                  <input
                    type="text"
                    className="add-course-input form-control"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="Enter Course Name"
                    id="courseNameInput"
                  />
                </div>
                <div className="modal-info mt-1 text-secondary">
                  e.g.) Fundamentals of Visual Expression and Design
                </div>
              </div>
              <div className="mb-3">
                <span className="modal-sub-headers">Course Key</span>
                <div className="mt-2">
                  <input
                    type="text"
                    className="add-course-input form-control"
                    value={courseKey}
                    onChange={(e) => setCourseKey(e.target.value)}
                    placeholder="Enter Course Key"
                    id="courseKeyInput"
                  />
                </div>
                <div className="modal-info mt-1 text-secondary">
                  e.g.) 26M0013701
                </div>
              </div>
              <div className="mb-3 row">
                <div className="col">
                  <span className="modal-sub-headers">Credits</span>
                  <div className="mt-2">
                    <div className="mt-2 row align-items-center">
                      <div className="col-4">
                        <input
                          type="number"
                          className="add-course-input form-control"
                          value={requiredCredits}
                          onChange={(e) => setRequiredCredits(e.target.value)}
                          min="1"
                          max="130"
                        />
                      </div>
                      <div className="col align-items-start">
                        <div>credits</div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-info mt-1 text-secondary">
                    e.g.) 2 credits
                  </div>
                </div>
              </div>
              <div className="col align-self-center justify-content-between d-flex">
                <Button
                  className={`btn-sm add-course-btn ${
                    courseCompleted ? "add-course-selected" : ""
                  }`}
                  style={{ width: "45%" }}
                  onClick={() => setCourseCompleted(true)}
                >
                  <div className="py-1">Complete</div>
                </Button>
                <Button
                  className={`btn-sm add-course-btn ${
                    !courseCompleted ? "add-course-selected" : ""
                  }`}
                  style={{ width: "45%" }}
                  onClick={() => setCourseCompleted(false)}
                >
                  <div className="py-1">Incomplete</div>
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="search-courses-container d-flex align-items-center px-1 mb-2 row mt-2">
                <div className="col p-0">
                  <input
                    type="text"
                    placeholder="Enter course name / key"
                    className="form-control search-courses"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-auto pe-4">
                  <Button
                    className={`school-select ${
                      openFilter ? "opened-filter" : ""
                    }`}
                    onClick={() => setOpenFilter(!openFilter)}
                    aria-controls="collapse-content"
                    aria-expanded={openFilter ? "true" : "false"}
                  >
                    <MdOutlineBackpack color="black" size={28} />
                  </Button>
                </div>
              </div>
              <div>
                <Collapse in={openFilter}>
                  <div id="collapse-content">
                    <div className="d-flex w-100 course-filter-container mb-2 justify-content-between align-items-center p-3">
                      {[
                        { src: silsIcon, alt: "SILS", name: "SILS" },
                        { src: pseIcon, alt: "PSE", name: "PSE" },
                        { src: sssIcon, alt: "SSS", name: "SSS" },
                        { src: fseIcon, alt: "FSE", name: "FSE" },
                        { src: cseIcon, alt: "CSE", name: "CSE" },
                        { src: aseIcon, alt: "ASE", name: "ASE" },
                        { src: cmsIcon, alt: "CMS", name: "CMS" },
                      ].map((icon) => (
                        <div
                          key={icon.name}
                          className={`image-container ${
                            selectedSchool === icon.name ? "selected" : ""
                          }`}
                          onClick={() => handleIconClick(icon.name)}
                        >
                          <div className="icon-holder">
                            <img
                              src={icon.src}
                              alt={icon.alt}
                              className="school-icon"
                              height={50}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Collapse>
              </div>
              <div className="scrollable-query-outcome pt-1">
                {filteredCourses.map((course) => (
                  <div
                    key={course.a}
                    className="query-item my-0 px-3 my-3 d-flex"
                    onClick={() => handleAddManually(course)}
                    role="button"
                  >
                    <div className="col-10 flex-grow-1 d-flex flex-column h-100">
                      <div className="query-item-title">{course.b}</div>
                      <div className="query-item-id">{course.a}</div>
                    </div>
                    <div className="col align-self-center d-flex justify-content-end">
                      <IoIosAddCircleOutline
                        onClick={() => handleAddManually(course)}
                        className="add-query-button"
                        size={30}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => handleAddManually()}
                className="mx-auto rounded-pill mt-4 align-items-center d-flex"
                variant="dark"
              >
                <span className="px-2 py-1 fw-light">
                  Can't find your course?
                </span>
              </Button>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {showManualForm && (
            <Button
              variant="primary"
              className="mx-auto rounded-pill btn-lg"
              onClick={handleAddCourse}
              style={{ backgroundColor: "black", borderColor: "black" }}
            >
              <div className="px-5">Add</div>
            </Button>
          )}
        </Modal.Footer>
      </div>
    </Modal>
  );
}

export default AddCourseModal;
