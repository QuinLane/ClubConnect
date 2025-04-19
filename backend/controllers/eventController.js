import { PrismaClient } from "@prisma/client";
import * as venueController from "./venueController.js";
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

// Note: Available to all
export const getEventById = async (req, res) => {
  const { eventID } = req.params;
  try {
    const event = await prisma.event.findUnique({
      where: { eventID: parseInt(eventID) },
      include: {
        club: true,
        rsvps: { include: { user: true } },
        reservation: true,
      },
    });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    // Convert image to base64
    const eventWithImage = {
      ...event,
      image: await getImageAsBase64(event.image),
    };
    res.status(200).json(eventWithImage);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch event: ${error.message}` });
  }
};

// Note: Only club execs can update events
export const updateEvent = async (req, res) => {
  const { eventID } = req.params;
  const { name, description } = req.body;
  try {
    // Check for uploaded image
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
    // Convert image to base64
    const eventWithImage = {
      ...event,
      image: await getImageAsBase64(event.image),
    };
    res.status(200).json(eventWithImage);
  } catch (error) {
    res.status(500).json({ error: `Failed to update event: ${error.message}` });
  }
};

// Note: Only club execs can delete events
export const deleteEvent = async (req, res) => {
  const { eventID } = req.params;
  try {
    await prisma.event.delete({
      where: { eventID: parseInt(eventID) },
    });
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: `Failed to delete event: ${error.message}` });
  }
};

// Note: Only called internally by formController after approval
export const createEvent = async (req, res) => {
  const { name, description, clubID, date, startTime, endTime, venueID } =
    req.body;
  try {
    // Check for uploaded image
    let image = null;
    if (req.files && req.files.image) {
      const file = req.files.image;
      if (!file.mimetype.startsWith("image/")) {
        return res.status(400).json({ error: "Only image files are allowed" });
      }
      image = file.data;
    }

    const event = await prisma.event.create({
      data: {
        name,
        description,
        clubID: parseInt(clubID),
        image,
      },
      include: {
        club: true,
        rsvps: { include: { user: true } },
        reservation: true,
      },
    });

    //if the start/end time isnt working and your sending strings here, then uncomment this
    // // Convert startTime and endTime from "HH:mm" to integer (e.g., "14:00" → 1400)
    // const startTimeInt = parseInt(startTime.replace(":", ""));
    // const endTimeInt = parseInt(endTime.replace(":", ""));

    await venueController.createReservation(
      {
        body: {
          venueID: parseInt(venueID),
          eventID: event.eventID,
          date,
          startTime,
          endTime,
        },
      },
      res
    );

    // Convert image to base64
    const eventWithImage = {
      ...event,
      image: await getImageAsBase64(event.image),
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
          date: { gte: new Date() },
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
          date: { gte: new Date() },
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
          date: { gte: new Date() },
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

// Note: Available to all
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

// Note: Available to all
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
          date: { gte: new Date() },
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
