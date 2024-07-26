import '../css/Profile.css';

import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Select from 'react-dropdown-select';
import { auth, signinWithGoogle } from '../firebase-config';
import { MdOutlineLogout } from 'react-icons/md';
import { Course } from './Courses';
import { updateCourseCategoriesInFirestore } from '../firestoreUtils';
import prebuiltList from '../prebuilt-categories.json';

interface UserInfo {
  displayName: string;
  email: string;
  uid: string;
}

interface Major {
  value: string;
  label: string;
}

interface CourseCategory {
  id: string;
  name: string;
  completed: number;
  total: number;
  picture: number;
  courses: Course[];
}

interface PrebuiltList {
  [key: string]: CourseCategory[];
}

const prebuiltListTyped: PrebuiltList = prebuiltList;

const schoolsAndMajors: Record<string, Major[]> = {
  'School of Political Science and Economics': [
    { value: 'PS', label: 'Political Science' },
    { value: 'ECON', label: 'Economics' },
    { value: 'GPE', label: 'Global Political Economy' },
  ],
  'School of Social Sciences': [
    {
      value: 'TAISI',
      label:
        'Transnational and Interdisciplinary Studies in Social Innovation Program (TAISI)',
    },
  ],
  'School of International Liberal Studies (SILS)': [
    {
      value: 'SILS(A)',
      label: 'International Liberal Studies (April)',
    },
    {
      value: 'SILS(S)',
      label: 'International Liberal Studies (September)',
    },
  ],
  'School of Culture, Media and Society': [
    { value: 'transculturalStudies', label: 'Transcultural Studies' },
    {
      value: 'JCULP',
      label: 'Global Studies in Japanese Cultures Program (JCuIP)',
    },
  ],
  'School of Fundamental Science and Engineering': [
    { value: 'MS', label: 'Mathematical Sciences' },
    { value: 'CSCE', label: 'Computer Science and Communications Engineering' },
  ],
  'School of Creative Science and Engineering': [
    { value: 'ME', label: 'Mechanical Engineering' },
    {
      value: 'CEE',
      label: 'Civil and Environmental Engineering',
    },
  ],
};

function Profile() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);
  const [categoryGenerated, setCategoryGenerated] = useState(false);

  const navigateHome = () => {
    navigate('/');
  };

  const handleSigninWithGoogle = async () => {
    await signinWithGoogle();
  };

  const handleSignOut = async () => {
    await auth.signOut();
    setCurrentUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const currentUser: UserInfo = {
          displayName: user.displayName || '',
          email: user.email || '',
          uid: user.uid,
        };
        setCurrentUser(currentUser);
      } else {
        setCurrentUser(null);
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSchoolChange = (values: { value: string; label: string }[]) => {
    setSelectedSchool(values[0]);
    setSelectedMajor(null);
  };

  const handleMajorChange = (values: Major[]) => {
    setSelectedMajor(values[0]);
  };

  const handleCategoryGeneration = (major: string) => {
    const selectedCategories = prebuiltListTyped[major];

    if (selectedCategories) {
      updateCourseCategoriesInFirestore(selectedCategories);
      localStorage.setItem(
        'courseCategories',
        JSON.stringify(selectedCategories),
      );
      console.log('Category added to local storage');
      setCategoryGenerated(true);
    } else {
      console.log(`No categories found for major: ${major}`);
    }
  };

  return (
    <div id="parent-container" className="vh-100 d-flex flex-column">
      <div className="top-right-element">
        <Button className="" variant="" onClick={navigateHome} size="lg">
          <span className="mini-title text-center">Credit Ledger</span>
        </Button>
      </div>
      <div className="d-flex justify-content-center align-items-center flex-grow-1">
        <div className="text-center">
          {currentUser ? (
            <>
              <div>
                <span className="prof-msg">
                  Welcome, {currentUser.displayName}!
                </span>
              </div>
              <div>
                <p>Email: {currentUser.email}</p>
              </div>
              <div>
                <Select
                  options={Object.keys(schoolsAndMajors).map((school) => ({
                    value: school,
                    label: school,
                  }))}
                  onChange={handleSchoolChange}
                  placeholder="Select your school"
                  values={selectedSchool ? [selectedSchool] : []}
                />
              </div>
              {selectedSchool && (
                <div>
                  <Select
                    options={schoolsAndMajors[selectedSchool.value]}
                    onChange={handleMajorChange}
                    placeholder="Select your major"
                    values={selectedMajor ? [selectedMajor] : []}
                  />
                </div>
              )}
              {selectedMajor && (
                <div>
                  <h2>Selected Major: {selectedMajor.label}</h2>
                  <h2>Selected Major: {selectedMajor.value}</h2>
                  {categoryGenerated ? (
                    <h2>Category Generated</h2>
                  ) : (
                    <button
                      onClick={() =>
                        handleCategoryGeneration(selectedMajor.value)
                      }
                    >
                      Generate Auto Categories
                    </button>
                  )}
                </div>
              )}
              <div className="py-4">
                <Button
                  className="sign-out"
                  variant="dark"
                  onClick={handleSignOut}
                >
                  <MdOutlineLogout className="px-1" size={27} />
                  <span className="">Sign Out</span>
                </Button>
              </div>
            </>
          ) : (
            <Button onClick={handleSigninWithGoogle}>
              Sign In With Google
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
