import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { RefreshCw, Lock } from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import ServiceNameModal from "../components/serviceNameModal";
import { encryptPassword } from "../utils/crypto";

function PasswordGenerate() {
  const { userToken, userEncryptionKey } = useAuth();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

  const [passwordLength, setPasswordLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("eYd4w!$Z1rPbl6N8jO7o");
  const [copyMessage, setCopyMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    handleGeneratePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGeneratePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,./<>?";
    const numbers = "0123456789";

    let chars = "";
    if (includeUppercase) chars += uppercase;
    if (includeLowercase) chars += lowercase;
    if (includeSymbols) chars += symbols;
    if (includeNumbers) chars += numbers;

    if (chars === "") chars = lowercase;

    let password = "";
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }

    setGeneratedPassword(password);
    setCopyMessage("");
    setSaveMessage("");
  };

  const handleCopyPassword = () => {
    navigator.clipboard
      .writeText(generatedPassword)
      .then(() => {
        setCopyMessage("Password copied to clipboard!");
        setTimeout(() => setCopyMessage(""), 3000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleSavePassword = (serviceName) => {
    if (!userToken) {
      console.error("No user token available");
      return;
    }

    if (!userEncryptionKey) {
      setSaveMessage("Error: encryption key not loaded. Please log in again.");
      return;
    }

    // SECURITY PATCH: Encrypt password client-side before sending
    let encrypted = "";
    try {
      encrypted = encryptPassword(generatedPassword, userEncryptionKey);
    } catch (err) {
      console.error("Vulnerability patch failed to encrypt password:", err);
      setSaveMessage("Error: Cryptographic operation failed.");
      return;
    }

    fetch(`${API_URL}/api/passwords`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        serviceName: serviceName,
        password: encrypted,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setSaveMessage(`Password saved successfully for ${serviceName}!`);
        setTimeout(() => setSaveMessage(""), 4000);
      })
      .catch((error) => {
        console.error("Error saving password:", error);
        setSaveMessage("Error: Failed to save password to vault.");
      });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-5xl font-medium text-blue-600 font-jersey10 tracking-wider">Generate a password</h1>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
            <div className="mb-8">
              <label htmlFor="passwordLength" className="block mb-2 text-lg font-medium text-gray-800 font-jersey10">
                Password Length: {passwordLength} characters
              </label>
              <input
                type="range"
                id="passwordLength"
                min="8"
                max="32"
                value={passwordLength}
                onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeUppercase"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="includeUppercase" className="ml-3 text-gray-800">
                  Include uppercase letters (A-Z)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeLowercase"
                  checked={includeLowercase}
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="includeLowercase" className="ml-3 text-gray-800">
                  Include lowercase letters (a-z)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeSymbols"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="includeSymbols" className="ml-3 text-gray-800">
                  Include symbols (!@#$)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeNumbers"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="includeNumbers" className="ml-3 text-gray-800">
                  Include numbers (0-9)
                </label>
              </div>
            </div>

            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-md flex items-center justify-center font-jersey15 mb-8"
              onClick={handleGeneratePassword}
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Generate Password
            </button>

            <div className="mb-4">
              <h2 className="text-xl font-medium text-gray-800 mb-4 font-jersey10">Strong password</h2>
              <div className="flex items-center">
                <div className="flex-grow p-4 bg-gray-50 border border-gray-200 rounded-md font-mono text-lg select-all">
                  {generatedPassword}
                </div>
                <button
                  className="ml-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-4 rounded-md"
                  onClick={handleCopyPassword}
                >
                  Copy
                </button>
                <button
                  className="ml-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-4 rounded-md"
                  onClick={() => setIsModalOpen(true)}
                >
                  Save
                </button>
              </div>
              {copyMessage && <p className="text-green-600 mt-2 font-medium">{copyMessage}</p>}
              {saveMessage && (
                <p className={`mt-2 font-medium ${saveMessage.startsWith("Error") ? "text-red-600" : "text-green-600"}`}>
                  {saveMessage}
                </p>
              )}
              <p className="text-gray-500 mt-2">The generated password is stored in your clipboard for 30 seconds.</p>
            </div>
          </div>

          <div className="mt-12 bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <Lock className="w-6 h-6 text-blue-600 mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2 font-jersey10">Security Tip</h3>
                <p className="text-gray-600">
                  Strong passwords should be at least 12 characters long and include a mix of uppercase, lowercase,
                  numbers, and symbols. Using this generator helps create passwords that are difficult to crack.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ServiceNameModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSavePassword} />
      <Footer />
    </div>
  );
}

export default PasswordGenerate;