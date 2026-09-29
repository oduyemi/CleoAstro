import { createError, defineEventHandler, getQuery } from "h3";

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

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  if (!config.freeAstroApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "FreeAstroAPI key is not configured.",
    });
  }

  const latitude = Number(query.lat ?? LAGOS_LATITUDE);
  const longitude = Number(query.lon ?? LAGOS_LONGITUDE);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid latitude or longitude.",
    });
  }

  /*
   * ---------------------------------------------------------
   * Current timestamp
   * ---------------------------------------------------------
   */

  const now = new Date().toISOString();

  /*
   * ---------------------------------------------------------
   * 1. Moon Phase
   *
   * Used for:
   * - phase name
   * - illumination
   * - lunar age
   * - distance
   * - next major phases
   * ---------------------------------------------------------
   */

  const moonParams = new URLSearchParams({
    date: now,
    lat: String(latitude),
    lon: String(longitude),
    include_zodiac: "true",
    include_forecast: "true",
  });

  /*
   * ---------------------------------------------------------
   * 2. Sidereal Ephemeris
   *
   * Used for:
   * - exact Vedic Moon sign
   * - exact degree
   * - exact sidereal longitude
   * - Lahiri ayanamsha
   * ---------------------------------------------------------
   */

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
    const [moonPhase, ephemeris] = await Promise.all([
      $fetch<FreeAstroMoonPhaseResponse>(
        `https://api.freeastroapi.com/api/v1/moon/phase?${moonParams.toString()}`,
        {
          method: "GET",
          headers: {
            "x-api-key": config.freeAstroApiKey,
            Accept: "application/json",
          },
        }
      ),

      $fetch<EphemerisResponse>(
        `https://api.freeastroapi.com/api/v1/ephemeris?${ephemerisParams.toString()}`,
        {
          method: "GET",
          headers: {
            "x-api-key": config.freeAstroApiKey,
            Accept: "application/json",
          },
        }
      ),
    ]);

    const siderealMoon = ephemeris.data.bodies.Moon;

    if (!siderealMoon) {
      throw createError({
        statusCode: 502,
        statusMessage:
          "FreeAstroAPI did not return a Moon position.",
      });
    }

    /*
     * ---------------------------------------------------------
     * Return one clean application-level object.
     * ---------------------------------------------------------
     */

    return {
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
        /*
         * Astronomical phase information
         */
        phase: moonPhase.phase,

        next_phases: moonPhase.next_phases,

        /*
         * Vedic / sidereal position
         */
        zodiac: {
          sign: siderealMoon.sign,
          sign_id: siderealMoon.sign_id,

          /*
           * Degree within the sidereal sign.
           *
           * Example:
           * 14.305°
           */
          degree: siderealMoon.degree_in_sign,

          /*
           * Full absolute sidereal longitude.
           *
           * Example:
           * 104.305°
           */
          longitude: siderealMoon.longitude_deg,

          zodiac_type: "sidereal",
          ayanamsha: "lahiri",

          position: siderealMoon.position_text,
        },

        /*
         * Movement information
         */
        movement: {
          speed: siderealMoon.speed,
          motion_state: siderealMoon.motion_state,
          retrograde: siderealMoon.retrograde,
          stationary: siderealMoon.is_stationary,
        },

        /*
         * Astronomical coordinates
         */
        latitude: siderealMoon.latitude_deg,

        distance_au: siderealMoon.distance_au,
      },

      metadata: {
        zodiac_system: "Vedic / Sidereal",
        ayanamsha: "Lahiri",
        source: "FreeAstroAPI",
        calculated_at: new Date().toISOString(),
      },
    };
  } catch (error: any) {
    console.error(
      "FreeAstroAPI lunar calculation error:",
      error
    );

    throw createError({
      statusCode: error?.statusCode || 502,
      statusMessage:
        error?.data?.message ||
        error?.message ||
        "Unable to calculate the current lunar position.",
    });
  }
});