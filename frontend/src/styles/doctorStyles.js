export const doctorStyles = {
    container: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f8f9fa', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', overflow: 'hidden' },
        header: { height: '70px', flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 32px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0' },
        headerLogo: { display: 'flex', alignItems: 'center', gap: '12px' },
        headerLogoIcon: { width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#0a586c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' },
        headerLogoText: { fontSize: '22px', fontWeight: '700', color: '#0a586c' },
        mainWrapper: { display: 'flex', flex: 1, overflow: 'hidden' },
        sidebar: { width: '240px', backgroundColor: '#02505F', color: 'white', display: 'flex', flexDirection: 'column', borderTopRightRadius: '40px', paddingTop: '30px', paddingBottom: '20px', flexShrink: 0 },
        nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '20px' },
        navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', cursor: 'pointer', border: 'none', background: 'none', color: '#a0bec4', fontSize: '15px', textAlign: 'left', width: '100%', borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px' },
        navItemActive: { backgroundColor: '#f8f9fa', color: '#02505F', fontWeight: '600', boxShadow: '-5px 5px 10px rgba(0,0,0,0.05)' },
        logout: { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 40px', cursor: 'pointer', border: 'none', background: 'none', color: '#a0bec4', fontSize: '15px', marginTop: 'auto' },
        main: { flex: 1, padding: '24px 40px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: '20px' },
        
        // Components
        contentContainer: { display: 'flex', flexDirection: 'column', flex: 1, gap: '20px', minHeight: 0 },
        section: { flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', overflow: 'hidden' },
        sectionHeaderRow: { padding: '16px 24px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#ffffff' },
        sectionTitle: { fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: 0 },
        tableContainer: { display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' },
        tableHeader: { display: 'grid', padding: '10px 24px', backgroundColor: '#f8fafc', fontWeight: '600', fontSize: '12px', color: '#64748b', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.5px' },
        scrollableRows: { overflowY: 'auto', flex: 1 },
        tableRow: { display: 'grid', padding: '14px 24px', borderBottom: '1px solid #f1f5f9', alignItems: 'center', fontSize: '14px', color: '#334155' },
        appointmentGrid: { gridTemplateColumns: '1fr 1fr 1.5fr 1.5fr 1.5fr 1fr' },
        scanGrid: { gridTemplateColumns: '80px 1fr 1.5fr 1fr 1fr' },
        clickablePatientName: { color: '#0f172a', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '14px', textAlign: 'left' },
        statusBadge: { display: 'inline-flex', padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' },
        statusScheduled: { backgroundColor: '#eff6ff', color: '#3b82f6' },
        statusCompleted: { backgroundColor: '#f0fdf4', color: '#22c55e' },
        statusCancelled: { backgroundColor: '#fef2f2', color: '#ef4444' },
        statusNoShow: { backgroundColor: '#fff7ed', color: '#f97316' },
        actionButton: { padding: '6px 14px', backgroundColor: 'white', color: '#02505F', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' },

        // Profile Specific
        profileContainer: { display: 'grid', gridTemplateColumns: '300px 1fr 350px', gap: '24px', height: '100%', overflow: 'hidden' },
        card: { backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' },
        
        // Centered Patient Info
        patientInfoCentered: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '10px', gap: '12px' },
        infoGridCentered: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%' },
        infoItemCentered: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
        
        infoLabel: { fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' },
        infoValue: { fontSize: '14px', color: '#334155', fontWeight: '600' },

        // Consultation & Records
        tabGroup: { display: 'flex', gap: '4px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '8px' },
        tab: { flex: 1, padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s' },
        tabActive: { backgroundColor: 'white', color: '#02505F', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
        tabInactive: { backgroundColor: 'transparent', color: '#64748b' },
        
        // Forms
        formScroll: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' },
        formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
        inputLabel: { fontSize: '12px', fontWeight: '600', color: '#475569' },
        inputField: { padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', outline: 'none' },
        textAreaField: { padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', resize: 'vertical', minHeight: '60px' },

        // Modals
        modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 },
        modalBox: { backgroundColor: 'white', borderRadius: '16px', width: '500px', maxWidth: '90%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
        modalHeader: { padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        modalBody: { padding: '24px', overflowY: 'auto' },
        modalFooter: { padding: '20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px' },
  
};