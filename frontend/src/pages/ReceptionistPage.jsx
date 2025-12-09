import React, { useState } from "react";
import { PiSignOutBold } from "react-icons/pi";
import { patientStyles } from "../styles/patientStyles";

function ReceptionistPage() {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      name: "Eman Khaled",
      patientId: "P-1234",
      phone: "01023456789",
      date: "2025-12-09",
      time: "11:00 AM",
      doctor: "Dr. Ahmed",
      billing: "Pending",
      status: "Pending",
    },
    {
      id: 2,
      name: "Hassan Ali",
      patientId: "P-3456",
      phone: "01055667788",
      date: "2025-12-10",
      time: "10:00 AM",
      doctor: "Dr. Nour",
      billing: "Pending",
      status: "Pending",
    },
    {
      id: 3,
      name: "Sara Adel",
      patientId: "P-8890",
      phone: "01099988877",
      date: "2025-12-10",
      time: "1:30 PM",
      doctor: "Dr. Ahmed",
      billing: "Pending",
      status: "Pending",
    },
    {
      id: 4,
      name: "Omar Hany",
      patientId: "P-4456",
      phone: "01111222333",
      date: "2025-12-11",
      time: "9:00 AM",
      doctor: "Dr. Nour",
      billing: "Pending",
      status: "Pending",
    },
    {
      id: 5,
      name: "Aya Fathi",
      patientId: "P-7744",
      phone: "01223334455",
      date: "2025-12-12",
      time: "2:00 PM",
      doctor: "Dr. Ahmed",
      billing: "Pending",
      status: "Pending",
    },
    {
      id: 6,
      name: "Tamer Said",
      patientId: "P-6677",
      phone: "01077889900",
      date: "2025-12-12",
      time: "4:00 PM",
      doctor: "Dr. Nour",
      billing: "Pending",
      status: "Pending",
    },
  ]);

  const [scans, setScans] = useState([
    {
      id: 1,
      name: "Omar Hassan",
      patientId: "P-5678",
      phone: "01098765432",
      date: "2025-12-09",
      time: "3:30 PM",
      modality: "MRI",
      radiologist: "Dr. Sara",
      billing: "Pending",
      status: "Pending",
    },
    {
      id: 2,
      name: "Mona Hafez",
      patientId: "P-9012",
      phone: "01034567890",
      date: "2025-12-10",
      time: "10:15 AM",
      modality: "X-ray",
      radiologist: "Dr. Youssef",
      billing: "Pending",
      status: "Pending",
    },
    {
      id: 3,
      name: "Laila Rami",
      patientId: "P-1022",
      phone: "01122334455",
      date: "2025-12-11",
      time: "1:45 PM",
      modality: "MRI",
      radiologist: "Dr. Sara",
      billing: "Pending",
      status: "Pending",
    },
    {
      id: 4,
      name: "Ahmed Nabil",
      patientId: "P-5566",
      phone: "01299887766",
      date: "2025-12-11",
      time: "11:30 AM",
      modality: "X-ray",
      radiologist: "Dr. Youssef",
      billing: "Pending",
      status: "Pending",
    },
    {
      id: 5,
      name: "Nada Sherif",
      patientId: "P-9988",
      phone: "01011223344",
      date: "2025-12-12",
      time: "4:00 PM",
      modality: "MRI",
      radiologist: "Dr. Sara",
      billing: "Pending",
      status: "Pending",
    },
    {
      id: 6,
      name: "Rami Ghaly",
      patientId: "P-1290",
      phone: "01055667788",
      date: "2025-12-13",
      time: "12:00 PM",
      modality: "X-ray",
      radiologist: "Dr. Youssef",
      billing: "Pending",
      status: "Pending",
    },
  ]);

  const [searchAppointment, setSearchAppointment] = useState("");
const [searchScan, setSearchScan] = useState("");

const filterRows = (rows, term) =>
  rows.filter((r) =>
    Object.values(r)
      .join(" ")
      .toLowerCase()
      .includes(term.toLowerCase())
  );

const filteredAppointments = filterRows(appointments, searchAppointment);
const filteredScans = filterRows(scans, searchScan);


  const [activePopup, setActivePopup] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedModality, setSelectedModality] = useState("MRI");
  const [reason, setReason] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [calendarMonthOffset, setCalendarMonthOffset] = useState(0);
