import { PrismaClient } from "@prisma/client";
import * as venueController from "./venueController.js";
import fs from "fs/promises"; // For reading default image file
import imageSize from "image-size"; 

const prisma = new PrismaClient();

const validateImageBuffer = (buffer) => {
  try {
    // Use image-size to validate the buffer and get dimensions
    const dimensions = imageSize(buffer);
    console.log("Image dimensions:", dimensions);
    return true;
  } catch (error) {
    console.error("Invalid image buffer:", error);
    return false;
  }
};

// Helper to convert image buffer to base64 or load default image
const getImageAsBase64 = async (imageBuffer, mimetype = "image/webp") => {
  if (!imageBuffer) {
    const defaultImage = await fs.readFile("../public/images/default.webp");
    const base64String = defaultImage.toString("base64");
    console.log("Default image base64 length:", base64String.length);
    return `data:image/webp;base64,${base64String}`;
  }

  // Validate the image buffer
  if (!validateImageBuffer(imageBuffer)) {
    throw new Error("Invalid image buffer");
  }

  console.log("Image buffer type:", imageBuffer instanceof Buffer);
  const cleanBuffer = Buffer.from(imageBuffer);
  const base64String = cleanBuffer.toString("base64");
  console.log("Image base64 length:", base64String.length);
  console.log("Image base64 first 100 chars:", base64String.substring(0, 100));
  const invalidChars = base64String.match(/[^A-Za-z0-9+/=]/g);
  if (invalidChars) {
    console.log("Invalid characters in base64 string:", invalidChars);
    const cleanedBase64String = base64String.replace(/[^A-Za-z0-9+/=]/g, "");
    console.log("Cleaned base64 length:", cleanedBase64String.length);
    return `data:${mimetype};base64,${cleanedBase64String}`;
  }

  return `data:${mimetype};base64,${base64String}`;
};

// Helper to check if a user is an executive of the club associated with an event
export const checkClubAdminPermissionsForEvent = async (userID, eventID) => {
  const event = await prisma.event.findUnique({
    where: { eventID: parseInt(eventID) },
    include: {
      club: {
        include: {
          executives: true,
        },
      },
    },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  // Check if the user is an executive of the club
  const isExec = event.club.executives.some((exec) => exec.userID === userID);
  return isExec;
};

// Note: Available to all
export const getAllEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        club: true,
        rsvps: { include: { user: true } },
        reservation: true,
      },
    });
    // Convert images to base64
    const eventsWithImages = await Promise.all(
      events.map(async (event) => ({
        ...event,
        image: await getImageAsBase64(event.image),
      }))
    );
    res.status(200).json(eventsWithImages);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch events: ${error.message}` });
  }
};

export const getEventById = async (req, res) => {
  const { eventID } = req.params;
  try {
    const event = await prisma.event.findUnique({
      where: { eventID: parseInt(eventID) },
      include: {
        club: {
          include: {
            executives: { include: { user: true } },
            members: { include: { user: true } },
          },
        },
        rsvps: { include: { user: true } },
        reservation: {
          include: {
            venue: true, 
          },
        },
      },
    });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    const eventWithImage = {
      ...event,
      image: await getImageAsBase64(event.image),
    };
    res.status(200).json(eventWithImage);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch event: ${error.message}` });
  }
};

export const updateEvent = async (req, res) => {
  const { eventID } = req.params;
  const { name, description } = req.body;
  try {
    let image = undefined;
    if (req.files && req.files.image) {
      const file = req.files.image;
      if (!file.mimetype.startsWith("image/")) {
        return res.status(400).json({ error: "Only image files are allowed" });
      }
      image = file.data;
    }

    const event = await prisma.event.update({
      where: { eventID: parseInt(eventID) },
      data: { name, description, image },
      include: {
        club: true,
        rsvps: { include: { user: true } },
        reservation: true,
      },
    });
    const eventWithImage = {
      ...event,
      image: await getImageAsBase64(event.image),
    };
    res.status(200).json(eventWithImage);
  } catch (error) {
    res.status(500).json({ error: `Failed to update event: ${error.message}` });
  }
};

export async function deleteEventById(eventID) {
  const id = parseInt(eventID, 10);

  await prisma.rSVP.deleteMany({ where: { eventID: id } });
  await prisma.reservation.deleteMany({ where: { eventID: id } });
  await prisma.event.delete({ where: { eventID: id } });
}

export const deleteEvent = async (req, res) => {
  try {
    await deleteEventById(req.params.eventID);
    return res.status(204).end();
  } catch (err) {
    return res
      .status(500)
      .json({ error: `Failed to delete event: ${err.message}` });
  }
};

export const createEvent = async (req, res) => {
  const { name, description, clubID, date, startTime, endTime, venueID } =
    req.body;

  try {
    let image = null;
    let mimetype = "image/webp"; 
    if (req.files && req.files.image) {
      const file = req.files.image;
      if (!file.mimetype.startsWith("image/")) {
        return res.status(400).json({ error: "Only image files are allowed" });
      }
      image = file.data;
      mimetype = file.mimetype;
    }

    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    const event = await prisma.$transaction(async (prisma) => {
      const createdEvent = await prisma.event.create({
        data: {
          name,
          description,
          clubID: parseInt(clubID),
          image,
          reservation: {
            create: {
              start: startDateTime,
              endTime: endDateTime,
              venueID: parseInt(venueID),
            },
          },
        },
        include: {
          club: true,
          rsvps: { include: { user: true } },
          reservation: {
            include: {
              venue: true,
            },
          },
        },
      });

      return createdEvent;
    });

    const eventWithImage = {
      ...event,
      image: event.image ? await getImageAsBase64(event.image, mimetype) : null,
    };

    res.status(201).json(eventWithImage);
  } catch (error) {
    res.status(500).json({ error: `Failed to create event: ${error.message}` });
  }
};

