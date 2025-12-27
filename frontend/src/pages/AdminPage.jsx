import React, { useState } from "react";
import { adminStyles } from "../styles/AdminStyles";
import AdminHome from "./AdminHome";
import AdminAppointments from "./AdminAppointments";
import AdminScans from "./AdminScans";
import { useEffect } from "react";


export default function AdminPage() {

  // ================== SIDEBAR MENU ITEMS ==================
  const menuItems = [
    { id: "home", label: "Home" },
    { id: "doctors", label: "Doctors" },
    { id: "radiologists", label: "Radiologists" },
    { id: "patients", label: "Patients" },
    { id: "scans", label: "Scans" },
    { id: "appointments", label: "Appointments" },
  ];

  // ================== STATE VARIABLES ==================
  const [selected, setSelected] = useState("home");

  const [showPassword, setShowPassword] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Doctors page data
  // for the cards 
  const [doctorsList, setDoctorsList] = useState([]);

  // for the selected doctor
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  // for new doctor
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    photo: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    professional_title: "",
    doctor_id: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    medical_license: "",
    hire_date: "",
    birth_date: "",
    gender: "",
  });

  // the four right boxes
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [appointmentCapacity, setAppointmentCapacity] = useState(0);
  const [totalReports, setTotalReports] = useState(0);
  const [avgVisitDuration, setAvgVisitDuration] = useState(0);

 

// Fetch all doctors from backend on load
useEffect(() => {
  fetch("http://127.0.0.1:5000/api/admin/doctors")
    .then((res) => res.json())
    .then((data) => {
      setDoctorsList(data);
      setTotalDoctors(data.length);
    })
    .catch((err) => console.error("Error fetching doctors:", err));
}, []);

useEffect(() => {
  fetch("http://127.0.0.1:5000/api/admin/doctors/stats")
    .then(res => res.json())
    .then(data => {
      setTotalDoctors(data.total_doctors);
      setAppointmentCapacity(data.appointment_capacity);
      setTotalReports(data.total_reports);
      setAvgVisitDuration(data.avg_visit_duration);
    })
    .catch(err => console.error("Error fetching doctor stats:", err));
}, []);


const saveDoctor = (doctorData, isEdit = false) => {
  const formData = new FormData();
  for (const key in doctorData) {
    if (key !== "photo" && key !== "photoFile" && doctorData[key])
      formData.append(key, doctorData[key]);
  }
  if (doctorData.photoFile) formData.append("photo", doctorData.photoFile);

  const url = isEdit
    ? `http://127.0.0.1:5000/api/admin/doctors/${doctorData.id}`
    : "http://127.0.0.1:5000/api/admin/doctors";

  fetch(url, {
    method: isEdit ? "PUT" : "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.message) {
        alert("✅ Doctor saved successfully!");
        fetch("http://127.0.0.1:5000/api/admin/doctors")
          .then((r) => r.json())
          .then((docs) => setDoctorsList(docs));
        setSelectedDoctor(null);
        setShowAddDoctor(false);
      } else {
        alert("⚠️ " + (data.error || "Operation failed"));
      }
    })
    .catch((err) => console.error(err));
};



  


 // ================== RADIOLOGIST STATE VARIABLES ==================

//  for radiologist cards
const [radiologistsList, setRadiologistsList] = useState([]);

// for selected radiologists
const [selectedRadiologist, setSelectedRadiologist] = useState(null);

// for new radiologists
const [showAddRadiologist, setShowAddRadiologist] = useState(false);
const [newRadiologist, setNewRadiologist] = useState({});
// Open the Add Radiologist popup with cleared fields
const handleAddRadiologist = () => {
  setNewRadiologist({
    first_name: "",
    middle_name: "",
    last_name: "",
    username: "",
    radiologist_id: "",
    email: "",
    password_hash: "",
    license_number: "",
    professional_title: "",
    hire_date: "",
    phone: "",
    address: "",
    birth_date: "",
    gender: "",
    photo: "",
  });
  setShowAddRadiologist(true);
};

// Radiologist statistics (right-side boxes)
const [totalRadiologists, setTotalRadiologists] = useState(0);
const [scanCapacity, setScanCapacity] = useState(0);
const [frequentScanType, setFrequentScanType] = useState("");
const [avgScanDuration, setAvgScanDuration] = useState(0);

// Fetch radiologists list
useEffect(() => {
  fetch("http://127.0.0.1:5000/api/admin/radiologists")
    .then((res) => res.json())
    .then((data) => {
      setRadiologistsList(data);
      setTotalRadiologists(data.length);
    })
    .catch((err) => console.error("Error fetching radiologists:", err));
}, []);

// Fetch radiologist stats
useEffect(() => {
  fetch("http://127.0.0.1:5000/api/admin/radiologists/stats")
    .then((res) => res.json())
    .then((data) => {
      setTotalRadiologists(data.total_radiologists);
      setScanCapacity(data.scan_capacity);
      setFrequentScanType(data.frequent_scan_type);
      setAvgScanDuration(data.avg_scan_duration);
    })
    .catch((err) => console.error("Error fetching radiologist stats:", err));
}, []);

const saveRadiologist = (radiologistData, isEdit = false) => {
  const formData = new FormData();
  for (const key in radiologistData) {
    if (key !== "photo" && key !== "photoFile" && radiologistData[key])
      formData.append(key, radiologistData[key]);
  }
  if (radiologistData.photoFile) formData.append("photo", radiologistData.photoFile);

  const url = isEdit
    ? `http://127.0.0.1:5000/api/admin/radiologists/${radiologistData.id}`
    : "http://127.0.0.1:5000/api/admin/radiologists";

  fetch(url, {
    method: isEdit ? "PUT" : "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.message) {
        alert("✅ Radiologist saved successfully!");
        fetch("http://127.0.0.1:5000/api/admin/radiologists")
          .then((r) => r.json())
          .then((rads) => setRadiologistsList(rads));
        setSelectedRadiologist(null);
        setShowAddRadiologist(false);
      } else {
        alert("⚠️ " + (data.error || "Operation failed"));
      }
    })
    .catch((err) => console.error(err));
};


 
// ============== SCANS PAGE STATE ==============

