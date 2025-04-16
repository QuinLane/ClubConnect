const validateEventData = (eventData, res) => {
  if ("title" in eventData) {
    if (typeof eventData.title !== "string") {
      return res.status(400).json({ error: "Event title must be a string" });
    }
    if (eventData.title.length > 50) {
      return res
        .status(400)
        .json({ error: "Event title must not exceed 50 characters" });
    }
  }

  if ("description" in eventData && eventData.description !== undefined) {
    if (typeof eventData.description !== "string") {
      return res.status(400).json({ error: "Description must be a string" });
    }
  }

  if ("date" in eventData) {
    if (!eventData.date || typeof eventData.date !== "object") {
      return res
        .status(400)
        .json({ error: "Event date must be a Timestamp object" });
    }
  }

  if ("location" in eventData) {
    if (typeof eventData.location !== "string") {
      return res.status(400).json({ error: "Event location must be a string" });
    }
  }

  if ("creatorId" in eventData) {
    if (
      typeof eventData.creatorId !== "string" ||
      !eventData.creatorId.match(/^[a-zA-Z0-9]+$/)
    ) {
      return res
        .status(400)
        .json({ error: "Creator ID must be a valid alphanumeric string" });
    }
  }

  if ("group" in eventData) {
    if (
      typeof eventData.group !== "string" ||
      !eventData.group.match(/^[a-zA-Z0-9]+$/)
    ) {
      return res
        .status(400)
        .json({ error: "Group ID must be a valid alphanumeric string" });
    }
  }

  return null; // No validation errors
};

export { validateEventData };