// Note: Available to all
export const getUpcomingEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        reservation: {
          start: { gte: new Date() },
        },
      },
      include: {
        club: true,
        rsvps: { include: { user: true } },
        reservation: true,
      },
    });
    const eventsWithImages = await Promise.all(
      events.map(async (event) => ({
        ...event,
        image: await getImageAsBase64(event.image),
      }))
    );
    res.status(200).json(eventsWithImages);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch upcoming events: ${error.message}` });
  }
};

// Note: Available to all
export const getUpcomingClubEvents = async (req, res) => {
  const { clubID } = req.params;
  try {
    const events = await prisma.event.findMany({
      where: {
        clubID: parseInt(clubID),
        reservation: {
          start: { gte: new Date() },
        },
      },
      include: {
        club: true,
        rsvps: { include: { user: true } },
        reservation: true,
      },
    });
    const eventsWithImages = await Promise.all(
      events.map(async (event) => ({
        ...event,
        image: await getImageAsBase64(event.image),
      }))
    );
    res.status(200).json(eventsWithImages);
  } catch (error) {
    res.status(500).json({
      error: `Failed to fetch upcoming club events: ${error.message}`,
    });
  }
};

// Note: Available to all
export const getUpcomingUserEvents = async (req, res) => {
  const { userID } = req.params;
  try {
    const events = await prisma.event.findMany({
      where: {
        rsvps: {
          some: {
            userID: parseInt(userID),
          },
        },
        reservation: {
          start: { gte: new Date() },
        },
      },
      include: {
        club: true,
        rsvps: { include: { user: true } },
        reservation: true,
      },
    });
    const eventsWithImages = await Promise.all(
      events.map(async (event) => ({
        ...event,
        image: await getImageAsBase64(event.image),
      }))
    );
    res.status(200).json(eventsWithImages);
  } catch (error) {
    res.status(500).json({
      error: `Failed to fetch upcoming user events: ${error.message}`,
    });
  }
};

export const getRSVPCount = async (req, res) => {
  const { eventID } = req.params;
  try {
    const count = await prisma.rsvp.count({
      where: { eventID: parseInt(eventID) },
    });
    res.status(200).json({ count });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch RSVP count: ${error.message}` });
  }
};

export const getEventsByClub = async (req, res) => {
  const { clubID } = req.params;
  try {
    const events = await prisma.event.findMany({
      where: { clubID: parseInt(clubID) },
      include: {
        club: true,
        rsvps: { include: { user: true } },
        reservation: true,
      },
    });
    const eventsWithImages = await Promise.all(
      events.map(async (event) => ({
        ...event,
        image: await getImageAsBase64(event.image),
      }))
    );
    res.status(200).json(eventsWithImages);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch club events: ${error.message}` });
  }
};

// Note: Available to all
export const searchEvents = async (req, res) => {
  const { query } = req.query;
  try {
    const events = await prisma.event.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        club: true,
        rsvps: { include: { user: true } },
        reservation: true,
      },
    });
    const eventsWithImages = await Promise.all(
      events.map(async (event) => ({
        ...event,
        image: await getImageAsBase64(event.image),
      }))
    );
    res.status(200).json(eventsWithImages);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to search events: ${error.message}` });
  }
};

// Note: Available to all
export const getUserRecommendedEvents = async (req, res) => {
  const { userID } = req.params;
  try {
    const events = await prisma.event.findMany({
      where: {
        OR: [
          {
            club: {
              executives: {
                some: { userID: parseInt(userID) },
              },
            },
          },
          {
            rsvps: {
              some: { userID: parseInt(userID) },
            },
          },
        ],
        reservation: {
          start: { gte: new Date() },
        },
      },
      include: {
        club: true,
        rsvps: { include: { user: true } },
        reservation: true,
      },
    });
    const eventsWithImages = await Promise.all(
      events.map(async (event) => ({
        ...event,
        image: await getImageAsBase64(event.image),
      }))
    );
    res.status(200).json(eventsWithImages);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch recommended events: ${error.message}` });
  }
};

// Function to handle event photo updates
export const updateEventPhoto = async (req, res) => {
  const { eventID } = req.params;
  try {
    const parsedEventID = parseInt(eventID);
    if (isNaN(parsedEventID)) {
      return res.status(400).json({ error: "Invalid eventID" });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    const file = req.files.image;
    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({ error: "Only image files are allowed" });
    }

    const image = Buffer.isBuffer(file.data)
      ? file.data
      : Buffer.from(file.data, "binary");
    const mimetype = file.mimetype; 
    console.log("Uploaded image buffer length:", image.length);
    console.log("Uploaded image mimetype:", mimetype);
    console.log("Uploaded image buffer type:", image instanceof Buffer);

    if (!validateImageBuffer(image)) {
      return res
        .status(400)
        .json({ error: "Uploaded file is not a valid image" });
    }

    const event = await prisma.event.update({
      where: { eventID: parsedEventID },
      data: { image },
      include: {
        club: true,
        rsvps: { include: { user: true } },
        reservation: true,
      },
    });

    const eventWithImage = {
      ...event,
      image: await getImageAsBase64(event.image, mimetype),
    };
    res.status(200).json(eventWithImage);
  } catch (error) {
    console.error("Update event photo error:", error);
    res
      .status(500)
      .json({ error: `Failed to update event photo: ${error.message}` });
  }
};
