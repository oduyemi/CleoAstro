
import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type ProductOrderPaymentStatus =
  | "unpaid"
  | "transfer-reported"
  | "verified"
  | "rejected"
  | "refunded";

export type ProductOrderStatus =
  | "pending"
  | "awaiting-payment-verification"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface IProductOrder extends Document {
  reference: string;
  product: Types.ObjectId;

  productSnapshot: {
    name: string;
    slug: string;
    image: string;
    unitPrice: number;
    currency: "NGN";
  };

  quantity: number;
  totalAmount: number;
  currency: "NGN";

  customer: {
    fullName: string;
    email: string;
    phone: string;
  };

  deliveryAddress: string;
  deliveryNotes?: string;

  payment: {
    method: "bank-transfer";
    status: ProductOrderPaymentStatus;
    transferReference: string;
    verifiedAt?: Date;
    verifiedBy?: string;
    rejectionReason?: string;
  };

  status: ProductOrderStatus;
  adminNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const ProductOrderSchema = new Schema<IProductOrder>(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    productSnapshot: {
      name: { type: String, required: true },
      slug: { type: String, required: true },
      image: { type: String, required: true },
      unitPrice: { type: Number, required: true, min: 100 },
      currency: {
        type: String,
        enum: ["NGN"],
        default: "NGN",
        required: true,
      },
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },

    totalAmount: {
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

    customer: {
      fullName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 200,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
        maxlength: 40,
      },
    },

    deliveryAddress: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    deliveryNotes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    payment: {
      method: {
        type: String,
        enum: ["bank-transfer"],
        default: "bank-transfer",
        required: true,
      },

      status: {
        type: String,
        enum: [
          "unpaid",
          "transfer-reported",
          "verified",
          "rejected",
          "refunded",
        ],
        default: "unpaid",
        required: true,
        index: true,
      },

      transferReference: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
        index: true,
      },

      verifiedAt: Date,
      verifiedBy: String,
      rejectionReason: {
        type: String,
        trim: true,
        maxlength: 1000,
      },
    },

    status: {
      type: String,
      enum: [
        "pending",
        "awaiting-payment-verification",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
      required: true,
      index: true,
    },

    adminNotes: {
      type: String,
      trim: true,
      maxlength: 3000,
    },
  },
  { timestamps: true },
);

const ProductOrder: Model<IProductOrder> = mongoose.models.ProductOrder || mongoose.model<IProductOrder>("ProductOrder", ProductOrderSchema);
export default ProductOrder;
