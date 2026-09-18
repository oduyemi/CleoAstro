import {
    createError,
    defineEventHandler,
    readBody,
  } from "h3";
  import Booking from "../../models/booking.model";
  
  type ReadingId =
    | "birth-chart"
    | "vedic-consultation"
    | "deep-dive"
    | "ancestral-karmic";
  
  interface BookingBody {
    readingId: ReadingId;
    fullName: string;
    email: string;
    phone: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    question: string;
    transferReference: string;
  }
  
  /**
   * Server-side reading configuration.
   *
   * The frontend must never be trusted for the price.
   */
  const READINGS: Record<
    ReadingId,
    {
      name: string;
      amount: number;
    }
  > = {
    "birth-chart": {
      name: "Birth Chart Reading",
      amount: 30000,
    },
  
    "vedic-consultation": {
      name: "Vedic Consultation",
      amount: 50000,
    },
  
    "deep-dive": {
      name: "Deep Dive Reading",
      amount: 80000,
    },
  
    "ancestral-karmic": {
      name: "Ancestral & Karmic Reading",
      amount: 95000,
    },
  };
  
  const clean = (value: unknown): string => {
    return typeof value === "string" ? value.trim() : "";
  };
  
  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const createBookingReference = (): string => {
    const timestamp = Date.now().toString(36).toUpperCase();
  
    const random = crypto
      .randomUUID()
      .replace(/-/g, "")
      .slice(0, 8)
      .toUpperCase();
  
    return `CLEO-${timestamp}-${random}`;
  };
  
  export default defineEventHandler(async (event) => {
    const body = await readBody<Partial<BookingBody>>(event);
  
    /*
     * ------------------------------------------------------------
     * Clean incoming values
     * ------------------------------------------------------------
     */
  
    const readingId = clean(body.readingId) as ReadingId;
    const fullName = clean(body.fullName);
    const email = clean(body.email).toLowerCase();
    const phone = clean(body.phone);
    const birthDate = clean(body.birthDate);
    const birthTime = clean(body.birthTime);
    const birthPlace = clean(body.birthPlace);
    const question = clean(body.question);
    const transferReference = clean(body.transferReference);
  
    /*
     * ------------------------------------------------------------
     * Validate reading
     * ------------------------------------------------------------
     */
  
    const reading = READINGS[readingId];
  
    if (!reading) {
      throw createError({
        statusCode: 400,
        statusMessage: "The selected reading is not valid.",
      });
    }
  
    /*
     * ------------------------------------------------------------
     * Validate customer information
     * ------------------------------------------------------------
     */
  
    if (!fullName || fullName.length < 2) {
      throw createError({
        statusCode: 400,
        statusMessage: "Please provide your full name.",
      });
    }
  
    if (fullName.length > 150) {
      throw createError({
        statusCode: 400,
        statusMessage: "Your name is too long.",
      });
    }
  
    if (!email || !isValidEmail(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Please provide a valid email address.",
      });
    }
  
    if (!phone) {
      throw createError({
        statusCode: 400,
        statusMessage: "Please provide your phone number.",
      });
    }
  
    if (!birthDate) {
      throw createError({
        statusCode: 400,
        statusMessage: "Please provide your birth date.",
      });
    }
  
    if (!birthTime) {
      throw createError({
        statusCode: 400,
        statusMessage: "Please provide your birth time.",
      });
    }
  
    if (!birthPlace) {
      throw createError({
        statusCode: 400,
        statusMessage: "Please provide your birth place.",
      });
    }
  
    if (!question) {
      throw createError({
        statusCode: 400,
        statusMessage: "Please tell us what you would like guidance on.",
      });
    }
  
    if (question.length > 3000) {
      throw createError({
        statusCode: 400,
        statusMessage: "Your question is too long.",
      });
    }
  
    /*
     * ------------------------------------------------------------
     * Validate transfer reference
     * ------------------------------------------------------------
     */
  
    if (!transferReference) {
      throw createError({
        statusCode: 400,
        statusMessage: "Please provide your transfer reference.",
      });
    }
  
    if (transferReference.length > 100) {
      throw createError({
        statusCode: 400,
        statusMessage: "The transfer reference is invalid.",
      });
    }
  
    /*
     * ------------------------------------------------------------
     * Generate our own booking reference
     * ------------------------------------------------------------
     */
  
    const bookingReference = createBookingReference();
  
    /*
     * ------------------------------------------------------------
     * Create booking
     * ------------------------------------------------------------
     *
     * IMPORTANT:
     *
     * The amount comes from READINGS above.
     * We do NOT accept an amount from the browser.
     *
     * The customer's "I've made the transfer" action only means
     * that they have reported making the transfer.
     *
     * It does NOT mean that payment has been verified.
     * ------------------------------------------------------------
     */
  
    try {
      const booking = await Booking.create({
        reference: bookingReference,
  
        reading: {
          id: readingId,
          name: reading.name,
          amount: reading.amount,
          currency: "NGN",
        },
  
        customer: {
          fullName,
          email,
          phone,
        },
  
        birthDetails: {
          date: birthDate,
          time: birthTime,
          place: birthPlace,
        },
  
        question,
  
        payment: {
          method: "bank-transfer",
          status: "transfer-reported",
          transferReference,
          amount: reading.amount,
          currency: "NGN",
        },
  
        status: "awaiting-payment-verification",
      });
  
      return {
        success: true,
  
        message:
          "Your booking request has been received and is awaiting payment verification.",
  
        booking: {
          id: booking._id.toString(),
          reference: booking.reference,
          reading: {
            id: readingId,
            name: reading.name,
            amount: reading.amount,
            currency: "NGN",
          },
          paymentStatus: booking.payment.status,
          status: booking.status,
          createdAt: booking.createdAt,
        },
      };
    } catch (error: unknown) {
      console.error("Booking creation error:", error);
  
      /*
       * Handle duplicate booking references.
       */
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: number }).code === 11000
      ) {
        throw createError({
          statusCode: 409,
          statusMessage:
            "We could not create the booking reference. Please try again.",
        });
      }
  
      throw createError({
        statusCode: 500,
        statusMessage:
          "We could not submit your booking. Please try again.",
      });
    }
  });