import "../css/Profile.css";

import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from "react-dropdown-select";
import { auth, db, signinWithGoogle } from "../firebase-config";

import { Course } from "./Courses";
import { updateCourseCategoriesInFirestore } from "../firestoreUtils";
import prebuiltList from "../prebuilt-categories.json";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";

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
  "School of Political Science and Economics": [
    { value: "PS", label: "Political Science" },
    { value: "ECON", label: "Economics" },
    { value: "GPE", label: "Global Political Economy" },
  ],
  "School of Social Sciences": [
    {
      value: "TAISI",
      label:
        "Transnational and Interdisciplinary Studies in Social Innovation Program (TAISI)",
    },
  ],
  "School of International Liberal Studies (SILS)": [
    {
      value: "SILS(A)",
      label: "International Liberal Studies (April)",
    },
    {
      value: "SILS(S)",
      label: "International Liberal Studies (September)",
    },
  ],
  "School of Culture, Media and Society": [
    { value: "transculturalStudies", label: "Transcultural Studies" },
    {
      value: "JCULP",
      label: "Global Studies in Japanese Cultures Program (JCuIP)",
    },
  ],
  "School of Fundamental Science and Engineering": [
    { value: "MS", label: "Mathematical Sciences" },
    { value: "CSCE", label: "Computer Science and Communications Engineering" },
  ],
  "School of Creative Science and Engineering": [
    { value: "ME", label: "Mechanical Engineering" },
    {
      value: "CEE",
      label: "Civil and Environmental Engineering",
    },
  ],
};

const gradeOptions = [
  { value: "1st", label: "1st Year" },
  { value: "2nd", label: "2nd Year" },
  { value: "3rd", label: "3rd Year" },
  { value: "4th", label: "4th Year" },
  { value: "5th+", label: "5th Year or above" },
];

function Profile() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const navigateHome = () => {
    navigate("/");
  };

  const handleSigninWithGoogle = async () => {
    await signinWithGoogle();
  };

  const handleSignOut = async () => {
    await auth.signOut();
    setCurrentUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const currentUser: UserInfo = {
          displayName: user.displayName || "",
          email: user.email || "",
          uid: user.uid,
        };
        setCurrentUser(currentUser);
        await fetchUserDetailInfo(currentUser.uid);
      } else {
        setCurrentUser(null);
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchUserDetailInfo = async (uid: string) => {
    try {
      console.log("Fetching detail info for user:", uid);
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("User data from API:", userData); // Log raw user data

        // Replace local storage with API data
        const apiUserDetail = userData?.UserDetail || null;
        console.log(apiUserDetail);
        if (apiUserDetail) {
          localStorage.setItem("UserDetail", JSON.stringify(apiUserDetail));
        } else {
          localStorage.removeItem("UserDetail"); // Clear local storage if no UserDetail exists in API
        }
      }

      const storedUserDetail = localStorage.getItem("UserDetail");
      if (storedUserDetail) {
        const storedUserDetailParsed = JSON.parse(storedUserDetail);
        console.log(
          "Updated stored UserDetail from local storage:",
          storedUserDetailParsed
        );
        setSelectedSchool(storedUserDetailParsed.school);
        setSelectedMajor(storedUserDetailParsed.major);
        setSelectedGrade(storedUserDetailParsed.grade);
      } else {
        console.log("No stored UserDetail in local storage.");
      }
    } catch (error) {
      console.error("Error fetching selected courses: ", error);
    }
  };

  const handleSchoolChange = (values: { value: string; label: string }[]) => {
    setSelectedSchool(values[0]);
  };

  const handleMajorChange = (values: Major[]) => {
    setSelectedMajor(values[0]);
  };

  const handleGradeChange = (values: { value: string; label: string }[]) => {
    setSelectedGrade(values[0]);
  };

  const handleCategoryGeneration = async (major: string) => {
    const selectedCategories = prebuiltListTyped[major];
    const currentUser = auth.currentUser;
    const userDetail = {
      school: { value: selectedSchool?.value, label: selectedSchool?.label },
      major: { value: selectedMajor?.value, label: selectedMajor?.label },
      grade: { value: selectedGrade?.value, label: selectedGrade?.label },
    };

    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);
      await setDoc(
        userDocRef,
        {
          UserDetail: userDetail,
        },
        { merge: true }
      );
      localStorage.setItem("UserDetail", JSON.stringify(userDetail));
    }

    if (selectedCategories) {
      const pictureIndices = [1, 2, 3, 4];
      selectedCategories.forEach((category) => {
        category.id = uuidv4();
        const randomIndex = Math.floor(Math.random() * pictureIndices.length);
        category.picture = pictureIndices[randomIndex];
      });

      updateCourseCategoriesInFirestore(selectedCategories);
      localStorage.setItem(
        "courseCategories",
        JSON.stringify(selectedCategories)
      );
      console.log("Category added to local storage with randomized pictures");
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
      <motion.div
        layout
        initial={{ opacity: 0, x: -200 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="d-flex justify-content-start align-items-center profile-wrapper"
      >
        <div className="m-3 profile-container w-100">
          {currentUser ? (
            <>
              <div className="pb-2">
                <span className="prof-msg">
                  Hello, {currentUser.displayName}
                </span>
                <div className="prof-email">{currentUser.email}</div>
              </div>
              <div className="prof-major py-3">
                <div className="prof-sub-header pb-2">School</div>
                <Select
                  className="prof-dropdown"
                  options={Object.keys(schoolsAndMajors).map((school) => ({
                    value: school,
                    label: school,
                  }))}
                  onChange={handleSchoolChange}
                  placeholder="Select your school"
                  values={selectedSchool ? [selectedSchool] : []}
                  searchable
                />
                {selectedSchool && (
                  <div className="py-2">
                    <Select
                      className="prof-dropdown"
                      options={schoolsAndMajors[selectedSchool.value]}
                      onChange={handleMajorChange}
                      placeholder="Select your major"
                      values={selectedMajor ? [selectedMajor] : []}
                      searchable
                    />
                  </div>
                )}
              </div>
              <div className="prof-grade py-3">
                <div className="prof-sub-header pb-2">Grade</div>
                <Select
                  className="prof-dropdown"
                  options={gradeOptions}
                  onChange={handleGradeChange}
                  placeholder="Select your grade"
                  values={selectedGrade ? [selectedGrade] : []}
                />
              </div>
              <div className="pt-4 pb-3 d-flex align-content-center justify-content-center">
                <Button
                  className="save-button px-5 py-2"
                  variant="dark"
                  onClick={() => {
                    if (selectedMajor)
                      return handleCategoryGeneration(selectedMajor.value);
                  }}
                >
                  <span className="">Save</span>
                </Button>
              </div>
              <div className="d-flex align-content-center justify-content-center">
                <Button
                  className="sign-out px-5"
                  variant=""
                  onClick={handleSignOut}
                >
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
      </motion.div>
    </div>
  );
}

export default Profile;
