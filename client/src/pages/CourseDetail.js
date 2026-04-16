import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import BASE_URL from "../api";

export default function CourseDetail() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(0);
  const [answer, setAnswer] = useState("");

  // ✅ 1. Course fetch
  useEffect(() => {
    fetch(`${BASE_URL}/courses`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(c => c._id === id);
        setCourse(found);
      });
  }, [id]);

  // ✅ 2. AUTO LOAD PROGRESS (IMPORTANT 🔥)
  useEffect(() => {
    fetch(`${BASE_URL}/dashboard`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const found = data.find(item => item.course._id === id);
        if (found) {
          setProgress(found.progress);
        }
      });
  }, [id]);

  // ✅ 3. Update progress manually
  const updateProgress = async () => {
    await fetch(`${BASE_URL}/progress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ courseId: id, progress: Number(progress) })
    });

    alert("Progress Updated ✅");
  };

  // ✅ 4. Quiz logic
  const checkAnswer = () => {
    if (answer.toLowerCase() === "html") {
      alert("Correct ✅");
      setProgress(100);
    } else {
      alert("Wrong ❌");
    }
  };

  if (!course) {
    return (
      <div className="text-white bg-gray-900 min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      
      {/* ✅ Course info */}
      <h1 className="text-3xl text-blue-400 mb-2">{course.title}</h1>
      <p className="mb-4">{course.description}</p>

      {/* ✅ Progress bar */}
      <div className="w-full bg-gray-700 rounded h-4 mb-4">
        <div
          className="bg-green-500 h-4 rounded"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <p className="mb-2">Progress: {progress}%</p>

      <input
        type="number"
        placeholder="Enter progress %"
        value={progress}
        onChange={(e) => setProgress(e.target.value)}
        className="p-2 text-black"
      />

      <button
        onClick={updateProgress}
        className="ml-2 px-3 py-1 bg-blue-500 rounded"
      >
        Update
      </button>

      {/* ✅ Quiz */}
      <div className="mt-6">
        <h3 className="text-xl mb-2">Quiz ❓</h3>
        <p>What is basic web language?</p>

        <input
          onChange={(e) => setAnswer(e.target.value)}
          className="p-2 text-black"
        />

        <button
          onClick={checkAnswer}
          className="ml-2 px-3 py-1 bg-purple-500 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
}