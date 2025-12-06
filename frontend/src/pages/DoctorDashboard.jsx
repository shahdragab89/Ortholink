import React, { useState } from 'react';
import { 
    Home, Users, User, LogOut, Eye, Activity, 
    ArrowLeft, Calendar, FileText, Pill, 
    Thermometer, Heart, ClipboardList, X
} from 'lucide-react';

export default function DoctorDashboard() {
    const [activeTab, setActiveTab] = useState('home');
    
    // --- STATE MANAGEMENT ---
    const [selectedPatient, setSelectedPatient] = useState(null);
    const doctorName = "Maya";

    // Modals State
    const [showReportModal, setShowReportModal] = useState(false);
    const [showMedicationModal, setShowMedicationModal] = useState(false);
    const [showScanOrderModal, setShowScanOrderModal] = useState(false);
    
    // Data holding state
    const [selectedScan, setSelectedScan] = useState(null); // For Viewing Reports
    const [reportText, setReportText] = useState(''); // For writing reports
    
    // Current Consultation Form State
    const [consultationRecords, setConsultationRecords] = useState({
        complaint: '', diagnosis: '', treatment: '', physicalExam: ''
    });

    // --- MOCK DATA (ORTHOPEDIC CENTER THEME) ---
    const appointments = [
        { 
            id: 1, date: '24 Feb 2024', time: '10:00 AM', patientName: 'Sarah Johnson', reason: 'Shoulder Pain', notes: 'Possible Rotator Cuff tear', status: 'scheduled', 
            age: 34, gender: 'Female', bloodType: 'O+', allergies: 'Penicillin', history: ['Shoulder Dislocation (2019)', 'Mild Arthritis'],
            lastVisit: {
                date: '12 Jan 2024',
                complaint: 'Sharp pain in right shoulder when lifting arm',
                diagnosis: 'Supraspinatus Tendonitis',
                treatment: 'Physical Therapy referral, NSAIDs',
                physicalExam: 'Limited range of motion (abduction), Neer test positive',
                medications: [
                    { name: 'Naproxen', dosage: '500mg', freq: 'Twice daily' },
                    { name: 'Topical Diclofenac', dosage: '1%', freq: 'Apply to area' }
                ]
            }
        },
        { 
            id: 2, date: '24 Feb 2024', time: '11:30 AM', patientName: 'Michael Brown', reason: 'Post-Op Knee Check', notes: 'ACL Reconstruction follow-up', status: 'completed', 
            age: 28, gender: 'Male', bloodType: 'A-', allergies: 'None', history: ['ACL Tear (Right Knee)', 'Meniscus Repair'],
            lastVisit: {
                date: '10 Feb 2024',
                complaint: 'Stiffness in knee upon waking',
                diagnosis: 'Post-operative stiffness',
                treatment: 'Increased PT intensity, Cryotherapy',
                physicalExam: 'Incision healed well, mild effusion present',
                medications: [
                    { name: 'Ibuprofen', dosage: '600mg', freq: 'As needed for pain' }
                ]
            }
        },
        { 
            id: 3, date: '24 Feb 2024', time: '02:00 PM', patientName: 'Emily Davis', reason: 'Ankle Sprain', notes: 'Twisted ankle while running', status: 'cancelled', 
            age: 22, gender: 'Female', bloodType: 'B+', allergies: 'Sulfa', history: ['None'],
            lastVisit: null
        },
        { 
            id: 4, date: '25 Feb 2024', time: '09:00 AM', patientName: 'Robert Wilson', reason: 'Back Pain', notes: 'Chronic lower back pain', status: 'no-show', 
            age: 52, gender: 'Male', bloodType: 'AB+', allergies: 'None', history: ['Lumbar Disc Herniation', 'Sciatica'],
            lastVisit: {
                date: '05 Jan 2024',
                complaint: 'Radiating pain down left leg',
                diagnosis: 'L4-L5 Disc Herniation',
                treatment: 'Epidural Steroid Injection scheduled',
                physicalExam: 'Positive Straight Leg Raise test on left',
                medications: [
                    { name: 'Gabapentin', dosage: '300mg', freq: 'At night' },
                    { name: 'Cyclobenzaprine', dosage: '10mg', freq: 'Before bed' }
                ]
            }
        },
        { 
            id: 5, date: '25 Feb 2024', time: '10:30 AM', patientName: 'Lisa Anderson', reason: 'Wrist Fracture', notes: 'Cast removal assessment', status: 'scheduled', 
            age: 61, gender: 'Female', bloodType: 'O-', allergies: 'Latex', history: ['Osteoporosis', 'Distal Radius Fracture'],
            lastVisit: null
        },
    ];

    const pendingScans = [
        { id: 1, scanType: 'MRI Lumbar Spine', patientName: 'Robert Wilson', scanImage: 'mri_spine.jpg', date: '23 Feb 2024', status: 'Pending', modality: 'MRI' },
        { id: 2, scanType: 'X-Ray Right Wrist', patientName: 'Lisa Anderson', scanImage: 'xray_wrist.jpg', date: '23 Feb 2024', status: 'Pending', modality: 'X-Ray' },
        { id: 3, scanType: 'X-Ray Left Knee', patientName: 'Michael Brown', scanImage: 'xray_knee.jpg', date: '22 Feb 2024', status: 'Pending', modality: 'X-Ray' },
    ];

    // Profile History Scans (Theme: Orthopedic)
    const patientScansHistory = [
        { id: 101, name: 'MRI Right Shoulder', modality: 'MRI', date: '10 Jan 2024', status: 'Report Ready', image: 'shoulder_mri.jpg', report: 'Full thickness tear of Supraspinatus tendon. Moderate muscle atrophy.' },
        { id: 102, name: 'X-Ray Shoulder AP/Lat', modality: 'X-Ray', date: '15 Dec 2023', status: 'Report Ready', image: 'shoulder_xray.jpg', report: 'Acromioclavicular joint osteoarthritis visible. No fracture.' },
        { id: 103, name: 'CT Scan Cervical Spine', modality: 'CT', date: '20 Nov 2023', status: 'Processing', image: 'c_spine.jpg', report: '' }
    ];

    // --- HANDLERS ---

    const handleOpenReport = (scan, isReadOnly = false) => {
        setSelectedScan({ ...scan, isReadOnly });
        setReportText(scan.report || ''); 
        setShowReportModal(true);
    };

    const handleSubmitReport = () => {
        console.log('Submitting report for:', selectedScan, 'Report:', reportText);
        setShowReportModal(false);
        setReportText('');
    };

    const handlePatientClick = (patientName) => {
        const patient = appointments.find(p => p.patientName === patientName) || appointments[0];
        setSelectedPatient(patient);
    };

    const handleBackToHome = () => {
        setSelectedPatient(null);
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

    // --- STYLES ---
    const styles = {
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

    // --- RENDER MODALS ---

    const RenderReportModal = () => (
        <div style={styles.modalOverlay} onClick={() => setShowReportModal(false)}>
            <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                    <h3 style={styles.sectionTitle}>Scan Report</h3>
                    <button onClick={() => setShowReportModal(false)} style={{background:'none', border:'none', cursor:'pointer'}}><X size={20}/></button>
                </div>
                <div style={styles.modalBody}>
                    <div style={{height: '250px', backgroundColor: '#000', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                         <img src={selectedScan?.image || selectedScan?.scanImage} alt="Scan" style={{maxHeight: '100%', maxWidth: '100%', objectFit: 'contain'}} />
                    </div>
                    
                    {/* Fixed to show correct Scan Name & Modality */}
                    <div style={styles.infoGridCentered}>
                        <div style={{textAlign: 'left'}}>
                            <div style={styles.infoLabel}>Scan Name</div>
                            <div style={styles.infoValue}>{selectedScan?.name || selectedScan?.scanType}</div>
                        </div>
                        <div style={{textAlign: 'left'}}>
                            <div style={styles.infoLabel}>Modality</div>
                            <div style={styles.infoValue}>{selectedScan?.modality}</div>
                        </div>
                    </div>

                    <div style={{marginTop: '20px'}}>
                        <div style={styles.inputLabel}>Doctor's Findings & Notes</div>
                        {selectedScan?.isReadOnly ? (
                            <div style={{marginTop: '8px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', lineHeight: '1.5', color: '#334155'}}>
                                {selectedScan.report || "No report available."}
                            </div>
                        ) : (
                            <textarea 
                                style={{...styles.textAreaField, width: '100%', marginTop: '8px', minHeight: '100px'}}
                                placeholder="Enter diagnosis and findings..."
                                value={reportText}
                                onChange={(e) => setReportText(e.target.value)}
                            />
                        )}
                    </div>
                </div>
                {!selectedScan?.isReadOnly && (
                    <div style={styles.modalFooter}>
                        <button style={styles.actionButton} onClick={() => setShowReportModal(false)}>Cancel</button>
                        <button style={{...styles.actionButton, backgroundColor: '#02505F', color: 'white'}} onClick={handleSubmitReport}>Submit Report</button>
                    </div>
                )}
            </div>
        </div>
    );

    const RenderMedicationModal = () => (
        <div style={styles.modalOverlay} onClick={() => setShowMedicationModal(false)}>
            <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                    <h3 style={styles.sectionTitle}>Prescribe Medication</h3>
                    <button onClick={() => setShowMedicationModal(false)} style={{background:'none', border:'none', cursor:'pointer'}}><X size={20}/></button>
                </div>
                <div style={styles.modalBody}>
                    <div style={styles.formGroup}>
                        <label style={styles.inputLabel}>Medication Name</label>
                        <input type="text" style={styles.inputField} placeholder="e.g. Naproxen" />
                    </div>
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'12px'}}>
                        <div style={styles.formGroup}>
                            <label style={styles.inputLabel}>Dosage</label>
                            <input type="text" style={styles.inputField} placeholder="e.g. 500mg" />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.inputLabel}>Frequency</label>
                            <input type="text" style={styles.inputField} placeholder="e.g. Twice Daily" />
                        </div>
                    </div>
                    <div style={{...styles.formGroup, marginTop: '12px'}}>
                        <label style={styles.inputLabel}>Duration</label>
                        <input type="text" style={styles.inputField} placeholder="e.g. 14 Days" />
                    </div>
                </div>
                <div style={styles.modalFooter}>
                    <button style={styles.actionButton} onClick={() => setShowMedicationModal(false)}>Cancel</button>
                    <button style={{...styles.actionButton, backgroundColor: '#4361ee', color: 'white'}} onClick={() => setShowMedicationModal(false)}>Prescribe</button>
                </div>
            </div>
        </div>
    );

    const RenderScanOrderModal = () => (
        <div style={styles.modalOverlay} onClick={() => setShowScanOrderModal(false)}>
            <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                    <h3 style={styles.sectionTitle}>Order New Scan</h3>
                    <button onClick={() => setShowScanOrderModal(false)} style={{background:'none', border:'none', cursor:'pointer'}}><X size={20}/></button>
                </div>
                <div style={styles.modalBody}>
                    <div style={styles.formGroup}>
                        <label style={styles.inputLabel}>Scan Type</label>
                        <input type="text" style={styles.inputField} placeholder="e.g. MRI Left Knee" />
                    </div>
                    <div style={{...styles.formGroup, marginTop: '12px'}}>
                        <label style={styles.inputLabel}>Modality</label>
                        <select style={styles.inputField}>
                            <option>X-Ray</option>
                            <option>MRI</option>
                            <option>CT Scan</option>
                            <option>Ultrasound</option>
                            <option>DXA (Bone Density)</option>
                        </select>
                    </div>
                    <div style={{...styles.formGroup, marginTop: '12px'}}>
                        <label style={styles.inputLabel}>Reason / Description</label>
                        <textarea style={styles.textAreaField} placeholder="Suspected meniscus tear..." />
                    </div>
                </div>
                <div style={styles.modalFooter}>
                    <button style={styles.actionButton} onClick={() => setShowScanOrderModal(false)}>Cancel</button>
                    <button style={{...styles.actionButton, backgroundColor: '#02505F', color: 'white'}} onClick={() => setShowScanOrderModal(false)}>Order Scan</button>
                </div>
            </div>
        </div>
    );

    // --- VIEWS ---

    const DashboardView = () => (
        <div style={styles.main}>
            {/* Header Area */}
            <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0}}>
                <div>
                    <h1 style={{fontSize: '32px', fontWeight: '700', color: '#1e293b', marginBottom: '8px'}}>Welcome <span style={{color: '#4361ee'}}>{doctorName}!</span></h1>
                    <p style={{fontSize: '16px', color: '#64748b'}}>You have <strong>{appointments.filter(a => a.status === 'scheduled').length} patients</strong> remaining today!</p>
                </div>
                <div style={{fontSize: '80px', lineHeight: 1, marginTop: '-10px', transform: 'rotate(-15deg)', opacity: 0.9}}>🩺</div>
            </div>

            <div style={styles.contentContainer}>
                {/* Appointments Table */}
                <div style={styles.section}>
                    <div style={styles.sectionHeaderRow}><h2 style={styles.sectionTitle}>Today's Appointments</h2></div>
                    <div style={styles.tableContainer}>
                        <div style={{ ...styles.tableHeader, ...styles.appointmentGrid }}>
                            <div>Date</div><div>Time</div><div>Patient</div><div>Reason</div><div>Notes</div><div>Status</div>
                        </div>
                        <div style={styles.scrollableRows}>
                            {appointments.map((apt) => (
                                <div key={apt.id} style={{ ...styles.tableRow, ...styles.appointmentGrid }}>
                                    <div>{apt.date}</div><div>{apt.time}</div>
                                    <div><button style={styles.clickablePatientName} onClick={() => handlePatientClick(apt.patientName)}>{apt.patientName}</button></div>
                                    <div>{apt.reason}</div>
                                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#64748b' }}>{apt.notes}</div>
                                    <div><span style={{ ...styles.statusBadge, ...getStatusStyle(apt.status) }}>{apt.status.replace('-', ' ')}</span></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Pending Scans Table */}
                <div style={styles.section}>
                    <div style={styles.sectionHeaderRow}><h2 style={styles.sectionTitle}>Pending Scan Reports</h2></div>
                    <div style={styles.tableContainer}>
                        <div style={{ ...styles.tableHeader, ...styles.scanGrid }}>
                            <div>Scan</div><div>Modality</div><div>Patient</div><div>Date</div><div>Action</div>
                        </div>
                        <div style={styles.scrollableRows}>
                            {pendingScans.map((scan) => (
                                <div key={scan.id} style={{ ...styles.tableRow, ...styles.scanGrid }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '6px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
                                        <img src={scan.scanImage} alt="scan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div>{scan.scanType}</div>
                                    <div><button style={styles.clickablePatientName} onClick={() => handlePatientClick(scan.patientName)}>{scan.patientName}</button></div>
                                    <div>{scan.date}</div>
                                    <div>
                                        <button style={styles.actionButton} onClick={() => handleOpenReport(scan, false)}>
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
    );

    const ProfileView = () => {
        const [tab, setTab] = useState('records'); // 'records' or 'orders'

        return (
            <div style={styles.main}>
                <button style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', cursor: 'pointer', fontSize: '14px', fontWeight: '600', border: 'none', background: 'none', marginBottom: '10px', width: 'fit-content'}} onClick={handleBackToHome}>
                    <ArrowLeft size={16} /> Back to Home
                </button>

                <div style={styles.profileContainer}>
                    {/* LEFT COLUMN: Patient Info */}
                    <div style={styles.contentContainer}>
                        <div style={styles.card}>
                            <div style={{alignSelf: 'center', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><User size={40} color="#64748b"/></div>
                            <h2 style={{fontSize: '20px', fontWeight: '700', color: '#1e293b', textAlign: 'center', margin: 0}}>{selectedPatient.patientName}</h2>
                            
                            {/* Centered Patient Data */}
                            <div style={styles.patientInfoCentered}>
                                <div style={styles.infoGridCentered}>
                                    <div style={styles.infoItemCentered}><span style={styles.infoLabel}>Age</span><span style={styles.infoValue}>{selectedPatient.age} Yrs</span></div>
                                    <div style={styles.infoItemCentered}><span style={styles.infoLabel}>Gender</span><span style={styles.infoValue}>{selectedPatient.gender}</span></div>
                                    <div style={styles.infoItemCentered}><span style={styles.infoLabel}>Blood</span><span style={styles.infoValue}>{selectedPatient.bloodType}</span></div>
                                    <div style={styles.infoItemCentered}><span style={styles.infoLabel}>Allergies</span><span style={{...styles.infoValue, color: '#ef4444'}}>{selectedPatient.allergies}</span></div>
                                </div>
                            </div>
                        </div>

                        <div style={styles.card}>
                            <div style={{fontSize: '16px', fontWeight: '700', color: '#02505F', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}><Activity size={18} /> Vital Signs</div>
                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                                <div style={{backgroundColor: '#f8fafc', padding: '12px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'}}>
                                    <Heart size={16} color="#ef4444" /><span style={{fontSize: '16px', fontWeight: '700', color: '#02505F'}}>72</span><span style={{fontSize: '11px', color: '#64748b'}}>bpm</span>
                                </div>
                                <div style={{backgroundColor: '#f8fafc', padding: '12px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'}}>
                                    <Activity size={16} color="#3b82f6" /><span style={{fontSize: '16px', fontWeight: '700', color: '#02505F'}}>120/80</span><span style={{fontSize: '11px', color: '#64748b'}}>mmHg</span>
                                </div>
                                <div style={{backgroundColor: '#f8fafc', padding: '12px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'}}>
                                    <Thermometer size={16} color="#f97316" /><span style={{fontSize: '16px', fontWeight: '700', color: '#02505F'}}>36.6</span><span style={{fontSize: '11px', color: '#64748b'}}>°C</span>
                                </div>
                                <div style={{backgroundColor: '#f8fafc', padding: '12px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'}}>
                                    <span style={{fontSize:'14px'}}>⚖️</span><span style={{fontSize: '16px', fontWeight: '700', color: '#02505F'}}>70</span><span style={{fontSize: '11px', color: '#64748b'}}>kg</span>
                                </div>
                            </div>
                        </div>

                        <div style={{...styles.card, flex: 1}}>
                            <div style={{fontSize: '16px', fontWeight: '700', color: '#02505F', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}><ClipboardList size={18} /> Medical History</div>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto'}}>
                                {selectedPatient.history.map((item, idx) => (
                                    <div key={idx} style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '8px'}}>• {item}</div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* MIDDLE COLUMN: Last Visit & History */}
                    <div style={styles.contentContainer}>
                        {/* Last Visit Summary - SIZED DOWN TO flex: 0.8 */}
                        <div style={{...styles.card, flex: 0.8, overflow: 'hidden'}}>
                            <div style={{fontSize: '16px', fontWeight: '700', color: '#02505F', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
                                <Calendar size={18} /> Last Visit ({selectedPatient.lastVisit?.date || 'N/A'})
                            </div>
                            
                            {selectedPatient.lastVisit ? (
                                <div style={styles.formScroll}>
                                    <div style={{marginBottom: '10px'}}>
                                        <span style={styles.infoLabel}>Complaint</span>
                                        <div style={{fontSize: '14px', color: '#334155'}}>{selectedPatient.lastVisit.complaint}</div>
                                    </div>
                                    <div style={{marginBottom: '10px'}}>
                                        <span style={styles.infoLabel}>Diagnosis</span>
                                        <div style={{fontSize: '14px', color: '#334155', fontWeight: '500'}}>{selectedPatient.lastVisit.diagnosis}</div>
                                    </div>
                                    <div style={{marginBottom: '10px'}}>
                                        <span style={styles.infoLabel}>Treatment Plan</span>
                                        <div style={{fontSize: '14px', color: '#334155'}}>{selectedPatient.lastVisit.treatment}</div>
                                    </div>
                                    
                                    <div style={{marginTop: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '10px'}}>
                                        <span style={styles.infoLabel}>Prescribed Meds</span>
                                        {selectedPatient.lastVisit.medications.map((med, i) => (
                                            <div key={i} style={{fontSize: '13px', color: '#475569', marginTop: '4px', display:'flex', justifyContent:'space-between'}}>
                                                <span>• {med.name} ({med.dosage})</span>
                                                <span>{med.freq}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div style={{color: '#94a3b8', fontSize: '14px'}}>No previous visit records found.</div>
                            )}
                        </div>

                        {/* Patient Scans - SIZED UP TO flex: 1.2 */}
                        <div style={{...styles.card, flex: 1.2, padding: 0, overflow: 'hidden'}}>
                            <div style={{padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems:'center'}}>
                                <div style={{fontSize: '16px', fontWeight: '700', color: '#02505F', display: 'flex', alignItems: 'center', gap: '8px'}}><FileText size={18} /> Patient Scans</div>
                            </div>
                            <div style={styles.scrollableRows}>
                                <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '13px'}}>
                                    <thead>
                                        <tr><th style={{textAlign: 'left', padding: '10px', color: '#64748b', borderBottom: '1px solid #e2e8f0', fontSize: '11px', textTransform: 'uppercase'}}>Scan Name</th><th style={{textAlign: 'left', padding: '10px', color: '#64748b', borderBottom: '1px solid #e2e8f0', fontSize: '11px', textTransform: 'uppercase'}}>Modality</th><th style={{textAlign: 'left', padding: '10px', color: '#64748b', borderBottom: '1px solid #e2e8f0', fontSize: '11px', textTransform: 'uppercase'}}>Action</th></tr>
                                    </thead>
                                    <tbody>
                                        {patientScansHistory.map(scan => (
                                            <tr key={scan.id}>
                                                <td style={{padding: '10px', color: '#334155', borderBottom: '1px solid #f1f5f9'}}>{scan.name}</td>
                                                <td style={{padding: '10px', color: '#334155', borderBottom: '1px solid #f1f5f9'}}>{scan.modality}</td>
                                                <td style={{padding: '10px', color: '#334155', borderBottom: '1px solid #f1f5f9'}}>
                                                    <button style={{...styles.actionButton, padding: '4px 8px'}} onClick={() => handleOpenReport(scan, true)}>View</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Current Consultation */}
                    <div style={styles.contentContainer}>
                        <div style={{...styles.card, flex: 1, display: 'flex', flexDirection: 'column', gap: '12px'}}>
                            <div style={{fontSize: '16px', fontWeight: '700', color: '#02505F'}}>Current Consultation</div>
                            <div style={styles.tabGroup}>
                                <button onClick={() => setTab('records')} style={{...styles.tab, ...(tab === 'records' ? styles.tabActive : styles.tabInactive)}}>Records</button>
                                <button onClick={() => setTab('orders')} style={{...styles.tab, ...(tab === 'orders' ? styles.tabActive : styles.tabInactive)}}>Orders</button>
                            </div>

                            {tab === 'records' ? (
                                <div style={styles.formScroll}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.inputLabel}>Complaint</label>
                                        <textarea style={styles.textAreaField} placeholder="Patient's main complaint..." value={consultationRecords.complaint} onChange={e => setConsultationRecords({...consultationRecords, complaint: e.target.value})} />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.inputLabel}>Physical Examination</label>
                                        <textarea style={styles.textAreaField} placeholder="Key findings (e.g. Swelling, Range of Motion)..." value={consultationRecords.physicalExam} onChange={e => setConsultationRecords({...consultationRecords, physicalExam: e.target.value})} />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.inputLabel}>Diagnosis</label>
                                        <input type="text" style={styles.inputField} placeholder="Confirmed diagnosis..." value={consultationRecords.diagnosis} onChange={e => setConsultationRecords({...consultationRecords, diagnosis: e.target.value})} />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.inputLabel}>Treatment Plan</label>
                                        <textarea style={styles.textAreaField} placeholder="Plan moving forward..." value={consultationRecords.treatment} onChange={e => setConsultationRecords({...consultationRecords, treatment: e.target.value})} />
                                    </div>
                                </div>
                            ) : (
                                <div style={{display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, paddingTop: '20px'}}>
                                    <div style={{fontSize: '13px', color: '#64748b'}}>Select an order type:</div>
                                    <button style={{...styles.actionButton, padding: '16px', backgroundColor: '#4361ee', color: 'white', justifyContent: 'center', fontSize: '14px'}} onClick={() => setShowMedicationModal(true)}>
                                        <Pill size={18} /> Prescribe Medication
                                    </button>
                                    <button style={{...styles.actionButton, padding: '16px', backgroundColor: '#02505F', color: 'white', justifyContent: 'center', fontSize: '14px'}} onClick={() => setShowScanOrderModal(true)}>
                                        <Activity size={18} /> Order New Scan
                                    </button>
                                </div>
                            )}
                            
                            {tab === 'records' && (
                                <button style={{...styles.actionButton, backgroundColor: '#1e293b', color: 'white', marginTop: 'auto', padding: '12px', justifyContent: 'center'}}>
                                    Save Records & End Visit
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={styles.container}>
            {/* Scrollbar CSS */}
            <style>
                {` ::-webkit-scrollbar { width: 6px; height: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; } ::-webkit-scrollbar-thumb:hover { background: #94a3b8; } `}
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
                        <button style={{ ...styles.navItem, ...(activeTab === 'home' ? styles.navItemActive : {}) }} onClick={() => {setActiveTab('home'); setSelectedPatient(null);}}>
                            <Home size={20} /> <span>Home</span>
                        </button>
                        <button style={{ ...styles.navItem, ...(activeTab === 'profile' ? styles.navItemActive : {}) }} onClick={() => setActiveTab('profile')}>
                            <User size={20} /> <span>Profile</span>
                        </button>
                        <button style={{ ...styles.navItem, ...(activeTab === 'patients' ? styles.navItemActive : {}) }} onClick={() => setActiveTab('patients')}>
                            <Users size={20} /> <span>Patients</span>
                        </button>
                    </nav>
                    <button style={styles.logout}><LogOut size={20} /> <span>Logout</span></button>
                </div>

                {/* Switch between Dashboard and Patient Profile */}
                {selectedPatient ? <ProfileView /> : <DashboardView />}
            </div>

            {/* --- MODALS --- */}
            {showReportModal && <RenderReportModal />}
            {showMedicationModal && <RenderMedicationModal />}
            {showScanOrderModal && <RenderScanOrderModal />}
        </div>
    );
}