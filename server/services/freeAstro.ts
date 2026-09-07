import { $fetch } from "ofetch";

const FREE_ASTRO_API_URL =
  "https://api.freeastroapi.com";

const LEGACY_ASTRO_API_URL =
  "https://json.freeastrologyapi.com";

const FREE_ASTRO_API_KEY =
  process.env.FREE_ASTRO_API_KEY?.trim();

export type VedicPeriod =
  | "daily"
  | "weekly"
  | "monthly";

export interface HoroscopeChartRequest {
  year: number;
  month: number;
  date: number;
  hours: number;
  minutes: number;
  seconds: number;
  latitude: number;
  longitude: number;
  timezone: number;
  observation_point:
    | "topocentric"
    | "geocentric";
  language: "en" | "te";
}

/**
 * Public/current Vedic sky context.
 *
 * IMPORTANT:
 * This is deliberately NOT a birth chart.
 */
export interface VedicSkyContext {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;

  lat: number;
  lng: number;

  tz_str: string;

  ayanamsha?: "lahiri";

  house_system?: "whole_sign";

  node_type?: "mean" | "true";
}

export interface VedicPanchang {
  date?: string;

  location?: {
    lat?: number;
    lng?: number;
  };

  sunrise?: string;
  sunset?: string;

  weekday?: {
    number?: number;
    name?: string;
  };

  lunar_month?: {
    name?: string;
    amanta?: boolean;
    vikram_samvat?: number;
  };

  tithi?: {
    number?: number;
    name?: string;
    ends_at?: string;
    ends_at_iso?: string;
    paksha?: string;
  };

  nakshatra?: {
    number?: number;
    name?: string;
    ends_at?: string;
    ends_at_iso?: string;
    pada?: number;
    lord?: string;
  };

  yoga?: {
    number?: number;
    name?: string;
    ends_at?: string;
    ends_at_iso?: string;
  };

  karanas?: Array<{
    number?: number;
    name?: string;
    ends_at?: string;
    ends_at_iso?: string;
  }>;

  rahu_kalam?: {
    start?: string;
    end?: string;
  };

  request_time_panchang?: {
    tithi?: {
      number?: number;
      name?: string;
      paksha?: string;
    };

    nakshatra?: {
      number?: number;
      name?: string;
      pada?: number;
      lord?: string;
    };

    yoga?: {
      number?: number;
      name?: string;
    };

    karana?: {
      number?: number;
      name?: string;
    };

    sun_sign?: {
      sign_id?: number;
      name?: string;
      degree?: number;
    };

    moon_sign?: {
      sign_id?: number;
      name?: string;
      degree?: number;
    };
  };

  metadata?: {
    endpoint_version?: string;
    ruleset_version?: string;
    ayanamsha?: string;
    timezone_used?: string;
    calculation_basis?: string;
    request_local_time?: string;
  };
}

function getHeaders() {
  if (!FREE_ASTRO_API_KEY) {
    throw new Error(
      "FREE_ASTRO_API_KEY is not configured.",
    );
  }

  return {
    "Content-Type": "application/json",
    "x-api-key": FREE_ASTRO_API_KEY,
  };
}

function logApiKeyStatus() {
  console.log(
    "[Vedic] API key configured:",
    Boolean(FREE_ASTRO_API_KEY),
  );

  console.log(
    "[Vedic] API key length:",
    FREE_ASTRO_API_KEY?.length ?? 0,
  );

  console.log(
    "[Vedic] API key prefix:",
    FREE_ASTRO_API_KEY
      ? `${FREE_ASTRO_API_KEY.slice(0, 4)}...`
      : "MISSING",
  );
}

/**
 * Legacy horoscope chart endpoint.
 *
 * Kept because it may still be used elsewhere
 * in the application.
 */
export async function getHoroscopeChart(
  payload: HoroscopeChartRequest,
) {
  logApiKeyStatus();

  return await $fetch(
    `${LEGACY_ASTRO_API_URL}/horoscope-chart-svg-code`,
    {
      method: "POST",
      headers: getHeaders(),
      body: payload,
    },
  );
}

/**
 * Public Vedic Panchang.
 *
 * This does NOT require a person's birth information.
 *
 * It describes the Vedic calendar / sky context
 * for a specific date, time and location.
 */
