import React, { useEffect, useState } from "react";
import { getComplaints, updateComplaint } from "../services/api";

function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getComplaints();
    setData(res.data);
  };

  const getColor = (sev) => {
    if (sev === "critical") return "red";
    if (sev === "medium") return "orange";
    return "green";
  };

  const getBadge = (sev) => {
    if (sev === "critical") return "🚨 HIGH PRIORITY";
    if (sev === "medium") return "⚠️ MEDIUM";
    return "✅ LOW";
  };

  // 🔥 HANDLE STATUS UPDATE
  const handleUpdate = async (id, status) => {
    await updateComplaint(id, { status });
    fetchData(); // refresh
  };

  return (
    <div>
      <h3>Admin Dashboard</h3>

      {data.map((c) => (
        <div key={c._id} style={{ marginBottom: "20px" }}>
          <p><b>{c.text}</b></p>

          <p>{getBadge(c.severity)}</p>

          <p style={{ color: getColor(c.severity) }}>
            Severity: {c.severity}
          </p>

          <p>Status: {c.status}</p>

          <p>
            Submitted: {new Date(c.createdAt).toLocaleString()}
          </p>

          {/* 🔥 Evidence */}
          {(c.image || c.audio) && <p> Evidence Attached</p>}

          {/* Image */}
          {c.image && (
            <img
              src={`http://localhost:5000/${c.image}`}
              alt="proof"
              width="200"
              style={{ display: "block", marginBottom: "10px" }}
            />
          )}

          {/* Audio */}
          {c.audio && (
            <audio controls style={{ display: "block", marginBottom: "10px" }}>
              <source src={`http://localhost:5000/${c.audio}`} />
            </audio>
          )}

          {/* Video */}
          {c.video && (
            <video width="250" controls style={{ display: "block", marginBottom: "10px" }}>
              <source src={`http://localhost:5000/${c.video}`} />
            </video>
          )}

          {/* Verified */}
          {(c.image || c.audio || c.video) && <p>Evidence Attached</p>}

          {/* 🔥 ACTION BUTTONS */}
          <div>
            <button onClick={() => handleUpdate(c._id, "Under Review ")}>
              Mark Review
            </button>

            <button onClick={() => handleUpdate(c._id, "Escalated ")}>
              Escalate
            </button>

            <button onClick={() => handleUpdate(c._id, "Resolved ")}>
              Resolve
            </button>
          </div>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default Dashboard;