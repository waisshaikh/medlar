import mongoose from "mongoose";
import priceSchema from "./price.schema.js";
const ProductSchema = new mongoose.Schema({
  tittle: { type: String, required: true },
  description: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  category: {
    type: String,
    enum: ["Backpack","Laptop Bag","Messenger Bag","Sling Bag","Duffel Bag","Travel Bag","Leather Bag","Gym Bag","Wallet","Other"],
    default: "Other"
  },
  price: { type: priceSchema, required: true },
  images: [{ type: String, required: true }],
  variants: [{
    images: [{ url: { type: String, required: true } }],
    stock: { type: Number, default: 0 },
    attributes: { type: Map, of: String },
    price: { type: priceSchema, required: true }
  }]
}, { timestamps: true });
const productModel = mongoose.model("product", ProductSchema);
export default productModel;
