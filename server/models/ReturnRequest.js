import mongoose from "mongoose";

const ReturnSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  sku: String,
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: Number,
  reason: {
    type: String,
    enum: [
      "Damaged Goods",
      "Incorrect Shipment",
      "Expired Product",
      "Quality Issue",
      "Customer Rejection",
    ],
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "In Transit", "Received", "Rejected"],
    default: "Pending",
  },
  rmaNumber: String,
  approvalNotes: String,
  creditAmount: Number,
  trackingNumber: String,
  dateInitiated: Date,
  dateCompleted: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("ReturnRequest", ReturnSchema);
