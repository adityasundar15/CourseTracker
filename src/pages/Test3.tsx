import { useEffect, useState } from "react";
import { database, signinWithGoogle, auth, db } from "../firebase-config.tsx";
import { onValue, ref } from "firebase/database";
import { Course } from "./Courses.tsx";
import { collection, setDoc, getDoc, updateDoc, doc } from "firebase/firestore";

// FirebaseCourse interface matching the structure
interface FirebaseCourse {
  a: string; // id
  b: string; // title
  c: string; // title_jp
  d: string; // instructor
  e: string; // instructor_jp
  f: string; // lang
  g: string; // type
  h: string; // term
  i: string; // occurrences
  j: string; // min_year
  k: string; // category
  l: number; // credit
  m: string; // level
  n: string; // eval
  o: string; // code
  p: string; // subtitle
}

interface UserInfo {
  displayName: string;
  email: string;
  uid: string;
}

function Test3() {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<FirebaseCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<FirebaseCourse[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [schoolName, setSchoolName] = useState("PSE");
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [signIn, setSignIn] = useState(false);
  const usersCollectionRef = collection(db, "users");

  useEffect(() => {
    // Fetch data from Firebase
    const coursesRef = ref(database, schoolName); // Default reference is PSE, this hook will rerender the ui whenever the schoolName is changed
    onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fullCoursesArray: FirebaseCourse[] = Object.values(data);
        setCourses(fullCoursesArray);
      }
    });
  }, [schoolName]);

  useEffect(() => {
    // This hook rerenders the UI whenever the input in the search input field changes
    const filtered = courses.filter(
      (course) =>
        course.b.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.a.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  useEffect(() => {
    // Listen for authentication state changes
    const handleUserState = auth.onAuthStateChanged(async (user) => {
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
          { merge: true },
        );
        await fetchSelectedCourses(currentUser.uid); // Fetch selected courses for the authenticated user
      } else {
        setCurrentUser(null);
        setSelectedCourses([]); // Reset selected courses on logout
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
        setSelectedCourses(userData?.Categories || []);
      } else {
        setSelectedCourses([]); // Reset if no data exists
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

  const changeSchool = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSchoolName(e.currentTarget.textContent || " ");
    setSearchTerm("");
  };

  const addCourse = async (course: FirebaseCourse) => {
    if (!currentUser) {
      console.error("User is not authenticated");
      window.alert("Please login first!!!");
      return;
    }
    // Convert FirebaseCourse to Course
    const newCourse: Course = {
      id: course.a,
      name: course.b,
      name_jp: course.c,
      credit: course.l,
      progress: 0, // Default progress value, incomplete
      school: schoolName,
    };

    try {
      const userDocRef = doc(db, "users", currentUser?.uid);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.data();
      const currentSelectedCourses = userData?.Catagories || [];

      if (!currentSelectedCourses.find((c: Course) => c.id === newCourse.id)) {
        // Update Firestore with the new course
        await updateDoc(userDocRef, {
          Categories: [...currentSelectedCourses, newCourse],
        });

        // Update the state to reflect the new selected course
        setSelectedCourses([...currentSelectedCourses, newCourse]);
      } else {
        console.log("Course already selected");
        alert("Course already selected");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const deleteCourse = async (courseToDelete: Course) => {
    try {
      if (!currentUser?.uid) {
        throw new Error("User is not authenticated");
      }

      // Fetch the latest selected courses from Firestore
      const userDocRef = doc(db, "users", currentUser?.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
      const currentSelectedCourses = userData?.Categories || [];

      // Filter out the course to be deleted
      const updatedCourses = currentSelectedCourses.filter(
        (c: Course) => c.id !== courseToDelete.id,
      );

      // Update Firestore with the updated course list
      await updateDoc(userDocRef, {
        Advance: updatedCourses,
      });

      // Update the state to reflect the deletion
      setSelectedCourses(updatedCourses);
    } catch (error) {
      console.error("Error deleting course from Firestore: ", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: "0 0 60%", // Width for the left containers
          height: "100%", // Ensure it spans the full height
        }}
      >
        <div
          style={{
            textAlign: "center",
            backgroundColor: "lightblue",
            padding: "20px",
            margin: "10px",
            overflowY: "auto", // Enable scrolling if content exceeds space
            flex: 1, // Expand to fill available space
          }}
        >
          <button onClick={changeSchool}>FSE</button>
          <button onClick={changeSchool}>PSE</button>
          <div>Showing courses of {schoolName}</div>
          <div className="search-section">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="query-outcome">
              {filteredCourses.map((course) => (
                <div key={course.a}>
                  <p>Course Title: {course.b}</p>
                  <p>Course ID: {course.a}</p>
                  <button onClick={() => addCourse(course)}>Add course</button>
                </div>
              ))}
            </div>
          </div>
        </div>
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
                  <button onClick={() => deleteCourse(course)}>
                    Delete course
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          backgroundColor: "red",
          padding: "20px",
          margin: "10px",
          overflowY: "auto", // Enable scrolling if content exceeds space
          flex: 1, // Expand to fill available space
        }}
      >
        <div className="right-section">
          {currentUser ? (
            <div>
              <p>Display Name: {currentUser.displayName}</p>
              <p>Email: {currentUser.email}</p>
              <p>UID: {currentUser.uid}</p>
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
          ) : (
            <button onClick={handleSigninWithGoogle}>
              Sign In With Google
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Test3;
