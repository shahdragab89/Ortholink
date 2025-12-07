// ========================================
// SHARED STYLES - Used by both contexts
// ========================================

export const sharedStyles = {
    // --- MAIN LAYOUT ---
    container: { 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        backgroundColor: '#f8f9fa', 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', 
        overflow: 'hidden' 
    },
    
    header: { 
        height: '70px', 
        flexShrink: 0, 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 32px', 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e2e8f0' 
    },
    
    headerLogo: { display: 'flex', alignItems: 'center', gap: '12px' },
    headerLogoIcon: { width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#0a586c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' },
    headerLogoText: { fontSize: '22px', fontWeight: '700', color: '#0a586c' },
    mainWrapper: { display: 'flex', flex: 1, overflow: 'hidden' },
    
    // --- SIDEBAR (NEW STYLE) ---
    sidebar: { 
        width: '250px', 
        backgroundColor: '#0a586c', 
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        borderTopRightRadius: '24px', 
        padding: '24px 20px', 
        flexShrink: 0 
    },
    
    nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '30px' },
    
    navItem: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        padding: '10px 12px', 
        cursor: 'pointer', 
        border: 'none', 
        backgroundColor: 'transparent', 
        color: 'white', 
        fontSize: '14px', 
        textAlign: 'left', 
        width: '100%', 
        borderRadius: '12px', 
        transition: 'all 0.2s' 
    },
    
    navItemActive: { backgroundColor: '#083f4d', color: 'white', fontWeight: '600' },
    
    sidebarFooter: { 
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'flex-start', 
        gap: '10px', 
        paddingTop: '16px', 
        marginTop: '24px', 
        borderTop: '1px solid rgba(255,255,255,0.2)' 
    },
    
    profilePic: { 
        width: '40px', 
        height: '40px', 
        borderRadius: '50%', 
        backgroundColor: 'rgba(255,255,255,0.3)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        fontWeight: '600', 
        textTransform: 'uppercase', 
        color: 'white', 
        fontSize: '14px' 
    },
    
    profileName: { fontSize: '14px', fontWeight: '500', color: 'white' },
    
    logout: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        padding: '10px 12px', 
        cursor: 'pointer', 
        border: 'none', 
        background: 'none', 
        color: 'white', 
        fontSize: '14px', 
        borderRadius: '12px', 
        width: '100%', 
        marginBottom: '10px', 
        transition: 'all 0.2s' 
    },
    
    // --- MAIN CONTENT AREA ---
    main: { 
        flex: 1, 
        padding: '24px 40px', 
        backgroundColor: '#ffffff', 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden', 
        gap: '20px' 
    },
    
    contentContainer: { 
        display: 'flex', 
        flexDirection: 'column', 
        flex: 1, 
        gap: '20px', 
        minHeight: 0 
    },
    
    section: { 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: 0, 
        backgroundColor: 'white', 
        borderRadius: '16px', 
        border: '1px solid #f1f5f9', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)', 
        overflow: 'hidden' 
    },
    
    sectionHeaderRow: { 
        padding: '16px 24px', 
        borderBottom: '1px solid #f1f5f9', 
        backgroundColor: '#ffffff' 
    },
    
    sectionTitle: { 
        fontSize: '16px', 
        fontWeight: '700', 
        color: '#1e293b', 
        margin: 0 
    },
    
    // --- TABLES (Shared) ---
    tableContainer: { 
        display: 'flex', 
        flexDirection: 'column', 
        flex: 1, 
        overflow: 'hidden' 
    },
    
    tableHeader: { 
        display: 'grid', 
        padding: '10px 24px', 
        backgroundColor: '#f8fafc', 
        fontWeight: '600', 
        fontSize: '12px', 
        color: '#64748b', 
        borderBottom: '1px solid #e2e8f0', 
        textTransform: 'uppercase', 
        letterSpacing: '0.5px' 
    },
    
    scrollableRows: { overflowY: 'auto', flex: 1 },
    
    tableRow: { 
        display: 'grid', 
        padding: '14px 24px', 
        borderBottom: '1px solid #f1f5f9', 
        alignItems: 'center', 
        fontSize: '14px', 
        color: '#334155', 
        transition: 'background-color 0.1s' 
    },
    
    appointmentGrid: { gridTemplateColumns: '1fr 1fr 1.5fr 1.5fr 1.5fr 1fr' },
    scanGrid: { gridTemplateColumns: '80px 1fr 1.5fr 1fr 1fr' },
    patientListGrid: { gridTemplateColumns: '1.5fr 1.5fr 1.2fr 1fr 1fr' },
    
    clickablePatientName: { 
        color: '#0f172a', 
        fontWeight: '600', 
        background: 'none', 
        border: 'none', 
        cursor: 'pointer', 
        padding: 0, 
        fontSize: '14px', 
        textAlign: 'left' 
    },
    
    // --- STATUS BADGES ---
    statusBadge: { 
        display: 'inline-flex', 
        padding: '4px 12px', 
        borderRadius: '99px', 
        fontSize: '12px', 
        fontWeight: '600', 
        textTransform: 'capitalize' 
    },
    
    statusScheduled: { backgroundColor: '#eff6ff', color: '#3b82f6' },
    statusCompleted: { backgroundColor: '#f0fdf4', color: '#22c55e' },
    statusCancelled: { backgroundColor: '#fef2f2', color: '#ef4444' },
    statusNoShow: { backgroundColor: '#fff7ed', color: '#f97316' },
    
    // --- PHASE BADGES ---
    phaseBadge: { 
        padding: '4px 10px', 
        borderRadius: '6px', 
        fontSize: '11px', 
        fontWeight: '700', 
        textTransform: 'uppercase', 
        letterSpacing: '0.5px', 
        border: '1px solid transparent', 
        whiteSpace: 'nowrap' 
    },
    
    phasePreOp: { backgroundColor: '#fff7ed', color: '#c2410c', borderColor: '#ffedd5' },
    phasePostOp: { backgroundColor: '#eff6ff', color: '#1d4ed8', borderColor: '#dbeafe' },
    phaseRehab: { backgroundColor: '#f0fdf4', color: '#15803d', borderColor: '#dcfce7' },
    phaseConservative: { backgroundColor: '#f5f3ff', color: '#7c3aed', borderColor: '#ede9fe' },
    
    // --- ACTION BUTTONS ---
    actionButton: { 
        padding: '6px 14px', 
        backgroundColor: 'white', 
        color: '#02505F', 
        border: '1px solid #e2e8f0', 
        borderRadius: '6px', 
        cursor: 'pointer', 
        fontSize: '12px', 
        fontWeight: '600', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '6px', 
        transition: 'all 0.2s' 
    },
    
    // --- FORM ELEMENTS ---
    formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    inputLabel: { fontSize: '12px', fontWeight: '600', color: '#475569' },
    inputField: { 
        padding: '10px', 
        border: '1px solid #e2e8f0', 
        borderRadius: '8px', 
        fontSize: '14px', 
        fontFamily: 'inherit', 
        outline: 'none' 
    },
    textAreaField: { 
        padding: '10px', 
        border: '1px solid #e2e8f0', 
        borderRadius: '8px', 
        fontSize: '14px', 
        fontFamily: 'inherit', 
        outline: 'none', 
        resize: 'vertical', 
        minHeight: '60px' 
    },
    
    // --- MODALS ---
    modalOverlay: { 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        zIndex: 2000 
    },
    
    modalBox: { 
        backgroundColor: 'white', 
        borderRadius: '16px', 
        width: '500px', 
        maxWidth: '90%', 
        maxHeight: '90vh', 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden' 
    },
    
    modalHeader: { 
        padding: '20px', 
        borderBottom: '1px solid #f1f5f9', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
    },
    
    modalBody: { padding: '24px', overflowY: 'auto' },
    modalFooter: { 
        padding: '20px', 
        borderTop: '1px solid #f1f5f9', 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: '12px' 
    },
    
    // --- SEARCH ---
    searchContainer: { 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '24px' 
    },
    
    searchWrapper: { position: 'relative', width: '100%', maxWidth: '400px' },
    searchInput: { 
        width: '100%', 
        padding: '12px 16px 12px 40px', 
        borderRadius: '12px', 
        border: '1px solid #e2e8f0', 
        fontSize: '14px', 
        outline: 'none', 
        backgroundColor: 'white', 
        transition: 'border-color 0.2s' 
    },
    searchIcon: { 
        position: 'absolute', 
        left: '12px', 
        top: '50%', 
        transform: 'translateY(-50%)', 
        color: '#94a3b8' 
    },
    
    // --- COMMON CARDS ---
    card: { 
        backgroundColor: 'white', 
        borderRadius: '16px', 
        border: '1px solid #e2e8f0', 
        padding: '24px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.01)' 
    },
    
    infoLabel: { 
        fontSize: '11px', 
        color: '#94a3b8', 
        fontWeight: '600', 
        textTransform: 'uppercase', 
        marginBottom: '4px' 
    },
    
    infoValue: { fontSize: '14px', color: '#334155', fontWeight: '600' },
    
    // --- TABS ---
    tabGroup: { 
        display: 'flex', 
        gap: '4px', 
        backgroundColor: '#f1f5f9', 
        padding: '4px', 
        borderRadius: '8px' 
    },
    
    tab: { 
        flex: 1, 
        padding: '8px', 
        borderRadius: '6px', 
        border: 'none', 
        cursor: 'pointer', 
        fontSize: '13px', 
        fontWeight: '600', 
        transition: 'all 0.2s' 
    },
    
    tabActive: { 
        backgroundColor: 'white', 
        color: '#02505F', 
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)' 
    },
    
    tabInactive: { backgroundColor: 'transparent', color: '#64748b' },
    
    formScroll: { 
        flex: 1, 
        overflowY: 'auto', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px', 
        paddingRight: '4px' 
    }
};