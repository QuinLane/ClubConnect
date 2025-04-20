import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign(
      { userID: user.userID, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      token,
      user: {
        userID: user.userID,
        username: user.username,
        userType: user.userType,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to log in" });
  }
};

export const createUser = async (req, res) => {
  const { userID, username, email, password, userType, createdAt } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        userID,
        username,
        email,
        passwordHash,
        userType,
        createdAt: new Date(createdAt),
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error("[CREATE USER ERROR]", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// Get a user's name by their userID
export const getNameFromId = async (req, res) => {
  const { id } = req.params;
  try {
    const userID = parseInt(id, 10);
    const user = await prisma.user.findUnique({
      where: { userID },
      select: { username: true }
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ name: user.username });
  } catch (error) {
    console.error("[GET NAME ERROR]", error);
    res.status(500).json({ error: "Failed to get user name" });
  }
};


export const getAllUsers = async (req, res) => {};
export const getUserById = async (req, res) => {};
export const updateUser = async (req, res) => {};
export const deleteUser = async (req, res) => {};
export const BanUser = async (req, res) => {};
