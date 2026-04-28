// src/pages/SelectTherapist.jsx
import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SelectTherapist() {
  const { user, saveUser } = useContext(AuthContext);
  const [therapists, setTherapists] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // fetch approved therapists
    API.get("/therapists", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => setTherapists(res.data.therapists))
      .catch(() => setError("Failed to load therapists"));
  }, [user.token]);

  const choose = async (id) => {
    try {
      const { data } = await API.put(
        "/users/me/therapist",
        { therapistId: id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      // update context so user.therapist is set
      saveUser({
        token: user.token,
        id: data.user._id,
        name: data.user.name,
        role: data.user.role,
        therapist: data.user.therapist,
      });
      navigate("/dashboard", { replace: true });
    } catch {
      setError("Could not assign therapist");
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (therapists.length === 0)
    return <p>No therapists are available right now.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Choose Your Therapist</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {therapists.map((t) => (
          <div key={t._id} className="border rounded-lg p-4 bg-white shadow">
            <h3 className="text-xl font-medium">{t.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{t.bio}</p>
            <p className="text-sm mb-2">
              <span className="font-medium">Specialties:</span>{" "}
              {t.specialties.join(", ")}
            </p>
            <button
              onClick={() => choose(t._id)}
              className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Choose
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
