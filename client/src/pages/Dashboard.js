import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/courses")
      .then(res => res.json())
      .then(data => setCourses(data));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const enroll = async (courseId) => {
    const res = await fetch("http://localhost:5000/enroll", {
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
    await fetch(`http://localhost:5000/course/${id}`, {
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
      
      <h1 className="text-3xl font-bold text-blue-500 mb-6">
        Dashboard 🚀
      </h1>

      {/* NAVBAR */}
      <div className="flex gap-3 mb-6">
        <button onClick={() => navigate("/profile")} className="px-4 py-2 bg-gray-700 rounded">
          Profile
        </button>

        <button onClick={() => navigate("/admin")} className="px-4 py-2 bg-gray-700 rounded">
          Admin
        </button>

        <button onClick={logout} className="px-4 py-2 bg-red-500 rounded">
          Logout
        </button>
      </div>

      <h2 className="text-2xl mb-4">📚 Courses</h2>

      {courses.length === 0 ? (
        <p>No courses available 😅</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {courses
            .filter(c => c.title) // 🔥 empty wala remove
            .map((c) => (
              <div
                key={c._id}
                className="p-4 bg-gray-800 rounded-xl shadow-md"
              >
                <h3 className="text-xl font-semibold">{c.title}</h3>
                <p className="text-gray-300">{c.description}</p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => navigate(`/course/${c._id}`)}
                    className="px-3 py-1 bg-blue-500 rounded"
                  >
                    Open
                  </button>

                  <button
                    onClick={() => enroll(c._id)}
                    className="px-3 py-1 bg-green-500 rounded"
                  >
                    Enroll
                  </button>

                  <button
                    onClick={() => deleteCourse(c._id)}
                    className="px-3 py-1 bg-red-500 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}