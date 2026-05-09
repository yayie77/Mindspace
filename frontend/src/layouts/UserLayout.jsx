// src/layouts/UserLayout.jsx
import React, { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  HiUserGroup,
  HiChat,
  HiUser,
  HiOutlineLogout,
  HiOutlineHome,
} from "react-icons/hi";
import { IoIosTimer } from "react-icons/io";
import { FaUserDoctor } from "react-icons/fa6";
import { BsCardChecklist } from "react-icons/bs";
import { TbMoodPlus } from "react-icons/tb";
import { AuthContext } from "../context/AuthContext";

export default function UserLayout() {
  const { logout } = useContext(AuthContext);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="px-6 py-4">
          <h2 className="text-2xl font-semibold text-gray-800">My Space</h2>
        </div>
        <nav className="mt-6">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `flex px-6 py-3 mx-2 mb-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <HiOutlineHome className="h-5 w-5 mr-3" />
            Home
          </NavLink>

          <NavLink
            to="/dashboard/therapists"
            className={({ isActive }) =>
              `flex px-6 py-3 mx-2 mb-2  rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <FaUserDoctor className="h-5 w-5 mr-3" />
            My Therapists
          </NavLink>

          <NavLink
            to="/dashboard/resources"
            className={({ isActive }) =>
              `flex px-6 py-3 mx-2 mb-2  rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <BsCardChecklist className="h-5 w-5 mr-3" />
            Resources
          </NavLink>

          <NavLink
            to="/dashboard/mood"
            className={({ isActive }) =>
              `flex px-6 py-3 mx-2 mb-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <TbMoodPlus className="h-5 w-5 mr-3" />
            Mood Tracker
          </NavLink>


          <NavLink
            to="/dashboard/pomodoro"
            className={({ isActive }) =>
              `flex px-6 py-3 mx-2 mb-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            
            <IoIosTimer className="h-5 w-5 mr-3" />
            Pomodoro Timer
          </NavLink>

          <NavLink
            to="/dashboard/profile"
            end
            className={({ isActive }) =>
              `flex px-6 py-3 mx-2 mb-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <HiUser className="h-5 w-5 mr-3" />
            Profile
          </NavLink>

          <NavLink
            to="/dashboard/chat"
            className={({ isActive }) =>
              `flex px-6 py-3 mx-2 mb-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <HiChat className="h-5 w-5 mr-3" />
            Chat
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
