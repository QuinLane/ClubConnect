import { checkGroupAdminPermission } from "./checkGroupAdminPermission.js";

const checkEventDeletePermission = async (eventData, userId, res) => {
  const isCreator = eventData.creatorId === userId;

  const isGroupAdmin = await checkGroupAdminPermission(
    eventData.group,
    userId,
    res
  );

  if (isGroupAdmin !== true) {
    return isGroupAdmin; // Returns the 403 or 404 response from checkGroupAdminPermission
  }

  if (!isCreator && !isGroupAdmin) {
    return res
      .status(403)
      .json({ error: "You do not have permission to delete this event" });
  }

  return true;
};

export { checkEventDeletePermission };
