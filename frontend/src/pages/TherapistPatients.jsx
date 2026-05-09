// src/pages/TherapistPatients.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function TherapistPatients() {
  const { user } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/therapists/patients", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => setPatients(res.data.patients))
      .catch(() => setError("Could not load patients"));
  }, [user.token]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Patients</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {patients.length === 0 ? (
        <p>No patients assigned yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {patients.map((p) => {
            const initial = p.name.charAt(0).toUpperCase();
            return (
              <div
                key={p._id}
                className="flex flex-col bg-white rounded-lg shadow hover:shadow-md transition p-5"
              >
                {/* Avatar + Name */}
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-lg font-semibold">
                    {initial}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {p.name}
                  </h2>
                </div>

                {/* Email */}
                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Email:</span> {p.email}
                </div>

                {/* Joined Date */}
                {p.createdAt && (
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Joined:</span>{" "}
                    {new Date(p.createdAt).toLocaleDateString()}
                  </div>
                )}

                {/* Emergency Contact */}
                <div className="text-sm  text-gray-600">
                  <span className="font-bold">Emergency Contact:</span>{" "}
                  {p.emergencyContact?.name
                    ? `${p.emergencyContact.name}`
                    : "Not set"}
                </div>

                <div className="text-sm  text-gray-600 mb-4">
                  <span className="font-bold">Emergency Phone:</span>{" "}
                  {p.emergencyContact?.name
                    ? `${p.emergencyContact.phone}`
                    : "Not set"}
                </div>

                {/* Chat Action */}
                {p.sessionId ? (
                  <button
                    onClick={() => navigate(`/therapist/chat/${p.sessionId}`)}
                    className="mt-auto bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                  >
                    Chat
                  </button>
                ) : (
                  <button
                    disabled
                    className="mt-auto bg-gray-300 text-gray-500 py-2 rounded cursor-not-allowed"
                  >
                    No Session
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
