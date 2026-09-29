import mongoose, { Document, Model, Schema, Types } from "mongoose";


export type PaymentProvider = "palmpay";
export type PaymentMethod = "bank-transfer";
export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "expired"
  | "cancelled";


export interface IPayment extends Document {
  _id: Types.ObjectId;
  booking: Types.ObjectId;
  provider: PaymentProvider;
  method: PaymentMethod;
  status: PaymentStatus;
  reference: string;
  providerReference?: string;
  serviceName: string;
  description: string;
  amount: number;
  currency: "NGN";
  providerData?: Record<string, unknown>;
  paidAt?: Date;
  expiresAt?: Date;
  lastCheckedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },

    provider: {
      type: String,
      enum: ["palmpay"],
      required: true,
      default: "palmpay",
      index: true,
    },

    method: {
      type: String,
      enum: ["bank-transfer"],
      required: true,
      default: "bank-transfer",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "expired",
        "cancelled",
      ],
      required: true,
      default: "pending",
      index: true,
    },

    reference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    providerReference: {
      type: String,
      trim: true,
      index: true,
      sparse: true,
    },

    serviceName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      default: "Reading Booking",
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      enum: ["NGN"],
      required: true,
      default: "NGN",
    },

    providerData: {
      type: Schema.Types.Mixed,
      default: undefined,
    },

    paidAt: {
      type: Date,
    },

    expiresAt: {
      type: Date,
    },

    lastCheckedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

PaymentSchema.index({
  booking: 1,
  status: 1,
});

PaymentSchema.index({
  provider: 1,
  providerReference: 1,
});

const Payment: Model<IPayment> =
  mongoose.models.Payment ||
  mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;