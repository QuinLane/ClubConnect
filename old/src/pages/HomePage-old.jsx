/**
 * Home page for CampusConnect
 *
 * Logic:
 * - Auth Check
 * - Fetch User Data (if logged in)
 * - Handle Logout
 * - Toggle between Login and Signup for logged-out users
 *
 * Components:
 * - Header (for logged-in users)
 * - Login (for logged-out users)
 * - Signup (for logged-out users)
 */

// Import React and hooks
import { useState, useEffect } from "react";

// Import Firebase services
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Import components
import Login from "../components/Auth/Login";
import Signup from "../components/Auth/Signup";
import Header from "../components/Shared/Header";

// Import styles (for frontend team)
import styles from "./HomePage.module.css";

// Define the page component
const HomePage = () => {
  const navigate = null;
  const [user, setUser] = useState(null); // Current logged-in user
  const [userData, setUserData] = useState(null); // User data from Firestore
  const [showSignup, setShowSignup] = useState(false); // Toggle between Login and Signup
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        setLoading(true);
        if (currentUser) {
          // User is logged in, fetch their data from Firestore
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            throw new Error("User not found.");
          }
          setUserData({ id: userDoc.id, ...userDoc.data() });
          setUser(currentUser);
        } else {
          // User is logged out
          setUser(null);
          setUserData(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      setError(null);
      await signOut(auth);
      //ADD REDIRECT HERE USING NAVIGATE ONCE IMPLEMENTED
    } catch (err) {
      setError(err.message);
    }
  };

  // Render loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render the page
  return (
    <div className={styles.pageContainer}>
      {user ? (
        <div>
          <Header user={user} />
          <h1>Welcome, {userData?.username || user.email}</h1>
          <p>Role: {userData?.role}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          {showSignup ? (
            <>
              <Signup />
              <button onClick={() => setShowSignup(false)}>Go to Login</button>
            </>
          ) : (
            <>
              <Login />
              <button onClick={() => setShowSignup(true)}>Go to Sign Up</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
