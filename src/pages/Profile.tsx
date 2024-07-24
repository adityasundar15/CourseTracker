import "../css/Profile.css";

import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from "react-dropdown-select";
import { auth, signinWithGoogle } from "../firebase-config";
import { MdOutlineLogout } from "react-icons/md";

interface UserInfo {
  displayName: string;
  email: string;
  uid: string;
}

interface Major {
  value: string;
  label: string;
}

const schoolsAndMajors: Record<string, Major[]> = {
  "School of Political Science and Economics": [
    { value: "politicalScience", label: "Political Science" },
    { value: "economics", label: "Economics" },
    { value: "globalPoliticalEconomy", label: "Global Political Economy" },
  ],
  "School of Social Sciences": [
    {
      value: "taisi",
      label:
        "Transnational and Interdisciplinary Studies in Social Innovation Program (TAISI)",
    },
  ],
  "School of International Liberal Studies (SILS)": [
    {
      value: "internationalLiberalStudies",
      label: "International Liberal Studies",
    },
  ],
  "School of Culture, Media and Society": [
    { value: "transculturalStudies", label: "Transcultural Studies" },
    {
      value: "jculp",
      label: "Global Studies in Japanese Cultures Program (JCuIP)",
    },
  ],
  "School of Fundamental Science and Engineering": [
    { value: "mathematicalSciences", label: "Mathematical Sciences" },
    { value: "csce", label: "Computer Science and Communications Engineering" },
  ],
  "School of Creative Science and Engineering": [
    { value: "mechanicalEngineering", label: "Mechanical Engineering" },
    {
      value: "civilAndEnvironmentalEngineering",
      label: "Civil and Environmental Engineering",
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
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const currentUser: UserInfo = {
          displayName: user.displayName || "",
          email: user.email || "",
          uid: user.uid,
        };
        setCurrentUser(currentUser);
      } else {
        setCurrentUser(null);
        navigate("/login");
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
