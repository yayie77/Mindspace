import React from "react";
import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero */}
      <header className="flex-grow flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white py-20">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            About MindFlow
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            MindFlow is your digital companion for mental wellbeing. Whether
            you ’re seeking professional support, tracking your mood, or
            exploring self-help resources, we’ve got you covered.
          </p>
        </div>
      </header>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Chat App */}
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-indigo-600 text-5xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Chat App</h3>
              <p className="text-gray-600">
                Secure, real-time messaging with licensed therapists anywhere,
                anytime.
              </p>
            </div>
            {/* Mood Tracker */}
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-indigo-600 text-5xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Mood Tracker</h3>
              <p className="text-gray-600">
                Log daily emotions, spot patterns, and gain insights into your
                mental health.
              </p>
            </div>
            {/* Resources */}
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-indigo-600 text-5xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">Resources</h3>
              <p className="text-gray-600">
                Browse articles, exercises, and tools handpicked to support your
                journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="text-indigo-600 text-3xl font-bold">1</div>
              <div>
                <h4 className="text-xl font-semibold">Create Your Account</h4>
                <p className="text-gray-600">
                  Sign up as a user, therapist, or admin in seconds.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-indigo-600 text-3xl font-bold">2</div>
              <div>
                <h4 className="text-xl font-semibold">Connect & Chat</h4>
                <p className="text-gray-600">
                  Users chat with therapists through our secure, real-time
                  system.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-indigo-600 text-3xl font-bold">3</div>
              <div>
                <h4 className="text-xl font-semibold">Track Your Mood</h4>
                <p className="text-gray-600">
                  Log how you feel each day, see trends, and share insights with
                  your therapist.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-indigo-600 text-3xl font-bold">4</div>
              <div>
                <h4 className="text-xl font-semibold">Explore Resources</h4>
                <p className="text-gray-600">
                  Access articles, guided exercises, and self-help tools
                  anytime.
                </p>
              </div>
            </div>
          </div>
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
