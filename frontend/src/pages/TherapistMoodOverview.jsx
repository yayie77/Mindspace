// src/pages/TherapistMoodOverview.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function TherapistMoodOverview() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loadingP, setLoadingP] = useState(false);
  const [loadingE, setLoadingE] = useState(false);
  const [error, setError] = useState("");

  // 1) Load your patients (now populated with their therapists)
  useEffect(() => {
    setLoadingP(true);
    API.get("/therapists/patients")
      .then((res) => setPatients(res.data.patients))
      .catch(() => setError("Could not load patients"))
      .finally(() => setLoadingP(false));
  }, []);

  // 2) Load this patient’s mood entries
  useEffect(() => {
    if (!userId) return;
    setLoadingE(true);
    API.get(`/therapists/mood/${userId}`)
      .then((res) => setEntries(res.data.entries))
      .catch(() => setError("Could not load entries"))
      .finally(() => setLoadingE(false));
  }, [userId]);

  const selected = patients.find((p) => p._id === userId);

  return (
    <div className="flex h-full">
      {/* Show error if it exists */}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-800 px-4 py-2 rounded shadow">
          {error}
        </div>
      )}
      {/* ── Left: list of patients ── */}
      <aside className="w-1/3 border-r p-4 overflow-auto">
        <h2 className="text-xl font-semibold mb-4">My Patients</h2>
        {loadingP ? (
          <p>Loading…</p>
        ) : (
          <ul className="space-y-2">
            {patients.map((p) => (
              <li
                key={p._id}
                onClick={() => navigate(`/therapist/mood/${p._id}`)}
                className={`p-2 rounded cursor-pointer ${
                  p._id === userId ? "bg-indigo-50" : "hover:bg-gray-100"
                }`}
              >
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-gray-500">{p.email}</div>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* ── Right: selected patient’s profile, therapists & moods ── */}
      <main className="flex-1 p-6 overflow-auto">
        {!selected ? (
          <p>Select a patient to view details.</p>
        ) : (
          <>
            {/* Profile header */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">{selected.name}</h2>
              <p className="text-gray-600">{selected.email}</p>
            </div>

            {/* ← New: show which therapists this user has chosen */}
            {/* <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Therapists Chosen</h3>
              <div className="flex flex-wrap gap-2">
                {selected.therapists.length === 0 ? (
                  <span className="text-gray-500">No therapists selected</span>
                ) : (
                  selected.therapists.map((t) => (
                    <span
                      key={t._id}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                    >
                      {t.name}
                    </span>
                  ))
                )}
              </div>
            </div> */}

            {/* Mood entries */}
            {loadingE ? (
              <p>Loading mood entries…</p>
            ) : entries.length === 0 ? (
              <p className="text-gray-500">No mood entries for this patient.</p>
            ) : (
              <ul className="space-y-4">
                {entries.map((e) => {
                  const d = new Date(e.date);
                  const dateStr = d.toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  });
                  return (
                    <li
                      key={e._id}
                      className="flex justify-between items-center bg-white p-4 rounded shadow"
                    >
                      <div>
                        <p className="font-medium">{dateStr}</p>
                        {e.notes && (
                          <p className="text-sm text-gray-600 mt-1">
                            {e.notes}
                          </p>
                        )}
                      </div>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          {
                            "very sad": "bg-red-200 text-red-800",
                            sad: "bg-red-100 text-red-700",
                            neutral: "bg-gray-200 text-gray-800",
                            happy: "bg-green-200 text-green-800",
                            "very happy": "bg-green-300 text-green-900",
                          }[e.mood]
                        }`}
                      >
                        {e.mood}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  );
}
