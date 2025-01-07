const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["like", "comment", "message", "friend"],
      required: true,
    },
    recipient: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
    relatedObject: { 
      type: mongoose.Schema.Types.ObjectId 
    },
    relatedObjectType: {
      type: String,
      enum: ["post", "comment", "message"],
    },
    message: { 
      type: String, 
      required: true 
    },
    isRead: { 
      type: Boolean, 
      default: false 
    },
  },
  { 
    timestamps: true 
  }
);

NotificationSchema.index({ recipient: 1, isRead: 1 });

module.exports = mongoose.model("Notification", NotificationSchema);
