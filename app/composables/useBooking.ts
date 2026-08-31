export const useBooking = () => {
  const createBooking = async (payload: Record<string, unknown>) => {
    return await $fetch("/api/bookings", {
      method: "POST",
      body: payload,
    });
  };

  return {
    createBooking,
  };
};