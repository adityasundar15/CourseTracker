function RemoveAllCategoriesButton() {
  const handleRemoveAllCategories = () => {
    localStorage.removeItem("courseCategories");
    // Add any other logic here if needed
  };

  return (
    <button onClick={handleRemoveAllCategories}>
      Remove All Course Categories
    </button>
  );
}

export default RemoveAllCategoriesButton;
