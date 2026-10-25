import mongoose from "mongoose";
import { env } from "../config/env.js";

export async function connectDB(): Promise<typeof mongoose> {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      autoIndex: true
    });
    console.log(`[Akeezo MongoDB] Connected successfully to ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error("[Akeezo MongoDB] Connection failed:", err);
    throw err;
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  console.log("[Akeezo MongoDB] Disconnected successfully.");
}
