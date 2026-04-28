const User = require("../models/User");
const ChatSession = require("../models/chatSession");
const MoodEntry = require("../models/moodEntry");

exports.getApprovedTherapists = async (req, res, next) => {
  try {
    const therapists = await User.find({
      role: "therapist",
      status: "approved",
    })
      .select("-password") // never return passwords
      .sort({ name: 1 }); // alphabetical by name

    res.json({ therapists });
  } catch (err) {
    next(err);
  }
};

exports.getPatients = async (req, res, next) => {
  try {
    const therapistId = req.user.id;

    // 1) find all users who have this therapist in their array
    const users = await User.find({
      role: "user",
      therapists: therapistId,
    }).select("-password");

    // 2) for each user, ensure there’s a chat session—and return its _id
    const patients = await Promise.all(
      users.map(async (u) => {
        let session = await ChatSession.findOne({
          participants: { $all: [therapistId, u._id] },
        });
        if (!session) {
          // auto-create so therapist always has a session to jump into
          session = await ChatSession.create({
            participants: [therapistId, u._id],
          });
        }
        const obj = u.toObject();
        obj.sessionId = session._id;
        return obj;
      })
    );

    res.json({ patients });
  } catch (err) {
    next(err);
  }
};

exports.getUserMood = async (req, res, next) => {
  try {
    const therapistId = req.user.id;
    const { userId } = req.params;

    const target = await User.findById(userId);
    if (
      !target ||
      target.role !== "user" ||
      // ← check membership in the new array
      !Array.isArray(target.therapists) ||
      !target.therapists.map((t) => t.toString()).includes(therapistId)
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this user’s mood" });
    }

    const entries = await MoodEntry.find({ user: userId }).sort("date");
    res.json({ entries });
  } catch (err) {
    next(err);
  }
};
