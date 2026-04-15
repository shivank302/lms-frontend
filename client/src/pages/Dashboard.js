import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${BASE_URL}/courses`)
      .then(res => res.json())
      .then(data => setCourses(data));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const enroll = async (courseId) => {
    const res = await fetch(`${BASE_URL}/enroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ courseId })
    });

    const data = await res.json();
    alert(data.message);
  };

  const deleteCourse = async (id) => {
    await fetch(`${BASE_URL}/course/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    alert("Deleted ✅");
    setCourses(courses.filter(c => c._id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      
      <h1 className="text-4xl text-center text-blue-400 mb-8">
        LMS Dashboard 🚀
      </h1>

      <div className="flex justify-center gap-4 mb-8">
        <button onClick={() => navigate("/profile")} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
          Profile
        </button>

        <button onClick={() => navigate("/admin")} className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-500">
          Admin
        </button>

        <button onClick={logout} className="px-4 py-2 bg-red-500 rounded hover:bg-red-400">
          Logout
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {courses.map((c) => (
          <div key={c._id} className="bg-gray-800 p-5 rounded-2xl shadow-lg hover:scale-105 transition">
            <h2 className="text-xl text-blue-300">{c.title}</h2>
            <p className="text-gray-400">{c.description}</p>

            <div className="flex gap-2 mt-4">
              <button onClick={() => navigate(`/course/${c._id}`)} className="px-3 py-1 bg-blue-500 rounded">
                Open
              </button>

              <button onClick={() => enroll(c._id)} className="px-3 py-1 bg-green-500 rounded">
                Enroll
              </button>

              <button onClick={() => deleteCourse(c._id)} className="px-3 py-1 bg-red-500 rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}