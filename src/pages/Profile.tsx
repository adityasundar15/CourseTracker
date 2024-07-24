import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { auth, db, signinWithGoogle } from "../firebase-config";
import { Course } from "./Courses";

interface UserInfo {
  displayName: string;
  email: string;
  uid: string;
}

interface CourseCategory {
  id: string;
  name: string;
  completed: number;
  total: number;
  picture: number;
  courses: Course[];
}

function Profile() {
  const navigate = useNavigate();

  const navigateHome = () => {
    navigate("/");
  };

  const navigateWelcome = () => {
    navigate("/welcome");
  };

  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState("");
  const [userDataExists, setUserDataExists] = useState(false);
  const [greetingName, setGreetingName] = useState("");
  const [signIn, setSignIn] = useState(false);

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
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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
    navigateWelcome();
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

  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const usersCollectionRef = collection(db, "users");
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [courseCategories, setCourseCategories] = useState<CourseCategory[]>(
    [],
  );

  useEffect(() => {
    // Listen for authentication state changes
    const handleUserState = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log("User logged in, fetching selected courses...");
        const currentUser: UserInfo = {
          displayName: user.displayName!,
          email: user.email!,
          uid: user.uid,
        };
        setCurrentUser(currentUser);
        // Create user document in Firestore
        await setDoc(
          doc(usersCollectionRef, currentUser.uid),
          {
            uid: currentUser.uid,
          },
          { merge: true },
        );
        await fetchSelectedCourses(currentUser.uid); // Fetch selected courses for the authenticated user
      } else {
        console.log("User logged out, resetting state...");
        setCurrentUser(null);
        setSelectedCourses([]); // Reset selected courses on logout
        setCourseCategories([]); // Reset course categories on logout
      }
    });
    return () => handleUserState();
  }, [signIn]);

  const fetchSelectedCourses = async (uid: string) => {
    try {
      console.log("Fetching selected courses for user:", uid);
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("User data from API:", userData); // Log raw user data
        setSelectedCourses(userData?.Categories || []);

        // Replace local storage with API data
        const apiCategories = userData?.Categories || [];
        localStorage.setItem("courseCategories", JSON.stringify(apiCategories));
        setCourseCategories(apiCategories);
      } else {
        setSelectedCourses([]); // Reset if no data exists
        localStorage.removeItem("courseCategories"); // Clear local storage if no data exists in API
        setCourseCategories([]);
      }

      const storedCategories = localStorage.getItem("courseCategories");
      if (storedCategories) {
        console.log(
          "Updated stored categories from local storage:",
          JSON.parse(storedCategories),
        );
      } else {
        console.log("No stored categories in local storage.");
      }
    } catch (error) {
      console.error("Error fetching selected courses: ", error);
    }
  };

  const handleSigninWithGoogle = async () => {
    await signinWithGoogle();
    setSignIn((cur) => !cur);
  };

  const handleSignOut = async () => {
    await auth.signOut();
    setSignIn((cur) => !cur);
  };

  return (
    <div id="parent-container">
      <div className="top-right-element">
        <Button className="" variant="" onClick={navigateHome} size="lg">
          <span className="mini-title text-center">Credit Ledger</span>
        </Button>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <Stack>
          <div>
            <h1 className="text-center prof-msg noselect">{message}</h1>
          </div>
          <div className="mt-3">
            <form onSubmit={handleSubmit} className="" autoComplete="off">
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
              <div className="justify-content-center d-grid">
                <Button
                  type="submit"
                  size="lg"
                  className="btn btn-dark save-prof"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
          <div className="user-section">
            {currentUser ? (
              <div>
                <p>Display Name: {currentUser.displayName}</p>
                <p>Email: {currentUser.email}</p>
                <p>UID: {currentUser.uid}</p>
                <button onClick={handleSignOut}>Sign Out</button>
                <div className="query-section">
                  <div className="query-outcome">
                    <h2>Selected Courses</h2>
                    {selectedCourses.map((course) => (
                      <div key={course.id}>
                        <p>Course Title: {course.name}</p>
                        <p>Course ID: {course.id}</p>
                      </div>
                    ))}
                    <h2>Course Categories</h2>
                    {courseCategories.map((category) => (
                      <div key={category.id}>
                        <p>Category Name: {category.name}</p>
                        <p>Completed: {category.completed}</p>
                        <p>Total: {category.total}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <button onClick={handleSigninWithGoogle}>
                Sign In With Google
              </button>
            )}
          </div>
        </Stack>
      </div>
    </div>
  );
}
export default Profile;
