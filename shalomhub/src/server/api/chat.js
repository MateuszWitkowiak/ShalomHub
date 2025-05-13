import express from "express";
import Message from "../models/Message.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { io } from "../server.js";

const router = express.Router();

// pobieranie wiadomości dla pokoju
router.get("/messages/:roomId", async (req, res) => {
  const { roomId } = req.params;

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

// tworzenie nowego pokoju
router.post("/rooms", async (req, res) => {
  const { user1, user2 } = req.body;

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

    res.json(room);
  } catch (err) {
    console.error("Error creating room:", err);
    res.status(500).json({ message: "Error creating room." });
  }
});

// wysyłanie wiadomości
router.post("/sendMessage", async (req, res) => {
  const { roomId, text, senderId, receiverId } = req.body;
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

export default router;
