export const adminStyles = {
  layout: {
    display: "flex",
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#f7f7f7",
  },

  /* =====================
     SIDEBAR (Teal UI)
     ===================== */
  sidebar: {
    width: "250px",
    backgroundColor: "#075E68",
    color: "white",
    paddingTop: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    borderTopRightRadius: "25px",      // << Rounded top-right corner
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "35px",
    marginTop: "15px",
  },

  logoCircle: {
    width: "42px",
    height: "42px",
    backgroundColor: "#0F9DA5",
    borderRadius: "50%",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "22px",
  },

  logoText: {
    fontSize: "22px",
    fontWeight: "600",
  },

  /* =====================
     SIDEBAR MENU
     ===================== */
  menuList: {
    listStyle: "none",
    padding: 0,
    width: "100%",
    marginTop: "20px",      // Start menu BELOW logo
  },

  menuItem: {
    marginBottom: "12px",
    width: "100%",
  },

  menuButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 25px",
    textDecoration: "none",
    color: "white",
    fontSize: "17px",
    transition: "0.2s",
    borderRadius: "8px",
  },

  menuButtonHover: {
    backgroundColor: "#0F8190",
  },

  selectedItem: {
    backgroundColor: "#ffffff33",
  },

  /* =====================
     MAIN CONTENT
     ===================== */
  mainContent: {
    marginLeft: "250px",
    padding: "40px",
    width: "calc(100% - 250px)",
    backgroundColor: "#ffffff",
    minHeight: "100vh",
  },

  pageTitle: {
    fontSize: "26px",
    fontWeight: "600",
    color: "#075E68",
    marginBottom: "20px",
  },

  placeholderBox: {
    backgroundColor: "#f0f0f0",
    borderRadius: "12px",
    padding: "40px",
    textAlign: "center",
    color: "#888",
    marginTop: "30px",
  },

modalOverlay: {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.3)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
},

modalContent: {
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "12px",
  width: "400px",
  maxHeight: "90vh",    
  overflowY: "auto",   
  boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
},

/* =====================
     DASHBOARD / HOME STYLES
     ===================== */
  dashboardContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },

  dashboardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "25px",
  },

  dashboardTitle: {
    color: "#102E44", // Dark Navy
    fontSize: "28px",
    fontWeight: "800",
    margin: "0 0 5px 0",
  },

  dashboardSubtitle: {
    color: "#888",
    fontSize: "14px",
    margin: 0,
  },

  /* --- NEW FILTER STYLES (Cylindrical) --- */
  filterContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "white",
    padding: "8px 20px",
    borderRadius: "50px", // Cylinder shape
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    border: "1px solid #eee",
  },

  filterButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#102E44",
    fontSize: "14px",
    fontWeight: "700", // Bolder text
    cursor: "pointer",
    outline: "none",
    minWidth: "110px",
  },

  /* --- ROW 1: STAT CARDS (3 Columns for 6 Cards) --- */
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", 
    gap: "20px",
  },

  statCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
    display: "flex",
    alignItems: "center", // Aligns the text and the icon box
    transition: "transform 0.2s",
  },

  statTitle: {
    color: "#888",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: "5px",
    display: "block",
  },

  statValue: {
    fontSize: "28px",
    fontWeight: "800",
  },

  /* --- ROW 2: CHARTS --- */
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 0.8fr", 
    gap: "20px",
  },

  chartCard: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
    minHeight: "280px",
    display: "flex",
    flexDirection: "column",
  },

  cardHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  chartHeader: {
    color: "#102E44",
    fontSize: "18px",
    fontWeight: "700",
    margin: 0,
  },

  barChartContainer: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-around",
    flex: 1,
    paddingBottom: "10px",
  },

  /* --- ROW 3: STAFF PERFORMANCE --- */
  performanceGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },

  /* --- CHART UTILITIES (Bars, Names, etc) --- */
  barRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },

  /* NEW: Container for Name + Role to prevent touching the bar */
  barLabelContainer: {
    width: "120px", // Fixed width reserves space for text
    marginRight: "15px", 
    display: "flex",
    flexDirection: "column",
  },

  barLabelName: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#333",
  },

  barLabelRole: {
    fontSize: "11px",
    color: "#999",
    marginTop: "2px",
  },

  barTrack: {
    flex: 1,
    height: "10px", 
    backgroundColor: "#F3F4F6",
    borderRadius: "10px", // Rounded ends
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    borderRadius: "10px",
  },

  barValue: {
    marginLeft: "15px",
    fontSize: "14px",
    fontWeight: "700",
    color: "#333",
    width: "30px",
    textAlign: "right",
  },

};
