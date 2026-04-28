import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

const moodOptions = ["very sad", "sad", "neutral", "happy", "very happy"];

export default function MoodEntryForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    mood: "neutral",
    rating: 3,
    notes: "",
  });
  const navigate = useNavigate();

  // Load existing entry if editing
  useEffect(() => {
    if (!isEdit) return;
    API.get(`/mood/${id}`)
      .then(({ data }) => {
        const e = data.entry;
        setForm({
          date: e.date.slice(0, 10),
          mood: e.mood,
          rating: e.rating || 3,
          notes: e.notes || "",
        });
      })
      .catch(() => setError("Failed to load entry"))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isEdit) {
        await API.put(`/mood/${id}`, {
          mood: form.mood,
          rating: form.rating,
          notes: form.notes,
        });
      } else {
        await API.post("/mood", form);
      }
      navigate("/dashboard/mood", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  };

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">
        {isEdit ? "Edit" : "New"} Mood Entry
      </h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form
        onSubmit={onSubmit}
        className="space-y-4 bg-white p-6 rounded shadow"
      >
        <div>
          <label className="block mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={onChange}
            className="border px-3 py-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Mood</label>
          <select
            name="mood"
            value={form.mood}
            onChange={onChange}
            className="border px-3 py-2 rounded w-full"
            required
          >
            {moodOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Rating</label>
          <input
            type="range"
            name="rating"
            min="1"
            max="5"
            value={form.rating}
            onChange={onChange}
            className="w-full"
          />
          <div className="text-sm mt-1">Rating: {form.rating}</div>
        </div>

        <div>
          <label className="block mb-1">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={onChange}
            className="border px-3 py-2 rounded w-full"
            rows={3}
          />
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            {isEdit ? "Update" : "Create"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/mood")}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
