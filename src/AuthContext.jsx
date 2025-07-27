import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

// Utility functions for localStorage operations
const getLocalStorageItem = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return null;
  }
};

const setLocalStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
};

const removeLocalStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getLocalStorageItem("token");
    const role = getLocalStorageItem("role");
    const user_id = getLocalStorageItem("user_id");
    const name = getLocalStorageItem("name");
    const companyName = getLocalStorageItem("companyName");


    if (token && role && user_id) {
      setUser({ token, role, user_id, name,companyName });
    }
    setLoading(false);
  }, []);

  const login = (token, role, user_id, name, companyName) => {
    setLocalStorageItem("token", token);
    setLocalStorageItem("role", role);
    setLocalStorageItem("user_id", user_id);
    setLocalStorageItem("name", name);
    setLocalStorageItem("companyName", companyName);
    setUser({ token, role, user_id, name,companyName });
  };

  const logout = () => {
    removeLocalStorageItem("token");
    removeLocalStorageItem("role");
    removeLocalStorageItem("user_id");
    removeLocalStorageItem("name");
    removeLocalStorageItem("companyName");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);