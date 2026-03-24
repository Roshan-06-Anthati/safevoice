import Complaint from "../models/Complaint.js";
import { analyzeComplaint } from "../services/aiService.js";

const generateId = () =>
  Math.random().toString(36).substring(2, 10);

// 🔹 Create Complaint
export const createComplaint = async (req, res) => {
  try {
    const { text } = req.body;

    const ai = await analyzeComplaint(text);

    let status = "Logged";

    const complaint = await Complaint.create({
      text,
      type: ai.type,
      severity: ai.severity,
      status,
      trackingId: generateId(),
      image: req.files?.image?.[0]?.path || null,
      audio: req.files?.audio?.[0]?.path || null,
      video: req.files?.video?.[0]?.path || null,
    });

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔥 UPDATED: PRIORITY SORTING (IMPORTANT)
export const getComplaints = async (req, res) => {
  const severityOrder = {
    critical: 3,
    medium: 2,
    low: 1,
  };

  const data = await Complaint.find();

  data.sort((a, b) => {
    if (severityOrder[b.severity] !== severityOrder[a.severity]) {
      return severityOrder[b.severity] - severityOrder[a.severity];
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  res.json(data);
};

// 🔥 NEW: TRACKING API
export const trackComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findOne({ trackingId: id });

    if (!complaint) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔥 UPDATE STATUS (ADMIN ACTION)
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Complaint.findByIdAndUpdate(
      id,
      {
        status,
        verified: status.includes("Resolved"), // ✅ auto verify
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
