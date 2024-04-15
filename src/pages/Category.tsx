import React from "react";
import { CourseCategory } from "./Courses";
import placeHolderPic1 from "../assets/default_courses1.png";
import placeHolderPic2 from "../assets/default_courses2.png";
import placeHolderPic3 from "../assets/default_courses3.png";
import { Button } from "react-bootstrap";

interface SelectedCategoryProps {
  selectedCategory: CourseCategory | null;
  setSelectedCategory: React.Dispatch<
    React.SetStateAction<CourseCategory | null>
  >;
}

const SelectedCategory: React.FC<SelectedCategoryProps> = ({
  selectedCategory,
  setSelectedCategory,
}) => {
  // Define a variable to hold the background image URL
  let backgroundImage: string | undefined;

  // Set the background image based on the selectedCategory's picture value
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
        // Default to placeholder picture 1
        backgroundImage = `url(${placeHolderPic1})`;
        break;
    }
  }

  return (
    <div className="w-100 h-100 d-flex flex-column">
      <div className="course-list-header" style={{ backgroundImage }}>
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-8">
            <div className="course-list-header-details">
              <h2>{selectedCategory?.name}</h2>
              <p>{`Completed: ${selectedCategory?.completed}/${selectedCategory?.total}`}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Add other details you want to display */}
      <Button onClick={() => setSelectedCategory(null)}>Go Back</Button>
    </div>
  );
};

export default SelectedCategory;
