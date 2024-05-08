import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface AddCategoryButtonProps {
  onClick: () => void;
}

function AddCategoryButton({ onClick }: AddCategoryButtonProps) {
  return (
    <div className="floating-button-container">
      <Button
        className="floating-button"
        onClick={onClick}
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
          e.currentTarget.style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "0.5";
          e.currentTarget.style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0)";
        }}
      >
        <FontAwesomeIcon icon={faPlus} size="lg" /> Add Category
      </Button>
    </div>
  );
}

export default AddCategoryButton;
