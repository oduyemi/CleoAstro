import mongoose, { Schema, type Model } from "mongoose";

export type AdEnquiryStatus =
  | "new"
  | "contacted"
  | "in_review"
  | "approved"
  | "declined"
  | "completed";

export interface IAdPlacement {
  fullName: string;
  email: string;
  phone?: string;
  businessName: string;
  website?: string;
  industry: string;
  advertType: string;
  advertDescription: string;
  campaignGoal?: string;
  targetAudience?: string;
  placement: string;
  budget?: string;
  startDate?: Date;
  endDate?: Date;
  destinationUrl?: string;
  assetUrl?: string;
  additionalNotes?: string;
  source: string;
  consent: boolean;
  status: AdEnquiryStatus;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdPlacementSchema = new Schema<IAdPlacement>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 40,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    website: {
      type: String,
      trim: true,
      maxlength: 2048,
    },

    industry: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    advertType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    advertDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    campaignGoal: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    targetAudience: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    placement: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    budget: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    startDate: Date,
    endDate: Date,

    destinationUrl: {
      type: String,
      trim: true,
      maxlength: 2048,
    },
    assetUrl: {
      type: String,
      trim: true,
      maxlength: 2048,
    },
    additionalNotes: {
      type: String,
      trim: true,
      maxlength: 3000,
    },

    source: {
      type: String,
      required: true,
      default: "CleoAstro Bulletin",
      trim: true,
      maxlength: 100,
    },

    consent: {
      type: Boolean,
      required: true,
      validate: {
        validator: (value: boolean) => value === true,
        message: "Consent is required to submit an advert enquiry.",
      },
    },

    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "in_review",
        "approved",
        "declined",
        "completed",
      ],
      default: "new",
      index: true,
    },

    adminNotes: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

AdPlacementSchema.index({ status: 1, createdAt: -1 });
const AdPlacement: Model<IAdPlacement> = (mongoose.models.AdPlacement as Model<IAdPlacement> | undefined) ??
  mongoose.model<IAdPlacement>("AdPlacement", AdPlacementSchema);

export default AdPlacement;
