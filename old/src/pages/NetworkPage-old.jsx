/**
 *  page to display all of one users network with options to message each
 *
 *  Components:
 *  -Header
 *  -FriendsTable
 *
 *  Logic Needed:
 *  -Auth Check
 *  -Fetch Friends
 *  -Fetch Actions
 *
 *  Interaction With Components:
 *  -Pass friends list to FriendsTable
 *  -Pass an onAction callbak to friendsTable to handle actions like removing/Adding a friend
 *
 */

// Import React and hooks
import { useState, useEffect } from "react";

// Import Firebase services (if needed)
import { auth, db } from "../firebase"; // Updated to use firebase.js
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore"; // Example Firestore imports

// Import components
import FriendsTable from "../components/Network/FriendsTable";

// // Import styles (if using CSS modules or styled-components)
// import styles from "./NetworkPage.module.css";

// Define the page component
const NetworkPage = () => {
  const navigate = null; //Change later to point to ROUTER

  // State for page-level data
  const [user, setUser] = useState(null);
  //   const [data, setData] = useState([]); // Example: data fetched from Firestore
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]); //Stores the list of current users friends

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

  // Fetch friends of current user
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);

        // Step 1: Fetch the current user's Firestore document to get their friends array
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          throw new Error("User not found.");
        }
        const userData = userDoc.data();
        const friendUIDs = userData.friends || [];

        // Step 2: Fetch each friend's details individually
        const friendsPromises = friendUIDs.map(async (friendId) => {
          const friendDocRef = doc(db, "users", friendId);
          const friendDoc = await getDoc(friendDocRef);
          return friendDoc.exists()
            ? { id: friendDoc.id, ...friendDoc.data() }
            : null;
        });
        const friendsList = await Promise.all(friendsPromises);
        setFriends(friendsList.filter((friend) => friend !== null));
      } catch (err) {
        setError(err.message);
        console.error("Error fetching friends:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFriends();
    }
  }, [user]);

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
      <ComponentName
        userId={user?.uid}
        data={friends}
        onAction={handleAction}
      />
    </div>
  );
};

export default NetworkPage;
