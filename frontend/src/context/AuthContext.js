import React, { createContext, useState, useContext, useEffect } from 'react';


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

  const [userToken, setUserToken] = useState(() => {
    const storedToken = localStorage.getItem('userToken');
    return storedToken || null;
  });


  useEffect(() => {
    if (userToken) {
      localStorage.setItem('userToken', userToken);
    } else {
      localStorage.removeItem('userToken');
    }
  }, [userToken]);


  useEffect(() => {
    // console.log("AuthContext token updated:", userToken);
  }, [userToken]);


  const login = (token) => {
    setUserToken(token);
  };


  const logout = () => {
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, setUserToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};