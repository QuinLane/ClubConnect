import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Note: Available to all
export const getAllClubs = async (req, res) => {
  try {
    const clubs = await prisma.club.findMany({
      include: {
        executives: { include: { user: true, clubRole: true } },
        roles: true, // Include club-specific roles
      },
    });
    res.status(200).json(clubs);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch clubs: ${error.message}` });
  }
};

// Note: Available to all
export const getClubById = async (req, res) => {
  const { clubID } = req.params;
  try {
    const club = await prisma.club.findUnique({
      where: { clubID: parseInt(clubID) },
      include: {
        executives: { include: { user: true, clubRole: true } },
        roles: true,
      },
    });
    if (!club) {
      return res.status(404).json({ error: "Club not found" });
    }
    res.status(200).json(club);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch club: ${error.message}` });
  }
};

// Note: Only SU admins should be able to do this
export const createClub = async (req, res) => {
  const { clubName, description } = req.body;
  try {
    const club = await prisma.club.create({
      data: {
        clubName,
        description,
        createdAt: new Date(),
      },
    });
    // Optionally create default roles
    await prisma.clubRole.createMany({
      data: [
        { clubID: club.clubID, roleName: "President" },
        { clubID: club.clubID, roleName: "Vice President" },
      ],
    });
    res.status(201).json(club);
  } catch (error) {
    res.status(500).json({ error: `Failed to create club: ${error.message}` });
  }
};

// Note: Only club admins should be able to do this
export const updateClub = async (req, res) => {
  const { clubID } = req.params;
  const data = req.body; // { clubName, description }
  try {
    const club = await prisma.club.update({
      where: { clubID: parseInt(clubID) },
      data,
    });
    res.status(200).json(club);
  } catch (error) {
    res.status(500).json({ error: `Failed to update club: ${error.message}` });
  }
};

// Note: Only SU admins should be able to do this
export const deleteClub = async (req, res) => {
  const { clubID } = req.params;
  try {
    await prisma.club.delete({
      where: { clubID: parseInt(clubID) },
    });
    res.status(204).json(); // No content on successful deletion
  } catch (error) {
    res.status(500).json({ error: `Failed to delete club: ${error.message}` });
  }
};

// Note: Only club admins can update roles
export const updateClubRoles = async (req, res) => {
  const { clubID, executiveID } = req.params;
  const { clubRoleID } = req.body; // Now assigns a ClubRole instead of updating position
  try {
    const executive = await prisma.executive.update({
      where: { executiveID: parseInt(executiveID) },
      data: { clubRoleID: clubRoleID ? parseInt(clubRoleID) : null },
      include: { clubRole: true },
    });
    res.status(200).json(executive);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to update club role: ${error.message}` });
  }
};

// Note: Only club admins can add roles
export const addClubRole = async (req, res) => {
  const { clubID } = req.params;
  const { roleName } = req.body; // Creates a new ClubRole
  try {
    const clubRole = await prisma.clubRole.create({
      data: {
        clubID: parseInt(clubID),
        roleName,
      },
    });
    res.status(201).json(clubRole);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to add club role: ${error.message}` });
  }
};

// Note: Only club admins can add members (via Executive table)
export const addMember = async (req, res) => {
  const { clubID } = req.params;
  const { userID } = req.body;
  try {
    const executive = await prisma.executive.create({
      data: {
        userID: parseInt(userID),
        clubID: parseInt(clubID),
        clubRoleID: null, // General member, no specific role
      },
    });
    res.status(201).json(executive);
  } catch (error) {
    res.status(500).json({ error: `Failed to add member: ${error.message}` });
  }
};

// Note: Only club admins can remove members
export const removeMember = async (req, res) => {
  const { clubID, userID } = req.params;
  try {
    await prisma.executive.deleteMany({
      where: {
        clubID: parseInt(clubID),
        userID: parseInt(userID),
      },
    });
    res.status(204).json(); // No content on successful deletion
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to remove member: ${error.message}` });
  }
};

// Note: Available to authenticated users
export const getUserClubs = async (req, res) => {
  const { userID } = req.params;
  try {
    const clubs = await prisma.club.findMany({
      where: {
        executives: {
          some: {
            userID: parseInt(userID),
          },
        },
      },
      include: {
        executives: { include: { user: true, clubRole: true } },
        roles: true,
        events: true,
      },
    });
    res.status(200).json(clubs);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch user clubs: ${error.message}` });
  }
};

// Note: Available to authenticated users
export const getUserExecClubs = async (req, res) => {
  const { userID } = req.params;
  try {
    const clubs = await prisma.club.findMany({
      where: {
        executives: {
          some: {
            userID: parseInt(userID),
            clubRoleID: { not: null }, // Only clubs where user has a role
          },
        },
      },
      include: {
        executives: { include: { user: true, clubRole: true } },
        roles: true,
        events: true,
      },
    });
    res.status(200).json(clubs);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch user exec clubs: ${error.message}` });
  }
};

// Note: Only club admins
export const getClubMembers = async (req, res) => {
  const { clubID } = req.params;
  try {
    const members = await prisma.executive.findMany({
      where: { clubID: parseInt(clubID) },
      include: {
        user: true,
        clubRole: true,
      },
    });
    res.status(200).json(members);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch club members: ${error.message}` });
  }
};

// Note: Available to all
export const searchClubs = async (req, res) => {
  const { query } = req.query;
  try {
    const clubs = await prisma.club.findMany({
      where: {
        OR: [
          { clubName: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        executives: { include: { user: true, clubRole: true } },
        roles: true,
        events: true,
      },
    });
    res.status(200).json(clubs);
  } catch (error) {
    res.status(500).json({ error: `Failed to search clubs: ${error.message}` });
  }
};

// Note: Available to all
export const getClubStats = async (req, res) => {
  const { clubID } = req.params;
  try {
    const memberCount = await prisma.executive.count({
      where: { clubID: parseInt(clubID) },
    });
    const eventCount = await prisma.event.count({
      where: { clubID: parseInt(clubID) },
    });
    const upcomingEventCount = await prisma.event.count({
      where: {
        clubID: parseInt(clubID),
        reservation: {
          date: { gte: new Date() },
        },
      },
    });
    res.status(200).json({
      memberCount,
      eventCount,
      upcomingEventCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch club stats: ${error.message}` });
  }
};

// Checks if user is an executive of the club
export const checkClubAdminPermissions = async (userID, clubID) => {
  const executive = await prisma.executive.findFirst({
    where: { userID, clubID },
  });
  return !!executive; // Returns true if user is an executive, false otherwise
};

// Returns the list of club executives for a given club
export const getClubExecutives = async (clubID) => {
  const execs = await prisma.executive.findMany({
    where: { clubID },
    include: { user: true, clubRole: true }, // Include role details
  });
  return execs;
};
