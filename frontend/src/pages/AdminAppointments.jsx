import React, { useState, useEffect } from "react";
import { adminStyles } from "../styles/AdminStyles";

export default function AdminAppointments() {
  
  // --- STATE ---
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [activeTab, setActiveTab] = useState("records");

  // Stats State
  const [stats, setStats] = useState({
    today: 0,
    completed: 0,
    cancelled: 0,
    avgWait: "0 min"
  });

  // --- 1. FETCH LIST & STATS ON LOAD ---
  useEffect(() => {
    // A. Fetch Appointment List
    fetch("http://127.0.0.1:5000/api/admin/dashboard-appointments")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
            setAppointmentsList(data);
        }
      })
      .catch((err) => console.error("Error fetching appointments:", err));

    // B. Fetch Stats
    fetch("http://127.0.0.1:5000/api/admin/dashboard-appointments/stats")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setStats(data);
      })
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  // --- 2. FETCH DETAILS WHEN CLICKING AN APPOINTMENT ---
  const handleAppointmentClick = (appointment) => {
    // First, open the modal with the basic info we have
    setSelectedAppointment(appointment);

    // Then, fetch the full details (complaint, diagnosis, scans) from backend
    fetch(`http://127.0.0.1:5000/api/admin/dashboard-appointments/${appointment.id}/details`)
      .then((res) => res.json())
      .then((details) => {
        // Merge the new details into the selected appointment object
        setSelectedAppointment(prev => ({ ...prev, ...details }));
      })
      .catch((err) => console.error("Error fetching details:", err));
  };

  return (
    <div style={{ display: "flex", gap: "30px" }}>
      
      {/* ================= LEFT SIDE: APPOINTMENTS LIST ================= */}
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
        <h2 style={{ color: "#075E68", marginBottom: "20px" }}>Appointments</h2>

        <div
          style={{
            backgroundColor: "white",
            padding: "15px",
            borderRadius: "8px",
            height: "450px",
            overflowY: "auto",
          }}
        >
          {appointmentsList.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: "50px", color: "#888" }}>
              <p style={{ fontSize: "18px", fontWeight: "600" }}>No appointments available.</p>
              <p>Appointments from your database will appear here.</p>
            </div>
          ) : (
            appointmentsList.map((a) => (
              <div
                key={a.id}
                style={{
                  backgroundColor: "#f9f9f9",
                  padding: "20px 25px",
                  borderRadius: "12px",
                  marginBottom: "16px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  cursor: "pointer",
                  transition: "transform 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
                onClick={() => handleAppointmentClick(a)}
              >
                {/* LINE 1: Name + Status */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <h3 style={{ margin: 0, color: "#075E68", fontSize: "20px", fontWeight: "700" }}>
                    {a.patient_name}
                  </h3>
                  <span style={{ color: "#075E68", fontWeight: "700", fontSize: "20px" }}>
                    <span style={{ color: "#075E68", margin: "0 8px" }}>•</span> {a.status}
                  </span>
                </div>

                {/* LINE 2: Doctor + Reason */}
                <p style={{ margin: "4px 0 10px", color: "#444", fontSize: "16px", fontWeight: "600" }}>
                  Doctor: {a.doctor} <span style={{ color: "#075E68", margin: "0 8px" }}>•</span> Reason: {a.reason}
                </p>

                {/* LINE 3: Date + Time */}
                <p style={{ margin: "0", color: "#444", fontSize: "16px", fontWeight: "600" }}>
                  Date: {a.date} <span style={{ color: "#075E68", margin: "0 8px" }}>•</span> Time: {a.time}
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
          ["Today's Appointments", stats.today],
          ["Completed Today", stats.completed],
          ["Cancelled / No Show", stats.cancelled],
          ["Average Waiting Time", stats.avgWait],
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

      {/* ================= POPUP MODAL ================= */}
      {selectedAppointment && (
        <div style={adminStyles.modalOverlay}>
          <div
            style={{
              ...adminStyles.modalContent,
              width: "700px",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedAppointment(null)}
              style={{
                position: "absolute",
                top: "10px",
                right: "15px",
                background: "none",
                border: "none",
                fontSize: "22px",
                fontWeight: "bold",
                color: "#075E68",
                cursor: "pointer",
              }}
            >
              ×
            </button>

            <h2 style={{ color: "#075E68", textAlign: "center", marginBottom: "20px", marginTop: "10px" }}>
              Appointment Details
            </h2>

            {/* Tabs */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <button
                onClick={() => setActiveTab("records")}
                style={{
                  padding: "10px 25px",
                  borderTopLeftRadius: "6px",
                  borderBottomLeftRadius: "6px",
                  border: "1px solid #ccc",
                  backgroundColor: activeTab === "records" ? "#E7F4F5" : "#F9F9F9",
                  color: "#075E68",
                  cursor: "pointer",
                  fontWeight: activeTab === "records" ? "700" : "500",
                }}
              >
                Records
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                style={{
                  padding: "10px 25px",
                  borderTopRightRadius: "6px",
                  borderBottomRightRadius: "6px",
                  border: "1px solid #ccc",
                  backgroundColor: activeTab === "orders" ? "#E7F4F5" : "#F9F9F9",
                  color: "#075E68",
                  cursor: "pointer",
                  fontWeight: activeTab === "orders" ? "700" : "500",
                }}
              >
                Orders
              </button>
            </div>

            {/* Content: Records Tab */}
            {activeTab === "records" && (
              <div>
                {[
                  ["Complaint", "complaint"],
                  ["Physical Examination", "physical_exam"],
                  ["Diagnosis", "diagnosis"],
                  ["Treatment Plan", "treatment_plan"],
                ].map(([label, key]) => (
                  <div key={key} style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontWeight: "bold", color: "#075E68", marginBottom: "5px" }}>
                      {label}
                    </label>
                    <textarea
                      rows={2}
                      value={selectedAppointment[key] || "Loading..."}
                      readOnly
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        backgroundColor: "#f9f9f9"
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Content: Orders Tab */}
            {activeTab === "orders" && (
              <div>
                {[
                  ["Ordered Scans", "ordered_scans"],
                  ["Ordered Medications", "ordered_medications"],
                ].map(([label, key]) => (
                  <div key={key} style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontWeight: "bold", color: "#075E68", marginBottom: "5px" }}>
                      {label}
                    </label>
                    <textarea
                      rows={2}
                      value={selectedAppointment[key] || "Loading..."}
                      readOnly
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        backgroundColor: "#f9f9f9"
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}