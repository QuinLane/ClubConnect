// src/utils/api.js
import { getAuth } from "firebase/auth";

// // Base URL for your API (adjust based on your deployment)
// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// // Utility to make authenticated API requests
// const apiRequest = async (endpoint, method = "POST", body = null) => {
//   const auth = getAuth();
//   const user = auth.currentUser;

//   if (!user) {
//     throw new Error("User is not authenticated");
//   }

//   // Get the user's ID token
//   const token = await user.getIdToken();

//   const headers = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   };

//   const config = {
//     method,
//     headers,
//   };

//   if (body) {
//     config.body = JSON.stringify(body);
//   }

//   const response = await fetch(`${BASE_URL}${endpoint}`, config);

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.error || "Request failed");
//   }

//   return response.json();
// };

// export { apiRequest };

// Remove the BASE_URL constant
// const apiRequest = async (endpoint, method = "POST", body = null) => {
//   const auth = getAuth();
//   const user = auth.currentUser;

//   if (!user) {
//     throw new Error("User is not authenticated");
//   }

//   const token = await user.getIdToken();

//   const headers = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   };

//   const config = {
//     method,
//     headers,
//   };

//   if (body) {
//     config.body = JSON.stringify(body);
//   }

//   // Use a relative URL (e.g., "/api/users")
//   const response = await fetch(endpoint, config);

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.error || "Request failed");
//   }

//   return response.json();
// };

// export { apiRequest };
const apiRequest = async (endpoint, method = "POST", body = null) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated");
  }

  const token = await user.getIdToken();

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(endpoint, config);

  // Read the response body once as text
  const responseText = await response.text();

  if (!response.ok) {
    let errorData;
    try {
      // Parse the text as JSON
      errorData = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Request failed: ${response.status} - ${responseText}`);
    }
    throw new Error(errorData.error || "Request failed");
  }

  // Parse the text as JSON for successful responses
  return JSON.parse(responseText);
};

export { apiRequest };
