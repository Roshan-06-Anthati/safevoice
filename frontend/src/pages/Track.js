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

  const getColor = (sev) => {
    if (sev === "critical") return "red";
    if (sev === "medium") return "orange";
    return "green";
  };

  const getActionColor = (action) => {
    if (action === "escalate") return "red";
    if (action === "review") return "orange";
    return "green";
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Track Complaint</h2>

        <input
          placeholder="Enter Tracking ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />

        <button onClick={handleTrack}>Track</button>

        {data && (
          <div style={{ marginTop: "15px" }}>
            <h3>Complaint Found ✅</h3>

            <p style={{ color: getColor(data.severity) }}>
              <b>Severity:</b> {data.severity}
            </p>

            <p><b>Status:</b> {data.status}</p>

            <p style={{ color: getActionColor(data.action) }}>
              💡 <b>Action:</b> {data.action || "N/A"}
            </p>

            <p>
              ⏱ <b>Estimated:</b> {data.estimatedTime || "N/A"} days
            </p>

            <p>
              <b>Submitted:</b>{" "}
              {new Date(data.createdAt).toLocaleString()}
            </p>

            <p>🔐 Anonymous</p>

            {/* Evidence */}
            {(data.image || data.audio || data.video) && (
              <div>
                <p>📎 Evidence</p>

                {data.image && (
                  <img
                    src={`http://localhost:5000/${data.image}`}
                    width="200"
                    alt="proof"
                  />
                )}

                {data.audio && (
                  <audio controls>
                    <source src={`http://localhost:5000/${data.audio}`} />
                  </audio>
                )}

                {data.video && (
                  <video width="250" controls>
                    <source src={`http://localhost:5000/${data.video}`} />
                  </video>
                )}
              </div>
            )}

            {data.verified && <p>✔ Verified by Admin</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Track;