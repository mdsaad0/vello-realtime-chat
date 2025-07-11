// lib/socket.js
import { Server } from "socket.io";

let io;
const userSocketMap = {}; // { userId: socketId }

export function initSocket(server) {
  io = new Server(server, {
    cors: { origin: ["http://localhost:5173"] },
  });

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export function getIO() {
  return io;
}
