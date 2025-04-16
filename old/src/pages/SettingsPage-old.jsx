/**
 * Page for users to update their profile and account settings.
 *
 * Components:
 * - ProfilePhotoUploader
 * - AccountDetailsForm
 * - AppSettingsForm
 * - DeleteAccountButton
 * - Header
 *
 * Logic:
 * - Auth check and redirect if not logged in.
 * - Fetch user data using getUserData from userStructure.
 * - Use utility functions from userStructure to handle updates.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  getUserData,
  updateUser,
  updateProfilePhoto,
  deleteUserAccount,
} from "../structure/userStructure";

// Define components (placeholders with basic functionality)
const Header = () => (
  <div style={{ padding: "10px", backgroundColor: "#f0f0f0" }}>Header</div>
);

const ProfilePhotoUploader = ({ profilePhoto, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      setSelectedFile(null); // Reset the file input after upload
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Profile Photo</h3>
      {profilePhoto ? (
        <img
          src={profilePhoto}
          alt="Profile"
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        />
      ) : (
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            backgroundColor: "#ddd",
          }}
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ marginLeft: "10px", padding: "5px" }}
      />
      {selectedFile && (
        <button
          onClick={handleUpload}
          style={{
            marginLeft: "10px",
            padding: "5px 10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Upload Photo
        </button>
      )}
    </div>
  );
};

const AccountDetailsForm = ({ userData, onSubmit }) => {
  const [formData, setFormData] = useState({
    username: userData?.username || "",
    bio: userData?.bio || "",
    courses: userData?.courses?.join(", ") || "",
    year: userData?.year || "",
    interests: userData?.interests?.join(", ") || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      username: formData.username,
      bio: formData.bio,
      courses: formData.courses.split(",").map((course) => course.trim()),
      year: formData.year,
      interests: formData.interests
        .split(",")
        .map((interest) => interest.trim()),
    });
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Account Details</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            style={{ padding: "5px", margin: "5px" }}
          />
        </div>
        <div>
          <label>Bio: </label>
          <input
            type="text"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            style={{ padding: "5px", margin: "5px" }}
          />
        </div>
        <div>
          <label>Courses (comma-separated): </label>
          <input
            type="text"
            name="courses"
            value={formData.courses}
            onChange={handleChange}
            style={{ padding: "5px", margin: "5px" }}
          />
        </div>
        <div>
          <label>Year: </label>
          <input
            type="text"
            name="year"
            value={formData.year}
            onChange={handleChange}
            style={{ padding: "5px", margin: "5px" }}
          />
        </div>
        <div>
          <label>Interests (comma-separated): </label>
          <input
            type="text"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            style={{ padding: "5px", margin: "5px" }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "5px 10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Update Account
        </button>
      </form>
    </div>
  );
};

const AppSettingsForm = ({ settings, onSubmit }) => {
  const [formData, setFormData] = useState({
    notifications: settings?.notifications || { email: true, push: true },
    privacy: settings?.privacy || "everyone",
    theme: settings?.theme || "light",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("notifications")) {
      const notificationType = name.split(".")[1];
      setFormData({
        ...formData,
        notifications: {
          ...formData.notifications,
          [notificationType]: checked,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>App Settings</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Notifications:</label>
          <div>
            <label>
              Email:
              <input
                type="checkbox"
                name="notifications.email"
                checked={formData.notifications.email}
                onChange={handleChange}
                style={{ margin: "5px" }}
              />
            </label>
            <label>
              Push:
              <input
                type="checkbox"
                name="notifications.push"
                checked={formData.notifications.push}
                onChange={handleChange}
                style={{ margin: "5px" }}
              />
            </label>
          </div>
        </div>
        <div>
          <label>Privacy: </label>
          <select
            name="privacy"
            value={formData.privacy}
            onChange={handleChange}
            style={{ padding: "5px", margin: "5px" }}
          >
            <option value="everyone">Everyone</option>
            <option value="friends">Friends</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div>
          <label>Theme: </label>
          <select
            name="theme"
            value={formData.theme}
            onChange={handleChange}
            style={{ padding: "5px", margin: "5px" }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <button
          type="submit"
          style={{
            padding: "5px 10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Update Settings
        </button>
      </form>
    </div>
  );
};

const DeleteAccountButton = ({ onDelete }) => (
  <div>
    <button
      onClick={onDelete}
      style={{
        padding: "5px 10px",
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        borderRadius: "5px",
      }}
    >
      Delete Account
    </button>
  </div>
);

// Basic styles for the page
const styles = {
  pageContainer: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  },
};

// Define the page component
const SettingsPage = () => {
  const [user, setUser] = useState(null); // Current logged-in user
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        navigate("/login"); // Redirect to login if not authenticated
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        if (user) {
          const data = await getUserData(user.uid);
          setUserData(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  // Handle account details update
  const handleAccountUpdate = async (updatedDetails) => {
    try {
      setError(null);
      setLoading(true);
      const filteredUpdates = await updateUser(user, updatedDetails);
      setUserData((prev) => ({ ...prev, ...filteredUpdates }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle settings update
  const handleSettingsUpdate = async (updatedSettings) => {
    try {
      setError(null);
      setLoading(true);
      const filteredUpdates = await updateUser(user, {
        settings: updatedSettings,
      });
      setUserData((prev) => ({ ...prev, ...filteredUpdates }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle profile photo update
  const handleProfilePhotoUpdate = async (file) => {
    try {
      setError(null);
      setLoading(true);
      const profilePhotoUrl = await updateProfilePhoto(user, file);
      setUserData((prev) => ({ ...prev, profilePhoto: profilePhotoUrl }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      setError(null);
      setLoading(true);
      await deleteUserAccount(user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  if (!userData) {
    return <div>No user data available.</div>;
  }

  // Render the page
  return (
    <div style={styles.pageContainer}>
      <Header />
      <h1>Settings</h1>
      <ProfilePhotoUploader
        profilePhoto={userData.profilePhoto}
        onUpload={handleProfilePhotoUpdate}
      />
      <AccountDetailsForm userData={userData} onSubmit={handleAccountUpdate} />
      <AppSettingsForm
        settings={userData.settings}
        onSubmit={handleSettingsUpdate}
      />
      <DeleteAccountButton onDelete={handleDeleteAccount} />
    </div>
  );
};

export default SettingsPage;
