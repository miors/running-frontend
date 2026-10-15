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
        console.log(data);
        if (!res.ok) throw new Error(data.error || "User not found");

        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    }

    loadUser();
  }, []);

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading profile...</p>;

  return (
    <div>
      <h1>{user.username}</h1>
      <p>Email: {user.email}</p>
      <p>Average Heart Rate: {user.average_heart_rate ?? "N/A"}</p>
      <p>Experience Level: {user.experience_level ?? "N/A"}</p>
    </div>
  );
}
