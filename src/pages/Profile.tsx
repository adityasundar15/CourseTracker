import React, { useEffect, useState } from "react";
import "../App.css";

const Profile = () => {
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState("");
  const [userDataExists, setUserDataExists] = useState(false);
  const [greetingName, setGreetingName] = useState("");

  useEffect(() => {
    // Check if userData exists in local storage
    const userDataJSON = localStorage.getItem("userData");
    if (userDataJSON) {
      setUserDataExists(true);
      const userData = JSON.parse(userDataJSON);
      // Update state with userData values
      setName(userData.name);
      setSchool(userData.school);
      setGrade(userData.grade);
      setGreetingName(userData.name);
    }
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    switch (name) {
      case "name":
        setName(value);
        break;
      case "school":
        setSchool(value);
        break;
      case "grade":
        setGrade(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    const userData = {
      name: name,
      school: school,
      grade: grade,
    };
    const userDataJSON = JSON.stringify(userData);
    localStorage.setItem("userData", userDataJSON);
    setUserDataExists(true);
    console.log("Name:", name);
    console.log("School:", school);
    console.log("Grade:", grade);

    setGreetingName(name);
  };

  const message = userDataExists
    ? `Welcome Back, ${greetingName}!`
    : "Create Your Profile";

  const gradeOptions = [
    { value: "", label: "Select Grade" },
    { value: "1st", label: "1st Year" },
    { value: "2nd", label: "2nd Year" },
    { value: "3rd", label: "3rd Year" },
    { value: "4th", label: "4th Year" },
    { value: "5th+", label: "5th Year or above" },
  ];

  return (
    <div className="profile-container">
      <div className="container mt-5">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-5 flex-column align-items-center">
            <h1 className="text-center">{message}</h1>
            <form onSubmit={handleSubmit} className="mt-3">
              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-semibold">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  placeholder="Enter your name..."
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="school" className="form-label fw-semibold">
                  School
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="school"
                  name="school"
                  value={school}
                  onChange={handleChange}
                  placeholder="e.g. SILS, SPSE, etc."
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="grade" className="form-label fw-semibold">
                  Grade
                </label>
                <select
                  id="grade"
                  name="grade"
                  value={grade}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  {gradeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-dark">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
