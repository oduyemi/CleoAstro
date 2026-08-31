export const usePayment = () => {
  const initializePayment = async (
    payload: Record<string, unknown>,
  ) => {
    return await $fetch("/api/payments/initialize", {
      method: "POST",
      body: payload,
    });
  };

  const verifyPayment = async (reference: string) => {
    return await $fetch(
      `/api/payments/verify/${reference}`,
    );
  };

  return {
    initializePayment,
    verifyPayment,
  };
};