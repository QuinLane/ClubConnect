// import { useState } from "react";
// import { auth, db } from "../../firebase";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { doc, setDoc, serverTimestamp } from "firebase/firestore";
// import CreateAccountBox from "../Shared/createAccountBox";

// const Signup = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [username, setUsername] = useState("");
//   const [courses, setCourses] = useState("");
//   const [error, setError] = useState(null);

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setError(null);

//     try {
//       // Create user in Firebase Authentication
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const user = userCredential.user;

//       // Add user to Firestore
//       await setDoc(doc(db, "users", user.uid), {
//         username,
//         bio: "",
//         courses: courses.split(",").map((course) => course.trim()),
//         interests: [],
//         role: "student",
//         profilePhoto: "",
//         createdAt: serverTimestamp(),
//       });

//       console.log("User signed up:", user.uid);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div>
//       <CreateAccountBox />
//     </div>
//     // <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
//     //   <h2>Sign Up</h2>
//     //   <form className="space-y-6" onSubmit={handleSignup}>
//     //     <div>
//     //       <label className="block text-sm font-medium leading-6 text-gray-900" >Email:</label>
//     //       <div className="mt-2">
//     //         <input
//     //           type="email"
//     //           value={email}
//     //           onChange={(e) => setEmail(e.target.value)}
//     //           className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//     //           required
//     //         />
//     //       </div>

//     //     </div>
//     //     <div>
//     //       <label>Password:</label>
//     //       <input
//     //         type="password"
//     //         value={password}
//     //         onChange={(e) => setPassword(e.target.value)}
//     //         required
//     //       />
//     //     </div>
//     //     <div>
//     //       <label>Username:</label>
//     //       <input
//     //         type="text"
//     //         value={username}
//     //         onChange={(e) => setUsername(e.target.value)}
//     //         required
//     //       />
//     //     </div>
//     //     <div>
//     //       <label>Courses (comma-separated):</label>
//     //       <input
//     //         type="text"
//     //         value={courses}
//     //         onChange={(e) => setCourses(e.target.value)}
//     //         placeholder="e.g., SENG 513, MATH 271"
//     //       />
//     //     </div>
//     //     <button type="submit">Sign Up</button>
//     //   </form>
//     //   {error && <p style={{ color: "red" }}>{error}</p>}
//     // </div>
//   );
// };

// export default Signup;

import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Link } from "react-router-dom";
import { auth, db } from "../../firebase";

const SignUpPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [major, setMajor] = useState("");
  const [year, setYear] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        username,
        bio: "",
        interests: [],
        role: "student",
        createdAt: serverTimestamp(),
      });

      console.log("User signed up:", user.uid);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-xl p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-700 text-center mb-6">Create an Account</h1>

        <form onSubmit={handleSignUp} className="space-y-4 text-sm md:text-base">
          {/* Row: First & Last Name */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-1">First Name</label>
              <input
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-1">Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Username</label>
            <input
              type="text"
              placeholder="johndoe123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Passwords */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-1">Repeat Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Toggle Password Visibility */}
          <div className="flex items-center text-sm">
            <input
              id="showPassword"
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="showPassword" className="ml-2 text-gray-700">
              Show password
            </label>
          </div>

          {/* Major & Year */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-1">Major</label>
              <input
                type="text"
                placeholder="Computer Science"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-1">Year</label>
              <input
                type="text"
                placeholder="Freshman, Sophomore, etc."
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm mt-1 text-center font-medium">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Sign Up
          </button>
        </form>

        {/* Login Redirect */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
