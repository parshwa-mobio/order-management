import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      index: { unique: true, sparse: true }, // Define index here instead of using schema.index()
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
    timestamps: true,
  }
);

// Improved auto-generate order number before saving
orderSchema.pre("save", async function (next) {
  try {
    if (!this.orderNumber) {
      // Get the latest order number for the current month
      const year = new Date().getFullYear();
      const month = String(new Date().getMonth() + 1).padStart(2, "0");
      const prefix = `ORD-${year}${month}-`;
      
      const latestOrder = await mongoose
        .model("Order")
        .findOne({ orderNumber: new RegExp(`^${prefix}`) })
        .sort({ orderNumber: -1 });

      let nextNumber = 1;
      if (latestOrder && latestOrder.orderNumber) {
        const currentNumber = parseInt(latestOrder.orderNumber.split('-')[2]);
        nextNumber = currentNumber + 1;
      }

      this.orderNumber = `${prefix}${String(nextNumber).padStart(5, "0")}`;
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Remove the duplicate schema.index() call
// orderSchema.index({ orderNumber: 1 }, { unique: true, sparse: true }); // Remove this line

const Order = mongoose.model("Order", orderSchema);

export default Order;  // This is a default export
