const validateChatDetails = (chatDetails, res) => {
  if (!chatDetails || typeof chatDetails !== "object") {
    return res
      .status(400)
      .json({ error: "Chat details are required and must be an object" });
  }

  if (
    !chatDetails.members ||
    !Array.isArray(chatDetails.members) ||
    chatDetails.members.length < 2
  ) {
    return res.status(400).json({ error: "Chat must have at least 2 members" });
  }

  if (!chatDetails.type || !["private", "group"].includes(chatDetails.type)) {
    return res
      .status(400)
      .json({ error: "Chat type must be 'private' or 'group'" });
  }

  if (chatDetails.type === "group" && !chatDetails.groupId) {
    return res.status(400).json({ error: "Group chats must have a groupId" });
  }

  if (chatDetails.type === "private" && chatDetails.members.length !== 2) {
    return res
      .status(400)
      .json({ error: "Private chats must have exactly 2 members" });
  }

  return null; // No validation errors
};

export { validateChatDetails };
