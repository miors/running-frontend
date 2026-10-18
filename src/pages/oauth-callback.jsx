import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function OAuthCallback() {
  const { completeOAuthSignIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const started = useRef(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    completeOAuthSignIn()
      .then(() => navigate("/feed", { replace: true }))
      .catch((err) => {
        setError(err.message || "Google sign-in failed");
      });
  }, [completeOAuthSignIn, navigate]);

  if (error) {
    return (
      <section className="oauth-status" role="alert">
        <span className="status-mark" aria-hidden="true">
          !
        </span>
        <h1>Sign-in could not finish</h1>
        <p>{error}</p>
        <Link className="auth-back-link" to="/login">
          Back to login
        </Link>
      </section>
    );
  }

  return (
    <section className="oauth-status" role="status">
      <span className="status-mark" aria-hidden="true">
        ...
      </span>
      <h1>Finishing sign-in</h1>
      <p>Connecting your account to the running community.</p>
    </section>
  );
}
