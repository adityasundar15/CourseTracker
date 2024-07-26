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
import SelectedCategory from "./pages/Category.tsx";
import Login from "./pages/Login.tsx";

function App() {
  return (
    <>
      <div id="outer-container">
        <BurgerMenu />
        <main id="page-wrap">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<SelectedCategory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/welcome" element={<Welcome />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
