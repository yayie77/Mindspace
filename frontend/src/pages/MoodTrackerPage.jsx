// src/pages/MoodTrackerPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const moodClasses = {
  "very sad": "bg-red-300 text-red-800",
  sad: "bg-red-100 text-red-700",
  neutral: "bg-gray-200 text-gray-800",
  happy: "bg-green-200 text-green-800",
  "very happy": "bg-green-300 text-green-900",
};

export default function MoodTrackerPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("calendar"); // or "list"
  const navigate = useNavigate();

  // Fetch all entries
  useEffect(() => {
    API.get("/mood")
      .then((res) => setEntries(res.data.entries))
      .catch((e) => setError(e.response?.data?.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  // Map of date → entry
  const heatmapData = useMemo(() => {
    const map = {};
    entries.forEach((e) => {
      map[e.date.slice(0, 10)] = e;
    });
    return map;
  }, [entries]);

  // Last 30 days array
  //   const last30Days = useMemo(() => {
  //     const arr = [];
  //     for (let i = 29; i >= 0; i--) {
  //       const d = new Date();
  //       d.setDate(d.getDate() - i);
  //       arr.push(d);
  //     }
  //     return arr;
  //   }, []);

  if (loading) return <p className="p-6">Loading…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Mood Tracker</h1>
        <button
          onClick={() => navigate("new")}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          + New Entry
        </button>
      </div>

      {/* View Toggle */}
      <div className="flex space-x-2">
        <button
          className={`px-3 py-1 rounded ${
            view === "calendar" ? "bg-indigo-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setView("calendar")}
        >
          Calendar
        </button>
        <button
          className={`px-3 py-1 rounded ${
            view === "list" ? "bg-indigo-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setView("list")}
        >
          List
        </button>
      </div>

      {view === "calendar" ? (
        // ─────────────── Calendar / Heatmap View ───────────────
        <>
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 text-xs text-gray-500 mb-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((wd) => (
              <div key={wd} className="text-center">
                {wd}
              </div>
            ))}
          </div>

          {/* Dates grid */}
          <div className="grid grid-cols-7 gap-2">
            {/** generate blanks until the first weekday **/}
            {Array.from({
              length: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                1
              ).getDay(),
            }).map((_, i) => (
              <div key={`blank-${i}`} />
            ))}

            {/** actual days of this month **/}
            {Array.from(
              {
                length: new Date(
                  new Date().getFullYear(),
                  new Date().getMonth() + 1,
                  0
                ).getDate(),
              },
              (_, i) => {
                const date = new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  i + 1
                );
                const key = date.toISOString().slice(0, 10);
                const entry = heatmapData[key];
                const isToday = key === new Date().toISOString().slice(0, 10);
                const baseClasses = entry
                  ? moodClasses[entry.mood]
                  : "border border-gray-200";
                return (
                  <button
                    key={key}
                    onClick={() => entry && navigate(entry._id)}
                    className="flex items-center justify-center h-16"
                    title={`${date.toDateString()}${
                      entry ? ` — ${entry.mood}` : ""
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center h-10 w-10 rounded-full transition-all ${
                        isToday ? "ring-2 ring-indigo-400" : ""
                      } ${entry ? baseClasses : ""}`}
                    >
                      <span
                        className={
                          entry ? "text-white font-medium" : "text-gray-400"
                        }
                      >
                        {date.getDate()}
                      </span>
                    </div>
                  </button>
                );
              }
            )}
          </div>
        </>
      ) : (
        // ─────────────── List View ───────────────
        <ul className="space-y-4">
          {[...entries]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((e) => {
              const d = new Date(e.date);
              const dateStr = d.toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
              });
              return (
                <li
                  key={e._id}
                  className="p-4 bg-white shadow rounded cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate(e._id)}
                >
                  <div className="flex justify-between items-start">
                    {/* Left: date & notes */}
                    <div className="flex-1 pr-4">
                      <p className="font-medium">{dateStr}</p>
                      <p className="mt-1 text-gray-700">
                        {e.notes || "No notes provided."}
                      </p>
                    </div>

                    {/* Right: mood badge + optional rating */}
                    <div className="flex flex-col items-end space-y-1">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          moodClasses[e.mood]
                        }`}
                      >
                        {e.mood}
                      </span>
                      {e.rating != null && (
                        <span className="text-sm text-gray-500">
                          Rating: {e.rating}/5
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}
