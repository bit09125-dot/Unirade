import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../context/authStore";
import { matchService } from "../services/api";

export default function Discover() {
  const navigate = useNavigate();
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const user = useAuthStore((state) => state.user);
  const [suggestions, setSuggestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const data = await matchService.getSuggestions();
      setSuggestions(data);
      setCurrentIndex(0);
    } catch (err) {
      setError("Failed to load suggestions");
    } finally {
      setLoading(false);
    }
  };

  const currentProfile = suggestions[currentIndex];

  const handleLike = async () => {
    try {
      const result = await matchService.likeUser(currentProfile.id);
      if (result.matched) {
        alert("🎉 It's a match! Start chatting now.");
        navigate("/matches");
      } else {
        nextProfile();
      }
    } catch (err) {
      setError("Failed to like profile");
    }
  };

  const handleSkip = () => {
    nextProfile();
  };

  const handleBlock = async () => {
    try {
      await matchService.blockUser(currentProfile.id);
      nextProfile();
    } catch (err) {
      setError("Failed to block user");
    }
  };

  const nextProfile = () => {
    if (currentIndex < suggestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setError("No more suggestions");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading profiles...</p>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold mb-4">No more profiles 😔</p>
          <button onClick={fetchSuggestions} className="btn-primary">
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <button onClick={() => navigate("/dashboard")} className="text-primary font-bold">
            ← Back
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Profile Card */}
          <div className="card overflow-hidden mb-6">
            {/* Profile Photo */}
            <div className="bg-gradient-to-br from-primary to-orange-400 h-96 flex items-center justify-center text-white text-6xl">
              {currentProfile.profile_photo_url ? (
                <img
                  src={currentProfile.profile_photo_url}
                  alt={currentProfile.first_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                "👤"
              )}
            </div>

            {/* Profile Info */}
            <div className="p-6">
              <h2 className="text-3xl font-bold mb-2">
                {currentProfile.first_name} {currentProfile.last_name}
              </h2>
              <p className="text-gray-600 mb-4">
                {currentProfile.course} • Year {currentProfile.year_of_study}
              </p>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-gray-700">{currentProfile.bio || "No bio yet"}</p>
              </div>

              {/* Interests */}
              {currentProfile.interests && (
                <div className="mb-4">
                  <p className="font-semibold mb-2">Interests:</p>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.interests.map((interest, i) => (
                      <span
                        key={i}
                        className="bg-primary text-white px-3 py-1 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleBlock}
              className="bg-red-100 text-red-700 px-8 py-3 rounded-lg font-bold hover:bg-red-200"
            >
              🚫 Block
            </button>
            <button
              onClick={handleSkip}
              className="btn-secondary px-8 py-3"
            >
              ⏭️ Skip
            </button>
            <button
              onClick={handleLike}
              className="btn-primary px-8 py-3"
            >
              ❤️ Like
            </button>
          </div>

          {/* Progress */}
          <div className="text-center mt-6 text-gray-600">
            <p>
              {currentIndex + 1} of {suggestions.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
