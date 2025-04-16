// src/pages/[PageName].jsx

// Import React and hooks
import { useState, useEffect } from "react";

// Import Firebase services (if needed)
import { auth, db } from "../firebase"; // Updated to use firebase.js
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore"; // Example Firestore imports

// Import components
import ComponentName from "../components/ComponentName";

// Import styles (if using CSS modules or styled-components)
import styles from "./PageName.module.css";

// Define the page component
const PageName = () => {
  // State for page-level data
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]); // Example: data fetched from Firestore
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = null; //Change later to point to ROUTER

  // Fetch user authentication state (if needed)
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //     setUser(currentUser);
  //     setLoading(false);
  //   });
  //   return () => unsubscribe();
  // }, []);

  // Fetch user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        //ADD AFTER ROUTER, REDIRECT IF USER IS NOT LOGGED IN
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch data from Firestore (if needed)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "collectionName"));
        const dataList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(dataList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]); // Re-fetch data when user changes

  // Handle user actions (e.g., button clicks, form submissions)
  const handleAction = async () => {
    try {
      setError(null);
      // Example: Call a Vercel Function or update Firestore
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
      <h1>Page Title</h1>
      {/* Render components and pass props */}
      <ComponentName userId={user?.uid} data={data} onAction={handleAction} />
    </div>
  );
};

export default PageName;
