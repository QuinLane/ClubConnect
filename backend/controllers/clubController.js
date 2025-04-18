import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Note: Available to all
export const getAllClubs = async (req, res) => {
  try {
    const clubs = await prisma.club.findMany({
      include: {
        executives: { include: { user: true } },
        members: { include: { user: true } },
        presidentUser: true,
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
        executives: { include: { user: true } },
        members: { include: { user: true } },
        presidentUser: true,
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
  const {
    clubName,
    description,
    president,
    socialMediaLinks,
    website,
    clubEmail,
  } = req.body;
  try {
    const club = await prisma.club.create({
      data: {
        clubName,
        description,
        createdAt: new Date(),
        president: parseInt(president),
        socialMediaLinks: socialMediaLinks || [],
        website,
        clubEmail,
      },
    });
    await prisma.memberOf.create({
      data: {
        userID: parseInt(president),
        clubID: club.clubID,
      },
    });
    await prisma.executive.create({
      data: {
        userID: parseInt(president),
        clubID: club.clubID,
        role: "President",
      },
    });
    res.status(201).json(club);
  } catch (error) {
    res.status(500).json({ error: `Failed to create club: ${error.message}` });
  }
};

// Note: Only club admins should be able to do this
export const updateClub = async (req, res) => {
  const { clubID } = req.params;
  const data = req.body; // { clubName, description, president, socialMediaLinks, website, clubEmail }
  if (data.president) {
    const member = await prisma.memberOf.findUnique({
      where: {
        userID_clubID: {
          clubID: parseInt(clubID),
          userID: parseInt(data.president),
        },
      },
    });
    if (!member) throw new Error("President must be a club member");
  }
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
  const { clubID, userID } = req.params;
  const { role } = req.body; // Now assigns a role string
  try {
    const executive = await prisma.executive.update({
      where: {
        clubID_userID: { clubID: parseInt(clubID), userID: parseInt(userID) },
      },
      data: { role: role || null },
    });
    res.status(200).json(executive);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to update club role: ${error.message}` });
  }
};
// Note: Only club admins can add executives (via Executive table)
export const addExec = async (req, res) => {
  const { clubID } = req.params;
  const { userID, role } = req.body;
  try {
    const member = await prisma.memberOf.findUnique({
      where: {
        userID_clubID: {
          clubID: parseInt(clubID),
          userID: parseInt(userID),
        },
      },
    });
    if (!member) {
      await prisma.memberOf.create({
        data: {
          userID: parseInt(userID),
          clubID: parseInt(clubID),
        },
      });
    }
    const executive = await prisma.executive.create({
      data: {
        userID: parseInt(userID),
        clubID: parseInt(clubID),
        role: role || null,
      },
    });
    res.status(201).json(executive);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to add executive: ${error.message}` });
  }
};

// Note: Only club admins can add members (via MemberOf table)
export const addMember = async (req, res) => {
  const { clubID } = req.params;
  const { userID } = req.body;
  try {
    const member = await prisma.memberOf.create({
      data: {
        userID: parseInt(userID),
        clubID: parseInt(clubID),
      },
    });
    res.status(201).json(member);
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
    await prisma.memberOf.deleteMany({
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
        members: {
          some: {
            userID: parseInt(userID),
          },
        },
      },
      include: {
        executives: { include: { user: true } },
        members: { include: { user: true } },
        events: true,
        presidentUser: true,
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
            role: { not: null }, // Only clubs where user has a role
          },
        },
      },
      include: {
        executives: { include: { user: true } },
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
    const members = await prisma.memberOf.findMany({
      where: { clubID: parseInt(clubID) },
      include: {
        user: true,
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
          { website: { contains: query, mode: "insensitive" } },
          { clubEmail: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        executives: { include: { user: true } },
        members: { include: { user: true } },
        events: true,
        presidentUser: true,
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
    include: { user: true },
  });
  return execs;
};