// cards
const [scansList, setScansList] = useState([]);

// selected one
const [selectedScan, setSelectedScan] = useState(null);

// four right boxes
const [todaysScans, setTodaysScans] = useState(0);
const [completedScansToday, setCompletedScansToday] = useState(0);
const [cancelledScansToday, setCancelledScansToday] = useState(0);
const [pendingScanReports, setPendingScanReports] = useState(0);


// ============ APPOINTMENTS STATE VARIABLES ============
// cards
const [appointmentsList, setAppointmentsList] = useState([]);

// selected one
const [selectedAppointment, setSelectedAppointment] = useState(null);
const [activeTab, setActiveTab] = useState("records");

// 4 right boxes
const [todayAppointments, setTodayAppointments] = useState(0);
const [completedToday, setCompletedToday] = useState(0);
const [cancelledToday, setCancelledToday] = useState(0);
const [avgWaitingTime, setAvgWaitingTime] = useState(0);

// ======================= PATIENTS PAGE CONSTANTS =======================
const [patientsList, setPatientsList] = useState([
  {
      patient_id: 1,
      name: "John Doe",
      age: 45,
      gender: "Male",
      last_diagnosis: "Lumbar Disc Herniation",
      last_visit: "2025-12-10",
      last_scan: "2025-12-12",
    },
    {
      patient_id: 2,
      name: "Sarah Ali",
      age: 34,
      gender: "Female",
      last_diagnosis: "Cervical Strain",
      last_visit: "2025-12-20",
      last_scan: "2025-12-22",
    },
  
  ]);          // All patients for cards
const [selectedPatient, setSelectedPatient] = useState(null);  // One selected patient
const [editPatientMode, setEditPatientMode] = useState(false); // Toggle editing mode

const [patientStats, setPatientStats] = useState({
  total: 0,
  active30d: 0,
  pendingBills: 0,
  followups: 0,
}); // Stats cards

const [patientAppointments, setPatientAppointments] = useState([
  {
      date: "2025-12-10",
      doctor: "Dr. Ali",
      reason: "Back pain",
      diagnosis: "Disc herniation",
      medication: "Ibuprofen",
      scan: "MRI Spine",
    },
    {
      date: "2025-12-20",
      doctor: "Dr. Samir",
      reason: "Follow-up",
      diagnosis: "Improved",
      medication: "None",
      scan: "N/A",
    },
    {
      date: "2025-12-20",
      doctor: "Dr. Samir",
      reason: "Follow-up",
      diagnosis: "Improved",
      medication: "None",
      scan: "N/A",
    },
    {
      date: "2025-12-20",
      doctor: "Dr. Samir",
      reason: "Follow-up",
      diagnosis: "Improved",
      medication: "None",
      scan: "N/A",
    },
]);  // Appointments for selected patient
const [patientScans, setPatientScans] = useState([
  {
      date: "2025-12-12",
      radiologist: "Dr. Rami",
      scan_name: "MRI Spine",
      report: "Mild disc protrusion observed.",
    },
    {
      date: "2025-12-22",
      radiologist: "Dr. Mariam",
      scan_name: "X-Ray Shoulder",
      report: "No fracture detected.",
    },
    {
      date: "2025-12-22",
      radiologist: "Dr. Mariam",
      scan_name: "X-Ray Shoulder",
      report: "No fracture detected.",
    },
    {
      date: "2025-12-22",
      radiologist: "Dr. Mariam",
      scan_name: "X-Ray Shoulder",
      report: "No fracture detected.",
    },
  
]);                // Scans for selected patient

