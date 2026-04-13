import { useState } from "react";

export default function Admin() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const addCourse = async () => {
    await fetch("http://localhost:5000/course", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ title, description })
    });

    alert("Course Added ✅");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl mb-4">Admin Panel</h1>

      <input
        className="block mb-2 p-2 bg-gray-700"
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="block mb-2 p-2 bg-gray-700"
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={addCourse}
        className="bg-blue-500 px-4 py-2 rounded"
      >
        Add Course
      </button>
    </div>
  );
}