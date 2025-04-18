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
  const { name, description, clubID, date, venueID } = req.body;
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
      { body: { venueID: parseInt(venueID), eventID: event.eventID, date } },
      res
    );

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: `Failed to create event: ${error.message}` });
  }
};
