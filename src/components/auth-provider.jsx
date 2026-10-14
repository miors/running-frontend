import { ENDPOINTS } from "../helper/endpoints";
import AuthContext from "../context/AuthContext";
import { useState } from "react";

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  async function signup(email, password, username) {
    const data = await apiFetch(ENDPOINTS.signup, {
      method: "POST",
      body: JSON.stringify({ email, password, username }),
    });

    const newToken =
      data.token || data.access_token || data.session?.access_token;

    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
    }

    return data;
  }

  async function login(email, password) {
    const data = await apiFetch(ENDPOINTS.login, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const newToken =
      data.token || data.access_token || data.session?.access_token;
    if (!newToken) throw new Error("No token returned from /login");
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }
  async function apiFetch(url, options = {}) {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    const body = await res.json().catch(() => ({}));

    if (res.status === 401 && token) logout();
    if (!res.ok) {
      const err = body.error?.message || body.error || body.message;
      throw new Error(err || `Request failed (${res.status})`);
    }
    return body.data ?? body;
  }
  return (
    <AuthContext.Provider value={{ token, login, signup, apiFetch, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
