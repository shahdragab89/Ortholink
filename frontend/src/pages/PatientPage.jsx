import React, { useState, useEffect, useRef } from "react";
import { PiHouseSimpleBold, PiUserBold, PiSignOutBold } from "react-icons/pi";
import { MdOutlineAssignment } from "react-icons/md"; // report/test icon


import { patientStyles } from '../styles/patientStyles';

export default function PatientPage() {

  const [personalInfo, setPersonalInfo] = useState({});
  const [contactInfo, setContactInfo] = useState({});
  const [emergencyInfo, setEmergencyInfo] = useState({});
  const [insuranceInfo, setInsuranceInfo] = useState({});
  
  const savePatientEdits = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("user_id");

      const payload = {
        first_name: personalInfo.name.split(" ")[0],
        last_name: personalInfo.name.split(" ")[1] || "",
        phone: contactInfo.phone,
        address: contactInfo.address,
        blood_type: personalInfo.bloodType,
        allergies: personalInfo.allergies,
        chronic_conditions: personalInfo.chronic,
        insurance_provider: insuranceInfo.provider,
        insurance_number: insuranceInfo.id,
        emergency_contact_name: emergencyInfo.name,
        emergency_contact_phone: emergencyInfo.number,
      };

      const res = await fetch(`http://127.0.0.1:5000/api/auth/edit_patient/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const userId = localStorage.getItem("user_id");

        if (!token || !userId) return;

        const res = await fetch(`http://127.0.0.1:5000/api/auth/patient/${userId}`, {
          headers: { "Authorization": `Bearer ${token}` },
        });

        const data = await res.json();
        console.log("Fetched data:", data); 

        setPersonalInfo({
          name: data.name,
          personalId: `P-${userId}`,
          hospitalId: "HSP-4556",
          gender: data.gender.toUpperCase(),
          dob: data.birth_date,
          bloodType: data.blood_type,
          allergies: data.allergies || "N/A",
          chronic: data.chronic_conditions || "N/A",
          photo: "/default-avatar.png"
        });

        setContactInfo({ phone: data.phone, address: data.address });
        setEmergencyInfo({ name: data.emergency_contact_name, number: data.emergency_contact_phone });
        setInsuranceInfo({ provider: data.insurance_provider, id: data.insurance_number, coverage: "N/A", validUntil: "N/A" });

      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientData();
  }, []);

 const NAV_ITEMS = [
  { id: "home", label: "Home", icon: <PiHouseSimpleBold size={22} color="#FFFFFF" /> },
  { id: "visits", label: "Visits", icon: <MdOutlineAssignment size={22} color="#FFFFFF" /> },
  { id: "profile", label: "Profile", icon: <PiUserBold size={22} color="#FFFFFF" /> },
  { id: "logout", label: "Logout", icon: <PiSignOutBold size={22} color="#FFFFFF" /> },
];


  const [active, setActive] = useState("home");
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [leftWidth, setLeftWidth] = useState("auto");
  const patientName = personalInfo.name || "loading.." ;
  const patientPicture = null;
  const leftCardRef = useRef(null);
  const [activePopup, setActivePopup] = useState(null);
  const [visitDetails, setVisitDetails] = useState(null);
  const [billingDetails, setBillingDetails] = useState(null);
  const [scanPhotos, setScanPhotos] = useState([]);
  const [currentScanIndex, setCurrentScanIndex] = useState(0);
  const [reportText, setReportText] = useState("");
  const [editingPersonal, setEditingPersonal] = useState(false);
const [editingContact, setEditingContact] = useState(false);
const [editingEmergency, setEditingEmergency] = useState(false);
const [editingInsurance, setEditingInsurance] = useState(false);
const [showChangePassword, setShowChangePassword] = useState(false);
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [passwordError, setPasswordError] = useState("");
const [selectedTest, setSelectedTest] = useState(null);
const [currentImageIndex, setCurrentImageIndex] = useState(0);



