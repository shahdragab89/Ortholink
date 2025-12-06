import React, { useState } from 'react';
import { Home, Users, User, LogOut, FileText, Eye } from 'lucide-react';

export default function DoctorDashboard() {
    const [activeTab, setActiveTab] = useState('home');
    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedScan, setSelectedScan] = useState(null);
    const [reportText, setReportText] = useState('');

    // Sample data
    const appointments = [
        { id: 1, date: '12 Feb 2020', time: '10:00 AM', patientName: 'Dr. Smith', reason: 'Regular Checkup', status: 'Confirmed' },
        { id: 2, date: '13 Feb 2020', time: '11:30 AM', patientName: 'Dr. Jones', reason: 'Follow-up', status: 'Pending' },
        { id: 3, date: '14 Feb 2020', time: '02:00 PM', patientName: 'Michael Brown', reason: 'Consultation', status: 'Confirmed' },
        { id: 4, date: '15 Feb 2020', time: '09:00 AM', patientName: 'Emily Davis', reason: 'Initial Visit', status: 'Confirmed' }
    ];

    // Updated with real image placeholders
    const pendingScans = [
        { 
            id: 1, 
            scanType: 'MRI', 
            patientName: 'Robert Wilson', 
            scanImage: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=150&h=150', 
            date: '20 Feb 2020' 
        },
        { 
            id: 2, 
            scanType: 'CT Scan', 
            patientName: 'Lisa Anderson', 
            scanImage: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=150&h=150', 
            date: '21 Feb 2020' 
        },
        { 
            id: 3, 
            scanType: 'X-Ray', 
            patientName: 'David Martinez', 
            scanImage: 'https://plus.unsplash.com/premium_photo-1673984588720-333a46374f67?auto=format&fit=crop&q=80&w=150&h=150', 
            date: '22 Feb 2020' 
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
            backgroundColor: '#ffffff', // Clean white background for main area like image
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        },
        // Sidebar matching the dark teal in the image
        sidebar: {
            width: '240px',
            backgroundColor: '#02505F', // Dark Teal from image
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            // The image shows a curve on the top right
            borderTopRightRadius: '60px',
            borderBottomRightRadius: '0px', 
            paddingTop: '40px',
            paddingBottom: '30px',
            position: 'relative' // For absolute positioning if needed
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
            backgroundColor: 'rgba(255,255,255,0.2)', // Slightly transparent box
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
            paddingLeft: '30px' // Indent the nav items
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
            color: '#a0bec4', // Lighter teal for inactive text
            fontSize: '16px',
            textAlign: 'left',
            width: '100%',
            borderTopLeftRadius: '30px',
            borderBottomLeftRadius: '30px',
            position: 'relative'
        },
        // Active tab matching the white "Home" tab in the image
        navItemActive: {
            backgroundColor: '#ffffff',
            color: '#02505F', // Dark teal text
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
        section: {
            marginBottom: '40px'
        },
        sectionTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#334155',
            marginBottom: '20px'
        },
        // Table styling
        table: {
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid #f0f0f0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
        },
        tableHeader: {
            backgroundColor: '#E0F7FA', // The light cyan color from the image
            display: 'grid',
            padding: '18px 24px',
            fontWeight: '600',
            fontSize: '14px',
            color: '#02505F', // Dark text for contrast
            borderBottom: '1px solid #e2e8f0'
        },
        appointmentHeader: {
            gridTemplateColumns: '1fr 1fr 1.5fr 1.5fr 1fr'
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
        patientName: {
            color: '#334155',
            fontWeight: '500',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            fontSize: '15px'
        },
        // Status Badges
        statusBadge: {
            display: 'inline-block',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600'
        },
        statusConfirmed: {
            backgroundColor: '#F0FDF4',
            color: '#166534'
        },
        statusPending: {
            backgroundColor: '#FEFCE8',
            color: '#854D0E'
        },
        // Real Image Styling
        scanImageContainer: {
            width: '50px',
            height: '50px',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#f1f5f9'
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
        // Modal Styles (kept functional)
        modal: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        },
        modalContent: {
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '32px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        },
        modalTitle: {
            fontSize: '20px',
            fontWeight: '700',
            color: '#02505F',
            marginBottom: '24px'
        },
        modalSection: { marginBottom: '20px' },
        modalLabel: { fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px', display: 'block' },
        modalValue: { fontSize: '16px', color: '#1e293b' },
        scanImagePlaceholder: {
            width: '100%',
            height: '200px',
            backgroundColor: '#000',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
        },
        textarea: {
            width: '100%',
            minHeight: '120px',
            padding: '12px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'inherit',
            resize: 'vertical',
            boxSizing: 'border-box',
            outline: 'none'
        },
        modalButtons: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' },
        modalButton: { padding: '10px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', border: 'none' },
        modalButtonPrimary: { backgroundColor: '#02505F', color: 'white' },
        modalButtonSecondary: { backgroundColor: '#f1f5f9', color: '#475569' }
    };

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <div style={styles.sidebar}>
                <div style={styles.logo}>
                    <div style={styles.logoIcon}>O</div>
                    <div style={styles.logoText}>Ortholink</div>
                </div>

                <nav style={styles.nav}>
                    <button
                        style={{...styles.navItem, ...(activeTab === 'home' ? styles.navItemActive : {})}}
                        onClick={() => setActiveTab('home')}
                    >
                        <Home size={20} />
                        <span>Home</span>
                    </button>

                    <button
                        style={{...styles.navItem, ...(activeTab === 'profile' ? styles.navItemActive : {})}}
                        onClick={() => setActiveTab('profile')}
                    >
                        <User size={20} />
                        <span>Profile</span>
                    </button>

                    <button
                        style={{...styles.navItem, ...(activeTab === 'appointments' ? styles.navItemActive : {})}}
                        onClick={() => setActiveTab('appointments')}
                    >
                        <Users size={20} />
                        <span>Appointments</span>
                    </button>

                     <button
                        style={{...styles.navItem, ...(activeTab === 'results' ? styles.navItemActive : {})}}
                        onClick={() => setActiveTab('results')}
                    >
                        <FileText size={20} />
                        <span>Scan Results</span>
                    </button>
                </nav>

                <button style={styles.logout}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>

            {/* Main Content */}
            <div style={styles.main}>
                
                {/* Upcoming Appointments */}
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Upcoming Appointments</h2>
                    <div style={styles.table}>
                        <div style={{...styles.tableHeader, ...styles.appointmentHeader}}>
                            <div>Date</div>
                            <div>Time</div>
                            <div>Doctor</div>
                            <div>Status</div>
                            <div>Action</div>
                        </div>
                        {appointments.map((apt) => (
                            <div key={apt.id} style={{...styles.tableRow, ...styles.appointmentHeader}}>
                                <div>{apt.date}</div>
                                <div>{apt.time}</div>
                                <div>
                                    <button style={styles.patientName} onClick={() => handlePatientClick(apt.patientName)}>
                                        {apt.patientName}
                                    </button>
                                </div>
                                <div>
                                    <span style={{
                                        ...styles.statusBadge,
                                        ...(apt.status === 'Confirmed' ? styles.statusConfirmed : styles.statusPending)
                                    }}>
                                        {apt.status}
                                    </span>
                                </div>
                                <div>...</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Scans (With Real Images) */}
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Upcoming Scans</h2>
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
                                <div>{scan.patientName}</div>
                                <div>{scan.date}</div>
                                <div>
                                    <button
                                        style={styles.actionButton}
                                        onClick={() => handleOpenReport(scan)}
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

            {/* Report Modal */}
            {showReportModal && selectedScan && (
                <div style={styles.modal} onClick={() => setShowReportModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3 style={styles.modalTitle}>Scan Details</h3>
                        
                        <div style={styles.modalSection}>
                            <div style={styles.scanImagePlaceholder}>
                                <img src={selectedScan.scanImage} alt="Scan Full View" style={{height: '100%', width: 'auto'}} />
                            </div>
                        </div>

                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                            <div style={styles.modalSection}>
                                <label style={styles.modalLabel}>Modality</label>
                                <div style={styles.modalValue}>{selectedScan.scanType}</div>
                            </div>
                            <div style={styles.modalSection}>
                                <label style={styles.modalLabel}>Patient</label>
                                <div style={styles.modalValue}>{selectedScan.patientName}</div>
                            </div>
                        </div>

                        <div style={styles.modalSection}>
                            <label style={styles.modalLabel}>Doctor's Notes</label>
                            <textarea
                                style={styles.textarea}
                                placeholder="Add notes here..."
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
                                Save Notes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}