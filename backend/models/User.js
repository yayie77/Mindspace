const mongoose = require("mongoose");

const EmergencyContactSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
  },
  { _id: false }
);

const NotificationPrefsSchema = new mongoose.Schema(
  {
    moodReminder: { type: Boolean, default: false },
    chatTranscript: { type: Boolean, default: false },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "therapist", "admin"],
      default: "user",
    },
    //  Fields for normal users
    therapists: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    notificationPrefs: NotificationPrefsSchema,
    emergencyContact: EmergencyContactSchema,

    //  Fields for therapists
    specialties: [String],
    degree: String,
    institution: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
