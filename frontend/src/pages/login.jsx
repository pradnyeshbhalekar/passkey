import { GoogleLogin } from "@react-oauth/google";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../assests/images/login.png";
import "../styles/fonts.css";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
  const [error, setError] = useState("");

  const handleSuccess = async (credentialResponse) => {
    try {
      setError("");
      const token = credentialResponse.credential;
      console.log("Using API_URL:", API_URL);
      const res = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Check if MFA check is required
      if (data.mfaRequired) {
        sessionStorage.setItem("tempToken", data.tempToken);
        navigate("/verify-mfa");
        return;
      }

      // Log in directly
      login(data.token, data.userEncryptionKey);
      navigate("/");
    } catch (err) {
      console.error("Login verification error:", err);
      setError(err.message || "Failed to complete authentication. Please try again.");
    }
  };

  const handleFailure = () => {
    setError("Google Sign-In failed. Please try again.");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="w-full md:w-1/2 flex justify-center">
              <img
                src={loginImage}
                alt="Security Lock Illustration"
                className="w-96 h-auto"
              />
            </div>

            <div className="w-full md:w-1/2">
              <h1 className="text-5xl font-medium text-blue-600 mb-8 font-jersey10 tracking-wider">
                Your Vault, Just a Click Away
              </h1>

              {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4 max-w-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-left">
                <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
