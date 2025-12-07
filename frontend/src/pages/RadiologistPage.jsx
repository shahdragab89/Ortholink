import React, { useState, useRef } from 'react';
import { radiologistStyles } from '../styles/RadiologistStyles';
// Default placeholder image if the doctor hasn't uploaded one
const DEFAULT_AVATAR = "https://via.placeholder.com/150?text=Dr+Image";

export default function RadiologistPage() {
    // --- State ---
    const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or 'profile'
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedScan, setSelectedScan] = useState(null);
    const [uploadFile, setUploadFile] = useState(null);
    const [notes, setNotes] = useState('');

    // State for profile photo management
    const [profilePhoto, setProfilePhoto] = useState(DEFAULT_AVATAR);

    // --- Mock Data (Updated with Dates and Doctors) ---
    const [scans, setScans] = useState([
        { id: 1, date: '2023-10-25', time: '09:00 AM', patient: 'Ahmed Ali', pid: 'P-101', type: 'MRI', module: 'Knee', desc: 'ACL Injury check', doctor: 'Dr. Sarah Johnson', status: 'Pending' },
        { id: 2, date: '2023-10-25', time: '10:30 AM', patient: 'John Smith', pid: 'P-102', type: 'CT Scan', module: 'Brain', desc: 'Chronic Headaches', doctor: 'Dr. Moustafa El-Sayed', status: 'Completed' },
        { id: 3, date: '2023-10-26', time: '11:45 AM', patient: 'Mona Zaki', pid: 'P-103', type: 'X-Ray', module: 'Chest', desc: 'Persistent Cough', doctor: 'Dr. Sarah Johnson', status: 'Pending' },
        { id: 4, date: '2023-10-26', time: '01:15 PM', patient: 'Khaled Omar', pid: 'P-104', type: 'Ultrasound', module: 'Abdomen', desc: 'Pain investigation', doctor: 'Dr. Moustafa El-Sayed', status: 'Pending' },
    ]);

    // Mock Data for Profile Stats
    const profileStats = {
        appointmentsThisMonth: 142,
        scansMadeThisMonth: 118
    };

    // --- Handlers ---
    const handleLogout = () => {
        window.location.href = '/login'; 
    };

    const handleOpenUpload = (scan) => {
        setSelectedScan(scan);
        setModalOpen(true);
        setNotes('');
        setUploadFile(null);
    };

    const handleSubmitUpload = () => {
        // Update the status of the scan to 'Completed'
        const updatedScans = scans.map(s => 
            s.id === selectedScan.id ? { ...s, status: 'Completed' } : s
        );
        setScans(updatedScans);
        setModalOpen(false);
        alert(`Report successfully sent to ${selectedScan.doctor}`);
    };

    // Handler to simulate changing the photo
    const handlePhotoChange = (newPhotoUrl) => {
        setProfilePhoto(newPhotoUrl);
    }

    // Filter Logic
    const filteredScans = scans.filter(scan => 
        scan.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scan.pid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scan.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={radiologistStyles.container}>
            
            {/* --- Header (Sticky) --- */}
            <header style={radiologistStyles.header}>
                <div style={radiologistStyles.logoGroup}>
                    {/* Updated Logo Text */}
                    <h1 style={radiologistStyles.logoText}>OL Ortholink</h1>
                </div>

                <div style={radiologistStyles.profileSection}>
                    <div 
                        style={radiologistStyles.profileCard} 
                        onClick={() => setCurrentView('profile')}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <div style={radiologistStyles.avatar}>DK</div>
                        <span style={radiologistStyles.doctorName}>Dr. Kareem</span>
                    </div>
                    <button 
                        style={radiologistStyles.logoutBtn} 
                        onClick={handleLogout}
                        onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = '#fef2f2'; e.currentTarget.style.borderColor = '#f87171'}}
                        onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = '#fecaca'}}
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* --- Main Content --- */}
            <main style={radiologistStyles.main}>
                
                {currentView === 'dashboard' ? (
                    <>
                        {/* --- Big Welcome Banner (New Section) --- */}
                        <section style={radiologistStyles.welcomeBanner}>
                            {/* Optional background circles */}
                            <div style={radiologistStyles.decorativeCircle1}></div>
                            <div style={radiologistStyles.decorativeCircle2}></div>

                            <div style={radiologistStyles.welcomeTextBox}>
                                <h1 style={radiologistStyles.welcomeTitle}>Hello, Dr. Kareem!</h1>
                                <p style={radiologistStyles.welcomeSubText}>
                                    You have <span style={radiologistStyles.welcomeHighlight}>{scans.filter(s => s.status === 'Pending').length} pending tasks</span> today. Your progress is looking great. Let's clear the queue!
                                </p>
                            </div>
                            {/* Illustration Placeholder */}
                            <div style={radiologistStyles.welcomeIllustration}>
                                Illustration Placeholder
                            </div>
                        </section>

                        {/* --- Dashboard Content --- */}
                        <h2 style={radiologistStyles.pageTitle}>Upcoming Scans</h2>
                        
                        {/* Search Bar */}
                        <div style={radiologistStyles.searchContainer}>
                            <input 
                                type="text" 
                                placeholder="Search patient, ID, or scan type..." 
                                style={radiologistStyles.searchInput}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={(e) => e.target.style.borderColor = '#059669'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                        </div>

                        {/* Table */}
                        <div style={radiologistStyles.tableContainer}>
                            <table style={radiologistStyles.table}>
                                <thead>
                                    <tr>
                                        {/* Split Date and Time columns */}
                                        <th style={radiologistStyles.th}>Date</th>
                                        <th style={radiologistStyles.th}>Time</th>
                                        <th style={radiologistStyles.th}>Patient Name</th>
                                        <th style={radiologistStyles.th}>ID</th>
                                        {/* Added Doctor Column */}
                                        <th style={radiologistStyles.th}>Referring Doctor</th>
                                        <th style={radiologistStyles.th}>Scan Type</th>
                                        <th style={radiologistStyles.th}>Module</th>
                                        {/* <th style={radiologistStyles.th}>Description</th> Removed for space, or keep if needed */}
                                        <th style={radiologistStyles.th}>Status</th>
                                        <th style={radiologistStyles.th}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredScans.map((scan) => {
                                        const isCompleted = scan.status === 'Completed';
                                        const statusBg = isCompleted ? '#dcfce7' : '#fff7ed';
                                        const statusColor = isCompleted ? '#166534' : '#c2410c';
                                        
                                        return (
                                        <tr key={scan.id}>
                                            <td style={radiologistStyles.td}>{scan.date}</td>
                                            <td style={radiologistStyles.td} >{scan.time}</td>
                                            <td style={radiologistStyles.td}><strong>{scan.patient}</strong></td>
                                            <td style={radiologistStyles.td}>{scan.pid}</td>
                                            <td style={radiologistStyles.td}>{scan.doctor}</td>
                                            <td style={radiologistStyles.td}>{scan.type}</td>
                                            <td style={radiologistStyles.td}>{scan.module}</td>
                                            {/* <td style={radiologistStyles.td}>{scan.desc}</td> */}
                                            <td style={radiologistStyles.td}>
                                                <span style={{...radiologistStyles.statusBadge, backgroundColor: statusBg, color: statusColor}}>
                                                    {scan.status}
                                                </span>
                                            </td>
                                            <td style={radiologistStyles.td}>
                                                <button 
                                                    style={isCompleted ? radiologistStyles.disabledBtn : radiologistStyles.actionBtn}
                                                    disabled={isCompleted}
                                                    onClick={() => handleOpenUpload(scan)}
                                                    onMouseEnter={(e) => !isCompleted && (e.currentTarget.style.backgroundColor = '#047857')}
                                                    onMouseLeave={(e) => !isCompleted && (e.currentTarget.style.backgroundColor = '#059669')}
                                                >
                                                    {isCompleted ? 'View Report' : 'Upload Results'}
                                                </button>
                                            </td>
                                        </tr>
                                    )})}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    /* --- Profile Editor View --- */
                    <ProfileEditor 
                        onBack={() => setCurrentView('dashboard')} 
                        currentPhoto={profilePhoto}
                        onPhotoUpdate={handlePhotoChange}
                        stats={profileStats}
                    />
                )}
            </main>

            {/* --- Upload Modal Overlay --- */}
            {modalOpen && selectedScan && (
                <div style={radiologistStyles.overlay}>
                    <div style={radiologistStyles.modal}>
                        <div style={radiologistStyles.modalHeader}>
                            Upload Scan Results
                        </div>
                        
                        {/* Order Details */}
                        <div style={radiologistStyles.infoBox}>
                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px'}}>
                                <span><strong>Patient:</strong> {selectedScan.patient} ({selectedScan.pid})</span>
                                <span><strong>Date:</strong> {selectedScan.date}</span>
                                <span><strong>Ref. Doctor:</strong> {selectedScan.doctor}</span>
                                <span><strong>Scan:</strong> {selectedScan.type} - {selectedScan.module}</span>
                            </div>
                            <div style={{marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #bbf7d0'}}>
                                <strong>Clinical Indication/Reason:</strong> <br/> {selectedScan.desc}
                            </div>
                        </div>

                        {/* Upload Area */}
                        <label style={radiologistStyles.formLabel}>Attach Scan Image/DICOM</label>
                        <div 
                            style={radiologistStyles.uploadBox} 
                            onClick={() => document.getElementById('fileUpload').click()}
                            onMouseEnter={(e) => {e.currentTarget.style.borderColor = '#059669'; e.currentTarget.style.backgroundColor = '#f0fdf4'}}
                            onMouseLeave={(e) => {e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.backgroundColor = '#f9fafb'}}
                        >
                            <span style={{fontSize: '24px', display: 'block', marginBottom: '10px'}}>📁</span>
                            {uploadFile ? 
                                <span style={{color: '#059669', fontWeight: '600'}}>{uploadFile.name}</span> : 
                                "Click here to browse your files"
                            }
                            <input 
                                id="fileUpload" 
                                type="file" 
                                hidden 
                                onChange={(e) => setUploadFile(e.target.files[0])}
                            />
                        </div>

                        {/* Notes */}
                        <label style={radiologistStyles.formLabel}>Radiologist Findings & Conclusion</label>
                        <textarea 
                            style={radiologistStyles.textArea} 
                            placeholder="Type your detailed report findings here..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            onFocus={(e) => e.target.style.borderColor = '#059669'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />

                        {/* Buttons */}
                        <div style={radiologistStyles.buttonGroup}>
                            <button 
                                onClick={() => setModalOpen(false)}
                                style={{...radiologistStyles.actionBtn, backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db', boxShadow: 'none'}}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSubmitUpload}
                                style={radiologistStyles.actionBtn}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#047857'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#059669'}
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

// --- Sub-Component for Profile (Redesigned layout) ---
function ProfileEditor({ onBack, currentPhoto, onPhotoUpdate, stats }) {
    // Ref for the hidden file input element
    const fileInputRef = useRef(null);

    const triggerFileSelect = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create a temporary URL for the uploaded file to display it immediately
            const imageUrl = URL.createObjectURL(file);
            onPhotoUpdate(imageUrl);
        }
    };

    return (
        <div style={radiologistStyles.profileContainer}>
            <button onClick={onBack} style={radiologistStyles.backButton}>
                ← Back to Dashboard
            </button>
            
            <div style={radiologistStyles.profileContentWrapper}>
                
                {/* Center: Photo Section */}
                <div style={radiologistStyles.profilePhotoSection}>
                    <img src={currentPhoto} alt="Profile" style={radiologistStyles.largeAvatar} />
                    {/* Hidden file input */}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageChange} 
                        accept="image/png, image/jpeg" 
                        style={{display: 'none'}}
                    />
                    <button 
                        style={radiologistStyles.editPhotoBtn}
                        onClick={triggerFileSelect}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ecfdf5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                        Change Photo
                    </button>
                </div>

                {/* Vertical Form Stack */}
                <div style={radiologistStyles.formStack}>
                    
                    <div style={radiologistStyles.sectionTitle}>Professional Identity (Read Only)</div>
                    
                    {/* New Username & Email Fields */}
                    <div style={radiologistStyles.inputGroup}>
                        <label style={radiologistStyles.formLabel}>Username</label>
                        <input type="text" value="dr.kareem" disabled style={radiologistStyles.readOnlyField} />
                    </div>
                    <div style={radiologistStyles.inputGroup}>
                        <label style={radiologistStyles.formLabel}>Email Address</label>
                        <input type="text" value="kareem.ahmed@ortholink.com" disabled style={radiologistStyles.readOnlyField} />
                    </div>

                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                         <div style={radiologistStyles.inputGroup}>
                            <label style={radiologistStyles.formLabel}>Full Name</label>
                            <input type="text" value="Dr. Kareem Ahmed" disabled style={radiologistStyles.readOnlyField} />
                        </div>
                        <div style={radiologistStyles.inputGroup}>
                            <label style={radiologistStyles.formLabel}>Staff ID</label>
                            <input type="text" value="RAD-005" disabled style={radiologistStyles.readOnlyField} />
                        </div>
                    </div>

                    {/* New Monthly Statistics Section */}
                     <div style={radiologistStyles.sectionTitle}>Monthly Statistics (Read Only)</div>
                     <div style={radiologistStyles.statsContainer}>
                        <div style={radiologistStyles.statCard}>
                            <span style={radiologistStyles.statNumber}>{stats.appointmentsThisMonth}</span>
                            <span style={radiologistStyles.statLabel}>Appointments</span>
                        </div>
                        <div style={radiologistStyles.statCard}>
                            <span style={radiologistStyles.statNumber}>{stats.scansMadeThisMonth}</span>
                            <span style={radiologistStyles.statLabel}>Scans Completed</span>
                        </div>
                     </div>


                    <div style={radiologistStyles.sectionTitle}>Contact Details (Editable)</div>

                    <div style={radiologistStyles.inputGroup}>
                        <label style={radiologistStyles.formLabel}>Phone Number</label>
                        <input 
                            type="text" 
                            defaultValue="+20 123 456 7890" 
                            style={radiologistStyles.editableInput} 
                            onFocus={(e) => e.target.style.borderColor = '#059669'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                    </div>
                    <div style={radiologistStyles.inputGroup}>
                        <label style={radiologistStyles.formLabel}>Address</label>
                        <input 
                            type="text" 
                            defaultValue="Cairo, Egypt" 
                            style={radiologistStyles.editableInput}
                            onFocus={(e) => e.target.style.borderColor = '#059669'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                    </div>

                    {/* Centered, fitted Save button */}
                    <button 
                        style={radiologistStyles.saveBtn}
                        onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = '#047857'; e.currentTarget.style.transform = 'translateY(-2px)'}}
                        onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = '#059669'; e.currentTarget.style.transform = 'translateY(0)'}}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}