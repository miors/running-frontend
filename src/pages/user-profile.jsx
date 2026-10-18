import { useEffect, useState } from "react";
import { ENDPOINTS } from "../helper/endpoints";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${ENDPOINTS.profile}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "User not found");

        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    }

    loadUser();
  }, []);

  if (error) {
    return (
      <div className="page-state profile-error" role="alert">
        <p>{error}</p>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="page-state" role="status">
        <p>Loading your athlete profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <header className="profile-page-header">
        <p className="section-kicker">ATHLETE PROFILE</p>
        <h1 className="profile-title">Your running profile</h1>
      </header>

      <section className="profile-panel" aria-labelledby="profile-name">
        <header className="profile-identity">
          <span className="profile-avatar" aria-hidden="true">
            {(user.username || "R").slice(0, 1).toUpperCase()}
          </span>
          <div>
            <h2 id="profile-name">{user.username}</h2>
            <p>{user.email}</p>
          </div>
        </header>

        <h3 className="profile-stats-heading">Running stats</h3>
        <div className="profile-stats">
          <div className="profile-stat">
            <span>Average heart rate</span>
            <strong>{user.average_heart_rate ?? "N/A"}</strong>
          </div>
          <div className="profile-stat">
            <span>Experience level</span>
            <strong>{user.experience_level ?? "N/A"}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