const [showCalendar, setShowCalendar] = useState(false);


  const receptionist = { name: "Lina Fathi", avatar: "👩‍💼" };

  const openPopup = (type, row, source = null) => {
  setActivePopup(type);
  setSelectedRow({ ...row, source });
  setShowCalendar(false);     
  setCalendarMonthOffset(0);    
};

  const closePopup = () => {
    setActivePopup(null);
    setSelectedRow(null);
    setPaymentMethod("");
    setReason("");
    setSelectedDate("");
    setSelectedTime("");
  };

  const handleConfirmPayment = () => {
  const update = (arr, setArr) =>
    setArr(
      arr.map((r) =>
        r.id === selectedRow.id ? { ...r, billing: "Paid" } : r
      )
    );

  if (selectedRow.source === "appointments")
    update(appointments, setAppointments);
  else if (selectedRow.source === "scans")
    update(scans, setScans);

  closePopup();
};



  const inputStyle = {
    width: "100%",
    border: "1px solid #d0f2fb",
    borderRadius: 8,
    padding: "6px 10px",
    marginTop: 6,
    marginBottom: 12,
    fontSize: 14,
  };

  const handleAddReschedule = (tableType) => {
    const newRow = {
      ...selectedRow,
      id: Date.now(),
      date: selectedDate || selectedRow.date,
      time: selectedTime || selectedRow.time,
      status: "Pending",
    };
    if (tableType === "appointment") {
      setAppointments((prev) => [newRow, ...prev].slice(0, 30));
    } else {
      setScans((prev) => [newRow, ...prev].slice(0, 30));
    }
    closePopup();
  };

  return (
    <div style={{ minHeight: "100vh", background: "white" }}>
      {/* HEADER */}
      <div
        style={{
          height: 70,
          background: "#0a586c",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 20,
              background: "white",
              color: "#0a586c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            O
          </div>
          <h2 style={{ margin: 0 }}>OrthoLink</h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span
          style={{
          fontSize: "20px",      
      fontWeight: "600",      
      color: "white",         
    }}>{receptionist.name}</span>
              <button
  onClick={() => (window.location.href = "/login")}
  style={{
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "white",
    fontSize: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
  title="Logout"
>
  <PiSignOutBold />
</button>

        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "24px 32px" }}>
        {/* APPOINTMENTS */}
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h3 style={{ color: "#0a586c" }}>Appointments</h3>
           <input
  placeholder="Search..."
  value={searchAppointment}
  onChange={(e) => setSearchAppointment(e.target.value)}
  style={{
    width: 180,
    border: "1px solid #d0f2fb",
    borderRadius: 8,
    padding: "4px 8px",
    fontSize: 13,
  }}
/>
          </div>
          <div
            style={{
              border: "1px solid #f1f5f9",
              borderRadius: 12,
              overflowY: "auto",
              maxHeight: 300,
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead
                style={{
                  background: "#d0f2fb",
                  color: "#0a586c",
                  position: "sticky",
                  top: 0,
                }}
              >
                <tr>
                  {[
                    "Patient Name",
                    "Patient ID",
                    "Phone",
                    "Date",
                    "Time",
                    "Doctor",
                    "Billing",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{ padding: "10px 16px", textAlign: "left" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: "10px 16px" }}>{item.name}</td>
                    <td style={{ padding: "10px 16px" }}>{item.patientId}</td>
                    <td style={{ padding: "10px 16px" }}>{item.phone}</td>
                    <td style={{ padding: "10px 16px" }}>{item.date}</td>
                    <td style={{ padding: "10px 16px" }}>{item.time}</td>
                    <td style={{ padding: "10px 16px" }}>{item.doctor}</td>
                    <td
  onClick={() => item.billing !== "Paid" && openPopup("billing", item, "appointments")}
  style={{
    borderRadius: 12,
    background:
      item.billing === "Paid"
        ? "rgba(34,197,94,0.15)"
        : "rgba(10,88,108,0.08)",
    color: item.billing === "Paid" ?"#14532d" : "#0a586c",
    cursor: item.billing === "Paid" ? "default" : "pointer",
    marginTop:" 10px",
    padding: "4px 10px", 
    fontSize: 15,       
    display: "inline-block",
    textAlign: "center",
    minWidth: 80,
    fontWeight: 600,
  }}
>
  {item.billing}
</td>

                    <td>
                 <select
  value={item.status}
  onChange={(e) => {
    const newStatus = e.target.value;

    // Update status first
    setAppointments((prev) =>
      prev.map((r) =>
        r.id === item.id ? { ...r, status: newStatus } : r
      )
    );

    // Open popup if Cancelled
    if (newStatus === "Cancelled") {
      setShowCalendar(false);
      setTimeout(() => openPopup("reschedule-appointment", item), 0);
    }
  }}
  style={{
    borderRadius: 12,
    fontWeight: 600,
    textAlign: "center",
    fontSize: 13,
    padding: "4px 10px",
    minWidth: 80,
    border: "1px solid #d0f2fb",
    background:
      item.status === "Completed"
        ? "rgba(34,197,94,0.15)"
        : item.status === "Cancelled"
        ? "rgba(239,68,68,0.15)"
        : item.status === "No Show"
        ? "rgba(59,130,246,0.15)"
        : "rgba(10,88,108,0.08)",
    color:
      item.status === "Completed"
        ? "#14532d"
        : item.status === "Cancelled"
        ? "#991b1b"
        : item.status === "No Show"
        ? "#1e3a8a"
        : "#0a586c",
    cursor: "pointer",
  }}
>
  {["Pending", "Completed", "Cancelled", "No Show"].map((s) => (
    <option key={s} value={s}>
      {s}
    </option>
  ))}
</select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SCANS */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h3 style={{ color: "#0a586c" }}>Scans</h3>
            <input
  placeholder="Search..."
  value={searchScan}
  onChange={(e) => setSearchScan(e.target.value)}
  style={{
    width: 180,
    border: "1px solid #d0f2fb",
    borderRadius: 8,
    padding: "4px 8px",
    fontSize: 13,
  }}
/>

          </div>
          <div
            style={{
              border: "1px solid #f1f5f9",
              borderRadius: 12,
              overflowY: "auto",
              maxHeight: 300,
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead
                style={{
                  background: "#d0f2fb",
                  color: "#0a586c",
                  position: "sticky",
                  top: 0,
                }}
              >
                <tr>
                  {[
                    "Patient Name",
                    "Patient ID",
                    "Phone",
                    "Date",
                    "Time",
                    "Modality",
                    "Radiologist",
                    "Billing",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{ padding: "10px 16px", textAlign: "left" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredScans.map((item) => (

                  <tr key={item.id}>
                    <td style={{ padding: "10px 16px" }}>{item.name}</td>
                    <td style={{ padding: "10px 16px" }}>{item.patientId}</td>
                    <td style={{ padding: "10px 16px" }}>{item.phone}</td>
                    <td style={{ padding: "10px 16px" }}>{item.date}</td>
                    <td style={{ padding: "10px 16px" }}>{item.time}</td>
                    <td style={{ padding: "10px 16px" }}>{item.modality}</td>
                    <td style={{ padding: "10px 16px" }}>{item.radiologist}</td>
                    <td
  onClick={() => item.billing !== "Paid" && openPopup("billing", item, "scans")}
  style={{
    borderRadius: 12,
    background:
      item.billing === "Paid"
        ? "rgba(34,197,94,0.15)"
        : "rgba(10,88,108,0.08)",
    color: item.billing === "Paid" ? "#14532d" : "#0a586c",
    cursor: item.billing === "Paid" ? "default" : "pointer",
    marginTop:" 10px",
    padding: "4px 10px", 
    fontSize: 14,      
    display: "inline-block",
    textAlign: "center",
    minWidth: 80,
    fontWeight: 600,
  }}
>
  {item.billing}
</td>

                    <td>
             <select
  value={item.status}
  onChange={(e) => {
    const newStatus = e.target.value;

    // Update scans table first
    setScans((prev) =>
      prev.map((r) =>
        r.id === item.id ? { ...r, status: newStatus } : r
      )
    );

    // Show the popup for rescheduling
    if (newStatus === "Cancelled") {
      setShowCalendar(false);
      setTimeout(() => openPopup("reschedule-scan", item), 0);
    }
  }}
  style={{
    borderRadius: 12,
    fontWeight: 600,
    textAlign: "center",
    fontSize: 13,
    padding: "4px 10px",
    minWidth: 80,
    border: "1px solid #d0f2fb",
    background:
      item.status === "Completed"
        ? "rgba(34,197,94,0.15)"
        : item.status === "Cancelled"
        ? "rgba(239,68,68,0.15)"
        : item.status === "No Show"
        ? "rgba(59,130,246,0.15)"
        : "rgba(10,88,108,0.08)",
    color:
      item.status === "Completed"
        ? "#14532d"
        : item.status === "Cancelled"
        ? "#991b1b"
        : item.status === "No Show"
        ? "#1e3a8a"
        : "#0a586c",
    cursor: "pointer",
  }}
>
  {["Pending", "Completed", "Cancelled", "No Show"].map((s) => (
    <option key={s} value={s}>
      {s}
    </option>
  ))}
</select>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* BILLING POPUP */}
{activePopup === "billing" && (
  <div style={patientStyles.popupContainer}>
    <div style={{ ...patientStyles.popup, width: 320, height: 230 }}>
      <button onClick={closePopup} style={patientStyles.closeBtn}>
        ×
      </button>

      <h3
        style={{
          color: "#0a586c",
          marginBottom: 16,
          textAlign: "",
        }}
      >
        Billing Information
      </h3>

      <div style={{ marginBottom: 16 }}>
        <strong>Amount:</strong> {selectedRow.amount || "EGP 2500"}
      </div>

      <div style={{ marginBottom: 12 }}>
        <strong>Way of Payment:</strong>
      </div>

      <div
        style={{
          display: "flex",
          gap: 20,
          marginBottom: 20,
          marginLeft: 10,
        }}
      >
        <label>
          <input
            type="radio"
            value="Cash"
            checked={paymentMethod === "Cash"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />{" "}
          Cash
        </label>
        <label>
          <input
            type="radio"
            value="Credit"
            checked={paymentMethod === "Credit"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />{" "}
          Credit
        </label>
      </div>

      <div style={{ textAlign: "right" }}>
        <button
          onClick={handleConfirmPayment}
          style={{
            background: "#0a586c",
            color: "white",
            border: "none",
            borderRadius: 12,
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}


      {/* RESCHEDULE POPUPS */}
     {(activePopup === "reschedule-appointment" ||
  activePopup === "reschedule-scan") && (
  <div style={patientStyles.popupContainer}>
    {/* Stage 1 — small popup for doctor/modality selection */}
    {!showCalendar && (
      <div
        style={{
          background: "white",
          borderRadius: 16,
          width: 420,
          height: 260,
          padding: 24,
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          position: "relative",
          textAlign: "center",
        }}
      >
        <button onClick={closePopup} style={patientStyles.closeBtn}>×</button>

        <h3 style={{ color: "#0a586c", marginBottom: 16 }}>
          {activePopup === "reschedule-appointment"
            ? "Choose Doctor"
            : "Choose Modality"}
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginTop: 10,
          }}
        >
          {(activePopup === "reschedule-appointment"
            ? ["Dr. Ahmed", "Dr. Nour"]
            : ["MRI", "X-ray"]
          ).map((choice) => (
            <div
              key={choice}
              onClick={() => {
                if (activePopup === "reschedule-appointment")
                  setSelectedRow({ ...selectedRow, doctor: choice });
                else setSelectedModality(choice);
                setShowCalendar(true);
              }}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: 16,
                cursor: "pointer",
                fontWeight: 600,
                background: "rgba(10,88,108,0.05)",
                color: "#0a586c",
              }}
            >
              {choice}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Stage 2 — full calendar view */}
    {showCalendar && (
      <div
        style={{
          background: "white",
          borderRadius: 16,
          minHeight: "600px",
          maxHeight: "90vh",
          minWidth: "600px",
          maxWidth: "900px",
          padding: 24,
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <button onClick={closePopup} style={patientStyles.closeBtn}>×</button>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={() => setShowCalendar(false)}
            style={{
              border: "none",
              background: "none",
              color: "#0a586c",
              cursor: "pointer",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            ← Back
          </button>

          <h3 style={{ color: "#0a586c", textAlign: "center" }}>
            {activePopup === "reschedule-appointment"
              ? selectedRow?.doctor
              : selectedModality}
          </h3>

          <div style={{ width: 60 }}></div>
        </div>

        {/* Month navigation */}
        {(() => {
        

const today = new Date();
const baseYear = today.getFullYear();
const baseMonth = today.getMonth(); 

const date = new Date(baseYear, baseMonth + calendarMonthOffset, 1);
const monthName = date.toLocaleString("default", { month: "long" });
const year = date.getFullYear();
const month = date.getMonth();

const daysInMonth = new Date(year, month + 1, 0).getDate();
const firstDay = new Date(year, month, 1).getDay();

const calendarDays = [];
for (let i = 0; i < firstDay; i++) {
  calendarDays.push(null);
}
for (let d = 1; d <= daysInMonth; d++) {
  calendarDays.push(d);
}


          return (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 20,
                  color: "#0a586c",
                  margin: "20px 0 10px",
                }}
              >
                <span
                  onClick={() => setCalendarMonthOffset((p) => p - 1)}
                  style={{ cursor: "pointer", fontSize: 22, fontWeight: 700 }}
                >
                  ‹
                </span>
                <h3 style={{ margin: 0 }}>
                  {monthName} {year}
                </h3>
                <span
                  onClick={() => setCalendarMonthOffset((p) => p + 1)}
                  style={{ cursor: "pointer", fontSize: 22, fontWeight: 700 }}
                >
                  ›
                </span>
              </div>

              {/* Weekdays */}
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

              {/* Calendar days */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: 6,
                  marginTop: 8,
                }}
              >
               {calendarDays.map((day, idx) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const currentDayDate = new Date(year, date.getMonth(), day);
  const isPastDay = currentDayDate < today;
  const isSelected = selectedDate === day;

  return (
    <div
      key={day}
      onClick={() => !isPastDay && setSelectedDate(day)} 
      style={{
        borderRadius: 8,
        border: "1px solid #e2e8f0",
        background: isPastDay
          ? "#f1f5f9"
          : isSelected
          ? "#b5f5c6"
          : "#d4fadd",
        textAlign: "center",
        padding: 8,
        minHeight: 70,
        cursor: isPastDay ? "not-allowed" : "pointer",
        color: isPastDay ? "#94a3b8" : "#0a586c",
      }}
    >
      <div style={{ fontWeight: 600 }}>{day}</div>

      {/* show times only for selectable days */}
      {isSelected && !isPastDay && (
        <div style={{ marginTop: 4 }}>
          {["9:00 AM", "11:00 AM", "2:00 PM"].map((t) => {
            const [hour, minute] = t
              .replace(" AM", "")
              .replace(" PM", "")
              .split(":")
              .map(Number);
            const isPM = t.includes("PM");
            const slotDate = new Date(
              year,
              date.getMonth(),
              day,
              isPM ? hour + 12 : hour,
              minute
            );
            const isPastTime = slotDate < now;

            return (
              <div
                key={t}
                onClick={() => !isPastTime && setSelectedTime(t)} 
                style={{
                  marginTop: 4,
                  background: isPastTime
                    ? "#f1f5f9"
                    : selectedTime === t
                    ? "#0a586c"
                    : "rgba(10,88,108,0.15)",
                  color: isPastTime
                    ? "#94a3b8"
                    : selectedTime === t
                    ? "white"
                    : "#0a586c",
                  borderRadius: 6,
                  padding: "2px 4px",
                  fontSize: 12,
                  cursor: isPastTime ? "not-allowed" : "pointer",
                }}
              >
                {t}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
})}
              </div>
            </>
          );
        })()}

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 24,
          }}
        >
          <button
            onClick={closePopup}
            style={{
              background: "#e53e3e",
              color: "white",
              border: "none",
              borderRadius: 12,
              padding: "8px 16px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() =>
              handleAddReschedule(
                activePopup === "reschedule-appointment"
                  ? "appointment"
                  : "scan"
              )
            }
            style={{
              background: "#0a586c",
              color: "white",
              border: "none",
              borderRadius: 12,
              padding: "8px 16px",
              cursor: "pointer",
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    )}
  </div>
)}

    </div>
  );
}

export default ReceptionistPage;
