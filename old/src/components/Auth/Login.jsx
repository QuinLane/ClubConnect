// import { useState } from "react";
// import { auth } from "../../firebase";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import LoginFormBox from "../Shared/LoginFormBox";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError(null);

//     try {
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       console.log("User logged in:", userCredential.user.uid);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
//     {/* Container restricted by max-w; smaller on mobile, bigger on large screens */}
//     <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
//       {/* Pass down your login function to the child so it can call signIn */}
//       <LoginFormBox onLogin={handleLogin} />

//       {/* Display possible error messages here, or inside the form component */}
//       {error && (
//         <p className="text-red-600 font-semibold text-center mt-4">{error}</p>
//       )}
//     </div>
//   </div>
//     // <div>
//     //   <h2>Login</h2>
//     //   <form onSubmit={handleLogin}>
//     //     <div>
//     //       <label>Email:</label>
//     //       <input
//     //         type="email"
//     //         value={email}
//     //         onChange={(e) => setEmail(e.target.value)}
//     //         required
//     //       />
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
//     //     <button type="submit">Login</button>
//     //   </form>
//     //   {error && <p style={{ color: "red" }}>{error}</p>}
//     // </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../../firebase";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/app/profile"); // or wherever you route users after login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-700 text-center mb-6">Login to Your Account</h1>

        <form onSubmit={handleLogin} className="space-y-4 text-sm md:text-base">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}
          <div>
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

          {/* Show Password */}
          <div className="flex items-center text-sm">
            <input
              id="showPassword"
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="showPassword" className="ml-2 text-gray-700">
              Show password
            </label>
          </div>

          {/* Error */}
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
            Login
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-600 font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
