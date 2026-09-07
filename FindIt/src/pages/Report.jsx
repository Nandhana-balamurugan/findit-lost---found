import { useState, useRef } from "react";
import { supabase } from "../supabaseClient";

function Report({ setPage, refreshItems }) {
  const [type, setType] = useState("lost");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [description, setDescription] = useState("");
  
  const [imagePreview, setImagePreview] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setUseCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera access denied or unavailable.");
      setUseCamera(false);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 300;
    canvas.height = video.videoHeight || 225;
    
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageUrl = canvas.toDataURL("image/png");
    setImagePreview(imageUrl);
    stopCamera();
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setUseCamera(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === "found" && !imagePreview) {
      alert("Please upload or take a photo of the found item.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("items").insert([
      {
        type,
        title,
        category,
        location,
        date,
        contact_name: contactName,
        contact_info: contactInfo,
        description,
        image_url: imagePreview,
        status: "active",
      },
    ]);

    setIsSubmitting(false);

    if (error) {
      alert("Error saving item: " + error.message);
    } else {
      setSubmitted(true);
      if (refreshItems) refreshItems();
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">🔎 FindIt</div>
        <div className="nav-links">
          <a href="#" onClick={() => { stopCamera(); setPage("home"); }}>Home</a>
          <a href="#" onClick={() => { stopCamera(); setPage("browse"); }}>Browse Items</a>
          <a href="#" onClick={() => { stopCamera(); setPage("report"); }}>Report</a>
        </div>
      </nav>

      <div style={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px" }}>
        <h1 style={{ color: "#172033", fontSize: "32px", textAlign: "center", marginBottom: "10px" }}>
          Report an Item
        </h1>
        <p style={{ color: "#64748b", textAlign: "center", marginBottom: "30px" }}>
          Provide details and contact info so the owner can reach you.
        </p>

        {submitted ? (
          <div style={{ background: "#dcfce7", border: "1px solid #86efac", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
            <h2 style={{ color: "#166534", marginBottom: "10px" }}>Report Saved to Database! 🎉</h2>
            <p style={{ color: "#15803d", marginBottom: "20px" }}>Your item will now persist across refreshes under Browse Items.</p>
            {imagePreview && (
              <img 
                src={imagePreview} 
                alt="Uploaded" 
                style={{ width: "160px", height: "160px", objectFit: "cover", borderRadius: "8px", marginBottom: "20px" }} 
              />
            )}
            <br />
            <button className="primary-button" onClick={() => { setSubmitted(false); setImagePreview(null); }}>
              Report Another Item
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: "white", padding: "30px", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <button
                type="button"
                className={type === "lost" ? "primary-button" : "secondary-button"}
                style={{ flex: 1 }}
                onClick={() => setType("lost")}
              >
                I Lost Something
              </button>
              <button
                type="button"
                className={type === "found" ? "primary-button" : "secondary-button"}
                style={{ flex: 1 }}
                onClick={() => setType("found")}
              >
                I Found Something
              </button>
            </div>

            <div style={{ marginBottom: "15px", textAlign: "left" }}>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px", color: "#172033" }}>Item Title</label>
              <input
                type="text"
                required
                placeholder="e.g., Blue Water Bottle, College ID"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white", color: "#172033" }}
              />
            </div>

            <div style={{ marginBottom: "15px", textAlign: "left" }}>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px", color: "#172033" }}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white", color: "#172033" }}
              >
                <option value="Electronics">Electronics</option>
                <option value="Keys & ID Cards">Keys & ID Cards</option>
                <option value="Clothing & Bags">Clothing & Bags</option>
                <option value="Books & Stationary">Books & Stationary</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={{ marginBottom: "15px", textAlign: "left" }}>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px", color: "#172033" }}>Location</label>
              <input
                type="text"
                required
                placeholder="e.g., Library 2nd Floor, Campus Canteen"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white", color: "#172033" }}
              />
            </div>

            <div style={{ marginBottom: "15px", textAlign: "left" }}>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px", color: "#172033" }}>Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white", color: "#172033" }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <div style={{ flex: 1, textAlign: "left" }}>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px", color: "#172033" }}>Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white", color: "#172033" }}
                />
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px", color: "#172033" }}>Phone / Email</label>
                <input
                  type="text"
                  required
                  placeholder="9876543210 / email@campus.edu"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white", color: "#172033" }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "15px", textAlign: "left" }}>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px", color: "#172033" }}>
                Item Photo {type === "found" ? "(Required)" : "(Optional)"}
              </label>

              {!useCamera ? (
                <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                  <label className="secondary-button" style={{ flex: 1, textAlign: "center", cursor: "pointer", display: "block" }}>
                    📁 Choose File
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                  </label>
                  <button type="button" className="secondary-button" style={{ flex: 1 }} onClick={startCamera}>
                    📷 Take Photo
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: "center", marginBottom: "10px" }}>
                  <video ref={videoRef} autoPlay style={{ width: "100%", maxHeight: "250px", borderRadius: "6px", background: "#000" }} />
                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button type="button" className="primary-button" style={{ flex: 1 }} onClick={capturePhoto}>
                      📸 Capture
                    </button>
                    <button type="button" className="secondary-button" style={{ flex: 1 }} onClick={stopCamera}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {imagePreview && !useCamera && (
                <div style={{ marginTop: "10px" }}>
                  <img src={imagePreview} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "6px" }} />
                </div>
              )}
            </div>

            <div style={{ marginBottom: "20px", textAlign: "left" }}>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px", color: "#172033" }}>Description</label>
              <textarea
                rows="3"
                placeholder="Additional details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white", color: "#172033" }}
              ></textarea>
            </div>

            <button type="submit" className="primary-button" disabled={isSubmitting} style={{ width: "100%", padding: "12px", fontSize: "16px" }}>
              {isSubmitting ? "Saving..." : "Submit Report"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Report;