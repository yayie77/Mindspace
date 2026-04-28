require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const therapistRoutes = require("./routes/therapist");
const chatRoutes = require("./routes/chat");
const userRoutes = require("./routes/users");
const resourcesRoute = require("./routes/resourceRoutes");
const moodRoutes = require("./routes/mood");

const ChatSession = require("./models/chatSession");
const ChatMessage = require("./models/chatMessage");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/therapists", therapistRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/resources", resourcesRoute);
app.use("/api/mood", moodRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || "*", methods: ["GET", "POST"] },
  });

  // make io available to controllers if needed
  app.set("io", io);

  // socket auth
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Auth error"));
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch {
      next(new Error("Auth error"));
    }
  });

  io.on("connection", (socket) => {
    // auto‐join personal room for user.id
    socket.join(socket.user.id);

    // join a chat room
    socket.on("joinSession", async (sessionId) => {
      try {
        // const session = await ChatSession.findById(sessionId);
        // if (session?.participants.includes(socket.user.id)) {
        const session = await ChatSession.findById(sessionId);
        // normalize ObjectId[] to string[]
        const parts = session?.participants.map((p) => p.toString()) || [];
        if (parts.includes(socket.user.id)) {
          socket.join(sessionId);
        } else {
          socket.emit("error", "Not authorized for this session");
        }
      } catch {
        socket.emit("error", "Server error");
      }
    });

    // on every new message
    socket.on("sendMessage", async ({ sessionId, content }) => {
      try {
        const session = await ChatSession.findById(sessionId).lean();
        // again normalize for checking
        const parts = session?.participants.map((p) => p.toString()) || [];
        if (!session || !parts.includes(socket.user.id)) {
          return socket.emit("error", "Not authorized");
        }

        // 1) Persist the message
        const msg = await ChatMessage.create({
          session: sessionId,
          sender: socket.user.id,
          content,
        });
        await msg.populate("sender", "name");

        // 2) Broadcast to chat room
        io.to(sessionId).emit("newMessage", msg);

        // 3) **ONLY** if the sender is a **normal user**, notify the therapist

      } catch {
        socket.emit("error", "Server error");
      }
    });
  });

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
app.get("/", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});