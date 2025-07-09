import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";
import { app,server } from "./lib/socket.js";


dotenv.config();

const PORT=process.env.PORT;
const __dirname = path.resolve();


app.use(express.json({ limit: '10mb' })); // for parsing JSON bodies
app.use(cookieParser()); // for parsing cookies 
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true, // allow credentials (cookies, authorization headers, etc.) to be sent
}))

//! i made a mistake in the order of the middleware here i put the auth middleware before the body parser middleware ...so first i need to parse the body and then check for the auth token in the body

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

// Serve static files from the frontend build directory
if(process.env.NODE_ENV === 'production') {
app.use(express.static(path.join(__dirname, "../frontend/dist")));
}

// Handle any requests that don't match the above routes 
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

server.listen(PORT,()=>{
    console.log("Server is running on port PORT :",PORT);
    connectDB();
})