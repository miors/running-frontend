import { ENDPOINTS } from "../helper/endpoints";
import AuthContext from "../context/AuthContext";
import { useCallback, useState } from "react";
import { createClient } from "@supabase/supabase-js";

let supabaseClient;

function getSupabase() {
  if (!supabaseClient) {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!url || !key) {
      throw new Error("Supabase URL or publishable key is missing");
    }

    supabaseClient = createClient(url, key);
  }

  return supabaseClient;
}

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const logout = async () => {
    try {
      const { error } = await getSupabase().auth.signOut();
      if (error) console.error("Supabase sign-out failed:", error);
    } catch (error) {
      console.error("Supabase sign-out failed:", error);
    } finally {
      localStorage.removeItem("token");
      setToken(null);
    }
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

  async function signInWithOauth() {
    getSupabase().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });
  }

  const completeOAuthSignIn = useCallback(async () => {
    const {
      data: { session },
      error: sessionError,
    } = await getSupabase().auth.getSession();

    if (sessionError) throw sessionError;
    if (!session?.access_token) {
      throw new Error("No Supabase session found");
    }

    const response = await fetch(ENDPOINTS.oauthExchange, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(body.error || "Could not exchange OAuth token");
    }
    if (!body.token) {
      throw new Error("Backend did not return an app token");
    }

    localStorage.setItem("token", body.token);
    setToken(body.token);
  }, []);

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
        ...(options.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
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
    <AuthContext.Provider
      value={{
        token,
        login,
        signup,
        apiFetch,
        logout,
        signInWithOauth,
        completeOAuthSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
