import { createError, defineEventHandler, readBody } from "h3";
import Product from "../../models/product.model";
import ProductOrder from "../../models/productOrder.model";
import { dbConnect } from "../../utils/db";
import { sendProductOrderNotification } from "../../utils/mailer";
  
interface ProductOrderBody {
    productSlug: string;
    quantity?: number;
    fullName: string;
    email: string;
    phone: string;
    deliveryAddress: string;
    deliveryNotes?: string;
    transferReference: string;
}
  
const cleanString = (value: unknown, maxLength: number): string => {
    if (typeof value !== "string") return "";
    return value.trim().slice(0, maxLength);
};
  
export default defineEventHandler(async (event) => {
    const body = await readBody<ProductOrderBody>(event);
    if (!body || typeof body !== "object") {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid order details.",
      });
    }
  
    const productSlug = cleanString(body.productSlug, 150).toLowerCase();
    const fullName = cleanString(body.fullName, 150);
    const email = cleanString(body.email, 200).toLowerCase();
    const phone = cleanString(body.phone, 40);
    const deliveryAddress = cleanString(body.deliveryAddress, 1000);
    const deliveryNotes = cleanString(body.deliveryNotes, 1000);
    const transferReference = cleanString(body.transferReference, 150);
    const quantity = Number(body.quantity ?? 1);
    if (!productSlug) {
      throw createError({
        statusCode: 400,
        statusMessage: "Please select a product.",
      });
    }
  
    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 20
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: "Quantity must be between 1 and 20.",
      });
    }
  
    if (fullName.length < 2) {
      throw createError({
        statusCode: 400,
        statusMessage: "Please provide your full name.",
      });
    }
  
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Please provide a valid email address.",
      });
    }
  
    if (!phone) {
      throw createError({
        statusCode: 400,
        statusMessage: "Please provide your phone number.",
      });
    }
  
    if (deliveryAddress.length < 8) {
      throw createError({
        statusCode: 400,
        statusMessage: "Please provide a complete delivery address.",
      });
    }
  
    if (!transferReference) {
      throw createError({
        statusCode: 400,
        statusMessage: "Please provide your bank transfer reference.",
      });
    }
  
    try {
      await dbConnect();
  
      const product = await Product.findOne({
        slug: productSlug,
        isAvailable: true,
      });
  
      if (!product) {
        throw createError({
          statusCode: 404,
          statusMessage: "This product is currently unavailable.",
        });
      }
  
      if (
        product.stock !== null &&
        product.stock !== undefined &&
        product.stock < quantity
      ) {
        throw createError({
          statusCode: 400,
          statusMessage: "There is not enough stock for this quantity.",
        });
      }
  
      const existingOrder = await ProductOrder.findOne({
        "payment.transferReference": transferReference,
      }).select("_id");
  
      if (existingOrder) {
        throw createError({
          statusCode: 409,
          statusMessage:
            "This transfer reference has already been submitted.",
        });
      }
  
      const totalAmount = product.price * quantity;
  
      const reference = `CLEO-ORD-${Date.now()}-${crypto
        .randomUUID()
        .slice(0, 8)
        .toUpperCase()}`;
  
      const order = await ProductOrder.create({
        reference,
        product: product._id,
  
        productSnapshot: {
          name: product.name,
          slug: product.slug,
          image: product.image,
          unitPrice: product.price,
          currency: "NGN",
        },
  
        quantity,
        totalAmount,
        currency: "NGN",
  
        customer: {
          fullName,
          email,
          phone,
        },
  
        deliveryAddress,
        deliveryNotes: deliveryNotes || undefined,
  
        payment: {
          method: "bank-transfer",
          status: "transfer-reported",
          transferReference,
        },
  
        status: "awaiting-payment-verification",
      });
  
      try {
        await sendProductOrderNotification({
          reference: order.reference,
          productName: order.productSnapshot.name,
          productSlug: order.productSnapshot.slug,
          quantity: order.quantity,
          unitPrice: order.productSnapshot.unitPrice,
          totalAmount: order.totalAmount,
          currency: order.currency,
          fullName: order.customer.fullName,
          email: order.customer.email,
          phone: order.customer.phone,
          deliveryAddress: order.deliveryAddress,
          deliveryNotes: order.deliveryNotes,
          transferReference: order.payment.transferReference,
          paymentStatus: order.payment.status,
          status: order.status,
          createdAt: order.createdAt,
        });
      } catch (emailError) {
        console.error(
          "Failed to send product order notification:",
          emailError,
        );
      }
  
      return {
        success: true,
        message:
          "Your order has been submitted and is awaiting payment verification.",
        data: {
          id: order._id,
          reference: order.reference,
          product: order.productSnapshot.name,
          quantity: order.quantity,
          unitPrice: order.productSnapshot.unitPrice,
          totalAmount: order.totalAmount,
          currency: order.currency,
          paymentStatus: order.payment.status,
          status: order.status,
        },
      };
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "statusCode" in error
      ) {
        throw error;
      }
  
      console.error("Product order submission failed:", error);
  
      throw createError({
        statusCode: 500,
        statusMessage: "We could not process your order. Please try again.",
      });
    }
});
  