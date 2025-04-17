import { PrismaClient } from "@prisma/client";
import * as clubController from "./clubController.js";
import * as eventController from "./eventController.js"; // To be created

const prisma = new PrismaClient();

// Note: Only club admins can submit forms
export const submitForm = async (req, res) => {
  const { clubID } = req.params;
  const { formType, details } = req.body; // details is an object, will be stringified
  try {
    const form = await prisma.form.create({
      data: {
        clubID: parseInt(clubID),
        formType,
        status: "Pending",
        submittedAt: new Date(),
        details: JSON.stringify(details),
      },
    });
    res.status(201).json(form);
  } catch (error) {
    res.status(500).json({ error: `Failed to submit form: ${error.message}` });
  }
};

// Note: Available to all (SU admins will filter on frontend)
export const getAllForms = async (req, res) => {
  try {
    const forms = await prisma.form.findMany({
      include: { club: true },
    });
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch forms: ${error.message}` });
  }
};

// Note: Only SU admins can approve/reject forms
export const handleFormApproval = async (req, res) => {
  const { formID } = req.params;
  const { status } = req.body; // "Approved" or "Rejected"
  try {
    const form = await prisma.form.findUnique({
      where: { formID: parseInt(formID) },
    });
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    if (status === "Rejected") {
      await prisma.form.update({
        where: { formID: parseInt(formID) },
        data: { status },
      });
      return res.status(200).json({ message: "Form rejected" });
    }

    // If approved, parse details and call the appropriate create function
    const details = JSON.parse(form.details);
    let result;
    switch (form.formType) {
      case "ClubCreation":
        result = await clubController.createClub({ body: details }, res);
        break;
      case "EventApproval":
        // Assumes eventController.js has a createEvent function
        result = await eventController.createEvent({ body: details }, res);
        break;
      case "Funding":
        // Handle funding request (placeholder for future implementation)
        result = res.status(200).json({ message: "Funding request approved" });
        break;
      default:
        return res.status(400).json({ error: "Invalid form type" });
    }

    // Update form status to Approved
    await prisma.form.update({
      where: { formID: parseInt(formID) },
      data: { status: "Approved" },
    });

    return result; // The response is handled by the create function
  } catch (error) {
    res.status(500).json({ error: `Failed to handle form: ${error.message}` });
  }
};
