import React, { useState } from "react";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "profile", label: "Profile" },
  { id: "appointments", label: "Appointments" },
  { id: "scan-results", label: "Scan Results" },
];

export default function PatientPage() {
  const [active, setActive] = useState("home");
  const activeItem = NAV_ITEMS.find((item) => item.id === active);
  const [showReserveModal, setShowReserveModal] = useState(false);

  const patientName = "Eman";
  const patientPicture = null;

  const appointments = [
    { id: 1, date: "12 Feb 2020", time: "10:00 AM", doctor: "Dr. Smith" },
    { id: 2, date: "13 Feb 2020", time: "11:30 AM", doctor: "Dr. Jones" },
  ];
  const scans = [
    { id: 1, date: "20 Feb 2020", time: "08:30 AM", modality: "MRI" },
    { id: 2, date: "21 Feb 2020", time: "09:00 AM", modality: "CT" },
  ];
  const medications = [
    { id: 1, name: "Panadol", dosage: "500 mg", duration: "7 days" },
    { id: 2, name: "Voltaren", dosage: "50 mg", duration: "5 days" },
  ];
  const testResults = [
    { id: 1, title: "CT Scan - Full Body", date: "12th February 2020" },
    { id: 2, title: "Lumbar MRI", date: "12th February 2020" },
  ];

  const handleTestResultClick = (result) => {
    console.log("Clicked test result:", result);
  };

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "white",
      display: "flex",
      flexDirection: "column",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      height: "80px",
      display: "flex",
      alignItems: "center",
      padding: "0 32px"
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: "12px"
    },
    logoIcon: {
      width: "32px",
      height: "32px",
      borderRadius: "12px",
      backgroundColor: "#0a586c",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "bold",
      fontSize: "16px"
    },
    logoText: {
      fontSize: "24px",
      fontWeight: "600",
      color: "#0a586c"
    },
    mainWrapper: {
      display: "flex",
      flex: 1
    },
    sidebar: {
      width: "256px",
      backgroundColor: "#0a586c",
      color: "white",
      display: "flex",
      flexDirection: "column",
      padding: "24px 20px",
      borderTopRightRadius: "72px"
    },
    nav: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      marginTop: "40px",
      flex: 1
    },
    navButton: {
      width: "100%",
      textAlign: "left",
      fontSize: "14px",
      padding: "10px 12px",
      borderRadius: "12px",
      transition: "all 0.15s",
      border: "none",
      cursor: "pointer",
      fontFamily: "inherit"
    },
    navButtonActive: {
      backgroundColor: "white",
      color: "#0a586c",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
    },
    navButtonInactive: {
      backgroundColor: "transparent",
      color: "#e0e9ff"
    },
    sidebarProfile: {
      marginTop: "24px",
      paddingTop: "16px",
      borderTop: "1px solid rgba(255,255,255,0.15)",
      display: "flex",
      alignItems: "center",
      gap: "12px"
    },
    profilePic: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: "rgba(255,255,255,0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "14px",
      fontWeight: "600",
      textTransform: "uppercase"
    },
    profileName: {
      fontSize: "14px",
      fontWeight: "500",
      color: "white"
    },
    main: {
      flex: 1,
      padding: "24px 32px"
    },
    pageTitle: {
      fontSize: "24px",
      fontWeight: "600",
      color: "#0a586c",
      marginBottom: "16px"
    },
    homeGrid: {
      display: "grid",
      gridTemplateColumns: "2fr 1.2fr",
      gridTemplateRows: "auto auto",
      gap: "24px",
      paddingBottom: "24px",
      position: "relative"
    },
    leftColumn: {
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      gridRow: "span 2",
      position: "relative"
    },
    card: {
      backgroundColor: "white",
      borderRadius: "16px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      border: "1px solid #f1f5f9",
      padding: "16px"
    },
    cardHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "12px"
    },
    cardTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#1e293b"
    },
    reserveButton: {
      fontSize: "12px",
      fontWeight: "500",
      backgroundColor: "#0a586c",
      color: "white",
      padding: "6px 16px",
      borderRadius: "20px",
      border: "none",
      cursor: "pointer",
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      transition: "background-color 0.2s"
    },
    tableContainer: {
      borderRadius: "12px",
      border: "1px solid #f1f5f9",
      maxHeight: "240px",
      overflowY: "auto"
    },
    table: {
      width: "100%",
      fontSize: "14px",
      borderCollapse: "collapse"
    },
    tableHead: {
      backgroundColor: "#d0f2fb",
      color: "#0a586c",
      position: "sticky",
      top: 0,
      zIndex: 10
    },
    th: {
      textAlign: "left",
      padding: "8px 16px",
      fontWeight: "500"
    },
    td: {
      padding: "8px 16px",
      color: "#475569",
      borderTop: "1px solid #f1f5f9"
    },
    medicationList: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      fontSize: "14px",
      color: "#475569",
      padding: "8px"
    },
    medCard: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      backgroundColor: "white",
      borderRadius: "16px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      border: "1px solid #f1f5f9",
      padding: "12px 16px"
    },
    medIcon: {
      width: "40px",
      height: "40px",
      borderRadius: "12px",
      backgroundColor: "rgba(10,88,108,0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px"
    },
    medName: {
      fontWeight: "600",
      color: "#1e293b"
    },
    medDetails: {
      fontSize: "12px",
      color: "#64748b"
    },
    testResultButton: {
      width: "100%",
      textAlign: "left",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      backgroundColor: "white",
      borderRadius: "16px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      border: "1px solid #f1f5f9",
      padding: "12px 16px",
      cursor: "pointer",
      transition: "background-color 0.2s",
      fontFamily: "inherit"
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.3)",
      zIndex: 40
    },
    modalContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 50
    },
    modalContent: {
      width: "100%",
      height: "100%",
      backgroundColor: "white",
      borderRadius: "16px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      border: "1px solid #e2e8f0",
      padding: "24px",
      position: "relative"
    },
    closeButton: {
      position: "absolute",
      top: "12px",
      right: "12px",
      color: "#94a3b8",
      fontSize: "18px",
      border: "none",
      background: "none",
      cursor: "pointer",
      transition: "color 0.2s"
    },
    modalTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#0a586c",
      marginBottom: "8px"
    },
    modalText: {
      fontSize: "14px",
      color: "#64748b",
      marginBottom: "16px"
    },
    placeholder: {
      height: "100%",
      borderRadius: "12px",
      border: "2px dashed #e2e8f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "12px",
      color: "#94a3b8"
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>O</div>
          <span style={styles.logoText}>Ortholink</span>
        </div>
      </header>

      <div style={styles.mainWrapper}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <nav style={styles.nav}>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(item.id)}
                style={{
                  ...styles.navButton,
                  ...(active === item.id ? styles.navButtonActive : styles.navButtonInactive)
                }}
                onMouseEnter={(e) => {
                  if (active !== item.id) {
                    e.target.style.backgroundColor = "rgba(255,255,255,0.15)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (active !== item.id) {
                    e.target.style.backgroundColor = "transparent";
                  }
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div style={styles.sidebarProfile}>
            <div style={styles.profilePic}>
              {patientName.charAt(0)}
            </div>
            <div>
              <span style={styles.profileName}>{patientName}</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main style={styles.main}>
          {active !== "home" && (
            <h1 style={styles.pageTitle}>{activeItem?.label}</h1>
          )}

          {active === "home" && (
            <div style={{ position: "relative" }}>
              <div style={styles.homeGrid}>
                {/* Left Column */}
                <div style={styles.leftColumn}>
                  {/* Appointments */}
                  <div style={styles.card}>
                    <div style={styles.cardHeader}>
                      <h2 style={styles.cardTitle}>Upcoming Appointments</h2>
                      <button
                        type="button"
                        onClick={() => setShowReserveModal(true)}
                        style={styles.reserveButton}
                        onMouseEnter={(e) => e.target.style.backgroundColor = "#074353"}
                        onMouseLeave={(e) => e.target.style.backgroundColor = "#0a586c"}
                      >
                        Reserve Appointment
                      </button>
                    </div>
                    <div style={styles.tableContainer}>
                      <table style={styles.table}>
                        <thead style={styles.tableHead}>
                          <tr>
                            <th style={styles.th}>Date</th>
                            <th style={styles.th}>Time</th>
                            <th style={styles.th}>Doctor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointments.map((appt) => (
                            <tr key={appt.id}>
                              <td style={styles.td}>{appt.date}</td>
                              <td style={styles.td}>{appt.time}</td>
                              <td style={styles.td}>{appt.doctor}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Scans */}
                  <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Upcoming Scans</h2>
                    <div style={{ ...styles.tableContainer, marginTop: "12px" }}>
                      <table style={styles.table}>
                        <thead style={styles.tableHead}>
                          <tr>
                            <th style={styles.th}>Date</th>
                            <th style={styles.th}>Time</th>
                            <th style={styles.th}>Modality</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scans.map((scan) => (
                            <tr key={scan.id}>
                              <td style={styles.td}>{scan.date}</td>
                              <td style={styles.td}>{scan.time}</td>
                              <td style={styles.td}>{scan.modality}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Modal Overlay */}
                  {showReserveModal && (
                    <div style={styles.modalContainer}>
                      <div style={styles.modalContent}>
                        <button
                          type="button"
                          onClick={() => setShowReserveModal(false)}
                          style={styles.closeButton}
                          onMouseEnter={(e) => e.target.style.color = "#475569"}
                          onMouseLeave={(e) => e.target.style.color = "#94a3b8"}
                        >
                          ✕
                        </button>
                        <h3 style={styles.modalTitle}>Reserve Appointment</h3>
                        <p style={styles.modalText}>
                          Placeholder panel sized to match Upcoming Appointments + Upcoming Scans.
                          We'll design the actual form here later.
                        </p>
                        <div style={styles.placeholder}>
                          Form &amp; controls for reservation will go here.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Medication */}
                <div style={styles.card}>
                  <h2 style={styles.cardTitle}>Medication</h2>
                  <div style={{ ...styles.tableContainer, marginTop: "12px" }}>
                    <div style={styles.medicationList}>
                      {medications.map((med) => (
                        <div key={med.id} style={styles.medCard}>
                          <div style={styles.medIcon}>💊</div>
                          <div>
                            <div style={styles.medName}>{med.name}</div>
                            <div style={styles.medDetails}>
                              {med.dosage} – {med.duration}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Test Results */}
                <div style={styles.card}>
                  <h2 style={styles.cardTitle}>Test Results</h2>
                  <div style={{ ...styles.tableContainer, marginTop: "12px" }}>
                    <div style={styles.medicationList}>
                      {testResults.map((result) => (
                        <button
                          key={result.id}
                          type="button"
                          onClick={() => handleTestResultClick(result)}
                          style={styles.testResultButton}
                          onMouseEnter={(e) => e.target.style.backgroundColor = "#f8fafc"}
                          onMouseLeave={(e) => e.target.style.backgroundColor = "white"}
                        >
                          <div style={styles.medIcon}>📋</div>
                          <div>
                            <div style={styles.medName}>{result.title}</div>
                            <div style={styles.medDetails}>{result.date}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Global Backdrop */}
              {showReserveModal && (
                <div style={styles.modalOverlay} />
              )}
            </div>
          )}

          {active !== "home" && (
            <p style={{ fontSize: "14px", color: "#64748b", marginTop: "8px" }}>
              This is the <span style={{ fontWeight: "600" }}>{activeItem?.label}</span> section of the{" "}
              <span style={{ fontWeight: "600" }}>patient</span> page.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}