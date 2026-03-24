import Complaint from "../models/Complaint.js";
import { analyzeComplaint } from "../services/aiService.js";

const generateId = () =>
  Math.random().toString(36).substring(2, 10);

// 🔥 CREATE COMPLAINT (UPDATED WITH ACCUSED + ALERT LOGIC)
export const createComplaint = async (req, res) => {
  try {
    const { text, accusedName, accusedId } = req.body;

    const ai = await analyzeComplaint(text);

    // 🔥 count complaints for same accused
    let count = 0;
    if (accusedId) {
      count = await Complaint.countDocuments({ accusedId });
    }

    // 🔥 severity override (repeat offender)
    let severity = ai.severity;

    if (count >= 1) {
      severity = "critical";
    }

    const complaint = await Complaint.create({
      text,
      type: ai.type,
      severity,
      status: "Logged",
      trackingId: generateId(),

      // 🔥 AI NEW FIELDS
      estimatedTime: ai.estimated_time || 3,
      action: ai.action || "review",

      // 🔥 accused tracking
      accusedName,
      accusedId,

      // 🔥 evidence
      image: req.files?.image?.[0]?.path || null,
      audio: req.files?.audio?.[0]?.path || null,
      video: req.files?.video?.[0]?.path || null,
    });

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔥 PRIORITY SORTING
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

// 🔥 TRACKING API
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

// 🔥 UPDATE STATUS (ADMIN)
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Complaint.findByIdAndUpdate(
      id,
      {
        status,
        verified: status.includes("Resolved"),
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🚨 EMERGENCY ALERT SYSTEM
export const getEmergencyAlerts = async (req, res) => {
  try {
    const alerts = await Complaint.aggregate([
      {
        $match: {
          accusedId: { $ne: null },
          severeActionTaken: false, // 🔥 exclude handled
        },
      },
      {
        $group: {
          _id: "$accusedId",
          accusedName: { $first: "$accusedName" },
          complaints: { $push: "$$ROOT" },
          count: { $sum: 1 },
        },
      },
      {
        $match: { count: { $gte: 2 } },
      },
    ]);

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const takeSevereAction = async (req, res) => {
  try {
    const { accusedId } = req.params;

    await Complaint.updateMany(
      { accusedId },
      { severeActionTaken: true }
    );

    res.json({ message: "Action taken" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getBlacklisted = async (req, res) => {
  try {
    const data = await Complaint.aggregate([
      {
        $match: { severeActionTaken: true },
      },
      {
        $group: {
          _id: "$accusedId",
          accusedName: { $first: "$accusedName" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

