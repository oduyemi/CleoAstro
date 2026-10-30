import { createError, defineEventHandler } from "h3";
import Product from "../../models/product.model";
import { dbConnect } from "../../utils/db";
import { PRODUCT_CATALOG } from "../../utils/productCatalog";

export default defineEventHandler(async () => {
  try {
    await dbConnect();
    const operations = PRODUCT_CATALOG.map((product) => ({
      updateOne: {
        filter: { slug: product.slug },
        update: {
          $setOnInsert: {
            ...product,
            currency: "NGN" as const,
            isAvailable: true,
          },
        },
        upsert: true,
      },
    }));

    if (operations.length > 0) {
      await Product.bulkWrite(operations);
    }

    const products = await Product.find({ isAvailable: true })
      .select(
        "slug number name category description price currency image featured isAvailable stock",
      )
      .sort({ number: 1 })
      .lean();

    return {
      success: true,
      data: products,
    };
  } catch (error) {
    console.error("Failed to retrieve products:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Unable to retrieve products.",
    });
  }
});