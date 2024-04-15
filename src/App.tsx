import "./fonts/fonts.css";
import "./fonts/ClashDisplay/ClashDisplay-Bold.otf";
import "./fonts/ClashDisplay/ClashDisplay-Extralight.otf";
import "./fonts/ClashDisplay/ClashDisplay-Light.otf";
import "./fonts/ClashDisplay/ClashDisplay-Medium.otf";
import "./fonts/ClashDisplay/ClashDisplay-Regular.otf";
import "./fonts/ClashDisplay/ClashDisplay-Semibold.otf";

import "./App.css";

import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Courses from "./pages/Courses.tsx";
import Profile from "./pages/Profile.tsx";
import BurgerMenu from "./components/Hamburg.tsx";
import Welcome from "./pages/welcome.tsx";
import Introductory from "./pages/courses/Introductory.tsx";
import Intermediate from "./pages/courses/Intermediate.tsx";
import Advanced from "./pages/courses/Advanced.tsx";
import Language from "./pages/courses/Language.tsx";
import Seminar from "./pages/courses/Seminar.tsx";



function App() {
  return (
    <>
      <div id="outer-container">
        <BurgerMenu />
        <main id="page-wrap">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/introductory" element={<Introductory />} />
            <Route path="/intermediate" element={<Intermediate />} />
            <Route path="/advanced" element={<Advanced />} />
            <Route path="/language" element={<Language />} />
            <Route path="/seminar" element={<Seminar />} />
          </Routes>
          {/* <PopUp /> */}
        </main>
      </div>
    </>
  );
}

export default App;
