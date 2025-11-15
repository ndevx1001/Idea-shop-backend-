import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    full_name: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: String , ref: "Product" },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    total: { type: Number, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const orderModel = mongoose.model("Order", orderSchema);

export default orderModel;
