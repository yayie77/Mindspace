// src/services/api.js
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API = axios.create({
  baseURL: `${BASE}/api`,
});

API.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default API;
