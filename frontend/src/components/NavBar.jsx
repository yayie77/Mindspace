// src/components/Navbar.jsx
import React, { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const initial = user?.name?.charAt(0).toUpperCase() || "";

  // close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  // Public / unauthenticated navbar
  if (!user) {
    return (
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Brand */}
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              MindFlow
            </Link>

            {/* Center links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-indigo-600">
                Home
              </Link>
              <Link
                to="/about-us"
                className="text-gray-700 hover:text-indigo-600"
              >
                About Us
              </Link>
            </div>

            {/* Auth buttons */}
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Authenticated navbar
  const dashboardPath =
    user.role === "admin"
      ? "/admin/therapists"
      : user.role === "therapist"
      ? "/therapist/patients"
      : "/dashboard";

  const editProfilePath =
    user.role === "therapist"
      ? "/therapist/profile/edit"
      : "/dashboard/profile/edit";

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            MindFlow
          </Link>

          {/* Center links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-indigo-600">
              Home
            </Link>
            <Link
              to="/about-us"
              className="text-gray-700 hover:text-indigo-600"
            >
              About Us
            </Link>
            <Link
              to={dashboardPath}
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Dashboard
            </Link>
          </div>

          {/* Greeting + Profile dropdown */}
          <div
            className="relative flex items-center space-x-4"
            ref={dropdownRef}
          >
            {/* Greeting */}
            <span className="hidden md:block text-gray-700 font-medium">
              Hello,&nbsp;{user.name}!
            </span>

            {/* Avatar */}
            <div
              onClick={() => setIsOpen((o) => !o)}
              className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center cursor-pointer"
            >
              {initial}
            </div>

            {/* Dropdown menu */}
            {isOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="p-4 border-b border-gray-100">
                  <p className="font-medium">Name: {user.name}</p>
                  <p className="text-sm font-medium capitalize">
                    Role: {user.role}
                  </p>
                </div>
                <div className="flex flex-col">
                  <Link
                    to={
                      user.role === "therapist"
                        ? "/therapist/profile"
                        : "/dashboard/profile"
                    }
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 hover:bg-gray-50"
                  >
                    View Profile
                  </Link>
                  <Link
                    to={editProfilePath}
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 hover:bg-gray-50"
                  >
                    Edit Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left px-4 py-2 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* (Optional) Mobile menu button could go here */}
        </div>
      </div>
    </nav>
  );
}
