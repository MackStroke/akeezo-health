import mongoose from "mongoose";
import { env } from "../config/env.js";
// Set buffer timeout to 2.5 seconds so disconnected queries fail fast without blocking index creation
mongoose.set("bufferTimeoutMS", 2500);
let cachedPromise = null;
export async function connectDB() {
    if (mongoose.connection.readyState >= 1) {
        return mongoose;
    }
    if (!cachedPromise) {
        cachedPromise = mongoose
            .connect(env.MONGODB_URI, {
            autoIndex: env.NODE_ENV !== "production",
            serverSelectionTimeoutMS: 2500,
            connectTimeoutMS: 2500,
            socketTimeoutMS: 10000,
            maxPoolSize: 50,
            minPoolSize: 5,
        })
            .then((m) => {
            console.log(`[Akeezo MongoDB] Connected successfully to ${m.connection.host}:${m.connection.port}/${m.connection.name}`);
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
export async function disconnectDB() {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
        cachedPromise = null;
        console.log("[Akeezo MongoDB] Disconnected successfully.");
    }
}
