import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

// Create express app and HTTP server
const app = express();
const server = http.createServer(app);

// ✅ Allow both local and deployed frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
  "https://chat-app-zeta-ruddy.vercel.app"
];

// Initialize socket.io server with proper CORS
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Store online users
export const userSocketMap = {}; // { userId: socketId }

// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (!userId) {
    console.log("❌ No userId provided. Disconnecting socket...");
    return socket.disconnect(true);
  }

  console.log("✅ User connected:", userId);
  userSocketMap[userId] = socket.id;

  // Emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("🔌 User disconnected:", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Routes
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect DB and start server
await connectDB();

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log("🚀 Server running on PORT: " + PORT));
}

// Export for Vercel
export default server;
