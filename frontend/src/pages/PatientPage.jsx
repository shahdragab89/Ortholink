import React, { useState, useEffect, useRef } from "react";
import { patientStyles } from '../styles/patientStyles';

export default function PatientPage() {
  const NAV_ITEMS = [
    { id: "home", label: "Home" },
    { id: "visits", label: "Visits" },
    { id: "profile", label: "Profile" },
    
  ];

  const [active, setActive] = useState("home");
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [leftWidth, setLeftWidth] = useState("auto");
  const patientName = "Eman";
  const patientPicture = null;
  const leftCardRef = useRef(null);
  const [activePopup, setActivePopup] = useState(null);
  const [visitDetails, setVisitDetails] = useState(null);
  const [billingDetails, setBillingDetails] = useState(null);
  const [scanPhotos, setScanPhotos] = useState([]);
  const [currentScanIndex, setCurrentScanIndex] = useState(0);
  const [reportText, setReportText] = useState("");




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

  // Example: fetched from DB later
const pastVisits = [
  {
    date: "12 Nov 2025",
    doctor: "Dr. Smith",
    diagnosis: "Back pain",
    summary: "View",
    billing: "Paid",
  },
  {
    date: "02 Dec 2025",
    doctor: "Dr. Johnson",
    diagnosis: "Shoulder pain",
    summary: "View",
    billing: "Pending",
  },
  {
    date: "02 Dec 2025",
    doctor: "Dr. Johnson",
    diagnosis: "Shoulder pain",
    summary: "View",
    billing: "Pending",
  },{
    date: "02 Dec 2025",
    doctor: "Dr. Johnson",
    diagnosis: "Shoulder pain",
    summary: "View",
    billing: "Pending",
  },{
    date: "02 Dec 2025",
    doctor: "Dr. Johnson",
    diagnosis: "Shoulder pain",
    summary: "View",
    billing: "Pending",
  },
];

const previousScans = [
  {
    date: "08 Nov 2025",
    radiologist: "Dr. Emily",
    scan: "MRI",
    report: "Normal",
    billing: "Paid",
  },
  {
    date: "29 Oct 2025",
    radiologist: "Dr. Omar",
    scan: "CT",
    report: "Mild lesion",
    billing: "Pending",
  },
  {
    date: "29 Oct 2025",
    radiologist: "Dr. Omar",
    scan: "CT",
    report: "Mild lesion",
    billing: "Pending",
  },{
    date: "29 Oct 2025",
    radiologist: "Dr. Omar",
    scan: "CT",
    report: "Mild lesion",
    billing: "Pending",
  },{
    date: "29 Oct 2025",
    radiologist: "Dr. Omar",
    scan: "CT",
    report: "Mild lesion",
    billing: "Pending",
  },
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

  const handleTestResultClick = (r) =>
    alert(`Opening ${r.title} from ${r.date}`);

  return (
    <div style={patientStyles.container}>
      <header style={patientStyles.header}>
        <div style={patientStyles.logo}>
          <div style={patientStyles.logoIcon}>OL</div>
          <div style={patientStyles.logoText}>OrthoLink</div>
        </div>
      </header>

      <div style={patientStyles.layout}>
        <aside style={patientStyles.sidebar}>
          <div style={patientStyles.sidebarNav}>
            {NAV_ITEMS.map((item) => (
              <div
                key={item.id}
                style={patientStyles.sidebarItem(active === item.id)}
                onClick={() => setActive(item.id)}
              >
                {item.label}
              </div>
            ))}
          </div>

          <div style={patientStyles.sidebarFooter}>
            <div style={patientStyles.profilePic}>
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

        <main style={patientStyles.main}>
          {active === "home" && (
            <div style={patientStyles.grid}>
              {/* Top-left */}
              <div style={patientStyles.card} ref={leftCardRef}>
                <div style={patientStyles.cardHeader}>
                  <h3 style={patientStyles.cardTitle}>Upcoming Appointments</h3>
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
                <table style={patientStyles.table}>
                  <thead style={patientStyles.thead}>
                    <tr>
                      <th style={patientStyles.th}>Date</th>
                      <th style={patientStyles.th}>Time</th>
                      <th style={patientStyles.th}>Doctor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a.id}>
                        <td style={patientStyles.td}>{a.date}</td>
                        <td style={patientStyles.td}>{a.time}</td>
                        <td style={patientStyles.td}>{a.doctor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Top-right */}
              <div style={patientStyles.card}>
                <div style={patientStyles.cardHeader}>
                  <h3 style={patientStyles.cardTitle}>Medication</h3>
                </div>
                {medications.map((m) => (
                  <div key={m.id} style={patientStyles.medCard}>
                    <div style={patientStyles.medIcon}>💊</div>
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
              <div style={patientStyles.card}>
                <div style={patientStyles.cardHeader}>
                  <h3 style={patientStyles.cardTitle}>Upcoming Scans</h3>
                </div>
                <table style={patientStyles.table}>
                  <thead style={patientStyles.thead}>
                    <tr>
                      <th style={patientStyles.th}>Date</th>
                      <th style={patientStyles.th}>Time</th>
                      <th style={patientStyles.th}>Modality</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scans.map((s) => (
                      <tr key={s.id}>
                        <td style={patientStyles.td}>{s.date}</td>
                        <td style={patientStyles.td}>{s.time}</td>
                        <td style={patientStyles.td}>{s.modality}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom-right */}
              <div style={patientStyles.card}>
                <div style={patientStyles.cardHeader}>
                  <h3 style={patientStyles.cardTitle}>Test Results</h3>
                </div>
                {testResults.map((r) => (
                  <button
                    key={r.id}
                    style={patientStyles.testBtn}
                    onClick={() => handleTestResultClick(r)}
                  >
                    <div style={patientStyles.medIcon}>📋</div>
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
                  <div style={patientStyles.overlay} />
                </>
              )}
            </div>
          )}

{active === "visits" && (
  <div style={patientStyles.visitsContainer}>
    {/* ---- Past Visits ---- */}
    <h3 style={{ ...patientStyles.visitsTitle, color: "black" }}>Past Visits</h3>
    <div style={patientStyles.scrollableTableWrapper}>
      <table style={patientStyles.visitsTable}>
        <thead style={patientStyles.fixedThead}>
          <tr>
            <th style={patientStyles.visitsTh}>Date</th>
            <th style={patientStyles.visitsTh}>Doctor</th>
            <th style={patientStyles.visitsTh}>Diagnosis</th>
            <th style={patientStyles.visitsTh}>Visit Summary</th>
            <th style={patientStyles.visitsTh}>Billing</th>
          </tr>
        </thead>
        <tbody>
          {pastVisits.map((visit, index) => (
            <tr key={index}>
              <td style={patientStyles.visitsTd}>{visit.date}</td>
              <td style={patientStyles.visitsTd}>{visit.doctor}</td>
              <td style={patientStyles.visitsTd}>{visit.diagnosis}</td>
              <td
                style={patientStyles.clickableCell}
                onClick={() => {
                  setActivePopup({
                    type: "summary",
                    doctor: visit.doctor,
                    date: visit.date,
                  });
                  setVisitDetails({
                    complaint: "Lower back pain radiating to right leg",
                    physicalExam:
                      "Normal reflexes, mild tenderness on L4-L5 palpation",
                    treatmentPlan:
                      "Physiotherapy twice a week + posture correction",
                    medication: "Panadol 500 mg, twice daily",
                    scansOrdered: "MRI Lumbar spine",
                  });
                }}
              >
                {visit.summary}
              </td>
              <td
                style={patientStyles.clickableCell}
                onClick={() => {
                  setActivePopup({
                    type: "billing",
                    doctor: visit.doctor,
                    date: visit.date,
                  });
                  setBillingDetails({
                    total: 800,
                    paid: 500,
                    remaining: 300,
                    history: [
                      { date: "12 Nov 2025", amount: 300, method: "Cash" },
                      { date: "13 Nov 2025", amount: 200, method: "Visa" },
                    ],
                  });
                }}
              >
                {visit.billing}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* ---- Previous Scans ---- */}
    <h3
      style={{
        ...patientStyles.visitsTitle,
        color: "black",
        marginTop: 32,
      }}
    >
      Previous Scans
    </h3>
    <div style={patientStyles.scrollableTableWrapper}>
      <table style={patientStyles.visitsTable}>
        <thead style={patientStyles.fixedThead}>
          <tr>
            <th style={patientStyles.visitsTh}>Date</th>
            <th style={patientStyles.visitsTh}>Radiologist</th>
            <th style={patientStyles.visitsTh}>Scans</th>
            <th style={patientStyles.visitsTh}>Report</th>
            <th style={patientStyles.visitsTh}>Billing</th>
          </tr>
        </thead>
        <tbody>
          {previousScans.map((scan, index) => (
            <tr key={index}>
              <td style={patientStyles.visitsTd}>{scan.date}</td>
              <td style={patientStyles.visitsTd}>{scan.radiologist}</td>
              <td
                style={patientStyles.clickableCell}
                onClick={() => {
                  setActivePopup({
                    type: "scan",
                    doctor: scan.radiologist,
                    date: scan.date,
                  });
                  setScanPhotos([
                    "/Background.png",
                    "/xray.jpg",
                  ]);
                  setCurrentScanIndex(0);
                }}
              >
                {scan.scan}
              </td>
              <td
                style={patientStyles.clickableCell}
                onClick={() => {
                  setActivePopup({
                    type: "report",
                    doctor: scan.radiologist,
                    date: scan.date,
                  });
                  setReportText(
                    "Scan report shows no abnormal findings. Normal spinal alignment and disc hydration preserved."
                  );
                }}
              >
                {scan.report}
              </td>
              <td
                style={patientStyles.clickableCell}
                onClick={() => {
                  setActivePopup({
                    type: "billing",
                    doctor: scan.radiologist,
                    date: scan.date,
                  });
                  setBillingDetails({
                    total: 600,
                    paid: 600,
                    remaining: 0,
                    history: [
                      { date: "09 Nov 2025", amount: 600, method: "Cash" },
                    ],
                  });
                }}
              >
                {scan.billing}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* ---- Popup ---- */}
   {activePopup && (
  <>
    <div style={patientStyles.overlay} />
    <div
      style={{
        ...patientStyles.popupContainer,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          ...patientStyles.popup,
          width: activePopup.type === "scan" ? 800 : 500,
          minHeight: activePopup.type === "scan" ? 500 : 350,
        }}
      >
        <button
          onClick={() => setActivePopup(null)}
          style={patientStyles.closeBtn}
        >
          ✕
        </button>

        <h2 style={{ color: "#0a586c", marginBottom: 20 }}>
          {activePopup.type === "summary"
            ? "Visit Summary"
            : activePopup.type === "billing"
            ? "Billing Details"
            : activePopup.type === "scan"
            ? "Scan Viewer"
            : "Report Details"}
        </h2>

        {/* ---- Summary ---- */}
        {activePopup.type === "summary" && visitDetails && (
          <div style={patientStyles.viewArea}>
            <p style={{ marginBottom: 16 }}>
              <strong>Complaint:</strong><br />
              {visitDetails.complaint}
            </p>
            <p style={{ marginBottom: 16 }}>
              <strong>Physical Examination:</strong><br />
              {visitDetails.physicalExam}
            </p>
            <p style={{ marginBottom: 16 }}>
              <strong>Treatment Plan:</strong><br />
              {visitDetails.treatmentPlan}
            </p>
            <p style={{ marginBottom: 16 }}>
              <strong>Medication:</strong><br />
              {visitDetails.medication}
            </p>
            <p>
              <strong>Scans Ordered:</strong><br />
              {visitDetails.scansOrdered}
            </p>
          </div>
        )}

        {/* ---- Billing ---- */}
        {activePopup.type === "billing" && billingDetails && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <div>
                <strong>Total Amount:</strong>
                <div>{billingDetails.total} EGP</div>
              </div>
              <div>
                <strong>Paid Amount:</strong>
                <div>{billingDetails.paid} EGP</div>
              </div>
              <div>
                <strong>Remaining:</strong>
                <div>{billingDetails.remaining} EGP</div>
              </div>
            </div>

            <div style={patientStyles.scrollableTableWrapper}>
              <table style={patientStyles.visitsTable}>
                <thead style={patientStyles.fixedThead}>
                  <tr>
                    <th style={patientStyles.visitsTh}>Date</th>
                    <th style={patientStyles.visitsTh}>Paid Amount</th>
                    <th style={patientStyles.visitsTh}>Way of Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {billingDetails.history.map((p, i) => (
                    <tr key={i}>
                      <td style={patientStyles.visitsTd}>{p.date}</td>
                      <td style={patientStyles.visitsTd}>{p.amount}</td>
                      <td style={patientStyles.visitsTd}>{p.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ---- Scan Viewer ---- */}
        {/* ---- Scan Viewer ---- */}
{activePopup.type === "scan" && scanPhotos && (
  <div
    style={{
      textAlign: "center",
      position: "relative",
      width: "100%",
      height: "420px", // fixed height for image box
      background: "#f8fafc", // light neutral background
      borderRadius: 12,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    }}
  >
    <img
      src={scanPhotos[currentScanIndex] || "/xray.jpg"}
      alt="Scan"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain", // ✅ ensures full image fits without cropping
        borderRadius: 12,
      }}
    />

    {/* Navigation arrows */}
    <button
      style={patientStyles.arrowLeft}
      onClick={() =>
        setCurrentScanIndex((i) =>
          i === 0 ? scanPhotos.length - 1 : i - 1
        )
      }
    >
      ◀
    </button>
    <button
      style={patientStyles.arrowRight}
      onClick={() =>
        setCurrentScanIndex((i) =>
          i === scanPhotos.length - 1 ? 0 : i + 1
        )
      }
    >
      ▶
    </button>
  </div>
)}

        {/* ---- Report ---- */}
        {activePopup.type === "report" && reportText && (
          <div style={patientStyles.viewArea}>
            <p>{reportText}</p>
          </div>
        )}
      </div>
    </div>
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