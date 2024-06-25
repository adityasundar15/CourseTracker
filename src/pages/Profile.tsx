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

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
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
          { merge: true }
        );
        await fetchSelectedCourses(currentUser.uid); // Fetch selected courses for the authenticated user
      } else {
        setCurrentUser(null);
        setSelectedCourses([]); // Reset selected courses on logout
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchSelectedCourses = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setSelectedCourses(userData?.Advance || []);
      } else {
        setSelectedCourses([]); // Reset if no data exists
      }
    } catch (error) {
      console.error("Error fetching selected courses: ", error);
    }
  };

  const handleSigninWithGoogle = async () => {
    await signinWithGoogle();
  };

  const handleSignOut = async () => {
    await auth.signOut();
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
          <div className="right-section">
            {currentUser ? (
              <div>
                <p>Display Name: {currentUser.displayName}</p>
                <p>Email: {currentUser.email}</p>
                <p>UID: {currentUser.uid}</p>
                <button onClick={handleSignOut}>Sign Out</button>
                <div
                  style={{
                    textAlign: "center",
                    backgroundColor: "lightgreen",
                    padding: "20px",
                    margin: "10px",
                    overflowY: "auto", // Enable scrolling if content exceeds space
                    flex: 1, // Expand to fill available space
                  }}
                >
                  <div className="query-section">
                    <div className="query-outcome">
                      {selectedCourses.map((course) => (
                        <div key={course.id}>
                          <p>Course Title: {course.name}</p>
                          <p>Course ID: {course.id}</p>
                          <button onClick={() => course}>Delete course</button>
                        </div>
                      ))}
                    </div>
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
