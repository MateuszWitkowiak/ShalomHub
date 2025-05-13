import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

import Message from "./models/Message.js";
import Room from './models/Room.js';
import User from './models/User.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
});

export { io };

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

mongoose.connect("mongodb+srv://boskiraptor2:oFocmXHWMq3zDsjo@cluster0.1nr7u.mongodb.net/")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

import authRoutes from "./api/auth.js";
import postRoutes from "./api/posts.js";
import profileRoutes from "./api/profile.js";
import eventRoutes from "./api/events.js";
import chatRoutes from "./api/chat.js";

app.use("/api", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/chat", chatRoutes);

io.on("connection", (socket) => {

    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
    });

    socket.on("joinNotificationsRoom", async (userId) => {
        if (!userId) {
            console.error("No userId provided for joinNotificationsRoom");
            return;
        }

        try {
            const user = await User.findById(userId);
            if (!user) {
                console.error("User not found for joinNotificationsRoom:", userId);
                return;
            }

            socket.join(userId);
        } catch (err) {
            console.error("Error in joinNotificationsRoom:", err);
        }
    });

    socket.on("sendMessage", async (messageData) => {
        const { roomId, text, senderId, receiverId } = messageData;

        if (!roomId || !text || !senderId || !receiverId) {
            console.error("Missing required data:", { roomId, text, senderId, receiverId });
            return socket.emit("error", "Missing required data to send the message.");
        }

        try {
            const newMessage = new Message({
                sender: senderId,
                receiver: receiverId,
                text,
            });

            await newMessage.save();
            await Room.findByIdAndUpdate(roomId, {
                $push: { messages: newMessage._id },
            });

            io.to(roomId).emit("newMessage", newMessage);

            io.to(receiverId).emit("notification", {
                message: `New message from ${newMessage.sender}`,
                createdAt: new Date(),
            });
        } catch (err) {
            console.error("Error sending message:", err);
            socket.emit("error", "Error sending the message.");
        }
    });
});

server.listen(3001, () => {
    console.log(`Server running on port 3001`);
});
