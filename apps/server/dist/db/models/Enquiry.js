import mongoose, { Schema } from "mongoose";
const EnquirySchema = new Schema({
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
}, { timestamps: true });
export const EnquiryModel = mongoose.models.Enquiry || mongoose.model("Enquiry", EnquirySchema);
