import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    specialties: [], // array for backend
    emergencyContact: {
      // for normal user
      name: "",
      phone: "",
    },
    degree: "", // for therapist
    institution: "", // for therapist
    adminCode: "", // for admin
  });
  // separate string state for specialties input to allow commas
  const [specialtiesInput, setSpecialtiesInput] = useState("");
  const [err, setErr] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "specialtiesInput":
        setSpecialtiesInput(value);
        break;
      case "emergencyName":
        setForm((f) => ({
          ...f,
          emergencyContact: { ...f.emergencyContact, name: value },
        }));
        break;
      case "emergencyPhone":
        setForm((f) => ({
          ...f,
          emergencyContact: { ...f.emergencyContact, phone: value },
        }));
        break;
      default:
        setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    // parse specialties input into array
    const specs = specialtiesInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      await register({ ...form, specialties: specs });
    } catch (e) {
      setErr(e.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Register a new Account</h2>
      {err && <p className="text-red-600 mb-3">{err}</p>}
      <form className="space-y-4" onSubmit={onSubmit}>
        {/* Name, Email, Password fields */}
        {/* Role selection */}
        <div>
          <label className="block mb-1">User Type</label>
          <select
            name="role"
            value={form.role}
            onChange={onChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="user">User</option>
            <option value="therapist">Therapist</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Therapist fields */}
        {form.role === "therapist" && (
          <>
            <div>
              <label className="block mb-1">
                Specialties{" "}
                <span className="text-sm text-gray-500">(comma separated)</span>
              </label>
              <input
                name="specialtiesInput"
                value={specialtiesInput}
                onChange={onChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="e.g. anxiety, depression, PTSD"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Degree</label>
              <input
                name="degree"
                value={form.degree}
                onChange={onChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="e.g. PhD Psychology"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Institution</label>
              <input
                name="institution"
                value={form.institution}
                onChange={onChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="e.g. Tribhuvan University"
                required
              />
            </div>
          </>
        )}

        {/* Normal user fields */}
        {form.role === "user" && (
          <div className="space-y-2">
            <div>
              <label className="block mb-1">Emergency Contact Name</label>
              <input
                name="emergencyName"
                value={form.emergencyContact.name}
                onChange={onChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Contact's name"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Emergency Contact Phone</label>
              <input
                name="emergencyPhone"
                value={form.emergencyContact.phone}
                onChange={onChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Contact's phone"
                required
              />
            </div>
          </div>
        )}

        {/* Admin code field */}
        {form.role === "admin" && (
          <div>
            <label className="block mb-1">Admin Registration Code</label>
            <input
              name="adminCode"
              type="text"
              value={form.adminCode}
              onChange={onChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter admin code"
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
