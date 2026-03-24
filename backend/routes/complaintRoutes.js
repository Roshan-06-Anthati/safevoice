import express from "express";
import { upload } from "../config/upload.js";

import {
  createComplaint,
  getComplaints,
  trackComplaint,
  updateComplaintStatus,
  getEmergencyAlerts,
  getBlacklisted,
  takeSevereAction, // 🔥 FIX: added this
} from "../controllers/complaintController.js";

const router = express.Router();

// 🔥 CREATE complaint (with files)
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createComplaint
);

// 🔥 TAKE SEVERE ACTION
router.put("/action/:accusedId", takeSevereAction);

// 🔥 GET all complaints
router.get("/", getComplaints);

// 🔥 UPDATE status
router.put("/:id", updateComplaintStatus);

// 🔥 TRACK complaint
router.get("/track/:id", trackComplaint);

// 🚨 EMERGENCY ALERTS
router.get("/alerts", getEmergencyAlerts);

// 🚫 BLACKLIST
router.get("/blacklisted", getBlacklisted);

export default router;