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
    }
};