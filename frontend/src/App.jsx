
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

// Therapist
import TherapistLayout from "./layouts/TherapistLayout";
import TherapistPatients from "./pages/TherapistPatients";
import TherapistSessions from "./pages/TherapistSessions";
import TherapistChatPage from "./pages/TherapistChatPage";
import TherapistResources from "./pages/TherapistResources";
import TherapistMoodOverview from "./pages/TherapistMoodOverview";
import MyTherapists from "./pages/MyTherapists";

// Admin
import AdminLayout from "./layouts/AdminLayout";
import AdminTherapists from "./pages/AdminTherapists";
import AdminUsers from "./pages/AdminUsers";
import AdminResources from "./pages/AdminResources";
import AdminStats from "./pages/AdminStats";

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

          {/* Any logged‐in user */}
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
            {/* /dashboard */}
            <Route index element={<Dashboard />} />
            <Route path="mood" element={<MoodTrackerPage />} />
            <Route path="mood/new" element={<MoodEntryForm />} />
            <Route path="mood/:id" element={<MoodDetailPage />} />
            <Route path="mood/:id/edit" element={<MoodEntryForm />} />
            <Route path="pomodoro" element={<PomodoroTimer />} />

            {/* /dashboard/chat/:therapistId */}
            <Route path="therapists" element={<MyTherapists />} />
            <Route path="chat/:therapistId" element={<ChatPage />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="profile/edit" element={<EditProfile />} />

            {/* /dashboard/profile */}
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* ── Therapist Panel ── */}
          <Route
            path="/therapist/*"
            element={
              <PrivateRoute roles={["therapist"]}>
                <TherapistLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="patients" replace />} />
            <Route path="patients" element={<TherapistPatients />} />
            <Route path="mood" element={<TherapistMoodOverview />} />
            <Route path="mood/:userId" element={<TherapistMoodOverview />} />
            <Route path="chats" element={<TherapistSessions />} />
            <Route path="resources" element={<TherapistResources />} />
            <Route path="chat/:sessionId" element={<TherapistChatPage />} />

            {/* ← Profile & Edit Profile for therapists */}
            <Route path="profile" element={<Profile />} />
            <Route path="profile/edit" element={<EditProfile />} />
          </Route>

          {/* ── Admin Panel ── */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute roles={["admin"]}>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="therapists" replace />} />
            <Route path="stats" element={<AdminStats />} />
            <Route path="therapists" element={<AdminTherapists />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="resources" element={<AdminResources />} />
          </Route>

          {/* Catch‐all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
