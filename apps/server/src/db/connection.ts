import mongoose from "mongoose";
import { env } from "../config/env.js";

let cachedPromise: Promise<typeof mongoose> | null = null;

export async function connectDB(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState >= 1) {
    return mongoose;
  }

  if (!cachedPromise) {
    cachedPromise = mongoose
      .connect(env.MONGODB_URI, {
        autoIndex: env.NODE_ENV !== "production",
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
        socketTimeoutMS: 20000
      })
      .then((m) => {
        console.log(
          `[Akeezo MongoDB] Connected successfully to ${m.connection.host}:${m.connection.port}/${m.connection.name}`
        );
        return m;
      })
      .catch((err) => {
        cachedPromise = null;
        console.error("[Akeezo MongoDB] Connection failed:", err.message);
        throw err;
      });
  }

  return cachedPromise;
}

export async function disconnectDB(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    cachedPromise = null;
    console.log("[Akeezo MongoDB] Disconnected successfully.");
  }
}
