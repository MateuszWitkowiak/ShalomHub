import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["like", "comment", "message", "friend", "friendRequest", "friendRequestAccepted"],
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
      enum: ["post", "comment", "message", "user"],
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

export default mongoose.model("Notification", NotificationSchema);
