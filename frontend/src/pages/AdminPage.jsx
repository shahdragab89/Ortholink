import React, { useState } from "react";
import { adminStyles } from "../styles/AdminStyles";

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
                        {doctor.specialty}   &nbsp; • &nbsp;  {doctor.status}
                      </p>

                      <p style={{ margin: "10px 0", color: "#444",fontWeight: "600" }}>
                        Schedule: {doctor.schedule}
                      </p>

                      <p style={{ margin: "10px 0", color: "#444" ,fontWeight: "600"}}>
                        Patients (30d): {doctor.patients30d} &nbsp; • &nbsp; Reports (30d): {doctor.reports30d} &nbsp; • &nbsp; Revenue (30d):{" "}
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
          src={selectedDoctor.photo || "/placeholder-doctor.png"}
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
                const reader = new FileReader();
                reader.onload = () =>
                  setSelectedDoctor({ ...selectedDoctor, photo: reader.result });
                reader.readAsDataURL(file);
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
              onClick={() => {
                setEditMode(false);
                alert("Changes saved (DB update will happen in backend)");
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
          src={newDoctor.photo || "/placeholder-doctor.png"}
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
              const reader = new FileReader();
              reader.onload = () =>
                setNewDoctor({ ...newDoctor, photo: reader.result });
              reader.readAsDataURL(file);
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
          onClick={() => {
            alert("New doctor added (backend will handle DB insertion)");
            setShowAddDoctor(false);
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
    frequent_scan_type: "X-Ray", // Default value
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
          {r.specialty} &nbsp; • &nbsp; {r.status}
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
          src={selectedRadiologist.photo || "/placeholder-radiologist.png"}
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
                const reader = new FileReader();
                reader.onload = () =>
                  setSelectedRadiologist({
                    ...selectedRadiologist,
                    photo: reader.result,
                  });
                reader.readAsDataURL(file);
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
                setEditMode(false);
                alert("Changes saved (DB update will happen in backend)");
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
          src={newRadiologist.photo || "/placeholder-radiologist.png"}
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
              const reader = new FileReader();
              reader.onload = () =>
                setNewRadiologist({ ...newRadiologist, photo: reader.result });
              reader.readAsDataURL(file);
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
          onClick={() => {
            alert("New radiologist added (backend will handle DB insertion)");
            setShowAddRadiologist(false);
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
{selected === "scans" && (
  <div style={{ display: "flex", gap: "30px" }}>
    {/* LEFT SIDE – Scans list */}
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
          <p style={{ color: "#555" }}>No scans available…</p>
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
              <h3
                style={{
                  margin: 0,
                  color: "#075E68",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                {scan.scan_type} &nbsp; • &nbsp; {scan.status}
              </h3>
              <p style={{ margin: "10px 0", color: "#444", fontWeight: "600" }}>
                Patient: {scan.patient_name}
              </p>
              <p style={{ margin: "10px 0", color: "#444", fontWeight: "600" }}>
                Doctor: {scan.doctor_name} &nbsp; • &nbsp; Radiologist:{" "}
                {scan.radiologist_name}
              </p>
              <p style={{ margin: "10px 0", color: "#444", fontWeight: "600" }}>
                Date: {scan.date} &nbsp; • &nbsp; Time: {scan.time}
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
  ["Today's Scans", todaysScans],
  ["Completed Today", completedScansToday],
  ["Cancelled / No-Show", cancelledScansToday],
  ["Pending Scan Reports", pendingScanReports],
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
)}

{/* =================== SCAN DETAILS POPUP =================== */}
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
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={() => alert("Open DICOM Viewer here")}
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
      </div>

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
          onChange={(e) =>
            setSelectedScan({ ...selectedScan, report: e.target.value })
          }
          placeholder="Enter or view scan report..."
          style={{
            width: "100%",
            minHeight: "200px",
            maxWidth: "100%",
            borderRadius: "6px",
            border: "1px solid #ccc",
            padding: "10px",
            fontFamily: "inherit",
            resize: "vertical", // expands vertically with text
            overflowY: "auto",
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

{/* ======================= APPOINTMENTS PAGE ======================= */}
{selected === "appointments" && (
  <div style={{ display: "flex", gap: "30px" }}>
    {/* LEFT SIDE – Appointments list */}
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
          <p style={{ color: "#555" }}>No appointments available…</p>
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
    onClick={() => setSelectedAppointment(a)}
  >
    {/* ===== LINE 1: Patient + Status ===== */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "8px",
       
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
        {a.patient_name}
      </h3>
      <span
        style={{
          color: "#075E68",
          fontWeight: "700",
          fontSize: "20px",
        }}
      >
         <span style={{ color: "#075E68", margin: "0 8px" }}>•</span>{" "} {a.status}
      </span>
    </div>

    {/* ===== LINE 2: Doctor + Reason ===== */}
    <p
      style={{
        margin: "4px 0 10px",
        color: "#444",
        fontSize: "16px",
        fontWeight: "600",
      }}
    >
      Doctor: {a.doctor}{" "}
      <span style={{ color: "#075E68", margin: "0 8px" }}>•</span>{" "}
      Reason for Visit: {a.reason || "Routine check-up"}
    </p>

    {/* ===== LINE 3: Date + Time ===== */}
    <p
      style={{
        margin: "0",
        color: "#444",
        fontSize: "16px",
        fontWeight: "600",
      }}
    >
      Date: {a.date || "2025-12-21"}{" "}
      <span style={{ color: "#075E68", margin: "0 8px" }}>•</span>{" "}
      Time: {a.time || "10:30 AM"}
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
        ["Today's Appointments", todayAppointments],
        ["Completed Today", completedToday],
        ["Cancelled / No Show", cancelledToday],
        ["Average Waiting Time", avgWaitingTime],
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
)}
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
      {/* Close (X) Button */}
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
        title="Close"
      >
        ×
      </button>

      {/* Title */}
      <h2
        style={{
          color: "#075E68",
          textAlign: "center",
          marginBottom: "20px",
          marginTop: "10px",
        }}
      >
        Appointment Details
      </h2>

      {/* Switch Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => setActiveTab("records")}
          style={{
            padding: "10px 25px",
            borderTopLeftRadius: "6px",
            borderBottomLeftRadius: "6px",
            border: "1px solid #ccc",
            backgroundColor:
              activeTab === "records" ? "#E7F4F5" : "#F9F9F9",
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
            backgroundColor:
              activeTab === "orders" ? "#E7F4F5" : "#F9F9F9",
            color: "#075E68",
            cursor: "pointer",
            fontWeight: activeTab === "orders" ? "700" : "500",
          }}
        >
          Orders
        </button>
      </div>

      {/* ===== Records Tab ===== */}
      {activeTab === "records" && (
        <div>
          {[
            ["Complaint", "complaint", "Patient's main complaint..."],
            [
              "Physical Examination",
              "physical_exam",
              "Key findings (e.g. Swelling, Range of Motion)...",
            ],
            ["Diagnosis", "diagnosis", "Confirmed diagnosis..."],
            ["Treatment Plan", "treatment_plan", "Plan moving forward..."],
          ].map(([label, key, placeholder]) => (
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
              <textarea
                rows={2}
                value={selectedAppointment[key] || ""}
                onChange={(e) =>
                  setSelectedAppointment({
                    ...selectedAppointment,
                    [key]: e.target.value,
                  })
                }
                placeholder={placeholder}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  resize: "vertical",
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* ===== Orders Tab ===== */}
      {activeTab === "orders" && (
        <div>
          {[
            ["Ordered Scans", "ordered_scans"],
            ["Ordered Medications", "ordered_medications"],
          ].map(([label, key]) => (
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
              <textarea
                rows={2}
                value={selectedAppointment[key] || ""}
                onChange={(e) =>
                  setSelectedAppointment({
                    ...selectedAppointment,
                    [key]: e.target.value,
                  })
                }
                placeholder={`Enter ${label.toLowerCase()}`}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  resize: "vertical",
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}

      </main>
    </div>
  );
}
