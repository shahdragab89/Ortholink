import React, { useState } from "react";
import { PiSignOutBold } from "react-icons/pi";
import { receptionistStyles } from "../styles/receptionistStyles";

export default function ReceptionistPage() {
  // --- Variables from DB (example placeholders) ---
  const receptionist = {
    name: "Sara Hassan",
    photo: "/default-avatar.png",
  };

  const [appointments, setAppointments] = useState([
    { id: 1, name: "Eman Khaled", pid: "P-12345", date: "10 Dec 2025", time: "09:30 AM", doctor: "Dr. Smith", billing: "Paid", status: "Pending" },
    { id: 2, name: "Ahmed Ali", pid: "P-12346", date: "10 Dec 2025", time: "11:00 AM", doctor: "Dr. Johnson", billing: "Pending", status: "Pending" },
  ]);

  const [scans, setScans] = useState([
    { id: 1, name: "Yara Hassan", pid: "P-12347", date: "09 Dec 2025", time: "02:00 PM", modality: "MRI", radiologist: "Dr. Omar", billing: "Paid", status: "Pending" },
    { id: 2, name: "Mostafa Adel", pid: "P-12348", date: "09 Dec 2025", time: "04:00 PM", modality: "CT", radiologist: "Dr. Emily", billing: "Pending", status: "Pending" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleStatusChange = (table, id, newStatus) => {
    if (table === "appointments") {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } else {
      setScans((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const filteredAppointments = appointments.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.pid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredScans = scans.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.pid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={receptionistStyles.page}>
      {/* --- Header --- */}
      <header style={receptionistStyles.header}>
        <div style={receptionistStyles.logoContainer}>
          <div style={receptionistStyles.logoCircle}>o</div>
          <h2 style={receptionistStyles.logoWord}>OrthoLink</h2>
        </div>

        <div style={receptionistStyles.receptionistInfo}>
          <img
            src={receptionist.photo}
            alt="Receptionist"
            style={receptionistStyles.receptionistPhoto}
          />
          <div style={receptionistStyles.receptionistName}>
            {receptionist.name}
          </div>
          <PiSignOutBold
            size={22}
            color="white"
            style={receptionistStyles.logoutIcon}
            onClick={() => alert("Logging out...")}
          />
        </div>
      </header>

      {/* --- Content --- */}
      <main style={receptionistStyles.main}>
        {/* ---- Appointments ---- */}
        <section style={receptionistStyles.section}>
          <div style={receptionistStyles.sectionHeader}>
            <h3 style={receptionistStyles.sectionTitle}>Appointments</h3>
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={receptionistStyles.searchInput}
            />
          </div>

          <table style={receptionistStyles.table}>
            <thead style={receptionistStyles.thead}>
              <tr>
                <th style={receptionistStyles.th}>Patient Name</th>
                <th style={receptionistStyles.th}>Patient ID</th>
                <th style={receptionistStyles.th}>Date</th>
                <th style={receptionistStyles.th}>Time</th>
                <th style={receptionistStyles.th}>Doctor</th>
                <th style={receptionistStyles.th}>Billing</th>
                <th style={receptionistStyles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((a) => (
                <tr key={a.id}>
                  <td style={receptionistStyles.td}>{a.name}</td>
                  <td style={receptionistStyles.td}>{a.pid}</td>
                  <td style={receptionistStyles.td}>{a.date}</td>
                  <td style={receptionistStyles.td}>{a.time}</td>
                  <td style={receptionistStyles.td}>{a.doctor}</td>
                  <td style={receptionistStyles.td}>{a.billing}</td>
                  <td style={receptionistStyles.td}>
                    <select
                      value={a.status}
                      onChange={(e) =>
                        handleStatusChange("appointments", a.id, e.target.value)
                      }
                      style={receptionistStyles.select}
                    >
                      <option>Pending</option>
                      <option>Completed</option>
                      <option>No Show</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ---- Scans ---- */}
        <section style={receptionistStyles.section}>
          <div style={receptionistStyles.sectionHeader}>
            <h3 style={receptionistStyles.sectionTitle}>Scans</h3>
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={receptionistStyles.searchInput}
            />
          </div>

          <table style={receptionistStyles.table}>
            <thead style={receptionistStyles.thead}>
              <tr>
                <th style={receptionistStyles.th}>Patient Name</th>
                <th style={receptionistStyles.th}>Patient ID</th>
                <th style={receptionistStyles.th}>Date</th>
                <th style={receptionistStyles.th}>Time</th>
                <th style={receptionistStyles.th}>Modality</th>
                <th style={receptionistStyles.th}>Radiologist</th>
                <th style={receptionistStyles.th}>Billing</th>
                <th style={receptionistStyles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredScans.map((s) => (
                <tr key={s.id}>
                  <td style={receptionistStyles.td}>{s.name}</td>
                  <td style={receptionistStyles.td}>{s.pid}</td>
                  <td style={receptionistStyles.td}>{s.date}</td>
                  <td style={receptionistStyles.td}>{s.time}</td>
                  <td style={receptionistStyles.td}>{s.modality}</td>
                  <td style={receptionistStyles.td}>{s.radiologist}</td>
                  <td style={receptionistStyles.td}>{s.billing}</td>
                  <td style={receptionistStyles.td}>
                    <select
                      value={s.status}
                      onChange={(e) =>
                        handleStatusChange("scans", s.id, e.target.value)
                      }
                      style={receptionistStyles.select}
                    >
                      <option>Pending</option>
                      <option>Completed</option>
                      <option>No Show</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
