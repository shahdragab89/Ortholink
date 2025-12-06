import React, { useState } from 'react';
import { Home, Users, User, LogOut, Eye } from 'lucide-react';

export default function DoctorDashboard() {
    const [activeTab, setActiveTab] = useState('home');
    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedScan, setSelectedScan] = useState(null);
    const [reportText, setReportText] = useState('');

    // 1. Updated Sample Data with new statuses, reasons, and notes
    const appointments = [
        { id: 1, date: '24 Feb 2024', time: '10:00 AM', patientName: 'Sarah Johnson', reason: 'Annual Physical', notes: 'Prev history of asthma', status: 'scheduled' },
        { id: 2, date: '24 Feb 2024', time: '11:30 AM', patientName: 'Michael Brown', reason: 'Knee Pain Consultation', notes: 'Injury during sports', status: 'completed' },
        { id: 3, date: '24 Feb 2024', time: '02:00 PM', patientName: 'Emily Davis', reason: 'Follow-up', notes: 'Check recovery progress', status: 'cancelled' },
        { id: 4, date: '25 Feb 2024', time: '09:00 AM', patientName: 'Robert Wilson', reason: 'Initial Consultation', notes: 'New patient', status: 'no-show' },
        { id: 5, date: '25 Feb 2024', time: '10:30 AM', patientName: 'Lisa Anderson', reason: 'Shoulder pain', notes: 'Persistent pain for 2 weeks', status: 'scheduled' }
    ];

    // 2. Updated Scan Data with better images
    const pendingScans = [
        { 
            id: 1, 
            scanType: 'MRI Brain', 
            patientName: 'Robert Wilson', 
            scanImage: 'mri_brain.jpg', 
            date: '23 Feb 2024' 
        },
        { 
            id: 2, 
            scanType: 'CT Chest', 
            patientName: 'Lisa Anderson', 
            scanImage: 'ct_chest.jpg', 
            date: '23 Feb 2024' 
        },
        { 
            id: 3, 
            scanType: 'X-Ray Knee', 
            patientName: 'Michael Brown', 
            scanImage: 'xray.jpg', 
            date: '22 Feb 2024' 
        }
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

    const styles = {
        container: {
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: '#ffffff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        },
        sidebar: {
            width: '240px',
            backgroundColor: '#02505F',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            borderTopRightRadius: '60px',
            borderBottomRightRadius: '0px', 
            paddingTop: '40px',
            paddingBottom: '30px',
            position: 'relative'
        },
        logo: {
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '60px',
            paddingLeft: '30px'
        },
        logoIcon: {
            width: '32px',
            height: '32px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '18px'
        },
        logoText: {
            fontSize: '22px',
            fontWeight: '600',
            color: 'white',
            letterSpacing: '0.5px'
        },
        nav: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            paddingLeft: '30px'
        },
        navItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            border: 'none',
            background: 'none',
            color: '#a0bec4',
            fontSize: '16px',
            textAlign: 'left',
            width: '100%',
            borderTopLeftRadius: '30px',
            borderBottomLeftRadius: '30px',
            position: 'relative'
        },
        navItemActive: {
            backgroundColor: '#ffffff',
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
            fontSize: '16px',
            marginTop: 'auto',
            transition: 'all 0.2s'
        },
        main: {
            flex: 1,
            padding: '40px 60px',
            overflowY: 'auto',
            backgroundColor: '#ffffff'
        },
        // 3. Updated Greeting Styles based on image
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
            color: '#3b82f6' // Blue color for the name
        },
        greetingBody: {
            fontSize: '18px',
            color: '#334155',
            lineHeight: '1.5',
            maxWidth: '600px'
        },
        greetingIconContainer: {
             fontSize: '100px',
             lineHeight: 1,
             marginTop: '-20px',
             transform: 'rotate(-15deg)',
             opacity: 0.9
        },
        section: {
            marginBottom: '40px'
        },
        sectionTitle: {
            fontSize: '20px',
            fontWeight: '700',
            color: '#02505F',
            marginBottom: '24px'
        },
        table: {
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid #f0f0f0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
        },
        tableHeader: {
            backgroundColor: '#E0F7FA',
            display: 'grid',
            padding: '18px 24px',
            fontWeight: '600',
            fontSize: '14px',
            color: '#02505F',
            borderBottom: '1px solid #e2e8f0'
        },
        // 4. Updated Grid Layout for Appointments (added Reason, Notes; removed Action)
        appointmentHeader: {
            gridTemplateColumns: '0.8fr 0.8fr 1.2fr 1.5fr 1.5fr 1fr'
        },
        scanHeader: {
            gridTemplateColumns: '100px 1fr 1.5fr 1fr 1fr'
        },
        tableRow: {
            display: 'grid',
            padding: '20px 24px',
            borderBottom: '1px solid #f1f5f9',
            alignItems: 'center',
            fontSize: '15px',
            color: '#475569'
        },
        // 5. Style for clickable patient names
        clickablePatientName: {
            color: '#02505F',
            fontWeight: '600',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            fontSize: '15px',
            textAlign: 'left',
            textDecoration: 'none',
            transition: 'color 0.2s'
        },
        statusBadge: {
            display: 'inline-block',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
            textTransform: 'capitalize'
        },
        // 6. New Status Styles
        statusScheduled: { backgroundColor: '#E0F2F1', color: '#00897B' }, // Teal
        statusCompleted: { backgroundColor: '#F0FDF4', color: '#166534' }, // Green
        statusCancelled: { backgroundColor: '#FEF2F2', color: '#B91C1C' }, // Red
        statusNoShow:    { backgroundColor: '#FFF7ED', color: '#C2410C' }, // Orange

        scanImageContainer: {
            width: '60px',
            height: '60px',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#f1f5f9',
            border: '1px solid #e2e8f0'
        },
        scanImg: {
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        },
        actionButton: {
            padding: '8px 16px',
            backgroundColor: 'white',
            color: '#02505F',
            border: '1px solid #02505F',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
        },
        modal: {
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
        },
        modalContent: {
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '32px',
            width: '90%', maxWidth: '500px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            maxHeight: '90vh', overflowY: 'auto'
        },
        modalTitle: { fontSize: '22px', fontWeight: '700', color: '#02505F', marginBottom: '24px' },
        modalSection: { marginBottom: '20px' },
        modalLabel: { fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px', display: 'block' },
        modalValue: { fontSize: '16px', color: '#1e293b', fontWeight: '500' },
        scanImagePlaceholder: {
            width: '100%',
            height: '250px',
            backgroundColor: '#000',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', marginBottom: '20px'
        },
        textarea: {
            width: '100%', minHeight: '120px', padding: '12px',
            border: '1px solid #e2e8f0', borderRadius: '8px',
            fontSize: '14px', fontFamily: 'inherit', resize: 'vertical', outline: 'none'
        },
        modalButtons: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' },
        modalButton: { padding: '10px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', border: 'none' },
        modalButtonPrimary: { backgroundColor: '#02505F', color: 'white' },
        modalButtonSecondary: { backgroundColor: '#f1f5f9', color: '#475569' }
    };

    // Helper function to get status style
    const getStatusStyle = (status) => {
        switch(status) {
            case 'scheduled': return styles.statusScheduled;
            case 'completed': return styles.statusCompleted;
            case 'cancelled': return styles.statusCancelled;
            case 'no-show': return styles.statusNoShow;
            default: return styles.statusScheduled;
        }
    };

    return (
        <div style={styles.container}>
            {/* Sidebar (No changes requested here) */}
            <div style={styles.sidebar}>
                <div style={styles.logo}>
                    <div style={styles.logoIcon}>O</div>
                    <div style={styles.logoText}>Ortholink</div>
                </div>
                <nav style={styles.nav}>
                    <button style={{...styles.navItem, ...(activeTab === 'home' ? styles.navItemActive : {})}} onClick={() => setActiveTab('home')}>
                        <Home size={20} /> <span>Home</span>
                    </button>
                    <button style={{...styles.navItem, ...(activeTab === 'profile' ? styles.navItemActive : {})}} onClick={() => setActiveTab('profile')}>
                        <User size={20} /> <span>Profile</span>
                    </button>
                     <button style={{...styles.navItem, ...(activeTab === 'patients' ? styles.navItemActive : {})}} onClick={() => setActiveTab('patients')}>
                        <Users size={20} /> <span>Patients</span>
                    </button>
                </nav>
                <button style={styles.logout}>
                    <LogOut size={20} /> <span>Logout</span>
                </button>
            </div>

            {/* Main Content */}
            <div style={styles.main}>
                
                {/* 7. New Greeting Section matching the image layout */}
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
                    {/* Using an emoji as a placeholder for the stethoscope illustration */}
                    <div style={styles.greetingIconContainer}>
                        🩺
                    </div>
                </div>

                {/* Upcoming Appointments */}
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Today's Appointments</h2>
                    <div style={styles.table}>
                        {/* Updated Header: Patient, Reason, Notes added. Action removed. */}
                        <div style={{...styles.tableHeader, ...styles.appointmentHeader}}>
                            <div>Date</div>
                            <div>Time</div>
                            <div>Patient</div>
                            <div>Reason</div>
                            <div>Notes</div>
                            <div>Status</div>
                        </div>
                        {appointments.map((apt) => (
                            <div key={apt.id} style={{...styles.tableRow, ...styles.appointmentHeader}}>
                                <div>{apt.date}</div>
                                <div>{apt.time}</div>
                                <div>
                                    {/* 8. Clickable Patient Name in Appointments */}
                                    <button 
                                        style={styles.clickablePatientName} 
                                        onClick={() => handlePatientClick(apt.patientName)}
                                        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                    >
                                        {apt.patientName}
                                    </button>
                                </div>
                                <div>{apt.reason}</div>
                                <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} title={apt.notes}>{apt.notes}</div>
                                <div>
                                    <span style={{...styles.statusBadge, ...getStatusStyle(apt.status)}}>
                                        {apt.status.replace('-', ' ')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pending Scans */}
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Pending Scan Reports</h2>
                    <div style={styles.table}>
                        <div style={{...styles.tableHeader, ...styles.scanHeader}}>
                            <div>Scan</div>
                            <div>Modality</div>
                            <div>Patient</div>
                            <div>Date</div>
                            <div>Action</div>
                        </div>
                        {pendingScans.map((scan) => (
                            <div key={scan.id} style={{...styles.tableRow, ...styles.scanHeader}}>
                                <div style={styles.scanImageContainer}>
                                    <img src={scan.scanImage} alt={scan.scanType} style={styles.scanImg} />
                                </div>
                                <div>{scan.scanType}</div>
                                <div>
                                    {/* 9. Clickable Patient Name in Scans */}
                                    <button 
                                        style={styles.clickablePatientName} 
                                        onClick={() => handlePatientClick(scan.patientName)}
                                        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                    >
                                        {scan.patientName}
                                    </button>
                                </div>
                                <div>{scan.date}</div>
                                <div>
                                    <button
                                        style={styles.actionButton}
                                        onClick={() => handleOpenReport(scan)}
                                        onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = '#02505F'; e.currentTarget.style.color = 'white';}}
                                        onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#02505F';}}
                                    >
                                        <Eye size={16} />
                                        View
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Report Modal (No major changes here, just style tweaks) */}
            {showReportModal && selectedScan && (
                <div style={styles.modal} onClick={() => setShowReportModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3 style={styles.modalTitle}>Scan Report Details</h3>
                        
                        <div style={styles.modalSection}>
                            <div style={styles.scanImagePlaceholder}>
                                <img src={selectedScan.scanImage} alt="Scan Full View" style={{height: '100%', width: 'auto', objectFit: 'contain'}} />
                            </div>
                        </div>

                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px'}}>
                            <div>
                                <label style={styles.modalLabel}>Modality</label>
                                <div style={styles.modalValue}>{selectedScan.scanType}</div>
                            </div>
                            <div>
                                <label style={styles.modalLabel}>Patient</label>
                                <div style={styles.modalValue}>{selectedScan.patientName}</div>
                            </div>
                        </div>

                        <div style={styles.modalSection}>
                            <label style={styles.modalLabel}>Doctor's Findings & Notes</label>
                            <textarea
                                style={styles.textarea}
                                placeholder="Enter your diagnosis and observations here..."
                                value={reportText}
                                onChange={(e) => setReportText(e.target.value)}
                            />
                        </div>

                        <div style={styles.modalButtons}>
                            <button
                                style={{...styles.modalButton, ...styles.modalButtonSecondary}}
                                onClick={() => setShowReportModal(false)}
                            >
                                Close
                            </button>
                            <button
                                style={{...styles.modalButton, ...styles.modalButtonPrimary}}
                                onClick={handleSubmitReport}
                            >
                                Submit Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}