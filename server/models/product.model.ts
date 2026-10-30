
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProduct extends Document {
  slug: string;
  number: string;
  name: string;
  category: string;
  description: string;
  price: number;
  currency: "NGN";
  image: string;
  featured: boolean;
  isAvailable: boolean;
  stock?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    number: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: true,
      min: 100,
    },
    currency: {
      type: String,
      enum: ["NGN"],
      default: "NGN",
      required: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    stock: {
      type: Number,
      min: 0,
      default: null,
    },
  },
  { timestamps: true },
);

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
