import React, { useState } from "react";

const Courses = () => {
  const [id, setId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseCredit, setCourseCredit] = useState("");
  const [courseGroup, setCourseGroup] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    switch (name) {
      case "id":
        setId(value);
        break;
      case "courseName":
        setCourseName(value);
        break;
      case "courseCredit":
        setCourseCredit(value);
        break;
      case "courseGroup":
        setCourseGroup(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    // Here you can implement your form submission logic
    console.log("ID:", id);
    console.log("Course Name:", courseName);
    console.log("Course Credit:", courseCredit);
    console.log("Course Group:", courseGroup);

    // Clear input fields after submission
    setId("");
    setCourseName("");
    setCourseCredit("");
    setCourseGroup("");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="text-center">Add New Course</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="id" className="form-label fw-semibold">
                Course ID
              </label>
              <input
                type="text"
                className="form-control"
                id="id"
                name="id"
                value={id}
                onChange={handleChange}
                placeholder="Enter course ID..."
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="courseName" className="form-label fw-semibold">
                Course Name
              </label>
              <input
                type="text"
                className="form-control"
                id="courseName"
                name="courseName"
                value={courseName}
                onChange={handleChange}
                placeholder="Enter course name..."
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="courseCredit" className="form-label fw-semibold">
                Course Credit
              </label>
              <input
                type="text"
                className="form-control"
                id="courseCredit"
                name="courseCredit"
                value={courseCredit}
                onChange={handleChange}
                placeholder="Enter course credit..."
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="courseGroup" className="form-label fw-semibold">
                Course Group
              </label>
              <input
                type="text"
                className="form-control"
                id="courseGroup"
                name="courseGroup"
                value={courseGroup}
                onChange={handleChange}
                placeholder="Enter course group..."
                required
              />
            </div>
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-dark">
                Add Course
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Courses;
