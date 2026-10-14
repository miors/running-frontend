import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

function Nav() {
  const { token, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/feed">
          Running Social
        </Link>

        <div className="ms-auto d-flex align-items-center gap-2">
          {!token ? (
            <>
              <Link className="btn btn-outline-light btn-sm" to="/login">
                Login
              </Link>
              <Link className="btn btn-light btn-sm" to="/signup">
                Sign up
              </Link>
            </>
          ) : (
            <>
              <Link className="nav-link text-white" to="/feed">
                Feed
              </Link>
              <Link className="nav-link text-white" to="/profile">
                Profile
              </Link>
              <button
                type="button"
                className="btn btn-outline-light btn-sm"
                onClick={logout}
              >
                Log out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;
