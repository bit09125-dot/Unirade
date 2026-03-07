import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../context/authStore";

export default function ProfileSetup() {
  const navigate = useNavigate();
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    bio: user?.bio || "",
    gender: user?.gender || "",
    interests: user?.interests?.join(", ") || "",
    studyPreference: user?.study_preference || "study_buddy",
    dateOfBirth: user?.date_of_birth || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await updateProfile({
        bio: formData.bio,
        gender: formData.gender,
        interests: formData.interests.split(",").map((i) => i.trim()),
        studyPreference: formData.studyPreference,
        dateOfBirth: formData.dateOfBirth,
      });

      setSuccess("Profile updated successfully!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

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
          <div className="card p-8">
            <h2 className="text-3xl font-bold mb-6">Complete Your Profile 👤</h2>

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-semibold mb-2">Bio</label>
                <textarea
                  name="bio"
                  className="input-field"
                  placeholder="Tell us about yourself..."
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Gender</label>
                  <select
                    name="gender"
                    className="input-field"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    className="input-field"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">Interests (comma separated)</label>
                <input
                  type="text"
                  name="interests"
                  className="input-field"
                  placeholder="e.g., Gaming, Reading, Sports, Music"
                  value={formData.interests}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">What are you looking for?</label>
                <select
                  name="studyPreference"
                  className="input-field"
                  value={formData.studyPreference}
                  onChange={handleChange}
                >
                  <option value="study_buddy">Study Buddy</option>
                  <option value="friend">Friend</option>
                  <option value="romance">Romance</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