// const [personalInfo, setPersonalInfo] = useState({
//   name: "Eman Khaled",
//   personalId: "P-12345",
//   hospitalId: "HSP-4556",
//   gender: "Female",
//   dob: "1992-05-18",
//   bloodType: "A+",
//   allergies: "Penicillin",
//   chronic: "Osteoarthritis",
//   photo: "/default-avatar.png",
// });

// const [contactInfo, setContactInfo] = useState({
//   phone: "+20 1012345678",
//   address: "Cairo, Egypt",
// });

// const [emergencyInfo, setEmergencyInfo] = useState({
//   name: "Ahmed Khaled",
//   number: "+20 1023456789",
// });

// const [insuranceInfo, setInsuranceInfo] = useState({
//   provider: "Misr Life Insurance",
//   id: "INS-0458-7895",
//   coverage: "Orthopedic treatments up to 80%",
//   validUntil: "2026-12-31",
// });





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
  {
    id: 1,
    title: "CT Scan - Full Body",
    date: "12 Feb 2020",
    images: ["/Background.png", "/xray.jpg"],
    report: "CT scan shows no abnormality detected.",
  },
  {
    id: 2,
    title: "Lumbar MRI",
    date: "13 Feb 2020",
    images: ["/scans/mri1.png", "/scans/mri2.png"],
    report: "MRI reveals mild disc dehydration at L4-L5, no herniation.",
  },
];

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
  <div style={patientStyles.logoContainer}>
    <div style={patientStyles.logoCircle}>o</div>
    <div style={patientStyles.logoWord}>OrthoLink</div>
  </div>
</header>


      <div style={patientStyles.layout}>
        <aside style={patientStyles.sidebar}>
          <div style={patientStyles.sidebarNav}>
         {NAV_ITEMS.map((item) => (
  <div
    key={item.id}
    style={{
      ...patientStyles.sidebarItem(active === item.id),
      display: "flex",
      alignItems: "center",
      gap: 14,
      color: "white",
      fontSize: 15,
      fontWeight: 500,
      cursor: "pointer",
      padding: "12px 26px",
      marginLeft: "10px",
      transition: "all 0.2s ease",
    }}
    onClick={() => {
      if (item.id === "logout") {
        alert("Logging out...");
        return;
      }
      setActive(item.id);
    }}
    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
  >
    <span style={{ width: 24, display: "flex", justifyContent: "center" }}>{item.icon}</span>
    <span>{item.label}</span>
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
                   onClick={() => {
  setSelectedTest({
    ...r,
    images: ["/Background.png", "/xray.jpg"], 
    report:
      r.report ||
      "Scan report shows no abnormal findings. Normal spinal alignment and disc hydration preserved.",
  });
  setCurrentImageIndex(0);
}}

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

              {showReserveModal && (
  <>
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1001,
      }}
    >
      <ReserveAppointmentModal onClose={() => setShowReserveModal(false)} />
    </div>
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.25)",
        zIndex: 1000,
      }}
    />
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
            <td
  style={patientStyles.clickableCell}
  onClick={() => {
    setActivePopup({
      type: "diagnosis",
      doctor: visit.doctor,
      date: visit.date,
      diagnosis: visit.diagnosis,
    });
  }}
>
  View
</td>
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
      type: "billingDetailed",
      doctor: visit.doctor,
      date: visit.date,
      time: "10:30 AM",   // ← replace with DB variable
      amount: "500 EGP",  // ← replace with DB variable
      method: "Cash",     // ← replace with DB variable
    });
  }}
>
  View
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
      type: "billingDetailed",
      doctor: scan.radiologist,
      date: scan.date,
      time: "09:45 AM",   // ← replace with DB variable
      amount: "600 EGP",  // ← replace with DB variable
      method: "Visa",     // ← replace with DB variable
    });
  }}
