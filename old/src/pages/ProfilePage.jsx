import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../apiClient/usersUtil";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const loadProfile = async () => {
  //     const userId = auth.currentUser?.uid;
  //     if (!userId) return;

  //     const docRef = doc(db, "users", userId);
  //     const snapshot = await getDoc(docRef);

  //     if (snapshot.exists()) {
  //       setProfile(snapshot.data());
  //     }
  //   };

  //   loadProfile();
  // }, []);

  useEffect(() => {
    const loadProfile = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.error("No user ID found, user might not be authenticated");
        return;
      }

      try {
        const userData = await getUserData(userId); // Call API via usersUtil.js
        if (userData) {
          setProfile(userData);
        } else {
          console.error("No user data found for ID:", userId);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    loadProfile();
  }, []);

  if (!profile) {
    return (
      <div className="p-8 text-center text-indigo-700 font-medium">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4">
      <div className="max-w-5xl mx-auto relative space-y-6">
        {/* Edit Button */}
        <button
          onClick={() => navigate("/app/editProfile")}
          className="absolute top-2 right-2 w-10 h-10 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center shadow-md"
          title="Edit Profile"
        >
          ✏️
        </button>

        {/* Profile Card */}
        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-32 h-32 rounded-full bg-gray-300 flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-bold text-indigo-700">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-gray-600 mt-1 font-medium">
              {profile.school} — {profile.major}
            </p>
            <div className="flex items-center space-x-4 mt-3">
              <p className="text-gray-800 font-medium">50 Connections</p>
              <button className="bg-indigo-600 text-white px-4 py-1 rounded-md text-sm hover:bg-indigo-700 transition">
                Connect
              </button>
            </div>
          </div>
        </div>

        {/* About Section */}
        {profile.bio && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold text-indigo-800 mb-2">
              About
            </h3>
            <p className="text-gray-700">{profile.bio}</p>
          </div>
        )}

        {/* Groups Joined */}
        {profile.groups && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold text-indigo-800 mb-2">
              Groups Joined
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {Array.isArray(profile.groups)
                ? profile.groups.map((g, i) => <li key={i}>{g}</li>)
                : typeof profile.groups === "string"
                ? profile.groups
                    .split(",")
                    .map((g, i) => <li key={i}>{g.trim()}</li>)
                : null}
            </ul>
          </div>
        )}

        {/* Interests & Classes */}
        {(profile.interests || profile.courses?.length > 0) && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold text-indigo-800 mb-2">
              Interests & Courses
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {Array.isArray(profile.interests)
                ? profile.interests.map((i, idx) => <li key={idx}>{i}</li>)
                : typeof profile.interests === "string"
                ? profile.interests
                    .split(",")
                    .map((i, idx) => <li key={idx}>{i.trim()}</li>)
                : null}

              {profile.courses?.map((course, idx) => (
                <li key={`course-${idx}`}>{course}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
