// src/pages/Profile.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/users/me", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => setProfile(res.data.user))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user.token]);

  if (loading || !profile) return null;

  const {
    name,
    email,
    role,
    emergencyContact,
    specialties,
    degree,
    institution,
    status,
    createdAt,
  } = profile;

  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Page Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Your Profile</h1>
        <p className="mt-1 text-gray-600">
          Manage your profile information and settings here.
        </p>
      </header>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left: Avatar & Basic Info */}
          <div className="md:w-1/3 bg-indigo-600 flex flex-col items-center p-8">
            <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center text-indigo-600 text-5xl font-bold">
              {initial}
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-white">{name}</h2>
            <p className="mt-2 px-4 py-1 bg-indigo-500 text-white rounded-full text-sm capitalize">
              {role}
            </p>
            {/* Edit Profile Button */}
            <button
              onClick={() => {
                if (user.role === "therapist") {
                  // go to therapist edit
                  navigate("/therapist/profile/edit");
                } else {
                  // go to user edit
                  navigate("/dashboard/profile/edit");
                }
              }}
              className="mt-4 px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition"
            >
              Edit Profile
            </button>
          </div>

          {/* Right: Details Grid */}
          <div className="md:w-2/3 p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-xs text-gray-500">Joined</p>
              <p className="mt-1 font-medium">
                {new Date(createdAt).toLocaleDateString()}
              </p>
            </div>

            {role === "user" && (
              <>
                <div className="bg-gray-100 rounded-lg p-4 sm:col-span-2">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="mt-1 font-medium">{email || "None"}</p>
                </div>

                <div className="bg-gray-100 rounded-lg p-4 sm:col-span-2">
                  <p className="text-xs text-gray-500">Emergency Contact</p>
                  {emergencyContact?.name ? (
                    <p className="mt-1 font-medium">
                      {emergencyContact.name} — {emergencyContact.phone}
                    </p>
                  ) : (
                    <p className="mt-1 font-medium">Not set</p>
                  )}
                </div>

                {/* <div className="bg-gray-100 rounded-lg p-4 sm:col-span-2">
                  <p className="text-xs text-gray-500">Notifications</p>
                  <ul className="mt-1 list-disc list-inside text-sm">
                    <li>
                      Mood reminders:{" "}
                      {notificationPrefs.moodReminder ? "On" : "Off"}
                    </li>
                    <li>
                      Chat transcripts:{" "}
                      {notificationPrefs.chatTranscript ? "On" : "Off"}
                    </li>
                  </ul>
                </div> */}
              </>
            )}

            {role === "therapist" && (
              <>
                <div className="bg-gray-100 rounded-lg p-4 sm:col-span-2">
                  <p className="text-xs text-gray-500">Specialties</p>
                  <p className="mt-1 font-medium">
                    {specialties.join(", ") || "None"}
                  </p>
                </div>

                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Degree</p>
                  <p className="mt-1 font-medium">{degree || "—"}</p>
                </div>

                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Institution</p>
                  <p className="mt-1 font-medium">{institution || "—"}</p>
                </div>

                <div className="bg-gray-100 rounded-lg p-4 sm:col-span-2">
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="mt-1 font-medium capitalize">{status}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
