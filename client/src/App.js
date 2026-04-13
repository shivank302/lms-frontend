import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import CourseDetail from "./pages/CourseDetail";

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN PAGE */}
        <Route path="/" element={<Login />} />

        {/* DASHBOARD (protected) */}
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/" />}
        />

        {/* PROFILE (protected) */}
        <Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/" />}
        />

        {/* ADMIN (protected) */}
        <Route
          path="/admin"
          element={token ? <Admin /> : <Navigate to="/" />}
        />

        {/* COURSE DETAIL */}
        <Route
          path="/course/:id"
          element={token ? <CourseDetail /> : <Navigate to="/" />}
        />

      </Routes>
    </BrowserRouter>
  );
}