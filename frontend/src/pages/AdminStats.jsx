// src/pages/AdminStats.jsx
import React, { useEffect, useState } from "react";
import API from "../services/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get("/admin/stats")
      .then(({ data }) => setStats(data))
      .catch((err) => console.error("Failed to load stats:", err));
  }, []);

  if (!stats) return <p className="p-6">Loading stats…</p>;

  // prepare chart data
  const labels = [
    "Users",
    "Therapists",
    "Pending Therapists",
    "Chat Sessions",
    "Messages",
    "Mood Entries",
    "Resources ✓",
    "Resources ⏳",
  ];
  const values = [
    stats.userCount,
    stats.therapistCount,
    stats.pendingTherapistCount,
    stats.chatSessions,
    stats.chatMessages,
    stats.moodEntries,
    stats.resourcesApproved,
    stats.resourcesPending,
  ];
  const data = {
    labels,
    datasets: [
      {
        label: "Count",
        data: values,
        backgroundColor: "rgba(79, 70, 229, 0.6)", // indigo-600 @ 60%
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Overall System Metrics" },
    },
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Application Stats</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Active Users" value={stats.userCount} />
        <Card title="Approved Therapists" value={stats.therapistCount} />
        <Card title="Pending Therapists" value={stats.pendingTherapistCount} />
        <Card title="Chat Sessions" value={stats.chatSessions} />
        <Card title="Chat Messages" value={stats.chatMessages} />
        <Card title="Mood Entries" value={stats.moodEntries} />
        <Card title="Resources Approved" value={stats.resourcesApproved} />
        <Card title="Resources Pending" value={stats.resourcesPending} />
      </div>

      {/* Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

// simple card sub-component
function Card({ title, value }) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
