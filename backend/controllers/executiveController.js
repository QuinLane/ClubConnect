import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Note: Available to all
export const getAllExecutives = async (req, res) => {
  try {
    const executives = await prisma.executive.findMany({
      include: {
        user: true,
        club: true,
        clubRole: true,
      },
    });
    res.status(200).json(executives);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch executives: ${error.message}` });
  }
};

// Note: Available to all
export const getExecutiveById = async (req, res) => {
  const { executiveID } = req.params;
  try {
    const executive = await prisma.executive.findUnique({
      where: { executiveID: parseInt(executiveID) },
      include: {
        user: true,
        club: true,
        clubRole: true,
      },
    });
    if (!executive) {
      return res.status(404).json({ error: "Executive not found" });
    }
    res.status(200).json(executive);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch executive: ${error.message}` });
  }
};

// Note: Only SU admins
export const createExecutive = async (req, res) => {
  const { userID, clubID, clubRoleID } = req.body;
  try {
    const executive = await prisma.executive.create({
      data: {
        userID: parseInt(userID),
        clubID: parseInt(clubID),
        clubRoleID: clubRoleID ? parseInt(clubRoleID) : null,
      },
      include: {
        user: true,
        club: true,
        clubRole: true,
      },
    });
    res.status(201).json(executive);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to create executive: ${error.message}` });
  }
};

// Note: Only SU admins
export const updateExecutive = async (req, res) => {
  const { executiveID } = req.params;
  const { userID, clubID, clubRoleID } = req.body;
  try {
    const executive = await prisma.executive.update({
      where: { executiveID: parseInt(executiveID) },
      data: {
        userID: userID ? parseInt(userID) : undefined,
        clubID: clubID ? parseInt(clubID) : undefined,
        clubRoleID: clubRoleID ? parseInt(clubRoleID) : null,
      },
      include: {
        user: true,
        club: true,
        clubRole: true,
      },
    });
    res.status(200).json(executive);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to update executive: ${error.message}` });
  }
};

// Note: Only SU admins
export const deleteExecutive = async (req, res) => {
  const { executiveID } = req.params;
  try {
    await prisma.executive.delete({
      where: { executiveID: parseInt(executiveID) },
    });
    res.status(204).json();
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to delete executive: ${error.message}` });
  }
};

// Note: Available to all
export const getExecutivesByClub = async (req, res) => {
  const { clubID } = req.params;
  try {
    const executives = await prisma.executive.findMany({
      where: { clubID: parseInt(clubID) },
      include: {
        user: true,
        club: true,
        clubRole: true,
      },
    });
    res.status(200).json(executives);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch club executives: ${error.message}` });
  }
};

// Note: Available to all
export const getExecutivesByUser = async (req, res) => {
  const { userID } = req.params;
  try {
    const executives = await prisma.executive.findMany({
      where: { userID: parseInt(userID) },
      include: {
        user: true,
        club: true,
        clubRole: true,
      },
    });
    res.status(200).json(executives);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch user executives: ${error.message}` });
  }
};

// Note: Only SU admins
export const assignRoleToExecutive = async (req, res) => {
  const { executiveID } = req.params;
  const { clubRoleID } = req.body;
  try {
    const executive = await prisma.executive.update({
      where: { executiveID: parseInt(executiveID) },
      data: {
        clubRoleID: clubRoleID ? parseInt(clubRoleID) : null,
      },
      include: {
        user: true,
        club: true,
        clubRole: true,
      },
    });
    res.status(200).json(executive);
  } catch (error) {
    res.status(500).json({ error: `Failed to assign role: ${error.message}` });
  }
};
