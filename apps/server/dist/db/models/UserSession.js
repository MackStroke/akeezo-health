import mongoose, { Schema } from "mongoose";
const UserSessionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    ipAddress: { type: String, default: "127.0.0.1" },
    userAgent: { type: String, default: "Unknown" },
    tokenVersion: { type: Number, default: 1 },
    isValid: { type: Boolean, default: true },
    expiresAt: { type: Date, required: true },
}, { timestamps: true });
// TTL index to automatically purge expired sessions via MongoDB background worker
UserSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
UserSessionSchema.index({ userId: 1, isValid: 1 });
export const UserSessionModel = mongoose.models.UserSession || mongoose.model("UserSession", UserSessionSchema);
