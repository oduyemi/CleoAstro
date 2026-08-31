export const HOROSCOPE_TYPES = {
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
} as const;

export type HoroscopeType =
  (typeof HOROSCOPE_TYPES)[keyof typeof HOROSCOPE_TYPES];