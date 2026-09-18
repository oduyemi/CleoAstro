import mongoose, {
    Schema,
    type Document,
    type Model,
  } from "mongoose";
  
  export type ConsultationType = "ifa" | "afa";
  
  export type ConsultationPaymentStatus =
    | "transfer-reported"
    | "paid"
    | "failed"
    | "refunded";
  
  export type ConsultationStatus =
    | "awaiting-payment-verification"
    | "confirmed"
    | "completed"
    | "cancelled";
  
  export interface IConsultation extends Document {
    reference: string;
  
    consultation: {
      type: ConsultationType;
      name: string;
      amount: number;
      currency: "NGN";
    };
  
    client: {
      fullName: string;
      email: string;
      phone: string;
    };
  
    birthDetails?: {
      date?: string;
      time?: string;
      place?: string;
    };
  
    question: string;
  
    payment: {
      method: "bank-transfer";
      status: ConsultationPaymentStatus;
      transferReference: string;
      amount: number;
      currency: "NGN";
      transferReportedAt?: Date;
    };
  
    status: ConsultationStatus;
  
    createdAt: Date;
    updatedAt: Date;
  }
  
  const ConsultationSchema =
    new Schema<IConsultation>(
      {
        reference: {
          type: String,
          required: true,
          unique: true,
          index: true,
          trim: true,
        },
  
        consultation: {
          type: {
            type: String,
            required: true,
            enum: ["ifa", "afa"],
          },
  
          name: {
            type: String,
            required: true,
            trim: true,
          },
  
          amount: {
            type: Number,
            required: true,
            min: 1,
          },
  
          currency: {
            type: String,
            required: true,
            enum: ["NGN"],
            default: "NGN",
          },
        },
  
        client: {
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
          },
  
          phone: {
            type: String,
            required: true,
            trim: true,
          },
        },
  
        birthDetails: {
          date: {
            type: String,
            trim: true,
          },
  
          time: {
            type: String,
            trim: true,
          },
  
          place: {
            type: String,
            trim: true,
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
              "transfer-reported",
              "paid",
              "failed",
              "refunded",
            ],
            default: "transfer-reported",
          },
  
          transferReference: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
          },
  
          amount: {
            type: Number,
            required: true,
            min: 1,
          },
  
          currency: {
            type: String,
            required: true,
            enum: ["NGN"],
            default: "NGN",
          },
  
          transferReportedAt: {
            type: Date,
          },
        },
  
        status: {
          type: String,
          required: true,
          enum: [
            "awaiting-payment-verification",
            "confirmed",
            "completed",
            "cancelled",
          ],
          default: "awaiting-payment-verification",
        },
      },
      {
        timestamps: true,
      }
    );
  
  const Consultation =
    (mongoose.models.Consultation as Model<IConsultation>) ||
    mongoose.model<IConsultation>(
      "Consultation",
      ConsultationSchema
    );
  
  export default Consultation;