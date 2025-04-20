import { PrismaClient } from "@prisma/client";
import fs from "fs/promises"; // For reading default image file
const prisma = new PrismaClient();

// Helper to convert image buffer to base64 or load default image
const getImageAsBase64 = async (imageBuffer) => {
  if (!imageBuffer) {
    const defaultImage = await fs.readFile("../public/images/default.webp");
    return `data:image/webp;base64,${defaultImage.toString("base64")}`;
  }
  return `data:image/webp;base64,${imageBuffer.toString("base64")}`;
};

// Note: Available to all users
export const submitRSVP = async (req, res) => {
  const { eventID, userID } = req.params;
  try {
    const rsvp = await prisma.rSVP.create({
      data: {
        userID: parseInt(userID),
        eventID: parseInt(eventID),
      },
      include: { user: true },
    });
    res.status(201).json(rsvp);
  } catch (error) {
    res.status(500).json({ error: `Failed to submit RSVP: ${error.message}` });
  }
};

// Note: Available to all users
export const unsubmitRSVP = async (req, res) => {
  const { eventID, userID } = req.params;
  try {
    await prisma.rSVP.deleteMany({
      where: {
        userID: parseInt(userID),
        eventID: parseInt(eventID),
      },
    });
    res.status(204).json(); // No content on successful deletion
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to unsubmit RSVP: ${error.message}` });
  }
};

// Note: Available to all users
export const getRSVPsForEvent = async (req, res) => {
  const { eventID } = req.params;
  try {
    const rsvps = await prisma.rSVP.findMany({
      where: { eventID: parseInt(eventID) },
      include: { user: true },
    });
    res.status(200).json(rsvps);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch RSVPs: ${error.message}` });
  }
};

// Note: Available to authenticated users
export const getUserRSVPs = async (req, res) => {
  const { userID } = req.params;
  try {
    const rsvps = await prisma.rSVP.findMany({
      where: { userID: parseInt(userID) },
      include: {
        event: {
          include: {
            club: true,
            reservation: true,
          },
        },
        user: true,
      },
    });
    // Convert event images to base64
    const rsvpsWithImages = await Promise.all(
      rsvps.map(async (rsvp) => ({
        ...rsvp,
        event: {
          ...rsvp.event,
          image: await getImageAsBase64(rsvp.event.image),
        },
      }))
    );
    res.status(200).json(rsvpsWithImages);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch user RSVPs: ${error.message}` });
  }
};
