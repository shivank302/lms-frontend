import { useParams } from "react-router-dom";
import { useState } from "react";

export default function CourseDetail() {
  const { id } = useParams();
  const [progress, setProgress] = useState(0);
  const [answer, setAnswer] = useState("");

  const updateProgress = async () => {
    await fetch("http://localhost:5000/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ courseId: id, progress })
    });

    alert("Progress Updated ✅");
  };

  const checkAnswer = () => {
    if (answer.toLowerCase() === "html") {
      alert("Correct ✅");
      setProgress(100);
    } else {
      alert("Wrong ❌");
    }
  };

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h1 className="text-2xl mb-4">Course Detail 📘</h1>

      {/* PROGRESS BAR */}
      <div className="w-full bg-gray-700 rounded h-4 mb-4">
        <div
          className="bg-green-500 h-4 rounded"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <input
        type="number"
        placeholder="Enter progress %"
        onChange={(e) => setProgress(e.target.value)}
        className="p-2 text-black"
      />

      <button
        onClick={updateProgress}
        className="ml-2 px-3 py-1 bg-blue-500 rounded"
      >
        Update
      </button>

      {/* QUIZ */}
      <div className="mt-6">
        <h3>Quiz ❓</h3>
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