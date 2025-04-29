import mongoose from "mongoose";

const SalesTargetSchema = new mongoose.Schema({
  salesId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  month: String,
  year: String,
  target: Number,
  achieved: Number,
});

export default mongoose.model("SalesTarget", SalesTargetSchema);
