import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Brand from "../components/brand";

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signup } = useContext(AuthContext);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await signup(email, password, username);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-form-panel">
        <Brand />

        <div className="auth-copy">
          <p className="eyebrow">FIND YOUR PACE</p>
          <h1>Create account</h1>
          <p>Make room for more good miles and good company.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label className="field-label" htmlFor="signup-username">
              Username
            </label>
            <input
              id="signup-username"
              className="field-input"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="signup-email">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              className="field-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="signup-password">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              className="field-input"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <button type="submit" className="button-primary">
            Sign up
          </button>
          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}
        </form>

        <p className="auth-switch">
          Have an account? <Link to="/login">Log in</Link>
        </p>
      </div>

      <aside className="auth-visual" aria-label="Runners on a group run">
        <div className="auth-visual__copy">
          <span>RUN YOUR WAY</span>
          <p>Every pace belongs. Every story counts.</p>
        </div>
      </aside>
    </section>
  );
}
