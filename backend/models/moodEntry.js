const mongoose = require("mongoose");

const MoodEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: (d) => d <= new Date(),
        message: "Date cannot be in the future",
      },
    },
    mood: {
      type: String,
      enum: ["very sad", "sad", "neutral", "happy", "very happy"],
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("MoodEntry", MoodEntrySchema);
