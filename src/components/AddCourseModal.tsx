import { Button, Modal } from "react-bootstrap";
import { useState } from "react";
import { Course, CourseCategory } from "../pages/Courses";

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
  const [courseKey, setCourseKey] = useState("");
  const [courseName, setCourseName] = useState("");
  const [requiredCredits, setRequiredCredits] = useState("");
  const [courseCompleted, setCourseCompleted] = useState(false);

  const handleAddCourse = () => {
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

    onAddCourse(newCourse);

    localStorage.setItem("courseCategories", JSON.stringify(updatedCategories));

    setCourseKey("");
    setCourseName("");
    setRequiredCredits("");
    setCourseCompleted(false);
    handleClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
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
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            className="mx-auto rounded-pill btn-lg"
            onClick={handleAddCourse}
            style={{ backgroundColor: "black", borderColor: "black" }}
          >
            <div className="px-4 py-1">Add</div>
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
}

export default AddCourseModal;
