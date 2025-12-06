import React, { useState, useEffect, useRef } from "react";

export default function PatientPage() {
  const NAV_ITEMS = [
    { id: "home", label: "Home" },
    { id: "profile", label: "Profile" },
    { id: "appointments", label: "Appointments" },
    { id: "scan-results", label: "Scan Results" },
  ];

  const [active, setActive] = useState("home");
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [leftWidth, setLeftWidth] = useState("auto");
  const patientName = "Eman";
  const patientPicture = null;
  const leftCardRef = useRef(null);

  const appointments = [
    { id: 1, date: "12 Feb 2020", time: "10:00 AM", doctor: "Dr. Smith" },
    { id: 2, date: "13 Feb 2020", time: "11:30 AM", doctor: "Dr. Jones" },
    { id: 3, date: "14 Feb 2020", time: "01:00 PM", doctor: "Dr. Brown" },
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
    { id: 1, title: "CT Scan - Full Body", date: "12 Feb 2020" },
    { id: 2, title: "Lumbar MRI", date: "13 Feb 2020" },
  ];

 // set scrollbar color exactly to the image shade (#C9F1FB)
useEffect(() => {
  const style = document.createElement("style");
  style.innerHTML = `
    *::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    *::-webkit-scrollbar-track {
      background: #C9F1FB; /* exact sampled color */
      border-radius: 8px;
    }
    *::-webkit-scrollbar-thumb {
      background: #0A586C; /* teal thumb */
      border-radius: 8px;
      border: 1px solid #C9F1FB;
    }
    *::-webkit-scrollbar-thumb:hover {
      background: #084C5E; /* darker on hover */
    }
    * {
      scrollbar-color: #0A586C #C9F1FB;
      scrollbar-width: thin;
    }
    html { direction: rtl; }  /* move scrollbar left */
    body * { direction: ltr; } /* keep text normal */
  `;
  document.head.appendChild(style);
  return () => style.remove();
}, []);


  // measure actual width of upper-left card
  useEffect(() => {
    if (leftCardRef.current) {
      setLeftWidth(`${leftCardRef.current.offsetWidth}px`);
    }
    const handleResize = () => {
      if (leftCardRef.current) {
        setLeftWidth(`${leftCardRef.current.offsetWidth}px`);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "white",
      display: "flex",
      flexDirection: "column",
    },
    header: {
      height: 80,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 32px",
    },
    logo: { display: "flex", alignItems: "center", gap: 12 },
    logoIcon: {
      width: 32,
      height: 32,
      borderRadius: 12,
      backgroundColor: "#0a586c",
      color: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontWeight: 700,
    },
    logoText: { fontWeight: 600, color: "#0f172a" },
    layout: { display: "flex", flex: 1 },
    sidebar: {
      width: 250,
      backgroundColor: "#0a586c",
      padding: "24px 20px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      borderTopRightRadius: "24px",
    },
    sidebarNav: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
      marginTop: 30,
    },
    sidebarItem: (active) => ({
      padding: "10px 12px",
      borderRadius: 12,
      cursor: "pointer",
      fontSize: 14,
      color: "white",
      backgroundColor: active ? "#083f4d" : "transparent",
    }),
    sidebarFooter: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      gap: 10,
      paddingTop: 16,
      marginTop: 24,
    },
    profilePic: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      backgroundColor: "rgba(255,255,255,0.3)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontWeight: 600,
      textTransform: "uppercase",
      color: "white",
    },
    main: { flex: 1, padding: "24px 32px" },
    grid: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gridTemplateRows: "auto auto",
      gap: 24,
      position: "relative",
    },
    card: {
      background: "white",
      border: "1px solid #f1f5f9",
      borderRadius: 16,
      padding: 16,
      height: 240,
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },
    cardTitle: { margin: 0 },
    table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
    thead: {
      backgroundColor: "#d0f2fb",
      color: "#0a586c",
      position: "sticky",
      top: 0,
    },
    th: { padding: "8px 16px", textAlign: "left" },
    td: { padding: "8px 16px", borderTop: "1px solid #f1f5f9" },
    medCard: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      border: "1px solid #f1f5f9",
      padding: 12,
      borderRadius: 12,
      marginBottom: 10,
    },
    medIcon: {
      width: 35,
      height: 35,
      borderRadius: 10,
      background: "rgba(10,88,108,0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 18,
    },
    testBtn: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: 12,
      borderRadius: 12,
      border: "1px solid #f1f5f9",
      marginBottom: 10,
      cursor: "pointer",
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.25)",
      zIndex: 40,
    },
  };

  const handleTestResultClick = (r) =>
    alert(`Opening ${r.title} from ${r.date}`);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>OL</div>
          <div style={styles.logoText}>OrthoLink</div>
        </div>
      </header>

      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <div style={styles.sidebarNav}>
            {NAV_ITEMS.map((item) => (
              <div
                key={item.id}
                style={styles.sidebarItem(active === item.id)}
                onClick={() => setActive(item.id)}
              >
                {item.label}
              </div>
            ))}
          </div>

          <div style={styles.sidebarFooter}>
            <div style={styles.profilePic}>
              {patientPicture ? (
                <img
                  src={patientPicture}
                  alt={patientName}
                  style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                />
              ) : (
                patientName.charAt(0)
              )}
            </div>
            <div style={{ color: "white" }}>{patientName}</div>
          </div>
        </aside>

        <main style={styles.main}>
          {active === "home" && (
            <div style={styles.grid}>
              {/* Top-left */}
              <div style={styles.card} ref={leftCardRef}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Upcoming Appointments</h3>
                  <button
                    onClick={() => setShowReserveModal(true)}
                    style={{
                      background: "#0a586c",
                      color: "white",
                      border: "none",
                      borderRadius: 16,
                      padding: "8px 20px",
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    Reserve an Appointment
                  </button>
                </div>
                <table style={styles.table}>
                  <thead style={styles.thead}>
                    <tr>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Time</th>
                      <th style={styles.th}>Doctor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a.id}>
                        <td style={styles.td}>{a.date}</td>
                        <td style={styles.td}>{a.time}</td>
                        <td style={styles.td}>{a.doctor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Top-right */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Medication</h3>
                </div>
                {medications.map((m) => (
                  <div key={m.id} style={styles.medCard}>
                    <div style={styles.medIcon}>💊</div>
                    <div>
                      <div>{m.name}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        {m.dosage} – {m.duration}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom-left */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Upcoming Scans</h3>
                </div>
                <table style={styles.table}>
                  <thead style={styles.thead}>
                    <tr>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Time</th>
                      <th style={styles.th}>Modality</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scans.map((s) => (
                      <tr key={s.id}>
                        <td style={styles.td}>{s.date}</td>
                        <td style={styles.td}>{s.time}</td>
                        <td style={styles.td}>{s.modality}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom-right */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Test Results</h3>
                </div>
                {testResults.map((r) => (
                  <button
                    key={r.id}
                    style={styles.testBtn}
                    onClick={() => handleTestResultClick(r)}
                  >
                    <div style={styles.medIcon}>📋</div>
                    <div>
                      <div>{r.title}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        {r.date}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Popup */}
              {showReserveModal && (
                <>
                  <div
                    style={{
                      position: "absolute",
                      top: "-40px",
                      left: 0,
                      width: leftWidth, // exact same width as upper-left card
                      height: "calc(240px * 2 + 24px)",
                      zIndex: 50,
                    }}
                  >
                    <ReserveAppointmentModal
                      onClose={() => setShowReserveModal(false)}
                    />
                  </div>
                  <div style={styles.overlay} />
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function ReserveAppointmentModal({ onClose }) {
  const [reason, setReason] = useState("");
  const [view, setView] = useState("main");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [billing, setBilling] = useState("cash");
  const [monthOffset, setMonthOffset] = useState(0);

  const baseDate = new Date();
  const current = new Date(baseDate.getFullYear(), baseDate.getMonth() + monthOffset, 1);
  const year = current.getFullYear();
  const month = current.getMonth();
  const monthName = current.toLocaleString("default", { month: "long" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // placeholder doctors
  const doctors = useRef(generateDoctors()).current;
  function generateDoctors() {
    const names = ["Dr. Smith", "Dr. Johnson", "Dr. Brown", "Dr. Lee", "Dr. Taylor"];
    const roles = ["Orthopedic", "Radiologist", "Neurologist", "Physician", "Cardiologist"];
    return names.map((n, i) => ({
      id: i,
      name: n,
      role: roles[i],
      shifts: Array.from({ length: 31 }, (_, d) =>
        Math.random() < 0.3
          ? { day: d + 1, times: ["09:00 AM", "11:00 AM", "01:30 PM"].filter(() => Math.random() < 0.7) }
          : null
      ).filter(Boolean),
    }));
  }

  const selectedDoc = selectedDoctor != null ? doctors.find((d) => d.id === selectedDoctor) : null;
  const firstDay = new Date(year, month, 1).getDay();
  const calendarDays = Array.from({ length: daysInMonth + firstDay }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  );

  // scrollbars on left
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      *::-webkit-scrollbar { width: 8px; height: 8px; }
      *::-webkit-scrollbar-track { background: #e9f6fb; border-radius: 8px; }
      *::-webkit-scrollbar-thumb { background: #0a586c; border-radius: 8px; }
      * { scrollbar-color: #0a586c #e9f6fb; scrollbar-width: thin; }
      html { direction: rtl; }
      body * { direction: ltr; }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        height: "115%",
        width: "100%",
        padding: 24,
        border: "1px solid #e2e8f0",
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        overflowY: "auto",
        position: "relative",
      }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          border: "none",
          background: "none",
          fontSize: 22,
          cursor: "pointer",
          color: "#64748b",
        }}
      >
        ✕
      </button>

      <h2 style={{ color: "#0a586c", marginBottom: 16 }}>Reserve an Appointment</h2>
      {view === "main" && (
        <>
          <h3 style={{ color: "#0a586c", marginBottom: 16 }}>Reason for the visit</h3>
          <textarea
            placeholder="Describe your reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              marginBottom: 10,
            }}
          />

          <h3 style={{ color: "#0a586c", marginTop: 5, marginBottom: 12}}>Choose a Doctor</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {doctors.map((doc) => (
              <div
                key={doc.id}
                onClick={() => {
                  setSelectedDoctor(doc.id);
                  setView("calendar");
                }}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  padding: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "#d0f2fb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                  }}
                >
                  {doc.name.charAt(3)}
                </div>
                <div>
                  <div>{doc.name}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{doc.role}</div>
                </div>
              </div>
            ))}
          </div>

          {/* reserved summary */}
          {selectedDoc && selectedDate && selectedTime && (
            <div
              style={{
                background: "#d4fadd",
                padding: 10,
                borderRadius: 8,
                marginBottom: 20,
                color: "#0a586c",
                fontWeight: 500,
              }}
            >
              Reserved with {selectedDoc.name} at {selectedDate} {monthName} {year}, {selectedTime}
            </div>
          )}

          {/* billing inline */}
          <div style={{ marginTop: 25 }}>
  <h3 style={{ color: "#0a586c", marginBottom: 10 }}>Billing</h3>
  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
    <label>
      <input
        type="radio"
        checked={billing === "cash"}
        onChange={() => setBilling("cash")}
      />{" "}
      Cash
    </label>
    <label>
      <input
        type="radio"
        checked={billing === "card"}
        onChange={() => setBilling("card")}
      />{" "}
      Credit Card
    </label>
  </div>
</div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={onClose}
              style={{
                marginTop: 20,
                padding: "8px 20px",
                background: "#0a586c",
                color: "white",
                border: "none",
                borderRadius: 16,
                cursor: "pointer",
              }}
            >
              Reserve
            </button>
          </div>
        </>
      )}

      {/* Calendar */}
      {view === "calendar" && selectedDoc && (
        <>
          <div style={{ height: 16 }}></div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <button
              onClick={() => setView("main")}
              style={{
                border: "none",
                background: "none",
                color: "#0a586c",
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              ← Go Back
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#0a586c" }}>
              <span
                onClick={() => setMonthOffset((p) => p - 1)}
                style={{ cursor: "pointer", fontWeight: 700, fontSize: 18 }}
              >
                ‹
              </span>
              <h3 style={{ margin: 0 }}>
                {monthName} {year} — {selectedDoc.name}
              </h3>
              <span
                onClick={() => setMonthOffset((p) => p + 1)}
                style={{ cursor: "pointer", fontWeight: 700, fontSize: 18 }}
              >
                ›
              </span>
            </div>

            <div style={{ width: 70 }}></div>
          </div>

          {/* weekdays */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              textAlign: "center",
              fontWeight: 600,
              marginTop: 10,
            }}
          >
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* days grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 6,
              marginTop: 8,
            }}
          >
            {calendarDays.map((day, idx) => {
              if (day === null) return <div key={idx} style={{ minHeight: 70 }}></div>;
              const shift = selectedDoc.shifts.find((s) => s.day === day);
              const isAvailable = Boolean(shift);
              const isSelected = selectedDate === day;

              return (
                <div
                  key={day}
                  onClick={() => isAvailable && setSelectedDate(day)}
                  style={{
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    background: isAvailable
                      ? isSelected
                        ? "#b5f5c6"
                        : "#d4fadd"
                      : "white",
                    textAlign: "center",
                    padding: 8,
                    minHeight: 70,
                    cursor: isAvailable ? "pointer" : "default",
                    overflowY: "auto",
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{day}</div>
                  {isSelected &&
                    shift?.times.map((t) => (
                      <div
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        style={{
                          marginTop: 4,
                          background:
                            selectedTime === t ? "#0a586c" : "rgba(10,88,108,0.15)",
                          color: selectedTime === t ? "white" : "#0a586c",
                          borderRadius: 6,
                          padding: "2px 4px",
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        {t}
                      </div>
                    ))}
                </div>
              );
            })}
          </div>

          {/* done */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => setView("main")}
              style={{
                marginTop: 20,
                padding: "8px 20px",
                background: "#0a586c",
                color: "white",
                border: "none",
                borderRadius: 16,
                cursor: "pointer",
              }}
            >
              Done
            </button>
          </div>
        </>
      )}
    </div>
  );
}
