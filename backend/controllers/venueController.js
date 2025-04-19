import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Note: available to all
export const getAllVenues = async (req, res) => {
  try {
    const venues = await prisma.venue.findMany({
      include: { reservations: true },
    });
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ error: `Failed to find venues: ${error.message}` });
  }
};

// Note: available to all
export const getVenueById = async (req, res) => {
  const { venueID } = req.params;
  try {
    const venue = await prisma.venue.findUnique({
      where: { venueID: parseInt(venueID) },
      include: { reservations: true },
    });
    if (!venue) {
      return res.status(404).json({ error: "Venue not found" });
    }
    res.status(200).json(venue);
  } catch (error) {
    res.status(500).json({ error: `Failed to find venue: ${error.message}` });
  }
};

// Note: Limit to only SU admins
export const createVenue = async (req, res) => {
  const { name, capacity, address, type } = req.body;
  try {
    const venue = await prisma.venue.create({
      data: { name, capacity, address, type },
    });
    res.status(201).json(venue);
  } catch (error) {
    res.status(500).json({ error: `Failed to create venue: ${error.message}` });
  }
};

// Note: Limit to only SU admins
export const updateVenue = async (req, res) => {
  const { venueID } = req.params;
  const data = req.body; // { name, capacity, address, type } - only fields sent are present
  try {
    const venue = await prisma.venue.update({
      where: { venueID: parseInt(venueID) },
      data,
    });
    res.status(200).json(venue);
  } catch (error) {
    res.status(500).json({ error: `Failed to update venue: ${error.message}` });
  }
};

// Note: Limit to only SU admins
export const deleteVenue = async (req, res) => {
  const { venueID } = req.params;
  try {
    await prisma.venue.delete({
      where: { venueID: parseInt(venueID) },
    });
    res.status(204).json(); // No content on successful deletion
  } catch (error) {
    res.status(500).json({ error: `Failed to delete venue: ${error.message}` });
  }
};

// Note: available to all
export const createReservation = async (req, res) => {
  const { venueID, eventID, date, startTime, endTime } = req.body;
  try {
    const reservation = await prisma.reservation.create({
      data: {
        venueID: parseInt(venueID),
        eventID: parseInt(eventID),
        startTime: parseInt(startTime),
        endTime: parseInt(endTime),
      },
    });
    res.status(201).json(reservation);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to create reservation: ${error.message}` });
  }
};

// Note: available to all
export const deleteReservation = async (req, res) => {
  const { reservationID } = req.params;
  try {
    await prisma.reservation.delete({
      where: { reservationID: parseInt(reservationID) },
    });
    res.status(204).json(); // No content on successful deletion
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to delete reservation: ${error.message}` });
  }
};
