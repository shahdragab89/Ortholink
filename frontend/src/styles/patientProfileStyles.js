// ========================================
// PATIENT PROFILE STYLES
// Used when doctor views a specific patient's profile
// ========================================

export const patientProfileStyles = {
    // --- PATIENT PROFILE LAYOUT (3-Column Grid) ---
    profileContainer: { 
        display: 'grid', 
        gridTemplateColumns: '300px 1fr 350px', // Left sidebar | Middle content | Right panel
        gap: '24px', 
        height: '100%', 
        overflow: 'hidden' 
    },
    
    // --- PATIENT INFO CARD (LEFT COLUMN) ---
    // Centered layout for patient demographics
    patientInfoCentered: { 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginTop: '10px', 
        gap: '12px' 
    },
    
    // Grid for Age, Gender, Blood Type, Allergies
    infoGridCentered: { 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '12px', 
        width: '100%' 
    },
    
    // Individual info item (centered text)
    infoItemCentered: { 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center' 
    }
};