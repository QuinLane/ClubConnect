import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

export const updateVenue = async (req, res) => {
  const { venueID } = req.params;
  const data = req.body; 
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

export const deleteVenue = async (req, res) => {
  const { venueID } = req.params;
  try {
    await prisma.venue.delete({
      where: { venueID: parseInt(venueID) },
    });
    res.status(204).json(); 
  } catch (error) {
    res.status(500).json({ error: `Failed to delete venue: ${error.message}` });
  }
};

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

export const deleteReservation = async (req, res) => {
  const { reservationID } = req.params;
  try {
    await prisma.reservation.delete({
      where: { reservationID: parseInt(reservationID) },
    });
    res.status(204).json(); 
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to delete reservation: ${error.message}` });
  }
};

export const getUpcomingReservationsByVenue = async (req, res) => {
  const { venueID } = req.params;
  try {
    const now = new Date();
    const reservations = await prisma.reservation.findMany({
      where: {
        venueID: parseInt(venueID, 10),
        start: { gte: now },
      },
      orderBy: { start: 'asc' },
    });
    res.status(200).json(reservations);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch upcoming reservations: ${error.message}` });
  }
};