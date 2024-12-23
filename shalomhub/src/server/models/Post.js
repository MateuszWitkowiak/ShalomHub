const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  description: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  likesCount: { type: Number, default: 0 },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
