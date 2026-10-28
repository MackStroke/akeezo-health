import mongoose from "mongoose";
import { env } from "../config/env.js";

const isServerless =
  Boolean(process.env.VERCEL) ||
  Boolean(process.env.VERCEL_ENV) ||
  Boolean(process.env.VERCEL_REGION) ||
  Boolean(process.env.NOW_REGION) ||
  Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
  Boolean(process.env.LAMBDA_TASK_ROOT);

// Serverless functions need adequate buffer timeout to handle TLS cold starts without failing fast
mongoose.set("bufferTimeoutMS", isServerless ? 10000 : 5000);

let cachedPromise: Promise<typeof mongoose> | null = null;

export async function connectDB(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState >= 1) {
    return mongoose;
  }

  if (!cachedPromise) {
    cachedPromise = mongoose
      .connect(env.MONGODB_URI, {
        autoIndex: env.NODE_ENV !== "production" && !isServerless,
        serverSelectionTimeoutMS: isServerless ? 8000 : 5000,
        connectTimeoutMS: isServerless ? 8000 : 5000,
        socketTimeoutMS: 20000,
        maxPoolSize: isServerless ? 10 : 50,
        minPoolSize: isServerless ? 0 : 2,
      })
      .then((m) => {
        console.log(
          `[Akeezo MongoDB] Connected successfully to ${m.connection.host}:${m.connection.port}/${m.connection.name}`
        );
        return m;
      })
      .catch((err) => {
        cachedPromise = null;
        console.warn("[Akeezo MongoDB] Connection non-critical warning:", err.message);
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


