import { PrismaClient } from "@prisma/client";
import * as venueController from "./venueController.js";

const prisma = new PrismaClient();

// Note: Available to all
export const getAllEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        club: true,
        rsvps: { include: { user: true } }, // Always include RSVPs with user details
        reservation: true,
      },
    });
    res.status(200).json(events);
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
        rsvps: { include: { user: true } }, // Always include RSVPs with user details
        reservation: true,
      },
    });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch event: ${error.message}` });
  }
};

// Note: Only club execs can update events
export const updateEvent = async (req, res) => {
  const { eventID } = req.params;
  const { name, description } = req.body; // Only allow updating name and description
  try {
    const event = await prisma.event.update({
      where: { eventID: parseInt(eventID) },
      data: { name, description },
      include: {
        club: true,
        rsvps: { include: { user: true } }, // Always include RSVPs with user details
        reservation: true,
      },
    });
    res.status(200).json(event);
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
    res.status(204).json(); // No content on successful deletion
  } catch (error) {
    res.status(500).json({ error: `Failed to delete event: ${error.message}` });
  }
};

// Note: Only called internally by formController after approval
export const createEvent = async (req, res) => {
  const { name, description, clubID, date, startTime, endTime, venueID } =
    req.body;
  try {
    const event = await prisma.event.create({
      data: {
        name,
        description,
        clubID: parseInt(clubID),
      },
      include: {
        club: true,
        rsvps: { include: { user: true } }, // Include RSVPs in response
        reservation: true,
      },
    });

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

    res.status(201).json(event);
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
    res.status(200).json(events);
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
    res.status(200).json(events);
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
    res.status(200).json(events);
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
    res.status(200).json(events);
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
    res.status(200).json(events);
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
    res.status(200).json(events);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch recommended events: ${error.message}` });
  }
};
