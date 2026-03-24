import React, { useState } from "react";
import { submitComplaint } from "../services/api";

function ComplaintForm() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 NEW STATES
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [video, setVideo] = useState(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // 🔥 Use FormData (IMPORTANT)
      const formData = new FormData();
      formData.append("text", text);

      if (image) formData.append("image", image);
      if (audio) formData.append("audio", audio);
      if (video) formData.append("video", video);

      const res = await submitComplaint(formData);

      alert("Tracking ID: " + res.data.trackingId);

      // Reset
      setText("");
      setImage(null);
      setAudio(null);

    } catch (err) {
      alert("Error submitting complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Submit Complaint</h3>

      {/* 🔹 Text */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe your issue..."
      />

      <br /><br />

      {/* 🔥 Image Upload */}
      <label>Upload Image Proof:</label>
      <br />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <br /><br />

      {/* 🔥 Audio Upload */}
      <label>Upload Audio Proof:</label>
      <br />
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setAudio(e.target.files[0])}
      />

      <br /><br />

      {/* 🔥 Video Upload */}
      <label>Upload Video Proof:</label>
      <br />
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideo(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleSubmit}>
        {loading ? "Analyzing..." : "Submit"}
      </button>
    </div>
  );
}

export default ComplaintForm;