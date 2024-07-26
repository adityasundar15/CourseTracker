import { Button, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { CourseCategory } from "../pages/Courses";
import { v4 as uuidv4 } from "uuid";
import { updateCourseCategoriesInFirestore } from "../firestoreUtils";

import placeHolderPic1 from "../assets/default_courses1.png";
import placeHolderPic2 from "../assets/default_courses2.png";
import placeHolderPic3 from "../assets/default_courses3.png";
import placeHolderPic4 from "../assets/default_courses4.png";

interface AddCategoryModalProps {
  show: boolean;
  handleClose: () => void;
  onAddCategory: (newCategory: CourseCategory) => void;
  categoryToEdit?: CourseCategory;
}

function AddCategoryModal({
  show,
  handleClose,
  onAddCategory,
  categoryToEdit,
}: AddCategoryModalProps) {
  const [courseGroup, setCourseGroup] = useState("");
  const [requiredCredits, setRequiredCredits] = useState("");
  const [picture, setPicture] = useState(1); // Default picture

  // Effect to populate fields if editing
  useEffect(() => {
    if (categoryToEdit) {
      setCourseGroup(categoryToEdit.name);
      setRequiredCredits(categoryToEdit.total.toString());
      setPicture(categoryToEdit.picture);
    }
  }, [categoryToEdit]);

  const handleSaveCategory = async () => {
    // Create or update category object
    const newCategory: CourseCategory = {
      id: categoryToEdit ? categoryToEdit.id : uuidv4(),
      name: courseGroup,
      completed: categoryToEdit ? categoryToEdit.completed : 0,
      total: parseInt(requiredCredits),
      picture: picture,
      courses: categoryToEdit ? categoryToEdit.courses : [],
    };

    // Update local storage and Firestore
    const existingCategoriesJSON = localStorage.getItem("courseCategories");
    let existingCategories: CourseCategory[] = existingCategoriesJSON
      ? JSON.parse(existingCategoriesJSON)
      : [];

    if (categoryToEdit) {
      existingCategories = existingCategories.map((category) =>
        category.id === categoryToEdit.id ? newCategory : category
      );
    } else {
      existingCategories.push(newCategory);
    }

    // Call the onAddCategory function to pass the new/updated category to the parent component
    onAddCategory(newCategory);

    // Sync local data with Firestore
    await updateCourseCategoriesInFirestore(existingCategories);
    localStorage.setItem(
      "courseCategories",
      JSON.stringify(existingCategories)
    );
    console.log("Category saved to local storage");

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
            <Modal.Title className="text-center">
              {categoryToEdit ? "Edit Category" : "Add Category"}
            </Modal.Title>
            <div className="modal-subtitle text-secondary text-center center pt-3">
              {categoryToEdit
                ? "Edit your course category details"
                : "Enter your course category details"}
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
            <div className="row gx-3 d-flex justify-content-evenly align-content-center">
              {[
                placeHolderPic1,
                placeHolderPic2,
                placeHolderPic3,
                placeHolderPic4,
              ].map((src, index) => (
                <div key={index} className="col-3 align-content-center">
                  <div
                    className={`modal-img-container ${
                      picture === index + 1 ? "selected" : ""
                    }`}
                  >
                    <img
                      className="d-block modal-img"
                      src={src}
                      alt={`Slide ${index + 1}`}
                      onClick={() => setPicture(index + 1)}
                    />
                    {picture === index + 1 && (
                      <div className="img-overlay">Selected</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            className="mx-auto rounded-pill btn-lg"
            onClick={handleSaveCategory}
            style={{ backgroundColor: "black", borderColor: "black" }}
          >
            <div className="px-4 py-1">{categoryToEdit ? "Save" : "Add"}</div>
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
}

export default AddCategoryModal;
