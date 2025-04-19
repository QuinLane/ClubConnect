import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Note: Available to all
export const getAllExecutives = async (req, res) => {
  try {
    const executives = await prisma.executive.findMany({
      include: {
        user: true,
        club: true,
      },
    });
    res.status(200).json(executives);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch executives: ${error.message}` });
  }
};

// Note: Available to all
export const getExecutiveById = async (req, res) => {
  const { clubID, userID } = req.params;
  try {
    const executive = await prisma.executive.findUnique({
      where: {
        clubID_userID: { clubID: parseInt(clubID), userID: parseInt(userID) },
      },
      include: {
        user: true,
        club: true,
      },
    });
    if (!executive) {
      return res.status(404).json({ error: "Executive not found" });
    }
    res.status(200).json(executive);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch executive: ${error.message}` });
  }
};

// Note: Only SU admins
export const createExecutive = async (req, res) => {
  const { email, clubID, role } = req.body;
  const requestingUserID = req.user.userID; // Get the current user
  
  try {
    // Verify requesting user has permission for this club
    const isAdmin = await prisma.executive.findFirst({
      where: {
        userID: requestingUserID,
        clubID: parseInt(clubID),
        role: { in: ['President', 'Vice President', 'Admin'] }
      }
    });

    if (!isAdmin && !req.user.isSUAdmin) {
      return res.status(403).json({ error: "Unauthorized: You don't have permission for this club" });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if already an executive
    const existingExec = await prisma.executive.findUnique({
      where: {
        clubID_userID: {
          clubID: parseInt(clubID),
          userID: user.userID
        }
      }
    });

    if (existingExec) {
      return res.status(400).json({ error: "User is already an executive" });
    }

    // Create executive
    const executive = await prisma.executive.create({
      data: {
        userID: user.userID,
        clubID: parseInt(clubID),
        role: role || 'Executive',
      },
      include: { user: true }
    });

    res.status(201).json(executive);
    
  } catch (error) {
    res.status(500).json({ error: `Failed to create executive: ${error.message}` });
  }
};

// Note: Only SU admins
export const updateExecutive = async (req, res) => {
  const { clubID, userID } = req.params;
  const { newUserID, newClubID, role } = req.body;
  try {
    const executive = await prisma.executive.update({
      where: {
        clubID_userID: { clubID: parseInt(clubID), userID: parseInt(userID) },
      },
      data: {
        userID: newUserID ? parseInt(newUserID) : undefined,
        clubID: newClubID ? parseInt(newClubID) : undefined,
        role: role || null,
      },
      include: {
        user: true,
        club: true,
      },
    });
    res.status(200).json(executive);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to update executive: ${error.message}` });
  }
};

// Note: Only SU admins
export const deleteExecutive = async (req, res) => {
  const { clubID, userID } = req.params;
  const requestingUserID = req.user.userID;

  try {
    // Verify requesting user has permission for this club
    const isAdmin = await prisma.executive.findFirst({
      where: {
        userID: requestingUserID,
        clubID: parseInt(clubID),
        role: { in: ['President', 'Vice President', 'Admin'] }
      }
    });

    if (!isAdmin && !req.user.isSUAdmin) {
      return res.status(403).json({ error: "Unauthorized: You don't have permission for this club" });
    }

    // Prevent removing yourself if you're the last president
    if (parseInt(userID) === requestingUserID) {
      const presidents = await prisma.executive.count({
        where: {
          clubID: parseInt(clubID),
          role: 'President'
        }
      });
      
      if (presidents <= 1) {
        return res.status(400).json({ error: "Cannot remove the last president" });
      }
    }

    await prisma.executive.delete({
      where: {
        clubID_userID: { clubID: parseInt(clubID), userID: parseInt(userID) },
      },
    });
    
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: `Failed to delete executive: ${error.message}` });
  }
};

// Note: Available to all
export const getExecutivesByClub = async (req, res) => {
  const { clubID } = req.params;
  try {
    const executives = await prisma.executive.findMany({
      where: { clubID: parseInt(clubID) },
      include: {
        user: true
      },
      orderBy: {
        role: 'asc' // Optional: Sort by role if you want
      }
    });
    
    res.status(200).json(executives);
  } catch (error) {
    res.status(500).json({ 
      error: `Failed to fetch club executives: ${error.message}` 
    });
  }
};
// Note: Available to all
export const getExecutivesByUser = async (req, res) => {
  const { userID } = req.params;
  try {
    const executives = await prisma.executive.findMany({
      where: { userID: parseInt(userID) },
      include: {
        user: true,
        club: true,
      },
    });
    res.status(200).json(executives);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch user executives: ${error.message}` });
  }
};

// Note: Only SU admins
export const assignRoleToExecutive = async (req, res) => {
  const { clubID, userID } = req.params;
  const { role } = req.body;
  try {
    const executive = await prisma.executive.update({
      where: {
        clubID_userID: { clubID: parseInt(clubID), userID: parseInt(userID) },
      },
      data: {
        role: role || null,
      },
      include: {
        user: true,
        club: true,
      },
    });
    res.status(200).json(executive);
  } catch (error) {
    res.status(500).json({ error: `Failed to assign role: ${error.message}` });
  }
};
