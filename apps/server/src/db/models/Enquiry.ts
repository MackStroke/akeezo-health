import mongoose, { Schema, Document } from "mongoose";

export interface IEnquiry extends Document {
  receiptId: string;
  requesterName: string;
  email?: string;
  phone?: string;
  serviceType: "medical_tourism" | "emergency" | "home_healthcare" | "consultation" | "general";
  message?: string;
  sourcePath?: string;
  status: "received" | "triage" | "contacted" | "options_prepared" | "converted" | "closed";
  notes?: string;
  assignedCoordinatorId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    receiptId: { type: String, required: true, unique: true },
    requesterName: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    serviceType: {
      type: String,
      enum: ["medical_tourism", "emergency", "home_healthcare", "consultation", "general"],
      default: "medical_tourism",
    },
    message: { type: String },
    sourcePath: { type: String, default: "/" },
    status: {
      type: String,
      enum: ["received", "triage", "contacted", "options_prepared", "converted", "closed"],
      default: "received",
      index: true,
    },
    notes: { type: String },
    assignedCoordinatorId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const EnquiryModel =
  mongoose.models.Enquiry || mongoose.model<IEnquiry>("Enquiry", EnquirySchema);
