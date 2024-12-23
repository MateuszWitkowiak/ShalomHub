const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
const router = express.Router();

// dodawanie posta do bazy
router.post("/add", async (req, res) => {
  const { description, email } = req.body;

  if (!description || !email) {
    return res.status(400).json({ message: "Description and email are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPost = new Post({
      description,
      userId: user._id,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
