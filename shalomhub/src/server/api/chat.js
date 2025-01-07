const express = require("express");
const Message = require("../models/Message");
const Room = require("../models/Room");
const User = require("../models/User");
const Notification = require("../models/Notification")
const { io } = require("../server");

const router = express.Router();

// pobieranie wiadomości dla danych dwóch uzytkowników
router.get("/messages/:roomId", async (req, res) => {
  const { roomId } = req.params;
  console.log(`Fetching messages for room: ${roomId}`);

  try {
    const room = await Room.findById(roomId).populate("messages");

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room.messages.sort((a, b) => a.timestamp - b.timestamp));
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Error fetching messages." });
  }
});

// Tworzenie nowego pokoju jeżeli nie istnieje takowy
router.post("/rooms", async (req, res) => {
  const { user1, user2 } = req.body;
  console.log("Creating room for users:", user1, user2);

  try {
    const user1Obj = await User.findOne({ email: user1 });
    const user2Obj = await User.findOne({ email: user2 });

    if (!user1Obj || !user2Obj) {
      return res.status(404).json({ message: "Users not found" });
    }

    let room = await Room.findOne({
      users: { $all: [user1Obj._id, user2Obj._id] }
    });

    if (!room) {
      room = new Room({
        users: [user1Obj._id, user2Obj._id],
        messages: []
      });
      await room.save();
    }

    console.log("Room created:", room);
    res.json(room);
  } catch (err) {
    console.error("Error creating room:", err);
    res.status(500).json({ message: "Error creating room." });
  }
});

// Wysyłanie wiadomości + powiadomienie
router.post("/sendMessage", async (req, res) => {
  const { roomId, text, senderId, receiverId } = req.body;
  console.log("Received message data:", { roomId, text, senderId, receiverId });

  if (!roomId || !text || !senderId || !receiverId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const room = await Room.findById(roomId);
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!room || !sender || !receiver) {
      return res.status(404).json({ message: "Room or users not found" });
    }

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      text: text,
      timestamp: new Date(),
    });

    room.messages.push(message);
    await room.save();
    await message.save();

    io.to(roomId).emit("newMessage", message);

    const notification = new Notification({
      type: "message",
      recipient: receiverId, 
      sender: senderId,
      message: `You have got a new message!`,
      relatedObject: message._id,
      relatedObjectType: "message",
      isRead: false,
    });

    await notification.save();

    io.to(receiverId).emit("notification", {
      message: notification.message,
      type: "message",
      createdAt: notification.createdAt,
    });

    res.status(200).json(message);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ message: "Error sending message." });
  }
});

module.exports = router;
