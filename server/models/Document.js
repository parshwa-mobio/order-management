import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  type: { type: String, enum: ["invoice", "contract", "deliveryNote"] },
  version: String,
  fileUrl: String,
  uploadedAt: { type: Date, default: Date.now },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Document", DocumentSchema);
