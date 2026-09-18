import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined.");
}

let cached = globalThis as typeof globalThis & {
  mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

if (!cached.mongoose) {
  cached.mongoose = {
    conn: null,
    promise: null,
  };
}

export const dbConnect = async () => {
  if (cached.mongoose!.conn) {
    return cached.mongoose!.conn;
  }

  if (!cached.mongoose!.promise) {
    cached.mongoose!.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.mongoose!.conn =
      await cached.mongoose!.promise;

    console.log(
      "MongoDB connected:",
      cached.mongoose!.conn.connection.name
    );

    return cached.mongoose!.conn;
  } catch (error) {
    cached.mongoose!.promise = null;

    console.error("MongoDB connection failed:", error);

    throw error;
  }
};