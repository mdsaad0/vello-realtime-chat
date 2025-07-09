import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    },
});

//It is used to store online users
const userSocketMap = {};  //{userId: socketId}  userId is coming from the database and socketId is the id of the socket connection


export function getReceiverSocketId(userId) {
    // This function returns the socket ID of the user with the given userId
    return userSocketMap[userId];
}

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    const userId = socket.handshake.query.userId; // Assuming userId is sent as a query parameter when connecting to the server
    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log('User connected:', userId, 'with socket ID:', socket.id);
    }
    
    //io.emit is used to send a message to all connected clients
    //socket.emit is used to send a message to a specific client
    //socket.broadcast.emit is used to send a message to all connected clients except the sender
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Emit the list of online users to all clients

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        if (userId && userSocketMap[userId]) {
            delete userSocketMap[userId]; // Remove the user from the online users list
            console.log('User disconnected:', userId);
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Emit the updated list of online users to all clients
    });
});



export { io, app, server };



//The code const io = new Server(server, { cors: { origin: ["http://localhost:5173"] } })
// creates a Socket.IO server attached to your existing Express server so you can handle
// real-time communication in your MERN project. The cors part allows your React frontend (running on localhost:5173)
// to connect safely to your Socket.IO server (running on localhost:5001) without the browser
//  blocking it, since browsers normally prevent different ports from talking to each other
// for security. In simple terms, this code lets your React app and your Node server talk
// instantly without refreshing, enabling real-time features like live chat and notifications
//  while ensuring the connection is allowed during development