const [showReportModal, setShowReportModal] = useState(false);
const [activeReport, setActiveReport] = useState(null);




  return (
    <div style={adminStyles.layout}>

      {/* ======================= SIDEBAR ======================= */}
      <aside style={adminStyles.sidebar}>
        
        {/* LOGO */}
        <div style={adminStyles.logoContainer}>
          <div style={adminStyles.logoCircle}>O</div>
          <span style={adminStyles.logoText}>OrthoLink</span>
        </div>

        {/* MENU */}
        <ul style={adminStyles.menuList}>
          {menuItems.map((item) => (
            <li key={item.id} style={adminStyles.menuItem}>
              <button
                onClick={() => setSelected(item.id)}
                style={{
                  ...adminStyles.menuButton,
                  backgroundColor:
                    selected === item.id ? "#ffffff33" : "transparent",
                  cursor: "pointer",
                  border: "none",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#0F8190")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor =
                    selected === item.id ? "#ffffff33" : "transparent")
                }
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

      </aside>


      {/* ======================= MAIN CONTENT ======================= */}
      <main style={adminStyles.mainContent}>
        <h1 style={adminStyles.pageTitle}></h1>
        {/* ======================= HOME PAGE ======================= */}
  {selected === "home" && (
     <AdminHome />
  )}


        {/* ======================= DOCTORS PAGE ======================= */}
        {selected === "doctors" && (
          <div style={{ display: "flex", gap: "30px" }}>

            {/* LEFT BOX — Doctors List */}
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

              <h2 style={{ color: "#075E68", marginBottom: "20px" }}>Doctors</h2>

              {/* Add Doctor Button */}
              <button
              onClick={() => {
    // Reset form to empty every time we open the popup
    setNewDoctor({
      photo: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      username: "",
      doctor_id: "",
      email: "",
      password_hash: "",
      medical_license: "",
      professional_title: "",
      hire_date: "",
      phone: "",
      address: "",
      birth_date: "",
      gender: "",
    });
    setShowAddDoctor(true);
  }}
                style={{
                  position: "absolute",
                  top: "25px",
                  right: "25px",
                  backgroundColor: "#086F7A",
                  padding: "10px 18px",
                  borderRadius: "30px",
                  border: "none",
                  color: "white",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Add Doctor
              </button>

              {/* Doctors list */}
              <div
                style={{
                  backgroundColor: "white",
                  padding: "15px",
                  borderRadius: "8px",
                  height: "450px",
                  overflowY: "auto",
                }}
              >

                {doctorsList.length === 0 ? (
                  <p style={{ color: "#555" }}>No doctors available…</p>
                ) : (
                  doctorsList.map((doctor) => (
                    <div
                      key={doctor.id}
                      style={{
                        backgroundColor: "#f7f7f7",
                        padding: "18px",
                        borderRadius: "10px",
                        marginBottom: "15px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        cursor: "pointer",
                      }}
                      onClick={() => {
  setSelectedDoctor(doctor);
}}


                    >
                      <h3
                        style={{
                          margin: 0,
                          color: "#075E68",
                          fontSize: "20px",
                          fontWeight: "700",
                        //   textDecoration: "underline",
                        }}
                      >
                        {doctor.name}
                      </h3>

                      <p style={{ margin: "10px 0px", color: "#444", fontWeight: "600"}}>
                        {doctor.professional_title}   &nbsp; • &nbsp;  {doctor.status}
                      </p>

                      <p style={{ margin: "10px 0", color: "#444",fontWeight: "600" }}>
                        Schedule: {doctor.schedule}
                      </p>

                      <p style={{ margin: "10px 0", color: "#444" ,fontWeight: "600"}}>
                        Patients (30d): {doctor.patients30d} &nbsp; • &nbsp;  Revenue (30d):{" "}
                        {doctor.revenue30d}  
                      </p>

                    </div>
                  ))
                )}

              </div>
            </div>


            {/* RIGHT BOX — Stats */}
            <div
              style={{
                width: "25%",
                display: "flex",
                flexDirection: "column",
                gap: "25px",
                marginTop: "44px",
              }}
            >

              <div style={{ backgroundColor: "#f0f0f0", padding: "25px", borderRadius: "12px" }}>
                <h3 style={{ color: "#075E68" }}>Total number of Doctors</h3>
                <p style={{ fontSize: "24px", fontWeight: "600" }}>{totalDoctors}</p>
              </div>

              <div style={{ backgroundColor: "#f0f0f0", padding: "25px", borderRadius: "12px" }}>
                <h3 style={{ color: "#075E68" }}>Appointment Capacity</h3>
                <p style={{ fontSize: "24px", fontWeight: "600" }}>{appointmentCapacity}</p>
              </div>

              <div style={{ backgroundColor: "#f0f0f0", padding: "25px", borderRadius: "12px" }}>
                <h3 style={{ color: "#075E68" }}>Total number of Reports</h3>
                <p style={{ fontSize: "24px", fontWeight: "600" }}>{totalReports}</p>
              </div>

              <div style={{ backgroundColor: "#f0f0f0", padding: "25px", borderRadius: "12px" }}>
                <h3 style={{ color: "#075E68" }}>Average visit duration</h3>
                <p style={{ fontSize: "24px", fontWeight: "600" }}>{avgVisitDuration}</p>
              </div>

            </div>

          </div>
        )}

     {/* ========== POPUP MODAL ========== */}
     {/* =================== DOCTOR POPUP =================== */}
{selectedDoctor && (
  <div style={adminStyles.modalOverlay}>
    <div
      style={{
        ...adminStyles.modalContent,
        width: "650px",
        maxHeight: "90vh",
        overflowY: "auto",
      }}
    >
      <h2 style={{ color: "#075E68", textAlign: "center", marginBottom: 20 }}>
        Doctor Profile
      </h2>

      {/* PROFILE PICTURE */}
      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <img
        src={
  selectedDoctor.photo?.startsWith("blob:")
    ? selectedDoctor.photo
    : selectedDoctor.photo?.startsWith("http")
    ? selectedDoctor.photo
    : selectedDoctor.photo
    ? `http://127.0.0.1:5000/${selectedDoctor.photo}`
    : "/placeholder-doctor.png"
}


          alt={selectedDoctor.name}
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid #075E68",
            display: "block",
            margin: "0 auto 10px",
          }}
        />
        {editMode && (
          <input
            type="file"
            onChange={(e) => {
  const file = e.target.files[0];
  if (file) {
    const previewURL = URL.createObjectURL(file);
    setSelectedDoctor({ ...selectedDoctor, photoFile: file, photo: previewURL });
  }
}}

          />
        )}
      </div>

      {/* TWO-COLUMN GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          columnGap: "30px",
          rowGap: "16px",
        }}
      >
        {/* LEFT SIDE */}
        <div>
          {[
            ["Name", "name"],
            ["Professional Title", "professional_title"],
            ["Medical License", "medical_license"],
            ["Schedule Time", "schedule"],
            ["Doctor ID", "doctor_id"],
            ["Phone", "phone"],
          ].map(([label, key, type]) => (
            <div key={key} style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "bold",
                  color: "#075E68",
                  marginBottom: "5px",
                }}
              >
                {label}
              </label>
              {editMode ? (
                <input
                  type={type || "text"}
                  value={selectedDoctor[key] || ""}
                  onChange={(e) =>
                    setSelectedDoctor({ ...selectedDoctor, [key]: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #888",
                  }}
                />
              ) : (
                <span>{selectedDoctor[key] || "—"}</span>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div>
          {[
            ["Username", "username"],
            ["Email", "email"],
          ].map(([label, key, type]) => (
            <div key={key} style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "bold",
                  color: "#075E68",
                  marginBottom: "5px",
                }}
              >
                {label}
              </label>
              {editMode ? (
                <input
                  type={type || "text"}
                  value={selectedDoctor[key] || ""}
                  onChange={(e) =>
                    setSelectedDoctor({ ...selectedDoctor, [key]: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #888",
                  }}
                />
              ) : (
                <span>{selectedDoctor[key] || "—"}</span>
              )}
            </div>
          ))}

          {/* PASSWORD FIELD WITH EYE ICON */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                color: "#075E68",
                marginBottom: "5px",
              }}
            >
              Password (Hashed)
            </label>

            {editMode ? (
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={selectedDoctor.password_hash || ""}
                  onChange={(e) =>
                    setSelectedDoctor({
                      ...selectedDoctor,
                      password_hash: e.target.value,
                    })
                  }
                  placeholder="Enter hashed password"
                  style={{
                    width: "100%",
                    padding: "8px 40px 8px 8px",
                    borderRadius: "6px",
                    border: "1px solid #888",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "20px",
                    color: "#075E68",
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      fill="none"
                      stroke="#075E68"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.05-2.9 3.05-5.26 5.65-6.71M1 1l22 22" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      fill="none"
                      stroke="#075E68"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
                    </svg>
                  )}
                </button>
              </div>
            ) : (
              <span>
                {showPassword
                  ? selectedDoctor.password_hash || "—"
                  : "••••••••"}
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                    marginLeft: "8px",
                    color: "#075E68",
                  }}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="#075E68"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.05-2.9 3.05-5.26 5.65-6.71M1 1l22 22" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="#075E68"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
                    </svg>
                  )}
                </button>
              </span>
            )}
          </div>

          {/* Remaining fields */}
          {[
            ["Hire Date", "hire_date", "date"],
            ["Birth Date", "birth_date", "date"],
            ["Address", "address"],
          ].map(([label, key, type]) => (
            <div key={key} style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "bold",
                  color: "#075E68",
                  marginBottom: "5px",
                }}
              >
                {label}
              </label>
              {editMode ? (
                <input
                  type={type || "text"}
                  value={selectedDoctor[key] || ""}
                  onChange={(e) =>
                    setSelectedDoctor({ ...selectedDoctor, [key]: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #888",
                  }}
                />
              ) : (
                <span>{selectedDoctor[key] || "—"}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* BUTTONS */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "25px",
        }}
      >
        {!editMode ? (
          <>
            <button
              onClick={() => setEditMode(true)}
              style={{
                backgroundColor: "#0A7C88",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                color: "white",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Edit
            </button>
            <button
              onClick={() => setSelectedDoctor(null)}
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
          </>
        ) : (
          <>
            <button
 onClick={() => saveDoctor(selectedDoctor, true)}
  style={{
    backgroundColor: "#0A7C88",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
    marginRight: "10px",
  }}
>
  Save
</button>

            <button
              onClick={() => setEditMode(false)}
              style={{
                backgroundColor: "white",
                border: "2px solid #0A7C88",
                padding: "10px 20px",
                borderRadius: "6px",
                color: "#0A7C88",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  </div>
)}


{/* =================== ADD DOCTOR POPUP =================== */}
{showAddDoctor && (
  <div style={adminStyles.modalOverlay}>
    <div
      style={{
        ...adminStyles.modalContent,
        width: "750px",
        maxHeight: "90vh",
        overflowY: "auto",
      }}
    >
      <h2 style={{ color: "#075E68", textAlign: "center", marginBottom: 20 }}>
        Add New Doctor
      </h2>

      {/* PROFILE PICTURE */}
      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <img
         src={
              newDoctor.photo?.startsWith("blob:")
                ? newDoctor.photo
                : newDoctor.photo?.startsWith("http")
                ? newDoctor.photo
                : newDoctor.photo
                ? `http://127.0.0.1:5000/${newDoctor.photo}`
                : "/placeholder-doctor.png"
            }


          alt="Doctor"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid #075E68",
            display: "block",
            margin: "0 auto 10px",
          }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
  const file = e.target.files[0];
  if (file) {
    const previewURL = URL.createObjectURL(file);
    setNewDoctor({ ...newDoctor, photoFile: file, photo: previewURL });
  }
}}


        />
      </div>

      {/* TWO-COLUMN GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          columnGap: "30px",
          rowGap: "16px",
        }}
      >
        {/* LEFT SIDE */}
        <div>
          {[
            ["First Name", "first_name"],
            ["Middle Name", "middle_name"],
            ["Last Name", "last_name"],
            ["Username", "username"],
            ["Doctor ID", "doctor_id"],
            ["Email", "email"],
          ].map(([label, key, type]) => (
            <div key={key} style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "bold",
                  color: "#075E68",
                  marginBottom: "5px",
                }}
              >
                {label}
              </label>
              <input
                type={type || "text"}
                value={newDoctor[key] || ""}
                onChange={(e) =>
                  setNewDoctor({ ...newDoctor, [key]: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #888",
                }}
              />
            </div>
          ))}

          {/* PASSWORD FIELD WITH EYE ICON */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                color: "#075E68",
                marginBottom: "5px",
              }}
            >
              Password
            </label>

            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={newDoctor.password_hash || ""}
                onChange={(e) =>
                  setNewDoctor({ ...newDoctor, password_hash: e.target.value })
                }
                placeholder="Enter password"
                style={{
                  width: "100%",
                  padding: "8px 40px 8px 8px",
                  borderRadius: "6px",
                  border: "1px solid #888",
                  boxSizing: "border-box",
                }}
              />

              {/* EYE ICON TOGGLE */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "20px",
                  color: "#075E68",
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="none"
                    stroke="#075E68"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.05-2.9 3.05-5.26 5.65-6.71M1 1l22 22" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="none"
                    stroke="#075E68"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div>
          {[
            ["Medical License", "medical_license"],
            ["Professional Title", "professional_title"],
            ["Hire Date", "hire_date", "date"],
            ["Phone Number", "phone"],
            ["Address", "address"],
            ["Birth Date", "birth_date", "date"],
          ].map(([label, key, type]) => (
            <div key={key} style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "bold",
                  color: "#075E68",
                  marginBottom: "5px",
                }}
              >
                {label}
              </label>
              <input
                type={type || "text"}
                value={newDoctor[key] || ""}
                onChange={(e) =>
                  setNewDoctor({ ...newDoctor, [key]: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #888",
                }}
              />
            </div>
          ))}

          {/* GENDER RADIO */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                color: "#075E68",
                marginBottom: "5px",
              }}
            >
              Gender
            </label>
            <div>
              <label style={{ marginRight: "20px" }}>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={newDoctor.gender === "Male"}
                  onChange={() =>
                    setNewDoctor({ ...newDoctor, gender: "Male" })
                  }
                />{" "}
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={newDoctor.gender === "Female"}
                  onChange={() =>
                    setNewDoctor({ ...newDoctor, gender: "Female" })
                  }
                />{" "}
                Female
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* BUTTONS */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "25px",
        }}
      >
        <button
  onClick={() => saveDoctor(newDoctor, false)}


          style={{
            backgroundColor: "#0A7C88",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Save
        </button>
        <button
          onClick={() => setShowAddDoctor(false)}
          style={{
            backgroundColor: "white",
            border: "2px solid #0A7C88",
            padding: "10px 20px",
            borderRadius: "6px",
            color: "#0A7C88",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}





{/* ======================= RADIOLOGISTS PAGE ======================= */}
{selected === "radiologists" && (
  <div style={{ display: "flex", gap: "30px" }}>
    {/* LEFT SIDE – Radiologists list */}
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
      <h2 style={{ color: "#075E68", marginBottom: "20px" }}>Radiologists</h2>

      {/* Add Radiologist Button */}
      <button
        style={{
          position: "absolute",
          top: "25px",
          right: "25px",
          backgroundColor: "#086F7A",
          padding: "10px 18px",
          borderRadius: "30px",
          border: "none",
          color: "white",
          fontSize: "14px",
          cursor: "pointer",
        }}
       onClick={() => {
  setNewRadiologist({
    photo: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    username: "",
    radiologist_id: "",
    email: "",
    password_hash: "",
    medical_license: "",
    professional_title: "",
    hire_date: "",
    phone: "",
    address: "",
    birth_date: "",
    gender: "",
    schedule: "",
  });
  setShowAddRadiologist(true);
}}

      >
        Add Radiologist
      </button>

     {/* Radiologist cards list */}
<div
  style={{
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "8px",
    height: "450px",
    overflowY: "auto",
  }}
>
  {radiologistsList.length === 0 ? (
    <p style={{ color: "#555" }}>No radiologists available…</p>
  ) : (
    radiologistsList.map((r) => (
      <div
        key={r.id}
        style={{
          backgroundColor: "#f7f7f7",
          padding: "18px",
          borderRadius: "10px",
          marginBottom: "15px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          cursor: "pointer",
        }}
        onClick={() => {
          setSelectedRadiologist(r);
          setEditMode(false);
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "#075E68",
            fontSize: "20px",
            fontWeight: "700",
          }}
        >
          {r.name}
        </h3>
        <p style={{ margin: "10px 0", color: "#444", fontWeight: "600" }}>
          {r.professional_title} &nbsp; • &nbsp; {r.status}
        </p>
        <p style={{ margin: "10px 0", color: "#444", fontWeight: "600" }}>
          Schedule: {r.schedule}
        </p>
        <p style={{ margin: "10px 0", color: "#444", fontWeight: "600" }}>
          volume (30d): {r.volume30d} &nbsp; • &nbsp;
          Revenue (30d): {r.revenue30d}
        </p>
      </div>
    ))
  )}
</div>

    </div>

    {/* RIGHT SIDE – Stats boxes */}
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
  ["Total Radiologists", totalRadiologists ?? 0],
  ["Scan Capacity", scanCapacity ?? 0],
  ["Frequent Scan Type", frequentScanType || "X-Ray"],
  ["Average Scan Duration", avgScanDuration ?? 0],
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
    <p style={{ fontSize: "24px", fontWeight: "600" }}>
      {value !== undefined && value !== null && value !== "" ? value : 0}
    </p>
  </div>
))}
    </div>
  </div>
)}

{/* =================== RADIOLOGIST POPUP =================== */}
{selectedRadiologist && (
  <div style={adminStyles.modalOverlay}>
    <div
      style={{
        ...adminStyles.modalContent,
        width: "650px",
        maxHeight: "90vh",
        overflowY: "auto",
      }}
    >
      <h2 style={{ color: "#075E68", textAlign: "center", marginBottom: 20 }}>
        Radiologist Profile
      </h2>

      {/* PROFILE PICTURE */}
      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <img
         src={
    selectedRadiologist.photo?.startsWith("blob:")
      ? selectedRadiologist.photo
      : selectedRadiologist.photo?.startsWith("http")
      ? selectedRadiologist.photo
      : selectedRadiologist.photo
      ? `http://127.0.0.1:5000/${selectedRadiologist.photo}`
      : "/placeholder-radiologist.png"
  }

          alt={selectedRadiologist.name}
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid #075E68",
            display: "block",
            margin: "0 auto 10px",
          }}
        />
        {editMode && (
          <input
            type="file"
            onChange={(e) => {
  const file = e.target.files[0];
  if (file) {
    const previewURL = URL.createObjectURL(file);
    setSelectedRadiologist({ ...selectedRadiologist, photoFile: file, photo: previewURL });

  }
}}

          />
        )}
      </div>

      {/* TWO-COLUMN GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          columnGap: "30px",
          rowGap: "16px",
        }}
      >
        {/* LEFT SIDE */}
        <div>
          {[
            ["Name", "name"],
            ["Professional Title", "professional_title"],
            ["Medical License", "medical_license"],
            ["Schedule Time", "schedule"],
            ["Radiologist ID", "radiologist_id"],
            ["Phone", "phone"],
          ].map(([label, key, type]) => (
            <div key={key} style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "bold",
                  color: "#075E68",
                  marginBottom: "5px",
                }}
              >
                {label}
              </label>
              {editMode ? (
                <input
                  type={type || "text"}
                  value={selectedRadiologist[key] || ""}
                  onChange={(e) =>
                    setSelectedRadiologist({
                      ...selectedRadiologist,
                      [key]: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #888",
                  }}
                />
              ) : (
                <span>{selectedRadiologist[key] || "—"}</span>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div>
          {[["Username", "username"], ["Email", "email"]].map(
            ([label, key, type]) => (
              <div key={key} style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    color: "#075E68",
                    marginBottom: "5px",
                  }}
                >
                  {label}
                </label>
                {editMode ? (
                  <input
                    type={type || "text"}
                    value={selectedRadiologist[key] || ""}
                    onChange={(e) =>
                      setSelectedRadiologist({
                        ...selectedRadiologist,
                        [key]: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #888",
                    }}
                  />
                ) : (
                  <span>{selectedRadiologist[key] || "—"}</span>
                )}
              </div>
            )
          )}

          {/* PASSWORD FIELD WITH EYE ICON */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                color: "#075E68",
                marginBottom: "5px",
              }}
            >
              Password 
            </label>

            {editMode ? (
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={selectedRadiologist.password_hash || ""}
                  onChange={(e) =>
                    setSelectedRadiologist({
                      ...selectedRadiologist,
                      password_hash: e.target.value,
                    })
                  }
                  placeholder="Enter password"
                  style={{
                    width: "100%",
                    padding: "8px 40px 8px 8px",
                    borderRadius: "6px",
                    border: "1px solid #888",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "20px",
                    color: "#075E68",
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      fill="none"
                      stroke="#075E68"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.05-2.9 3.05-5.26 5.65-6.71M1 1l22 22" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      fill="none"
                      stroke="#075E68"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
                    </svg>
                  )}
                </button>
              </div>
            ) : (
              <span>
                {showPassword
                  ? selectedRadiologist.password_hash || "—"
                  : "—"}
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                    marginLeft: "8px",
                    color: "#075E68",
                  }}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="#075E68"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.05-2.9 3.05-5.26 5.65-6.71M1 1l22 22" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="#075E68"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
                    </svg>
                  )}
                </button>
              </span>
            )}
          </div>

          {[["Hire Date", "hire_date", "date"], ["Birth Date", "birth_date", "date"], ["Address", "address"]].map(
            ([label, key, type]) => (
              <div key={key} style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    color: "#075E68",
                    marginBottom: "5px",
                  }}
                >
                  {label}
                </label>
                {editMode ? (
                  <input
                    type={type || "text"}
                    value={selectedRadiologist[key] || ""}
                    onChange={(e) =>
                      setSelectedRadiologist({
                        ...selectedRadiologist,
                        [key]: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #888",
                    }}
                  />
                ) : (
                  <span>{selectedRadiologist[key] || "—"}</span>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* BUTTONS */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "25px" }}>
        {!editMode ? (
          <>
            <button
              onClick={() => setEditMode(true)}
              style={{
                backgroundColor: "#0A7C88",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                color: "white",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Edit
            </button>
            <button
              onClick={() => setSelectedRadiologist(null)}
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
          </>
        ) : (
          <>
           <button
  onClick={() => {
    saveRadiologist(selectedRadiologist, true);
  }}
  style={{
    backgroundColor: "#0A7C88",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
    marginRight: "10px",
  }}
>
  Save
</button>

            <button
              onClick={() => setEditMode(false)}
              style={{
                backgroundColor: "white",
                border: "2px solid #0A7C88",
                padding: "10px 20px",
                borderRadius: "6px",
                color: "#0A7C88",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  </div>
)}

{/* =================== ADD RADIOLOGIST POPUP =================== */}
{showAddRadiologist && (
  <div style={adminStyles.modalOverlay}>
    <div
      style={{
        ...adminStyles.modalContent,
        width: "750px",
        maxHeight: "90vh",
        overflowY: "auto",
      }}
    >
      <h2 style={{ color: "#075E68", textAlign: "center", marginBottom: 20 }}>
        Add New Radiologist
      </h2>

      {/* PROFILE PICTURE */}
      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <img
          src={
  newRadiologist.photo?.startsWith("blob:")
    ? newRadiologist.photo
    : newRadiologist.photo?.startsWith("http")
    ? newRadiologist.photo
    : newRadiologist.photo
    ? `http://127.0.0.1:5000/${newRadiologist.photo}`
    : "/placeholder-radiologist.png"
}

          alt="Radiologist"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid #075E68",
            display: "block",
            margin: "0 auto 10px",
          }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
  const file = e.target.files[0];
  if (file) {
    const previewURL = URL.createObjectURL(file);
    setNewRadiologist({ ...newRadiologist, photoFile: file, photo: previewURL });
  }
}}
 
        />
      </div>

      {/* TWO-COLUMN GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          columnGap: "30px",
          rowGap: "16px",
        }}
      >
        {/* LEFT SIDE */}
        <div>
          {[
            ["First Name", "first_name"],
            ["Middle Name", "middle_name"],
            ["Last Name", "last_name"],
            ["Username", "username"],
            ["Radiologist ID", "radiologist_id"],
            ["Email", "email"],
          ].map(([label, key, type]) => (
            <div key={key} style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "bold",
                  color: "#075E68",
                  marginBottom: "5px",
                }}
              >
                {label}
              </label>
              <input
                type={type || "text"}
                value={newRadiologist[key] || ""}
                onChange={(e) =>
                  setNewRadiologist({ ...newRadiologist, [key]: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #888",
                }}
              />
            </div>
          ))}

          {/* PASSWORD FIELD WITH EYE ICON */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                color: "#075E68",
                marginBottom: "5px",
              }}
            >
              Password
            </label>

            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={newRadiologist.password_hash || ""}
                onChange={(e) =>
                  setNewRadiologist({
                    ...newRadiologist,
                    password_hash: e.target.value,
                  })
                }
                placeholder="Enter password"
                style={{
                  width: "100%",
                  padding: "8px 40px 8px 8px",
                  borderRadius: "6px",
                  border: "1px solid #888",
                  boxSizing: "border-box",
                }}
              />

              {/* EYE ICON TOGGLE */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "20px",
                  color: "#075E68",
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="none"
                    stroke="#075E68"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.05-2.9 3.05-5.26 5.65-6.71M1 1l22 22" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="none"
                    stroke="#075E68"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div>
          {[
            ["Medical License", "medical_license"],
            ["Professional Title", "professional_title"],
            ["Hire Date", "hire_date", "date"],
            ["Phone Number", "phone"],
            ["Address", "address"],
            ["Birth Date", "birth_date", "date"],
          ].map(([label, key, type]) => (
            <div key={key} style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "bold",
                  color: "#075E68",
                  marginBottom: "5px",
                }}
              >
                {label}
              </label>
              <input
                type={type || "text"}
                value={newRadiologist[key] || ""}
                onChange={(e) =>
                  setNewRadiologist({ ...newRadiologist, [key]: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #888",
                }}
              />
            </div>
          ))}

          {/* GENDER RADIO */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                color: "#075E68",
                marginBottom: "5px",
              }}
            >
              Gender
            </label>
            <div>
              <label style={{ marginRight: "20px" }}>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={newRadiologist.gender === "Male"}
                  onChange={() =>
                    setNewRadiologist({ ...newRadiologist, gender: "Male" })
                  }
                />{" "}
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={newRadiologist.gender === "Female"}
                  onChange={() =>
                    setNewRadiologist({ ...newRadiologist, gender: "Female" })
                  }
                />{" "}
                Female
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* BUTTONS */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "25px",
        }}
      >
        <button
         onClick={() => saveRadiologist(newRadiologist, false)}
          style={{
            backgroundColor: "#0A7C88",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Save
        </button>
        <button
          onClick={() => setShowAddRadiologist(false)}
          style={{
            backgroundColor: "white",
            border: "2px solid #0A7C88",
            padding: "10px 20px",
            borderRadius: "6px",
            color: "#0A7C88",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}




{/* ======================= SCANS PAGE ======================= */}
{selected === "scans" && <AdminScans />}

{/* ======================= APPOINTMENTS PAGE ======================= */}
{selected === "appointments" && <AdminAppointments />}

{/* ======================= PATIENTS PAGE ======================= */}
{selected === "patients" && (
  <>
    {!selectedPatient ? (
      // ---------------- MAIN PATIENTS LIST ----------------
      <div style={{ display: "flex", gap: "30px" }}>
        {/* LEFT — Patient Cards */}
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
          <h2 style={{ color: "#075E68", marginBottom: "20px" }}>Patients</h2>

          <div
            style={{
              backgroundColor: "white",
              padding: "15px",
              borderRadius: "8px",
              height: "450px",
              overflowY: "auto",
            }}
          >
            {patientsList.length === 0 ? (
              <p style={{ color: "#555" }}>No patients available…</p>
            ) : (
              patientsList.map((p) => (
                <div
                  key={p.patient_id}
                  style={{
                    backgroundColor: "#f7f7f7",
                    padding: "18px",
                    borderRadius: "10px",
                    marginBottom: "15px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedPatient(p)}
                >
                  <h3
                    style={{
                      margin: 0,
                      color: "#075E68",
                      fontSize: "20px",
                      fontWeight: "700",
                    }}
                  >
                    {p.name}
                  </h3>
                  <p style={{ margin: "8px 0", color: "#444", fontWeight: "600" }}>
                    {p.age} yrs &nbsp; • &nbsp; {p.gender}
                  </p>
                  <p style={{ margin: "8px 0", color: "#444", fontWeight: "600" }}>
                    Last Diagnosis: {p.last_diagnosis}
                  </p>
                  <p style={{ margin: "8px 0", color: "#444", fontWeight: "600" }}>
                    Last Visit: {p.last_visit} &nbsp; • &nbsp; Last Scan: {p.last_scan}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT — Stats */}
        <div
          style={{
            width: "25%",
            display: "flex",
            flexDirection: "column",
            gap: "25px",
            marginTop: "44px",
          }}
        >
          {[
            ["Total Patients", patientStats.total],
            ["Active Patients (30d)", patientStats.active30d],
            ["Pending Bills", patientStats.pendingBills],
            ["Follow-ups Scheduled", patientStats.followups],
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
      </div>
    ) : (
      // ---------------- PATIENT DETAIL PAGE ----------------
      <div style={{ display: "flex", gap: "30px", marginTop: "25px" }}>
        {/* LEFT — Personal Info */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#f0f0f0",
            padding: "25px",
            borderRadius: "12px",
          }}
        >
          <button
            onClick={() => {
              setSelectedPatient(null);
              setEditPatientMode(false);
            }}
            style={{
              backgroundColor: "transparent",
              color: "#075E68",
              fontWeight: "600",
              fontSize: "16px",
              border: "none",
              cursor: "pointer",
              marginBottom: "15px",
            }}
          >
            ← Back to Patients
          </button>

          {/* Profile Picture Upload */}
        
<div style={{ textAlign: "center", marginBottom: "25px", position: "relative" }}>
  <img
    src={selectedPatient.photo || "/placeholder-patient.png"}
    alt="Patient"
    style={{
      width: "130px",
      height: "130px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "4px solid #075E68",
    }}
  />

  {editPatientMode && (
    <div style={{ marginTop: "10px" }}>
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setSelectedPatient({
            ...selectedPatient,
            photo: URL.createObjectURL(e.target.files[0]),
          })
        }
      />
    </div>
  )}
</div>

          {/* INFO GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px 30px",
            }}
          >
            {[
              ["Name", selectedPatient.name],
              ["Patient ID", selectedPatient.patient_id],
              ["Age", selectedPatient.age],
              ["Gender", selectedPatient.gender],
              ["Blood Type", selectedPatient.blood_type || "O+"],
              ["Allergies", selectedPatient.allergies || "N/A"],
              ["Insurance Provider", selectedPatient.insurance_provider || "N/A"],
              ["Insurance Number", selectedPatient.insurance_number || "N/A"],
              ["Emergency Name", selectedPatient.emergency_name || "N/A"],
              ["Emergency Number", selectedPatient.emergency_phone || "N/A"],
              ["Email", selectedPatient.email || "N/A"],
              ["Registered At", selectedPatient.registered_at || "N/A"],
              ["Phone", selectedPatient.phone || "N/A"],
              ["Address", selectedPatient.address || "N/A"],
            ].map(([label, value]) => (
              <div key={label}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    color: "#075E68",
                    marginBottom: "3px",
                  }}
                >
                  {label}
                </label>
                {editPatientMode ? (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        [label.toLowerCase().replace(" ", "_")]: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "6px",
                      borderRadius: "6px",
                      border: "1px solid #888",
                    }}
                  />
                ) : (
                  <span>{value}</span>
                )}
              </div>
            ))}
          </div>

          <div style={{ textAlign: "right", marginTop: "25px" }}>
            {!editPatientMode ? (
              <button
                onClick={() => setEditPatientMode(true)}
                style={{
                  backgroundColor: "#0A7C88",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Edit Info
              </button>
            ) : (
              <>
                <button
                  onClick={() => setEditPatientMode(false)}
                  style={{
                    backgroundColor: "#0A7C88",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "6px",
                    color: "white",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditPatientMode(false)}
                  style={{
                    backgroundColor: "white",
                    border: "2px solid #0A7C88",
                    padding: "10px 20px",
                    borderRadius: "6px",
                    color: "#0A7C88",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* RIGHT — Appointments + Scans */}
        <div style={{ flex: 1.3, display: "flex", flexDirection: "column", gap: "25px" }}>
          {/* Appointments */}
          <div
            style={{
              backgroundColor: "#f0f0f0",
              padding: "25px",
              borderRadius: "12px",
              maxHeight: "370px",
              overflowY: "auto",
            }}
          >
            <h3 style={{ color: "#075E68", marginBottom: "15px" }}>Appointments</h3>
            {patientAppointments.length === 0 ? (
              <p>No appointments yet.</p>
            ) : (
              patientAppointments.map((a, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "white",
                    padding: "15px",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <p style={{ margin: "4px 0", fontWeight: "600" }}>
                    {a.date} &nbsp; • &nbsp; {a.doctor}
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    Reason: <b>{a.reason}</b> &nbsp; • &nbsp; Diagnosis: <b>{a.diagnosis}</b>
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    Medication: <b>{a.medication}</b> &nbsp; • &nbsp; Scan: <b>{a.scan}</b>
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Scans */}
          <div
            style={{
              backgroundColor: "#f0f0f0",
              padding: "25px",
              borderRadius: "12px",
              maxHeight: "340px",
              overflowY: "auto",
            }}
          >
            <h3 style={{ color: "#075E68", marginBottom: "15px" }}>Scans</h3>
            {patientScans.length === 0 ? (
              <p>No scans found.</p>
            ) : (
              patientScans.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "white",
                    padding: "15px",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <p style={{ margin: "4px 0", fontWeight: "600" }}>
                    {s.date} &nbsp; • &nbsp; {s.radiologist}
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    <span
                      style={{
                        color: "#0A7C88",
                        cursor: "pointer",
                        fontWeight: "600",
                        textDecoration: "underline",
                        marginRight: "15px",
                      }}
                    >
                      {s.scan_name}
                    </span>
                    <span
                      style={{
                        color: "#0A7C88",
                        cursor: "pointer",
                        fontWeight: "600",
                        textDecoration: "underline",
                      }}
                       onClick={() => {
    setActiveReport(s.report);
    setShowReportModal(true);
  }}
                    >
                      Report
                    </span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )}
  </>
)}
{/* ======================= REPORT POPUP MODAL ======================= */}
{showReportModal && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}
  >
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        width: "600px",
        maxWidth: "90%",
        padding: "30px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
        position: "relative",
      }}
    >
      <h3 style={{ color: "#075E68", marginBottom: "20px" }}>Scan Report</h3>

      {/* Text Area Box */}
      <div
        style={{
          height: "350px",              // larger visible area
          overflowY: "auto",            // only vertical scrolling
          overflowX: "hidden",          // no horizontal scroll
          border: "1px solid #ddd",
          borderRadius: "6px",
          padding: "15px",
          backgroundColor: "#fafafa",
          wordWrap: "break-word",       // ensures long text wraps
          whiteSpace: "pre-wrap",       // preserves line breaks
          lineHeight: "1.6",
          color: "#333",
          boxSizing: "border-box",
        }}
      >
        <p>{activeReport || "No report content available."}</p>
      </div>

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end", // button to the right
          marginTop: "25px",
        }}
      >
        <button
          onClick={() => setShowReportModal(false)}
          style={{
            backgroundColor: "white",
            border: "2px solid #0A7C88",
            color: "#0A7C88",
            fontWeight: "600",
            padding: "10px 25px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


      </main>
    </div>
  );
}
