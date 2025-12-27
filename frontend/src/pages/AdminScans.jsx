import React, { useState, useEffect } from "react";
import { adminStyles } from "../styles/AdminStyles";

export default function AdminScans() {
  
  // --- STATE ---
  const [scansList, setScansList] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);

  // Stats State
  const [stats, setStats] = useState({
    today: 0,
    completed: 0,
    cancelled: 0,
    pending: 0
  });

  // --- FETCH DATA FROM BACKEND ---
  useEffect(() => {
    // 1. Fetch Scans List
    fetch("http://127.0.0.1:5000/api/admin/dashboard-scans")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
            setScansList(data);
        }
      })
      .catch((err) => console.error("Error fetching scans:", err));

    // 2. Fetch Scans Stats
    fetch("http://127.0.0.1:5000/api/admin/dashboard-scans/stats")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
            setStats(data);
        }
      })
      .catch((err) => console.error("Error fetching scan stats:", err));
  }, []);

  return (
    <div style={{ display: "flex", gap: "30px" }}>
      
      {/* ================= LEFT SIDE: SCANS LIST ================= */}
      <div
        style={{
          width: "75%",
          backgroundColor: "#f0f0f0",
          padding: "25px",
          borderRadius: "12px",
          height: "550px",
          position: "relative",
          marginTop: "25px",
        }}
      >
        <h2 style={{ color: "#075E68", marginBottom: "20px" }}>Scans</h2>

        <div
          style={{
            backgroundColor: "white",
            padding: "15px",
            borderRadius: "8px",
            height: "450px",
            overflowY: "auto",
          }}
        >
          {scansList.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: "50px", color: "#888" }}>
              <p style={{ fontSize: "18px", fontWeight: "600" }}>No scans available.</p>
              <p>Scans from your database will appear here.</p>
            </div>
          ) : (
            scansList.map((scan) => (
              <div
                key={scan.scan_id}
                style={{
                  backgroundColor: "#f7f7f7",
                  padding: "18px",
                  borderRadius: "10px",
                  marginBottom: "15px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedScan(scan)}
              >
                <h3 style={{ margin: 0, color: "#075E68", fontSize: "20px", fontWeight: "700" }}>
                  {scan.scan_type} &nbsp; • &nbsp; {scan.status}
                </h3>
                <p style={{ margin: "10px 0", color: "#444", fontWeight: "600" }}>
                  Patient: {scan.patient_name}
                </p>
                <p style={{ margin: "10px 0", color: "#444", fontWeight: "600" }}>
                  Doctor: {scan.doctor_name} &nbsp; • &nbsp; Radiologist: {scan.radiologist_name}
                </p>
                <p style={{ margin: "10px 0", color: "#444", fontWeight: "600" }}>
                  Date: {scan.date} &nbsp; • &nbsp; Time: {scan.time}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ================= RIGHT SIDE: STATS BOXES ================= */}
      <div
        style={{
          width: "25%",
          display: "flex",
          flexDirection: "column",
          gap: "25px",
          marginTop: "45px",
        }}
      >
        {[
          ["Today's Scans", stats.today],
          ["Completed Today", stats.completed],
          ["Cancelled / No-Show", stats.cancelled],
          ["Pending Scan Reports", stats.pending],
        ].map(([label, value]) => (
          <div
            key={label}
            style={{
              backgroundColor: "#f0f0f0",
              padding: "25px",
              borderRadius: "12px",
            }}
          >
            <h3 style={{ color: "#075E68" }}>{label}</h3>
            <p style={{ fontSize: "24px", fontWeight: "600" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* ================= SCAN DETAILS POPUP ================= */}
      {selectedScan && (
        <div style={adminStyles.modalOverlay}>
          <div
            style={{
              ...adminStyles.modalContent,
              width: "600px",
              maxHeight: "110vh",
              overflowY: "auto",
            }}
          >
            <h2 style={{ color: "#075E68", textAlign: "center", marginBottom: 20 }}>
              Scan Details
            </h2>

            {/* INFO GRID */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                columnGap: "40px",
                rowGap: "20px",
                marginBottom: "25px",
              }}
            >
              <div>
                <p style={{ marginBottom: "14px" }}>
                  <strong>Scan Type:</strong> {selectedScan.scan_type || "—"}
                </p>
                <p style={{ marginBottom: "14px" }}>
                  <strong>Doctor:</strong> {selectedScan.doctor_name || "—"}
                </p>
                <p style={{ marginBottom: "14px" }}>
                  <strong>Date:</strong> {selectedScan.date || "—"}
                </p>
              </div>
              <div>
                <p style={{ marginBottom: "14px" }}>
                  <strong>Patient:</strong> {selectedScan.patient_name || "—"}
                </p>
                <p style={{ marginBottom: "14px" }}>
                  <strong>Radiologist:</strong> {selectedScan.radiologist_name || "—"}
                </p>
                <p style={{ marginBottom: "14px" }}>
                  <strong>Time:</strong> {selectedScan.time || "—"}
                </p>
              </div>
            </div>

            {/* SCAN IMAGES BUTTON */}
            {/* <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <button
                onClick={() => alert("DICOM Viewer will open here.")}
                style={{
                  backgroundColor: "#0A7C88",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Scan Images
              </button>
            </div> */}

            {/* REPORT TEXTAREA */}
            <div
              style={{
                backgroundColor: "#f8f8f8",
                padding: "15px",
                borderRadius: "8px",
                marginTop: "10px",
              }}
            >
              <h4 style={{ color: "#075E68", marginBottom: "10px" }}>Report</h4>
              <textarea
                value={selectedScan.report || ""}
                readOnly
                placeholder="No report available yet..."
                style={{
                  width: "100%",
                  minHeight: "200px",
                  maxWidth: "100%",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  padding: "10px",
                  fontFamily: "inherit",
                  resize: "vertical",
                  overflowY: "auto",
                  backgroundColor: "#fff"
                }}
              />
            </div>

            {/* CLOSE BUTTON */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "25px",
              }}
            >
              <button
                onClick={() => setSelectedScan(null)}
                style={{
                  backgroundColor: "white",
                  border: "2px solid #0A7C88",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  color: "#0A7C88",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}