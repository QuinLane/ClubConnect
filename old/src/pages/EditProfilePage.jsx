import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const EditProfilePage = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    field: "",
    major: "",
    year: "",
    school: "",
    courses: [],
    bio: "",
    interests: "",
    groups: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;
    if (type === "select-multiple") {
      const selected = Array.from(selectedOptions).map((o) => o.value);
      setForm((prev) => ({ ...prev, [name]: selected }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");

      await setDoc(doc(db, "users", userId), { ...form });
      alert("Profile saved!");
      navigate("/app/profile");
    } catch (err) {
      console.error("Error saving profile:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4 flex justify-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-6 md:p-8 space-y-10">
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-700 text-center">
          Edit Profile
        </h1>

        {/* Profile Photo UI */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Photo</h2>
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
            <div className="w-32 h-32 rounded-full bg-gray-300 flex-shrink-0" />
            <div className="mt-4 md:mt-0">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                Upload Picture
              </button>
              <div className="mt-2">
                <button className="text-red-500 hover:underline">Remove</button>
              </div>
            </div>
          </div>
        </div>

        {/* Account Info Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["firstName", "lastName", "field", "major", "year", "school"].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="text-gray-700 mb-1 capitalize font-medium">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="text"
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Profile Info Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Details</h2>
          <div className="space-y-4">
            {/* Courses */}
            <div className="flex flex-col">
              <label className="text-gray-700 mb-1 font-medium">Courses</label>
              <select
                name="courses"
                multiple
                value={form.courses}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Course 1">Course 1</option>
                <option value="Course 2">Course 2</option>
                <option value="Course 3">Course 3</option>
                <option value="Course 4">Course 4</option>
              </select>
              <small className="text-gray-500 mt-1">
                Hold Ctrl (Windows) or Command (Mac) to select multiple.
              </small>
            </div>

            {/* Bio */}
            <div className="flex flex-col">
              <label className="text-gray-700 mb-1 font-medium">Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={4}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Interests */}
            <div className="flex flex-col">
              <label className="text-gray-700 mb-1 font-medium">Interests</label>
              <input
                name="interests"
                value={form.interests}
                onChange={handleChange}
                type="text"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Groups */}
            <div className="flex flex-col">
              <label className="text-gray-700 mb-1 font-medium">Groups Joined</label>
              <input
                name="groups"
                value={form.groups}
                onChange={handleChange}
                type="text"
                placeholder="e.g. AI Club, Coding Society"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="text-right">
          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
