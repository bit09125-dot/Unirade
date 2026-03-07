import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { messageService } from "../services/api";

export default function Matches() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await messageService.getConversations();
      setMatches(data);
    } catch (err) {
      setError("Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading matches...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between">
          <button onClick={() => navigate("/dashboard")} className="text-primary font-bold">
            ← Back
          </button>
          <h1 className="text-xl font-bold">Your Matches 💕</h1>
          <div></div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {matches.length === 0 ? (
          <div className="text-center">
            <p className="text-2xl font-bold mb-4">No matches yet 😔</p>
            <button onClick={() => navigate("/discover")} className="btn-primary">
              Start Discovering
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {matches.map((match) => (
              <div
                key={match.id}
                className="card p-6 hover:shadow-lg cursor-pointer transition"
                onClick={() => navigate(`/chat/${match.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange-400 rounded-full flex items-center justify-center text-2xl">
                    {match.profile_photo_url ? (
                      <img
                        src={match.profile_photo_url}
                        alt={match.first_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      "👤"
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-lg">
                      {match.first_name} {match.last_name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {match.course} • Year {match.year_of_study}
                    </p>
                    <p className="text-gray-500 text-xs mt-1 truncate">
                      {match.last_message || "No messages yet"}
                    </p>
                  </div>

                  {match.unread_count > 0 && (
                    <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {match.unread_count}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
