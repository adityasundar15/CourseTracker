import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { ReactNode } from "react";
import "../App.css";

interface Props {
  to: string;
  children: ReactNode;
}

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="">
          <div className="d-inline-block me-3">
            <div
              className=""
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: "#ccc",
              }}
            ></div>
          </div>
          <span className="fs-4 fw-semi-bold">Course Tracker</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <CustomLink to="/">Home</CustomLink>
            <CustomLink to="/courses">Courses</CustomLink>
            <CustomLink to="/profile">Profile</CustomLink>
          </ul>
        </div>
      </div>
    </nav>
  );
}

function CustomLink({ to, children }: Props) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className="nav-item me-3">
      <Link to={to} className={`nav-link ${isActive ? "active" : ""}`}>
        {children}
      </Link>
    </li>
  );
}

export default Navbar;
