import { Button, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Course, CourseCategory } from "../pages/Courses";
import { database } from "../firebase-config"; // Make sure the path is correct
import { onValue, ref } from "firebase/database";
import { IoIosAddCircle } from "react-icons/io";
import { updateCourseCategoriesInFirestore } from "../firestoreUtils";

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
      dialogClassName="add-category-modal"
    >
      <div className="add-category-modal-content">
        <Modal.Header className="add-category-modal-header" closeButton>
          <div className="col mt-3 mb-3">
            <Modal.Title className="text-center">Add Course</Modal.Title>
            <div className="modal-subtitle text-secondary text-center center pt-3">
              Enter your course details
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          {showManualForm ? (
            <div>
              <div className="mb-3">
                <span className="modal-sub-headers">Course Key</span>
                <div className="mt-2">
                  <input
                    type="text"
                    className="form-control"
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
              <div className="mb-3">
                <span className="modal-sub-headers">Course Name</span>
                <div className="mt-2">
                  <input
                    type="text"
                    className="form-control"
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
              <div className="mb-3 row">
                <div className="col">
                  <span className="modal-sub-headers">Credits</span>
                  <div className="mt-2">
                    <div className="mt-2 row align-items-center">
                      <div className="col-4">
                        <input
                          type="number"
                          className="form-control"
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
                <div className="col align-self-center justify-content-end d-flex">
                  <Button
                    variant={courseCompleted ? "dark" : "outline-dark"}
                    className="mx-auto btn-sm"
                    onClick={() => setCourseCompleted(!courseCompleted)}
                  >
                    <div className="px-4 py-1">
                      {courseCompleted ? "Complete" : "Incomplete"}
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="px-1">
                <input
                  type="text"
                  placeholder="Search for courses"
                  className="form-control mb-3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="scrollable-query-outcome px-2">
                {filteredCourses.map((course) => (
                  <div
                    key={course.a}
                    className="query-item my-0 p-2 row border-top"
                    onClick={() => handleAddManually()}
                    role="button"
                  >
                    <div className="col-10 flex-grow-1 d-flex flex-column h-100">
                      <div className="query-item-title">{course.b}</div>
                      <div className="query-item-id">{course.a}</div>
                    </div>
                    <div className="col align-self-center d-flex justify-content-end">
                      <IoIosAddCircle
                        onClick={() => handleAddManually(course)}
                        className="add-query-button"
                        size={35}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => handleAddManually()}
                className="w-100 mt-3"
                variant="dark"
              >
                Can't find your course?
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
              <div className="px-4 py-1">Add</div>
            </Button>
          )}
        </Modal.Footer>
      </div>
    </Modal>
  );
}

export default AddCourseModal;
