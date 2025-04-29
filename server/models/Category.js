import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: String,
  description: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, {
  timestamps: true // This will automatically manage createdAt and updatedAt
});

export default mongoose.model("Category", CategorySchema);
