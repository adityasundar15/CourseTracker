import { pushRotate as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface MenuState {
  isOpen: boolean;
}

function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  // const location = useLocation();
  // const [isHome, setIsHome] = useState(location.pathname === "/");

  const handleMenuStateChange = (state: MenuState) => {
    setIsOpen(state.isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // useEffect(() => {
  //   setIsHome(location.pathname === "/");
  // }, [location.pathname]);

  return (
    <Menu
      isOpen={isOpen}
      onStateChange={handleMenuStateChange}
      width={'17%'}
      pageWrapId={'page-wrap'}
      outerContainerId={'outer-container'}
      customCrossIcon={false}
      // burgerBarClassName={isHome ? "white-bg" : ""}
    >
      <div className="container">
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
      </div>
      <hr className="mt-5"></hr>
      <Link
        id="home-link"
        className="menu-item noselect"
        to="/"
        onClick={closeMenu}
      >
        Home
      </Link>
      <hr></hr>
      <Link
        id="courses-link"
        className="menu-item noselect"
        to="/courses"
        onClick={closeMenu}
      >
        Courses
      </Link>
      <hr></hr>
      <Link to="/profile" className="menu-item noselect" onClick={closeMenu}>
        Profile
      </Link>
      <hr></hr>
      {/* <Link to="/test3" className="menu-item noselect" onClick={closeMenu}>
        Test3
      </Link>
      <hr></hr> */}
      {/* <Link to="/test4" className="menu-item noselect" onClick={closeMenu}>
        Test4
      </Link> */}
      {/* <hr></hr> */}
    </Menu>
  );
}

export default BurgerMenu;
