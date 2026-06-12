import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(() => {
    const storedToken = localStorage.getItem("userToken");
    return storedToken || null;
  });

  const [userEncryptionKey, setUserEncryptionKey] = useState(() => {
    const storedKey = sessionStorage.getItem("userEncryptionKey");
    return storedKey || null;
  });

  // Sync token to localStorage
  useEffect(() => {
    if (userToken) {
      localStorage.setItem("userToken", userToken);
    } else {
      localStorage.removeItem("userToken");
    }
  }, [userToken]);

  // Sync encryption key to sessionStorage (automatically cleared when the tab closes)
  useEffect(() => {
    if (userEncryptionKey) {
      sessionStorage.setItem("userEncryptionKey", userEncryptionKey);
    } else {
      sessionStorage.removeItem("userEncryptionKey");
    }
  }, [userEncryptionKey]);

  const login = (token, encryptionKey) => {
    setUserToken(token);
    setUserEncryptionKey(encryptionKey);
  };

  const logout = () => {
    setUserToken(null);
    setUserEncryptionKey(null);
    localStorage.removeItem("userToken");
    sessionStorage.removeItem("userEncryptionKey");
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        setUserToken,
        userEncryptionKey,
        setUserEncryptionKey,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};