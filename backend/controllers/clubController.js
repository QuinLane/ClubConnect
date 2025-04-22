import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import fs from "fs/promises"; 
import { deleteEventById } from "./eventController.js";
const prisma = new PrismaClient();

const getImageAsBase64 = async (imageBuffer) => {
  if (!imageBuffer) {
    const defaultImage = await fs.readFile("../public/images/default.webp");
    return `data:image/webp;base64,${defaultImage.toString("base64")}`;
  }
  return `data:image/webp;base64,${imageBuffer.toString("base64")}`;
};

export const getAllClubs = async (req, res) => {
  try {
    const clubs = await prisma.club.findMany({
      include: {
        executives: { include: { user: true } },
        members: { include: { user: true } },
      },
    });
    const clubsWithImages = await Promise.all(
      clubs.map(async (club) => ({
        ...club,
        image: await getImageAsBase64(club.image),
      }))
    );
    res.status(200).json(clubsWithImages);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch clubs: ${error.message}` });
  }
};

export const getClubById = async (req, res) => {
  const { clubID } = req.params;
  try {
    const club = await prisma.club.findUnique({
      where: { clubID: parseInt(clubID) },
      include: {
        executives: { include: { user: true } },
        members: { include: { user: true } },
      },
    });
    if (!club) {
      return res.status(404).json({ error: "Club not found" });
    }
    const clubWithImage = {
      ...club,
      image: await getImageAsBase64(club.image),
    };
    res.status(200).json(clubWithImage);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch club: ${error.message}` });
  }
};

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
    let image = null;
    if (req.files && req.files.image) {
      const file = req.files.image;
      if (!file.mimetype.startsWith("image/")) {
        return res.status(400).json({ error: "Only image files are allowed" });
      }
      image = file.data;
    }

    const club = await prisma.club.create({
      data: {
        clubName,
        description,
        createdAt: new Date(),
        socialMediaLinks,
        website,
        clubEmail,
        image, 
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
    const clubWithImage = {
      ...club,
      image: await getImageAsBase64(club.image),
    };
    res.status(201).json(clubWithImage);
  } catch (error) {
    res.status(500).json({ error: `Failed to create club: ${error.message}` });
  }
};

export const updateClub = async (req, res) => {
  const { clubID } = req.params;
  const { clubName, description, socialMediaLinks, website, clubEmail } =
    req.body;

  try {
    let image = undefined; 
    if (req.files && req.files.image) {
      const file = req.files.image;
      if (!file.mimetype.startsWith("image/")) {
        return res.status(400).json({ error: "Only image files are allowed" });
      }
      image = file.data;
    }

    const club = await prisma.club.update({
      where: { clubID: parseInt(clubID) },
      data: {
        clubName,
        description,
        socialMediaLinks: socialMediaLinks
          ? JSON.parse(socialMediaLinks)
          : undefined,
        website,
        clubEmail,
        image, 
      },
    });
    const clubWithImage = {
      ...club,
      image: await getImageAsBase64(club.image),
    };
    res.status(200).json(clubWithImage);
  } catch (error) {
    res.status(500).json({ error: `Failed to update club: ${error.message}` });
  }
};

export const deleteClub = async (req, res) => {
  const clubID = parseInt(req.params.clubID, 10);

  try {
    const events = await prisma.event.findMany({
      where: { clubID },
      select: { eventID: true },
    });

    for (const { eventID } of events) {
      await deleteEventById(eventID); 
    }

    await prisma.notificationRecipient.deleteMany({
      where: {
        notification: {
          clubID: clubID,
        },
      },
    });

    await prisma.notification.deleteMany({
      where: { clubID },
    });

    await prisma.memberOf.deleteMany({ where: { clubID } });
    await prisma.executive.deleteMany({ where: { clubID } });

    await prisma.club.delete({ where: { clubID } });

    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({
      error: `Failed to delete club and related data: ${error.message}`,
    });
  }
};

export const updateClubRoles = async (req, res) => {
  const { clubID, userID } = req.params;
  const { role } = req.body; 
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
    res.status(204).json(); 
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to remove member: ${error.message}` });
  }
};

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
      },
    });
    const clubsWithImages = await Promise.all(
      clubs.map(async (club) => ({
        ...club,
        image: await getImageAsBase64(club.image),
      }))
    );
    res.status(200).json(clubsWithImages);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch user clubs: ${error.message}` });
  }
};

