
import {
    createError,
    defineEventHandler,
    readBody,
  } from "h3";
  
  import Donation from "../../models/donation.model";
  import { dbConnect } from "../../utils/db";
  import { sendDonationNotification } from "../../utils/mailer";
  
  interface DonationBody {
    amount: number;
    fullName?: string;
    email?: string;
    phone?: string;
    transferReference: string;
    message?: string;
  }
  
  const cleanString = (value: unknown, maxLength: number): string => {
    if (typeof value !== "string") return "";
    return value.trim().slice(0, maxLength);
  };
  
  export default defineEventHandler(async (event) => {
    const body = await readBody<DonationBody>(event);
  
    if (!body || typeof body !== "object") {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid donation details.",
      });
    }
  
    const amount = Number(body.amount);
    const fullName = cleanString(body.fullName, 150);
    const email = cleanString(body.email, 200).toLowerCase();
    const phone = cleanString(body.phone, 40);
    const transferReference = cleanString(body.transferReference, 150);
    const message = cleanString(body.message, 2000);
  
    if (!Number.isFinite(amount) || amount < 100) {
      throw createError({
        statusCode: 400,
        statusMessage: "The minimum donation amount is ₦100.",
      });
    }
  
    if (!transferReference) {
      throw createError({
        statusCode: 400,
        statusMessage: "Please provide your bank transfer reference.",
      });
    }
  
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Please provide a valid email address.",
      });
    }
  
    if (fullName && fullName.length < 2) {
      throw createError({
        statusCode: 400,
        statusMessage: "Please provide a valid name.",
      });
    }
  
    try {
      await dbConnect();
  
      const reference = `CLEO-DON-${Date.now()}-${crypto
        .randomUUID()
        .slice(0, 8)
        .toUpperCase()}`;
  
      const donation = await Donation.create({
        reference,
  
        donor: {
          fullName: fullName || undefined,
          email: email || undefined,
          phone: phone || undefined,
        },
  
        amount,
        currency: "NGN",
  
        payment: {
          method: "bank-transfer",
          status: "transfer-reported",
          transferReference,
        },
  
        message: message || undefined,
        status: "awaiting-payment-verification",
      });
  
      // Email notification is intentionally non-blocking for the
      // donation record: an email failure must not undo a submission.
      try {
        await sendDonationNotification({
          reference: donation.reference,
          amount: donation.amount,
          currency: donation.currency,
          fullName: donation.donor?.fullName,
          email: donation.donor?.email,
          phone: donation.donor?.phone,
          transferReference: donation.payment.transferReference,
          message: donation.message,
          paymentStatus: donation.payment.status,
          status: donation.status,
          createdAt: donation.createdAt,
        });
      } catch (emailError) {
        console.error(
          "Failed to send donation notification email:",
          emailError,
        );
      }
  
      return {
        success: true,
        message:
          "Your donation has been submitted and is awaiting payment verification.",
        data: {
          id: donation._id,
          reference: donation.reference,
          amount: donation.amount,
          currency: donation.currency,
          status: donation.status,
          paymentStatus: donation.payment.status,
        },
      };
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "statusCode" in error
      ) {
        throw error;
      }
  
      console.error("Donation submission failed:", error);
  
      throw createError({
        statusCode: 500,
        statusMessage: "We could not process your donation. Please try again.",
      });
    }
});
  