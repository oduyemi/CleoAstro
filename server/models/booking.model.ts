import mongoose, { Schema } from "mongoose";
import type { Document, Model } from "mongoose";

export type BookingPaymentStatus =
  | "unpaid"
  | "transfer-reported"
  | "verified"
  | "rejected"
  | "refunded";

export type BookingStatus =
  | "pending"
  | "awaiting-payment-verification"
  | "confirmed"
  | "completed"
  | "cancelled";

export type PackageId =
  | "basic"
  | "standard"
  | "premium"
  | "vip-coaching"
  | "master-class";

export type MasterClassPaymentPlan = "full" | "stage";

export interface IBooking extends Document {
  reference: string;

  reading: {
    id: PackageId;
    name: string;
    amount: number;
    currency: "NGN";
  };

  customer: {
    fullName: string;
    email: string;
    phone: string;
  };

  birthDetails: {
    date: string;
    time: string;
    place: string;
  };

  question: string;

  payment: {
    method: "bank-transfer";
    status: BookingPaymentStatus;
    transferReference?: string;
    plan?: MasterClassPaymentPlan;
    amount: number;
    currency: "NGN";
    verifiedAt?: Date;
    verifiedBy?: string;
    rejectionReason?: string;
  };

  status: BookingStatus;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    reading: {
      id: {
        type: String,
        required: true,
        enum: [
          "basic",
          "standard",
          "premium",
          "vip-coaching",
          "master-class",
        ],
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        required: true,
        enum: ["NGN"],
        default: "NGN",
      },
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

    birthDetails: {
      date: {
        type: String,
        trim: true,
        default: "",
      },
      time: {
        type: String,
        trim: true,
        default: "",
      },
      place: {
        type: String,
        trim: true,
        maxlength: 200,
        default: "",
      },
    },

    question: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: "",
    },

    payment: {
      method: {
        type: String,
        required: true,
        enum: ["bank-transfer"],
        default: "bank-transfer",
      },
      status: {
        type: String,
        required: true,
        enum: [
          "unpaid",
          "transfer-reported",
          "verified",
          "rejected",
          "refunded",
        ],
        default: "unpaid",
        index: true,
      },
      transferReference: {
        type: String,
        trim: true,
        maxlength: 100,
      },
      plan: {
        type: String,
        enum: ["full", "stage"],
      },
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        required: true,
        enum: ["NGN"],
        default: "NGN",
      },
      verifiedAt: {
        type: Date,
      },
      verifiedBy: {
        type: String,
        trim: true,
      },
      rejectionReason: {
        type: String,
        trim: true,
        maxlength: 1000,
      },
    },

    status: {
      type: String,
      required: true,
      enum: [
        "pending",
        "awaiting-payment-verification",
        "confirmed",
        "completed",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    adminNotes: {
      type: String,
      trim: true,
      maxlength: 3000,
    },
  },
  {
    timestamps: true,
  },
);

const Booking: Model<IBooking> =
  (mongoose.models.Booking as Model<IBooking> | undefined) ??
  mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
