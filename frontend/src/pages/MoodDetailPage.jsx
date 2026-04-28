import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function MoodDetailPage() {
  const { id } = useParams();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/mood/${id}`)
      .then((res) => setEntry(res.data.entry))
      .catch(() => setError("Failed to load entry"))
      .finally(() => setLoading(false));
  }, [id]);

  const onDelete = async () => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await API.delete(`/mood/${id}`);
      navigate("/dashboard/mood");
    } catch {
      setError("Delete failed");
    }
  };

  if (loading) return <p className="p-6">Loading…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!entry) return <p className="p-6">Entry not found</p>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow space-y-4">
      <h1 className="text-xl font-semibold">Mood Entry Details</h1>
      <p>
        <strong>Date:</strong> {new Date(entry.date).toLocaleDateString()}
      </p>
      <p>
        <strong>Mood:</strong> {entry.mood}
      </p>
      {entry.rating && (
        <p>
          <strong>Rating:</strong> {entry.rating}
        </p>
      )}
      {entry.notes && (
        <p>
          <strong>Notes:</strong> {entry.notes}
        </p>
      )}

      <div className="flex space-x-2">
        <button
          onClick={() => navigate(`edit`)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Delete
        </button>
        <button
          onClick={() => navigate("/dashboard/mood")}
          className="px-4 py-2 border rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
}
