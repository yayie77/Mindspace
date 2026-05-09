const User = require("../models/User");
const bcrypt = require("bcryptjs");

// get data of user
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("therapists", "name specialties degree institution");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

// update profile
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      name,
      email,
      password,
      emergencyContact,
      notificationPrefs,
      specialties,
      degree,
      institution,
    } = req.body;

    const update = { name, email };

    // allow password change
    if (password) {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(password, salt);
    }

    // role‐specific fields
    if (req.user.role === "user") {
      if (emergencyContact) update.emergencyContact = emergencyContact;
      if (notificationPrefs) update.notificationPrefs = notificationPrefs;
    }
    if (req.user.role === "therapist") {
      if (specialties) update.specialties = specialties;
      if (degree) update.degree = degree;
      if (institution) update.institution = institution;
    }

    const user = await User.findByIdAndUpdate(userId, update, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({ user });
  } catch (err) {
    // duplicate email?
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already in use" });
    }
    next(err);
  }
};

// select therapist
exports.selectTherapist = async (req, res, next) => {
  try {
    const { therapistId } = req.body;

    // 1) validate therapist
    const ther = await User.findOne({
      _id: therapistId,
      role: "therapist",
      status: "approved",
    });
    if (!ther) {
      return res.status(400).json({ message: "Invalid therapist" });
    }

    // 2) push into the array (no duplicates)
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { therapists: therapistId } },
      { new: true }
    ).select("-password");

    res.json({ message: "Therapist added", user: updated });
  } catch (err) {
    next(err);
  }
};
