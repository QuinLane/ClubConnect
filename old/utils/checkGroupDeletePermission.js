import { getGroupData } from "./getGroupData.js";
import { checkGroupAdminPermission } from "./checkGroupAdminPermission.js";

const checkGroupDeletePermission = async (groupId, userId, res) => {
  const groupData = await getGroupData(groupId, res);

  if (groupData instanceof Object && !(groupData instanceof Error)) {
    const isOwner = groupData.ownerId === userId;
    const isGroupAdmin = await checkGroupAdminPermission(groupId, userId, res);

    if (isGroupAdmin !== true) {
      return isGroupAdmin; // Returns the 403 or 404 response
    }

    if (!isOwner && !isGroupAdmin) {
      return res
        .status(403)
        .json({ error: "You do not have permission to delete this group" });
    }

    return true;
  }

  return groupData; // This will be the error response from getGroupData
};

export { checkGroupDeletePermission };
