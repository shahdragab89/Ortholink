// ========================================
// DOCTOR PROFILE SETTINGS STYLES
// Used for "My Profile" settings page
// ========================================

export const doctorProfileStyles = {
    // --- DOCTOR PROFILE PAGE LAYOUT ---
    profilePageContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        overflowY: 'auto',
        flex: 1,
        paddingRight: '8px',
        paddingBottom: '40px'
    },
    
    // The main 2-Column Layout
    profileLayoutGrid: {
        display: 'grid',
        gridTemplateColumns: '320px 1fr', // Left column fixed 320px, Right fills rest
        gap: '20px',
        alignItems: 'start'
    },
    
    profileColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    
    // --- PROFILE CARD ---
    profileCard: {
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '24px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        height: 'fit-content'
    },
    
    profileCardTitle: { 
        fontSize: '18px', 
        fontWeight: '700', 
        color: '#02505F', 
        marginBottom: '20px' 
    },
    
    // --- PHOTO SECTION ---
    profilePhotoSection: { 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '16px', 
        marginBottom: '10px' 
    },
    
    profilePhotoCircle: {
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        backgroundColor: '#e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '56px',
        fontWeight: '700',
        color: '#64748b',
        position: 'relative',
        overflow: 'hidden',
        border: '4px solid white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
    },
    
    uploadButton: { 
        padding: '8px 16px', 
        backgroundColor: '#059669', 
        color: 'white', 
        border: 'none', 
        borderRadius: '8px', 
        cursor: 'pointer', 
        fontSize: '13px', 
        fontWeight: '600' 
    },
    
    // --- INPUT FIELDS ---
    infoRow: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '6px', 
        marginBottom: '16px' 
    },
    
    readOnlyField: { 
        padding: '10px 12px', 
        backgroundColor: '#f8fafc', 
        borderRadius: '8px', 
        border: '1px solid #e2e8f0', 
        fontSize: '14px', 
        color: '#64748b' 
    },
    
    editableField: { 
        padding: '10px 12px', 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        border: '1px solid #e2e8f0', 
        fontSize: '14px', 
        color: '#334155', 
        outline: 'none', 
        width: '100%' 
    },
    
    saveButton: { 
        padding: '12px 24px', 
        backgroundColor: '#059669', 
        color: 'white', 
        border: 'none', 
        borderRadius: '8px', 
        cursor: 'pointer', 
        fontSize: '14px', 
        fontWeight: '600', 
        marginTop: '20px' 
    },
    
    // --- PASSWORD & SECURITY ---
    passwordWrapper: { position: 'relative', width: '100%' },
    
    eyeIconBtn: { 
        position: 'absolute', 
        right: '12px', 
        top: '50%', 
        transform: 'translateY(-50%)', 
        background: 'none', 
        border: 'none', 
        cursor: 'pointer', 
        color: '#94a3b8', 
        display: 'flex', 
        alignItems: 'center' 
    },
    
    strengthBarContainer: { 
        height: '4px', 
        width: '100%', 
        backgroundColor: '#e2e8f0', 
        borderRadius: '2px', 
        marginTop: '8px', 
        marginBottom: '16px', 
        overflow: 'hidden' 
    },
    
    strengthBarFill: { 
        height: '100%', 
        borderRadius: '2px', 
        transition: 'width 0.3s ease, background-color 0.3s ease' 
    },

    // ... existing styles ...

    strengthBarFill: { 
        height: '100%', 
        borderRadius: '2px', 
        transition: 'width 0.3s ease, background-color 0.3s ease' 
    },

    // --- NEW STATS STYLES ---
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginTop: '10px'
    },
    
    statItem: {
        backgroundColor: '#f1f5f9', // Light Slate/Grey to match doctor theme
        padding: '20px',
        borderRadius: '12px',
        textAlign: 'center',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '8px'
    },
    
    statNumber: {
        display: 'block',
        fontSize: '28px',
        fontWeight: '800',
        color: '#059669', // Your specific Doctor Dark Teal
        lineHeight: '1'
    },
    
    statLabel: {
        fontSize: '13px',
        color: '#64748b',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },

    welcomeBanner: {
        backgroundColor: '#d1fae5', // Light Green background
        borderRadius: '20px',
        padding: '40px',
        marginBottom: '40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    },
    welcomeTextBox: {
        zIndex: 2,
        maxWidth: '60%',
    },
    welcomeTitle: {
        fontSize: '36px',
        fontWeight: '800',
        color: '#064e3b', // Very dark green
        marginBottom: '16px',
        lineHeight: '1.2',
    },
    welcomeSubText: {
        fontSize: '16px',
        color: '#047857',
        maxWidth: '500px',
        lineHeight: '1.5',
    },
    welcomeHighlight: {
        color: '#059669',
        fontWeight: '700',
    },
    welcomeIllustration: {
        height: '180px',
        width: 'auto',
        maxWidth: '300px',
        zIndex: 2,
        objectFit: 'contain',
        marginBottom: '-10px',
    },
    decorativeCircle1: { position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', backgroundColor: '#ecfdf5', zIndex: 1 },
    decorativeCircle2: { position: 'absolute', bottom: '-80px', left: '100px', width: '150px', height: '150px', borderRadius: '50%', backgroundColor: '#ecfdf5', zIndex: 1 },

    // --- NEW: TABLE SEARCH BAR STYLE ---
    tableSearchInput: {
        width: '100%',
        padding: '10px 16px',
        marginBottom: '16px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        fontSize: '14px',
        outline: 'none',
        backgroundColor: '#f8fafc',
        boxSizing: 'border-box' // Important for padding calculation
    }
};