import { useEffect, useState } from 'react';
import { database, signinWithGoogle, auth, db } from '../firebase-config.tsx';
import { onValue, ref } from 'firebase/database';
import { Course } from './Courses.tsx';
import {
  collection,
  setDoc,
  // getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<FirebaseCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<FirebaseCourse[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [schoolName, setSchoolName] = useState('PSE');
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const usersCollectionRef = collection(db, 'users');

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
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const currentUser: UserInfo = {
          displayName: user.displayName!,
          email: user.email!,
          uid: user.uid,
        };
        setCurrentUser(currentUser);
        createUser();
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const createUser = async () => {
    if (currentUser) {
      await setDoc(
        doc(usersCollectionRef, currentUser.uid),
        {
          displayName: currentUser.displayName,
          email: currentUser.email,
          uid: currentUser.uid,
        },
        { merge: true },
      );
    }
  };

  const handleSigninWithGoogle = async () => {
    await signinWithGoogle();
  };

  const handleSignOut = async () => {
    await auth.signOut();
  };

  const changeSchool = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSchoolName(e.currentTarget.textContent || ' ');
    setSearchTerm('');
  };

  const addCourse = (course: FirebaseCourse) => {
    // Convert FirebaseCourse to Course
    const newCourse: Course = {
      id: course.a,
      name: course.b,
      name_jp: course.c,
      credit: course.l,
      progress: 0, // Default progress value, incomplete
      school: schoolName,
    };

    if (!selectedCourses.find((c) => c.id === course.a)) {
      // Course is not already selected, add it to the state
      setSelectedCourses((prevSelectedCourses) => [
        ...prevSelectedCourses,
        newCourse,
      ]);
    }
  };

  const deleteCourse = (courseToDelete: Course) => {
    setSelectedCourses((prevSelectedCourses) =>
      prevSelectedCourses.filter((c) => c.id !== courseToDelete.id),
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: '0 0 60%', // Width for the left containers
          height: '100%', // Ensure it spans the full height
        }}
      >
        <div
          style={{
            textAlign: 'center',
            backgroundColor: 'lightblue',
            padding: '20px',
            margin: '10px',
            overflowY: 'auto', // Enable scrolling if content exceeds space
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
            textAlign: 'center',
            backgroundColor: 'lightgreen',
            padding: '20px',
            margin: '10px',
            overflowY: 'auto', // Enable scrolling if content exceeds space
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
          backgroundColor: 'red',
          padding: '20px',
          margin: '10px',
          overflowY: 'auto', // Enable scrolling if content exceeds space
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
              <button onClick={createUser}>Create User</button>
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
