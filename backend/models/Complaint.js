import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    text: String,
    type: String,
    severity: String,
    status: { type: String, default: "Logged" },
    trackingId: String,
    image: String,
    audio: String,
    video: String,
    accusedName: String,
    accusedId: String,
    estimatedTime: Number,
    action: String,
    severeActionTaken: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true } 
);

export default mongoose.model("Complaint", complaintSchema);