const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const Message = require('./models/Message');
const Room = require('./models/Room');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
});

// export żeby używać w innych plikach
module.exports = { io };

// Obsługa CORS
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// łączenie z bazą
mongoose.connect("mongodb+srv://boskiraptor2:oFocmXHWMq3zDsjo@cluster0.1nr7u.mongodb.net/")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

// routy
const authRoutes = require("./api/auth");
const postRoutes = require("./api/posts");
const profileRoutes = require("./api/profile");
const eventRoutes = require("./api/events");
const chatRoutes = require("./api/chat");

app.use("/api", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/chat", chatRoutes);

// websocket - łączenie
io.on("connection", (socket) => {
    console.log("New WebSocket connection");

    socket.on("joinRoom", (roomId) => {
        console.log(`User joined room: ${roomId}`);
        socket.join(roomId);
    });

    socket.on("sendMessage", async (messageData) => {
        console.log("Received message data:", messageData);
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
            console.log("Message saved:", newMessage);

            await Room.findByIdAndUpdate(roomId, {
                $push: { messages: newMessage._id },
            });

            console.log("Emitting new message to room:", roomId);
            io.to(roomId).emit("newMessage", newMessage);
        } catch (err) {
            console.error("Error sending message:", err);
            socket.emit("error", "Error sending the message.");
        }
    });
});


server.listen(3001, () => {
    console.log(`Server running on port 3001`);
});
