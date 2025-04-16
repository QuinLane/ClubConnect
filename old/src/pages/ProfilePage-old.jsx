/**
 * Page to display a user's profile
 *
 *  Components:
 *  -ProfileHeader
 *  -GroupList
 *  -InterestsList
 *  -ProfileBio
 *  -Header
 *
 * Logic need to implement:
 * -use getDoc to fetch the user's data from the users collection and store it in state
 * -get group info (name) and interest info and pass to InterestsList, GroupList
 *
 * -Auth check
 * -Fetch Profile data using getDoc
 *
 * Interaction with Components:
 * -pass user data to components
 *
 */

// Import React and hooks
import { useState, useEffect } from "react";

// Import Firebase services (if needed)
import { auth, db } from "../firebase"; // Updated to use firebase.js
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, updateDoc } from "firebase/firestore"; // Example Firestore imports

// // Import components
// import ComponentName from "../components/ComponentName";

// // Import styles (if using CSS modules or styled-components)
// import styles from "./PageName.module.css";

// Define the page component
const ProfilePage = () => {
  const { userId } = useParams(); //Get userID from URL
  const [currentUser, setCurrentUser] = useState(null); //set current logged-in user
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = null; //Change later to point to ROUTER
  const [profileData, setProfileData] = useState(null); //represents data for the profile being viewed
  const [friendCount, setFriendCount] = useState(null);

  // Fetch user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        //ADD AFTER ROUTER, REDIRECT IF USER IS NOT LOGGED IN
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch profile data for specified user
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const profileId = userId || currentUser?.uid; //use URL userId or current user's UID

        if (!profileId) {
          throw new Error("No user ID provided and no current user found.");
        }

        //Fetch the user's profile data
        const userDocRef = doc(db, "users", profileId);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          throw new Error("User not found.");
        }
        const userData = { id: userDoc.id, ...userDoc.data() };
        setProfileData(userData);
        setFriendCount(userData.friends.length); //get friend count to display

        if (userData.groups && userData.groups.length > 0) {
          const groupPromises = userData.groups.map(async (groupId) => {
            const groupDocRef = doc(db, "groups", groupId);
            const groupDoc = await getDoc(groupDocRef);
            return groupDoc.exists()
              ? { id: groupDoc.id, ...groupDoc.data() }
              : null;
          });
          const groupsData = await Promise.all(groupPromises);
          setProfileData({
            ...userData,
            groups: groupsData.filter((group) => group !== null),
          });
        } else {
          setProfileData({ ...userData, groups: [] });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchProfileData();
    }
  }, [currentUser, userId]); // Re-fetch data when user changes

  // Handle sending friend request
  const handleSendFriendRequest = async () => {
    try {
      setError(null);
      const friendRef = doc(db, "users", userId);
      const currentUserRef = doc(db, "users", currentUser.uid);
      await Promise.all([
        updateDoc(friendRef, {
          friendRequests: arrayUnion(currentUser.uid),
        }),
        updateDoc(currentUserRef, {
          friendRequestsSent: arrayUnion(userId), // Track outgoing requests
        }),
      ]);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle removing friend request
  const handleRemoveFriendRequest = async () => {
    try {
      setError(null);
      const friendRef = doc(db, "users", userId);
      const currentUserRef = doc(db, "users", currentUser.uid);
      await Promise.all([
        updateDoc(friendRef, {
          friendRequests: arrayRemove(currentUser.uid),
        }),
        updateDoc(currentUserRef, {
          friendRequestsSent: arrayRemove(userId), // Track outgoing requests
        }),
      ]);
    } catch (err) {
      setError(err.message);
    }
  };

  //Handle un-friending person
  const handleRemoveFriend = async () => {
    try {
      setError(null);
      const friendRef = doc(db, "users", userId);
      const currentUserRef = doc(db, "users", currentUser.uid);
      await Promise.all([
        updateDoc(friendRef, {
          friends: arrayRemove(currentUser.uid),
        }),
        updateDoc(currentUserRef, {
          friends: arrayRemove(userId), // Track outgoing requests
        }),
      ]);
      //update profileData to reflect the change
      setProfileData((prev) => ({
        ...prev,
        friends: prev.friends.filter((uid) => uid !== currentUser.uid),
      }));
      setFriendCount((prev) => prev - 1);
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
  if (!profileData) {
    return <div>No profile data available.</div>;
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

export default ProfilePage;
