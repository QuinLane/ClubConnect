const validateGroupData = (groupData, res) => {
  if ("name" in groupData) {
    if (typeof groupData.name !== "string") {
      return res.status(400).json({ error: "Group name must be a string" });
    }
    if (groupData.name.length > 100) {
      return res
        .status(400)
        .json({ error: "Group name must not exceed 100 characters" });
    }
  }

  if ("description" in groupData && groupData.description !== undefined) {
    if (typeof groupData.description !== "string") {
      return res
        .status(400)
        .json({ error: "Group description must be a string" });
    }
  }

  if ("ownerId" in groupData) {
    if (
      typeof groupData.ownerId !== "string" ||
      !groupData.ownerId.match(/^[a-zA-Z0-9]+$/)
    ) {
      return res
        .status(400)
        .json({ error: "Owner ID must be a valid alphanumeric string" });
    }
  }

  return null; // No validation errors
};

export { validateGroupData };
