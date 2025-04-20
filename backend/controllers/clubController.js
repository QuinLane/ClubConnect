import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import fs from "fs/promises"; // For reading default image file
import { deleteEventById } from "./eventController.js";
const prisma = new PrismaClient();

// Helper to convert image buffer to base64 or load default image
const getImageAsBase64 = async (imageBuffer) => {
  if (!imageBuffer) {
    const defaultImage = await fs.readFile("../public/images/default.webp");
    return `data:image/webp;base64,${defaultImage.toString("base64")}`;
  }
  return `data:image/webp;base64,${imageBuffer.toString("base64")}`;
};

// Note: Available to all
export const getAllClubs = async (req, res) => {
  try {
    const clubs = await prisma.club.findMany({
      include: {
        executives: { include: { user: true } },
        members: { include: { user: true } },
      },
    });
    // Convert images to base64
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

// Note: Available to all
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
    // Convert image to base64
    const clubWithImage = {
      ...club,
      image: await getImageAsBase64(club.image),
    };
    res.status(200).json(clubWithImage);
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
    // Check for uploaded image
    let image = null;
    if (req.files && req.files.image) {
      const file = req.files.image;
      // Validate file type
      if (!file.mimetype.startsWith("image/")) {
        return res.status(400).json({ error: "Only image files are allowed" });
      }
      // Use Buffer directly (express-fileupload provides data as Buffer)
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
        image, // Save image as binary data
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
    // Convert image to base64 for response
    const clubWithImage = {
      ...club,
      image: await getImageAsBase64(club.image),
    };
    res.status(201).json(clubWithImage);
  } catch (error) {
    res.status(500).json({ error: `Failed to create club: ${error.message}` });
  }
};

// Note: Only club admins should be able to do this
export const updateClub = async (req, res) => {
  const { clubID } = req.params;
  const {
    clubName,
    description,
    socialMediaLinks,
    website,
    clubEmail,
  } = req.body;

  try {
    // Check for uploaded image
    let image = undefined; // Use undefined to avoid overwriting if no image is provided
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
        image, // Only update image if provided
      },
    });
    // Convert image to base64 for response
    const clubWithImage = {
      ...club,
      image: await getImageAsBase64(club.image),
    };
    res.status(200).json(clubWithImage);
  } catch (error) {
    res.status(500).json({ error: `Failed to update club: ${error.message}` });
  }
};

// Note: Only SU admins should be able to do this
export const deleteClub = async (req, res) => {
  const clubID = parseInt(req.params.clubID, 10);

  try {
    // 1. First delete all events and their related data (RSVPs, reservations)
    const events = await prisma.event.findMany({
      where: { clubID },
      select: { eventID: true },
    });

    for (const { eventID } of events) {
      await deleteEventById(eventID); // Assuming this helper exists
    }

    // 2. Delete all notifications and their recipients for this club
    // First delete notification recipients (if not using cascade)
    await prisma.notificationRecipient.deleteMany({
      where: {
        notification: {
          clubID: clubID
        }
      }
    });
    
    // Then delete the notifications themselves
    await prisma.notification.deleteMany({ 
      where: { clubID } 
    });

    // 3. Delete all memberships and executive roles
    await prisma.memberOf.deleteMany({ where: { clubID } });
    await prisma.executive.deleteMany({ where: { clubID } });

    // 4. Finally delete the club itself
    await prisma.club.delete({ where: { clubID } });

    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({
      error: `Failed to delete club and related data: ${error.message}`,
    });
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
      },
    });
    // Convert images to base64
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
    // Convert images to base64
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
      },
    });
    // Convert images to base64
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

// Note: Available to authenticated users to join clubs
export const joinClub = async (req, res) => {
  const { clubID } = req.params;
  const { userID } = req.user; // Assuming user is authenticated

  try {
    // Check if user is already a member
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

    // Add user as member
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

// Note: Available to authenticated members to leave clubs
export const leaveClub = async (req, res) => {
  const { clubID } = req.params;
  const { userID } = req.user; // Assuming user is authenticated

  try {
    // Check if user is a member
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

    // Remove user as member and from executives if they were one
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

    res.status(204).json(); // No content on successful deletion
  } catch (error) {
    res.status(500).json({ error: `Failed to leave club: ${error.message}` });
  }
};
// Note: Only club admins can update bio
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