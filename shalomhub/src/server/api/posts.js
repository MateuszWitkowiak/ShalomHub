  const express = require("express");
  const Post = require("../models/Post");
  const User = require("../models/User");
  const router = express.Router();
  const { io } = require("../server")
  const Notification = require('../models/Notification');
  
  // dodawanie posta
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

  // pobieranie postów
  router.get("/getAll", async (req, res) => {
    try {
      const posts = await Post.find().populate("userId", "email");
      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // lajkowanie posta
  router.post("/like/:id", async (req, res) => {
    const { userEmail } = req.body;
    const postId = req.params.id;

    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const user = await User.findOne({ email: userEmail });
        if (!user) return res.status(404).json({ message: "User not found" });

        const hasLiked = post.likedBy.includes(user._id);

        if (hasLiked) {
            post.likedBy = post.likedBy.filter((id) => id.toString() !== user._id.toString());
            post.likesCount -= 1;
        } else {
            post.likedBy.push(user._id);
            post.likesCount += 1;

            if (post.userId.toString() !== user._id.toString()) {
                const notification = new Notification({
                    type: "like",
                    recipient: post.userId,
                    sender: user._id,
                    relatedObject: post._id,
                    relatedObjectType: "post",
                    message: `${user.email} liked your post!`,
                    isRead: false,
                });

                await notification.save();

                io.to(post.userId.toString()).emit("notification", {
                    message: notification.message,
                    type: "like",
                    postId,
                    createdAt: notification.createdAt,
                });

            }
        }

        await post.save();
        const updatedPost = await Post.findById(post._id).populate("userId", "email");
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Error liking/unliking post:", error);
        res.status(500).json({ message: "Server error" });
    }
});

  // komentowanie 
  router.post("/comment/:id", async (req, res) => {
    const { text, userId } = req.body;
  
    if (!text || !userId) {
      return res.status(400).json({ message: "Text and userId are required" });
    }
  
    try {
      const postId = req.params.id;
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      const user = await User.findOne({ email: userId });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      post.comments.push({ userId: user.email, text });
      await post.save();
  
      if (post.userId.email !== userId) {
        const notification = new Notification({
          type: "comment",
          recipient: post.userId._id,
          sender: user._id,
          relatedObject: post._id,
          relatedObjectType: "post",
          message: `${userId} commented on your post!`,
          isRead: false,
        });
        await notification.save();
  
        io.to(post.userId.toString()).emit("notification", {
          message: notification.message,
          type: "comment",
          postId,
          createdAt: notification.createdAt,
        });
      }
  
      const updatedPost = await Post.findById(post._id)
        .populate('userId', 'email')
        .populate('comments.userId', 'email');
  
      res.status(201).json(updatedPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // edytowanie
  router.put("/edit/:id", async (req, res) => {
    const { description, userEmail } = req.body;
    const postId = req.params.id;

    if (!description || !userEmail) {
      return res.status(400).json({ message: "Description and userEmail are required" });
    }

    try {
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const user = await User.findOne({ email: userEmail });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (post.userId.toString() !== user._id.toString()) {
        return res.status(403).json({ message: "You are not authorized to edit this post" });
      }

      post.description = description;
      await post.save();

      const updatedPost = await Post.findById(postId).populate("userId", "email");
      res.status(200).json(updatedPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // usuwanie wiadomości
  router.delete("/delete/:id", async (req, res) => {
    const { userEmail } = req.body;
    const postId = req.params.id;

    if (!userEmail) {
      return res.status(400).json({ message: "User email is required" });
    }

    try {
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const user = await User.findOne({ email: userEmail });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (post.userId.toString() !== user._id.toString()) {
        return res.status(403).json({ message: "You are not authorized to delete this post" });
      }

      await post.deleteOne();
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // powiadomienia :)
  router.get("/notifications", async (req, res) => {
    const { userId, limit = 10, skip = 0 } = req.query;
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      const notifications = await Notification.find({ recipient: user._id })
        .sort({ createdAt: -1 })
        .skip(Number(skip))
        .limit(Number(limit));
  
      res.status(200).json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  

  
  


  module.exports = router;
