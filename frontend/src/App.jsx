
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/NavBar";

// Public
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Register from "./pages/Register";
import Login from "./pages/Login";

// Shared
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import PrivateRoute from "./components/PrivateRoute";

// User
import UserLayout from "./layouts/UserLayout";
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import ResourcesPage from "./pages/ResourcesPage";
import MoodTrackerPage from "./pages/MoodTrackerPage";
import MoodEntryForm from "./pages/MoodEntryForm";
import MoodDetailPage from "./pages/MoodDetailPage";
import PomodoroTimer from "./pages/PomodoroTimer";
import MyTherapists from "./pages/MyTherapists";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Any logged-in user */}
          <Route
            path="/profile"
            element={
              <PrivateRoute roles={[]}>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* ── User Dashboard ── */}
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute roles={["user"]}>
                <UserLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />

            <Route path="mood" element={<MoodTrackerPage />} />
            <Route path="mood/new" element={<MoodEntryForm />} />
            <Route path="mood/:id" element={<MoodDetailPage />} />
            <Route path="mood/:id/edit" element={<MoodEntryForm />} />

            <Route path="pomodoro" element={<PomodoroTimer />} />

            <Route path="therapists" element={<MyTherapists />} />
            <Route path="chat/:therapistId" element={<ChatPage />} />
            <Route path="resources" element={<ResourcesPage />} />

            <Route path="profile" element={<Profile />} />
            <Route path="profile/edit" element={<EditProfile />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}