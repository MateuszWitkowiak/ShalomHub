const express = require("express");
const Event = require("../models/Event");
const User = require("../models/User");
const mongoose = require("mongoose");
const router = express.Router();

// Tworzenie nowego wydarzenia
router.post("/", async (req, res) => {
  try {
    const { title, description, date, location, createdBy } = req.body;
    if (!title || !description || !date || !location || !createdBy) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    const event = new Event({ title, description, date, location, createdBy });
    await event.save();
    res.status(201).send(event);
  } catch (err) {
    console.error("Error creating event:", err); // Loguj błąd
    res.status(500).send({ message: "Error creating event", error: err });
  }
});

// Pobieranie wszystkich wydarzeń
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "firstName lastName");
    res.send(events);
  } catch (err) {
    res.status(500).send({ message: "Error fetching events", error: err });
  }
});

// Zarządzanie uczestnictwem
router.post("/:id/attend", async (req, res) => {
  try {

    const { userId } = req.body;

    if (!userId) {
      console.error("Missing userId");
      return res.status(400).send({ message: "Missing userId" });
    }

    const user = await User.findOne({ email: userId });
    if (!user) {
      console.error("User not found with email:", userId);
      return res.status(404).send({ message: "User not found" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      console.error("Event not found with ID:", req.params.id);
      return res.status(404).send({ message: "Event not found" });
    }

    console.log("Event attendees before update:", event.attendees);

    if (event.attendees.includes(userId)) {
      console.warn("User already attending event:", userId);
      event.attendees = event.attendees.filter((attendee) => attendee !== userId);
      await event.save();
      return res.send(event);
    }

    event.attendees.push(userId);
    await event.save();

    res.send(event);
  } catch (err) {
    console.error("Error attending event:", err);
    res.status(500).send({ message: "Error attending event", error: err });
  }
});

module.exports = router;
