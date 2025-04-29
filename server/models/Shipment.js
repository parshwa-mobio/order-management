import mongoose from "mongoose";

const ShipmentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  status: String,
  eta: String,
  location: String,
  updatedAt: Date,
});

export default mongoose.model("Shipment", ShipmentSchema);
