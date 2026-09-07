const NIGERIA_TIMEZONE = "Africa/Lagos";

export interface NigeriaDate {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  timezone: string;
}

export function getNigeriaDate(): NigeriaDate {
  const now = new Date();

  const parts = new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: NIGERIA_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
  ).formatToParts(now);

  const get = (type: string) =>
    parts.find(
      (part) => part.type === type,
    )?.value ?? "";

  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    hour: Number(get("hour")),
    minute: Number(get("minute")),
    timezone: NIGERIA_TIMEZONE,
  };
}