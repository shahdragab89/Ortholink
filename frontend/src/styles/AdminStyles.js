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

};
