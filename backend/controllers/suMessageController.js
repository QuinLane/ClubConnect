import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// keep track of execs who have chatted
let threads = new Set();
const rows = await prisma.sUMessage.findMany({
  select: { userID: true },
  distinct: ['userID']
});
rows.forEach(r => threads.add(r.userID));


// Student → SUAdmin
export const sendMessageStudent = async (req, res) => {
  const { userID, content } = req.body;

  try {
    const uid = parseInt(userID, 10);
    // must be a student (club exec)
    const user = await prisma.user.findUnique({ where: { userID: uid } });
    if (!user || user.userType !== "Student") {
      return res.status(403).json({ error: "Only students can send messages to SU" });
    }
    // create message with direction EXEC_TO_SU
    const message = await prisma.sUMessage.create({
      data: { userID: uid, content, direction: "EXEC_TO_SU", }, });
      threads.add(uid);
      res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: `Failed to send SU message: ${error.message}` });
  }
};


// SUAdmin → Student
export const sendMessageSU = async (req, res) => {
  const { userID, content, suAdminID } = req.body;

  try {
    const suId = parseInt(suAdminID, 10);
    const uid = parseInt(userID, 10);
    // must be an SUAdmin
    const suAdmin = await prisma.user.findUnique({ where: { userID: suId } });
    if (!suAdmin || suAdmin.userType !== "SUAdmin") {
      return res.status(403).json({ error: "Only SU admins can reply" });
    }
    // create message with direction SU_TO_EXEC
    const message = await prisma.sUMessage.create({
      data: { userID: uid, content, direction: "SU_TO_EXEC", }, });
    threads.add(uid);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: `Failed to reply to SU message: ${error.message}` });
  }
};


// Fetch a single conversation (all messages for one exec)
export const getConversation = async (req, res) => {

  const execId = parseInt(req.params.userID, 10);

  // Only return messages if this exec has chatted before
  if (!threads.has(execId)) {
    return res.status(200).json([]);
  }

  try {
    // console.log("butt");
    const messages = await prisma.sUMessage.findMany({
      where: { userID: execId },
      orderBy: { sentAt: "asc" }
    });
    
    res.status(200).json(messages);
  } catch (error) {
    //console.log("yourmom");
    res.status(500).json({ error: `Failed to fetch SU thread: ${error.message}` });
  }
};


// List all threads for SUAdmins only, returning the latest message per exec in a key-value format
export const getSUThreads = async (req, res) => {
  try {
    // 1️⃣ Fetch every distinct exec userID that has at least one message
    const distinctRows = await prisma.sUMessage.findMany({ select: { userID: true }, distinct: ['userID'], });
    const execIDs = distinctRows.map(r => r.userID);

    // 2️⃣ For each execID, load their latest message
    const latestMap = {};
    await Promise.all(
      execIDs.map(async (uid) => {
        const latestMessage = await prisma.sUMessage.findFirst({
          where: { userID: uid },
          orderBy: { sentAt: 'desc' },
        });
        latestMap[uid] = latestMessage || null;
      })
    );

    // 3️⃣ Return as a key → value map
    return res.status(200).json({ threads: latestMap });
  } catch (error) {
    console.error("Failed to fetch SU threads:", error);
    return res
      .status(500)
      .json({ error: `Failed to fetch SU threads: ${error.message}` });
  }
};


export const getDistinctExecIDs = async (req, res) => {
  try {
    // Use Prisma to select distinct userID values
    const rows = await prisma.sUMessage.findMany({
      select: { userID: true },
      distinct: ['userID']
    });

    // Map to a simple array of IDs
    const execIDs = rows.map(r => r.userID);

    return res.status(200).json({ execIDs });
  } catch (error) {
    console.error("Failed to fetch distinct execIDs:", error);
    return res
      .status(500)
      .json({ error: `Failed to fetch exec IDs: ${error.message}` });
  }
};
