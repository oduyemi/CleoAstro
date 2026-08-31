import type { HoroscopeType } from "~/shared/constants/horoscope";



export const useHoroscope = () => {
  const getHoroscope = async (
    type: HoroscopeType,
    zodiacSlug?: string,
  ) => {
    return await $fetch("/api/horoscopes", {
      query: {
        type,
        zodiac: zodiacSlug,
      },
    });
  };

  return {
    getHoroscope,
  };
};