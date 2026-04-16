import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api";

export default function Dashboard() {
  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ All courses (for enroll)
  useEffect(() => {
    fetch(`${BASE_URL}/courses`)
      .then(res => res.json())
      .then(data => setAllCourses(data));
  }, []);

  // ✅ Enrolled courses (with progress)
  useEffect(() => {
    fetch(`${BASE_URL}/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setMyCourses(data));
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
    window.location.reload(); // refresh to show in enrolled
  };

  const deleteCourse = async (id) => {
    await fetch(`${BASE_URL}/course/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    alert("Deleted ✅");
    setAllCourses(allCourses.filter(c => c._id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      <h1 className="text-4xl text-center text-blue-400 mb-8">
        LMS Dashboard 🚀
      </h1>

      <div className="flex justify-center gap-4 mb-8">
        <button onClick={() => navigate("/profile")} className="px-4 py-2 bg-gray-700 rounded">
          Profile
        </button>

        <button onClick={() => navigate("/admin")} className="px-4 py-2 bg-purple-600 rounded">
          Admin
        </button>

        <button onClick={logout} className="px-4 py-2 bg-red-500 rounded">
          Logout
        </button>
      </div>

      {/* 🔥 ALL COURSES */}
      <h2 className="text-2xl mb-4">All Courses 📚</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {allCourses.map((c) => (
          <div key={c._id} className="bg-gray-800 p-5 rounded-xl">
            <h2>{c.title}</h2>
            <p>{c.description}</p>

            <div className="flex gap-2 mt-3">
              <button onClick={() => navigate(`/course/${c._id}`)} className="bg-blue-500 px-2 py-1 rounded">
                Open
              </button>

              <button onClick={() => enroll(c._id)} className="bg-green-500 px-2 py-1 rounded">
                Enroll
              </button>

              <button onClick={() => deleteCourse(c._id)} className="bg-red-500 px-2 py-1 rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 MY COURSES (ENROLLED ONLY) */}
      <h2 className="text-2xl mb-4">My Courses 🎯</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {myCourses.map((item) => (
          <div key={item.course._id} className="bg-gray-800 p-5 rounded-xl">
            <h2>{item.course.title}</h2>
            <p>{item.course.description}</p>

            <p className="text-green-400">
              Progress: {item.progress}%
            </p>

            <button
              onClick={() => navigate(`/course/${item.course._id}`)}
              className="mt-2 bg-blue-500 px-2 py-1 rounded"
            >
              Continue
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}