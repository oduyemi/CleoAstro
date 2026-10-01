import {
  createError,
  defineEventHandler,
  getQuery,
} from "h3";

interface FreeAstroMoonPhase {
  name: string;
  phase_angle_deg: number;
  illumination: number;
  age_days: number;
  distance_km: number;
  is_waxing: boolean;
}

interface FreeAstroZodiac {
  sign: string;
  sign_id: string;
  degree: number;
  zodiac_type: string;
}

interface FreeAstroNextPhases {
  new_moon?: string;
  first_quarter?: string;
  full_moon?: string;
  last_quarter?: string;
}

interface FreeAstroMoonPhaseResponse {
  timestamp: string;
  phase: FreeAstroMoonPhase;
  zodiac?: FreeAstroZodiac;
  next_phases?: FreeAstroNextPhases;
}

interface EphemerisMoon {
  id: string;
  name: string;
  sign: string;
  sign_abbr: string;
  sign_id: string;
  pos: number;
  abs_pos: number;
  retrograde: boolean;
  speed: number;
  is_stationary: boolean;
  latitude_deg: number;
  distance_au: number;
  position_text: string;
  degree_in_sign: number;
  longitude_deg: number;
  declination_deg: number;
  motion_state: string;
}

interface EphemerisResponse {
  meta: {
    start: string;
    end: string | null;
    step: string | null;
    rows: number;
    bodies: string[];
    format: string;
    zodiac_type: string;
    sidereal_ayanamsa: string | null;
    timezone: string;
  };

  data: {
    timestamp: string;
    local_timestamp: string;

    subject: {
      datetime: string;

      location: {
        city: string | null;
        lat: number | null;
        lng: number | null;
        timezone: string;
      };

      settings: {
        zodiac_type: string;
        house_system: string;
      };
    };

    bodies: {
      Moon?: EphemerisMoon;
    };
  };
}

const LAGOS_LATITUDE = 6.5244;
const LAGOS_LONGITUDE = 3.3792;
const LAGOS_TIMEZONE = "Africa/Lagos";

/*
 * Keep the external API result in server memory.
 *
 * This prevents every browser request from immediately
 * becoming another FreeAstroAPI request.
 */
let moonCache:
  | {
      expiresAt: number;
      data: unknown;
    }
  | null = null;

/*
 * Five minutes is more than enough for this UI.
 *
 * The Moon moves continuously, but recalculating the
 * entire lunar dataset every few seconds is unnecessary.
 */
const CACHE_TTL = 5 * 60 * 1000;

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  if (!config.freeAstroApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage:
        "FreeAstroAPI key is not configured.",
    });
  }

  const latitude = Number(
    query.lat ?? LAGOS_LATITUDE,
  );

  const longitude = Number(
    query.lon ?? LAGOS_LONGITUDE,
  );

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Invalid latitude or longitude.",
    });
  }

  /*
   * ---------------------------------------------------------
   * CACHE
   * ---------------------------------------------------------
   */

  const nowMs = Date.now();

  if (
    moonCache &&
    moonCache.expiresAt > nowMs
  ) {
    return moonCache.data;
  }

  /*
   * ---------------------------------------------------------
   * CURRENT TIMESTAMP
   * ---------------------------------------------------------
   */

  const now = new Date().toISOString();

  /*
   * ---------------------------------------------------------
   * API PARAMETERS
   * ---------------------------------------------------------
   */

  const moonParams = new URLSearchParams({
    date: now,
    lat: String(latitude),
    lon: String(longitude),
    include_zodiac: "true",
    include_forecast: "true",
  });

  const ephemerisParams = new URLSearchParams({
    start: now,
    lat: String(latitude),
    lng: String(longitude),
    tz_str: LAGOS_TIMEZONE,
    bodies: "Moon",
    zodiac_type: "sidereal",
    sidereal_ayanamsa: "lahiri",
    format: "json",
  });

  try {
    /*
     * -------------------------------------------------------
     * FETCH MOON PHASE
     * -------------------------------------------------------
     *
     * Do this separately instead of Promise.all().
     *
     * This gives us much better control over rate limiting
     * and makes it possible to handle a 429 cleanly.
     */

    const moonPhase =
      await $fetch<FreeAstroMoonPhaseResponse>(
        `https://api.freeastroapi.com/api/v1/moon/phase?${moonParams.toString()}`,
        {
          method: "GET",
          headers: {
            "x-api-key": config.freeAstroApiKey,
            Accept: "application/json",
          },
        },
      );

    /*
     * -------------------------------------------------------
     * FETCH SIDEREAL EPHEMERIS
     * -------------------------------------------------------
     */

    const ephemeris =
      await $fetch<EphemerisResponse>(
        `https://api.freeastroapi.com/api/v1/ephemeris?${ephemerisParams.toString()}`,
        {
          method: "GET",
          headers: {
            "x-api-key": config.freeAstroApiKey,
            Accept: "application/json",
          },
        },
      );

    const siderealMoon =
      ephemeris.data.bodies.Moon;

    if (!siderealMoon) {
      throw createError({
        statusCode: 502,
        statusMessage:
          "FreeAstroAPI did not return a Moon position.",
      });
    }
    const response = {
      success: true,

      timestamp: moonPhase.timestamp,

      location: {
        name: "Lagos",
        country: "Nigeria",
        latitude,
        longitude,
        timezone: LAGOS_TIMEZONE,
      },

      moon: {
        phase: moonPhase.phase,

        next_phases:
          moonPhase.next_phases,

        zodiac: {
          sign: siderealMoon.sign,
          sign_id: siderealMoon.sign_id,
          degree:
            siderealMoon.degree_in_sign,
          longitude:
            siderealMoon.longitude_deg,
          zodiac_type: "sidereal",
          ayanamsha: "lahiri",
          position:
            siderealMoon.position_text,
        },

        movement: {
          speed: siderealMoon.speed,
          motion_state:
            siderealMoon.motion_state,
          retrograde:
            siderealMoon.retrograde,
          stationary:
            siderealMoon.is_stationary,
        },

        latitude:
          siderealMoon.latitude_deg,

        distance_au:
          siderealMoon.distance_au,
      },

      metadata: {
        zodiac_system:
          "Vedic / Sidereal",
        ayanamsha: "Lahiri",
        source: "FreeAstroAPI",
        calculated_at:
          new Date().toISOString(),
      },
    };

    /*
     * -------------------------------------------------------
     * STORE CACHE
     * -------------------------------------------------------
     */

    moonCache = {
      expiresAt:
        Date.now() + CACHE_TTL,

      data: response,
    };

    return response;
  } catch (error: any) {
    console.error(
      "FreeAstroAPI lunar calculation error:",
      error,
    );

    /*
     * Explicitly identify rate limiting.
     */

    const statusCode =
      error?.statusCode ??
      error?.status ??
      502;

    if (statusCode === 429) {
      throw createError({
        statusCode: 429,
        statusMessage:
          "Lunar data is temporarily rate limited. Please try again shortly.",
      });
    }

    throw createError({
      statusCode,
      statusMessage:
        error?.data?.message ||
        error?.message ||
        "Unable to calculate the current lunar position.",
    });
  }
});