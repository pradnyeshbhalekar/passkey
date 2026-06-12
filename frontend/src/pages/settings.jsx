import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Smartphone, Key, CheckCircle, XCircle, Copy, Check, Lock, Loader2, ArrowLeft } from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const navigate = useNavigate();
  const { userToken } = useAuth();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

  const [loading, setLoading] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [setupMode, setSetupMode] = useState(false);
  const [disableMode, setDisableMode] = useState(false);

  // Setup state
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [backupCodes, setBackupCodes] = useState([]);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Disable state
  const [disableCode, setDisableCode] = useState("");

  useEffect(() => {
    if (!userToken) {
      navigate("/login");
      return;
    }
    fetchMfaStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userToken, navigate]);

  const fetchMfaStatus = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_URL}/auth/mfa/status`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to load security settings");
      }
      const data = await res.json();
      setMfaEnabled(data.enabled);
    } catch (err) {
      setError(err.message || "Failed to load MFA status");
    } finally {
      setLoading(false);
    }
  };

  const handleStartSetup = async () => {
    try {
      setActionLoading(true);
      setError("");
      setSuccess("");
      const res = await fetch(`${API_URL}/auth/mfa/setup`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate MFA setup");
      }
      setQrCodeUrl(data.qrCodeUrl);
      setSecret(data.secret);
      setBackupCodes(data.backupCodes);
      setSetupMode(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyAndEnable = async (e) => {
    e.preventDefault();
    if (!verificationCode) return;

    try {
      setActionLoading(true);
      setError("");
      const res = await fetch(`${API_URL}/auth/mfa/enable`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: verificationCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "MFA validation failed");
      }
      setMfaEnabled(true);
      setSetupMode(false);
      setSuccess("Multi-Factor Authentication enabled successfully!");
      setVerificationCode("");
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisableMfa = async (e) => {
    e.preventDefault();
    if (!disableCode) return;

    try {
      setActionLoading(true);
      setError("");
      const res = await fetch(`${API_URL}/auth/mfa/disable`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: disableCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to disable MFA");
      }
      setMfaEnabled(false);
      setDisableMode(false);
      setSuccess("Multi-Factor Authentication has been disabled.");
      setDisableCode("");
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const copyBackupCodes = () => {
    const text = backupCodes.join("\n");
    navigator.clipboard.writeText(text);
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-4xl font-medium text-blue-600 font-jersey10 tracking-wider">Security Settings</h1>
              <p className="text-gray-500 text-xs mt-1">Configure MFA parameters and cryptographic settings.</p>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center shadow-sm">
              <XCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center shadow-sm">
              <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {loading ? (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-16 text-center flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-500">Loading security parameters...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Card: Multi-Factor Authentication */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-medium text-gray-800 font-jersey10 tracking-wide">
                        Multi-Factor Authentication (MFA)
                      </h2>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Add an extra layer of defense using TOTP (Google Authenticator compatible).
                      </p>
                    </div>
                  </div>
                  <div>
                    {mfaEnabled ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                        <Lock className="w-3.5 h-3.5 mr-1" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  {/* Default State */}
                  {!setupMode && !disableMode && (
                    <div className="space-y-6">
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        Multi-Factor Authentication (MFA) adds a vital layer of security. Even if an attacker learns your credentials, they will be blocked from accessing your password vault without physical access to your mobile device's authenticator app.
                      </p>

                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 md:p-5 flex items-start space-x-3 text-blue-700">
                        <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-sm">Security Recommendation</h4>
                          <p className="text-xs mt-1 opacity-90 leading-relaxed">
                            Implementing TOTP-based authentication mitigates risks associated with session hijacking, phishing, and credential stuffing.
                          </p>
                        </div>
                      </div>

                      <div className="pt-4">
                        {mfaEnabled ? (
                          <button
                            onClick={() => setDisableMode(true)}
                            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-6 rounded-lg shadow transition-colors font-jersey15 tracking-wide text-lg"
                          >
                            Disable MFA
                          </button>
                        ) : (
                          <button
                            onClick={handleStartSetup}
                            disabled={actionLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg shadow transition-colors flex items-center font-jersey15 tracking-wide text-lg"
                          >
                            {actionLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Enable MFA
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Setup Mode */}
                  {setupMode && (
                    <div className="space-y-8">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 font-jersey10">MFA Setup</h3>
                        <button
                          onClick={() => setSetupMode(false)}
                          className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8 items-start">
                        {/* Step 1: QR Code & Secret */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-700 flex items-center">
                            <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-xs font-bold mr-2">1</span>
                            Scan QR Code
                          </h4>
                          <p className="text-xs text-gray-500 leading-relaxed">
                            Scan the QR code below using your authenticator application (e.g., Google Authenticator, Authy, or Duo).
                          </p>
                          {qrCodeUrl ? (
                            <div className="border border-gray-200 p-4 rounded-xl inline-block bg-white shadow-sm">
                              <img src={qrCodeUrl} alt="MFA QR Code" className="w-44 h-44 mx-auto" />
                            </div>
                          ) : (
                            <div className="w-44 h-44 border border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                              <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                            </div>
                          )}
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <span className="text-xs text-gray-400 block font-semibold">Or enter manually:</span>
                            <code className="text-xs text-gray-700 break-all select-all font-mono">{secret}</code>
                          </div>
                        </div>

                        {/* Step 2: Backup Codes */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-700 flex items-center">
                            <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-xs font-bold mr-2">2</span>
                            Save Backup Recovery Codes
                          </h4>
                          <p className="text-xs text-red-500 font-semibold leading-relaxed">
                            WARNING: Store these codes securely. They will only be displayed ONCE. You can use them to log in if you lose access to your authenticator device.
                          </p>

                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <div className="grid grid-cols-2 gap-2 text-center font-mono text-sm font-semibold text-gray-800">
                              {backupCodes.map((code, idx) => (
                                <div key={idx} className="bg-white py-1.5 px-3 rounded border border-gray-100 shadow-sm">
                                  {code}
                                </div>
                              ))}
                            </div>
                            <button
                              onClick={copyBackupCodes}
                              className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                            >
                              {copiedCodes ? (
                                <>
                                  <Check className="w-4 h-4 mr-2 text-green-500" /> Keys Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4 mr-2" /> Copy to Clipboard
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Step 3: Verify Code */}
                      <div className="border-t border-gray-200 pt-6 max-w-md">
                        <h4 className="font-semibold text-gray-700 flex items-center mb-3">
                          <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-xs font-bold mr-2">3</span>
                          Verify and Activate
                        </h4>
                        <form onSubmit={handleVerifyAndEnable} className="space-y-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">6-Digit Authenticator Code</label>
                            <input
                              type="text"
                              maxLength={6}
                              placeholder="000000"
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-mono tracking-widest text-center text-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                              required
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={actionLoading || verificationCode.length !== 6}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg shadow transition-colors flex items-center justify-center font-jersey15 tracking-wide text-lg"
                          >
                            {actionLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Activate MFA
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Disable Mode */}
                  {disableMode && (
                    <div className="space-y-6 max-w-md">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 font-jersey10">Disable MFA</h3>
                        <button
                          onClick={() => setDisableMode(false)}
                          className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                          Cancel
                        </button>
                      </div>

                      <p className="text-xs text-red-500 font-semibold leading-relaxed">
                        CAUTION: Disabling MFA reduces your security score. Your password vault will be protected *only* by your Google OAuth session.
                      </p>

                      <form onSubmit={handleDisableMfa} className="space-y-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Enter a 6-digit Authenticator Code or a Backup Recovery Code
                          </label>
                          <input
                            type="text"
                            placeholder="Code or Backup Code"
                            value={disableCode}
                            onChange={(e) => setDisableCode(e.target.value.trim())}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-center text-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={actionLoading || !disableCode}
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg shadow transition-colors flex items-center justify-center font-jersey15 tracking-wide text-lg"
                        >
                          {actionLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          Confirm & Disable MFA
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>

              {/* Card: Cryptographic Vault Details */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 border-b border-gray-200 bg-gray-50 flex items-center space-x-4">
                  <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
                    <Key className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-medium text-gray-800 font-jersey10 tracking-wide">
                      Client-Side AES-256 Vault
                    </h2>
                    <p className="text-gray-500 text-xs mt-0.5">
                      Information about your password vault cryptographic parameters.
                    </p>
                  </div>
                </div>
                <div className="p-6 md:p-8 space-y-4 text-sm text-gray-600">
                  <p className="leading-relaxed">
                    This password manager runs a zero-knowledge architecture. Your passwords are encrypted directly in the browser with your unique 256-bit cryptographic key before hitting the network.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-xs text-gray-500 pl-2">
                    <li>Algorithm: <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-gray-700">AES-256 (CryptoJS)</code></li>
                    <li>Key strength: <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-gray-700">256-bit (32 bytes)</code></li>
                    <li>Server visibility: <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-gray-700">Ciphertext only (Zero-Knowledge)</code></li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
