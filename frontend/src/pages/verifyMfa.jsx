import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, Loader2, ArrowLeft, KeyRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";

const VerifyMfa = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tempToken, setTempToken] = useState("");

  useEffect(() => {
    const storedTempToken = sessionStorage.getItem("tempToken");
    if (!storedTempToken) {
      navigate("/login");
      return;
    }
    setTempToken(storedTempToken);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/auth/verify-mfa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, tempToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // Successful MFA validation! Complete login with final JWT and the client vault key.
      login(data.token, data.userEncryptionKey);
      sessionStorage.removeItem("tempToken");
      navigate("/passwordvault");
    } catch (err) {
      setError(err.message || "Invalid authentication code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12 px-6">
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 max-w-md w-full p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-blue-100 p-4 rounded-full text-blue-600">
              <ShieldCheck className="w-12 h-12" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-medium text-blue-600 font-jersey10 tracking-wider">
              Two-Factor Authentication
            </h1>
            <p className="text-gray-500 text-xs mt-2 leading-relaxed">
              Your account is protected by multi-factor authentication. Please enter your 6-digit authenticator app code or a backup recovery code below.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Enter 6-digit code or recovery code"
                value={code}
                onChange={(e) => setCode(e.target.value.trim())}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-center font-mono tracking-wide focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-lg"
                required
                autoFocus
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !code}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow transition-colors flex items-center justify-center font-jersey15 tracking-wide text-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  <KeyRound className="w-5 h-5 mr-2" /> Verify Identity
                </>
              )}
            </button>
          </form>

          <div className="border-t border-gray-100 pt-4 flex justify-center">
            <button
              onClick={() => {
                sessionStorage.removeItem("tempToken");
                navigate("/login");
              }}
              className="text-gray-500 hover:text-blue-600 text-xs flex items-center font-semibold animate-pulse"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Login
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VerifyMfa;
