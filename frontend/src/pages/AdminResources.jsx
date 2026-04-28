// src/pages/AdminResources.jsx
import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminResources() {
  const [resources, setResources] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    API.get("/admin/resources")
      .then((res) => setResources(res.data.resources))
      .catch((e) => {
        console.error("Failed to load pending resources:", e);
        setError("Failed to load resources");
      })
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/admin/resources/${id}`, { status });
      // remove it from list on approval/rejection
      setResources((rs) => rs.filter((r) => r._id !== id));
    } catch (e) {
      console.error("Failed to update status:", e);
      setError("Could not update status");
    }
  };

  if (loading) return <p className="p-6">Loading…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (resources.length === 0)
    return <p className="p-6">No pending resources.</p>;

  return (
    <div className="p-6 space-y-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        Pending Resources By Therapists
      </h1>
      <ul className="space-y-4">
        {resources.map((r) => (
          <li
            key={r._id}
            className="bg-white p-4 rounded shadow flex justify-between items-start"
          >
            <div className="flex-1">
              <h3 className="font-medium text-lg">{r.title}</h3>
              <p className="text-sm text-gray-600">
                <span className="font-medium">By Therapist:</span>{" "}
                {r.createdBy.name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Type:</span> {r.type}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">URL:</span>{" "}
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-blue-600"
                >
                  {r.url}
                </a>
              </p>
              {r.description && <p className="mt-2 text-sm">{r.description}</p>}
            </div>
            <div className="flex-shrink-0 space-y-2 ml-4">
              <button
                onClick={() => updateStatus(r._id, "approved")}
                className="block w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Approve
              </button>
              <button
                onClick={() => updateStatus(r._id, "rejected")}
                className="block w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
