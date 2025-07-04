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

export const makeUserAdmin = async (req, res) => {
  const { userID } = req.params;

  try {
    const updatedUser = await prisma.user.update({
      where: { userID: parseInt(userID) },
      data: { userType: "SUAdmin" },
      select: {
        userID: true,
        username: true,
        email: true,
        userType: true
      }
    });

    res.status(200).json({
      message: "User successfully promoted to admin",
      user: updatedUser
    });
  } catch (error) {
    if (error.code === "P2025") { 
      return res.status(404).json({ error: "User not found" });
    }
    console.error("[MAKE ADMIN ERROR]", error);
    res.status(500).json({ error: "Failed to update user privileges" });
  }
};

export const makeUserStudent = async (req, res) => {
  const { userID } = req.params;

  try {
    const updatedUser = await prisma.user.update({
      where: { userID: parseInt(userID) },
      data: { userType: "Student" },
      select: {
        userID: true,
        username: true,
        email: true,
        userType: true
      }
    });

    await prisma.executive.deleteMany({
      where: { userID: parseInt(userID) }
    });

    res.status(200).json({
      message: "User role changed to Student successfully",
      user: updatedUser
    });
  } catch (error) {
    if (error.code === "P2025") { 
      return res.status(404).json({ error: "User not found" });
    }
    console.error("[MAKE STUDENT ERROR]", error);
    res.status(500).json({ error: "Failed to update user role" });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        userID: true,
        username: true,
        userType: true
      },
      orderBy: { username: 'asc' }
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('[GET ALL USERS ERROR]', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { userID: parseInt(id, 10) },
      select: { userID: true, username: true, email: true, userType: true }
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("[GET USER BY ID ERROR]", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

