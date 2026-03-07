import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../context/authStore";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Unirade 🎓</h1>
          <div className="space-x-4">
            <Link to="/login" className="text-gray-600 font-medium hover:text-primary">
              Login
            </Link>
            <Link to="/register" className="btn-primary">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 text-secondary">
            Find Your Perfect <span className="text-primary">Campus Match</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Connect with students who share your interests, courses, and campus vibes. 
            Meet study buddies, friends, or maybe that special someone. 💕
          </p>

          <div className="flex gap-4 justify-center mb-12">
            <Link to="/register" className="btn-primary text-lg">
              Get Started Free
            </Link>
            <button className="btn-secondary text-lg">
              Learn More
            </button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              {
                icon: "🎓",
                title: "Smart Matching",
                desc: "Get matched based on courses, interests, and study preferences",
              },
              {
                icon: "🔒",
                title: "Safe & Verified",
                desc: "University email verification ensures everyone is real and authentic",
              },
              {
                icon: "💬",
                title: "Instant Chat",
                desc: "Chat safely with matches without sharing personal contact details",
              },
            ].map((feature, i) => (
              <div key={i} className="card p-8">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <div className="card p-8 bg-gradient-to-br from-orange-100 to-red-100">
              <p className="text-4xl font-bold text-primary">1000+</p>
              <p className="text-gray-700">Students Connected</p>
            </div>
            <div className="card p-8 bg-gradient-to-br from-blue-100 to-purple-100">
              <p className="text-4xl font-bold text-blue-600">50%</p>
              <p className="text-gray-700">Match Rate in First Week</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-primary to-orange-400 text-white py-12">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Find Your Match?</h3>
          <Link to="/register" className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:scale-105 transition">
            Join Unirade Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-secondary text-white py-8">
        <div className="container mx-auto text-center text-gray-400">
          <p>&copy; 2026 Unirade. University Matching Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
