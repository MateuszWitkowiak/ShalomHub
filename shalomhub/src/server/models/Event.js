import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  attendees: [{ type: String }],
  createdBy: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Event", EventSchema);
