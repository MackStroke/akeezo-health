import mongoose, { Schema, Document } from "mongoose";
import { ROLE_KEYS, RoleKey, DEFAULT_ROLE_PERMISSIONS } from "@akeezo/contracts";

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  role: RoleKey;
  permissions: string[];
  passwordHash: string;
  status: "active" | "disabled";
  phoneVerified: boolean;
  totpEnabled?: boolean;
  tokenVersion: number;
  failedAttempts: number;
  lockoutUntil?: Date;
  lastLoginAt?: Date;
  lastLoginIp?: string;
  lastActiveAt?: Date;
  partnerId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, default: "+91 82876 39443" },
    role: { type: String, required: true, enum: ROLE_KEYS, default: "coordinator" },
    permissions: [{ type: String }],
    passwordHash: { type: String, required: true },
    status: { type: String, enum: ["active", "disabled"], default: "active" },
    phoneVerified: { type: Boolean, default: true },
    totpEnabled: { type: Boolean, default: false },
    tokenVersion: { type: Number, default: 1 },
    failedAttempts: { type: Number, default: 0 },
    lockoutUntil: { type: Date },
    lastLoginAt: { type: Date },
    lastLoginIp: { type: String },
    lastActiveAt: { type: Date },
    partnerId: { type: Schema.Types.ObjectId, ref: "Partner" },
  },
  { timestamps: true }
);

// Indexes per MongoDB schema design guidelines
UserSchema.index({ role: 1, status: 1 });
UserSchema.index({ phone: 1 });

UserSchema.pre("save", function (next) {
  // If permissions are not explicitly overridden, populate with defaults for the role
  if (!this.permissions || this.permissions.length === 0) {
    this.permissions = DEFAULT_ROLE_PERMISSIONS[this.role] || [];
  }
  next();
});

export const UserModel = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
