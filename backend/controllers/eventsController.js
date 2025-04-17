import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import * as venueController from "./venueController.js";
const prisma = new PrismaClient();

export const getAllEvents = async (req, res) => {};
export const getEventById = async (req, res) => {};
export const updateEvent = async (req, res) => {};
export const deleteEvent = async (req, res) => {};
export const approveEvent = async (req, res) => {};
export const rejectEvent = async (req, res) => {};

// Note: Only called internally by formController after approval
export const createEvent = async (req, res) => {
  const { name, description, clubID, date, venueID } = req.body;
  try {
    // Create the event
    const event = await prisma.event.create({
      data: {
        name,
        description,
        clubID: parseInt(clubID),
      },
    });

    // Create the associated reservation
    await venueController.createReservation(
      { body: { venueID: parseInt(venueID), eventID: event.eventID, date } },
      res
    );

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: `Failed to create event: ${error.message}` });
  }
};
