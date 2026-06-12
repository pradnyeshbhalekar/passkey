import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Lock, AlertCircle, Eye, EyeOff, Copy, Check, Edit, Trash2 } from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import PasswordFormModal from "../pages/passwordFormModal";
import { useAuth } from "../context/AuthContext";
import { decryptPassword } from "../utils/crypto";

function PasswordVault() {
  const navigate = useNavigate();
  const { userToken, userEncryptionKey } = useAuth();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordServices, setPasswordServices] = useState([]);
  const [passwordData, setPasswordData] = useState({});
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passwordToEdit, setPasswordToEdit] = useState(null);

  useEffect(() => {
    if (userToken) {
      fetchPasswordList();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userToken, navigate]);

  useEffect(() => {
    if (passwordServices.length > 0) {
      fetchPasswordDetails();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passwordServices]);

  const fetchPasswordList = () => {
    setLoading(true);
    setError(null);

    fetch(`${API_URL}/api/passwords`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch passwords: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setPasswordServices(data);
      })
      .catch((error) => {
        console.error("Error fetching password list:", error);
        setError(error.message);
        setLoading(false);
      });
  };

  const fetchPasswordDetails = async () => {
    const passwordDetailsMap = {};
    setLoading(true);

    try {
      for (const pwd of passwordServices) {
        const response = await fetch(`${API_URL}/api/passwords/${pwd.serviceId}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch password details: ${response.status}`);
        }

        const detailData = await response.json();

        // Decrypt password client-side using the user-specific key
        let decrypted = "";
        try {
          if (detailData.encryptedPassword && userEncryptionKey) {
            decrypted = decryptPassword(detailData.encryptedPassword, userEncryptionKey);
          } else {
            decrypted = "••••••••••••";
          }
        } catch (decryptionErr) {
          console.error(`Client decryption failed for service ${pwd.serviceId}:`, decryptionErr);
          decrypted = "[Decryption Error]";
        }

        passwordDetailsMap[pwd.serviceId] = {
          ...detailData,
          decryptedPassword: decrypted,
        };
      }

      setPasswordData(passwordDetailsMap);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching password details:", error);
      setError("Failed to fetch complete password details");
      setLoading(false);
    }
  };

  const handleAddPassword = () => {
    setPasswordToEdit(null);
    setIsModalOpen(true);
  };

  const handleUpdatePassword = (serviceId) => {
    const passwordToUpdate = passwordData[serviceId];
    setPasswordToEdit({ ...passwordToUpdate, serviceId });
    setIsModalOpen(true);
  };

  const handleDeletePassword = (serviceId) => {
    if (window.confirm("Are you sure you want to delete this password?")) {
      fetch(`${API_URL}/api/passwords/delete/${serviceId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to delete password: ${response.status}`);
          }
          return response.json();
        })
        .then(() => {
          fetchPasswordList();
        })
        .catch((error) => {
          console.error("Error deleting password:", error);
          setError(error.message);
        });
    }
  };

  const handleModalClose = (passwordAdded = false) => {
    setIsModalOpen(false);
    if (passwordAdded) {
      fetchPasswordList();
    }
  };

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Fixed copyPassword bug (copies password using passed serviceId)
  const copyPassword = (serviceId) => {
    const passwordDetail = passwordData[serviceId];

    if (!passwordDetail) {
      console.error("No password found for ID:", serviceId);
      return;
    }

    const passwordToCopy = passwordDetail.decryptedPassword;
    if (!passwordToCopy || passwordToCopy === "[Decryption Error]") {
      console.error("Decrypted password is missing or corrupted!");
      return;
    }

    navigator.clipboard
      .writeText(passwordToCopy)
      .then(() => {
        setCopiedId(serviceId);
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy password:", err);
      });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-5xl font-medium text-blue-600 font-jersey10 tracking-wider">Personal</h1>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center font-jersey15"
              onClick={handleAddPassword}
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add Password
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p>Loading your passwords...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              <p>Error: {error}</p>
              <button className="mt-2 text-blue-600 hover:underline" onClick={fetchPasswordList}>
                Try again
              </button>
            </div>
          ) : passwordServices.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
              <div className="flex justify-center mb-6">
                <Lock className="w-16 h-16 text-blue-600" />
              </div>
              <h2 className="text-3xl text-blue-600 mb-4 font-jersey10">Your vault is empty</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Add your first password to start building your secure vault. Your credentials will be encrypted and safely stored.
              </p>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium flex items-center mx-auto font-jersey15"
                onClick={handleAddPassword}
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Add Password
              </button>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-medium text-blue-600 mb-4 font-jersey10">Your Passwords</h2>
              <div className="space-y-4">
                {passwordServices.map((pwd) => {
                  const details = passwordData[pwd.serviceId] || {};
                  return (
                    <div key={pwd.serviceId} className="border border-gray-200 rounded-md p-4 hover:border-blue-300 transition-all">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center mr-4">
                            <Lock className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">{pwd.serviceName}</h3>
                            {details.username && <p className="text-sm text-gray-500">{details.username}</p>}
                            {details.email && <p className="text-sm text-gray-500">{details.email}</p>}
                            <div className="flex items-center mt-1">
                              <div className="bg-gray-100 px-3 py-1 rounded text-sm flex items-center min-w-40">
                                {visiblePasswords[pwd.serviceId] ? (
                                  <span>{details.decryptedPassword || "••••••••••••"}</span>
                                ) : (
                                  <span>••••••••••••</span>
                                )}
                                <button
                                  onClick={() => togglePasswordVisibility(pwd.serviceId)}
                                  className="ml-2 text-gray-500 hover:text-blue-600"
                                  title={visiblePasswords[pwd.serviceId] ? "Hide password" : "Show password"}
                                >
                                  {visiblePasswords[pwd.serviceId] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => copyPassword(pwd.serviceId)}
                                  className="ml-1 text-gray-500 hover:text-blue-600"
                                  title="Copy password"
                                >
                                  {copiedId === pwd.serviceId ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>

                                <div className="ml-2 border-l border-gray-300 pl-2 flex">
                                  <button
                                    onClick={() => handleUpdatePassword(pwd.serviceId)}
                                    className="text-gray-500 hover:text-blue-600 mr-1"
                                    title="Update password"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeletePassword(pwd.serviceId)}
                                    className="text-gray-500 hover:text-red-600"
                                    title="Delete password"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(pwd.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-12 bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-blue-600 mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2 font-jersey10">Security Tip</h3>
                <p className="text-gray-600">
                  For maximum security, use unique, complex passwords for each service. PASSKEY can generate strong passwords for you and securely store them all in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PasswordFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        passwordToEdit={passwordToEdit}
      />

      <Footer />
    </div>
  );
}

export default PasswordVault;