import React, { useState, useEffect } from 'react';

// Import styles
import { sharedStyles as s } from '../styles/sharedStyles';
import { patientProfileStyles as pps } from '../styles/patientProfileStyles';
import { doctorProfileStyles as dps } from '../styles/doctorProfileStyles';

import { 
    Home, Users, User, LogOut, Eye, Activity, 
    ArrowLeft, Calendar, FileText, Pill, 
    Thermometer, Heart, ClipboardList, X, Search, EyeOff
} from 'lucide-react';

// --- MOCK DATA (Moved outside to prevent re-creation) ---
const allPatientsData = [
    { 
        id: 1, patientName: 'Sarah Johnson', age: 34, gender: 'Female', bloodType: 'O+', allergies: 'Penicillin',
        diagnosis: 'Rotator Cuff Tear', phase: 'Pre-Op', lastVisitDate: '12 Jan 2024', nextVisitDate: '24 Feb 2024',
        history: ['Shoulder Dislocation (2019)', 'Mild Arthritis'],
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
        id: 2, patientName: 'Michael Brown', age: 28, gender: 'Male', bloodType: 'A-', allergies: 'None',
        diagnosis: 'ACL Reconstruction', phase: 'Post-Op (Wk 6)', lastVisitDate: '10 Feb 2024', nextVisitDate: '15 Mar 2024',
        history: ['ACL Tear', 'Meniscus Repair'],
        lastVisit: { 
            date: '10 Feb 2024',
            complaint: 'Stiffness in knee upon waking',
            diagnosis: 'Post-operative stiffness',
            treatment: 'Increased PT intensity, Cryotherapy',
            physicalExam: 'Incision healed well, mild effusion present',
            medications: [{ name: 'Ibuprofen', dosage: '600mg', freq: 'As needed for pain' }]
        }
    },
    { 
        id: 3, patientName: 'Emily Davis', age: 22, gender: 'Female', bloodType: 'B+', allergies: 'Sulfa',
        diagnosis: 'Grade II Ankle Sprain', phase: 'Conservative', lastVisitDate: '20 Jan 2024', nextVisitDate: '01 Mar 2024',
        history: ['None'], lastVisit: null
    },
    { 
        id: 4, patientName: 'Robert Wilson', age: 52, gender: 'Male', bloodType: 'AB+', allergies: 'None',
        diagnosis: 'Lumbar Disc Herniation', phase: 'Conservative', lastVisitDate: '05 Jan 2024', nextVisitDate: 'Pending',
        history: ['Sciatica'],
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
        id: 5, patientName: 'Lisa Anderson', age: 61, gender: 'Female', bloodType: 'O-', allergies: 'Latex',
        diagnosis: 'Distal Radius Fracture', phase: 'Rehab', lastVisitDate: '15 Dec 2023', nextVisitDate: '25 Feb 2024',
        history: ['Osteoporosis'], lastVisit: null
    },
    { 
        id: 6, patientName: 'James Miller', age: 45, gender: 'Male', bloodType: 'A+', allergies: 'Peanuts',
        diagnosis: 'Meniscus Tear', phase: 'Post-Op (Wk 2)', lastVisitDate: '18 Feb 2024', nextVisitDate: '28 Feb 2024',
        history: ['Hypertension'], lastVisit: null
    },
];

const pendingScans = [
    { id: 1, scanType: 'MRI Lumbar Spine', patientName: 'Robert Wilson', scanImage: 'mri_brain.jpg', date: '23 Feb 2024', status: 'Pending', modality: 'MRI' },
    { id: 2, scanType: 'X-Ray Right Wrist', patientName: 'Lisa Anderson', scanImage: 'ct_chest.jpg', date: '23 Feb 2024', status: 'Pending', modality: 'X-Ray' },
    { id: 3, scanType: 'X-Ray Left Knee', patientName: 'Michael Brown', scanImage: 'xray.jpg', date: '22 Feb 2024', status: 'Pending', modality: 'X-Ray' },
];

const patientScansHistory = [
    { id: 101, name: 'MRI Right Shoulder', modality: 'MRI', date: '10 Jan 2024', status: 'Report Ready', image: 'shoulder_mri.jpg', report: 'Full thickness tear of Supraspinatus tendon. Moderate muscle atrophy.' },
    { id: 102, name: 'X-Ray Shoulder AP/Lat', modality: 'X-Ray', date: '15 Dec 2023', status: 'Report Ready', image: 'shoulder_xray.jpg', report: 'Acromioclavicular joint osteoarthritis visible. No fracture.' },
    { id: 103, name: 'CT Scan Cervical Spine', modality: 'CT', date: '20 Nov 2023', status: 'Processing', image: 'c_spine.jpg', report: '' }
];

// --- HELPER FUNCTIONS ---
const getStatusStyle = (status) => {
    switch (status) {
        case 'scheduled': return s.statusScheduled;
        case 'completed': return s.statusCompleted;
        case 'cancelled': return s.statusCancelled;
        case 'no-show': return s.statusNoShow;
        default: return s.statusScheduled;
    }
};

const getPhaseStyle = (phase) => {
    if (phase.includes('Pre-Op')) return s.phasePreOp;
    if (phase.includes('Post-Op')) return s.phasePostOp;
    if (phase.includes('Rehab')) return s.phaseRehab;
    return s.phaseConservative;
};


// --- SUB-COMPONENTS (Moved OUTSIDE the main component) ---

const RenderReportModal = ({ show, onClose, scan, reportText, setReportText, onSubmit }) => {
    if (!show) return null;
    return (
        <div style={s.modalOverlay} onClick={onClose}>
            <div style={s.modalBox} onClick={e => e.stopPropagation()}>
                <div style={s.modalHeader}>
                    <h3 style={s.sectionTitle}>Scan Report</h3>
                    <button onClick={onClose} style={{background:'none', border:'none', cursor:'pointer'}}><X size={20}/></button>
                </div>
                <div style={s.modalBody}>
                    <div style={{height: '250px', backgroundColor: '#000', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                         <img src={scan?.image || scan?.scanImage} alt="Scan" style={{maxHeight: '100%', maxWidth: '100%', objectFit: 'contain'}} />
                    </div>
                    
                    <div style={pps.infoGridCentered}>
                        <div style={{textAlign: 'left'}}>
                            <div style={s.infoLabel}>Scan Name</div>
                            <div style={s.infoValue}>{scan?.name || scan?.scanType}</div>
                        </div>
                        <div style={{textAlign: 'left'}}>
                            <div style={s.infoLabel}>Modality</div>
                            <div style={s.infoValue}>{scan?.modality}</div>
                        </div>
                    </div>

                    <div style={{marginTop: '20px'}}>
                        <div style={s.inputLabel}>Doctor's Findings & Notes</div>
                        {scan?.isReadOnly ? (
                            <div style={{marginTop: '8px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', lineHeight: '1.5', color: '#334155'}}>
                                {scan.report || "No report available."}
                            </div>
                        ) : (
                            <textarea 
                                style={{...s.textAreaField, width: '100%', marginTop: '8px', minHeight: '100px'}}
                                placeholder="Enter diagnosis and findings..."
                                value={reportText}
                                onChange={(e) => setReportText(e.target.value)}
                            />
                        )}
                    </div>
                </div>
                {!scan?.isReadOnly && (
                    <div style={s.modalFooter}>
                        <button style={s.actionButton} onClick={onClose}>Cancel</button>
                        <button style={{...s.actionButton, backgroundColor: '#02505F', color: 'white'}} onClick={onSubmit}>Submit Report</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const RenderMedicationModal = ({ show, onClose }) => {
    if (!show) return null;
    return (
        <div style={s.modalOverlay} onClick={onClose}>
            <div style={s.modalBox} onClick={e => e.stopPropagation()}>
                <div style={s.modalHeader}>
                    <h3 style={s.sectionTitle}>Prescribe Medication</h3>
                    <button onClick={onClose} style={{background:'none', border:'none', cursor:'pointer'}}><X size={20}/></button>
                </div>
                <div style={s.modalBody}>
                    <div style={s.formGroup}>
                        <label style={s.inputLabel}>Medication Name</label>
                        <input type="text" style={s.inputField} placeholder="e.g. Naproxen" />
                    </div>
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'12px'}}>
                        <div style={s.formGroup}>
                            <label style={s.inputLabel}>Dosage</label>
                            <input type="text" style={s.inputField} placeholder="e.g. 500mg" />
                        </div>
                        <div style={s.formGroup}>
                            <label style={s.inputLabel}>Frequency</label>
                            <input type="text" style={s.inputField} placeholder="e.g. Twice Daily" />
                        </div>
                    </div>
                    <div style={{...s.formGroup, marginTop: '12px'}}>
                        <label style={s.inputLabel}>Duration</label>
                        <input type="text" style={s.inputField} placeholder="e.g. 14 Days" />
                    </div>
                </div>
                <div style={s.modalFooter}>
                    <button style={s.actionButton} onClick={onClose}>Cancel</button>
                    <button style={{...s.actionButton, backgroundColor: '#4361ee', color: 'white'}} onClick={onClose}>Prescribe</button>
                </div>
            </div>
        </div>
    );
};

const RenderScanOrderModal = ({ show, onClose }) => {
    if (!show) return null;
    return (
        <div style={s.modalOverlay} onClick={onClose}>
            <div style={s.modalBox} onClick={e => e.stopPropagation()}>
                <div style={s.modalHeader}>
                    <h3 style={s.sectionTitle}>Order New Scan</h3>
                    <button onClick={onClose} style={{background:'none', border:'none', cursor:'pointer'}}><X size={20}/></button>
                </div>
                <div style={s.modalBody}>
                    <div style={s.formGroup}>
                        <label style={s.inputLabel}>Scan Type</label>
                        <input type="text" style={s.inputField} placeholder="e.g. MRI Left Knee" />
                    </div>
                    <div style={{...s.formGroup, marginTop: '12px'}}>
                        <label style={s.inputLabel}>Modality</label>
                        <select style={s.inputField}>
                            <option>X-Ray</option>
                            <option>MRI</option>
                            <option>CT Scan</option>
                            <option>Ultrasound</option>
                            <option>DXA (Bone Density)</option>
                        </select>
                    </div>
                    <div style={{...s.formGroup, marginTop: '12px'}}>
                        <label style={s.inputLabel}>Reason / Description</label>
                        <textarea style={s.textAreaField} placeholder="Suspected meniscus tear..." />
                    </div>
                </div>
                <div style={s.modalFooter}>
                    <button style={s.actionButton} onClick={onClose}>Cancel</button>
                    <button style={{...s.actionButton, backgroundColor: '#02505F', color: 'white'}} onClick={onClose}>Order Scan</button>
                </div>
            </div>
        </div>
    );
};

const ProfileSettingsView = ({ profileData, setProfileData, doctorName }) => {
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfileData({...profileData, profilePhoto: reader.result});
            reader.readAsDataURL(file);
        }
    };

    const handleSignatureUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfileData({...profileData, digitalSignature: reader.result});
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
            alert('New passwords do not match!');
            return;
        }
        console.log('Saving profile:', profileData);
        alert('Profile updated successfully!');
    };

    const getPasswordStrength = (pass) => {
        if (!pass) return 0;
        if (pass.length < 6) return 30;
        if (pass.length < 10) return 60;
        return 100;
    };
    const strength = getPasswordStrength(profileData.newPassword);
    const strengthColor = strength < 40 ? '#ef4444' : strength < 80 ? '#f59e0b' : '#22c55e';

    const stats = {
        appointmentsThisMonth: 42,
        scansMadeThisMonth: 15
    };

    return (
        <div style={s.main}>
            <div style={{marginBottom: '10px'}}>
                <h1 style={{fontSize: '28px', fontWeight: '700', color: '#1e293b'}}>My Profile</h1>
                <p style={{color: '#64748b'}}>Manage your personal and professional information</p>
            </div>

            <div style={dps.profilePageContainer}>
                <div style={dps.profileLayoutGrid}>
                    
                    {/* LEFT COLUMN */}
                    <div style={dps.profileColumn}>
                        
                        {/* Profile Photo */}
                        <div style={dps.profileCard}>
                            <h3 style={dps.profileCardTitle}>Profile Photo</h3>
                            <div style={dps.profilePhotoSection}>
                                <div style={dps.profilePhotoCircle}>
                                    {profileData.profilePhoto ? (
                                        <img src={profileData.profilePhoto} alt="Profile" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                    ) : (
                                        doctorName.charAt(0)
                                    )}
                                </div>
                                <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{display: 'none'}} id="photo-upload" />
                                <label htmlFor="photo-upload" style={dps.uploadButton}>Upload New Photo</label>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div style={dps.profileCard}>
                            <h3 style={dps.profileCardTitle}>Contact Information</h3>
                            <div style={dps.infoRow}>
                                <label style={s.inputLabel}>Phone Number</label>
                                <input type="tel" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} style={dps.editableField} />
                            </div>
                            <div style={dps.infoRow}>
                                <label style={s.inputLabel}>Address</label>
                                <textarea value={profileData.address} onChange={(e) => setProfileData({...profileData, address: e.target.value})} style={{...dps.editableField, minHeight: '80px', resize: 'vertical'}} />
                            </div>
                        </div>

                        {/* Digital Signature */}
                        <div style={dps.profileCard}>
                            <h3 style={dps.profileCardTitle}>Digital Signature</h3>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px'}}>
                                <div style={{
                                    width: '100%',
                                    height: '100px',
                                    border: '2px dashed #e2e8f0',
                                    borderRadius: '8px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: '#f8fafc', overflow: 'hidden'
                                }}>
                                    {profileData.digitalSignature ? (
                                        <img src={profileData.digitalSignature} alt="Signature" style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} />
                                    ) : (
                                        <span style={{fontSize: '12px', color: '#94a3b8'}}>No signature</span>
                                    )}
                                </div>
                                <div>
                                    <input type="file" accept="image/*" onChange={handleSignatureUpload} style={{display: 'none'}} id="signature-upload" />
                                    <label htmlFor="signature-upload" style={{...dps.uploadButton, width: '100%', display: 'block', textAlign:'center'}}>Upload Signature</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div style={dps.profileColumn}>
                        
                        {/* Professional Info */}
                        <div style={dps.profileCard}>
                            <h3 style={dps.profileCardTitle}>Professional Information</h3>
                            
                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px'}}>
                                <div style={dps.infoRow}>
                                    <label style={s.inputLabel}>Full Name</label>
                                    <div style={dps.readOnlyField}>{profileData.fullName}</div>
                                </div>
                                <div style={dps.infoRow}>
                                    <label style={s.inputLabel}>Professional Title</label>
                                    <div style={dps.readOnlyField}>{profileData.professionalTitle}</div>
                                </div>
                            </div>

                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px'}}>
                                <div style={dps.infoRow}>
                                    <label style={s.inputLabel}>Medical License</label>
                                    <div style={dps.readOnlyField}>{profileData.licenseNumber}</div>
                                </div>
                                <div style={dps.infoRow}>
                                <label style={s.inputLabel}>Doctor ID</label>
                                <div style={dps.readOnlyField}>{profileData.staffId}</div>
                                </div>
                            </div>


                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px'}}>
                                <div style={dps.infoRow}>
                                    <label style={s.inputLabel}>Username</label>
                                    <div style={dps.readOnlyField}>{profileData.username}</div>
                                </div>
                                <div style={dps.infoRow}>
                                <label style={s.inputLabel}>Email</label>
                                <div style={dps.readOnlyField}>{profileData.email}</div>
                                </div>
                            </div>
                        </div>

                        {/* ✅ PASTE STATS CARD HERE (Above Security) ✅ */}
                        <div style={dps.profileCard}>
                            <h3 style={dps.profileCardTitle}>Monthly Statistics</h3>
                            <div style={dps.statsGrid}>
                                <div style={dps.statItem}>
                                    <span style={dps.statNumber}>{stats.appointmentsThisMonth}</span>
                                    <span style={dps.statLabel}>Appointments</span>
                                </div>
                                <div style={dps.statItem}>
                                    <span style={dps.statNumber}>{stats.scansMadeThisMonth}</span>
                                    <span style={dps.statLabel}>Scans Completed</span>
                                </div>
                            </div>
                        </div>

                        {/* Security Settings */}
                        <div style={dps.profileCard}>
                            <h3 style={dps.profileCardTitle}>Security Settings</h3>
                            
                            <div style={dps.infoRow}>
                                <label style={s.inputLabel}>Current Password</label>
                                <div style={dps.passwordWrapper}>
                                    <input 
                                        type={showCurrentPass ? "text" : "password"} 
                                        value={profileData.password} 
                                        onChange={(e) => setProfileData({...profileData, password: e.target.value})} 
                                        style={dps.editableField} 
                                        placeholder="*************" 
                                    />
                                    <button onClick={() => setShowCurrentPass(!showCurrentPass)} style={dps.eyeIconBtn}>
                                        {showCurrentPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                                    </button>
                                </div>
                            </div>

                            <div style={dps.infoRow}>
                                <label style={s.inputLabel}>New Password</label>
                                <div style={dps.passwordWrapper}>
                                    <input 
                                        type={showNewPass ? "text" : "password"} 
                                        value={profileData.newPassword} 
                                        onChange={(e) => setProfileData({...profileData, newPassword: e.target.value})} 
                                        style={dps.editableField} 
                                        placeholder="*************" 
                                    />
                                    <button onClick={() => setShowNewPass(!showNewPass)} style={dps.eyeIconBtn}>
                                        {showNewPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                                    </button>
                                </div>
                            </div>

                            {profileData.newPassword && (
                                <div style={dps.strengthBarContainer}>
                                    <div style={{...dps.strengthBarFill, width: `${strength}%`, backgroundColor: strengthColor}}></div>
                                </div>
                            )}

                            <div style={dps.infoRow}>
                                <label style={s.inputLabel}>Confirm New Password</label>
                                <div style={dps.passwordWrapper}>
                                    <input 
                                        type={showConfirmPass ? "text" : "password"} 
                                        value={profileData.confirmPassword} 
                                        onChange={(e) => setProfileData({...profileData, confirmPassword: e.target.value})} 
                                        style={dps.editableField} 
                                        placeholder="*************" 
                                    />
                                    <button onClick={() => setShowConfirmPass(!showConfirmPass)} style={dps.eyeIconBtn}>
                                        {showConfirmPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                            <button onClick={handleSave} style={dps.saveButton}>Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DashboardView = ({ doctorName, appointments, handlePatientClick, pendingScans, handleOpenReport }) => (
    <div style={s.main}>
        <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0}}>
            <div>
                <h1 style={{fontSize: '32px', fontWeight: '700', color: '#1e293b', marginBottom: '8px'}}>
                    Welcome <span style={{color: '#4361ee'}}>{doctorName}!</span>
                </h1>
                <p style={{fontSize: '16px', color: '#64748b'}}>
                    You have <strong>{appointments.filter(a => a.status === 'scheduled').length} patients</strong> remaining today!
                </p>
            </div>
            <div style={{fontSize: '80px', lineHeight: 1, marginTop: '-10px', transform: 'rotate(-15deg)', opacity: 0.9}}>🩺</div>
        </div>

        <div style={s.contentContainer}>
            <div style={s.section}>
                <div style={s.sectionHeaderRow}><h2 style={s.sectionTitle}>Today's Appointments</h2></div>
                <div style={s.tableContainer}>
                    <div style={{ ...s.tableHeader, ...s.appointmentGrid }}>
                        <div>Date</div><div>Time</div><div>Patient</div><div>Reason</div><div>Notes</div><div>Status</div>
                    </div>
                    <div style={s.scrollableRows}>
                        {appointments.map((apt) => (
                            <div key={apt.id} style={{ ...s.tableRow, ...s.appointmentGrid }}>
                                <div>{apt.date}</div>
                                <div>{apt.time}</div>
                                <div><button style={s.clickablePatientName} onClick={() => handlePatientClick(apt.patientName)}>{apt.patientName}</button></div>
                                <div>{apt.reason}</div>
                                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#64748b' }}>{apt.notes}</div>
                                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#64748b' }}>{apt.status}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={s.section}>
                <div style={s.sectionHeaderRow}><h2 style={s.sectionTitle}>Pending Scan Reports</h2></div>
                <div style={s.tableContainer}>
                    <div style={{ ...s.tableHeader, ...s.scanGrid }}>
                        <div>Scan</div><div>Modality</div><div>Patient</div><div>Date</div><div>Action</div>
                    </div>
                    <div style={s.scrollableRows}>
                        {pendingScans.map((scan) => (
                            <div key={scan.id} style={{ ...s.tableRow, ...s.scanGrid }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '6px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
                                    <img src={scan.scanImage} alt="scan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div>{scan.scanType}</div>
                                <div><button style={s.clickablePatientName} onClick={() => handlePatientClick(scan.patientName)}>{scan.patientName}</button></div>
                                <div>{scan.date}</div>
                                <div>
                                    <button style={s.actionButton} onClick={() => handleOpenReport(scan, false)}>
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

const PatientsListView = ({ allPatientsData, searchTerm, setSearchTerm, handlePatientClick }) => {
    const filteredPatients = allPatientsData.filter(p => 
        p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={s.main}>
            <div style={{marginBottom: '10px'}}>
                <h1 style={{fontSize: '28px', fontWeight: '700', color: '#1e293b'}}>My Patients</h1>
                <p style={{color: '#64748b'}}>Manage patient records, track recovery phases, and retention.</p>
            </div>

            <div style={s.searchContainer}>
                <div style={s.searchWrapper}>
                    <Search size={18} style={s.searchIcon} />
                    <input 
                        type="text" 
                        style={s.searchInput} 
                        placeholder="Search by Name, ID, or Diagnosis..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div style={{fontSize: '14px', color: '#64748b'}}>Showing {filteredPatients.length} Patients</div>
            </div>

            <div style={s.contentContainer}>
                <div style={s.section}>
                    <div style={s.tableContainer}>
                        <div style={{ ...s.tableHeader, ...s.patientListGrid }}>
                            <div>Patient Name</div>
                            <div>Condition / Diagnosis</div>
                            <div>Treatment Phase</div>
                            <div>Last Visit</div>
                            <div>Next Visit</div>
                        </div>
                        
                        <div style={s.scrollableRows}>
                            {filteredPatients.map((patient) => (
                                <div key={patient.id} style={{ ...s.tableRow, ...s.patientListGrid }}>
                                    <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                        <div style={{width:'32px', height:'32px', borderRadius:'50%', background:'#e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'700', color:'#475569'}}>
                                            {patient.patientName.charAt(0)}
                                        </div>
                                        <button 
                                            style={s.clickablePatientName} 
                                            onClick={() => handlePatientClick(patient.patientName)}
                                        >
                                            {patient.patientName}
                                        </button>
                                    </div>

                                    <div style={{fontWeight: '500', color: '#334155'}}>{patient.diagnosis}</div>

                                    <div>
                                        <span style={{ ...s.phaseBadge, ...getPhaseStyle(patient.phase) }}>
                                            {patient.phase}
                                        </span>
                                    </div>

                                    <div style={{color: '#64748b'}}>{patient.lastVisitDate || '-'}</div>
                                    <div style={{color: patient.nextVisitDate === 'Pending' ? '#ef4444' : '#02505F', fontWeight:'500'}}>
                                        {patient.nextVisitDate}
                                    </div>
                                </div>
                            ))}
                            {filteredPatients.length === 0 && (
                                <div style={{padding: '40px', textAlign: 'center', color: '#94a3b8'}}>
                                    No patients found matching "{searchTerm}"
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileView = ({ selectedPatient, handleBackToHome, consultationRecords, setConsultationRecords, setShowMedicationModal, setShowScanOrderModal, handleOpenReport, patientScansHistory }) => {
    const [tab, setTab] = useState('records');

    return (
        <div style={s.main}>
            <button style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', cursor: 'pointer', fontSize: '14px', fontWeight: '600', border: 'none', background: 'none', marginBottom: '10px', width: 'fit-content'}} onClick={handleBackToHome}>
                <ArrowLeft size={16} /> Back to Home
            </button>

            <div style={pps.profileContainer}>
                {/* LEFT COLUMN: Patient Info */}
                <div style={s.contentContainer}>
                    <div style={s.card}>
                        <div style={{alignSelf: 'center', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><User size={40} color="#64748b"/></div>
                        <h2 style={{fontSize: '20px', fontWeight: '700', color: '#1e293b', textAlign: 'center', margin: 0}}>{selectedPatient.patientName}</h2>
                        
                        <div style={pps.patientInfoCentered}>
                            <div style={pps.infoGridCentered}>
                                <div style={pps.infoItemCentered}><span style={s.infoLabel}>Age</span><span style={s.infoValue}>{selectedPatient.age} Yrs</span></div>
                                <div style={pps.infoItemCentered}><span style={s.infoLabel}>Gender</span><span style={s.infoValue}>{selectedPatient.gender}</span></div>
                                <div style={pps.infoItemCentered}><span style={s.infoLabel}>Blood</span><span style={s.infoValue}>{selectedPatient.bloodType}</span></div>
                                <div style={pps.infoItemCentered}><span style={s.infoLabel}>Allergies</span><span style={{...s.infoValue, color: '#ef4444'}}>{selectedPatient.allergies}</span></div>
                            </div>
                        </div>
                    </div>

                    <div style={s.card}>
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

                    <div style={{...s.card, flex: 1}}>
                        <div style={{fontSize: '16px', fontWeight: '700', color: '#02505F', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}><ClipboardList size={18} /> Medical History</div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto'}}>
                            {selectedPatient.history.map((item, idx) => (
                                <div key={idx} style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '8px'}}>• {item}</div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* MIDDLE COLUMN */}
                <div style={s.contentContainer}>
                    <div style={{...s.card, flex: 0.8, overflow: 'hidden'}}>
                        <div style={{fontSize: '16px', fontWeight: '700', color: '#02505F', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
                            <Calendar size={18} /> Last Visit ({selectedPatient.lastVisit?.date || 'N/A'})
                        </div>
                        
                        {selectedPatient.lastVisit ? (
                            <div style={s.formScroll}>
                                <div style={{marginBottom: '10px'}}>
                                    <span style={s.infoLabel}>Complaint</span>
                                    <div style={{fontSize: '14px', color: '#334155'}}>{selectedPatient.lastVisit.complaint}</div>
                                </div>
                                <div style={{marginBottom: '10px'}}>
                                    <span style={s.infoLabel}>Diagnosis</span>
                                    <div style={{fontSize: '14px', color: '#334155', fontWeight: '500'}}>{selectedPatient.lastVisit.diagnosis}</div>
                                </div>
                                <div style={{marginBottom: '10px'}}>
                                    <span style={s.infoLabel}>Treatment Plan</span>
                                    <div style={{fontSize: '14px', color: '#334155'}}>{selectedPatient.lastVisit.treatment}</div>
                                </div>
                                
                                <div style={{marginTop: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '10px'}}>
                                    <span style={s.infoLabel}>Prescribed Meds</span>
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

                    <div style={{...s.card, flex: 1.2, padding: 0, overflow: 'hidden'}}>
                        <div style={{padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems:'center'}}>
                            <div style={{fontSize: '16px', fontWeight: '700', color: '#02505F', display: 'flex', alignItems: 'center', gap: '8px'}}><FileText size={18} /> Patient Scans</div>
                        </div>
                        <div style={s.scrollableRows}>
                            <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '13px'}}>
                                <thead>
                                    <tr>
                                        <th style={{textAlign: 'left', padding: '10px', color: '#64748b', borderBottom: '1px solid #e2e8f0', fontSize: '11px', textTransform: 'uppercase'}}>Scan Name</th>
                                        <th style={{textAlign: 'left', padding: '10px', color: '#64748b', borderBottom: '1px solid #e2e8f0', fontSize: '11px', textTransform: 'uppercase'}}>Modality</th>
                                        <th style={{textAlign: 'left', padding: '10px', color: '#64748b', borderBottom: '1px solid #e2e8f0', fontSize: '11px', textTransform: 'uppercase'}}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patientScansHistory.map(scan => (
                                        <tr key={scan.id}>
                                            <td style={{padding: '10px', color: '#334155', borderBottom: '1px solid #f1f5f9'}}>{scan.name}</td>
                                            <td style={{padding: '10px', color: '#334155', borderBottom: '1px solid #f1f5f9'}}>{scan.modality}</td>
                                            <td style={{padding: '10px', color: '#334155', borderBottom: '1px solid #f1f5f9'}}>
                                                <button style={{...s.actionButton, padding: '4px 8px'}} onClick={() => handleOpenReport(scan, true)}>View</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div style={s.contentContainer}>
                    <div style={{...s.card, flex: 1, display: 'flex', flexDirection: 'column', gap: '12px'}}>
                        <div style={{fontSize: '16px', fontWeight: '700', color: '#02505F'}}>Current Consultation</div>
                        <div style={s.tabGroup}>
                            <button onClick={() => setTab('records')} style={{...s.tab, ...(tab === 'records' ? s.tabActive : s.tabInactive)}}>Records</button>
                            <button onClick={() => setTab('orders')} style={{...s.tab, ...(tab === 'orders' ? s.tabActive : s.tabInactive)}}>Orders</button>
                        </div>

                        {tab === 'records' ? (
                            <div style={s.formScroll}>
                                <div style={s.formGroup}>
                                    <label style={s.inputLabel}>Complaint</label>
                                    <textarea style={s.textAreaField} placeholder="Patient's main complaint..." value={consultationRecords.complaint} onChange={e => setConsultationRecords({...consultationRecords, complaint: e.target.value})} />
                                </div>
                                <div style={s.formGroup}>
                                    <label style={s.inputLabel}>Physical Examination</label>
                                    <textarea style={s.textAreaField} placeholder="Key findings (e.g. Swelling, Range of Motion)..." value={consultationRecords.physicalExam} onChange={e => setConsultationRecords({...consultationRecords, physicalExam: e.target.value})} />
                                </div>
                                <div style={s.formGroup}>
                                    <label style={s.inputLabel}>Diagnosis</label>
                                    <input type="text" style={s.inputField} placeholder="Confirmed diagnosis..." value={consultationRecords.diagnosis} onChange={e => setConsultationRecords({...consultationRecords, diagnosis: e.target.value})} />
                                </div>
                                <div style={s.formGroup}>
                                    <label style={s.inputLabel}>Treatment Plan</label>
                                    <textarea style={s.textAreaField} placeholder="Plan moving forward..." value={consultationRecords.treatment} onChange={e => setConsultationRecords({...consultationRecords, treatment: e.target.value})} />
                                </div>
                            </div>
                        ) : (
                            <div style={{display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, paddingTop: '20px'}}>
                                <div style={{fontSize: '13px', color: '#64748b'}}>Select an order type:</div>
                                <button style={{...s.actionButton, padding: '16px', backgroundColor: '#4361ee', color: 'white', justifyContent: 'center', fontSize: '14px'}} onClick={() => setShowMedicationModal(true)}>
                                    <Pill size={18} /> Prescribe Medication
                                </button>
                                <button style={{...s.actionButton, padding: '16px', backgroundColor: '#02505F', color: 'white', justifyContent: 'center', fontSize: '14px'}} onClick={() => setShowScanOrderModal(true)}>
                                    <Activity size={18} /> Order New Scan
                                </button>
                            </div>
                        )}
                        
                        {tab === 'records' && (
                            <button style={{...s.actionButton, backgroundColor: '#1e293b', color: 'white', marginTop: 'auto', padding: '12px', justifyContent: 'center'}}>
                                Save Records & End Visit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
export default function DoctorDashboard() {
    const [activeTab, setActiveTab] = useState('home');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [appointments, setAppointments] = useState([]);
    const doctorName = "Maya";

    // Modals State
    const [showReportModal, setShowReportModal] = useState(false);
    const [showMedicationModal, setShowMedicationModal] = useState(false);
    const [showScanOrderModal, setShowScanOrderModal] = useState(false);
    
    const [selectedScan, setSelectedScan] = useState(null); 
    const [reportText, setReportText] = useState('');
    
    const [consultationRecords, setConsultationRecords] = useState({
        complaint: '', diagnosis: '', treatment: '', physicalExam: ''
    });

    useEffect(() => {
        const fetchAppointments = async () => {
          try {
            const token = localStorage.getItem("token");
            const response = await fetch(
              "http://127.0.0.1:5000/api/doctor/appointments",
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const data = await response.json();
            const formattedAppointments = data.map((appt) => {        
              return {
                id: appt.appointment_id,
                date: appt.date,
                time: appt.atime,
                patientName: `Patient #${appt.patient_id}`,
                reason: appt.reason,
                notes: appt.notes,
                status: appt.status?? "scheduled",              };
            });
            console.log(`formattedAppointments: ${JSON.stringify(formattedAppointments)}`);
            setAppointments(formattedAppointments);
          } catch (error) {
            console.error("Error fetching appointments:", error);
          }
        };
        fetchAppointments();
      }, []);

    const [profileData, setProfileData] = useState({
        fullName: 'Dr. Maya Johnson',
        licenseNumber: 'MD-12345-2020',
        professionalTitle: 'Orthopedic Surgeon',
        // department: 'Orthopedics',
        staffId: 'STAFF-001',
        phone: '+1 (555) 123-4567',
        address: '123 Medical Center Drive, Suite 100',
        password: '',
        newPassword: '',
        confirmPassword: '',
        profilePhoto: null,
        digitalSignature: null,
        email: 'mayaJohnson@ortholink.com',
        username: 'mayajohnson23'
    });

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
        const patient = allPatientsData.find(p => p.patientName === patientName);
        if (patient) {
            setSelectedPatient(patient);
            setActiveTab('profile');
        }
    };

    const handleBackToHome = () => {
        setSelectedPatient(null);
        setActiveTab('home');
    };

    // --- MAIN RENDER ---
    return (
        <div style={s.container}>
            <style>
                {` ::-webkit-scrollbar { width: 6px; height: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; } ::-webkit-scrollbar-thumb:hover { background: #94a3b8; } `}
            </style>

            <header style={s.header}>
                <div style={s.headerLogo}>
                    <div style={s.headerLogoIcon}>O</div>
                    <span style={s.headerLogoText}>Ortholink</span>
                </div>
            </header>

            <div style={s.mainWrapper}>
                <div style={s.sidebar}>
                    <nav style={s.nav}>
                        <button 
                            style={{...s.navItem, ...(activeTab === 'home' ? s.navItemActive : {})}} 
                            onClick={() => {setActiveTab('home'); setSelectedPatient(null);}}
                            onMouseEnter={(e) => {if (activeTab !== 'home') e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';}}
                            onMouseLeave={(e) => {if (activeTab !== 'home') e.currentTarget.style.backgroundColor = 'transparent';}}
                        >
                            <Home size={20} /> <span>Home</span>
                        </button>
                        
                        <button 
                            style={{...s.navItem, ...(activeTab === 'patients' ? s.navItemActive : {})}} 
                            onClick={() => {setActiveTab('patients'); setSelectedPatient(null);}}
                            onMouseEnter={(e) => {if (activeTab !== 'patients') e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';}}
                            onMouseLeave={(e) => {if (activeTab !== 'patients') e.currentTarget.style.backgroundColor = 'transparent';}}
                        >
                            <Users size={20} /> <span>Patients</span>
                        </button>

                        <button 
                            style={{...s.navItem, ...(activeTab === 'profile-settings' ? s.navItemActive : {})}} 
                            onClick={() => {setActiveTab('profile-settings'); setSelectedPatient(null);}}
                            onMouseEnter={(e) => {if (activeTab !== 'profile-settings') e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';}}
                            onMouseLeave={(e) => {if (activeTab !== 'profile-settings') e.currentTarget.style.backgroundColor = 'transparent';}}
                        >
                            <User size={20} /> <span>Profile</span>
                        </button>
                        
                        <button 
                            style={s.logout}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <LogOut size={20} /> <span>Logout</span>
                        </button>
                    </nav>

                    <div style={s.sidebarFooter}>
                        <div style={s.profilePic}>{doctorName.charAt(0)}</div>
                        <div style={s.profileName}>Dr. {doctorName}</div>
                    </div>
                </div>

                {/* ROUTING LOGIC - Now passing Props to external components */}
                {selectedPatient ? (
                    <ProfileView 
                        selectedPatient={selectedPatient}
                        handleBackToHome={handleBackToHome}
                        consultationRecords={consultationRecords}
                        setConsultationRecords={setConsultationRecords}
                        setShowMedicationModal={setShowMedicationModal}
                        setShowScanOrderModal={setShowScanOrderModal}
                        handleOpenReport={handleOpenReport}
                        patientScansHistory={patientScansHistory}
                    />
                ) : activeTab === 'patients' ? (
                    <PatientsListView 
                        allPatientsData={allPatientsData}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        handlePatientClick={handlePatientClick}
                    />
                ) : activeTab === 'profile-settings' ? (
                    <ProfileSettingsView 
                        profileData={profileData}
                        setProfileData={setProfileData}
                        doctorName={doctorName}
                    />
                ) : (
                    <DashboardView 
                        doctorName={doctorName}
                        appointments={appointments}
                        pendingScans={pendingScans}
                        handlePatientClick={handlePatientClick}
                        handleOpenReport={handleOpenReport}
                    />
                )}
            </div>

            {/* MODALS - Passed via Props */}
            <RenderReportModal 
                show={showReportModal} 
                onClose={() => setShowReportModal(false)}
                scan={selectedScan}
                reportText={reportText}
                setReportText={setReportText}
                onSubmit={handleSubmitReport}
            />
            <RenderMedicationModal 
                show={showMedicationModal} 
                onClose={() => setShowMedicationModal(false)} 
            />
            <RenderScanOrderModal 
                show={showScanOrderModal} 
                onClose={() => setShowScanOrderModal(false)} 
            />
        </div>
    );
}