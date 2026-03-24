import express from "express";
import { upload } from "../config/upload.js"; // ✅ NEW

import {
  createComplaint,
  getComplaints,
  trackComplaint,
  updateComplaintStatus,
} from "../controllers/complaintController.js";

const router = express.Router();

// 🔥 CREATE complaint with file upload
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createComplaint
);

// 🔥 GET all complaints (admin dashboard)
router.get("/", getComplaints);

// 🔥 UPDATE status (admin action)
router.put("/:id", updateComplaintStatus);

// 🔥 TRACK complaint (user)
router.get("/track/:id", trackComplaint);

export default router;