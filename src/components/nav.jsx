import { NavLink } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import Brand from "./brand";

function Nav() {
  const { token, logout } = useContext(AuthContext);

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <Brand />

        <div className="nav-actions">
          {!token ? (
            <>
              <NavLink className="nav-link" to="/login">
                Login
              </NavLink>
              <NavLink className="nav-link nav-link--bright" to="/signup">
                Sign up
              </NavLink>
            </>
          ) : (
            <>
              <NavLink className="nav-link" to="/feed">
                Feed
              </NavLink>
              <NavLink className="nav-link" to="/profile">
                Profile
              </NavLink>
              <button type="button" className="nav-button" onClick={logout}>
                Log out
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Nav;
