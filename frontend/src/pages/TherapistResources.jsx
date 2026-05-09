// src/pages/TherapistResources.jsx
import React, { useState, useEffect, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function TherapistResources() {
  const { user } = useContext(AuthContext);
  const [resources, setResources] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    type: "",
    url: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch therapist's own resources (pending + approved)
  useEffect(() => {
    setLoading(true);
    API.get("/resources/mine")
      .then((res) => setResources(res.data.resources))
      .catch((e) => setError(e.response?.data?.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, [user.token]);

  // Handle input changes
  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Create or update
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        // update
        const { data } = await API.put(`/resources/${editingId}`, form);
        setResources((rs) =>
          rs.map((r) => (r._id === editingId ? data.resource : r))
        );
      } else {
        // create
        const { data } = await API.post("/resources", form);
        setResources((rs) => [data.resource, ...rs]);
      }
      // clear form
      setForm({ title: "", type: "", url: "", description: "" });
      setEditingId(null);
    } catch (e) {
      setError(e.response?.data?.message || "Save failed");
    }
  };

  // Delete
  const onDelete = async (id) => {
    if (!window.confirm("Delete this resource?")) return;
    try {
      await API.delete(`/resources/${id}`);
      setResources((rs) => rs.filter((r) => r._id !== id));
    } catch (e) {
      setError("Delete failed", e);
    }
  };

  // Edit button
  const onEdit = (r) => {
    setForm({
      title: r.title,
      type: r.type,
      url: r.url,
      description: r.description,
    });
    setEditingId(r._id);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Manage Resources</h1>

      {/* Form */}
      <form
        onSubmit={onSubmit}
        className="bg-white p-4 rounded shadow space-y-3"
      >
        {error && <p className="text-red-600">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={onChange}
            className="border px-3 py-2 rounded w-full"
            required
          />
          <input
            name="type"
            placeholder="Type (e.g. article)"
            value={form.type}
            onChange={onChange}
            className="border px-3 py-2 rounded w-full"
            required
          />
        </div>
        <input
          name="url"
          placeholder="URL"
          value={form.url}
          onChange={onChange}
          className="border px-3 py-2 rounded w-full"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={onChange}
          className="border px-3 py-2 rounded w-full"
          rows={3}
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {editingId ? "Update Resource" : "Add Resource"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({ title: "", type: "", url: "", description: "" });
            }}
            className="ml-2 px-4 py-2 rounded border"
          >
            Cancel
          </button>
        )}
      </form>

      {/* List */}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <ul className="space-y-4">
          {resources.map((r) => (
            <li
              key={r._id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium">{r.title}</h3>
                <p className="text-sm text-gray-600">
                  {r.type} —{" "}
                  <span
                    className={
                      r.status === "pending"
                        ? "text-yellow-600"
                        : r.status === "approved"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {r.status}
                  </span>
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => onEdit(r)}
                  className="px-3 py-1 bg-blue-100 rounded hover:bg-blue-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(r._id)}
                  className="px-3 py-1 bg-red-100 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
