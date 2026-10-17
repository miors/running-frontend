import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Feed from "./pages/feed";
import Nav from "./components/nav";
import GuestOnly from "./components/guest-only";
import AuthProvider from "./components/auth-provider";
import RequireAuth from "./components/require-auth";
import UserProfile from "./pages/user-profile";
import OAuthCallback from "./pages/oauth-callback";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />
        <main className="container py-4">
          <Routes>
            <Route
              path="/signup"
              element={
                <GuestOnly>
                  <Signup />
                </GuestOnly>
              }
            />

            <Route
              path="/login"
              element={
                <GuestOnly>
                  <Login />
                </GuestOnly>
              }
            />
            <Route
              path="/feed"
              element={
                <RequireAuth>
                  <Feed />
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <UserProfile />
                </RequireAuth>
              }
            />
            <Route path="/auth/callback" element={<OAuthCallback />} />
            <Route path="*" element={<Navigate to="/feed" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