export async function getVedicPanchang(
  context: VedicSkyContext,
): Promise<VedicPanchang> {
  logApiKeyStatus();

  const endpoint =
    `${FREE_ASTRO_API_URL}/api/v2/vedic/panchang`;

  console.log(
    "[Vedic] Calling Vedic Panchang:",
    endpoint,
  );

  const response =
  await $fetch<VedicPanchang>(
    endpoint,
    {
      method: "POST",

      headers: getHeaders(),

      body: {
        year: context.year,
        month: context.month,
        day: context.day,
        hour: context.hour,
        minute: context.minute,

        lat: context.lat,
        lng: context.lng,

        tz_str: context.tz_str,

        ayanamsha:
          context.ayanamsha ??
          "lahiri",

        house_system:
          context.house_system ??
          "whole_sign",

        node_type:
          context.node_type ??
          "mean",
      },
    },
  );

console.log(
  "[Vedic] Panchang response received:",
  response,
);

return response;
}

/**
 * Personal Vedic horoscope.
 *
 * KEEP THIS SEPARATE from the public forecast.
 *
 * This endpoint requires actual birth information.
 */
export interface VedicBirthContext {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;

  lat: number;
  lng: number;

  tz_str: string;

  ayanamsha: "lahiri";

  house_system?: "whole_sign";

  node_type?: "mean" | "true";

  target_date?: string;

  include_evidence?: boolean;

  include_raw_facts?: boolean;

  include_interpretation_blocks?: boolean;
}

export async function getDailyPersonalHoroscope(
  birthContext: VedicBirthContext,
) {
  logApiKeyStatus();

  const endpoint =
    `${FREE_ASTRO_API_URL}/api/v2/vedic/horoscope/daily/personal`;

  console.log(
    "[Vedic] Calling Personal Daily Horoscope:",
    endpoint,
  );

  return await $fetch(
    endpoint,
    {
      method: "POST",

      headers: getHeaders(),

      body: {
        ...birthContext,

        house_system:
          birthContext.house_system ??
          "whole_sign",

        node_type:
          birthContext.node_type ??
          "mean",

        include_evidence:
          birthContext.include_evidence ??
          true,

        include_raw_facts:
          birthContext.include_raw_facts ??
          false,

        include_interpretation_blocks:
          birthContext.include_interpretation_blocks ??
          true,
      },
    },
  );
}

/**
 * Public forecast periods.
 *
 * We intentionally do NOT call the personal
 * horoscope endpoint here.
 *
 * The public forecast is based on current
 * Panchang / Vedic sky context.
 */
export async function getPublicVedicForecast(
  period: VedicPeriod,
  context: VedicSkyContext,
) {
  switch (period) {
    case "daily": {
      return await getVedicPanchang(
        context,
      );
    }

    case "weekly": {
      const dates =
        buildDateSequence(
          context.year,
          context.month,
          context.day,
          7,
        );

      const results =
        await Promise.all(
          dates.map((date) =>
            getVedicPanchang({
              ...context,
              ...date,
            }),
          ),
        );

      return {
        period,
        days: results,
      };
    }

    case "monthly": {
      const dates =
        buildMonthlySamplingDates(
          context.year,
          context.month,
          context.day,
        );

      const results =
        await Promise.all(
          dates.map((date) =>
            getVedicPanchang({
              ...context,
              ...date,
            }),
          ),
        );

      return {
        period,
        days: results,
      };
    }

    default:
      throw new Error(
        `Unsupported Vedic period: ${period}`,
      );
  }
}

/**
 * Create YYYY-MM-DD-safe date parts without
 * relying on the server's timezone.
 */
function buildDateSequence(
  year: number,
  month: number,
  day: number,
  count: number,
) {
  const result: Array<{
    year: number;
    month: number;
    day: number;
  }> = [];

  const base =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day,
      ),
    );

  for (
    let index = 0;
    index < count;
    index++
  ) {
    const current =
      new Date(base);

    current.setUTCDate(
      base.getUTCDate() + index,
    );

    result.push({
      year:
        current.getUTCFullYear(),

      month:
        current.getUTCMonth() + 1,

      day:
        current.getUTCDate(),
    });
  }

  return result;
}

/**
 * Sample the month instead of requesting
 * every single day.
 *
 * This gives us representative Panchang
 * context for a monthly public reading while
 * avoiding unnecessary API calls.
 */
function buildMonthlySamplingDates(
  year: number,
  month: number,
  currentDay: number,
) {
  const daysInMonth =
    new Date(
      Date.UTC(
        year,
        month,
        0,
      ),
    ).getUTCDate();

  const requestedDays =
    Array.from(
      new Set([
        Math.min(
          Math.max(currentDay, 1),
          daysInMonth,
        ),

        1,

        Math.min(8, daysInMonth),

        Math.min(15, daysInMonth),

        Math.min(22, daysInMonth),

        daysInMonth,
      ]),
    ).sort(
      (a, b) => a - b,
    );

  return requestedDays.map(
    (day) => ({
      year,
      month,
      day,
    }),
  );
}