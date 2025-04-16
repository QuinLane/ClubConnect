// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase"; // your Firebase config

// Create the context object
const AuthContext = createContext(null);

// Custom hook to use the AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // We'll store the current user (or null if not logged in)
  const [currentUser, setCurrentUser] = useState(null);
  // A loading state so we only render children after we know the user status
  const [loading, setLoading] = useState(true);

  // Listen for changes to the authenticated user (login, logout, etc.)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Function to log in with an email and password
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Function to log out the current user
  function logout() {
    return signOut(auth);
  }

  // We'll define an "isAuthenticated" property if currentUser != null
  const isAuthenticated = !!currentUser;

  // The value we provide to the context
  const value = {
    currentUser,      // The Firebase user object
    isAuthenticated,  // Boolean: whether there is a logged-in user
    login,
    logout,
    loading
  };

  // Only render the children if not loading
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
