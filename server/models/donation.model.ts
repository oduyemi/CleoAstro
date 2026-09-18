import mongoose, { Document, Model, Schema } from "mongoose";

export type DonationPaymentStatus =
  | "unpaid"
  | "transfer-reported"
  | "verified"
  | "rejected"
  | "refunded";

export type DonationStatus =
  | "pending"
  | "awaiting-payment-verification"
  | "confirmed"
  | "cancelled";

export interface IDonation extends Document {
  reference: string;

  donor: {
    fullName?: string;
    email?: string;
    phone?: string;
  };

  amount: number;

  currency: "NGN";

  payment: {
    method: "bank-transfer";
    status: DonationPaymentStatus;
    transferReference: string;
    verifiedAt?: Date;
    verifiedBy?: string;
    rejectionReason?: string;
  };

  message?: string;

  status: DonationStatus;

  adminNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const DonationSchema = new Schema<IDonation>(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    donor: {
      fullName: {
        type: String,
        trim: true,
        maxlength: 150,
      },

      email: {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 200,
      },

      phone: {
        type: String,
        trim: true,
        maxlength: 40,
      },
    },

    amount: {
      type: Number,
      required: true,
      min: 100,
    },

    currency: {
      type: String,
      required: true,
      enum: ["NGN"],
      default: "NGN",
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

    message: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    status: {
      type: String,
      required: true,
      enum: [
        "pending",
        "awaiting-payment-verification",
        "confirmed",
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

const Donation: Model<IDonation> =
  mongoose.models.Donation ||
  mongoose.model<IDonation>("Donation", DonationSchema);

export default Donation;