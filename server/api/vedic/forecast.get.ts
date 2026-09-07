import {
  createError,
  defineEventHandler,
  getQuery,
} from "h3";

import {
  getPublicVedicForecast,
  type VedicPeriod,
  type VedicSkyContext,
} from "../../services/freeAstro";

import {
  getNigeriaDate,
} from "../../utils/nigeriaTime";

type ForecastSection = {
  relationships: string;
  purpose: string;
  innerLife: string;
};

type NormalizedForecast = {
  period: VedicPeriod;

  label: string;

  theme: string;

  summary: string;

  cosmicInfluence?: {
    title: string;
    description: string;
  };

  sections: ForecastSection;

  guidance?: string;

  panchang?: {
    tithi?: string;
    nakshatra?: string;
    yoga?: string;
    karana?: string;
    sunSign?: string;
    moonSign?: string;
    sunrise?: string;
    sunset?: string;
    rahuKalam?: string;
  };

  meta?: {
    source: string;
    location: string;
    timezone: string;
    generatedFor: string;
  };
};

export default defineEventHandler(
  async (event) => {
    const query =
      getQuery(event);

    const requestedPeriod =
      String(
        query.period ||
          "daily",
      ).toLowerCase();

    if (
      ![
        "daily",
        "weekly",
        "monthly",
      ].includes(
        requestedPeriod,
      )
    ) {
      throw createError({
        statusCode: 400,

        statusMessage:
          "Period must be daily, weekly, or monthly.",
      });
    }

    const period =
      requestedPeriod as VedicPeriod;

    const nigeriaDate =
      getNigeriaDate();

    /**
     * Public location context.
     *
     * Lagos is used as the application's
     * reference location because the public
     * astrology experience is designed around
     * Nigeria/Africa-Lagos.
     *
     * These are NOT birth coordinates.
     */
    const skyContext: VedicSkyContext = {
      year:
        nigeriaDate.year,

      month:
        nigeriaDate.month,

      day:
        nigeriaDate.day,

      hour:
        nigeriaDate.hour ?? 12,

      minute:
        nigeriaDate.minute ?? 0,

      lat:
        Number(
          process.env.VEDIC_LOCATION_LAT ??
            "6.5244",
        ),

      lng:
        Number(
          process.env.VEDIC_LOCATION_LNG ??
            "3.3792",
        ),

      tz_str:
        "Africa/Lagos",

      ayanamsha:
        "lahiri",

      house_system:
        "whole_sign",

      node_type:
        "mean",
    };

    try {
      console.log(
        `[Vedic] Fetching ${period} public forecast`,
      );

      console.log(
        `[Vedic] Nigeria date: ${
          nigeriaDate.year
        }-${
          String(
            nigeriaDate.month,
          ).padStart(2, "0")
        }-${
          String(
            nigeriaDate.day,
          ).padStart(2, "0")
        }`,
      );

      console.log(
        "[Vedic] Public sky context:",
        {
          location:
            "Lagos, Nigeria",

          timezone:
            skyContext.tz_str,

          latitude:
            skyContext.lat,

          longitude:
            skyContext.lng,
        },
      );

      const rawData =
        await getPublicVedicForecast(
          period,
          skyContext,
        );

      const data =
        normalizeForecast(
          period,
          rawData,
          nigeriaDate,
        );

      return {
        success: true,

        provider:
          "FreeAstroAPI",

        period,

        location: {
          country:
            "Nigeria",

          city:
            "Lagos",

          timezone:
            "Africa/Lagos",

          latitude:
            skyContext.lat,

          longitude:
            skyContext.lng,
        },

        date:
          nigeriaDate,

        data,
      };
    } catch (error: any) {
      const apiError =
        error?.response?._data ??
        error?.data ??
        error;

      console.error(
        "[Vedic] FreeAstroAPI error:",
        apiError,
      );

      throw createError({
        statusCode:
          error?.response?.status ||
          error?.statusCode ||
          500,

        statusMessage:
          extractApiErrorMessage(
            apiError,
          ) ||
          error?.message ||
          "Unable to retrieve the public Vedic forecast.",

        data:
          apiError,
      });
    }
  },
);

/* -------------------------------------------------------------------------- */
/* Normalization                                                              */
/* -------------------------------------------------------------------------- */

function normalizeForecast(
  period: VedicPeriod,
  rawData: any,
  nigeriaDate: any,
): NormalizedForecast {
  if (period === "daily") {
    return normalizeDailyForecast(
      rawData,
      nigeriaDate,
    );
  }

  if (period === "weekly") {
    return normalizeWeeklyForecast(
      rawData,
      nigeriaDate,
    );
  }

  return normalizeMonthlyForecast(
    rawData,
    nigeriaDate,
  );
}

