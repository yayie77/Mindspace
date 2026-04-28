// src/pages/ResourcesPage.jsx
import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/resources")
      .then(({ data }) => setResources(data.resources))
      .catch((e) => setError("Failed to load resources", e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Loading resources…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Resources</h1>
      {resources.length === 0 ? (
        <p>No resources available yet.</p>
      ) : (
        <ul className="space-y-4">
          {resources.map((r) => (
            <li
              key={r._id}
              className="p-4 bg-white rounded shadow flex flex-col md:flex-row md:justify-between"
            >
              <div className="flex-1">
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium text-indigo-600 hover:underline"
                >
                  {r.title}
                </a>
                <p className="text-sm text-gray-600 mt-1">{r.type}</p>
                <p className="mt-2">{r.description}</p>
              </div>
              <div className="mt-4 md:mt-0 md:ml-6 text-right">
                <p className="font-medium">
                  Resource Author: {r.createdBy.name}
                </p>
                {r.createdBy.specialties?.length > 0 && (
                  <p className="text-xs text-gray-500">
                    Speciality: {r.createdBy.specialties.join(", ")}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
