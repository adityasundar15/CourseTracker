import "./App.css";
import Navbar from "./components/Navbar.tsx";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Courses from "./pages/Courses.tsx";
import Profile from "./pages/Profile.tsx";
import PopUp from "./components/InitModal.tsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <PopUp />
    </>
  );
}

export default App;
