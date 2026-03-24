import React, { useEffect, useState } from "react";
import {
  getComplaints,
  updateComplaint,
  getAlerts,
  getBlacklisted,
  takeAction
} from "../services/api";

function Dashboard() {
  const [data, setData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [blacklist, setBlacklist] = useState([]);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    fetchData();
    fetchAlerts();
    fetchBlacklist();
  }, []);

  const fetchData = async () => {
    const res = await getComplaints();
    setData(res.data);
  };

  const fetchAlerts = async () => {
    const res = await getAlerts();
    setAlerts(res.data);
  };

  const fetchBlacklist = async () => {
    const res = await getBlacklisted();
    setBlacklist(res.data);
  };

  const handleSevereAction = async (accusedId) => {
    await takeAction(accusedId);
    fetchAlerts();
    fetchBlacklist();
  };

  const filteredData = data.filter((c) => {
    if (filter === "resolved") return c.status.includes("Resolved");
    if (filter === "escalated") return c.status.includes("Escalated");
    if (filter === "pending") return !c.status.includes("Resolved");
    return true;
  });

  const total = data.length;
  const resolved = data.filter((c) => c.status.includes("Resolved")).length;
  const escalated = data.filter((c) => c.status.includes("Escalated")).length;
  const pending = data.filter((c) => !c.status.includes("Resolved")).length;

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

  const getActionColor = (action) => {
    if (action === "escalate") return "red";
    if (action === "review") return "orange";
    return "green";
  };

  const handleUpdate = async (id, status) => {
    await updateComplaint(id, { status });
    fetchData();
    fetchAlerts();
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>

      {/* 🚨 EMERGENCY ALERTS */}
      <h3>🚨 Emergency Alerts</h3>

      {alerts.length === 0 && <p>No alerts</p>}

      {alerts.map((a) => (
        <div key={a._id} className="alert-box">
          <p><b>Accused:</b> {a.accusedName}</p>
          <p><b>ID:</b> {a._id}</p>
          <p><b>Total Complaints:</b> {a.count}</p>

          {a.complaints.map((c, index) => (
            <div key={c._id}>
              <p><b>Complaint {index + 1}</b></p>
              <p>📝 {c.text}</p>
              <p>📅 {new Date(c.createdAt).toLocaleString()}</p>

              {c.image && (
                <img src={`http://localhost:5000/${c.image}`} width="150" alt="proof" />
              )}

              {c.audio && (
                <audio controls>
                  <source src={`http://localhost:5000/${c.audio}`} />
                </audio>
              )}

              {c.video && (
                <video width="200" controls>
                  <source src={`http://localhost:5000/${c.video}`} />
                </video>
              )}

              <hr />
            </div>
          ))}

          <button onClick={() => handleSevereAction(a._id)} className="btn-escalate">
            🚨 Took Severe Action
          </button>
        </div>
      ))}

      {/* 🚫 BLACKLIST */}
      <h3>🚫 Blacklisted Accused</h3>

      {blacklist.length === 0 && <p>No blacklisted users</p>}

      {blacklist.map((b) => (
        <div key={b._id} className="blacklist-box">
          <p><b>Name:</b> {b.accusedName}</p>
          <p><b>ID:</b> {b._id}</p>
          <p><b>Complaints:</b> {b.count}</p>
        </div>
      ))}

      {/* 🔥 FILTER BUTTONS */}
      <div className="filter-bar">
        <button onClick={() => setFilter("total")}>Total ({total})</button>
        <button onClick={() => setFilter("pending")}>Pending ({pending})</button>
        <button onClick={() => setFilter("escalated")}>Escalated ({escalated})</button>
        <button onClick={() => setFilter("resolved")}>Resolved ({resolved})</button>
      </div>

      {/* 🔥 COMPLAINT LIST */}
      {filteredData.map((c) => (
        <div key={c._id} className="card">
          <p><b>{c.text}</b></p>

          <p><b>Accused:</b> {c.accusedName || "N/A"}</p>
          <p><b>ID:</b> {c.accusedId || "N/A"}</p>

          <p>{getBadge(c.severity)}</p>

          {c.severity === "critical" && (
            <p style={{ color: "red" }}>🚨 ALERT CASE</p>
          )}

          <p style={{ color: getColor(c.severity) }}>
            Severity: {c.severity}
          </p>

          <p>Status: {c.status}</p>

          <p>
            ⏱ <b>Estimated Time:</b>{" "}
            {c.estimatedTime ? `${c.estimatedTime} days` : "N/A"}
          </p>

          <p>
            💡 <b>Suggested Action:</b>{" "}
            <span style={{ color: getActionColor(c.action) }}>
              {c.action || "N/A"}
            </span>
          </p>

          <p>
            Submitted: {new Date(c.createdAt).toLocaleString()}
          </p>

          {(c.image || c.audio || c.video) && <p>📎 Evidence Attached</p>}

          {c.image && (
            <img src={`http://localhost:5000/${c.image}`} width="200" alt="proof" />
          )}

          {c.audio && (
            <audio controls>
              <source src={`http://localhost:5000/${c.audio}`} />
            </audio>
          )}

          {c.video && (
            <video width="250" controls>
              <source src={`http://localhost:5000/${c.video}`} />
            </video>
          )}

          {c.verified && <p>✔ Admin Verified</p>}

          <div>
            <button onClick={() => handleUpdate(c._id, "Under Review ⚠️")} className="btn-review">
              Review
            </button>

            <button onClick={() => handleUpdate(c._id, "Escalated 🚨")} className="btn-escalate">
              Escalate
            </button>

            <button onClick={() => handleUpdate(c._id, "Resolved ✅")} className="btn-resolve">
              Resolve
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;