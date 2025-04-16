/**
 *  Page to list the user's groups
 *
 *  Components:
 *  -GroupList
 *  -Header
 *
 *  Logic:
 *  -Auth Check
 *  -Fetch users groups
 *  -Real-Time updates
 *
 */
// Import React and hooks
import { useState, useEffect } from "react";

// Import Firebase services (if needed)
import { auth, db } from "../firebase"; // Updated to use firebase.js
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore"; // Example Firestore imports

// // Import components
// import ComponentName from "../components/ComponentName";

// // Import styles (if using CSS modules or styled-components)
// import styles from "./PageName.module.css";

// Define the page component
const GroupsPage = () => {
  // State for page-level data
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = null; //Change later to point to ROUTER

  // Fetch user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        //ADD AFTER ROUTER, REDIRECT IF USER IS NOT LOGGED IN
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        setLoading(true);

        //Fetch the user's profile data
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          throw new Error("User not found.");
        }
        const userData = { id: userDoc.id, ...userDoc.data() };
        if (userData.groups && userData.groups.length > 0) {
          const groupPromises = userData.groups.map(async (groupId) => {
            const groupDocRef = doc(db, "groups", groupId);
            const groupDoc = await getDoc(groupDocRef);
            return groupDoc.exists()
              ? { id: groupDoc.id, ...groupDoc.data() }
              : null;
          });
          const groupsData = await Promise.all(groupPromises);
          setUserData({
            ...userData,
            groups: groupsData.filter((group) => group !== null),
          });
        } else {
          setUserData({ ...userData, groups: [] });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchGroupData();
    }
  }, [user]); // Re-fetch data when user changes

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

export default GroupsPage;
