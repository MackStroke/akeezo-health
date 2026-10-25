import mongoose, { Schema } from "mongoose";
import { ROLE_KEYS, DEFAULT_ROLE_PERMISSIONS } from "@akeezo/contracts";
const UserSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, default: "+91 82876 39443" },
    role: { type: String, required: true, enum: ROLE_KEYS, default: "coordinator" },
    permissions: [{ type: String }],
    passwordHash: { type: String, required: true },
    status: { type: String, enum: ["active", "disabled"], default: "active" },
    phoneVerified: { type: Boolean, default: true },
    totpEnabled: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
}, { timestamps: true });
UserSchema.pre("save", function (next) {
    // If permissions are not explicitly overridden, populate with defaults for the role
    if (!this.permissions || this.permissions.length === 0) {
        this.permissions = DEFAULT_ROLE_PERMISSIONS[this.role] || [];
    }
    next();
});
export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
