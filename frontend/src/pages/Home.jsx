import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
export default function Homepage() {
  const { user } = useContext(AuthContext);
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section
        id="hero"
        className="flex-grow flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white py-20"
      >
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Welcome to MindFlow
          </h1>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            Your companion for mental wellbeing. Connect with therapists, track
            your mood, and access resources that help you thrive.
          </p>
          {/* only show these if NOT logged in */}
          {!user && (
            <div className="flex justify-center space-x-4">
              <Link
                to="/register"
                className="px-6 py-3 text-white bg-indigo-600 rounded hover:bg-indigo-700 transition"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 text-indigo-600 bg-white border border-indigo-600 rounded hover:bg-indigo-50 transition"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-indigo-600 text-5xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Chat App</h3>
              <p>
                Secure, real-time messaging with licensed therapists whenever
                you need support.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-indigo-600 text-5xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Mood Tracker</h3>
              <p>
                Log your emotions daily to spot trends and understand your
                mental health better.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-indigo-600 text-5xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">Resources</h3>
              <p>
                Explore articles, exercises, and tools curated to support your
                wellbeing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="text-gray-700">
            At MindFlow, our mission is to make mental health support
            accessible to everyone. Whether you’re looking for professional
            guidance or self-help tools, we’ve built a safe space for you to
            grow and heal.
          </p>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          © {new Date().getFullYear()} MindFlow. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
