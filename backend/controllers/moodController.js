const MoodEntry = require("../models/moodEntry");

// GET /api/mood
exports.getMyEntries = async (req, res, next) => {
  try {
    const entries = await MoodEntry.find({ user: req.user.id }).sort("-date");
    res.json({ entries });
  } catch (err) {
    next(err);
  }
};

// GET /api/mood/:id
exports.getEntryById = async (req, res, next) => {
  try {
    const entry = await MoodEntry.findById(req.params.id);
    if (!entry || entry.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json({ entry });
  } catch (err) {
    next(err);
  }
};

// POST /api/mood
exports.createEntry = async (req, res, next) => {
  try {
    const { date, mood, rating, notes } = req.body;
    const entry = await MoodEntry.create({
      user: req.user.id,
      date,
      mood,
      rating,
      notes,
    });
    res.status(201).json({ entry });
  } catch (err) {
    next(err);
  }
};

// PUT /api/mood/:id
exports.updateEntry = async (req, res, next) => {
  try {
    const entry = await MoodEntry.findById(req.params.id);
    if (!entry || entry.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Entry not found" });
    }
    const updates = ["mood", "rating", "notes"];
    updates.forEach((field) => {
      if (field in req.body) entry[field] = req.body[field];
    });
    await entry.save();
    res.json({ entry });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/mood/:id
exports.deleteEntry = async (req, res, next) => {
  try {
    const entry = await MoodEntry.findById(req.params.id);
    if (!entry || entry.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Entry not found" });
    }
    await MoodEntry.findByIdAndDelete(req.params.id);
    res.json({ message: "Entry deleted" });
  } catch (err) {
    next(err);
  }
};
