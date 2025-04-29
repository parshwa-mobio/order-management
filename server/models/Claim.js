import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    claimType: {
      type: String,
      enum: ["damage", "shortage", "quality", "other"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    evidence: [
      {
        type: String,
        url: String,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "investigating", "resolved", "rejected"],
      default: "pending",
    },
    resolution: {
      type: String,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Claim", claimSchema);
