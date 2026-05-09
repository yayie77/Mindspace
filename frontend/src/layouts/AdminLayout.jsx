// src/layouts/AdminLayout.jsx
import React, { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  HiChartBar,
  HiUserGroup,
  HiUsers,
  HiOutlineLogout,
} from "react-icons/hi";
import { BsCardChecklist } from "react-icons/bs";
import { AuthContext } from "../context/AuthContext";

export default function AdminLayout() {
  const { logout } = useContext(AuthContext);
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="px-6 py-4">
          <h2 className="text-2xl font-semibold text-gray-800">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          <NavLink
            to="/admin/therapists"
            className={({ isActive }) =>
              `flex px-6 py-3 mx-2 mb-2 rounded-lg font-medium transition-colors
               ${
                 isActive
                   ? "bg-indigo-100 text-indigo-700"
                   : "text-gray-700 hover:bg-gray-100"
               }`
            }
          >
            <HiUserGroup className="h-5 w-5 mr-3" />
            All Therapists
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex px-6 py-3 mx-2 mb-2 rounded-lg font-medium transition-colors
               ${
                 isActive
                   ? "bg-indigo-100 text-indigo-700"
                   : "text-gray-700 hover:bg-gray-100"
               }`
            }
          >
            <HiUsers className="h-5 w-5 mr-3" />
            All Users
          </NavLink>
          <NavLink
            to="/admin/resources"
            className={({ isActive }) =>
              `flex px-6 py-3 mx-2 mb-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <BsCardChecklist className="h-5 w-5 mr-3" />
            Resources Approval
          </NavLink>

          <NavLink
            to="/admin/stats"
            className={({ isActive }) =>
              `flex px-6 py-3 mx-2 mb-6 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <HiChartBar className="h-5 w-5 mr-3" />
            Dashboard Stats
          </NavLink>
        </nav>
        {/* Logout at the bottom */}
        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
          >
            <HiOutlineLogout className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
