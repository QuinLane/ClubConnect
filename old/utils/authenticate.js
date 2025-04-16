import { admin } from "./firebaseAdmin.js";

export const authenticate = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: No token provided");
  }

  const token = authHeader.split("Bearer ")[1];
  if (!token) {
    throw new Error("Unauthorized: Invalid token format");
  }

  console.log("Received token:", token); // Debug: Log the token

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Decoded token:", decodedToken); // Debug: Log the decoded token
    return decodedToken.uid;
  } catch (error) {
    throw new Error(`Unauthorized: ${error.message}`);
  }
};