/* -------------------------------------------------------------------------- */
/* Daily                                                                       */
/* -------------------------------------------------------------------------- */

function normalizeDailyForecast(
  panchang: any,
  nigeriaDate: any,
): NormalizedForecast {
  const active =
    panchang?.request_time_panchang ??
    {};

  const tithi =
    active?.tithi?.name ??
    panchang?.tithi?.name ??
    "The day's lunar rhythm";

  const nakshatra =
    active?.nakshatra?.name ??
    panchang?.nakshatra?.name ??
    "The current Nakshatra";

  const yoga =
    active?.yoga?.name ??
    panchang?.yoga?.name ??
    "The day's Yoga";

  const karana =
    active?.karana?.name ??
    panchang?.karanas?.[0]?.name ??
    "The day's Karana";

  const sunSign =
    active?.sun_sign?.name ??
    "the Sun";

  const moonSign =
    active?.moon_sign?.name ??
    "the Moon";

  const theme =
    buildDailyTheme({
      tithi,
      nakshatra,
      yoga,
      moonSign,
    });

  return {
    period: "daily",

    label:
      "Today's Vedic Sky",

    theme,

    summary:
      buildDailySummary({
        tithi,
        nakshatra,
        yoga,
        sunSign,
        moonSign,
      }),

    cosmicInfluence: {
      title:
        `${moonSign} Moon · ${nakshatra}`,

      description:
        `The Moon is moving through ${nakshatra}, while the Panchang carries a ${yoga} quality. Use today's atmosphere as an invitation to notice what is becoming clearer rather than forcing an immediate answer.`,
    },

    sections: {
      relationships:
        buildRelationshipGuidance(
          moonSign,
          nakshatra,
        ),

      purpose:
        buildPurposeGuidance(
          tithi,
          yoga,
        ),

      innerLife:
        buildInnerLifeGuidance(
          nakshatra,
          moonSign,
        ),
    },

    guidance:
      `Today's reflection: ${buildGuidance(
        tithi,
        nakshatra,
        yoga,
      )}`,

    panchang: {
      tithi,
      nakshatra,
      yoga,
      karana,

      sunSign,

      moonSign,

      sunrise:
        panchang?.sunrise,

      sunset:
        panchang?.sunset,

      rahuKalam:
        formatRahuKalam(
          panchang?.rahu_kalam,
        ),
    },

    meta: {
      source:
        "FreeAstroAPI Vedic Panchang",

      location:
        "Lagos, Nigeria",

      timezone:
        "Africa/Lagos",

      generatedFor:
        formatDate(
          nigeriaDate,
        ),
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Weekly                                                                      */
/* -------------------------------------------------------------------------- */

function normalizeWeeklyForecast(
  rawData: {
    period: "weekly";
    days: any[];
  },
  nigeriaDate: any,
): NormalizedForecast {
  const days =
    Array.isArray(
      rawData?.days,
    )
      ? rawData.days
      : [];

  const first =
    days[0] ?? {};

  const active =
    first?.request_time_panchang ??
    {};

  const dominantNakshatra =
    findMostCommon(
      days.map(
        (day) =>
          day?.request_time_panchang
            ?.nakshatra
            ?.name ??
          day?.nakshatra?.name,
      ),
    ) ??
    "the changing Nakshatra";

  const dominantYoga =
    findMostCommon(
      days.map(
        (day) =>
          day?.request_time_panchang
            ?.yoga
            ?.name ??
          day?.yoga?.name,
      ),
    ) ??
    "the week's changing Yoga";

  const moonSigns =
    uniqueStrings(
      days.map(
        (day) =>
          day?.request_time_panchang
            ?.moon_sign
            ?.name,
      ),
    );

  return {
    period: "weekly",

    label:
      "This Week's Vedic Sky",

    theme:
      "A week for observing movement before deciding what deserves your energy.",

    summary:
      `The week moves through changing lunar and Panchang influences. The strongest recurring Nakshatra pattern is ${dominantNakshatra}, while ${dominantYoga} appears as a recurring Yoga influence. Rather than treating the week as a fixed prediction, use it as a rhythm for reflection, attention and conscious choices.`,

    cosmicInfluence: {
      title:
        `${dominantNakshatra} · ${dominantYoga}`,

      description:
        `The Moon's movement keeps the emotional atmosphere changing throughout the week. The sampled sky moves through ${moonSigns.join(
          ", ",
        ) || "several lunar signs"}, making flexibility more useful than trying to hold one emotional position all week.`,
    },

    sections: {
      relationships:
        "Give relationships room to breathe. Notice where a conversation needs presence rather than a quick solution, and let changing emotions reveal what actually matters.",

      purpose:
        "Choose a few meaningful priorities instead of scattering your attention. The week's changing rhythm supports steady progress when you remain responsive rather than rigid.",

      innerLife:
        `Pay attention to recurring thoughts, moods and intuitive nudges. The ${dominantNakshatra} influence invites observation before reaction.`,
    },

    guidance:
      "Let the week unfold in stages. You do not need to understand the entire path before taking the next honest step.",

    panchang: {
      tithi:
        active?.tithi?.name,

      nakshatra:
        dominantNakshatra,

      yoga:
        dominantYoga,

      moonSign:
        moonSigns.join(
          " → ",
        ),

      sunSign:
        active?.sun_sign?.name,
    },

    meta: {
      source:
        "FreeAstroAPI Vedic Panchang",

      location:
        "Lagos, Nigeria",

      timezone:
        "Africa/Lagos",

      generatedFor:
        formatDate(
          nigeriaDate,
        ),
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Monthly                                                                     */
/* -------------------------------------------------------------------------- */

function normalizeMonthlyForecast(
  rawData: {
    period: "monthly";
    days: any[];
  },
  nigeriaDate: any,
): NormalizedForecast {
  const days =
    Array.isArray(
      rawData?.days,
    )
      ? rawData.days
      : [];

  const nakshatras =
    uniqueStrings(
      days.map(
        (day) =>
          day?.request_time_panchang
            ?.nakshatra
            ?.name ??
          day?.nakshatra?.name,
      ),
    );

  const yogas =
    uniqueStrings(
      days.map(
        (day) =>
          day?.request_time_panchang
            ?.yoga
            ?.name ??
          day?.yoga?.name,
      ),
    );

  const moonSigns =
    uniqueStrings(
      days.map(
        (day) =>
          day?.request_time_panchang
            ?.moon_sign
            ?.name,
      ),
    );

  const first =
    days[0] ?? {};

  const active =
    first?.request_time_panchang ??
    {};

  return {
    period: "monthly",

    label:
      "This Month's Vedic Sky",

    theme:
      "A month for noticing the larger pattern beneath the smaller moments.",

    summary:
      `The month carries a changing lunar rhythm across ${moonSigns.length || "several"} Moon-sign phases, with multiple Nakshatra and Yoga influences unfolding along the way. Rather than predicting one fixed outcome, this reading highlights the broader invitation to stay aware of what repeatedly asks for your attention.`,

    cosmicInfluence: {
      title:
        "The larger rhythm",

      description:
        `Across the month's sampled Panchang points, the Moon moves through ${moonSigns.slice(
          0,
          4,
        ).join(
          ", ",
        ) || "changing signs"}. The changing Nakshatra field includes ${nakshatras.slice(
          0,
          4,
        ).join(
          ", ",
        ) || "several lunar mansions"}.`,
    },

    sections: {
      relationships:
        "Relationships benefit from patience and honest observation this month. Notice recurring dynamics without immediately labelling them; patterns become easier to work with once they are seen clearly.",

      purpose:
        "Think in terms of direction rather than urgency. Return to the commitments that remain meaningful even when circumstances change.",

      innerLife:
        "Create space for reflection. Journaling, meditation, prayer or quiet time can help separate a passing emotion from a deeper inner knowing.", 
    },

    guidance:
      "Do not rush to name the lesson. Sometimes the pattern becomes visible only after you have allowed it enough space to unfold.",

    panchang: {
      tithi:
        active?.tithi?.name,

      nakshatra:
        nakshatras.join(
          " · ",
        ),

      yoga:
        yogas.join(
          " · ",
        ),

      moonSign:
        moonSigns.join(
          " → ",
        ),

      sunSign:
        active?.sun_sign?.name,
    },

    meta: {
      source:
        "FreeAstroAPI Vedic Panchang",

      location:
        "Lagos, Nigeria",

      timezone:
        "Africa/Lagos",

      generatedFor:
        formatDate(
          nigeriaDate,
        ),
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Interpretation helpers                                                     */
/* -------------------------------------------------------------------------- */

function buildDailyTheme({
  tithi,
  nakshatra,
  yoga,
  moonSign,
}: {
  tithi: string;
  nakshatra: string;
  yoga: string;
  moonSign: string;
}) {
  const normalizedYoga =
    yoga.toLowerCase();

  if (
    normalizedYoga.includes(
      "siddhi",
    )
  ) {
    return "A day for focused progress, completion and purposeful movement.";
  }

  if (
    normalizedYoga.includes(
      "shubha",
    ) ||
    normalizedYoga.includes(
      "saubhagya",
    )
  ) {
    return "A gentler atmosphere for connection, clarity and constructive choices.";
  }

  if (
    normalizedYoga.includes(
      "dhruva",
    )
  ) {
    return "A steady day for grounding yourself and strengthening what already matters.";
  }

  return `The ${moonSign} Moon invites you to work with today's ${nakshatra} rhythm rather than against it.`;
}

function buildDailySummary({
  tithi,
  nakshatra,
  yoga,
  sunSign,
  moonSign,
}: {
  tithi: string;
  nakshatra: string;
  yoga: string;
  sunSign: string;
  moonSign: string;
}) {
  return `Today's Vedic sky carries a ${tithi} lunar tone, with the Moon in ${moonSign} and the Nakshatra ${nakshatra}. The Sun is in ${sunSign}, while ${yoga} shapes the day's broader quality. This is a moment to notice where your attention naturally wants to go — and where you may be pushing too hard.`;
}

function buildRelationshipGuidance(
  moonSign: string,
  nakshatra: string,
) {
  return `With the Moon in ${moonSign} and the ${nakshatra} influence active, emotional responses may reveal more than words alone. Listen carefully, leave room for another person's perspective, and choose connection over winning the moment.`;
}

function buildPurposeGuidance(
  tithi: string,
  yoga: string,
) {
  return `The ${tithi} lunar phase and ${yoga} Yoga favour conscious action. Focus on one thing that genuinely matters today and give it enough attention to move forward without forcing the outcome.`;
}

function buildInnerLifeGuidance(
  nakshatra: string,
  moonSign: string,
) {
  return `The ${nakshatra} Nakshatra can be used as a mirror for reflection while the ${moonSign} Moon brings attention to emotional patterns. Notice what keeps returning to your awareness.`;
}

function buildGuidance(
  tithi: string,
  nakshatra: string,
  yoga: string,
) {
  return `let the ${tithi} rhythm slow you down enough to notice the ${nakshatra} pattern, then allow ${yoga} to remind you that clarity does not always require immediate action.`;
}

/* -------------------------------------------------------------------------- */
/* Utilities                                                                   */
/* -------------------------------------------------------------------------- */

function findMostCommon(
  values: Array<
    string | undefined | null
  >,
) {
  const counts =
    new Map<
      string,
      number
    >();

  for (const value of values) {
    if (!value) continue;

    counts.set(
      value,
      (counts.get(value) ?? 0) + 1,
    );
  }

  let winner:
    | string
    | undefined;

  let highest = 0;

  for (
    const [
      value,
      count,
    ] of counts
  ) {
    if (count > highest) {
      highest = count;
      winner = value;
    }
  }

  return winner;
}

function uniqueStrings(
  values: Array<
    string | undefined | null
  >,
) {
  return Array.from(
    new Set(
      values.filter(
        (
          value,
        ): value is string =>
          Boolean(value),
      ),
    ),
  );
}

function formatRahuKalam(
  value: any,
) {
  if (!value) {
    return undefined;
  }

  if (
    value.start &&
    value.end
  ) {
    return `${value.start} – ${value.end}`;
  }

  return undefined;
}

function formatDate(value: any): string {
  if (
    value &&
    typeof value === "object" &&
    value.year &&
    value.month &&
    value.day
  ) {
    return `${value.year}-${String(
      value.month,
    ).padStart(
      2,
      "0",
    )}-${String(
      value.day,
    ).padStart(
      2,
      "0",
    )}`;
  }

  return new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "Africa/Lagos",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    },
  ).format(new Date());
}

function extractApiErrorMessage(
  error: any,
): string | undefined {
  if (
    typeof error ===
    "string"
  ) {
    return error;
  }

  if (
    typeof error?.message ===
    "string"
  ) {
    return error.message;
  }

  if (
    Array.isArray(
      error?.detail,
    )
  ) {
    return error.detail
      .map(
        (item: any) =>
          item?.msg,
      )
      .filter(Boolean)
      .join("; ");
  }

  if (
    typeof error?.detail ===
    "string"
  ) {
    return error.detail;
  }

  return undefined;
}