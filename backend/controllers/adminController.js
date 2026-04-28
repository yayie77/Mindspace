const User = require("../models/User");
const ChatSession = require("../models/chatSession");
const ChatMessage = require("../models/chatMessage");
const MoodEntry = require("../models/moodEntry");
const Resource = require("../models/resources");




exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id);
    if (!u || u.role !== "user")
      return res.status(404).json({ message: "Not found" });
    await u.remove();
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    // count total users (role: user)
    const userCount = await User.countDocuments({ role: "user" });

    // count approved therapists + pending ones
    const therapistCount = await User.countDocuments({
      role: "therapist",
      status: "approved",
    });
    const pendingTherapistCount = await User.countDocuments({
      role: "therapist",
      status: "pending",
    });

    // chat sessions & total messages
    const chatSessions = await ChatSession.countDocuments();
    const chatMessages = await ChatMessage.countDocuments();

    // mood tracker entries
    const moodEntries = await MoodEntry.countDocuments();

    // resources by status
    const resourcesApproved = await Resource.countDocuments({
      status: "approved",
    });
    const resourcesPending = await Resource.countDocuments({
      status: "pending",
    });

    res.json({
      userCount,
      therapistCount,
      pendingTherapistCount,
      chatSessions,
      chatMessages,
      moodEntries,
      resourcesApproved,
      resourcesPending,
    });
  } catch (err) {
    next(err);
  }
};