>
  View
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
          width: activePopup.type === "scan" ? 800 
          :activePopup.type === "billingDetailed"
    ? 400
    : 500,
          minHeight: activePopup.type === "scan" ? 500 
          : activePopup.type === "billingDetailed"
    ? 280
           :350,
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
            : activePopup.type === "billingDetailed"
            ? "Billing Details"
            : activePopup.type === "scan"
            ? "Scan Viewer"
            : activePopup.type === "diagnosis"
            ? "Diagnosis Details"
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
{/* ---- Diagnosis Popup ---- */}
{activePopup.type === "diagnosis" && (
  <div style={patientStyles.viewArea}>
    <p style={{ marginBottom: 16 }}>
      <strong>Diagnosis:</strong><br />
      {activePopup.diagnosis}
    </p>
  </div>
)}

{/* ---- Billing Detailed Popup ---- */}
{activePopup.type === "billingDetailed" && (
  <div style={patientStyles.viewArea}>
    <p style={{ marginBottom: 16 }}><strong>Date:</strong> {activePopup.date}</p>
    <p style={{ marginBottom: 16 }}><strong>Time:</strong> {activePopup.time}</p>
    <p style={{ marginBottom: 16 }}><strong>Amount:</strong> {activePopup.amount}</p>
    <p style={{ marginBottom: 16 }}><strong>Way of Payment:</strong> {activePopup.method}</p>
  </div>
)}


        {/* ---- Scan Viewer ---- */}
{activePopup.type === "scan" && scanPhotos && (
  <div
    style={{
      textAlign: "center",
      position: "relative",
      width: "100%",
      height: "420px", 
      background: "#f8fafc", 
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
        objectFit: "contain", 
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
{active === "profile" && (
  <>
    {/* Profile Title Bar */}
    <div style={patientStyles.profileHeader}>
      <h2 style={patientStyles.profileTitle}>Profile</h2>

      {!(
        editingPersonal ||
        editingContact ||
        editingEmergency ||
        editingInsurance
      ) ? (
        <button
          onClick={() => {
            setEditingPersonal(true);
            setEditingContact(true);
            setEditingEmergency(true);
            setEditingInsurance(true);
          }}
          style={patientStyles.editButton}
        >
          Edit
        </button>
      ) : (
        <button
          onClick={async () => {
            await savePatientEdits();
            setEditingPersonal(false);
            setEditingContact(false);
            setEditingEmergency(false);
            setEditingInsurance(false);
            alert("Changes saved successfully!");
          }}
          style={patientStyles.editButton}
        >
          Save Changes
        </button>
      )}
    </div>

    <div style={patientStyles.profilePage}>
    </div>
  </>
)}


{active === "profile" && (
  <div style={patientStyles.profilePage}>
    
    {/* Left column */}
    <div style={patientStyles.leftColumn}>
      {/* Profile Photo */}
      <div style={patientStyles.profileCard}>
        <h3 style={patientStyles.cardTitle}>Profile Photo</h3>
        <img
          src={personalInfo.photo || "/default-avatar.png"}
          alt="Profile"
          style={patientStyles.profilePhoto}
        />
        <label htmlFor="photoUpload" style={patientStyles.uploadBtn}>
          Upload New Photo
        </label>
        <input
          id="photoUpload"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () =>
                setPersonalInfo({ ...personalInfo, photo: reader.result });
              reader.readAsDataURL(file);
            }
          }}
          style={{ display: "none" }}
        />
      </div>

      {/* Contact Information */}
      <div style={patientStyles.profileCard}>
        <div style={patientStyles.sectionHeader}>
          <h3 style={patientStyles.cardTitle}>Contact Information</h3>
          <i
            className="pi pi-pencil"
            style={patientStyles.editIcon}
            onClick={() => setEditingContact(!editingContact)}
          ></i>
        </div>
        <div style={patientStyles.infoRow}>
          <strong>Mobile Number:</strong>
          {editingContact ? (
            <input
              value={contactInfo.phone}
              onChange={(e) =>
                setContactInfo({ ...contactInfo, phone: e.target.value })
              }
              style={patientStyles.inputField}
            />
          ) : (
            <span>{contactInfo.phone}</span>
          )}
        </div>
        <div style={patientStyles.infoRow}>
          <strong>Address:</strong>
          {editingContact ? (
            <input
              value={contactInfo.address}
              onChange={(e) =>
                setContactInfo({ ...contactInfo, address: e.target.value })
              }
              style={patientStyles.inputField}
            />
          ) : (
            <span>{contactInfo.address}</span>
          )}
        </div>
      </div>

      {/* Emergency Contact */}
      <div style={patientStyles.profileCard}>
        <div style={patientStyles.sectionHeader}>
          <h3 style={patientStyles.cardTitle}>Emergency Contact</h3>
          <i
            className="pi pi-pencil"
            style={patientStyles.editIcon}
            onClick={() => setEditingEmergency(!editingEmergency)}
          ></i>
        </div>
        <div style={patientStyles.infoRow}>
          <strong>Contact Name:</strong>
          {editingEmergency ? (
            <input
              value={emergencyInfo.name}
              onChange={(e) =>
                setEmergencyInfo({ ...emergencyInfo, name: e.target.value })
              }
              style={patientStyles.inputField}
            />
          ) : (
            <span>{emergencyInfo.name}</span>
          )}
        </div>
        <div style={patientStyles.infoRow}>
          <strong>Contact Number:</strong>
          {editingEmergency ? (
            <input
              value={emergencyInfo.number}
              onChange={(e) =>
                setEmergencyInfo({ ...emergencyInfo, number: e.target.value })
              }
              style={patientStyles.inputField}
            />
          ) : (
            <span>{emergencyInfo.number}</span>
          )}
        </div>
      </div>
     {/* ---- Change Password Box ---- */}
<div style={patientStyles.changePasswordCard}>
  {!showChangePassword ? (
    <div
      style={{ cursor: "pointer", color: "#0A586C", fontWeight: 600 }}
      onClick={() => setShowChangePassword(true)}
    >
      Change Password
    </div>
  ) : (
    <>
      <div style={patientStyles.passwordRow}>
        <span style={patientStyles.passwordLabel}>Current Password:</span>
        <input
          type="password"
          style={patientStyles.passwordInput}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>
      <div style={patientStyles.passwordRow}>
        <span style={patientStyles.passwordLabel}>New Password:</span>
        <input
          type="password"
          style={patientStyles.passwordInput}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div style={patientStyles.passwordRow}>
        <span style={patientStyles.passwordLabel}>Confirm Password:</span>
        <input
          type="password"
          style={patientStyles.passwordInput}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {passwordError && (
        <div style={patientStyles.errorText}>{passwordError}</div>
      )}

      <button
        style={patientStyles.changePasswordButton}
        onClick={() => {
          if (newPassword !== confirmPassword) {
            setPasswordError("Passwords don't match");
          } else {
            setPasswordError("");
            alert("Password updated successfully!");
            setShowChangePassword(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
          }
        }}
      >
        Update Password
      </button>
    </>
  )}
</div>

    </div>
    

    {/* Right column */}
    <div style={patientStyles.rightColumn}>
      {/* Personal Information */}
      <div style={patientStyles.profileCard}>
        <div style={patientStyles.sectionHeader}>
          <h3 style={patientStyles.cardTitle}>Personal Information</h3>
          <i
            className="pi pi-pencil"
            style={patientStyles.editIcon}
            onClick={() => setEditingPersonal(!editingPersonal)}
          ></i>
        </div>
        {[
          ["Full Name", "name"],
          ["Personal ID", "personalId"],
          ["Hospital ID", "hospitalId"],
          ["Gender", "gender"],
          ["Birth Date", "dob"],
          ["Blood Type", "bloodType"],
          ["Allergies", "allergies"],
          ["Chronic Conditions", "chronic"],
        ].map(([label, key]) => (
          <div key={key} style={patientStyles.infoRow}>
            <strong>{label}:</strong>
            {editingPersonal ? (
              <input
                value={personalInfo[key]}
                onChange={(e) =>
                  setPersonalInfo({ ...personalInfo, [key]: e.target.value })
                }
                style={patientStyles.inputField}
              />
            ) : (
              <span>{personalInfo[key]}</span>
            )}
          </div>
        ))}
      </div>

      {/* Insurance Info */}
      <div style={patientStyles.profileCard}>
        <div style={patientStyles.sectionHeader}>
          <h3 style={patientStyles.cardTitle}>Insurance Information</h3>
          <i
            className="pi pi-pencil"
            style={patientStyles.editIcon}
            onClick={() => setEditingInsurance(!editingInsurance)}
          ></i>
        </div>
        {[
          ["Provider", "provider"],
          ["Insurance ID", "id"],
          ["Coverage", "coverage"],
          ["Valid Until", "validUntil"],
        ].map(([label, key]) => (
          <div key={key} style={patientStyles.infoRow}>
            <strong>{label}:</strong>
            {editingInsurance ? (
              <input
                value={insuranceInfo[key]}
                onChange={(e) =>
                  setInsuranceInfo({ ...insuranceInfo, [key]: e.target.value })
                }
                style={patientStyles.inputField}
              />
            ) : (
              <span>{insuranceInfo[key]}</span>
            )}
          </div>
        ))
        }
        
      </div>
      
    </div>
    
  </div>

  
)}
{/* ---- END of profile section ---- */}

{/* ---- Scan + Report Popup ---- */}
{selectedTest && (
  <>
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 999,
      }}
      onClick={() => setSelectedTest(null)}
    />

    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "80%",        
        maxWidth: 1100,     
        background: "white",
        borderRadius: 16,
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        zIndex: 1000,
        display: "flex",
        overflow: "hidden",
        height: 560,          
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Left - Image Viewer */}
      <div
        style={{
          flex: "70%",
          background: "#f8fafc",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={
            selectedTest.images?.[currentImageIndex] ||
            "/xray.jpg"
          }
          alt="Scan"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            borderRadius: 12,
          }}
        />

        {/* Navigation arrows */}
        <button
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            background: "#0a586c",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: 42,
            height: 42,
            fontSize: 20,
            cursor: "pointer",
          }}
          onClick={() =>
            setCurrentImageIndex((i) =>
              i === 0
                ? selectedTest.images.length - 1
                : i - 1
            )
          }
        >
          ‹
        </button>
        <button
          style={{
            position: "absolute",
            right: 14,
            top: "50%",
            transform: "translateY(-50%)",
            background: "#0a586c",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: 42,
            height: 42,
            fontSize: 20,
            cursor: "pointer",
          }}
          onClick={() =>
            setCurrentImageIndex((i) =>
              i === selectedTest.images.length - 1
                ? 0
                : i + 1
            )
          }
        >
          ›
        </button>
      </div>

      {/* Right - Report */}
      <div
        style={{
          flex: "30%",
          padding: 28,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3 style={{ color: "#0a586c", marginBottom: 16 }}>
            {selectedTest.title || "Scan Report"}
          </h3>
          <p style={{ color: "#333", lineHeight: 1.6 }}>
            {selectedTest.report}
          </p>
        </div>
        <button
          onClick={() => setSelectedTest(null)}
          style={{
            alignSelf: "flex-end",
            background: "#0a586c",
            color: "white",
            border: "none",
            borderRadius: 10,
            padding: "10px 20px",
            cursor: "pointer",
            fontSize: 15,
          }}
        >
          Close
        </button>
      </div>
    </div>
  </>
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
        minHeight: "600px",
        maxHeight: "90vh",       
        minWidth: "600px",            
        maxWidth: "900vh",       
        padding: 24,
        border: "1px solid #e2e8f0",
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        overflowY: "auto",
        position: "relative",
        transform: "translateX(-10%)",
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
            rows={3}
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