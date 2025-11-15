import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  _id: { type: Number },
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  old_price: Number,
  currency: { type: String, default: "RUB" },
  tags: [String],
  characteristics: {
    weight: String,
    country_of_origin: String,
    material: String
  },
  rating: Number,
  img: String
});

export default mongoose.model("Product", productSchema);
