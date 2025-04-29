import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  sku: { type: String, unique: true },
  name: String,
  description: String,
  imageUrl: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  netWeight: Number,
  grossWeight: Number,
  volume: Number,
  shelfLife: String,
  basePrice: Number,
  tax: Number,
  discount: Number,
  moq: Number,
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  containerTypes: [String],
  stockByDistributor: [
    {
      distributorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      quantity: Number,
    },
  ],
});

export default mongoose.model("Product", ProductSchema);
