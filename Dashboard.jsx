import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../context/authStore";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const getCurrentUser = useAuthStore((state) => state.getCurrentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await getCurrentUser();
      } catch (err) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Unirade 🎓</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.first_name}!</span>
            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="card p-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Welcome to Unirade! 🎊</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-6 hover:shadow-lg cursor-pointer" onClick={() => navigate("/discover")}>
                <div className="text-5xl mb-4">💕</div>
                <h3 className="text-xl font-bold mb-2">Start Discovering</h3>
                <p className="text-gray-600">Find your perfect match</p>
              </div>

              <div className="card p-6 hover:shadow-lg cursor-pointer" onClick={() => navigate("/matches")}>
                <div className="text-5xl mb-4">🔥</div>
                <h3 className="text-xl font-bold mb-2">Your Matches</h3>
                <p className="text-gray-600">View your connections</p>
              </div>

              <div className="card p-6 hover:shadow-lg cursor-pointer" onClick={() => navigate("/profile/setup")}>
                <div className="text-5xl mb-4">👤</div>
                <h3 className="text-xl font-bold mb-2">Complete Profile</h3>
                <p className="text-gray-600">Add your interests & photo</p>
              </div>

              <div className="card p-6 hover:shadow-lg cursor-pointer">
                <div className="text-5xl mb-4">💬</div>
                <h3 className="text-xl font-bold mb-2">Messages</h3>
                <p className="text-gray-600">Chat with matches</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
