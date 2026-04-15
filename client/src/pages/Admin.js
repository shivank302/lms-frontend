import { useState } from "react";
import BASE_URL from "../api";

export default function Admin() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const addCourse = async () => {
    const res = await fetch(`${BASE_URL}/course`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ title, description })
    });

    const data = await res.json();
    alert(data.message || "Course Added ✅");

    setTitle("");
    setDescription("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl mb-6 text-center text-green-400">
        Admin Panel ⚙️
      </h1>

      <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-xl">
        <input
          className="w-full mb-3 p-2 rounded bg-gray-700"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="w-full mb-3 p-2 rounded bg-gray-700"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={addCourse}
          className="w-full bg-green-500 p-2 rounded hover:bg-green-600"
        >
          Add Course
        </button>
      </div>
    </div>
  );
}