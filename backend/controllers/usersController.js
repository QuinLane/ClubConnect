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
  const { username, email, password, userType } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10); // Hash password
    const user = await prisma.user.create({
      data: { username, email, passwordHash, userType },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};