export const getUserExecClubs = async (req, res) => {
  const { userID } = req.params;
  try {
    const clubs = await prisma.club.findMany({
      where: {
        executives: {
          some: {
            userID: parseInt(userID),
            role: { not: null }, 
          },
        },
      },
      include: {
        executives: { include: { user: true } },
        events: true,
      },
    });
    const clubsWithImages = await Promise.all(
      clubs.map(async (club) => ({
        ...club,
        image: await getImageAsBase64(club.image),
      }))
    );
    res.status(200).json(clubsWithImages);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch user exec clubs: ${error.message}` });
  }
};

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
      },
    });
    const clubsWithImages = await Promise.all(
      clubs.map(async (club) => ({
        ...club,
        image: await getImageAsBase64(club.image),
      }))
    );
    res.status(200).json(clubsWithImages);
  } catch (error) {
    res.status(500).json({ error: `Failed to search clubs: ${error.message}` });
  }
};

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
          start: { gte: new Date() },
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

export const checkClubAdminPermissions = async (userID, clubID) => {
  const executive = await prisma.executive.findFirst({
    where: { userID, clubID },
  });
  return !!executive; 
};

export const getClubExecutives = async (clubID) => {
  const execs = await prisma.executive.findMany({
    where: { clubID },
    include: { user: true },
  });
  return execs;
};

export const joinClub = async (req, res) => {
  const { clubID } = req.params;
  const { userID } = req.user; 

  try {
    const existingMember = await prisma.memberOf.findUnique({
      where: {
        userID_clubID: {
          clubID: parseInt(clubID),
          userID: userID,
        },
      },
    });

    if (existingMember) {
      return res
        .status(400)
        .json({ error: "User is already a member of this club" });
    }

    const member = await prisma.memberOf.create({
      data: {
        userID: userID,
        clubID: parseInt(clubID),
      },
    });

    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: `Failed to join club: ${error.message}` });
  }
};

export const leaveClub = async (req, res) => {
  const { clubID } = req.params;
  const { userID } = req.user; 

  try {
    const existingMember = await prisma.memberOf.findUnique({
      where: {
        userID_clubID: {
          clubID: parseInt(clubID),
          userID: userID,
        },
      },
    });

    if (!existingMember) {
      return res
        .status(400)
        .json({ error: "User is not a member of this club" });
    }

    await prisma.executive.deleteMany({
      where: {
        clubID: parseInt(clubID),
        userID: userID,
      },
    });

    await prisma.memberOf.delete({
      where: {
        userID_clubID: {
          clubID: parseInt(clubID),
          userID: userID,
        },
      },
    });

    res.status(204).json(); 
  } catch (error) {
    res.status(500).json({ error: `Failed to leave club: ${error.message}` });
  }
};
export const updateBio = async (req, res) => {
  const { clubID } = req.params;
  const { description } = req.body;

  try {
    const updatedClub = await prisma.club.update({
      where: { clubID: parseInt(clubID) },
      data: { description },
    });

    res.status(200).json(updatedClub);
  } catch (error) {
    res.status(500).json({ error: `Failed to update bio: ${error.message}` });
  }
};

export const updateClubName = async (req, res) => {
  const { clubID } = req.params;
  const { clubName } = req.body;

  if (!clubName || clubName.trim().length === 0) {
    return res.status(400).json({ error: "Club name cannot be empty" });
  }

  try {
    const updatedClub = await prisma.club.update({
      where: { clubID: parseInt(clubID) },
      data: { clubName },
    });

    res.status(200).json(updatedClub);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to update club name: ${error.message}` });
  }
};

export const updateContact = async (req, res) => {
  const { clubID } = req.params;
  const { clubEmail, socialMediaLinks, website } = req.body;

  try {
    const club = await prisma.club.findUnique({
      where: { clubID: parseInt(clubID) },
    });
    if (!club) {
      return res
        .status(404)
        .json({ error: `Club with ID ${clubID} not found` });
    }

    const updatedClub = await prisma.club.update({
      where: { clubID: parseInt(clubID) },
      data: { clubEmail, socialMediaLinks, website },
    });

    res.status(200).json(updatedClub);
  } catch (error) {
    console.error(`Error updating contact for club ${clubID}:`, error); 
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Database constraint violation" });
    }
    res
      .status(500)
      .json({ error: `Failed to update contact: ${error.message}` });
  }
};
