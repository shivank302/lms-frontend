import { useEffect, useState } from "react";
import BASE_URL from "../api";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Profile</h1>
      <p>{user.name}</p>
      <p>{user.email}</p>
      <p>{user.role}</p>
    </div>
  );
}