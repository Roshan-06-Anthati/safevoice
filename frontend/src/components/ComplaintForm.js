import React, { useState } from "react";
import { submitComplaint } from "../services/api";

function ComplaintForm() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [video, setVideo] = useState(null);

  const [accusedName, setAccusedName] = useState("");
  const [accusedId, setAccusedId] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("text", text);
      formData.append("accusedName", accusedName);
      formData.append("accusedId", accusedId);

      if (image) formData.append("image", image);
      if (audio) formData.append("audio", audio);
      if (video) formData.append("video", video);

      const res = await submitComplaint(formData);

      alert("Tracking ID: " + res.data.trackingId);

      // 🔥 Reset everything
      setText("");
      setAccusedName("");
      setAccusedId("");
      setImage(null);
      setAudio(null);
      setVideo(null);

    } catch {
      alert("Error submitting complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h3>Submit Complaint</h3>

        <input
          placeholder="Accused Name"
          value={accusedName}
          onChange={(e) => setAccusedName(e.target.value)}
        />

        <input
          placeholder="Accused ID"
          value={accusedId}
          onChange={(e) => setAccusedId(e.target.value)}
        />

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe your issue..."
        />

        <label>Image Proof:</label>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        <label>Audio Proof:</label>
        <input type="file" onChange={(e) => setAudio(e.target.files[0])} />

        <label>Video Proof:</label>
        <input type="file" onChange={(e) => setVideo(e.target.files[0])} />

        <button onClick={handleSubmit}>
          {loading ? "Analyzing..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

export default ComplaintForm;