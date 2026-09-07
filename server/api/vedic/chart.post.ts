import {
    createError,
    defineEventHandler,
    readBody,
  } from "h3";
  
  import {
    getHoroscopeChart,
    type HoroscopeChartRequest,
  } from "../../services/freeAstro";
  
  export default defineEventHandler(async (event) => {
    const body =
      await readBody<Partial<HoroscopeChartRequest>>(
        event,
      );
  
    if (
      !body ||
      typeof body.year !== "number" ||
      typeof body.month !== "number" ||
      typeof body.date !== "number" ||
      typeof body.hours !== "number" ||
      typeof body.minutes !== "number" ||
      typeof body.seconds !== "number" ||
      typeof body.latitude !== "number" ||
      typeof body.longitude !== "number" ||
      typeof body.timezone !== "number"
    ) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "Complete birth information is required.",
      });
    }
  
    try {
      const chart = await getHoroscopeChart({
        year: body.year,
        month: body.month,
        date: body.date,
        hours: body.hours,
        minutes: body.minutes,
        seconds: body.seconds,
        latitude: body.latitude,
        longitude: body.longitude,
        timezone: body.timezone,
  
        observation_point:
          body.observation_point ??
          "topocentric",
  
        language:
          body.language ?? "en",
      });
  
      return {
        success: true,
        provider: "FreeAstroAPI",
        data: chart,
      };
    } catch (error: any) {
      console.error(
        "[FreeAstroAPI] Horoscope chart failed:",
        error?.response?._data ||
          error?.data ||
          error?.message ||
          error,
      );
  
      throw createError({
        statusCode:
          error?.response?.status ||
          error?.statusCode ||
          500,
  
        statusMessage:
          error?.response?._data?.message ||
          error?.data?.message ||
          error?.message ||
          "Unable to generate horoscope chart.",
  
        data:
          error?.response?._data ||
          error?.data,
      });
    }
  });