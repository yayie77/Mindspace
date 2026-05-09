import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function AdminUsers() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    API.get("/admin/users", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => setUsers(res.data.users))
      .catch(() => setErr("Could not load users"));
  }, [user.token]);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers((u) => u.filter((x) => x._id !== id));
    } catch {
      setErr("Deletion failed");
    }
  };

  if (err) return <p className="text-red-600">{err}</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Users</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            {["Name", "Email", "Joined", "Action", "Gender"].map((h) => (
              <th key={h} className="border px-4 py-2 text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td className="border px-4 py-2">{u.name}</td>
              <td className="border px-4 py-2">{u.email}</td>
              <td className="border px-4 py-2">
                {new Date(u.createdAt).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(u._id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"

                >
                  Delete
                </button>
              </td>
              <td className="border px-4 py-2">{u.gender}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
