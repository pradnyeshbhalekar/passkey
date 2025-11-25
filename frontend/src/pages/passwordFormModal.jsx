import React, { useState, useEffect } from "react";
import {
  X,
  Eye,
  EyeOff,
  Copy,
  Check,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function PasswordFormModal({ isOpen, onClose, passwordToEdit }) {
  const { userToken } = useAuth();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
  
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    password: "",
  });
  const [saveStatus, setSaveStatus] = useState({ message: "", isError: false });
  const isEditMode = !!passwordToEdit;


  useEffect(() => {
    if (passwordToEdit) {
      setFormData({
        title: passwordToEdit.serviceName || "",
        password: passwordToEdit.decryptedPassword || "",
      });
      if (passwordToEdit.decryptedPassword) {
        setPasswordStrength(calculatePasswordStrength(passwordToEdit.decryptedPassword));
      }
    } else {
      resetForm();
    }
  }, [passwordToEdit]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "password") {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length > 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    return score;
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500";
    if (passwordStrength <= 50) return "bg-orange-500";
    if (passwordStrength <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength <= 25) return "Weak";
    if (passwordStrength <= 50) return "Fair";
    if (passwordStrength <= 75) return "Good";
    return "Strong";
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(formData.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,./<>?";
    const numbers = "0123456789";

    let chars = uppercase + lowercase + symbols + numbers;
    const length = 16;

    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }

    setFormData({
      ...formData,
      password,
    });
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      password: "",
    });
    setPasswordStrength(0);
    setSaveStatus({ message: "", isError: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();


    const requestData = {
      serviceName: formData.title,
      password: formData.password,
    };


    const url = isEditMode
      ? `${API_URL}/api/passwords/update/${passwordToEdit.serviceId}`
      : `${API_URL}/api/passwords`;
    
    const method = isEditMode ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to ${isEditMode ? 'update' : 'save'} password`);
        }
        return response.json();
      })
      .then((data) => {
        setSaveStatus({
          message: `Password ${isEditMode ? 'updated' : 'saved'} successfully!`,
          isError: false,
        });

        setTimeout(() => {

          onClose(true, isEditMode, isEditMode ? { ...data, serviceId: passwordToEdit.serviceId } : null);
          resetForm();
        }, 1500);
      })
      .catch((error) => {
        console.error(`Error ${isEditMode ? 'updating' : 'saving'} password:`, error);
        setSaveStatus({
          message: `Error ${isEditMode ? 'updating' : 'saving'} password. Please try again.`,
          isError: true,
        });
      });
  };

  const handleClose = () => {
    resetForm();
    onClose(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-jersey10 text-blue-600">
            {isEditMode ? 'Update Password' : 'Add New Password'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="title"
              >
                Service Name
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. My Bank Account"
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 pr-20"
                  placeholder="Enter password"
                  required
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex">
                  <button
                    type="button"
                    onClick={copyPassword}
                    className="p-1 text-gray-500 hover:text-blue-600"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="p-1 text-gray-500 hover:text-blue-600"
                  >
                    {passwordVisible ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm flex items-center">
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-1 ${
                        passwordStrength >= 25
                          ? getStrengthColor()
                          : "bg-gray-300"
                      }`}
                    ></span>
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-1 ${
                        passwordStrength >= 50
                          ? getStrengthColor()
                          : "bg-gray-300"
                      }`}
                    ></span>
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-1 ${
                        passwordStrength >= 75
                          ? getStrengthColor()
                          : "bg-gray-300"
                      }`}
                    ></span>
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-1 ${
                        passwordStrength >= 100
                          ? getStrengthColor()
                          : "bg-gray-300"
                      }`}
                    ></span>
                    <span className="ml-2 text-gray-600">
                      {formData.password ? getStrengthText() : ""}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Generate Strong Password
                  </button>
                </div>
                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getStrengthColor()}`}
                    style={{ width: `${passwordStrength}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-md flex items-start">
              <ShieldCheck className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                Your password will be encrypted using AES-256 encryption before
                being stored in your vault.
              </p>
            </div>

            {saveStatus.message && (
              <div
                className={`p-3 rounded-md ${
                  saveStatus.isError
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {saveStatus.message}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-jersey15"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-jersey15"
            >
              {isEditMode ? 'Update' : 'Save'} Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasswordFormModal;