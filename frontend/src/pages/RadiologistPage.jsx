import React, { useState, useRef, useEffect } from 'react';
import { radiologistStyles } from '../styles/RadiologistStyles';

// Default placeholder image if the doctor hasn't uploaded one
const DEFAULT_AVATAR = "https://via.placeholder.com/150?text=Dr+Image";
const API_BASE = "http://127.0.0.1:5000/api";

export default function RadiologistPage() {
    // State for personal info with default values
    const [personalInfo, setPersonalInfo] = useState({
        username: 'dr.kareem',
        email: 'kareem.ahmed@ortholink.com',
        f_name: 'Kareem',
        l_name: 'Ahmed',
        full_name: 'Dr. Kareem Ahmed',
        staff_id: 'RAD-005',
        gender: 'MALE',
        license_number: 'RAD123456',
        department: 'Radiology',
        hire_date: '2020-01-15',
        salary: '$5,000.00',
        photo: DEFAULT_AVATAR
    });

    // State for contact info with defaults
    const [contactInfo, setContactInfo] = useState({ 
        phone: '+20 123 456 7890', 
        address: 'Cairo, Egypt' 
    });

    // State for profile loading
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRadiologistData = async () => {
            try {
                const token = localStorage.getItem("token"); 
                const userId = localStorage.getItem("user_id");

                if (!token || !userId) {
                    console.error("No token or user_id found");
                    setLoading(false);
                    return;
                }

                const res = await fetch(`${API_BASE}/auth/radiologist/${userId}`, {
                    headers: { 
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!res.ok) {
                    if (res.status === 401) {
                        handleLogout();
                        return;
                    }
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                console.log("Fetched radiologist data:", data);

                // Update personal info with ACTUAL data from API
                setPersonalInfo({
                    username: data.username || 'dr.kareem',
                    email: data.email || 'kareem.ahmed@ortholink.com',
                    f_name: data.f_name || 'Kareem',
                    l_name: data.l_name || 'Ahmed',
                    full_name: `Dr. ${data.f_name || 'Kareem'} ${data.l_name || 'Ahmed'}`,
                    staff_id: data.staff_id ? `RAD-${data.staff_id}` : 'RAD-005',
                    gender: data.gender ? data.gender.toUpperCase() : 'MALE',
                    license_number: data.license_number || 'Not specified',
                    department: data.department || 'Radiology',
                    hire_date: data.hire_date || '2015-07-01',
                    salary: data.salary ? `$${parseFloat(data.salary).toFixed(2)}` : '$150,000.00',
                    photo: DEFAULT_AVATAR
                });

                // Update contact info with ACTUAL data
                setContactInfo({ 
                    phone: data.phone || data.staff_phone || '+20 123 456 7890', 
                    address: data.address || 'Cairo, Egypt' 
                });

                // Update localStorage for display
                localStorage.setItem("full_name", `Dr. ${data.f_name || 'Kareem'} ${data.l_name || 'Ahmed'}`);
                localStorage.setItem("username", data.username || 'dr.kareem');

            } catch (error) {
                console.error("Error fetching radiologist data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRadiologistData();
    }, []);

    // --- Handlers ---
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login'; 
    };

    // Update profile function
    const handleSaveProfileChanges = async () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("user_id");
        
        if (!token || !userId) {
            alert("Please login again");
            handleLogout();
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/auth/radiologist/${userId}`, {
                method: 'PUT',
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    phone: contactInfo.phone,
                    address: contactInfo.address
                })
            });

            if (response.ok) {
                alert('Profile updated successfully!');
                // Update local state with new phone
                setPersonalInfo(prev => ({
                    ...prev,
                    phone: contactInfo.phone
                }));
            } else {
                const errorData = await response.json();
                alert(`Failed to update profile: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert('Error updating profile. Please try again.');
        }
    };

    // --- Rest of your original state ---
    const [currentView, setCurrentView] = useState('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedScan, setSelectedScan] = useState(null);
    const [uploadFile, setUploadFile] = useState(null);
    const [notes, setNotes] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(DEFAULT_AVATAR);

    // Mock Data
    const [scans, setScans] = useState([
        { id: 1, date: '2023-10-25', time: '09:00 AM', patient: 'Ahmed Ali', pid: 'P-101', type: 'MRI', module: 'Knee', desc: 'ACL Injury check', doctor: 'Dr. Sarah Johnson', status: 'Pending' },
        { id: 2, date: '2023-10-25', time: '10:30 AM', patient: 'John Smith', pid: 'P-102', type: 'CT Scan', module: 'Brain', desc: 'Chronic Headaches', doctor: 'Dr. Moustafa El-Sayed', status: 'Completed' },
        { id: 3, date: '2023-10-26', time: '11:45 AM', patient: 'Mona Zaki', pid: 'P-103', type: 'X-Ray', module: 'Chest', desc: 'Persistent Cough', doctor: 'Dr. Sarah Johnson', status: 'Pending' },
        { id: 4, date: '2023-10-26', time: '01:15 PM', patient: 'Khaled Omar', pid: 'P-104', type: 'Ultrasound', module: 'Abdomen', desc: 'Pain investigation', doctor: 'Dr. Moustafa El-Sayed', status: 'Pending' },
    ]);

    const profileStats = {
        appointmentsThisMonth: 142,
        scansMadeThisMonth: 118
    };

    const handleOpenUpload = (scan) => {
        setSelectedScan(scan);
        setModalOpen(true);
        setNotes('');
        setUploadFile(null);
    };

    const handleSubmitUpload = () => {
        const updatedScans = scans.map(s => 
            s.id === selectedScan.id ? { ...s, status: 'Completed' } : s
        );
        setScans(updatedScans);
        setModalOpen(false);
        alert(`Report successfully sent to ${selectedScan.doctor}`);
    };

    const handlePhotoChange = (newPhotoUrl) => {
        setProfilePhoto(newPhotoUrl);
    }

    const filteredScans = scans.filter(scan => 
        scan.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scan.pid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scan.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get first name for greeting
    const getFirstName = () => {
        return personalInfo.f_name || 'Doctor';
    };

    return (
        <div style={radiologistStyles.container}>
            
            {/* --- Header (Sticky) --- */}
            <header style={radiologistStyles.header}>
                <div style={radiologistStyles.logoGroup}>
                    <h1 style={radiologistStyles.logoText}>OL Ortholink</h1>
                </div>

                <div style={radiologistStyles.profileSection}>
                    <div 
                        style={radiologistStyles.profileCard} 
                        onClick={() => setCurrentView('profile')}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <div style={radiologistStyles.avatar}>
                            {personalInfo.f_name && personalInfo.l_name 
                                ? `${personalInfo.f_name[0]}${personalInfo.l_name[0]}` 
                                : 'DR'}
                        </div>
                        <span style={radiologistStyles.doctorName}>Dr. {getFirstName()}</span>
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
                        {/* Loading State */}
                        {loading && (
                            <div style={radiologistStyles.loadingOverlay}>
                                <div style={radiologistStyles.spinner}></div>
                                <p>Loading profile data...</p>
                            </div>
                        )}

                        {/* --- Big Welcome Banner --- */}
                        <section style={radiologistStyles.welcomeBanner}>
                            <div style={radiologistStyles.decorativeCircle1}></div>
                            <div style={radiologistStyles.decorativeCircle2}></div>

                            <div style={radiologistStyles.welcomeTextBox}>
                                <h1 style={radiologistStyles.welcomeTitle}>Hello, Dr. {getFirstName()}!</h1>
                                <p style={radiologistStyles.welcomeSubText}>
                                    You have <span style={radiologistStyles.welcomeHighlight}>{scans.filter(s => s.status === 'Pending').length} pending tasks</span> today. Your progress is looking great. Let's clear the queue!
                                </p>
                            </div>
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
                                disabled={loading}
                            />
                        </div>

                        {/* Table */}
                        <div style={radiologistStyles.tableContainer}>
                            <table style={radiologistStyles.table}>
                                <thead>
                                    <tr>
                                        <th style={radiologistStyles.th}>Date</th>
                                        <th style={radiologistStyles.th}>Time</th>
                                        <th style={radiologistStyles.th}>Patient Name</th>
                                        <th style={radiologistStyles.th}>ID</th>
                                        <th style={radiologistStyles.th}>Referring Doctor</th>
                                        <th style={radiologistStyles.th}>Scan Type</th>
                                        <th style={radiologistStyles.th}>Module</th>
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
                                            <td style={radiologistStyles.td}>{scan.time}</td>
                                            <td style={radiologistStyles.td}><strong>{scan.patient}</strong></td>
                                            <td style={radiologistStyles.td}>{scan.pid}</td>
                                            <td style={radiologistStyles.td}>{scan.doctor}</td>
                                            <td style={radiologistStyles.td}>{scan.type}</td>
                                            <td style={radiologistStyles.td}>{scan.module}</td>
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
                        personalInfo={personalInfo}
                        contactInfo={contactInfo}
                        onContactInfoChange={setContactInfo}
                        onSaveProfile={handleSaveProfileChanges}
                        loading={loading}
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

// --- Sub-Component for Profile ---
function ProfileEditor({ onBack, currentPhoto, onPhotoUpdate, stats, personalInfo, contactInfo, onContactInfoChange, onSaveProfile, loading }) {
    const fileInputRef = useRef(null);

    const triggerFileSelect = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            onPhotoUpdate(imageUrl);
        }
    };

    const handlePhoneChange = (e) => {
        onContactInfoChange({
            ...contactInfo,
            phone: e.target.value
        });
    };

    const handleAddressChange = (e) => {
        onContactInfoChange({
            ...contactInfo,
            address: e.target.value
        });
    };

    if (loading) {
        return (
            <div style={radiologistStyles.profileContainer}>
                <button onClick={onBack} style={radiologistStyles.backButton}>
                    ← Back to Dashboard
                </button>
                <div style={radiologistStyles.loadingOverlay}>
                    <div style={radiologistStyles.spinner}></div>
                    <p>Loading profile data...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={radiologistStyles.profileContainer}>
            <button onClick={onBack} style={radiologistStyles.backButton}>
                ← Back to Dashboard
            </button>
            
            <div style={radiologistStyles.profileContentWrapper}>
                
                {/* Center: Photo Section */}
                <div style={radiologistStyles.profilePhotoSection}>
                    <img src={currentPhoto} alt="Profile" style={radiologistStyles.largeAvatar} />
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
                    
                    {/* Username & Email Fields - Using ACTUAL data */}
                    <div style={radiologistStyles.inputGroup}>
                        <label style={radiologistStyles.formLabel}>Username</label>
                        <input 
                            type="text" 
                            value={personalInfo.username || 'dr_btabt'} 
                            disabled 
                            style={radiologistStyles.readOnlyField} 
                        />
                    </div>
                    <div style={radiologistStyles.inputGroup}>
                        <label style={radiologistStyles.formLabel}>Email Address</label>
                        <input 
                            type="text" 
                            value={personalInfo.email || 'btabt@ortholink.com'} 
                            disabled 
                            style={radiologistStyles.readOnlyField} 
                        />
                    </div>

                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                         <div style={radiologistStyles.inputGroup}>
                            <label style={radiologistStyles.formLabel}>Full Name</label>
                            <input 
                                type="text" 
                                value={personalInfo.full_name || `Dr. ${personalInfo.f_name || 'Btabt'} ${personalInfo.l_name || 'Bob'}`} 
                                disabled 
                                style={radiologistStyles.readOnlyField} 
                            />
                        </div>
                        <div style={radiologistStyles.inputGroup}>
                            <label style={radiologistStyles.formLabel}>Staff ID</label>
                            <input 
                                type="text" 
                                value={personalInfo.staff_id || 'RAD-5'} 
                                disabled 
                                style={radiologistStyles.readOnlyField} 
                            />
                        </div>
                    </div>

                    {/* Additional Professional Info */}
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px'}}>
                        <div style={radiologistStyles.inputGroup}>
                            <label style={radiologistStyles.formLabel}>Department</label>
                            <input 
                                type="text" 
                                value={personalInfo.department || 'Radiology'} 
                                disabled 
                                style={radiologistStyles.readOnlyField} 
                            />
                        </div>
                        <div style={radiologistStyles.inputGroup}>
                            <label style={radiologistStyles.formLabel}>License Number</label>
                            <input 
                                type="text" 
                                value={personalInfo.license_number || 'RD123456'} 
                                disabled 
                                style={radiologistStyles.readOnlyField} 
                            />
                        </div>
                    </div>

                    {/* Monthly Statistics Section */}
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
                            value={contactInfo.phone || '+20 987 654 3210'} 
                            onChange={handlePhoneChange}
                            style={radiologistStyles.editableInput} 
                            onFocus={(e) => e.target.style.borderColor = '#059669'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                    </div>
                    <div style={radiologistStyles.inputGroup}>
                        <label style={radiologistStyles.formLabel}>Address</label>
                        <input 
                            type="text" 
                            value={contactInfo.address || 'Alexandria, Egypt'} 
                            onChange={handleAddressChange}
                            style={radiologistStyles.editableInput}
                            onFocus={(e) => e.target.style.borderColor = '#059669'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                    </div>

                    {/* Save button */}
                    <button 
                        style={radiologistStyles.saveBtn}
                        onClick={onSaveProfile}
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