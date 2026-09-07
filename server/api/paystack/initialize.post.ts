import crypto from "node:crypto";

const READINGS = {
  "birth-chart": {
    name: "Birth Chart Reading",
    amount: 30_000,
    duration: "30 minutes",
  },
  "vedic-consultation": {
    name: "Vedic Astrology Consultation",
    amount: 50_000,
    duration: "45 minutes",
  },
  "deep-dive": {
    name: "Deep-Dive Vedic Reading",
    amount: 80_000,
    duration: "60 minutes",
  },
  "ancestral-karmic": {
    name: "Karmic & Ancestral Patterns",
    amount: 95_000,
    duration: "75 minutes",
  },
} as const;

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const body = await readBody(event);

  const {
    readingId,
    fullName,
    email,
    phone,
    birthDate,
    birthTime,
    birthPlace,
    question,
  } = body;

  if (
    !readingId ||
    !fullName ||
    !email ||
    !phone ||
    !birthDate ||
    !birthTime ||
    !birthPlace
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required booking details.",
    });
  }

  const reading =
    READINGS[readingId as keyof typeof READINGS];

  if (!reading) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid reading selected.",
    });
  }

  const emailIsValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!emailIsValid) {
    throw createError({
      statusCode: 400,
      statusMessage: "Please provide a valid email address.",
    });
  }

  /*
   * Paystack expects amount in the currency subunit.
   * For NGN, ₦50,000 becomes 5,000,000 kobo.
   */
  const amount = reading.amount * 100;

  /*
   * Generate our own unique reference.
   */
  const reference = `CLEO-${Date.now()}-${crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase()}`;

  const origin =
    getRequestHeader(event, "origin") ||
    config.public.appUrl ||
    "http://localhost:3000";

  const response = await $fetch<{
    status: boolean;
    message: string;
    data?: {
      authorization_url: string;
      access_code: string;
      reference: string;
    };
  }>("https://api.paystack.co/transaction/initialize", {
    method: "POST",

    headers: {
      Authorization: `Bearer ${config.paystackSecretKey}`,
      "Content-Type": "application/json",
    },

    body: {
      email,
      amount: String(amount),
      currency: "NGN",
      reference,

      callback_url: `${origin}/api/paystack/callback`,

      metadata: {
        readingId,
        readingName: reading.name,
        duration: reading.duration,

        customer: {
          fullName,
          email,
          phone,
        },

        birthDetails: {
          birthDate,
          birthTime,
          birthPlace,
        },

        question: question || "",
      },
    },
  });

  if (!response.status || !response.data) {
    throw createError({
      statusCode: 502,
      statusMessage:
        response.message || "Paystack initialization failed.",
    });
  }

  return {
    success: true,
    accessCode: response.data.access_code,
    authorizationUrl: response.data.authorization_url,
    reference: response.data.reference,
  };
});