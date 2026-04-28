import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
import { HiUserGroup, HiUser, HiOutlineLogout } from "react-icons/hi";
import { MdMood, MdOutlineEditNote } from "react-icons/md";

export default function TherapistLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const seenSessions = useRef(new Set()); // track which sessionIds we've notified

  useEffect(() => {
    if (!user?.token) return; // wait until we have a token

    const socket = io(import.meta.env.VITE_API_URL, {
      auth: { token: user.token },
    });

    // join the therapist's personal room for notifications
    socket.emit("joinSession", user.id);

    // single handler for newSession
    socket.on("newSession", ({ sessionId, userName }) => {
      if (seenSessions.current.has(sessionId)) return; // already saw this one
      seenSessions.current.add(sessionId); // mark as seen
      setNotes((prev) => [...prev, { sessionId, userName }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user.token, user.id]); // only rerun if the token changes

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="px-6 py-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Therapist Panel
          </h2>
        </div>
        <nav className="mt-6 mb-3 space-y-1">
          <NavLink
            to="/therapist/patients"
            end
            className={({ isActive }) =>
              `flex px-6 py-3 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <HiUserGroup className="h-5 w-5 mr-3" />
            My Patients
          </NavLink>

          <NavLink
            to="/therapist/mood"
            className={({ isActive }) =>
              `flex px-6 py-3 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <MdMood className="h-5 w-5 mr-3" />
            Mood Overview
          </NavLink>

          <NavLink
            to="/therapist/resources"
            className={({ isActive }) =>
              `flex px-6 py-3  rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <MdOutlineEditNote className="h-5 w-5 mr-3" />
            My Resources
          </NavLink>

          <NavLink
            to="/therapist/profile"
            end
            className={({ isActive }) =>
              `flex px-6 py-3 mb-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <HiUser className="h-5 w-5 mr-3" />
            Profile
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

      {/* Main content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>

      {/* Pop-up notifications */}
      <div className="fixed bottom-4 right-4 space-y-3 z-50">
        {notes.map(({ sessionId, userName }) => (
          <div
            key={sessionId}
            className="bg-blue-50 border-l-4 border-blue-500 p-4 shadow-lg rounded-md max-w-xs"
          >
            <p className="text-sm">
              📩 New chat from <strong>{userName}</strong>
            </p>
            <button
              onClick={() => {
                navigate(`/therapist/chat/${sessionId}`, { replace: true });
                // remove just this notification
                setNotes((prev) =>
                  prev.filter((n) => n.sessionId !== sessionId)
                );
              }}
              className="mt-2 text-blue-600 underline text-sm"
            >
              Start Chat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
