import React from "react";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-3 py-3 flex justify-between items-center">
          {/* Logo + Title */}
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 text-white p-1.5 md:p-2 rounded-full">
              <Home size={18} className="md:size-5" />
            </div>
            <h1 className="text-base md:text-xl font-bold text-indigo-800 leading-tight">
              Campus Connect
            </h1>
          </div>

          {/* Navigation Buttons */}
          <nav className="flex space-x-2">
            <button
              onClick={() => navigate("/login")}
              className="px-3 py-1 text-sm text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-100 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Sign Up
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-12 flex-1">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left Column */}
          <div className="w-full md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-3 leading-snug">
              Connect With Your Campus Community
            </h2>
            <p className="text-sm md:text-lg text-gray-600 mb-5 leading-relaxed">
              Join Campus Connect to network with peers, discover events, and engage with your campus resources — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => navigate("/signup")}
                className="px-5 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate("/learn-more")}
                className="px-5 py-2 text-sm text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-100 transition-colors font-medium"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="bg-indigo-200 rounded-lg p-4 w-full max-w-sm aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="bg-white p-3 rounded-full inline-block mb-3">
                  <Home size={32} className="text-indigo-600" />
                </div>
                <p className="text-indigo-800 font-medium text-sm">Campus Connect Logo</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-3 md:mb-0">
              <div className="bg-white text-indigo-600 p-1 rounded-full mr-2">
                <Home size={14} />
              </div>
              <span className="text-xs md:text-sm font-medium">Campus Connect</span>
            </div>
            <div className="text-xs text-gray-400">
              © 2025 Campus Connect. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
