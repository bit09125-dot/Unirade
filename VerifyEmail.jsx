import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../context/authStore";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const verifyEmail = useAuthStore((state) => state.verifyEmail);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  const email = location.state?.email || "your email";

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token.trim()) {
      setError("Please enter the verification code");
      return;
    }

    setLoading(true);

    try {
      await verifyEmail(token);
      setSuccess("Email verified! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.error || "Verification failed. Check your code and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="card p-8 text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">Verify Email 📧</h1>
            <p className="text-gray-600 mb-6">
              We sent a code to <strong>{email}</strong>
            </p>

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

            <form onSubmit={handleVerify} className="space-y-4">
              <input
                type="text"
                placeholder="Enter verification code"
                className="input-field text-center"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                maxLength="64"
              />

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            </form>

            <p className="text-sm text-gray-600 mt-4">
              Check your spam folder if you don't see the email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
