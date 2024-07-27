import { slide as Menu } from "react-burger-menu";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { GrBook, GrHomeRounded } from "react-icons/gr";
import { FaRegUser } from "react-icons/fa";

interface MenuState {
  isOpen: boolean;
}

function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [isHome, setIsHome] = useState(location.pathname === "/");

  const handleMenuStateChange = (state: MenuState) => {
    setIsOpen(state.isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    setIsHome(location.pathname === "/");
  }, [location.pathname]);

  return (
    <Menu
      isOpen={isOpen}
      onStateChange={handleMenuStateChange}
      width={"23%"}
      pageWrapId={"page-wrap"}
      outerContainerId={"outer-container"}
      customCrossIcon={false}
      burgerBarClassName={isOpen || isHome ? "white-bg" : ""}
    >
      {/* <div className="container">
        <div className="row">
          <div className="col-md-9">
            <div className="d-flex justify-content-center align-items-center">
              <span className="menu-title menu-left-title text-center noselect">
                Credit
              </span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-5 offset-md-5">
            <div className="d-flex justify-content-center align-items-center">
              <span className="menu-title menu-right-title text-center noselect">
                Ledger
              </span>
            </div>
          </div>
        </div>
      </div> */}
      {/* <hr className="mt-5"></hr> */}
      <div className="h-100 position-relative">
        <Link
          id="home-link"
          className="menu-item noselect d-flex align-items-center"
          to="/"
          onClick={closeMenu}
        >
          <GrHomeRounded className="menu-icons" />
          Home
        </Link>
        <hr></hr>
        <Link
          id="courses-link"
          className="menu-item noselect d-flex align-items-center"
          to="/courses"
          onClick={closeMenu}
        >
          <GrBook className="menu-icons" />
          Courses
        </Link>
        <hr></hr>
        <Link
          to="/profile"
          className="menu-item noselect d-flex align-items-center"
          onClick={closeMenu}
        >
          <FaRegUser className="menu-icons" />
          Profile
        </Link>
        <div className="menu-footer d-flex justify-content-center">
          @ GDSC Waseda
        </div>
      </div>
    </Menu>
  );
}

export default BurgerMenu;
