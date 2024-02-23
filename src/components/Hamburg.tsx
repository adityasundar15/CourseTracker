import { pushRotate as Menu } from "react-burger-menu";
import { Link } from "react-router-dom";
import { useState } from "react";

interface MenuState {
  isOpen: boolean;
}

function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuStateChange = (state: MenuState) => {
    setIsOpen(state.isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <Menu
      isOpen={isOpen}
      onStateChange={handleMenuStateChange}
      width={"17%"}
      pageWrapId={"page-wrap"}
      outerContainerId={"outer-container"}
      customCrossIcon={false}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-9">
            <div className="d-flex justify-content-center align-items-center">
              <span className="menu-title menu-left-title text-center">
                Credit
              </span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-5 offset-md-5">
            <div className="d-flex justify-content-center align-items-center">
              <span className="menu-title menu-right-title text-center">
                Ledger
              </span>
            </div>
          </div>
        </div>
      </div>

      <Link id="home-link" className="menu-item" to="/" onClick={closeMenu}>
        Home
      </Link>
      <Link
        id="courses-link"
        className="menu-item"
        to="/courses"
        onClick={closeMenu}
      >
        Courses
      </Link>
      <Link to="/profile" className="menu-item" onClick={closeMenu}>
        Profile
      </Link>
    </Menu>
  );
}

export default BurgerMenu;
