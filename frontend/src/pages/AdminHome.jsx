import React, { useState } from "react";
import { adminStyles } from "../styles/AdminStyles";

export default function AdminHome() {
  
  // --- STATE (Backend Ready) ---
  const [dateFilter, setDateFilter] = useState("This Month");

  // --- MOCK DATA ---
  
  // 1. Overview Statistics
  // COLORS: Using the specific Green/Blue from your screenshots
  const stats = [
    // Financials & Volume
    { label: "Total Revenue", value: "$42,500", color: "#10B981", icon: "$" }, // Mint Green
    { label: "Total Patients", value: "1,240", color: "#102E44", icon: "P" },  // Navy
    { label: "Total Appointments", value: "342", color: "#4338CA", icon: "A" }, // Royal Blue
    
    // Staff Counts
    { label: "Doctors", value: "8", color: "#0EA5E9", icon: "D" },      // Sky Blue
    { label: "Radiologists", value: "4", color: "#0EA5E9", icon: "R" }, // Sky Blue
    { label: "Receptionists", value: "3", color: "#0EA5E9", icon: "S" }, // Sky Blue
  ];

  // 2. Appointment Outcomes (Bar Chart Data)
  const appointmentStats = [
    { label: "Completed", count: 210, color: "#10B981" }, // Green (Success)
    { label: "Upcoming", count: 85, color: "#4338CA" },   // Blue (Info)
    { label: "Cancelled", count: 12, color: "#EF4444" },  // Red (Danger)
    { label: "No Show", count: 35, color: "#9CA3AF" },    // Gray
  ];

  // 3. Modality Data (NO MRI)
  const modalityData = [
    { label: "X-Ray", value: 65, color: "#10B981" }, // Mint Green
    { label: "CT Scan", value: 35, color: "#102E44" } // Navy
  ];

  // 4. Staff Workload
  const doctorWorkload = [
    { name: "Dr. Ali", value: 90, role: "Surgeon" }, 
    { name: "Dr. Haza", value: 65, role: "Consultant" },
    { name: "Dr. Nour", value: 30, role: "Specialist" },
  ];

  const radioWorkload = [
    { name: "Dr. Sara", value: 95 },
    { name: "Dr. Omar", value: 70 },
    { name: "Dr. Zain", value: 50 },
  ];

  return (
    <div style={adminStyles.dashboardContainer}>
      
      {/* HEADER & FILTER */}
      <div style={adminStyles.dashboardHeader}>
        <div>
          <h2 style={adminStyles.dashboardTitle}>OrthoLink Analytics</h2>
          <p style={adminStyles.dashboardSubtitle}>Center performance & financial overview</p>
        </div>
        
        {/* NEW CYLINDER FILTER UI */}
        <div style={adminStyles.filterContainer}>
            <span style={{fontSize: "13px", color: "#666", marginRight: "10px", fontWeight: "600"}}>Period:</span>
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={adminStyles.filterButton}
            >
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
        </div>
      </div>

      {/* SECTION 1: STATS GRID (6 Cards) */}
      <div style={adminStyles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            ...adminStyles.statCard, 
            borderLeft: `5px solid ${stat.color}` 
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                <div>
                    <span style={adminStyles.statTitle}>{stat.label}</span>
                    <div style={{ ...adminStyles.statValue, color: stat.color }}>
                    {stat.value}
                    </div>
                </div>
                {/* Colored Icon Box */}
                <div style={{ 
                    width: "45px", height: "45px", 
                    borderRadius: "12px", 
                    backgroundColor: `${stat.color}15`, // Very light opacity
                    color: stat.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "20px", fontWeight: "bold"
                }}>
                    {stat.icon}
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 2: CHARTS */}
      <div style={adminStyles.chartsGrid}>
        
        {/* A. APPOINTMENT ACTIVITY */}
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
                    {/* Modern Rounded Progress Bar */}
                    <div style={{ width: "100%", height: "10px", backgroundColor: "#f3f4f6", borderRadius: "10px", overflow: "hidden" }}>
                        <div style={{ 
                            width: `${(item.count / 342) * 100}%`, 
                            height: "100%", 
                            backgroundColor: item.color,
                            borderRadius: "10px",
                            transition: "width 0.5s ease-in-out"
                        }}></div>
                    </div>
                </div>
            ))}
          </div>
        </div>

        {/* B. REVENUE TRENDS */}
        <div style={adminStyles.chartCard}>
          <div style={adminStyles.cardHeaderRow}>
            <h3 style={adminStyles.chartHeader}>Financial Growth</h3>
          </div>
          <div style={adminStyles.barChartContainer}>
            {['Oct', 'Nov', 'Dec'].map((month, i) => {
              const heights = ["40%", "65%", "85%"]; 
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  {/* Bar Background Track */}
                  <div style={{ 
                    width: "35px", height: "150px", 
                    display: "flex", alignItems: "flex-end", justifyContent: "center",
                    backgroundColor: "#f3f4f6", borderRadius: "20px" // Rounded cylinder look
                  }}>
                    {/* Active Bar */}
                    <div style={{ 
                      width: "100%", height: heights[i], 
                      backgroundColor: "#10B981", // Mint Green
                      borderRadius: "20px",
                      boxShadow: "0 4px 10px rgba(16, 185, 129, 0.2)" 
                    }}></div>
                  </div>
                  <span style={{ marginTop: "12px", fontSize: "13px", fontWeight: "600", color: "#666" }}>{month}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* C. MODALITY (X-RAY & CT ONLY) */}
        <div style={adminStyles.chartCard}>
          <h3 style={adminStyles.chartHeader}>Scan Modality</h3>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
            
            {/* Pie Chart: 65% Green, 35% Navy */}
            <div
              style={{
                width: "150px", height: "150px", borderRadius: "50%",
                background: "conic-gradient(#10B981 0% 65%, #102E44 65% 100%)",
                marginBottom: "25px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
              }}
            ></div>

            {/* Legend (Fixed Colors) */}
            <div style={{ display: "flex", gap: "20px", fontSize: "13px", color: "#444" }}>
               {modalityData.map((m, i) => (
                 <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {/* The Color Box */}
                    <div style={{ 
                      width: "12px", height: "12px", 
                      borderRadius: "4px", 
                      backgroundColor: m.color // Inline style ensures color appears
                    }}></div>
                    <span style={{ fontWeight: "600" }}>{m.label}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 3: STAFF WORKLOAD */}
      <div style={adminStyles.performanceGrid}>
        
        {/* Doctors */}
        <div style={adminStyles.chartCard}>
          <h3 style={adminStyles.chartHeader}>Doctor Cases</h3>
          <div style={{ marginTop: "20px" }}>
            {doctorWorkload.map((doc, i) => (
              <div key={i} style={adminStyles.barRow}>
                {/* Name Section */}
                <div style={adminStyles.barLabelContainer}>
                  <span style={adminStyles.barLabelName}>{doc.name}</span>
                  <span style={adminStyles.barLabelRole}>{doc.role}</span>
                </div>
                
                {/* Bar Track */}
                <div style={adminStyles.barTrack}>
                  <div style={{ ...adminStyles.barFill, width: `${doc.value}%`, backgroundColor: "#102E44" }}></div>
                </div>
                
                {/* Number */}
                <span style={adminStyles.barValue}>{doc.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Radiologists */}
        <div style={adminStyles.chartCard}>
          <h3 style={adminStyles.chartHeader}>Radiologist Scans</h3>
          <div style={{ marginTop: "20px" }}>
            {radioWorkload.map((rad, i) => (
              <div key={i} style={adminStyles.barRow}>
                <div style={adminStyles.barLabelContainer}>
                   <span style={adminStyles.barLabelName}>{rad.name}</span>
                </div>
                <div style={adminStyles.barTrack}>
                  <div style={{ ...adminStyles.barFill, width: `${rad.value}%`, backgroundColor: "#10B981" }}></div>
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