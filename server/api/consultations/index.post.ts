import {
    createError,
    defineEventHandler,
    readBody,
  } from "h3";
  import Consultation from "../../models/consultation.model";
  import { dbConnect } from "../../utils/db";
  type ConsultationType = "ifa" | "afa";
  
  interface ConsultationBody {
    consultationType: ConsultationType;
    fullName: string;
    email: string;
    phone: string;
    birthDate?: string;
    birthTime?: string;
    birthPlace?: string;
    question: string;
    transferReference: string;
  }

  

  
  const CONSULTATIONS: Record<
    ConsultationType,
    {
      name: string;
      amount: number;
    }
  > = {
    ifa: {
      name: "Ifá Consultation",
      amount: 50000,
    },
  
    afa: {
      name: "Afa Consultation",
      amount: 50000,
    },
  };
  
  const clean = (value: unknown): string => {
    return typeof value === "string"
      ? value.trim()
      : "";
  };
  
  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const createReference = (): string => {
    const timestamp = Date.now()
      .toString(36)
      .toUpperCase();
  
    const random = crypto
      .randomUUID()
      .replace(/-/g, "")
      .slice(0, 8)
      .toUpperCase();
  
    return `CLEO-CON-${timestamp}-${random}`;
  };
  
  export default defineEventHandler(async (event) => {
    await dbConnect();
    const body =
      await readBody<Partial<ConsultationBody>>(event);
  
    const consultationType = clean(
      body.consultationType
    ) as ConsultationType;
  
    const fullName = clean(body.fullName);
    const email = clean(body.email).toLowerCase();
    const phone = clean(body.phone);
  
    const birthDate = clean(body.birthDate);
    const birthTime = clean(body.birthTime);
    const birthPlace = clean(body.birthPlace);
  
    const question = clean(body.question);
    const transferReference = clean(
      body.transferReference
    );
  
    const consultation =
      CONSULTATIONS[consultationType];
  
    if (!consultation) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "Invalid consultation selected.",
      });
    }
  
    if (!fullName || fullName.length < 2) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "Please provide your full name.",
      });
    }
  
    if (fullName.length > 150) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "Your name is too long.",
      });
    }
  
    if (!email || !isValidEmail(email)) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "Please provide a valid email address.",
      });
    }
  
    if (!phone) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "Please provide your phone number.",
      });
    }
  
    if (!question) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "Please tell us what you would like guidance on.",
      });
    }
  
    if (question.length > 3000) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "Your question cannot exceed 3000 characters.",
      });
    }
  
    if (!transferReference) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "Please provide your transfer reference.",
      });
    }
  
    const reference = createReference();
  
    try {
      const consultationRecord =
        await Consultation.create({
          reference,
  
          consultation: {
            type: consultationType,
            name: consultation.name,
            amount: consultation.amount,
            currency: "NGN",
          },
  
          client: {
            fullName,
            email,
            phone,
          },
  
          birthDetails: {
            date: birthDate || undefined,
            time: birthTime || undefined,
            place: birthPlace || undefined,
          },
  
          question,
  
          payment: {
            method: "bank-transfer",
            status: "transfer-reported",
            transferReference,
            amount: consultation.amount,
            currency: "NGN",
          },
  
          status:
            "awaiting-payment-verification",
        });
  
      return {
        success: true,
  
        message:
          "Your consultation request has been received and is awaiting payment verification.",
  
        consultation: {
          id: consultationRecord._id.toString(),
          reference: consultationRecord.reference,
          status: consultationRecord.status,
        },
      };
    } catch (error: unknown) {
      console.error(
        "Consultation creation error:",
        error
      );
  
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: number }).code === 11000
      ) {
        throw createError({
          statusCode: 409,
          statusMessage:
            "A consultation with this reference already exists.",
        });
      }
  
      throw createError({
        statusCode: 500,
        statusMessage:
          "We could not submit your consultation. Please try again.",
      });
    }
  });