// src/pages/MyTherapists.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function MyTherapists() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    // 1) Fetch your own profile, which now includes populated `therapists`
    API.get("/users/me")
      .then(({ data: { user: me } }) => {
        // assume your backend populates `therapists` with full objects
        setTherapists(me.therapists || []);
      })
      .catch((e) => {
        console.error("Failed to load profile:", e);
        setError("Could not load your therapists");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Loading…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">My Therapists</h1>
      {therapists.length === 0 ? (
        <p>You haven’t selected any therapists yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {therapists.map((t) => {
            const initial = t.name.charAt(0).toUpperCase();
            return (
              <div
                key={t._id}
                className="border rounded-lg p-6 bg-white shadow flex flex-col items-center"
              >
                {/* Avatar */}
                <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg font-semibold mb-4">
                  {initial}
                </div>

                {/* Name */}
                <h3 className="text-xl font-semibold mb-2">{t.name}</h3>

                {/* Specialties */}
                {t.specialties?.length > 0 && (
                  <p className="text-sm mb-1 text-center">
                    <span className="font-medium">Specialties:</span>{" "}
                    {t.specialties.join(", ")}
                  </p>
                )}

                {/* Qualification */}
                {t.degree && t.institution && (
                  <p className="text-sm mb-4 text-center">
                    <span className="font-medium">Qualification:</span>{" "}
                    {t.degree}, {t.institution}
                  </p>
                )}

                {/* Chat button */}
                <button
                  className="mt-auto w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                  onClick={() => navigate(`/dashboard/chat/${t._id}`)}
                >
                  Chat Now
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
