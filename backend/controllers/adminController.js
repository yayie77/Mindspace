const User = require("../models/User");
const ChatSession = require("../models/chatSession");
const ChatMessage = require("../models/chatMessage");
const MoodEntry = require("../models/moodEntry");
const Resource = require("../models/resources");

exports.getTherapists = async (req, res, next) => {
  try {
    // Only return users with role === 'therapist'
    const filter = { role: "therapist" };

    // If a status query param is provided, filter by it
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Fetch therapists, excluding the password field
    const therapists = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 }); // newest first

    res.json({ therapists });
  } catch (err) {
    next(err);
  }
};

exports.approveTherapist = async (req, res, next) => {
  try {
    const therapist = await User.findById(req.params.id);
    if (!therapist || therapist.role !== "therapist") {
      return res.status(404).json({ message: "Therapist not found" });
    }
    therapist.status = "approved";
    await therapist.save();
    res.json({ message: "Therapist approved", user: therapist });
  } catch (err) {
    next(err);
  }
};

exports.deleteTherapist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const th = await User.findById(id);
    if (!th || th.role !== "therapist") {
      return res.status(404).json({ message: "Therapist not found" });
    }

    await User.findByIdAndDelete(id);
    res.json({ message: "Therapist deleted" });
  } catch (err) {
    next(err);
  }
};

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
