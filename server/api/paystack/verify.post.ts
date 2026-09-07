const READINGS = {
    "birth-chart": 30_000,
    "vedic-consultation": 50_000,
    "deep-dive": 80_000,
    "ancestral-karmic": 95_000,
  } as const;
  
  export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
  
    const body = await readBody(event);
  
    const reference = String(body.reference || "");
    const readingId = String(body.readingId || "");
  
    if (!reference) {
      throw createError({
        statusCode: 400,
        statusMessage: "Payment reference is required.",
      });
    }
  
    const expectedPrice =
      READINGS[readingId as keyof typeof READINGS];
  
    if (!expectedPrice) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid reading.",
      });
    }
  
    const response = await $fetch<{
      status: boolean;
      message: string;
      data?: {
        status: string;
        reference: string;
        amount: number;
        currency: string;
        email: string;
        metadata?: {
          readingId?: string;
        };
      };
    }>(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(
        reference,
      )}`,
      {
        method: "GET",
  
        headers: {
          Authorization: `Bearer ${config.paystackSecretKey}`,
        },
      },
    );
  
    if (!response.status || !response.data) {
      throw createError({
        statusCode: 502,
        statusMessage: "Unable to verify payment with Paystack.",
      });
    }
  
    const transaction = response.data;
  
    const expectedAmount = expectedPrice * 100;
  
    /*
     * Never fulfill the booking solely because Paystack
     * returned a successful HTTP response.
     */
    if (transaction.status !== "success") {
      return {
        success: false,
        status: transaction.status,
        reference: transaction.reference,
      };
    }
  
    /*
     * Verify the amount.
     */
    if (transaction.amount !== expectedAmount) {
      console.error("Paystack amount mismatch", {
        reference,
        expectedAmount,
        receivedAmount: transaction.amount,
      });
  
      throw createError({
        statusCode: 400,
        statusMessage:
          "Payment amount does not match the selected reading.",
      });
    }
  
    /*
     * Verify the reading stored in Paystack metadata.
     */
    if (
      transaction.metadata?.readingId &&
      transaction.metadata.readingId !== readingId
    ) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "Payment reading does not match the selected reading.",
      });
    }
  
    /*
     * TODO:
     *
     * This is where you should create/update your booking
     * in MongoDB.
     *
     * Example:
     *
     * await Booking.create({
     *   reference: transaction.reference,
     *   readingId,
     *   email: transaction.email,
     *   amount: transaction.amount,
     *   currency: transaction.currency,
     *   status: "paid",
     *   ...
     * });
     */
  
    return {
      success: true,
      status: "success",
      reference: transaction.reference,
    };
  });