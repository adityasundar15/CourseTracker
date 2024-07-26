import "../css/Login.css";

import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { auth, db, signinWithGoogle } from "../firebase-config";
import { collection, doc, setDoc } from "firebase/firestore";
import { FaArrowRight } from "react-icons/fa6";

interface UserInfo {
  displayName: string;
  email: string;
  uid: string;
}

function Login() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const usersCollectionRef = collection(db, "users");

  const navigateHome = () => {
    navigate("/");
  };

  const navigateCourses = () => {
    navigate("/courses");
  };

  const navigateProfile = () => {
    navigate("/profile");
  };

  const handleSigninWithGoogle = async () => {
    await signinWithGoogle();
  };

  useEffect(() => {
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
      } else {
        console.log("User logged out, resetting state...");
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div id="parent-container" className="vh-100 d-flex flex-column">
      <div className="top-right-element position-absolute p-3">
        <Button className="" variant="" onClick={navigateHome} size="lg">
          <span className="mini-title text-center">Credit Ledger</span>
        </Button>
      </div>
      <div className="d-flex justify-content-center align-items-center flex-grow-1">
        <Col className="text-center">
          {currentUser ? (
            <>
              <Row className="pb-5">
                <span className="display-4">
                  Welcome, {currentUser.displayName}!
                </span>
              </Row>
              <Row>
                <Col>
                  <Button
                    className="d-flex justify-content-center align-items-center login-profile"
                    variant="bright"
                    onClick={navigateProfile}
                  >
                    <span
                      className="px-4 py-1"
                      style={{ fontFamily: "Outfit", fontWeight: 300 }}
                    >
                      Profile
                    </span>
                  </Button>
                </Col>
                <Col>
                  <Button
                    className="d-flex justify-content-center align-items-center"
                    variant="dark"
                    style={{
                      backgroundColor: "#000000",
                      borderRadius: "30px",
                      fontSize: "1.5rem",
                    }}
                    onClick={navigateCourses}
                  >
                    <span
                      className="px-4 py-1"
                      style={{ fontFamily: "Outfit", fontWeight: 300 }}
                    >
                      Go to Courses <FaArrowRight />
                    </span>
                  </Button>
                </Col>
              </Row>
            </>
          ) : (
            <>
              <Row className="pb-5">
                <span
                  className="display-4 d-flex justify-content-center align-items-center"
                  style={{ fontWeight: 400 }}
                >
                  Login
                </span>
              </Row>
              <Row>
                <Button
                  className="d-flex justify-content-center align-items-center"
                  variant="dark"
                  style={{
                    backgroundColor: "#000000",
                    borderRadius: "17px",
                    fontSize: "1.5rem",
                  }}
                  onClick={handleSigninWithGoogle}
                >
                  <span
                    className="px-4 py-1"
                    style={{ fontFamily: "Outfit", fontWeight: 300 }}
                  >
                    Continue with Google
                  </span>
                </Button>
              </Row>
            </>
          )}
        </Col>
      </div>
    </div>
  );
}

export default Login;
