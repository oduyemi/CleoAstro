
import AdPlacement from "../models/adPlacement.model";
import type { IAdPlacement } from "../models/adPlacement.model";
import { dbConnect } from "../utils/db";


type AdvertEnquiryBody = {
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
  businessName?: unknown;
  website?: unknown;
  industry?: unknown;
  advertType?: unknown;
  advertDescription?: unknown;
  campaignGoal?: unknown;
  targetAudience?: unknown;
  placement?: unknown;
  budget?: unknown;
  startDate?: unknown;
  endDate?: unknown;
  destinationUrl?: unknown;
  assetUrl?: unknown;
  additionalNotes?: unknown;
  consent?: unknown;
  source?: unknown;
};

const MAX_LENGTHS: Record<string, number> = {
  fullName: 120,
  email: 254,
  phone: 40,
  businessName: 160,
  website: 2048,
  industry: 100,
  advertType: 100,
  advertDescription: 5000,
  campaignGoal: 200,
  targetAudience: 1000,
  placement: 160,
  budget: 100,
  destinationUrl: 2048,
  assetUrl: 2048,
  additionalNotes: 3000,
};

function cleanString(
  value: unknown,
  field: string,
  required = false
): string | undefined {
  if (value === undefined || value === null || value === "") {
    if (required) {
      throw createError({
        statusCode: 400,
        statusMessage: `${field} is required.`,
      });
    }

    return undefined;
  }

  if (typeof value !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: `${field} must be a string.`,
    });
  }

  const cleaned = value.trim();

  if (!cleaned && required) {
    throw createError({
      statusCode: 400,
      statusMessage: `${field} is required.`,
    });
  }

  if (cleaned.length > (MAX_LENGTHS[field] ?? 5000)) {
    throw createError({
      statusCode: 400,
      statusMessage: `${field} is too long.`,
    });
  }

  return cleaned || undefined;
}

function parseOptionalUrl(
  value: unknown,
  field: string
): string | undefined {
  const cleaned = cleanString(value, field);

  if (!cleaned) return undefined;

  let parsed: URL;

  try {
    parsed = new URL(
      /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(cleaned)
        ? cleaned
        : `https://${cleaned}`
    );
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: `${field} must be a valid URL.`,
    });
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw createError({
      statusCode: 400,
      statusMessage: `${field} must use HTTP or HTTPS.`,
    });
  }

  return parsed.toString();
}

function parseOptionalDate(
  value: unknown,
  field: string
): Date | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: `${field} must use YYYY-MM-DD format.`,
    });
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: `${field} is not a valid date.`,
    });
  }

  return date;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<AdvertEnquiryBody>(event);

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw createError({
      statusCode: 400,
      statusMessage: "A valid enquiry body is required.",
    });
  }

  const fullName = cleanString(body.fullName, "fullName", true)!;
  const email = cleanString(body.email, "email", true)!.toLowerCase();
  const businessName = cleanString(
    body.businessName,
    "businessName",
    true
  )!;
  const industry = cleanString(body.industry, "industry", true)!;
  const advertType = cleanString(body.advertType, "advertType", true)!;
  const advertDescription = cleanString(
    body.advertDescription,
    "advertDescription",
    true
  )!;
  const placement = cleanString(body.placement, "placement", true)!;
  const campaignGoal = cleanString(body.campaignGoal, "campaignGoal");
  const targetAudience = cleanString(
    body.targetAudience,
    "targetAudience"
  );
  const budget = cleanString(body.budget, "budget");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Please provide a valid email address.",
    });
  }

  if (body.consent !== true) {
    throw createError({
      statusCode: 400,
      statusMessage: "Please accept the consent notice before submitting.",
    });
  }

  const startDate = parseOptionalDate(body.startDate, "startDate");
  const endDate = parseOptionalDate(body.endDate, "endDate");

  if (startDate && endDate && endDate < startDate) {
    throw createError({
      statusCode: 400,
      statusMessage: "The end date cannot be before the start date.",
    });
  }

  const website = parseOptionalUrl(body.website, "website");
  const destinationUrl = parseOptionalUrl(
    body.destinationUrl,
    "destinationUrl"
  );
  const assetUrl = parseOptionalUrl(body.assetUrl, "assetUrl");

  const phone = cleanString(body.phone, "phone");
  const additionalNotes = cleanString(
    body.additionalNotes,
    "additionalNotes"
  );

  const source = "CleoAstro Bulletin";

  try {
    await dbConnect();

    const enquiryData: IAdPlacement = {
        fullName,
        email,
        phone,
        businessName,
        website,
        industry,
        advertType,
        advertDescription,
        campaignGoal,
        targetAudience,
        placement,
        budget,
        startDate,
        endDate,
        destinationUrl,
        assetUrl,
        additionalNotes,
        source,
        consent: true,
        status: "new",
        createdAt: new Date(),
        updatedAt: new Date(),
    };
      
    const enquiry = await AdPlacement.create(enquiryData);
      
    return {
        success: true,
        message: "Your advertising enquiry has been received.",
        enquiryId: enquiry._id.toString(),
    };
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "statusCode" in error
    ) {
      throw error;
    }

    console.error(
      "ADVERT ENQUIRY SAVE ERROR:",
      error instanceof Error ? error.message : "Unknown error"
    );

    throw createError({
      statusCode: 500,
      statusMessage:
        "We could not submit your enquiry right now. Please try again.",
    });
  }
});
