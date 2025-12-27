import React, { useState, useEffect } from "react";
import { adminStyles } from "../styles/AdminStyles";

export default function AdminHome() {
  const [dateFilter, setDateFilter] = useState("this_month");
  
  const [data, setData] = useState({
    overview: { revenue: "$0", patients: 0, appointments: 0, doctors: 0, radiologists: 0, receptionists: 0 },
    appointment_outcomes: { completed: 0, upcoming: 0, cancelled: 0, noshow: 0 },
    modality_stats: [],
    doctor_workload: [],
    radiologist_workload: [],
    financial_growth: []
  });

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/admin/dashboard-stats?period=${dateFilter}`)
      .then((res) => res.json())
      .then((realData) => {
        if (!realData.error) {
          setData(realData);
        }
      })
      .catch((err) => console.error("Failed to fetch admin stats:", err));
  }, [dateFilter]);

  // ==========================================
  //  🎨 NEW COLOR PALETTE DEFINITION
  // ==========================================
  const colors = {
    revenue: "#F97316",      // Burnt Orange (Matches Financial Growth)
    patients: "#102E44",     // Navy (Neutral)
    appointments: "#06B6D4", // Cyan (Matches Completed Bar)
    doctors: "#2563EB",      // Royal Blue (Matches Doctor Cases)
    radiologists: "#D97706", // Mustard Gold (Matches Rad Scans)
    receptionists: "#64748B",// Slate Gray (Neutral)
    
    // Status Colors
    completed: "#06B6D4",    // Cyan (Matches Total Appts)
    upcoming: "#38BDF8",     // Lighter Blue
    cancelled: "#EF4444",    // Red (Keep)
    noshow: "#9CA3AF",       // Gray (Keep)
    
    // Modality (Monochromatic Teal Theme)
    modalityPrimary: "#075E68", // Dark Teal (Sidebar Color)
    modalitySecondary: "#0F9DA5" // Light Teal (Logo Color)
  };

  // --- MAPPING STATS ---
  const stats = [
    { label: "Total Revenue", value: data.overview.revenue, color: colors.revenue, icon: "$" },
    { label: "New Patients", value: data.overview.patients, color: colors.patients, icon: "P" },
    { label: "Appointments", value: data.overview.appointments, color: colors.appointments, icon: "A" },
    { label: "Doctors", value: data.overview.doctors, color: colors.doctors, icon: "D" },
    { label: "Radiologists", value: data.overview.radiologists, color: colors.radiologists, icon: "R" },
    { label: "Receptionists", value: data.overview.receptionists, color: colors.receptionists, icon: "S" },
  ];

  const appointmentStats = [
    { label: "Completed", count: data.appointment_outcomes.completed, color: colors.completed },
    { label: "Upcoming", count: data.appointment_outcomes.upcoming, color: colors.upcoming },
    { label: "Cancelled", count: data.appointment_outcomes.cancelled, color: colors.cancelled },
    { label: "No Show", count: data.appointment_outcomes.noshow, color: colors.noshow },
  ];

  // --- PIE CHART (Monochromatic Teal) ---
  const totalScans = data.modality_stats.reduce((acc, curr) => acc + curr.value, 0);
  let currentAngle = 0;
  const gradientString = totalScans > 0 
    ? data.modality_stats.map((m, i) => {
        const percentage = (m.value / totalScans) * 100;
        // Alternate between Dark Teal and Light Teal
        const color = i % 2 === 0 ? colors.modalityPrimary : colors.modalitySecondary; 
        const segment = `${color} ${currentAngle}% ${currentAngle + percentage}%`;
        currentAngle += percentage;
        return segment;
      }).join(", ")
    : "#E5E7EB 0% 100%";

  const modalityData = data.modality_stats.map((item, index) => ({
    label: item.label,
    value: item.value,
    color: index % 2 === 0 ? colors.modalityPrimary : colors.modalitySecondary
  }));

  // --- FINANCIAL GROWTH ---
  const financialData = data.financial_growth.length > 0 
    ? data.financial_growth 
    : [{month: 'Oct', value: 0}, {month: 'Nov', value: 0}, {month: 'Dec', value: 0}];
  const maxRevenue = Math.max(...financialData.map(d => d.value)) || 1;


  return (
    <div style={adminStyles.dashboardContainer}>
      
      {/* HEADER */}
      <div style={adminStyles.dashboardHeader}>
        <div>
          <h2 style={adminStyles.dashboardTitle}>OrthoLink Analytics</h2>
          <p style={adminStyles.dashboardSubtitle}>Center performance & financial overview</p>
        </div>
        
        <div style={adminStyles.filterContainer}>
            <span style={{fontSize: "13px", color: "#666", marginRight: "10px", fontWeight: "600"}}>Period:</span>
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={adminStyles.filterButton}
            >
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="this_year">This Year</option>
            </select>
        </div>
      </div>

      {/* STATS GRID */}
      <div style={adminStyles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} style={{ ...adminStyles.statCard, borderLeft: `5px solid ${stat.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                <div>
                    <span style={adminStyles.statTitle}>{stat.label}</span>
                    <div style={{ ...adminStyles.statValue, color: stat.color }}>{stat.value}</div>
                </div>
                <div style={{ 
                    width: "45px", height: "45px", borderRadius: "12px", 
                    backgroundColor: `${stat.color}15`, color: stat.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "20px", fontWeight: "bold"
                }}>
                    {stat.icon}
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS GRID */}
      <div style={adminStyles.chartsGrid}>
        
        {/* A. APPOINTMENTS */}
        <div style={adminStyles.chartCard}>
          <div style={adminStyles.cardHeaderRow}>
             <h3 style={adminStyles.chartHeader}>Appointment Outcomes</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginTop: "10px" }}>
            {appointmentStats.map((item, i) => (
                <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px" }}>
                        <span style={{ color: "#444", fontWeight: "600" }}>{item.label}</span>
                        <span style={{ fontWeight: "700", color: item.color }}>{item.count}</span>
                    </div>
                    <div style={{ width: "100%", height: "10px", backgroundColor: "#f3f4f6", borderRadius: "10px", overflow: "hidden" }}>
                        <div style={{ 
                            width: `${data.overview.appointments > 0 ? (item.count / data.overview.appointments) * 100 : 0}%`, 
                            height: "100%", backgroundColor: item.color, borderRadius: "10px", transition: "width 0.5s ease-in-out"
                        }}></div>
                    </div>
                </div>
            ))}
          </div>
        </div>

        {/* B. FINANCIAL GROWTH (ORANGE) */}
        <div style={adminStyles.chartCard}>
          <div style={adminStyles.cardHeaderRow}>
            <h3 style={adminStyles.chartHeader}>Financial Growth</h3>
          </div>
          <div style={adminStyles.barChartContainer}>
            {financialData.map((item, i) => {
              const heightPercent = `${(item.value / maxRevenue) * 85}%`; 
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div style={{ width: "35px", height: "150px", display: "flex", alignItems: "flex-end", justifyContent: "center", backgroundColor: "#f3f4f6", borderRadius: "20px" }}>
                    <div style={{ 
                        width: "100%", 
                        height: heightPercent || "5%",
                        backgroundColor: colors.revenue, // <--- Using the Orange Variable
                        borderRadius: "20px", 
                        transition: "height 0.5s ease"
                    }}></div>
                  </div>
                  <span style={{ marginTop: "12px", fontSize: "13px", fontWeight: "600", color: "#666" }}>{item.month}</span>
                  <span style={{ fontSize: "10px", color: "#999" }}>${item.value/1000}k</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* C. MODALITY (MONOCHROMATIC TEAL) */}
        <div style={adminStyles.chartCard}>
          <h3 style={adminStyles.chartHeader}>Scan Modality</h3>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
            
            <div
              style={{
                width: "150px", height: "150px", borderRadius: "50%",
                background: `conic-gradient(${gradientString})`,
                marginBottom: "25px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
              }}
            ></div>

            <div style={{ display: "flex", gap: "20px", fontSize: "13px", color: "#444", flexWrap: "wrap", justifyContent: "center" }}>
               {modalityData.map((m, i) => (
                 <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "12px", height: "12px", borderRadius: "4px", backgroundColor: m.color }}></div>
                    <span style={{ fontWeight: "600" }}>{m.label}: {m.value}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* STAFF WORKLOAD */}
      <div style={adminStyles.performanceGrid}>
        
        {/* Doctors (BLUE) */}
        <div style={adminStyles.chartCard}>
          <h3 style={adminStyles.chartHeader}>Doctor Cases</h3>
          <div style={{ marginTop: "20px" }}>
            {data.doctor_workload.map((doc, i) => (
              <div key={i} style={adminStyles.barRow}>
                <div style={adminStyles.barLabelContainer}>
                  <span style={adminStyles.barLabelName}>{doc.name}</span>
                  <span style={adminStyles.barLabelRole}>{doc.role}</span>
                </div>
                <div style={adminStyles.barTrack}>
                  <div style={{ ...adminStyles.barFill, width: `${Math.min(doc.value * 5, 100)}%`, backgroundColor: colors.doctors }}></div>
                </div>
                <span style={adminStyles.barValue}>{doc.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Radiologists (GOLD) */}
        <div style={adminStyles.chartCard}>
          <h3 style={adminStyles.chartHeader}>Radiologist Scans</h3>
          <div style={{ marginTop: "20px" }}>
            {data.radiologist_workload.map((rad, i) => (
              <div key={i} style={adminStyles.barRow}>
                <div style={adminStyles.barLabelContainer}>
                   <span style={adminStyles.barLabelName}>{rad.name}</span>
                </div>
                <div style={adminStyles.barTrack}>
                  <div style={{ ...adminStyles.barFill, width: `${Math.min(rad.value * 5, 100)}%`, backgroundColor: colors.radiologists }}></div>
                </div>
                <span style={adminStyles.barValue}>{rad.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}