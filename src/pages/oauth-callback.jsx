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
      <div className="alert alert-danger" role="alert">
        <p>{error}</p>
        <Link to="/login">Back to login</Link>
      </div>
    );
  }

  return <p role="status">Finishing Google sign-in...</p>;
}
