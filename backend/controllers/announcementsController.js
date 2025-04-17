//Ex
export const createAnnouncement = async (req, res) => {
  const { title, content, clubID } = req.body;
  const { userID, userType } = req.user; // From authenticate middleware
  if (userType !== "SUAdmin" && !clubID) {
    return res.status(403).json({ error: "Admins or club members only" });
  }
  try {
    const announcement = await prisma.announcement.create({
      data: { userID, clubID, title, content },
    });
    res.status(201).json(announcement);
  } catch (error) {
    throw new Error("Failed to create announcement");
  }
};
