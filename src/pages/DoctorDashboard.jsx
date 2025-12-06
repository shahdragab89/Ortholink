import React, { useState } from 'react';
import { Home, Users, User, LogOut, Eye, Activity } from 'lucide-react';

export default function DoctorDashboard() {
    const [activeTab, setActiveTab] = useState('home');
    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedScan, setSelectedScan] = useState(null);
    const [reportText, setReportText] = useState('');

    // Changed name to Maya as requested
    const doctorName = "Maya";

    const appointments = [
        { id: 1, date: '24 Feb 2024', time: '10:00 AM', patientName: 'Sarah Johnson', reason: 'Annual Physical', notes: 'Prev history of asthma', status: 'scheduled' },
        { id: 2, date: '24 Feb 2024', time: '11:30 AM', patientName: 'Michael Brown', reason: 'Knee Pain Consultation', notes: 'Injury during sports', status: 'completed' },
        { id: 3, date: '24 Feb 2024', time: '02:00 PM', patientName: 'Emily Davis', reason: 'Follow-up', notes: 'Check recovery progress', status: 'cancelled' },
        { id: 4, date: '25 Feb 2024', time: '09:00 AM', patientName: 'Robert Wilson', reason: 'Initial Consultation', notes: 'New patient', status: 'no-show' },
        { id: 5, date: '25 Feb 2024', time: '10:30 AM', patientName: 'Lisa Anderson', reason: 'Shoulder pain', notes: 'Persistent pain for 2 weeks', status: 'scheduled' },
        { id: 6, date: '25 Feb 2024', time: '11:00 AM', patientName: 'James Martin', reason: 'Routine Checkup', notes: 'Regular diabetic checkup', status: 'scheduled' },
        { id: 7, date: '25 Feb 2024', time: '01:30 PM', patientName: 'Kelly White', reason: 'Back Pain', notes: 'Lower back stiffness', status: 'scheduled' }
    ];

    const pendingScans = [
        { id: 1, scanType: 'MRI Brain', patientName: 'Robert Wilson', scanImage: 'mri_brain.jpg', date: '23 Feb 2024' },
        { id: 2, scanType: 'CT Chest', patientName: 'Lisa Anderson', scanImage: 'ct_chest.jpg', date: '23 Feb 2024' },
        { id: 3, scanType: 'X-Ray Knee', patientName: 'Michael Brown', scanImage: 'xray.jpg', date: '22 Feb 2024' },
        { id: 4, scanType: 'MRI Spine', patientName: 'Kelly White', scanImage: 'mri_spine.jpg', date: '22 Feb 2024' }
    ];

    const handleOpenReport = (scan) => {
        setSelectedScan(scan);
        setShowReportModal(true);
        setReportText('');
    };

    const handleSubmitReport = () => {
        console.log('Submitting report for:', selectedScan, 'Report:', reportText);
        setShowReportModal(false);
        setSelectedScan(null);
        setReportText('');
    };

    const handlePatientClick = (patientName) => {
        console.log('Clicked patient:', patientName);
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'scheduled': return styles.statusScheduled;
            case 'completed': return styles.statusCompleted;
            case 'cancelled': return styles.statusCancelled;
            case 'no-show': return styles.statusNoShow;
            default: return styles.statusScheduled;
        }
    };

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh', // Fixed height to stop page scroll
            backgroundColor: '#f8f9fa',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            overflow: 'hidden' // Prevent full page scroll
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
        headerLogo: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        headerLogoIcon: {
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: '#0a586c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px'
        },
        headerLogoText: {
            fontSize: '22px',
            fontWeight: '700',
            color: '#0a586c'
        },
        mainWrapper: {
            display: 'flex',
            flex: 1,
            overflow: 'hidden' // Important for inner scrolling
        },
        sidebar: {
            width: '240px',
            backgroundColor: '#02505F',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            borderTopRightRadius: '40px',
            paddingTop: '30px',
            paddingBottom: '20px',
            flexShrink: 0
        },
        nav: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            paddingLeft: '20px'
        },
        navItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 20px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            border: 'none',
            background: 'none',
            color: '#a0bec4',
            fontSize: '15px',
            textAlign: 'left',
            width: '100%',
            borderTopLeftRadius: '30px',
            borderBottomLeftRadius: '30px',
        },
        navItemActive: {
            backgroundColor: '#f8f9fa', // Matched bg color
            color: '#02505F',
            fontWeight: '600',
            boxShadow: '-5px 5px 10px rgba(0,0,0,0.05)'
        },
        logout: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 40px',
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            color: '#a0bec4',
            fontSize: '15px',
            marginTop: 'auto'
        },
        main: {
            flex: 1,
            padding: '40px 60px',
            overflowY: 'auto',
            backgroundColor: '#ffffff'
        },
        greeting: {
            marginBottom: '40px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between'
        },
        greetingTitle: {
            fontSize: '36px',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '16px'
        },
        greetingHighlight: {
            color: '#3b82f6'
        },
        greetingTextGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        },
        greetingIconContainer: {
            fontSize: '100px',
            lineHeight: 1,
            marginTop: '-20px',
            transform: 'rotate(-15deg)',
            opacity: 0.9
        },

        // CONTAINER FOR THE TWO TABLES
        contentContainer: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1, // Take remaining height
            gap: '24px',
            minHeight: 0 // Crucial for nested flex scrolling
        },
        section: {
            flex: 1, // Each section takes equal available space
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0, // Allows internal scrolling
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid #f1f5f9',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            overflow: 'hidden' // Keep borders clean
        },
        sectionHeaderRow: {
            padding: '20px 24px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#ffffff'
        },
        sectionTitle: {
            fontSize: '18px',
            fontWeight: '700',
            color: '#1e293b',
            margin: 0
        },

        // SCROLLABLE TABLE STYLES
        tableContainer: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            overflow: 'hidden'
        },
        tableHeader: {
            display: 'grid',
            padding: '12px 24px',
            backgroundColor: '#f8fafc',
            fontWeight: '600',
            fontSize: '13px',
            color: '#64748b',
            borderBottom: '1px solid #e2e8f0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        },
        scrollableRows: {
            overflowY: 'auto', // THIS ENABLES THE INTERNAL SCROLL
            flex: 1,
            // Custom scrollbar styling embedded below in Return
        },
        tableRow: {
            display: 'grid',
            padding: '16px 24px',
            borderBottom: '1px solid #f1f5f9',
            alignItems: 'center',
            fontSize: '14px',
            color: '#334155',
            transition: 'background-color 0.1s'
        },

        // Grid Layouts
        appointmentGrid: { gridTemplateColumns: '1fr 1fr 1.5fr 1.5fr 1.5fr 1fr' },
        scanGrid: { gridTemplateColumns: '80px 1fr 1.5fr 1fr 1fr' },

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
        statusBadge: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
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

        actionButton: {
            padding: '6px 16px',
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
            transition: 'all 0.2s',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        },

        // Modal Styles (Kept mostly same)
        modal: {
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        },
        modalContent: {
            backgroundColor: 'white', borderRadius: '20px', padding: '32px',
            width: '90%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            maxHeight: '90vh', overflowY: 'auto'
        },
        modalTitle: { fontSize: '22px', fontWeight: '700', color: '#02505F', marginBottom: '24px' },
        modalSection: { marginBottom: '20px' },
        modalLabel: { fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px', display: 'block' },
        modalValue: { fontSize: '16px', color: '#1e293b', fontWeight: '500' },
        textarea: {
            width: '100%', minHeight: '120px', padding: '12px',
            border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical', outline: 'none'
        },
        modalButtons: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' },
        modalButton: { padding: '10px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', border: 'none' },
        modalButtonPrimary: { backgroundColor: '#02505F', color: 'white' },
        modalButtonSecondary: { backgroundColor: '#f1f5f9', color: '#475569' }
    };

    return (
        <div style={styles.container}>
            {/* Inject Custom Scrollbar Styles for the tables */}
            <style>
                {`
                    ::-webkit-scrollbar { width: 6px; height: 6px; }
                    ::-webkit-scrollbar-track { background: transparent; }
                    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
                    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                `}
            </style>

            <header style={styles.header}>
                <div style={styles.headerLogo}>
                    <div style={styles.headerLogoIcon}>O</div>
                    <span style={styles.headerLogoText}>Ortholink</span>
                </div>
            </header>

            <div style={styles.mainWrapper}>
                <div style={styles.sidebar}>
                    <nav style={styles.nav}>
                        <button style={{ ...styles.navItem, ...(activeTab === 'home' ? styles.navItemActive : {}) }} onClick={() => setActiveTab('home')}>
                            <Home size={20} /> <span>Home</span>
                        </button>
                        <button style={{ ...styles.navItem, ...(activeTab === 'profile' ? styles.navItemActive : {}) }} onClick={() => setActiveTab('profile')}>
                            <User size={20} /> <span>Profile</span>
                        </button>
                        <button style={{ ...styles.navItem, ...(activeTab === 'patients' ? styles.navItemActive : {}) }} onClick={() => setActiveTab('patients')}>
                            <Users size={20} /> <span>Patients</span>
                        </button>
                    </nav>
                    <button style={styles.logout}>
                        <LogOut size={20} /> <span>Logout</span>
                    </button>
                </div>

                {/* <div style={styles.main}> */}
                {/* Welcome Header - Matching the Photo Style */}
                <div style={styles.main}>
                    <div style={styles.greeting}>
                        <div>
                            <h1 style={styles.greetingTitle}>
                                Welcome <span style={styles.greetingHighlight}>Mary!</span>
                            </h1>
                            <div style={styles.greetingBody}>
                                <p>You have <strong>{appointments.filter(a => a.status === 'scheduled').length} patients</strong> remaining today!</p>
                                <p>Remember to check documentation before call.</p>
                            </div>
                        </div>
                        <div style={styles.greetingIconContainer}>🩺</div>
                    </div>

                    {/* Content Container - Holds the 2 tables and fills remaining height */}
                    <div style={styles.contentContainer}>

                        {/* Appointments Table Section */}
                        <div style={styles.section}>
                            <div style={styles.sectionHeaderRow}>
                                <h2 style={styles.sectionTitle}>Today's Appointments</h2>
                            </div>
                            <div style={styles.tableContainer}>
                                {/* Fixed Header */}
                                <div style={{ ...styles.tableHeader, ...styles.appointmentGrid }}>
                                    <div>Date</div>
                                    <div>Time</div>
                                    <div>Patient</div>
                                    <div>Reason</div>
                                    <div>Notes</div>
                                    <div>Status</div>
                                </div>
                                {/* Scrollable Body */}
                                <div style={styles.scrollableRows}>
                                    {appointments.map((apt) => (
                                        <div key={apt.id} style={{ ...styles.tableRow, ...styles.appointmentGrid }}>
                                            <div>{apt.date}</div>
                                            <div>{apt.time}</div>
                                            <div>
                                                <button style={styles.clickablePatientName} onClick={() => handlePatientClick(apt.patientName)}>
                                                    {apt.patientName}
                                                </button>
                                            </div>
                                            <div>{apt.reason}</div>
                                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#64748b' }} title={apt.notes}>{apt.notes}</div>
                                            <div>
                                                <span style={{ ...styles.statusBadge, ...getStatusStyle(apt.status) }}>
                                                    {apt.status.replace('-', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Scans Table Section */}
                        <div style={styles.section}>
                            <div style={styles.sectionHeaderRow}>
                                <h2 style={styles.sectionTitle}>Pending Scan Reports</h2>
                            </div>
                            <div style={styles.tableContainer}>
                                {/* Fixed Header */}
                                <div style={{ ...styles.tableHeader, ...styles.scanGrid }}>
                                    <div>Scan</div>
                                    <div>Modality</div>
                                    <div>Patient</div>
                                    <div>Date</div>
                                    <div>Action</div>
                                </div>
                                {/* Scrollable Body */}
                                <div style={styles.scrollableRows}>
                                    {pendingScans.map((scan) => (
                                        <div key={scan.id} style={{ ...styles.tableRow, ...styles.scanGrid }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '6px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
                                                <img src={scan.scanImage} alt="scan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                            <div>{scan.scanType}</div>
                                            <div>
                                                <button style={styles.clickablePatientName} onClick={() => handlePatientClick(scan.patientName)}>
                                                    {scan.patientName}
                                                </button>
                                            </div>
                                            <div>{scan.date}</div>
                                            <div>
                                                <button
                                                    style={styles.actionButton}
                                                    onClick={() => handleOpenReport(scan)}
                                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc' }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white' }}
                                                >
                                                    <Eye size={14} /> View
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Modal Logic (Unchanged visually) */}
            {showReportModal && selectedScan && (
                <div style={styles.modal} onClick={() => setShowReportModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3 style={styles.modalTitle}>Scan Report Details</h3>
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ width: '100%', height: '200px', backgroundColor: '#000', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src={selectedScan.scanImage} alt="Scan" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                            </div>
                        </div>
                        <div style={styles.modalButtons}>
                            <button style={{ ...styles.modalButton, ...styles.modalButtonSecondary }} onClick={() => setShowReportModal(false)}>Close</button>
                            <button style={{ ...styles.modalButton, ...styles.modalButtonPrimary }} onClick={handleSubmitReport}>Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}