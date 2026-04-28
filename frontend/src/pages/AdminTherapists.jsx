import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function AdminTherapists() {
  const { user } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    API.get("/admin/therapists", {
      params: {
        /* no filter = all */
      },
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => setList(res.data.therapists))
      .catch(() => setErr("Could not load therapists"));
  }, [user.token]);

  const handleApprove = async (id) => {
    try {
      await API.put(
        `/admin/therapists/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setList((l) =>
        l.map((t) => (t._id === id ? { ...t, status: "approved" } : t))
      );
    } catch {
      setErr("Approval failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/admin/therapists/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setList((l) => l.filter((t) => t._id !== id));
    } catch {
      setErr("Deletion failed");
    }
  };

  if (err) return <p className="text-red-600">{err}</p>;

  const pending = list.filter((t) => t.status === "pending");
  const registered = list.filter((t) => t.status !== "pending");

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-2">Pending</h2>
        {pending.length === 0 ? (
          <p>No pending therapists.</p>
        ) : (
          <Table
            data={pending}
            onApprove={handleApprove}
            onDelete={handleDelete}
          />
        )}
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">All Therapists</h2>
        <Table data={registered} onDelete={handleDelete} />
      </section>
    </div>
  );
}

function Table({ data, onApprove, onDelete }) {
  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="bg-gray-100">
          {[
            "Name",
            "Email",
            "Status",
            "Specialties",
            "Degree",
            "Institution",
            "Action",
          ].map((h) => (
            <th key={h} className="border px-4 py-2 text-left">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((t) => (
          <tr key={t._id}>
            <td className="border px-4 py-2">{t.name}</td>
            <td className="border px-4 py-2">{t.email}</td>
            <td className="border px-4 py-2">{t.status}</td>
            <td className="border px-4 py-2">{t.specialties?.join(", ")}</td>
            <td className="border px-4 py-2">{t.degree}</td>
            <td className="border px-4 py-2">{t.institution}</td>
            <td className="border px-4 py-2 space-x-2">
              {t.status === "pending" && (
                <button
                  onClick={() => onApprove(t._id)}
                  className="bg-green-600 text-white px-2 py-1 rounded"
                >
                  Approve
                </button>
              )}
              <button
                onClick={() => onDelete(t._id)}
                className="bg-red-600 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
