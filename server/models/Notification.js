import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  type: { type: String, enum: ["order-status", "low-stock", "promotion"] },
  role: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  read: { type: Boolean, default: false },
  readAt: { type: Date },
  relatedId: { type: mongoose.Schema.Types.ObjectId },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

export default mongoose.model("Notification", NotificationSchema);
