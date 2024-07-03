import { Button, Modal } from "react-bootstrap";
import { useState } from "react";
import { CourseCategory } from "../pages/Courses";
import { v4 as uuidv4 } from "uuid";
import { updateCourseCategoriesInFirestore } from "../firestoreUtils";

interface AddCategoryModalProps {
  show: boolean;
  handleClose: () => void;
  onAddCategory: (newCategory: CourseCategory) => void;
}

function AddCategoryModal({
  show,
  handleClose,
  onAddCategory,
}: AddCategoryModalProps) {
  const [courseGroup, setCourseGroup] = useState("");
  const [requiredCredits, setRequiredCredits] = useState("");
  const [picture, setPicture] = useState(1); // Default picture

  const handleAddCategory = async () => {
    // Create new category object
    const newCategory: CourseCategory = {
      id: uuidv4(),
      name: courseGroup,
      completed: 0,
      total: parseInt(requiredCredits),
      picture: picture,
      courses: [],
    };

    // Add new category to local storage
    const existingCategoriesJSON = localStorage.getItem("courseCategories");
    const existingCategories: CourseCategory[] = existingCategoriesJSON
      ? JSON.parse(existingCategoriesJSON)
      : [];
    const updatedCategories = [...existingCategories, newCategory];

    // Call the onAddCategory function to pass the new category to the parent component
    onAddCategory(newCategory);

    // Sync local data with Firestore
    await updateCourseCategoriesInFirestore(updatedCategories);

    localStorage.setItem("courseCategories", JSON.stringify(updatedCategories));
    console.log("Category added to local storage");

    // Reset input fields and close modal
    setCourseGroup("");
    setRequiredCredits("");
    setPicture(1); // Reset picture to default
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
            <Modal.Title className="text-center">Add Category</Modal.Title>
            <div className="modal-subtitle text-secondary text-center center pt-3">
              Enter your course category details
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <span className="modal-sub-headers">Course Group</span>
            <div className="mt-2">
              <input
                type="text"
                className="form-control"
                value={courseGroup}
                onChange={(e) => setCourseGroup(e.target.value)}
                placeholder="Enter Course Group"
                id="courseGroupInput"
              />
            </div>
            <div className="modal-info mt-1 text-secondary">e.g.) Advanced</div>
          </div>
          <div className="mb-3">
            <span className="modal-sub-headers">Required Credits</span>
            <div className="mt-2">
              <div className="mt-2 row align-items-center">
                <div className="col-5">
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
              e.g.) 15 credits
            </div>
          </div>
          <div className="mb-1 pt-3">
            <div className="row">
              <div className="col-4">
                <div className="modal-img-container">
                  <img
                    className={`d-block modal-img ${
                      picture === 1 ? "selected" : ""
                    }`}
                    src="/src/assets/default_courses1.png"
                    alt="First slide"
                    onClick={() => setPicture(1)}
                  />
                  {picture === 1 && <div className="img-overlay">Selected</div>}
                </div>
              </div>
              <div className="col-4">
                <div className="modal-img-container">
                  <img
                    className={`d-block modal-img ${
                      picture === 2 ? "selected" : ""
                    }`}
                    src="/src/assets/default_courses2.png"
                    alt="Second slide"
                    onClick={() => setPicture(2)}
                  />
                  {picture === 2 && <div className="img-overlay">Selected</div>}
                </div>
              </div>
              <div className="col-4">
                <div className="modal-img-container">
                  <img
                    className={`d-block modal-img ${
                      picture === 3 ? "selected" : ""
                    }`}
                    src="/src/assets/default_courses3.png"
                    alt="Third slide"
                    onClick={() => setPicture(3)}
                  />
                  {picture === 3 && <div className="img-overlay">Selected</div>}
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            className="mx-auto rounded-pill btn-lg"
            onClick={handleAddCategory}
            style={{ backgroundColor: "black", borderColor: "black" }}
          >
            <div className="px-4 py-1">Add</div>
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
}

export default AddCategoryModal;
