import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function EditProfile() {
  const { user, saveUser } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    emergencyContact: { name: "", phone: "" },
    notificationPrefs: { moodReminder: false, chatTranscript: false },
    specialties: [],
    degree: "",
    institution: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load current profile
  useEffect(() => {
    API.get("/users/me", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(({ data }) => {
        const p = data.user;
        setForm({
          name: p.name,
          email: p.email,
          password: "",
          emergencyContact: p.emergencyContact || { name: "", phone: "" },
          notificationPrefs: p.notificationPrefs || {
            moodReminder: false,
            chatTranscript: false,
          },
          specialties: p.specialties || [],
          degree: p.degree || "",
          institution: p.institution || "",
        });
      })
      .catch((err) => setError("Failed to load profile", err))
      .finally(() => setLoading(false));
  }, [user.token]);

  const onChange = (e) => {
    const { name, value, checked } = e.target;
    // nested fields
    if (name.startsWith("emergencyContact.")) {
      const key = name.split(".")[1];
      setForm((f) => ({
        ...f,
        emergencyContact: { ...f.emergencyContact, [key]: value },
      }));
    } else if (name.startsWith("notificationPrefs.")) {
      const key = name.split(".")[1];
      setForm((f) => ({
        ...f,
        notificationPrefs: { ...f.notificationPrefs, [key]: checked },
      }));
    } else if (name === "specialties") {
      setForm((f) => ({
        ...f,
        specialties: value.split(",").map((s) => s.trim()),
      }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await API.put("/users/me", form, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      // update context (name/email changed)
      saveUser({
        token: user.token,
        id: data.user._id,
        name: data.user.name,
        role: data.user.role,
        therapist: data.user.therapist,
      });
      // Redirect back to the correct profile page for your role:
      if (user.role === "therapist") {
        navigate("/therapist/profile", { replace: true });
      } else {
        navigate("/dashboard/profile", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form className="space-y-4" onSubmit={onSubmit}>
        {/* Name & Email */}
        <div>
          <label className="block text-sm">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm">New Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Leave blank to keep current"
          />
        </div>

        {user.role === "user" && (
          <>
            {/* Emergency Contact */}
            <div>
              <label className="block text-sm">Emergency Contact Name</label>
              <input
                name="emergencyContact.name"
                value={form.emergencyContact.name}
                onChange={onChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Emergency Contact Phone</label>
              <input
                name="emergencyContact.phone"
                value={form.emergencyContact.phone}
                onChange={onChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </>
        )}

        {user.role === "therapist" && (
          <>
            {/* Therapist fields */}
            <div>
              <label className="block text-sm">
                Specialties (comma-separated)
              </label>
              <input
                name="specialties"
                value={form.specialties.join(", ")}
                onChange={onChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Degree</label>
              <input
                name="degree"
                value={form.degree}
                onChange={onChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Institution</label>
              <input
                name="institution"
                value={form.institution}
                onChange={onChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
