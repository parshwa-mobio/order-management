import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      sparse: true, // Allows null values during document creation
    },
    distributorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    dealerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        sku: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        tax: {
          type: Number,
          required: true,
          default: 0,
          min: 0,
        },
        discount: {
          type: Number,
          required: true,
          default: 0,
          min: 0,
        },
        totalPrice: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    orderType: {
      type: String,
      enum: ["direct", "bulk", "email", "cloned"],
      required: true,
    },
    status: {
      type: String,
      enum: [
        "draft",
        "pending",
        "processing",
        "shipped",
        "completed",
        "cancelled",
      ],
      required: true,
      default: "draft",
    },
    containerType: {
      type: String,
      required: true,
    },
    deliveryDate: {
      type: Date,
      required: true,
    },
    notes: String,
    cancellationReason: String,
    createdVia: {
      type: String,
      enum: ["web", "email", "bulk"],
      default: "web",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // Automatically handles createdAt and updatedAt
  },
);

// Auto-generate order number before saving
orderSchema.pre("save", async function (next) {
  try {
    if (!this.orderNumber) {
      const count = await mongoose.model("Order").countDocuments();
      const year = new Date().getFullYear();
      const month = String(new Date().getMonth() + 1).padStart(2, "0");
      this.orderNumber = `ORD-${year}${month}-${String(count + 1).padStart(5, "0")}`;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
