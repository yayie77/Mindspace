// src/pages/TherapistSessions.jsx
import React, { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function TherapistSessions() {
  const { user } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/chat/sessions", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => setSessions(res.data.sessions))
      .catch(() => setError("Could not load sessions"));
  }, [user.token]);

  // Deduplicate by patient ID
  const uniqueSessions = useMemo(() => {
    const map = new Map();
    sessions.forEach((s) => {
      const other = s.participants.find((p) => p.role === "user");
      if (other) {
        // Always overwrite, so only the last (or effectively one) remains
        map.set(other._id, { session: s, other });
      }
    });
    // map.values() gives { session, other } objects
    return Array.from(map.values());
  }, [sessions]);

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Your Chats</h1>
      {uniqueSessions.length === 0 ? (
        <p>No chat sessions yet.</p>
      ) : (
        <ul className="space-y-2">
          {uniqueSessions.map(({ session, other }) => (
            <li
              key={other._id}
              className="p-4 bg-white rounded shadow hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/therapist/chat/${session._id}`)}
            >
              <div className="font-medium">{other.name}</div>
              <div className="text-sm text-gray-500">{other.email}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
