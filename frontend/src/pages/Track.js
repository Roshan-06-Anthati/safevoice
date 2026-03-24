import React, { useState } from "react";
import { trackComplaint } from "../services/api";

function Track() {
  const [id, setId] = useState("");
  const [data, setData] = useState(null);

  const handleTrack = async () => {
    try {
      const res = await trackComplaint(id);
      setData(res.data);
    } catch {
      alert("Invalid Tracking ID");
      setData(null);
    }
  };

  // Severity color
  const getColor = (sev) => {
    if (sev === "critical") return "red";
    if (sev === "medium") return "orange";
    return "green";
  };

  // Status message
  const getMessage = (status) => {
    if (status.includes("Escalated"))
      return "🚨 Your complaint is being handled urgently";
    if (status.includes("Review"))
      return "⚠️ Your complaint is under review";
    if (status.includes("Resolved"))
      return "✅ Your issue has been resolved";
    return "📩 Complaint received successfully";
  };

  // Progress steps
  const getProgress = (status) => {
    return (
      <>
        ✔ Logged →{" "}
        {status !== "Logged" && "✔ Under Review → "}
        {(status.includes("Escalated") ||
          status.includes("Resolved")) && "✔ Escalated → "}
        {status.includes("Resolved") && "✔ Resolved"}
      </>
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Track Complaint</h2>

      <input
        placeholder="Enter Tracking ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />

      <button onClick={handleTrack}>Track</button>

      {data && (
        <div style={{ marginTop: "20px" }}>
          <h3>Complaint Found ✅</h3>

          <p style={{ color: getColor(data.severity) }}>
            <b>Severity:</b> {data.severity}
          </p>

          <p>
            <b>Status:</b> {data.status}
          </p>

          {/* 🔥 Dynamic message */}
          <p>{getMessage(data.status)}</p>

          <p>
            <b>Submitted:</b>{" "}
            {new Date(data.createdAt).toLocaleString()}
          </p>

          <p>🔐 Your identity is completely anonymous</p>

          {/* 🔥 NEW: Evidence */}
          {(data.image || data.audio || data.video) && <p> Evidence Submitted</p>}

          {/* 🔥 NEW: Verified */}
          {data.verified && <p>✔ Verified by Admin</p>}

          {/* 🔥 Progress */}
          <div style={{ marginTop: "10px" }}>
            <b>Progress:</b>
            <p>{getProgress(data.status)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Track;