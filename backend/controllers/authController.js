const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {

    console.log("📩 REGISTER REQUEST BODY:", req.body);
    
    const {
      name,
      email,
      password,
      role = "user",
      specialties,
      degree,
      institution,
      notificationPrefs,
      emergencyContact,
      adminCode,
    } = req.body;

    // Validate role
    if (!["user", "therapist", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    // Admin check
    if (role === "admin" && adminCode !== process.env.ADMIN_REG_CODE) {
      return res.status(403).json({ message: "Invalid admin registration code" });
    }

    // Duplicate email check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ FIX: normalize specialties properly
    const formattedSpecialties =
      typeof specialties === "string"
        ? specialties.split(",").map(s => s.trim())
        : Array.isArray(specialties)
        ? specialties
        : [];

    // Build user object
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role,
      status: role === "therapist" ? "pending" : "approved",
    };

    // User-specific fields
    if (role === "user") {
      if (notificationPrefs) newUser.notificationPrefs = notificationPrefs;
      if (emergencyContact) newUser.emergencyContact = emergencyContact;
    }

    // Therapist-specific fields
    if (role === "therapist") {
      newUser.specialties = formattedSpecialties; // ✅ FIXED
      newUser.degree = degree;
      newUser.institution = institution;
    }

    // Save user
    const user = await new User(newUser).save();

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        specialties: user.specialties || [],
        degree: user.degree,
        institution: user.institution,
        notificationPrefs: user.notificationPrefs || {},
        emergencyContact: user.emergencyContact || {},
      },
    });

  } catch (err) {
  console.error("🔥 REGISTER ERROR:", err);

  return res.status(500).json({
    message: "Registration failed",
    error: err.message,
  });
}
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // 👇 ADD THESE LINES HERE
    console.log("LOGIN EMAIL:", email);
    console.log("USER FOUND:", user);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        specialties: user.specialties || [],
        degree: user.degree,
        institution: user.institution,
        notificationPrefs: user.notificationPrefs || {},
        emergencyContact: user.emergencyContact || {},
      },
    });

  } catch (err) {
    console.error("🔥 LOGIN ERROR:", err);

    return res.status(500).json({
      message: err.message || "Login failed",
    });
  }
};
