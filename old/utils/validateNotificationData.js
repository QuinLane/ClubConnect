const validateNotificationData = (notificationData, res) => {
  // Validate recipientId
  if (
    !notificationData.recipientId ||
    typeof notificationData.recipientId !== "string"
  ) {
    return res
      .status(400)
      .json({ error: "Recipient ID is required and must be a string" });
  }

  // Validate type
  const allowedTypes = [
    "friendRequest",
    "eventInvite",
    "groupJoinRequest",
    "chatMessage",
  ];
  if (!notificationData.type || !allowedTypes.includes(notificationData.type)) {
    return res.status(400).json({
      error: `Type is required and must be one of: ${allowedTypes.join(", ")}`,
    });
  }

  // Validate senderId
  if (
    "senderId" in notificationData &&
    notificationData.senderId !== undefined
  ) {
    if (typeof notificationData.senderId !== "string") {
      return res.status(400).json({ error: "Sender ID must be a string" });
    }
  }

  // Validate relatedEntity
  if (
    "relatedEntity" in notificationData &&
    notificationData.relatedEntity !== undefined
  ) {
    if (
      typeof notificationData.relatedEntity !== "object" ||
      notificationData.relatedEntity === null
    ) {
      return res
        .status(400)
        .json({ error: "Related entity must be an object" });
    }

    const allowedEntityTypes = ["event", "group", "chat"];
    if (
      !notificationData.relatedEntity.type ||
      !allowedEntityTypes.includes(notificationData.relatedEntity.type)
    ) {
      return res.status(400).json({
        error: `Related entity type must be one of: ${allowedEntityTypes.join(
          ", "
        )}`,
      });
    }

    if (
      !notificationData.relatedEntity.id ||
      typeof notificationData.relatedEntity.id !== "string"
    ) {
      return res.status(400).json({
        error: "Related entity ID is required and must be a string",
      });
    }
  }

  // Validate message
  if (
    !notificationData.message ||
    typeof notificationData.message !== "string"
  ) {
    return res
      .status(400)
      .json({ error: "Message is required and must be a string" });
  }

  // Validate isRead
  if (
    "isRead" in notificationData &&
    typeof notificationData.isRead !== "boolean"
  ) {
    return res.status(400).json({ error: "isRead must be a boolean" });
  }

  return null; // No validation errors
};

export { validateNotificationData };
