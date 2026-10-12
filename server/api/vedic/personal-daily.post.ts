
import {
    createError,
    defineEventHandler,
    readBody,
  } from "h3";
  
  interface PersonalDailyRequest {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    city: string;
    target_date?: string;
  }
  
  interface FreeAstroApiError {
    statusCode?: number;
    status?: number;
    statusMessage?: string;
    message?: string;
    data?: {
      message?: string;
      error?: string;
    };
  }
  
  function isIntegerInRange(
    value: unknown,
    min: number,
    max: number,
  ): value is number {
    return (
      typeof value === "number" &&
      Number.isInteger(value) &&
      value >= min &&
      value <= max
    );
  }
  
  function isValidDate(
    year: number,
    month: number,
    day: number,
  ): boolean {
    const date = new Date(Date.UTC(year, month - 1, day));
  
    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
  }
  
  export default defineEventHandler(async (event) => {
    const body = await readBody<PersonalDailyRequest>(event);
  
    if (!body || typeof body !== "object") {
      throw createError({
        statusCode: 400,
        statusMessage: "Please provide your birth details.",
      });
    }
  
    const {
      year,
      month,
      day,
      hour,
      minute,
      city,
      target_date,
    } = body;
  
    // Validate birth details.
    if (
      !isIntegerInRange(year, 1900, new Date().getFullYear()) ||
      !isIntegerInRange(month, 1, 12) ||
      !isIntegerInRange(day, 1, 31) ||
      !isValidDate(year, month, day) ||
      !isIntegerInRange(hour, 0, 23) ||
      !isIntegerInRange(minute, 0, 59)
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: "Please provide valid birth date and time details.",
      });
    }
  
    if (
      typeof city !== "string" ||
      !city.trim() ||
      city.trim().length > 150
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: "Please provide a valid birth city.",
      });
    }
  
    if (
      target_date !== undefined &&
      (
        typeof target_date !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(target_date) ||
        !isValidDate(
          Number(target_date.slice(0, 4)),
          Number(target_date.slice(5, 7)),
          Number(target_date.slice(8, 10)),
        )
      )
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: "The target date must be a valid YYYY-MM-DD date.",
      });
    }
  
    const config = useRuntimeConfig(event);
    const apiKey = config.freeAstroApiKey;
  
    if (!apiKey || typeof apiKey !== "string") {
      console.error(
        "[personal-daily] FreeAstroAPI key is not configured.",
      );
  
      throw createError({
        statusCode: 500,
        statusMessage: "The horoscope service is not configured.",
      });
    }
  
    try {
      const apiResponse = await $fetch<Record<string, unknown>>(
        "https://api.freeastroapi.com/api/v2/vedic/horoscope/daily/personal",
        {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: {
            year,
            month,
            day,
            hour,
            minute,
            city: city.trim(),
            ...(target_date ? { target_date } : {}),
            include_interpretation_blocks: true,
          },
          timeout: 30_000,
        },
      );
  
      // Support both nested and top-level upstream response formats.
      const horoscope =
        apiResponse.data ??
        apiResponse.horoscope ??
        apiResponse;
  
      if (
        !horoscope ||
        typeof horoscope !== "object" ||
        Array.isArray(horoscope)
      ) {
        throw createError({
          statusCode: 502,
          statusMessage: "The astrology service returned an invalid response.",
        });
      }
  
      return {
        success: true,
        data: horoscope,
      };
    } catch (error: unknown) {
      const apiError = error as FreeAstroApiError;
  
      // Preserve intentional errors raised above.
      if (
        typeof apiError.statusCode === "number" &&
        apiError.statusCode >= 400 &&
        apiError.statusCode < 500 &&
        !apiError.data
      ) {
        throw error;
      }
  
      const upstreamStatus =
        apiError.statusCode ?? apiError.status;
  
      console.error("[personal-daily] FreeAstroAPI request failed:", {
        status: upstreamStatus,
        message: apiError.data?.message ?? apiError.message,
      });
  
      if (upstreamStatus === 429) {
        throw createError({
          statusCode: 429,
          statusMessage:
            "The horoscope service is temporarily rate-limited. Please wait a moment and try again.",
        });
      }
  
      if (upstreamStatus === 401 || upstreamStatus === 403) {
        throw createError({
          statusCode: 502,
          statusMessage:
            "The horoscope service could not authorize the request. Please check the API configuration.",
        });
      }
  
      throw createError({
        statusCode: 502,
        statusMessage:
          "We couldn't calculate your personal horoscope right now. Please try again shortly.",
      });
    }
  });
  