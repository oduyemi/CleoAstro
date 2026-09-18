import mongoose, { Document, Model, Schema } from "mongoose";

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

export interface IBooking extends Document {
  reference: string;

  reading: {
    id:
      | "birth-chart"
      | "vedic-consultation"
      | "deep-dive"
      | "ancestral-karmic";
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
    transferReference: string;
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
          "birth-chart",
          "vedic-consultation",
          "deep-dive",
          "ancestral-karmic",
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
        required: true,
        trim: true,
      },

      time: {
        type: String,
        required: true,
        trim: true,
      },

      place: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
      },
    },

    question: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
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
        required: true,
        trim: true,
        index: true,
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
  }
);

const Booking: Model<IBooking> =
  mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;