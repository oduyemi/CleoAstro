import {
  createError,
  defineEventHandler,
  readBody,
} from "h3";
import { randomUUID } from "node:crypto";
import Booking, {
  type IBooking,
  type PackageId,
  type MasterClassPaymentPlan,
} from "../../models/booking.model";

interface BookingBody {
  readingId: PackageId;
  fullName: string;
  email: string;
  phone: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  question?: string;
  transferReference?: string;
  paymentPlan?: MasterClassPaymentPlan;
}

const PACKAGES: Record<
  PackageId,
  { name: string; amount: number | null }
> = {
  basic: { name: "Basic", amount: 50000 },
  standard: { name: "Standard", amount: 150000 },
  premium: { name: "Premium", amount: 500000 },
  "vip-coaching": { name: "VIP Coaching", amount: null },
  "master-class": { name: "Master Class", amount: 500000 },
};

const clean = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const createBookingReference = (): string =>
  `CLEO-${Date.now().toString(36).toUpperCase()}-${randomUUID()
    .replace(/-/g, "")
    .slice(0, 8)
    .toUpperCase()}`;

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<BookingBody>>(event);

  const readingId = clean(body.readingId) as PackageId;
  const fullName = clean(body.fullName);
  const email = clean(body.email).toLowerCase();
  const phone = clean(body.phone);
  const birthDate = clean(body.birthDate);
  const birthTime = clean(body.birthTime);
  const birthPlace = clean(body.birthPlace);
  const question = clean(body.question);
  const transferReference = clean(body.transferReference);

  // Only allow the two valid payment plans.
  const rawPaymentPlan = clean(body.paymentPlan);

  const paymentPlan: MasterClassPaymentPlan | undefined =
    rawPaymentPlan === "full" || rawPaymentPlan === "stage"
      ? rawPaymentPlan
      : undefined;

  const selectedPackage = PACKAGES[readingId];

  if (!selectedPackage) {
    throw createError({
      statusCode: 400,
      statusMessage: "The selected package is invalid.",
    });
  }

  if (fullName.length < 2 || fullName.length > 150) {
    throw createError({
      statusCode: 400,
      statusMessage: "Please provide a valid full name.",
    });
  }

  if (!isValidEmail(email) || email.length > 200) {
    throw createError({
      statusCode: 400,
      statusMessage: "Please provide a valid email address.",
    });
  }

  if (!phone || phone.length > 40) {
    throw createError({
      statusCode: 400,
      statusMessage: "Please provide a valid phone number.",
    });
  }

  if (question.length > 3000) {
    throw createError({
      statusCode: 400,
      statusMessage: "Your message is too long.",
    });
  }

  const isVip = readingId === "vip-coaching";
  const isMasterClass = readingId === "master-class";

  if (
    !isVip &&
    (!birthDate || !birthTime || birthPlace.length < 2)
  ) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Please provide your date, time and place of birth.",
    });
  }

  if (isMasterClass && !paymentPlan) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Please select full payment or stage payment for the Master Class.",
    });
  }

  if (!isMasterClass && paymentPlan) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "This payment plan is not available for this package.",
    });
  }

  if (!isVip && !transferReference) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Please provide the transfer reference after making your payment.",
    });
  }

  if (transferReference.length > 100) {
    throw createError({
      statusCode: 400,
      statusMessage: "The transfer reference is invalid.",
    });
  }

  const amount =
    isVip
      ? 0
      : isMasterClass && paymentPlan === "stage"
        ? 300000
        : selectedPackage.amount;

  if (amount === null) {
    throw createError({
      statusCode: 400,
      statusMessage: "The package price could not be determined.",
    });
  }

  const reference = createBookingReference();
  const payment: IBooking["payment"] = {
    method: "bank-transfer",
    status: isVip ? "unpaid" : "transfer-reported",
    amount,
    currency: "NGN",
    ...(transferReference ? { transferReference } : {}),
    ...(paymentPlan ? { plan: paymentPlan } : {}),
  };

  try {
    const booking = await Booking.create({
      reference,
      reading: {
        id: readingId,
        name: selectedPackage.name,
        amount,
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
      payment,
      status: isVip
        ? "pending"
        : "awaiting-payment-verification",
    });

    return {
      success: true,
      message: isVip
        ? "Your VIP Coaching enquiry has been received."
        : "Your booking has been received and is awaiting payment verification.",
      booking: {
        id: booking._id.toString(),
        reference: booking.reference,
        reading: {
          id: readingId,
          name: selectedPackage.name,
          amount,
          currency: "NGN" as const,
        },
        paymentStatus: booking.payment.status,
        paymentPlan: booking.payment.plan,
        status: booking.status,
        createdAt: booking.createdAt,
      },
    };
  } catch (error: unknown) {
    console.error("Booking creation error:", error);

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