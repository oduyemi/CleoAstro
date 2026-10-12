
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined.");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache =
  globalThis.mongooseCache ??
  (globalThis.mongooseCache = {
    conn: null,
    promise: null,
  });

export const dbConnect = async (): Promise<typeof mongoose> => {
  // Reuse only an active connection.
  if (
    cached.conn &&
    mongoose.connection.readyState === 1
  ) {
    return cached.conn;
  }

  // Reuse an in-progress connection.
  if (mongoose.connection.readyState === 2 && cached.promise) {
    return cached.promise;
  }

  // Clear stale connection references.
  if (mongoose.connection.readyState !== 1) {
    cached.conn = null;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
      })
      .then((connection) => {
        console.info(
          "MongoDB connected:",
          connection.connection.name,
        );

        return connection;
      })
      .catch((error: unknown) => {
        cached.conn = null;
        cached.promise = null;

        console.error("MongoDB connection failed:", error);

        throw error;
      });
  }

  cached.conn = await cached.promise;

  return cached.conn;
};
