import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Brand from "../components/brand";

export default function Login() {
  const { login, signInWithOauth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/feed");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-form-panel">
        <Brand />

        <div className="auth-copy">
          <p className="eyebrow">GOOD TO HAVE YOU BACK</p>
          <h1>Log in</h1>
          <p>Your running people are just ahead.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label className="field-label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
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
            <label className="field-label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className="field-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="button-primary">
            Log in
          </button>
          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}
        </form>

        <div className="auth-divider">or</div>
        <button
          type="button"
          className="button-secondary auth-google"
          onClick={signInWithOauth}
        >
          Continue with Google
        </button>

        <p className="auth-switch">
          No account? <Link to="/signup">Sign up</Link>
        </p>
      </div>

      <aside className="auth-visual" aria-label="Runners on a group run">
        <div className="auth-visual__copy">
          <span>ONE MORE MILE</span>
          <p>Small steps. Big days. Better together.</p>
        </div>
      </aside>
    </section>
  );
}
