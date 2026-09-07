export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
  
    const query = getQuery(event);
  
    const reference = String(query.reference || "");
  
    if (!reference) {
      return sendRedirect(
        event,
        "/?payment=missing-reference",
        302,
      );
    }
  
    try {
      const response = await $fetch<{
        status: boolean;
        data?: {
          status: string;
          reference: string;
        };
      }>(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(
          reference,
        )}`,
        {
          headers: {
            Authorization: `Bearer ${config.paystackSecretKey}`,
          },
        },
      );
  
      if (
        response.status &&
        response.data?.status === "success"
      ) {
        return sendRedirect(
          event,
          `/booking/confirmation?reference=${encodeURIComponent(
            response.data.reference,
          )}`,
          302,
        );
      }
  
      return sendRedirect(
        event,
        `/booking/confirmation?status=failed&reference=${encodeURIComponent(
          reference,
        )}`,
        302,
      );
    } catch (error) {
      console.error("Paystack callback verification failed:", error);
  
      return sendRedirect(
        event,
        `/booking/confirmation?status=verification-error&reference=${encodeURIComponent(
          reference,
        )}`,
        302,
      );
    }
  });