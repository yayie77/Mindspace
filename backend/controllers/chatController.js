// controllers/chatController.js
const ChatSession = require("../models/chatSession");
const ChatMessage = require("../models/chatMessage");
const User = require("../models/User");

exports.getOrCreateSession = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { therapistId } = req.body;

    // verify therapist...
    const ther = await User.findById(therapistId);
    if (!ther || ther.role !== "therapist" || ther.status !== "approved") {
      return res.status(400).json({ message: "Therapist not available" });
    }

    // find or create a session
    let session = await ChatSession.findOne({
      participants: { $all: [userId, therapistId] },
    });
    if (!session) {
      session = await ChatSession.create({
        participants: [userId, therapistId],
      });
    }

    // (optional) populate participants for future use
    await session.populate("participants", "name role");

    // 🔥 Removed the real-time notification here

    return res.json({ sessionId: session._id });
  } catch (err) {
    next(err);
  }
};

exports.getSessions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const sessions = await ChatSession.find({
      participants: userId,
    }).populate("participants", "name role");

    res.json({ sessions });
  } catch (err) {
    next(err);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;

    const session = await ChatSession.findById(sessionId);
    if (!session || !session.participants.includes(userId)) {
      return res.status(404).json({ message: "Session not found" });
    }

    const messages = await ChatMessage.find({ session: sessionId })
      .populate("sender", "name")
      .sort("createdAt");

    res.json({ messages });
  } catch (err) {
    next(err);
  }
};
