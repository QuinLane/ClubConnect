import { getGroupData } from "./getGroupData.js";

const checkGroupAdminPermission = async (groupId, userId, res) => {
  const groupData = await getGroupData(groupId, res);

  if (groupData instanceof Object && !(groupData instanceof Error)) {
    const isGroupAdmin =
      groupData.admins &&
      Array.isArray(groupData.admins) &&
      groupData.admins.includes(userId);

    if (!isGroupAdmin) {
      return res
        .status(403)
        .json({ error: "You do not have permission to perform this action" });
    }

    return true; // User is a group admin
  }

  return groupData; // This will be the error response from getGroupData
};

export { checkGroupAdminPermission };
