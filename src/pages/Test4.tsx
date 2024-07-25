import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Button, Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { auth, db, signinWithGoogle } from '../firebase-config';
import { Course } from './Courses';
import { updateCourseCategoriesInFirestore } from '../firestoreUtils';
import { v4 as uuidv4 } from 'uuid';
import { MS, CSCE, ME, CEE } from '../prebuilt-categories.json';

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

const prebuiltCategory: CourseCategory = {
  id: uuidv4(),
  name: 'Test Category',
  completed: 0,
  total: 15,
  picture: 1,
  courses: [],
};

function Test4() {
  const navigate = useNavigate();

  const navigateHome = () => {
    navigate('/');
  };

  // const navigateWelcome = () => {
  //   navigate('/welcome');
  // };

  const [name, setName] = useState('');
  // const [school, setSchool] = useState('');
  // const [grade, setGrade] = useState('');
  const [userDataExists, setUserDataExists] = useState(false);
  const [greetingName, setGreetingName] = useState('');
  const [signIn, setSignIn] = useState(false);

  useEffect(() => {
    // Check if userData exists in local storage
    const userDataJSON = localStorage.getItem('userData');
    if (userDataJSON) {
      setUserDataExists(true);
      const userData = JSON.parse(userDataJSON);
      // Update state with userData values
      setName(userData.name);
      // setSchool(userData.school);
      // setGrade(userData.grade);
      setGreetingName(userData.name);
    }
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    switch (name) {
      case 'name':
        setName(value);
        break;

      case 'major':
        setSelectedMajor(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!currentUser) {
      alert('User is not authenticated');
    }

    event.preventDefault(); // Prevent default form submission behavior
    const userData = {
      name: name,
      major: selectedMajor,
    };
    const userDataJSON = JSON.stringify(userData);
    localStorage.setItem('userData', userDataJSON);
    setUserDataExists(true);
    console.log('Name:', name);
    console.log('Major:', selectedMajor);
    console.log(userData);

    setGreetingName(name);
    if (userData.major) {
      console.log('There is a mojor');
      updatePrebuiltCategoriesInFirestore(userData.major);
      localStorage.setItem(
        'courseCategories',
        JSON.stringify([prebuiltCategory]),
      );
      console.log('Category added to local storage');
    } else {
      console.log("User didn't select major");
    }
  };

  function updatePrebuiltCategoriesInFirestore(major: string) {
    if (major === 'MS') {
      updateCourseCategoriesInFirestore(MS);
    }
    if (major === 'CSCE') {
      updateCourseCategoriesInFirestore(CSCE);
    }
    if (major === 'ME') {
      updateCourseCategoriesInFirestore(ME);
    }
    if (major === 'CEE') {
      updateCourseCategoriesInFirestore(CEE);
    }
  }

  const message = userDataExists
    ? `Welcome Back, ${greetingName}!`
    : 'Create Your Profile';

  const majorOptions = [
    { value: '', label: 'Select Major' },
    { value: 'MS', label: 'Mathematical Science' },
    { value: 'CSCE', label: 'Computer Science and Communications Enginnering' },
    { value: 'ME', label: 'Mechnical Engineering' },
    { value: 'CEE', label: 'Civil and Environmental Engineering' },
  ];

  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const usersCollectionRef = collection(db, 'users');
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [courseCategories, setCourseCategories] = useState<CourseCategory[]>(
    [],
  );
  const [selectedMajor, setSelectedMajor] = useState('');

  useEffect(() => {
    // Listen for authentication state changes
    const handleUserState = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log('User logged in, fetching selected courses...');
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
        console.log('User logged out, resetting state...');
        setCurrentUser(null);
        setSelectedCourses([]); // Reset selected courses on logout
        setCourseCategories([]); // Reset course categories on logout
      }
    });
    return () => handleUserState();
  }, [signIn]);

  const fetchSelectedCourses = async (uid: string) => {
    try {
      console.log('Fetching selected courses for user:', uid);
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('User data from API:', userData); // Log raw user data
        setSelectedCourses(userData?.Categories || []);

        // Replace local storage with API data
        const apiCategories = userData?.Categories || [];
        localStorage.setItem('courseCategories', JSON.stringify(apiCategories));
        setCourseCategories(apiCategories);
      } else {
        setSelectedCourses([]); // Reset if no data exists
        localStorage.removeItem('courseCategories'); // Clear local storage if no data exists in API
        setCourseCategories([]);
      }

      const storedCategories = localStorage.getItem('courseCategories');
      if (storedCategories) {
        console.log(
          'Updated stored categories from local storage:',
          JSON.parse(storedCategories),
        );
      } else {
        console.log('No stored categories in local storage.');
      }
    } catch (error) {
      console.error('Error fetching selected courses: ', error);
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

  const testBUttonFunction = () => {
    console.log(MS);
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
                <label htmlFor="grade" className="form-label fw-semibold">
                  Major
                </label>
                <select
                  id="major"
                  name="major"
                  value={selectedMajor}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  {majorOptions.map((option) => (
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
              <div>
                <button onClick={testBUttonFunction}>Test</button>
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
                        {/* <p>Course Title: {course.name}</p>
                        <p>Course ID: {course.id}</p> */}
                      </div>
                    ))}
                    <h2>Course Categories</h2>
                    {courseCategories.map((category) => (
                      <div key={category.id}>
                        {/* <p>Category Name: {category.name}</p>
                        <p>Completed: {category.completed}</p>
                        <p>Total: {category.total}</p> */}
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
export default Test4;
