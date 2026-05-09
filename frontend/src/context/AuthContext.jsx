// src/context/AuthContext.jsx
import React, { createContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export const AuthContext = createContext({
  user: null,
  register: async () => {},
  login: async () => {},
  logout: () => {},
  saveUser: () => {},
});

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // Initialize from localStorage
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");
    if (token && stored) {
      return { token, ...JSON.parse(stored) };
    }
    return null;
  });

  // Persist user both in state and localStorage
  const saveUser = useCallback(({ token, id, name, role }) => {
    const userData = { id, name, role };
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser({ token, ...userData });
  }, []);

  // Registration
  const register = useCallback(
    async (data) => {
      try {
        await API.post("/auth/register", data);
        navigate("/login", { replace: true });
      } catch (err) {
        console.error("Registration failed:", err);
        throw err;
      }
    },
    [navigate]
  );

  // Login
  const login = useCallback(
    async (data) => {
      try {
        const { data: res } = await API.post("/auth/login", data);
        // backend returns { token, user: { id, name, email, role, ... } }
        const { token, user: u } = res;
        saveUser({ token, id: u.id, name: u.name, role: u.role });

        // redirect based on role
        let dest = "/dashboard";
        if (u.role === "therapist") dest = "/therapist/patients";
        else if (u.role === "admin") dest = "/admin/therapists";

        navigate(dest, { replace: true });
      } catch (err) {
        console.error("Login failed:", err);
        throw err;
      }
    },
    [navigate, saveUser]
  );

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, register, login, logout, saveUser }}>
      {children}
    </AuthContext.Provider>
  );
}
