import React, { useState, useEffect } from 'react';

// Import styles
import { sharedStyles as s } from '../styles/sharedStyles';
import { patientProfileStyles as pps } from '../styles/patientProfileStyles';
import { doctorProfileStyles as dps } from '../styles/doctorProfileStyles';
import welcomeDocImage from '../assets/welcome-doc.svg';
import myPatientsImage from '../assets/welcome_my_patients.svg';

import { 
    Home, Users, User, LogOut, Eye, Activity, 
    ArrowLeft, Calendar, FileText, Pill, 
    Thermometer, Heart, ClipboardList, X, Search, EyeOff
} from 'lucide-react';

// Fallback image for scan thumbnails
const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNFMkU4RjAiLz48cGF0aCBkPSJNNTAuMDAwMSA0NS43NDE2QzQ3Ljc3NiA0NS43NDE2IDQ1Ljk4MzMgNDMuOTQ5IDQ1Ljk4MzMgNDEuNzI0OUM0NS45ODMzIDM5LjUwMDggNDcuNzc2IDM3LjcwODEgNTAuMDAwMSAzNy43MDgxQzUyLjIyNDIgMzcuNzA4MSA1NC4wMTcgMzkuNTAwOCA1NC4wMTcgNDEuNzI0OUM1NC4wMTcgNDMuOTQ5IDUyLjIyNDIgNDUuNzQxNiA1MC4wMDAxIDQ1Ljc0MTZaTTU1LjE2NyA1Ni4yNTAySDQ0LjgzMzVWNTIuNTAwMkg1NS4xNjdWNTYuMjUwMlpNNTcuNSA0OS41ODM1VjU3LjUwMDJINDIuNVY0OS41ODM1QzQyLjUgNDcuNTgzNSA0NC4xNjcgNDUuOTE2OCA0Ni4xNjcgNDUuOTE2OEg1My44MzM0QzU1LjgzMzQgNDUuOTE2OCA1Ny41IDQ3LjU4MzUgNTcuNSA0OS41ODM1WiIgZmlsbD0iIzk0QTNCOCIvPjwvc3ZnPg==';

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

const pendingScansMock = [
    { 
        id: 1, 
        scanId: 'SCN-1042',
        scanType: 'MRI', 
        bodyPart: 'Lumbar Spine',
        modality: 'MRI', 
        date: '23 Feb 2024', 
        time: '09:30 AM',
        radiologist: 'Dr. Sarah Smith',
        status: 'Pending', 
        patientName: 'Robert Wilson', 
        patientId: 'P-104', 
        age: 52, gender: 'Male', 
        recordId: 'REC-001', 
        scanImage: FALLBACK_IMAGE,
    },
    { 
        id: 2, 
        scanId: 'SCN-1043',
        scanType: 'X-Ray', 
        bodyPart: 'Right Wrist',
        modality: 'X-Ray', 
        date: '23 Feb 2024', 
        time: '10:15 AM',
        radiologist: 'Dr. James Chen',
        status: 'Pending', 
        patientName: 'Lisa Anderson', 
        patientId: 'P-105', 
        age: 61, gender: 'Female', 
        recordId: 'REC-002', 
        scanImage: FALLBACK_IMAGE 
    },
    { 
        id: 3, 
        scanId: 'SCN-1044',
        scanType: 'CT Scan', 
        bodyPart: 'Left Knee',
        modality: 'CT', 
        date: '22 Feb 2024', 
        time: '02:45 PM',
        radiologist: 'Dr. Emily White',
        status: 'Pending', 
        patientName: 'Michael Brown', 
        patientId: 'P-102', 
        age: 28, gender: 'Male', 
        recordId: 'REC-003', 
        scanImage: FALLBACK_IMAGE 
    },
     { 
        id: 4, 
        scanId: 'SCN-1045',
        scanType: 'MRI', 
        bodyPart: 'Cervical Spine',
        modality: 'MRI', 
        date: '22 Feb 2024', 
        time: '04:00 PM',
        radiologist: 'Dr. Sarah Smith',
        status: 'Pending', 
        patientName: 'Emily Davis', 
        patientId: 'P-103', 
        age: 22, gender: 'Female', 
        recordId: 'REC-004', 
        scanImage: FALLBACK_IMAGE 
    },
];

const patientScansHistory = [
    { 
        id: 101, name: 'MRI Right Shoulder', modality: 'MRI', date: '10 Jan 2024', status: 'Report Ready', 
        recordId: 'REC-885', patientId: 'P-101',
        image: 'shoulder_mri.jpg', report: 'Full thickness tear...', radiologist: 'Dr. Sarah Smith', 
    },
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

// [DoctorDashboard.jsx]
const RenderReportModal = ({ show, onClose, scan, reportText, setReportText, onSubmit }) => {
    if (!show) return null;

    // Download Function
    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([`REPORT FOR: ${scan?.patientName}\nID: ${scan?.patientId}\n\nFINDINGS:\n${reportText}`], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `Report_${scan?.patientName}_${scan?.date}.txt`;
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div style={s.modalOverlay} onClick={onClose}>
            <div style={{...s.modalBox, width: '700px'}} onClick={(e) => e.stopPropagation()}>
                
                <div style={s.modalHeader}>
                    <h3 style={s.sectionTitle}>Scan Report Details</h3>
                    <button onClick={onClose} style={{background:'none', border:'none', cursor:'pointer'}}><X size={20}/></button>
                </div>
                
                <div style={s.modalBody}>
                    {/* Patient Info Grid */}
                    <div style={{
                        backgroundColor: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #bbf7d0',
                        marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '13px'
                    }}>
                        <div><div style={s.infoLabel}>Patient Name</div><div style={{fontWeight:'600', color:'#1e293b'}}>{scan?.patientName}</div></div>
                        <div><div style={s.infoLabel}>Patient ID</div><div style={{fontWeight:'600', color:'#1e293b'}}>{scan?.patientId}</div></div>
                        <div><div style={s.infoLabel}>Age / Gender</div><div style={{fontWeight:'600', color:'#1e293b'}}>{scan?.age} / {scan?.gender}</div></div>
                        <div><div style={s.infoLabel}>Scan Type</div><div style={{fontWeight:'600', color:'#1e293b'}}>{scan?.scanType || scan?.name}</div></div>
                        <div><div style={s.infoLabel}>Record ID</div><div style={{fontWeight:'600', color:'#1e293b'}}>{scan?.recordId || 'N/A'}</div></div>
                        <div><div style={s.infoLabel}>Radiologist</div><div style={{fontWeight:'600', color:'#1e293b'}}>{scan?.radiologist || 'N/A'}</div></div>
                    </div>

                    {/* Scan Image */}
                    <div style={{height: '250px', backgroundColor: '#000', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                         <img 
                             src={scan?.image || scan?.scanImage || FALLBACK_IMAGE} 
                             alt="Scan" 
                             style={{maxHeight: '100%', maxWidth: '100%', objectFit: 'contain'}}
                             onError={(e) => {
                                 e.target.src = FALLBACK_IMAGE;
                             }}
                         />
                    </div>
                    
                    {/* Report Text & Download */}
                    <div>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            <div style={s.inputLabel}>Doctor's Findings & Notes</div>
                            {(scan?.isReadOnly || reportText) && (
                                <button onClick={handleDownload} style={{fontSize:'12px', color:'#059669', background:'none', border:'none', cursor:'pointer', fontWeight:'600', textDecoration:'underline'}}>
                                    Download Report
                                </button>
                            )}
                        </div>

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
                        <button style={{...s.actionButton, backgroundColor: '#059669', color: 'white'}} onClick={onSubmit}>Submit Report</button>
                    </div>
                )}
            </div>
        </div>
    );
};
const RenderMedicationModal = ({ show, onClose, selectedPatient, onPrescribeSuccess }) => {
    const [medicationData, setMedicationData] = useState({
        medication_name: '',
        dosage: '',
        frequency: 'Once Daily',
        duration: '',
        instructions: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        is_active: true,
        record_id: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (show) {
            setMedicationData({
                medication_name: '',
                dosage: '',
                frequency: 'Once Daily',
                duration: '',
                instructions: '',
                start_date: new Date().toISOString().split('T')[0],
                end_date: '',
                is_active: true,
                record_id: null
            });
        }
    }, [show]);

    // Common medication options
    const commonMedications = [
        'Naproxen',
        'Ibuprofen',
        'Acetaminophen',
        'Diclofenac',
        'Celecoxib',
        'Tramadol',
        'Codeine',
        'Morphine',
        'Gabapentin',
        'Pregabalin',
        'Cyclobenzaprine',
        'Methocarbamol',
        'Prednisone',
        'Methylprednisolone'
    ];

    const frequencyOptions = [
        'Once Daily',
        'Twice Daily',
        'Three Times Daily',
        'Four Times Daily',
        'Every 6 Hours',
        'Every 8 Hours',
        'Every 12 Hours',
        'As Needed',
        'At Bedtime',
        'With Meals'
    ];

    const handlePrescribe = async () => {
        if (!selectedPatient || !selectedPatient.id) {
            alert('No patient selected');
            return;
        }

        // Validate required fields
        if (!medicationData.medication_name.trim()) {
            alert('Medication name is required');
            return;
        }
        
        if (!medicationData.dosage.trim()) {
            alert('Dosage is required');
            return;
        }

        setIsSubmitting(true);
        const token = localStorage.getItem("token");
        
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/doctor/patient/${selectedPatient.id}/medication`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(medicationData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert(`Medication prescribed successfully!`);
                
                // Reset form
                setMedicationData({
                    medication_name: '',
                    dosage: '',
                    frequency: 'Once Daily',
                    duration: '',
                    instructions: '',
                    start_date: new Date().toISOString().split('T')[0],
                    end_date: '',
                    is_active: true,
                    record_id: null
                });
                
                if (onPrescribeSuccess) onPrescribeSuccess();
                onClose();
            } else {
                alert(data.error || 'Failed to prescribe medication');
            }
        } catch (error) {
            console.error('Error prescribing medication:', error);
            alert('Error prescribing medication. Please check your connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCalculateEndDate = () => {
        if (medicationData.start_date && medicationData.duration) {
            const startDate = new Date(medicationData.start_date);
            const duration = parseInt(medicationData.duration);
            
            if (!isNaN(duration)) {
                const endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + duration);
                
                setMedicationData({
                    ...medicationData,
                    end_date: endDate.toISOString().split('T')[0]
                });
            }
        }
    };

    if (!show) return null;

    return (
        <div style={s.modalOverlay} onClick={onClose}>
            <div style={{...s.modalBox, width: '500px'}} onClick={e => e.stopPropagation()}>
                <div style={s.modalHeader}>
                    <h3 style={s.sectionTitle}>Prescribe Medication</h3>
                    <button 
                        onClick={onClose} 
                        style={{background:'none', border:'none', cursor:'pointer'}}
                        disabled={isSubmitting}
                    >
                        <X size={20}/>
                    </button>
                </div>
                
                <div style={s.modalBody}>
                    {/* Patient Info */}
                    {selectedPatient && (
                        <div style={{
                            backgroundColor: '#eff6ff',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #bfdbfe',
                            marginBottom: '20px',
                            fontSize: '13px'
                        }}>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                                <div><span style={s.infoLabel}>Patient:</span> {selectedPatient.patientName}</div>
                                <div><span style={s.infoLabel}>ID:</span> P-{selectedPatient.id}</div>
                            </div>
                            <div><span style={s.infoLabel}>Allergies:</span> {selectedPatient.allergies || 'None'}</div>
                        </div>
                    )}

                    {/* Medication Name */}
                    <div style={s.formGroup}>
                        <label style={s.inputLabel}>
                            Medication Name <span style={{color: '#ef4444'}}>*</span>
                        </label>
                        <div style={{position: 'relative'}}>
                            <input 
                                type="text" 
                                list="medication-list"
                                style={s.inputField} 
                                placeholder="e.g. Naproxen"
                                value={medicationData.medication_name}
                                onChange={(e) => setMedicationData({...medicationData, medication_name: e.target.value})}
                                disabled={isSubmitting}
                            />
                            <datalist id="medication-list">
                                {commonMedications.map(med => (
                                    <option key={med} value={med} />
                                ))}
                            </datalist>
                        </div>
                    </div>

                    {/* Dosage and Frequency */}
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px'}}>
                        <div style={s.formGroup}>
                            <label style={s.inputLabel}>
                                Dosage <span style={{color: '#ef4444'}}>*</span>
                            </label>
                            <input 
                                type="text" 
                                style={s.inputField} 
                                placeholder="e.g. 500mg"
                                value={medicationData.dosage}
                                onChange={(e) => setMedicationData({...medicationData, dosage: e.target.value})}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div style={s.formGroup}>
                            <label style={s.inputLabel}>
                                Frequency <span style={{color: '#ef4444'}}>*</span>
                            </label>
                            <select 
                                style={s.inputField}
                                value={medicationData.frequency}
                                onChange={(e) => setMedicationData({...medicationData, frequency: e.target.value})}
                                disabled={isSubmitting}
                            >
                                {frequencyOptions.map(freq => (
                                    <option key={freq} value={freq}>{freq}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Duration */}
                    <div style={{...s.formGroup, marginTop: '12px'}}>
                        <label style={s.inputLabel}>Duration (Days)</label>
                        <input 
                            type="text" 
                            style={s.inputField} 
                            placeholder="e.g. 14 Days"
                            value={medicationData.duration}
                            onChange={(e) => setMedicationData({...medicationData, duration: e.target.value})}
                            onBlur={handleCalculateEndDate}
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Start Date */}
                    <div style={{...s.formGroup, marginTop: '12px'}}>
                        <label style={s.inputLabel}>Start Date</label>
                        <input 
                            type="date" 
                            style={s.inputField} 
                            value={medicationData.start_date}
                            onChange={(e) => setMedicationData({...medicationData, start_date: e.target.value})}
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* End Date (auto-calculated) */}
                    {medicationData.end_date && (
                        <div style={{...s.formGroup, marginTop: '12px'}}>
                            <label style={s.inputLabel}>End Date (Calculated)</label>
                            <input 
                                type="date" 
                                style={s.inputField} 
                                value={medicationData.end_date}
                                onChange={(e) => setMedicationData({...medicationData, end_date: e.target.value})}
                                disabled={isSubmitting}
                            />
                        </div>
                    )}

                    {/* Instructions */}
                    <div style={{...s.formGroup, marginTop: '12px'}}>
                        <label style={s.inputLabel}>Instructions</label>
                        <textarea 
                            style={s.textAreaField} 
                            placeholder="Special instructions for the patient..."
                            value={medicationData.instructions}
                            onChange={(e) => setMedicationData({...medicationData, instructions: e.target.value})}
                            disabled={isSubmitting}
                            rows={3}
                        />
                    </div>
                </div>

                <div style={s.modalFooter}>
                    <button 
                        style={{...s.actionButton, backgroundColor: '#f1f5f9', color: '#64748b'}} 
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button 
                        style={{
                            ...s.actionButton, 
                            backgroundColor: '#4361ee', 
                            color: 'white',
                            opacity: isSubmitting ? 0.7 : 1,
                            cursor: isSubmitting ? 'not-allowed' : 'pointer'
                        }} 
                        onClick={handlePrescribe}
                        disabled={isSubmitting || !medicationData.medication_name || !medicationData.dosage}
                    >
                        {isSubmitting ? 'Prescribing...' : 'Prescribe Medication'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const RenderScanOrderModal = ({ show, onClose, selectedPatient, onOrderSuccess }) => {
    const [scanData, setScanData] = useState({
        scan_type: '',
        body_part: '',
        modality: 'X-Ray',
        description: '',
        record_id: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (show) {
            setScanData({
                scan_type: '',
                body_part: '',
                modality: 'X-Ray',
                description: '',
                record_id: null
            });
        }
    }, [show]);

    // Common scan types and body parts
    const scanTypeOptions = [
        'MRI',
        'CT Scan',
        'X-Ray',
        'Ultrasound',
        'DXA (Bone Density)',
        'PET Scan'
    ];

    const bodyPartOptions = [
        'Head',
        'Cervical Spine',
        'Thoracic Spine',
        'Lumbar Spine',
        'Shoulder',
        'Elbow',
        'Wrist',
        'Hand',
        'Hip',
        'Knee',
        'Ankle',
        'Foot',
        'Chest',
        'Abdomen',
        'Pelvis'
    ];

    const modalityOptions = [
        'X-Ray',
        'MRI',
        'CT',
        'Ultrasound',
        'DXA'
    ];

    const handleOrderScan = async () => {
        if (!selectedPatient || !selectedPatient.id) {
            alert('No patient selected');
            return;
        }

        // Validate required fields
        if (!scanData.scan_type.trim()) {
            alert('Scan type is required');
            return;
        }
        
        if (!scanData.body_part.trim()) {
            alert('Body part is required');
            return;
        }

        setIsSubmitting(true);
        const token = localStorage.getItem("token");
        
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/doctor/patient/${selectedPatient.id}/scan`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(scanData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert(`Scan ordered successfully!`);
                
                // Reset form
                setScanData({
                    scan_type: '',
                    body_part: '',
                    modality: 'X-Ray',
                    description: '',
                    record_id: null
                });
                
                if (onOrderSuccess) onOrderSuccess();
                onClose();
            } else {
                alert(data.error || 'Failed to order scan');
            }
        } catch (error) {
            console.error('Error ordering scan:', error);
            alert('Error ordering scan. Please check your connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!show) return null;

    return (
        <div style={s.modalOverlay} onClick={onClose}>
            <div style={{...s.modalBox, width: '500px'}} onClick={e => e.stopPropagation()}>
                <div style={s.modalHeader}>
                    <h3 style={s.sectionTitle}>Order New Scan</h3>
                    <button 
                        onClick={onClose} 
                        style={{background:'none', border:'none', cursor:'pointer'}}
                        disabled={isSubmitting}
                    >
                        <X size={20}/>
                    </button>
                </div>
                
                <div style={s.modalBody}>
                    {/* Patient Info */}
                    {selectedPatient && (
                        <div style={{
                            backgroundColor: '#f0fdf4',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #bbf7d0',
                            marginBottom: '20px',
                            fontSize: '13px'
                        }}>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                                <div><span style={s.infoLabel}>Patient:</span> {selectedPatient.patientName}</div>
                                <div><span style={s.infoLabel}>ID:</span> P-{selectedPatient.id}</div>
                            </div>
                            <div><span style={s.infoLabel}>Current Diagnosis:</span> {selectedPatient.diagnosis || 'Not specified'}</div>
                        </div>
                    )}

                    {/* Scan Type */}
                    <div style={s.formGroup}>
                        <label style={s.inputLabel}>
                            Scan Type <span style={{color: '#ef4444'}}>*</span>
                        </label>
                        <div style={{position: 'relative'}}>
                            <input 
                                type="text" 
                                list="scan-type-list"
                                style={s.inputField} 
                                placeholder="e.g. MRI Left Knee"
                                value={scanData.scan_type}
                                onChange={(e) => setScanData({...scanData, scan_type: e.target.value})}
                                disabled={isSubmitting}
                            />
                            <datalist id="scan-type-list">
                                {scanTypeOptions.map(type => (
                                    <option key={type} value={type} />
                                ))}
                            </datalist>
                        </div>
                    </div>

                    {/* Body Part */}
                    <div style={s.formGroup}>
                        <label style={s.inputLabel}>
                            Body Part <span style={{color: '#ef4444'}}>*</span>
                        </label>
                        <div style={{position: 'relative'}}>
                            <input 
                                type="text" 
                                list="body-part-list"
                                style={s.inputField} 
                                placeholder="e.g. Knee"
                                value={scanData.body_part}
                                onChange={(e) => setScanData({...scanData, body_part: e.target.value})}
                                disabled={isSubmitting}
                            />
                            <datalist id="body-part-list">
                                {bodyPartOptions.map(part => (
                                    <option key={part} value={part} />
                                ))}
                            </datalist>
                        </div>
                    </div>

                    {/* Modality */}
                    <div style={{...s.formGroup, marginTop: '12px'}}>
                        <label style={s.inputLabel}>
                            Modality <span style={{color: '#ef4444'}}>*</span>
                        </label>
                        <select 
                            style={s.inputField}
                            value={scanData.modality}
                            onChange={(e) => setScanData({...scanData, modality: e.target.value})}
                            disabled={isSubmitting}
                        >
                            {modalityOptions.map(modality => (
                                <option key={modality} value={modality}>{modality}</option>
                            ))}
                        </select>
                    </div>

                    {/* Reason / Description */}
                    <div style={{...s.formGroup, marginTop: '12px'}}>
                        <label style={s.inputLabel}>Reason / Description</label>
                        <textarea 
                            style={s.textAreaField} 
                            placeholder="Suspected meniscus tear..."
                            value={scanData.description}
                            onChange={(e) => setScanData({...scanData, description: e.target.value})}
                            disabled={isSubmitting}
                            rows={3}
                        />
                    </div>
                </div>

                <div style={s.modalFooter}>
                    <button 
                        style={{...s.actionButton, backgroundColor: '#f1f5f9', color: '#64748b'}} 
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button 
                        style={{
                            ...s.actionButton, 
                            backgroundColor: '#059669', 
                            color: 'white',
                            opacity: isSubmitting ? 0.7 : 1,
                            cursor: isSubmitting ? 'not-allowed' : 'pointer'
                        }} 
                        onClick={handleOrderScan}
                        disabled={isSubmitting || !scanData.scan_type || !scanData.body_part}
                    >
                        {isSubmitting ? 'Ordering...' : 'Order Scan'}
                    </button>
                </div>
            </div>
        </div>
    );
};
const DashboardView = ({ doctorName, appointments, handlePatientClick, pendingScans, handleOpenReport }) => {
    const [apptSearch, setApptSearch] = useState('');
    const [scanSearch, setScanSearch] = useState('');

    const filteredAppointments = (appointments || []).filter(apt => {
        if (!apptSearch) return true;
        const term = apptSearch.toLowerCase();
        const combined = `
            ${apt.date || ''} 
            ${apt.time || ''} 
            ${(apt.patientName || '').toLowerCase()} 
            ${(apt.reason || '').toLowerCase()} 
            ${(apt.notes || '').toLowerCase()} 
            ${(apt.status || '').toLowerCase()}
        `;
        return combined.includes(term);
    });

    const filteredScans = (pendingScans || []).filter(scan => {
        if (!scanSearch) return true;
        const term = scanSearch.toLowerCase();
        const combined = `
            ${(scan.scanId || '').toLowerCase()}
            ${(scan.scanType || '').toLowerCase()} 
            ${(scan.bodyPart || '').toLowerCase()}
            ${(scan.modality || '').toLowerCase()} 
            ${(scan.patientName || '').toLowerCase()} 
            ${(scan.radiologist || '').toLowerCase()}
            ${scan.date || ''}
            ${scan.time || ''}
        `;
        return combined.includes(term);
    });

    const remainingCount = (appointments || []).filter(a => a.status === 'scheduled').length;

    const compactSearchStyle = {
        padding: '8px 12px 8px 36px',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        fontSize: '13px',
        width: '250px',
        outline: 'none',
        backgroundColor: '#f8fafc'
    };

    const expandedScanGrid = {
        gridTemplateColumns: '60px 0.9fr 1fr 0.8fr 1.2fr 1.1fr 1.1fr 120px'
    };
    
    const handleOpenDicomViewer = (scan) => {
        const patientData = {
            id: scan.patientId,
            name: scan.patientName,
            age: scan.age,
            gender: scan.gender,
            scanType: scan.scanType,
            bodyPart: scan.bodyPart
        };
        
        localStorage.setItem('selectedPatientForDicom', JSON.stringify(patientData));
        window.location.href = `/dicom-viewer?patientId=${scan.patientId}`;
    };
    
    return (
        <div style={{ ...s.main, overflowY: 'auto' }}>
            <section style={{ ...dps.welcomeBanner, flexShrink: 0 }}>
                <div style={dps.decorativeCircle1}></div>
                <div style={dps.decorativeCircle2}></div>
                <div style={dps.welcomeTextBox}>
                    <h1 style={dps.welcomeTitle}>Hello, Dr. {doctorName || 'Doctor'}!</h1>
                    <p style={dps.welcomeSubText}>
                        You have <span style={dps.welcomeHighlight}>{remainingCount} patients remaining</span> today. 
                        Let's clear the queue!
                    </p>
                </div>
                <img src={welcomeDocImage} alt="Doctor" style={dps.welcomeIllustration} />
            </section>

            <div style={{ ...s.contentContainer, minHeight: 'fit-content' }}>
                {/* --- TABLE 1: APPOINTMENTS --- */}
                <div style={{ ...s.section, flex: 'none', height: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
                        <h2 style={s.sectionTitle}>Today's Appointments</h2>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input type="text" placeholder="Search appointments..." style={compactSearchStyle} value={apptSearch} onChange={(e) => setApptSearch(e.target.value)} />
                        </div>
                    </div>

                    <div style={s.tableContainer}>
                        <div style={{ ...s.tableHeader, ...s.appointmentGrid }}>
                            <div>Date</div><div>Time</div><div>Patient</div><div>Reason</div><div>Notes</div><div>Status</div>
                        </div>
                        
                        <div style={{ ...s.scrollableRows, height: '100px', minHeight: '100px', overflowY: 'auto' }}>
                            {filteredAppointments.length > 0 ? (
                                filteredAppointments.map((apt) => (
                                    <div key={apt.id} style={{ ...s.tableRow, ...s.appointmentGrid }}>
                                        <div>{apt.date}</div>
                                        <div>{apt.time}</div>
                                        <div><button style={s.clickablePatientName} onClick={() => handlePatientClick(apt.patientName)}>{apt.patientName}</button></div>
                                        <div>{apt.reason}</div>
                                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#64748b' }}>{apt.notes || '-'}</div>
                                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#64748b' }}>{apt.status}</div>
                                    </div>
                                ))
                            ) : (
                                <div style={{padding: '40px', textAlign: 'center', color: '#94a3b8'}}>No appointments found.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- TABLE 2: PENDING SCANS --- */}
                <div style={{ ...s.section, flex: 'none', height: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
                        <h2 style={s.sectionTitle}>Pending Scan Reports</h2>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input type="text" placeholder="Search scans..." style={compactSearchStyle} value={scanSearch} onChange={(e) => setScanSearch(e.target.value)} />
                        </div>
                    </div>

                    <div style={s.tableContainer}>
                        <div style={{ ...s.tableHeader, ...expandedScanGrid }}>
                            <div>Scan</div>
                            <div>Scan ID</div>
                            <div>Body Part</div>
                            <div>Type</div>
                            <div>Patient</div>
                            <div>Date/Time</div>
                            <div>Radiologist</div>
                            <div>Action</div>
                        </div>
                        
                        <div style={{ ...s.scrollableRows, height: '100px', minHeight: '100px', overflowY: 'auto' }}>
                            {filteredScans.length > 0 ? (
                                filteredScans.map((scan) => (
                                    <div key={scan.id} style={{ ...s.tableRow, ...expandedScanGrid }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '6px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
                                            <img 
                                                src={scan.scanImage} 
                                                alt="scan" 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={(e) => {
                                                    e.target.src = FALLBACK_IMAGE;
                                                }}
                                            />
                                        </div>
                                        <div style={{ fontWeight: '600', color: '#475569' }}>{scan.scanId}</div>
                                        <div style={{ color: '#334155' }}>{scan.bodyPart}</div>
                                        <div><span style={{ fontSize: '11px', fontWeight: '700', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', color: '#475569' }}>{scan.scanType}</span></div>
                                        <div><button style={s.clickablePatientName} onClick={() => handlePatientClick(scan.patientName)}>{scan.patientName}</button></div>
                                        <div style={{ fontSize: '12px' }}>
                                            <div style={{ fontWeight: '500' }}>{scan.date}</div>
                                            <div style={{ color: '#94a3b8' }}>{scan.time}</div>
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#02505F' }}>{scan.radiologist}</div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button style={s.actionButton} onClick={() => handleOpenReport(scan, false)}>
                                                <Eye size={14} /> View
                                            </button>
                                            <button 
                                                onClick={() => handleOpenDicomViewer(scan)}
                                                style={{
                                                    ...s.actionButton,
                                                    padding: '6px',
                                                    backgroundColor: '#8b5cf6',
                                                    color: 'white',
                                                    border: 'none'
                                                }}
                                                title="Open DICOM Viewer"
                                            >
                                                🩻
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{padding: '40px', textAlign: 'center', color: '#94a3b8'}}>No pending scans found.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
// In DoctorDashboard.jsx, update the ProfileView component
const ProfileView = ({ selectedPatient, handleBackToHome, consultationRecords, setConsultationRecords, setShowMedicationModal, setShowScanOrderModal, handleOpenReport, patientScansHistory }) => {
    const [tab, setTab] = useState('records');
    const [realPatientData, setRealPatientData] = useState(null);
    const [realPatientScans, setRealPatientScans] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch real patient data when component mounts or selectedPatient changes
    useEffect(() => {
        const fetchRealPatientData = async () => {
            if (!selectedPatient || !selectedPatient.id) return;
            
            setIsLoading(true);
            try {
                const token = localStorage.getItem("token");
                
                // Fetch patient details
                const patientResponse = await fetch(`http://127.0.0.1:5000/api/doctor/patient/${selectedPatient.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                if (patientResponse.ok) {
                    const patientData = await patientResponse.json();
                    setRealPatientData(patientData);
                    
                    // Set consultation records from the latest visit record if exists
                    if (patientData.visit_records && patientData.visit_records.length > 0) {
                        const latestRecord = patientData.visit_records[0];
                        setConsultationRecords({
                            complaint: latestRecord.chief_complaint || '',
                            diagnosis: latestRecord.diagnosis || '',
                            treatment: latestRecord.treatment_plan || '',
                            physicalExam: latestRecord.physical_examination || ''
                        });
                    }
                }
                
                // Fetch patient scans
                const scansResponse = await fetch(`http://127.0.0.1:5000/api/doctor/scans?patient_id=${selectedPatient.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                if (scansResponse.ok) {
                    const scansData = await scansResponse.json();
                    setRealPatientScans(scansData);
                }
                
            } catch (error) {
                console.error("Error fetching patient data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchRealPatientData();
    }, [selectedPatient]);

    const handleSaveVisitRecord = async () => {
        if (!selectedPatient || !selectedPatient.id) return;
        
        // Validate vital signs
        if (!consultationRecords.vitalSigns.heart_rate || 
            !consultationRecords.vitalSigns.blood_pressure || 
            !consultationRecords.vitalSigns.temperature || 
            !consultationRecords.vitalSigns.weight) {
            alert('Please fill in all required vital signs (Heart Rate, Blood Pressure, Temperature, Weight)');
            return;
        }
        
        const visitRecordData = {
            chief_complaint: consultationRecords.complaint,
            diagnosis: consultationRecords.diagnosis,
            treatment_plan: consultationRecords.treatment,
            physical_examination: consultationRecords.physicalExam,
            notes: consultationRecords.notes,
            vital_signs: {
                heart_rate: consultationRecords.vitalSigns.heart_rate,
                blood_pressure: consultationRecords.vitalSigns.blood_pressure,
                temperature: consultationRecords.vitalSigns.temperature,
                weight: consultationRecords.vitalSigns.weight,
                respiratory_rate: consultationRecords.vitalSigns.respiratory_rate,
                oxygen_saturation: consultationRecords.vitalSigns.oxygen_saturation
            }
        };
        
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://127.0.0.1:5000/api/doctor/patient/${selectedPatient.id}/visit-record`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(visitRecordData)
            });
            
            if (response.ok) {
                const data = await response.json();
                alert('Visit record saved successfully!');
                
                // Reset consultation form
                setConsultationRecords({
                    complaint: '',
                    diagnosis: '',
                    treatment: '',
                    physicalExam: '',
                    notes: '',
                    vitalSigns: {
                        heart_rate: '',
                        blood_pressure: '',
                        temperature: '',
                        weight: '',
                        respiratory_rate: '',
                        oxygen_saturation: ''
                    }
                });
                
                // Refresh patient data to show the new record
                if (realPatientData) {
                    const response = await fetch(`http://127.0.0.1:5000/api/doctor/patient/${selectedPatient.id}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    
                    if (response.ok) {
                        const updatedPatientData = await response.json();
                        setRealPatientData(updatedPatientData);
                    }
                }
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to save visit record');
            }
        } catch (error) {
            console.error('Error saving visit record:', error);
            alert('Error saving visit record');
        }
    };

    const handleOpenDicomViewer = (patient) => {
        const patientData = {
            id: patient.id,
            name: patient.patientName,
            patientId: `P-${patient.id}`,
            age: patient.age,
            gender: patient.gender,
            diagnosis: patient.diagnosis,
            bloodType: patient.bloodType
        };
        
        localStorage.setItem('selectedPatientForDicom', JSON.stringify(patientData));
        window.location.href = `/dicom-viewer?patientId=P-${patient.id}`;
    };

    // Display loading state
    if (isLoading) {
        return (
            <div style={s.main}>
                <button style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', cursor: 'pointer', fontSize: '14px', fontWeight: '600', border: 'none', background: 'none', marginBottom: '10px', width: 'fit-content'}} onClick={handleBackToHome}>
                    <ArrowLeft size={16} /> Back to Home
                </button>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'}}>
                    Loading patient data...
                </div>
            </div>
        );
    }

    // Use real patient data if available, otherwise fall back to mock data
    const displayPatient = realPatientData ? {
        patientName: realPatientData.patient_name,
        age: realPatientData.age,
        gender: realPatientData.gender,
        bloodType: realPatientData.blood_type,
        allergies: realPatientData.allergies,
        diagnosis: realPatientData.diagnosis || selectedPatient?.diagnosis,
        history: realPatientData.chronic_conditions ? realPatientData.chronic_conditions.split(',') : []
    } : selectedPatient;

    const lastVisitRecord = realPatientData?.visit_records?.[0] || selectedPatient?.lastVisit;
    
    const displayScans = realPatientScans.length > 0 ? realPatientScans.map(scan => ({
        id: scan.scan_id,
        name: `${scan.scan_type} ${scan.body_part}`,
        modality: scan.modality,
        date: scan.scan_date,
        status: scan.status,
        recordId: `REC-${scan.scan_id}`,
        patientId: `P-${scan.patient_id}`,
        image: scan.folder_path ? 
            `http://127.0.0.1:5000/uploads/dicom_scans/${scan.folder_path}/thumbnail.jpg` : 
            FALLBACK_IMAGE,
        report: scan.rad_report,
        radiologist: scan.radiologist,
        isReadOnly: scan.status === 'completed'
    })) : patientScansHistory;

    return (
        <div style={s.main}>
            <button style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', cursor: 'pointer', fontSize: '14px', fontWeight: '600', border: 'none', background: 'none', marginBottom: '10px', width: 'fit-content'}} onClick={handleBackToHome}>
                <ArrowLeft size={16} /> Back to Home
            </button>

            <div style={pps.profileContainer}>
                {/* LEFT COLUMN: Patient Info */}
                <div style={s.contentContainer}>
                    <div style={s.card}>
                        <div style={{alignSelf: 'center', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <User size={40} color="#64748b"/>
                        </div>
                        <h2 style={{fontSize: '20px', fontWeight: '700', color: '#1e293b', textAlign: 'center', margin: 0}}>
                            {displayPatient.patientName}
                        </h2>
                        
                        <div style={pps.patientInfoCentered}>
                            <div style={pps.infoGridCentered}>
                                <div style={pps.infoItemCentered}>
                                    <span style={s.infoLabel}>Age</span>
                                    <span style={s.infoValue}>{displayPatient.age || 'N/A'} Yrs</span>
                                </div>
                                <div style={pps.infoItemCentered}>
                                    <span style={s.infoLabel}>Gender</span>
                                    <span style={s.infoValue}>{displayPatient.gender || 'N/A'}</span>
                                </div>
                                <div style={pps.infoItemCentered}>
                                    <span style={s.infoLabel}>Blood</span>
                                    <span style={s.infoValue}>{displayPatient.bloodType || 'N/A'}</span>
                                </div>
                                <div style={pps.infoItemCentered}>
                                    <span style={s.infoLabel}>Allergies</span>
                                    <span style={{...s.infoValue, color: '#ef4444'}}>
                                        {displayPatient.allergies || 'None'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rest of the component remains similar but uses displayPatient */}
                    {/* ... */}
                </div>

                {/* MIDDLE COLUMN */}
                <div style={s.contentContainer}>
                    <div style={{...s.card, flex: 0.8, overflow: 'hidden'}}>
                        <div style={{fontSize: '16px', fontWeight: '700', color: '#02505F', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
                            <Calendar size={18} /> Last Visit ({lastVisitRecord?.date || 'N/A'})
                        </div>
                        
                        {lastVisitRecord ? (
                            <div style={s.formScroll}>
                                {/* Complaint */}
                                <div style={{marginBottom: '10px'}}>
                                    <span style={s.infoLabel}>Complaint</span>
                                    <div style={{fontSize: '14px', color: '#334155', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px', marginTop: '4px'}}>
                                        {lastVisitRecord.chief_complaint || lastVisitRecord.complaint || 'No complaint recorded'}
                                    </div>
                                </div>
                                
                                {/* Physical Examination */}
                                <div style={{marginBottom: '10px'}}>
                                    <span style={s.infoLabel}>Physical Examination</span>
                                    <div style={{fontSize: '14px', color: '#334155', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px', marginTop: '4px'}}>
                                        {lastVisitRecord.physical_examination || 'No physical examination recorded'}
                                    </div>
                                </div>
                                
                                {/* Diagnosis */}
                                <div style={{marginBottom: '10px'}}>
                                    <span style={s.infoLabel}>Diagnosis</span>
                                    <div style={{fontSize: '14px', color: '#334155', fontWeight: '500', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px', marginTop: '4px'}}>
                                        {lastVisitRecord.diagnosis || 'No diagnosis recorded'}
                                    </div>
                                </div>
                                
                                {/* Treatment Plan */}
                                <div style={{marginBottom: '10px'}}>
                                    <span style={s.infoLabel}>Treatment Plan</span>
                                    <div style={{fontSize: '14px', color: '#334155', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px', marginTop: '4px'}}>
                                        {lastVisitRecord.treatment_plan || lastVisitRecord.treatment || 'No treatment plan recorded'}
                                    </div>
                                </div>
                                
                                {/* Vital Signs Grid */}
                                {lastVisitRecord.vital_signs && (
                                    <div style={{marginBottom: '10px', marginTop: '15px'}}>
                                        <span style={s.infoLabel}>Vital Signs</span>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '10px',
                                            marginTop: '8px',
                                            backgroundColor: '#f8fafc',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            {/* Heart Rate */}
                                            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '6px',
                                                    backgroundColor: '#fee2e2',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <Heart size={16} color="#dc2626" />
                                                </div>
                                                <div>
                                                    <div style={{fontSize: '11px', color: '#64748b'}}>Heart Rate</div>
                                                    <div style={{fontSize: '14px', fontWeight: '600', color: '#1e293b'}}>
                                                        {lastVisitRecord.vital_signs.heart_rate || 'N/A'} bpm
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Blood Pressure */}
                                            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '6px',
                                                    backgroundColor: '#dbeafe',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <Activity size={16} color="#2563eb" />
                                                </div>
                                                <div>
                                                    <div style={{fontSize: '11px', color: '#64748b'}}>Blood Pressure</div>
                                                    <div style={{fontSize: '14px', fontWeight: '600', color: '#1e293b'}}>
                                                        {lastVisitRecord.vital_signs.blood_pressure || 'N/A'} mmHg
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Temperature */}
                                            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '6px',
                                                    backgroundColor: '#ffedd5',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <Thermometer size={16} color="#ea580c" />
                                                </div>
                                                <div>
                                                    <div style={{fontSize: '11px', color: '#64748b'}}>Temperature</div>
                                                    <div style={{fontSize: '14px', fontWeight: '600', color: '#1e293b'}}>
                                                        {lastVisitRecord.vital_signs.temperature || 'N/A'} °C
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Weight */}
                                            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '6px',
                                                    backgroundColor: '#f0f9ff',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <span style={{fontSize: '14px'}}>⚖️</span>
                                                </div>
                                                <div>
                                                    <div style={{fontSize: '11px', color: '#64748b'}}>Weight</div>
                                                    <div style={{fontSize: '14px', fontWeight: '600', color: '#1e293b'}}>
                                                        {lastVisitRecord.vital_signs.weight || 'N/A'} kg
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Respiratory Rate */}
                                            {lastVisitRecord.vital_signs.respiratory_rate && (
                                                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                                    <div style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '6px',
                                                        backgroundColor: '#f0fdf4',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <span style={{fontSize: '14px'}}>🌬️</span>
                                                    </div>
                                                    <div>
                                                        <div style={{fontSize: '11px', color: '#64748b'}}>Respiratory Rate</div>
                                                        <div style={{fontSize: '14px', fontWeight: '600', color: '#1e293b'}}>
                                                            {lastVisitRecord.vital_signs.respiratory_rate} breaths/min
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Oxygen Saturation */}
                                            {lastVisitRecord.vital_signs.oxygen_saturation && (
                                                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                                    <div style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '6px',
                                                        backgroundColor: '#fef2f2',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <span style={{fontSize: '14px'}}>🫁</span>
                                                    </div>
                                                    <div>
                                                        <div style={{fontSize: '11px', color: '#64748b'}}>O₂ Saturation</div>
                                                        <div style={{fontSize: '14px', fontWeight: '600', color: '#1e293b'}}>
                                                            {lastVisitRecord.vital_signs.oxygen_saturation}%
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Doctor's Notes */}
                                {lastVisitRecord.notes && (
                                    <div style={{marginBottom: '10px', marginTop: '15px'}}>
                                        <span style={s.infoLabel}>Doctor's Notes</span>
                                        <div style={{
                                            fontSize: '14px',
                                            color: '#334155',
                                            padding: '12px',
                                            backgroundColor: '#fefce8',
                                            borderRadius: '6px',
                                            marginTop: '4px',
                                            border: '1px solid #fef08a',
                                            whiteSpace: 'pre-wrap'
                                        }}>
                                            {lastVisitRecord.notes}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Prescribed Medications */}
                                {lastVisitRecord.medications && lastVisitRecord.medications.length > 0 && (
                                    <div style={{marginTop: '15px', borderTop: '1px solid #f1f5f9', paddingTop: '10px'}}>
                                        <span style={s.infoLabel}>Prescribed Medications</span>
                                        <div style={{marginTop: '8px'}}>
                                            {lastVisitRecord.medications.map((med, i) => (
                                                <div key={i} style={{
                                                    fontSize: '13px',
                                                    color: '#475569',
                                                    padding: '8px',
                                                    backgroundColor: '#f8fafc',
                                                    borderRadius: '6px',
                                                    marginBottom: '6px',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <div>
                                                        <span style={{fontWeight: '600', color: '#1e293b'}}>{med.name}</span>
                                                        <span style={{marginLeft: '8px', color: '#64748b'}}>({med.dosage})</span>
                                                    </div>
                                                    <span style={{color: '#059669', fontWeight: '500'}}>{med.freq}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{color: '#94a3b8', fontSize: '14px', padding: '20px', textAlign: 'center'}}>
                                No previous visit records found.
                            </div>
                        )}
                    </div>

                    <div style={{...s.card, flex: 1.2, padding: 0, overflow: 'hidden'}}>
                        <div style={{padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems:'center'}}>
                            <div style={{fontSize: '16px', fontWeight: '700', color: '#02505F', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <FileText size={18} /> Patient Scans
                            </div>
                            <button 
                                onClick={() => handleOpenDicomViewer(displayPatient)}
                                style={{
                                    ...s.actionButton,
                                    padding: '6px 12px',
                                    backgroundColor: '#8b5cf6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: '500'
                                }}
                                title="Open DICOM Viewer"
                            >
                                🩻 Open DICOM Viewer
                            </button>
                        </div>
                        <div style={s.scrollableRows}>
                            <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '13px'}}>
                                <thead>
                                    <tr>
                                        <th style={{textAlign: 'left', padding: '10px', color: '#64748b', borderBottom: '1px solid #e2e8f0', fontSize: '11px', textTransform: 'uppercase'}}>Scan Name</th>
                                        <th style={{textAlign: 'left', padding: '10px', color: '#64748b', borderBottom: '1px solid #e2e8f0', fontSize: '11px', textTransform: 'uppercase'}}>Modality</th>
                                        <th style={{textAlign: 'left', padding: '10px', color: '#64748b', borderBottom: '1px solid #e2e8f0', fontSize: '11px', textTransform: 'uppercase'}}>Action</th>
                                        <th style={{textAlign: 'left', padding: '10px', color: '#64748b', borderBottom: '1px solid #e2e8f0', fontSize: '11px', textTransform: 'uppercase'}}>Viewer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayScans.map(scan => (
                                        <tr key={scan.id}>
                                            <td style={{padding: '10px', color: '#334155', borderBottom: '1px solid #f1f5f9'}}>
                                                {scan.name}
                                            </td>
                                            <td style={{padding: '10px', color: '#334155', borderBottom: '1px solid #f1f5f9'}}>
                                                {scan.modality}
                                            </td>
                                            <td style={{padding: '10px', color: '#334155', borderBottom: '1px solid #f1f5f9'}}>
                                                <button style={{...s.actionButton, padding: '4px 8px'}} 
                                                    onClick={() => handleOpenReport(scan, scan.isReadOnly)}>
                                                    {scan.isReadOnly ? 'View Report' : 'Complete Report'}
                                                </button>
                                            </td>
                                            <td style={{padding: '10px', color: '#334155', borderBottom: '1px solid #f1f5f9'}}>
                                                <button 
                                                    style={{
                                                        ...s.actionButton, 
                                                        padding: '4px 8px',
                                                        backgroundColor: '#8b5cf6',
                                                        color: 'white',
                                                        fontSize: '12px'
                                                    }}
                                                    onClick={() => handleOpenDicomViewer(displayPatient)}
                                                    title="Open DICOM Viewer"
                                                >
                                                    DICOM
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Current Consultation */}
                <div style={s.contentContainer}>
                    <div style={{...s.card, flex: 1, display: 'flex', flexDirection: 'column', gap: '12px'}}>
                        <div style={{fontSize: '16px', fontWeight: '700', color: '#02505F'}}>Current Consultation</div>
                        <div style={s.tabGroup}>
                            <button onClick={() => setTab('records')} style={{...s.tab, ...(tab === 'records' ? s.tabActive : s.tabInactive)}}>Records</button>
                            <button onClick={() => setTab('orders')} style={{...s.tab, ...(tab === 'orders' ? s.tabActive : s.tabInactive)}}>Orders</button>
                        </div>

                        {tab === 'records' ? (
                            <div style={{...s.formScroll, flex: 1, overflowY: 'auto', maxHeight: '400px'}}>
                                {/* Complaint */}
                                <div style={s.formGroup}>
                                    <label style={s.inputLabel}>Complaint</label>
                                    <textarea 
                                        style={s.textAreaField} 
                                        placeholder="Patient's main complaint..." 
                                        value={consultationRecords.complaint} 
                                        onChange={e => setConsultationRecords({...consultationRecords, complaint: e.target.value})} 
                                    />
                                </div>
                                
                                {/* Physical Examination */}
                                <div style={s.formGroup}>
                                    <label style={s.inputLabel}>Physical Examination</label>
                                    <textarea 
                                        style={s.textAreaField} 
                                        placeholder="Key findings (e.g. Swelling, Range of Motion)..." 
                                        value={consultationRecords.physicalExam} 
                                        onChange={e => setConsultationRecords({...consultationRecords, physicalExam: e.target.value})} 
                                    />
                                </div>
                                
                                {/* Diagnosis */}
                                <div style={s.formGroup}>
                                    <label style={s.inputLabel}>Diagnosis</label>
                                    <input 
                                        type="text" 
                                        style={s.inputField} 
                                        placeholder="Confirmed diagnosis..." 
                                        value={consultationRecords.diagnosis} 
                                        onChange={e => setConsultationRecords({...consultationRecords, diagnosis: e.target.value})} 
                                    />
                                </div>
                                
                                {/* Treatment Plan */}
                                <div style={s.formGroup}>
                                    <label style={s.inputLabel}>Treatment Plan</label>
                                    <textarea 
                                        style={s.textAreaField} 
                                        placeholder="Plan moving forward..." 
                                        value={consultationRecords.treatment} 
                                        onChange={e => setConsultationRecords({...consultationRecords, treatment: e.target.value})} 
                                    />
                                </div>
                                
                                {/* Vital Signs Section */}
                                <div style={{marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '15px'}}>
                                    <div style={{fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                        <Activity size={18} /> Vital Signs
                                    </div>
                                    
                                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                                        {/* Heart Rate */}
                                        <div style={s.formGroup}>
                                            <label style={s.inputLabel}>
                                                Heart Rate <span style={{color: '#ef4444'}}>*</span>
                                            </label>
                                            <div style={{position: 'relative'}}>
                                                <input 
                                                    type="number" 
                                                    style={s.inputField} 
                                                    placeholder="e.g. 72"
                                                    value={consultationRecords.vitalSigns?.heart_rate || ''}
                                                    onChange={e => setConsultationRecords({
                                                        ...consultationRecords,
                                                        vitalSigns: {
                                                            ...consultationRecords.vitalSigns,
                                                            heart_rate: e.target.value
                                                        }
                                                    })}
                                                />
                                                <span style={{
                                                    position: 'absolute',
                                                    right: '10px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    color: '#94a3b8',
                                                    fontSize: '12px'
                                                }}>bpm</span>
                                            </div>
                                        </div>
                                        
                                        {/* Blood Pressure */}
                                        <div style={s.formGroup}>
                                            <label style={s.inputLabel}>
                                                Blood Pressure <span style={{color: '#ef4444'}}>*</span>
                                            </label>
                                            <div style={{position: 'relative'}}>
                                                <input 
                                                    type="text" 
                                                    style={s.inputField} 
                                                    placeholder="e.g. 120/80"
                                                    value={consultationRecords.vitalSigns?.blood_pressure || ''}
                                                    onChange={e => setConsultationRecords({
                                                        ...consultationRecords,
                                                        vitalSigns: {
                                                            ...consultationRecords.vitalSigns,
                                                            blood_pressure: e.target.value
                                                        }
                                                    })}
                                                />
                                                <span style={{
                                                    position: 'absolute',
                                                    right: '10px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    color: '#94a3b8',
                                                    fontSize: '12px'
                                                }}>mmHg</span>
                                            </div>
                                        </div>
                                        
                                        {/* Temperature */}
                                        <div style={s.formGroup}>
                                            <label style={s.inputLabel}>
                                                Temperature <span style={{color: '#ef4444'}}>*</span>
                                            </label>
                                            <div style={{position: 'relative'}}>
                                                <input 
                                                    type="number" 
                                                    step="0.1"
                                                    style={s.inputField} 
                                                    placeholder="e.g. 36.6"
                                                    value={consultationRecords.vitalSigns?.temperature || ''}
                                                    onChange={e => setConsultationRecords({
                                                        ...consultationRecords,
                                                        vitalSigns: {
                                                            ...consultationRecords.vitalSigns,
                                                            temperature: e.target.value
                                                        }
                                                    })}
                                                />
                                                <span style={{
                                                    position: 'absolute',
                                                    right: '10px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    color: '#94a3b8',
                                                    fontSize: '12px'
                                                }}>°C</span>
                                            </div>
                                        </div>
                                        
                                        {/* Weight */}
                                        <div style={s.formGroup}>
                                            <label style={s.inputLabel}>
                                                Weight <span style={{color: '#ef4444'}}>*</span>
                                            </label>
                                            <div style={{position: 'relative'}}>
                                                <input 
                                                    type="number" 
                                                    style={s.inputField} 
                                                    placeholder="e.g. 70"
                                                    value={consultationRecords.vitalSigns?.weight || ''}
                                                    onChange={e => setConsultationRecords({
                                                        ...consultationRecords,
                                                        vitalSigns: {
                                                            ...consultationRecords.vitalSigns,
                                                            weight: e.target.value
                                                        }
                                                    })}
                                                />
                                                <span style={{
                                                    position: 'absolute',
                                                    right: '10px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    color: '#94a3b8',
                                                    fontSize: '12px'
                                                }}>kg</span>
                                            </div>
                                        </div>
                                        
                                        {/* Respiratory Rate */}
                                        <div style={s.formGroup}>
                                            <label style={s.inputLabel}>Respiratory Rate</label>
                                            <div style={{position: 'relative'}}>
                                                <input 
                                                    type="number" 
                                                    style={s.inputField} 
                                                    placeholder="e.g. 16"
                                                    value={consultationRecords.vitalSigns?.respiratory_rate || ''}
                                                    onChange={e => setConsultationRecords({
                                                        ...consultationRecords,
                                                        vitalSigns: {
                                                            ...consultationRecords.vitalSigns,
                                                            respiratory_rate: e.target.value
                                                        }
                                                    })}
                                                />
                                                <span style={{
                                                    position: 'absolute',
                                                    right: '10px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    color: '#94a3b8',
                                                    fontSize: '12px'
                                                }}>breaths/min</span>
                                            </div>
                                        </div>
                                        
                                        {/* Oxygen Saturation */}
                                        <div style={s.formGroup}>
                                            <label style={s.inputLabel}>O₂ Saturation</label>
                                            <div style={{position: 'relative'}}>
                                                <input 
                                                    type="number" 
                                                    style={s.inputField} 
                                                    placeholder="e.g. 98"
                                                    min="0"
                                                    max="100"
                                                    value={consultationRecords.vitalSigns?.oxygen_saturation || ''}
                                                    onChange={e => setConsultationRecords({
                                                        ...consultationRecords,
                                                        vitalSigns: {
                                                            ...consultationRecords.vitalSigns,
                                                            oxygen_saturation: e.target.value
                                                        }
                                                    })}
                                                />
                                                <span style={{
                                                    position: 'absolute',
                                                    right: '10px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    color: '#94a3b8',
                                                    fontSize: '12px'
                                                }}>%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Additional Notes Section */}
                                <div style={{marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '15px'}}>
                                    <div style={{fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                        <FileText size={18} /> Additional Information
                                    </div>
                                    
                                    {/* Pain Assessment */}
                                    <div style={s.formGroup}>
                                        <label style={s.inputLabel}>Pain Assessment (0-10)</label>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                            <input 
                                                type="range" 
                                                min="0" 
                                                max="10" 
                                                step="1"
                                                style={{flex: 1, height: '6px', borderRadius: '3px', backgroundColor: '#e2e8f0'}}
                                                value={consultationRecords.pain_level || 0}
                                                onChange={e => setConsultationRecords({
                                                    ...consultationRecords,
                                                    pain_level: parseInt(e.target.value)
                                                })}
                                            />
                                            <span style={{
                                                minWidth: '30px',
                                                fontWeight: '600',
                                                color: consultationRecords.pain_level > 7 ? '#dc2626' : 
                                                    consultationRecords.pain_level > 4 ? '#f59e0b' : '#22c55e'
                                            }}>
                                                {consultationRecords.pain_level || 0}/10
                                            </span>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: '11px',
                                            color: '#94a3b8',
                                            marginTop: '4px'
                                        }}>
                                            <span>No pain</span>
                                            <span>Moderate</span>
                                            <span>Severe</span>
                                        </div>
                                    </div>
                                    
                                    {/* Follow-up Date */}
                                    <div style={s.formGroup}>
                                        <label style={s.inputLabel}>Recommended Follow-up Date</label>
                                        <input 
                                            type="date" 
                                            style={s.inputField} 
                                            value={consultationRecords.follow_up_date || ''}
                                            onChange={e => setConsultationRecords({
                                                ...consultationRecords,
                                                follow_up_date: e.target.value
                                            })}
                                        />
                                    </div>
                                    
                                    {/* Referral */}
                                    <div style={s.formGroup}>
                                        <label style={s.inputLabel}>Referral (if any)</label>
                                        <select 
                                            style={s.inputField}
                                            value={consultationRecords.referral || ''}
                                            onChange={e => setConsultationRecords({
                                                ...consultationRecords,
                                                referral: e.target.value
                                            })}
                                        >
                                            <option value="">No referral</option>
                                            <option value="physiotherapy">Physiotherapy</option>
                                            <option value="specialist">Specialist Consultation</option>
                                            <option value="imaging">Imaging Center</option>
                                            <option value="lab">Laboratory Tests</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    
                                    {/* Doctor's Notes */}
                                    <div style={s.formGroup}>
                                        <label style={s.inputLabel}>Doctor's Notes</label>
                                        <textarea 
                                            style={s.textAreaField} 
                                            placeholder="Additional notes, observations, or recommendations..."
                                            value={consultationRecords.notes || ''}
                                            onChange={e => setConsultationRecords({...consultationRecords, notes: e.target.value})}
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, paddingTop: '20px', overflowY: 'auto', maxHeight: '400px'}}>
                                <div style={{fontSize: '13px', color: '#64748b'}}>Select an order type:</div>
                                <button style={{...s.actionButton, padding: '16px', backgroundColor: '#4361ee', color: 'white', justifyContent: 'center', fontSize: '14px'}} 
                                    onClick={() => setShowMedicationModal(true)}>
                                    <Pill size={18} /> Prescribe Medication
                                </button>
                                <button style={{...s.actionButton, padding: '16px', backgroundColor: '#059669', color: 'white', justifyContent: 'center', fontSize: '14px'}} 
                                    onClick={() => setShowScanOrderModal(true)}>
                                    <Activity size={18} /> Order New Scan
                                </button>
                                
                                {/* Additional Order Options */}
                                <div style={{marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '15px'}}>
                                    <div style={{fontSize: '13px', color: '#64748b', marginBottom: '12px'}}>Other Order Options:</div>
                                    
                                    <button style={{...s.actionButton, padding: '12px', backgroundColor: '#f1f5f9', color: '#475569', justifyContent: 'center', fontSize: '13px', border: '1px solid #e2e8f0'}} 
                                        onClick={() => alert('Physical Therapy Referral - Feature coming soon')}>
                                        📋 Physical Therapy Referral
                                    </button>
                                    
                                    <button style={{...s.actionButton, padding: '12px', backgroundColor: '#f1f5f9', color: '#475569', justifyContent: 'center', fontSize: '13px', border: '1px solid #e2e8f0'}} 
                                        onClick={() => alert('Laboratory Tests - Feature coming soon')}>
                                        🧪 Laboratory Tests
                                    </button>
                                    
                                    <button style={{...s.actionButton, padding: '12px', backgroundColor: '#f1f5f9', color: '#475569', justifyContent: 'center', fontSize: '13px', border: '1px solid #e2e8f0'}} 
                                        onClick={() => alert('Medical Certificate - Feature coming soon')}>
                                        📄 Medical Certificate
                                    </button>
                                    
                                    <button style={{...s.actionButton, padding: '12px', backgroundColor: '#f1f5f9', color: '#475569', justifyContent: 'center', fontSize: '13px', border: '1px solid #e2e8f0'}} 
                                        onClick={() => alert('Sick Leave - Feature coming soon')}>
                                        🏥 Sick Leave
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {tab === 'records' && (
                            <button 
                                style={{...s.actionButton, backgroundColor: '#1e293b', color: 'white', marginTop: 'auto', padding: '12px', justifyContent: 'center'}}
                                onClick={handleSaveVisitRecord}
                            >
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
    const [pendingScans, setPendingScans] = useState([]);
    const [patientsList, setPatientsList] = useState([]);
    const [doctorName, setDoctorName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    // Login state
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Modals State
    const [showReportModal, setShowReportModal] = useState(false);
    const [showMedicationModal, setShowMedicationModal] = useState(false);
    const [showScanOrderModal, setShowScanOrderModal] = useState(false);
    
    const [selectedScan, setSelectedScan] = useState(null); 
    const [reportText, setReportText] = useState('');
    
    const [consultationRecords, setConsultationRecords] = useState({
        complaint: '',
        diagnosis: '',
        treatment: '',
        physicalExam: '',
        notes: '',
        vitalSigns: {
            heart_rate: '',
            blood_pressure: '',
            temperature: '',
            weight: '',
            respiratory_rate: '',
            oxygen_saturation: ''
        }
    });

    // Profile Data State
    const [profileData, setProfileData] = useState({
        fullName: '',
        licenseNumber: '',
        professionalTitle: '',
        staffId: '',
        phone: '',
        address: '',
        password: '',
        newPassword: '',
        confirmPassword: '',
        profilePhoto: null,
        digitalSignature: null,
        email: '',
        username: ''
    });

    // ========== HELPER FUNCTIONS ==========
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // ========== API CALL FUNCTIONS ==========
    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem("token");
            
            // Use the new today endpoint
            const response = await fetch("http://127.0.0.1:5000/api/doctor/appointments/today", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log("Appointments data:", data); // Debug log
                
                const formattedAppointments = data.map((appt) => {        
                    return {
                        id: appt.appointment_id || appt.id,
                        date: formatDate(appt.date),
                        time: appt.time || 'N/A',
                        patientName: appt.patient_name,
                        reason: appt.reason || 'Follow-up',
                        notes: appt.notes || '',
                        status: appt.status || "scheduled",
                    };
                });
                setAppointments(formattedAppointments);
            } else {
                console.error("Failed to fetch appointments");
                // Use mock data as fallback
                const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                setAppointments([
                    { id: 1, date: today, time: '09:00 AM', patientName: 'Sarah Johnson', reason: 'Shoulder follow-up', notes: 'Post-op check', status: 'scheduled' },
                    { id: 2, date: today, time: '10:30 AM', patientName: 'Michael Brown', reason: 'Knee pain', notes: 'ACL reconstruction follow-up', status: 'scheduled' },
                    { id: 3, date: today, time: '02:00 PM', patientName: 'Emily Davis', reason: 'Ankle sprain', notes: 'Progress check', status: 'scheduled' },
                ]);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
            const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
            setAppointments([
                { id: 1, date: today, time: '09:00 AM', patientName: 'Sarah Johnson', reason: 'Shoulder follow-up', notes: 'Post-op check', status: 'scheduled' },
                { id: 2, date: today, time: '10:30 AM', patientName: 'Michael Brown', reason: 'Knee pain', notes: 'ACL reconstruction follow-up', status: 'scheduled' },
            ]);
        }
    };


    const fetchPendingScans = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://127.0.0.1:5000/api/doctor/scans?status=pending", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                const formattedScans = data.map((scan) => ({
                    id: scan.scan_id,
                    scanId: `SCN-${scan.scan_id}`,
                    scanType: scan.scan_type,
                    bodyPart: scan.body_part,
                    modality: scan.modality,
                    date: formatDate(scan.scan_date),
                    time: scan.scan_date ? '09:00 AM' : 'N/A',
                    radiologist: scan.radiologist || 'Not Assigned',
                    status: scan.status,
                    patientName: scan.patient_name,
                    patientId: `P-${scan.patient_id}`,
                    age: scan.patient_age,
                    gender: scan.patient_gender,
                    recordId: `REC-${scan.scan_id}`,
                    scanImage: scan.folder_path ? 
                        `http://127.0.0.1:5000/uploads/dicom_scans/${scan.folder_path}/thumbnail.jpg` : 
                        FALLBACK_IMAGE
                }));
                setPendingScans(formattedScans);
            } else {
                console.error("Failed to fetch scans, using mock data");
                setPendingScans(pendingScansMock);
            }
        } catch (error) {
            console.error("Error fetching scans:", error);
            setPendingScans(pendingScansMock);
        }
    };

    const fetchPatientsList = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://127.0.0.1:5000/api/doctor/patients", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                setPatientsList(data);
            } else {
                console.error("Failed to fetch patients");
                setPatientsList(allPatientsData);
            }
        } catch (error) {
            console.error("Error fetching patients:", error);
            setPatientsList(allPatientsData);
        }
    };

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://127.0.0.1:5000/api/doctor/profile", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log("Profile data:", data); // Debug log
                
                // Helper function to construct image URL
                const constructImageUrl = (filename) => {
                    if (!filename) return null;
                    
                    // Check if it's already a full URL
                    if (filename.startsWith('http')) {
                        return filename;
                    }
                    
                    // Check if it's a relative path
                    if (filename.includes('/')) {
                        // Remove any leading slash
                        const cleanPath = filename.startsWith('/') ? filename.substring(1) : filename;
                        return `http://127.0.0.1:5000/${cleanPath}`;
                    }
                    
                    // If it's just a filename, use the profile images endpoint
                    return `http://127.0.0.1:5000/api/doctor/profile_images/${filename}`;
                };
                
                // Get profile photo URL
                let profilePhotoUrl = null;
                if (data.profile_image) {
                    profilePhotoUrl = constructImageUrl(data.profile_image);
                    console.log("Profile image URL constructed:", profilePhotoUrl);
                }
                
                // Get signature URL
                let signatureUrl = null;
                if (data.digital_signature) {
                    signatureUrl = constructImageUrl(data.digital_signature);
                    console.log("Signature URL constructed:", signatureUrl);
                } else if (data.doctor_info?.digital_signature) {
                    // Check doctor_info as alternative location
                    signatureUrl = constructImageUrl(data.doctor_info.digital_signature);
                    console.log("Signature URL from doctor_info:", signatureUrl);
                }
                
                setProfileData({
                    fullName: data.full_name || `${data.f_name || ''} ${data.l_name || ''}`.trim(),
                    licenseNumber: data.doctor_info?.license_number || '',
                    professionalTitle: data.doctor_info?.department || 'Doctor',
                    staffId: data.doctor_info?.staff_id || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    password: '',
                    newPassword: '',
                    confirmPassword: '',
                    profilePhoto: profilePhotoUrl,
                    digitalSignature: signatureUrl,
                    email: data.email || '',
                    username: data.username || '',
                    statistics: data.statistics || { appointmentsThisMonth: 0, scansMadeThisMonth: 0 },
                    // Store the raw filenames too
                    rawProfileImage: data.profile_image,
                    rawDigitalSignature: data.digital_signature || data.doctor_info?.digital_signature
                });
                
                // Set doctor name
                if (data.f_name) {
                    setDoctorName(data.f_name);
                } else if (data.full_name) {
                    const firstName = data.full_name.split(' ')[0];
                    setDoctorName(firstName);
                } else if (data.doctor_info?.f_name) {
                    setDoctorName(data.doctor_info.f_name);
                }
                
                // Also store in localStorage for persistence
                localStorage.setItem('doctorProfileData', JSON.stringify({
                    profile_image: data.profile_image,
                    digital_signature: data.digital_signature || data.doctor_info?.digital_signature,
                    profile_photo_url: profilePhotoUrl,
                    signature_url: signatureUrl
                }));
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            
            // Try to load from localStorage as fallback
            const storedProfile = localStorage.getItem('doctorProfileData');
            if (storedProfile) {
                const savedData = JSON.parse(storedProfile);
                setProfileData(prev => ({
                    ...prev,
                    profilePhoto: savedData.profile_photo_url,
                    digitalSignature: savedData.signature_url
                }));
            }
        }
    };


    const updateProfile = async (updateData) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://127.0.0.1:5000/api/doctor/profile/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updateData)
            });
            
            const data = await response.json();
            if (response.ok) {
                alert('Profile updated successfully');
                fetchProfile(); // Refresh profile data
                return true;
            } else {
                alert(data.error || 'Update failed');
                return false;
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            return false;
        }
    };

    const uploadProfilePicture = async (file) => {
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append('profile_picture', file);
            
            const response = await fetch("http://127.0.0.1:5000/api/doctor/profile/upload-picture", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData
            });
            
            const data = await response.json();
            if (response.ok) {
                alert('Profile picture uploaded successfully');
                fetchProfile(); // Refresh profile data
                return data.profile_image_url;
            } else {
                alert(data.error || 'Upload failed');
                return null;
            }
        } catch (error) {
            console.error('Error uploading picture:', error);
            return null;
        }
    };

    const uploadSignature = async (file) => {
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append('signature', file);
            
            const response = await fetch("http://127.0.0.1:5000/api/doctor/profile/upload-signature", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData
            });
            
            const data = await response.json();
            if (response.ok) {
                alert('Signature uploaded successfully');
                return data.signature_url;
            } else {
                alert(data.error || 'Upload failed');
                return null;
            }
        } catch (error) {
            console.error('Error uploading signature:', error);
            return null;
        }
    };

    const updateScanReport = async (scanId, reportData) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://127.0.0.1:5000/api/doctor/scan/${scanId}/report`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(reportData)
            });
            
            const data = await response.json();
            if (response.ok) {
                alert('Scan report updated successfully');
                fetchPendingScans(); // Refresh pending scans
                return true;
            } else {
                alert(data.error || 'Update failed');
                return false;
            }
        } catch (error) {
            console.error('Error updating scan report:', error);
            return false;
        }
    };

    const prescribeMedication = async (patientId, medicationData) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://127.0.0.1:5000/api/doctor/patient/${patientId}/medication`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(medicationData)
            });
            
            const data = await response.json();
            if (response.ok) {
                alert('Medication prescribed successfully');
                return true;
            } else {
                alert(data.error || 'Failed to prescribe medication');
                return false;
            }
        } catch (error) {
            console.error('Error prescribing medication:', error);
            return false;
        }
    };

    const orderNewScan = async (patientId, scanData) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://127.0.0.1:5000/api/doctor/patient/${patientId}/scan`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(scanData)
            });
            
            const data = await response.json();
            if (response.ok) {
                alert('Scan ordered successfully');
                return true;
            } else {
                alert(data.error || 'Failed to order scan');
                return false;
            }
        } catch (error) {
            console.error('Error ordering scan:', error);
            return false;
        }
    };

    // ========== USE EFFECTS ==========
    useEffect(() => {
        const loadDoctorName = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsLoggedIn(false);
                return;
            }

            // Check if doctor name is already in localStorage
            const storedUserData = localStorage.getItem('userData');
            const storedDoctorData = localStorage.getItem('doctorData');
            
            if (storedUserData) {
                try {
                    const userData = JSON.parse(storedUserData);
                    if (userData.f_name) {
                        setDoctorName(userData.f_name);
                        setIsLoggedIn(true);
                        return;
                    }
                } catch (e) {
                    console.error('Error parsing stored user data:', e);
                }
            }
            
            if (storedDoctorData) {
                try {
                    const doctorData = JSON.parse(storedDoctorData);
                    if (doctorData.f_name) {
                        setDoctorName(doctorData.f_name);
                        setIsLoggedIn(true);
                        return;
                    }
                } catch (e) {
                    console.error('Error parsing stored doctor data:', e);
                }
            }

            // If not in localStorage, fetch from API
            try {
                const response = await fetch("http://127.0.0.1:5000/api/doctor/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.f_name) {
                        setDoctorName(data.f_name);
                        setIsLoggedIn(true);
                    }
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Error fetching profile for name:', error);
                setIsLoggedIn(false);
            }
        };

        loadDoctorName();
    }, []);

    useEffect(() => {
        if (!isLoggedIn) return;

        const loadInitialData = async () => {
            setIsLoading(true);
            
            if (activeTab === 'home') {
                await Promise.all([fetchAppointments(), fetchPendingScans()]);
            } else if (activeTab === 'patients') {
                await fetchPatientsList();
            } else if (activeTab === 'profile-settings') {
                await fetchProfile();
            }
            
            setIsLoading(false);
        };

        loadInitialData();
    }, [activeTab, isLoggedIn]);

    // ========== EVENT HANDLERS ==========
    const handleLogin = async (username, password) => {
        try {
            setIsLoading(true);
            const response = await fetch('http://127.0.0.1:5000/api/doctor/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.access_token);
                
                // Store user data
                if (data.user) {
                    localStorage.setItem('userData', JSON.stringify(data.user));
                }
                
                // Store doctor data if available
                if (data.doctor) {
                    localStorage.setItem('doctorData', JSON.stringify(data.doctor));
                }
                
                // Set doctor name - check multiple possible sources
                let doctorNameToSet = '';
                
                if (data.doctor?.f_name) {
                    doctorNameToSet = data.doctor.f_name;
                } else if (data.user?.f_name) {
                    doctorNameToSet = data.user.f_name;
                }
                
                setDoctorName(doctorNameToSet);
                setIsLoggedIn(true);
                
                // Fetch initial data after login
                fetchAppointments();
                fetchPendingScans();
                
                return true;
            } else {
                alert(data.error || 'Login failed');
                return false;
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Network error. Please check if the server is running.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Show login form if not logged in
    if (!isLoggedIn && !localStorage.getItem('token')) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f8fafc'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '40px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    width: '400px'
                }}>
                    <h2 style={{textAlign: 'center', marginBottom: '30px', color: '#1e293b'}}>
                        Doctor Login
                    </h2>
                    <div style={{marginBottom: '20px'}}>
                        <label style={{display: 'block', marginBottom: '8px', color: '#475569', fontSize: '14px'}}>
                            Username
                        </label>
                        <input 
                            type="text" 
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0',
                                fontSize: '14px'
                            }}
                            value={loginUsername}
                            onChange={(e) => setLoginUsername(e.target.value)}
                            placeholder="Enter username"
                        />
                    </div>
                    <div style={{marginBottom: '30px'}}>
                        <label style={{display: 'block', marginBottom: '8px', color: '#475569', fontSize: '14px'}}>
                            Password
                        </label>
                        <input 
                            type="password" 
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0',
                                fontSize: '14px'
                            }}
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="Enter password"
                        />
                    </div>
                    <button 
                        onClick={() => handleLogin(loginUsername, loginPassword)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#4361ee',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                    <div style={{
                        marginTop: '20px',
                        textAlign: 'center',
                        color: '#64748b',
                        fontSize: '12px'
                    }}>
                        Make sure the backend server is running at http://127.0.0.1:5000
                    </div>
                </div>
            </div>
        );
    }

    // Show loading screen
    if (isLoading) {
        return (
            <div style={s.container}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: '#f8fafc'
                }}>
                    <div>Loading dashboard...</div>
                </div>
            </div>
        );
    }

    const handleOpenReport = (scan, isReadOnly = false) => {
        setSelectedScan({ ...scan, isReadOnly });
        setReportText(scan.report || '');
        setShowReportModal(true);
    };

    // Update handleSubmitReport function in main component
    const handleSubmitReport = async () => {
        if (selectedScan && selectedScan.id) {
            const success = await updateScanReport(selectedScan.id, {
                doctor_notes: reportText,
                final_diagnosis: reportText,
                is_verified: true,
                status: 'completed'
            });
            
            if (success) {
                // Refresh pending scans
                fetchPendingScans();
            }
        }
        setShowReportModal(false);
        setReportText('');
    };

    // Update the handlePatientClick function in the main component
    const handlePatientClick = async (patientNameOrId) => {
        // First try to find in patientsList (real data)
        if (patientsList.length > 0) {
            const patient = patientsList.find(p => 
                p.patient_name === patientNameOrId || 
                `P-${p.patient_id}` === patientNameOrId
            );
            
            if (patient) {
                const formattedPatient = {
                    id: patient.patient_id,
                    patientName: patient.patient_name,
                    age: patient.age,
                    gender: patient.gender,
                    bloodType: patient.blood_type,
                    allergies: patient.allergies,
                    diagnosis: patient.diagnosis,
                    lastVisitDate: patient.last_visit_date,
                    nextVisitDate: patient.next_visit_date,
                    history: patient.chronic_conditions ? patient.chronic_conditions.split(',') : []
                };
                
                setSelectedPatient(formattedPatient);
                setActiveTab('profile');
                
                // Reset consultation records for new patient
                setConsultationRecords({
                    complaint: '',
                    diagnosis: '',
                    treatment: '',
                    physicalExam: ''
                });
                
                return;
            }
        }
        
        // Fallback to mock data
        const patient = allPatientsData.find(p => p.patientName === patientNameOrId);
        if (patient) {
            setSelectedPatient(patient);
            setActiveTab('profile');
            
            // Reset consultation records for new patient
            setConsultationRecords({
                complaint: '',
                diagnosis: '',
                treatment: '',
                physicalExam: ''
            });
        }
    };

    const handleBackToHome = () => {
        setSelectedPatient(null);
        setActiveTab('home');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('doctorData');
        localStorage.removeItem('userData');
        window.location.href = '/login';
    };

    const ProfileSettingsView = ({ profileData, setProfileData, doctorName }) => {
        const [showCurrentPass, setShowCurrentPass] = useState(false);
        const [showNewPass, setShowNewPass] = useState(false);
        const [showConfirmPass, setShowConfirmPass] = useState(false);
        const [originalPhone, setOriginalPhone] = useState(profileData.phone || '');
        const [originalAddress, setOriginalAddress] = useState(profileData.address || '');

        // Test function to check if image loads
        const testImageUrl = (url) => {
            if (!url) return false;
            
            // Create a test image element
            const img = new Image();
            img.src = url;
            
            return new Promise((resolve) => {
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
                // Timeout after 3 seconds
                setTimeout(() => resolve(false), 3000);
            });
        };

        // Test profile photo on mount
        useEffect(() => {
            const testImages = async () => {
                if (profileData.profilePhoto) {
                    const works = await testImageUrl(profileData.profilePhoto);
                    console.log("Profile photo URL test:", profileData.profilePhoto, "Works:", works);
                }
                
                if (profileData.digitalSignature) {
                    const works = await testImageUrl(profileData.digitalSignature);
                    console.log("Signature URL test:", profileData.digitalSignature, "Works:", works);
                }
            };
            
            testImages();
        }, [profileData.profilePhoto, profileData.digitalSignature]);

        const handlePhotoUpload = async (e) => {
            const file = e.target.files[0];
            if (file) {
                console.log("Uploading profile picture:", file.name, file.type, file.size);
                
                // Save current state before updating
                const currentProfileData = { ...profileData }; // Create a copy of current profileData
                const originalPhoto = currentProfileData.profilePhoto;
                
                // Show loading state
                setProfileData(prev => ({
                    ...prev,
                    profilePhoto: null
                }));
                
                // Create FormData
                const formData = new FormData();
                formData.append('image', file);
                
                const token = localStorage.getItem("token");
                
                try {
                    const response = await fetch("http://127.0.0.1:5000/api/doctor/profile/upload-picture", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        body: formData
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        // Construct the correct URL
                        const imageUrl = `http://127.0.0.1:5000/api/doctor/profile_images/${data.profile_image}`;
                        
                        // Update profile data immediately
                        setProfileData(prev => ({
                            ...prev,
                            profilePhoto: imageUrl,
                            rawProfileImage: data.profile_image
                        }));
                        
                        // Store in localStorage
                        const storedData = localStorage.getItem('doctorProfileData');
                        const localProfileData = storedData ? JSON.parse(storedData) : {};
                        localProfileData.profile_image = data.profile_image;
                        localProfileData.profile_photo_url = imageUrl;
                        localStorage.setItem('doctorProfileData', JSON.stringify(localProfileData));
                        
                        // Also update userData in localStorage
                        const storedUserData = localStorage.getItem('userData');
                        if (storedUserData) {
                            const userData = JSON.parse(storedUserData);
                            userData.profile_image = data.profile_image;
                            localStorage.setItem('userData', JSON.stringify(userData));
                        }
                        
                        alert('Profile picture updated successfully!');
                        
                        // Force refresh profile data
                        await fetchProfile();
                    } else {
                        // Revert to original photo on error
                        setProfileData(prev => ({
                            ...prev,
                            profilePhoto: originalPhoto
                        }));
                        alert(data.error || 'Failed to upload profile picture');
                    }
                } catch (error) {
                    console.error('Error uploading profile picture:', error);
                    // Revert to original photo on error
                    setProfileData(prev => ({
                        ...prev,
                        profilePhoto: originalPhoto
                    }));
                    alert('Error uploading profile picture');
                }
            }
        };

        const handleSignatureUpload = async (e) => {
            const file = e.target.files[0];
            if (file) {
                console.log("Uploading signature:", file.name, file.type, file.size);
                
                // Save current state before updating
                const currentProfileData = { ...profileData }; // Create a copy of current profileData
                const originalSignature = currentProfileData.digitalSignature;
                
                // Show loading state
                setProfileData(prev => ({
                    ...prev,
                    digitalSignature: null
                }));
                
                // Create FormData
                const formData = new FormData();
                formData.append('image', file);
                
                const token = localStorage.getItem("token");
                
                try {
                    // Upload the file
                    const uploadResponse = await fetch("http://127.0.0.1:5000/api/doctor/profile/upload-signature", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        body: formData
                    });
                    
                    const uploadData = await uploadResponse.json();
                    
                    if (uploadResponse.ok) {
                        // Construct the correct URL
                        const signatureUrl = `http://127.0.0.1:5000/api/doctor/profile_images/${uploadData.profile_image}`;
                        
                        // Update immediately
                        setProfileData(prev => ({
                            ...prev,
                            digitalSignature: signatureUrl,
                            rawDigitalSignature: uploadData.profile_image
                        }));
                        
                        // Store in localStorage
                        const storedData = localStorage.getItem('doctorProfileData');
                        const localProfileData = storedData ? JSON.parse(storedData) : {};
                        localProfileData.digital_signature = uploadData.profile_image;
                        localProfileData.signature_url = signatureUrl;
                        localStorage.setItem('doctorProfileData', JSON.stringify(localProfileData));
                        
                        // Save signature path to database
                        try {
                            const saveResponse = await fetch("http://127.0.0.1:5000/api/doctor/profile/update-signature", {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({
                                    signature_path: uploadData.profile_image
                                })
                            });
                            
                            if (saveResponse.ok) {
                                alert('Signature uploaded and saved successfully!');
                                
                                // Force refresh profile data
                                await fetchProfile();
                            } else {
                                // If database save fails, still keep the uploaded image
                                alert('Signature uploaded but failed to save to database');
                            }
                        } catch (error) {
                            console.error('Error saving signature:', error);
                            // Still keep the uploaded image
                            alert('Signature uploaded but database save failed');
                        }
                    } else {
                        // Revert to original signature on error
                        setProfileData(prev => ({
                            ...prev,
                            digitalSignature: originalSignature
                        }));
                        alert(uploadData.error || 'Failed to upload signature');
                    }
                } catch (error) {
                    console.error('Error uploading signature:', error);
                    // Revert to original signature on error
                    setProfileData(prev => ({
                        ...prev,
                        digitalSignature: originalSignature
                    }));
                    alert('Error uploading signature');
                }
            }
        };

        const handleSave = async () => {
            if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
                alert('New passwords do not match!');
                return;
            }
            
            const updateData = {};
            
            // Only include fields that have changed
            if (profileData.phone !== originalPhone) {
                updateData.phone = profileData.phone;
                setOriginalPhone(profileData.phone);
            }
            
            if (profileData.address !== originalAddress) {
                updateData.address = profileData.address;
                setOriginalAddress(profileData.address);
            }
            
            // Password change
            if (profileData.password && profileData.newPassword) {
                updateData.current_password = profileData.password;
                updateData.new_password = profileData.newPassword;
            }
            
            // If no changes, show message
            if (Object.keys(updateData).length === 0 && !profileData.password) {
                alert('No changes to save');
                return;
            }
            
            const success = await updateProfile(updateData);
            if (success) {
                // Clear password fields after successful update
                setProfileData({
                    ...profileData,
                    password: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            }
        };

        const getPasswordStrength = (pass) => {
            if (!pass) return 0;
            if (pass.length < 6) return 30;
            if (pass.length < 10) return 60;
            return 100;
        };
        
        const strength = getPasswordStrength(profileData.newPassword);
        const strengthColor = strength < 40 ? '#ef4444' : strength < 80 ? '#f59e0b' : '#22c55e';

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
                                            // In your ProfileSettingsView component, update the img tag:
                                            <img 
                                                src={profileData.profilePhoto} 
                                                alt="Profile" 
                                                style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}}
                                                onError={(e) => {
                                                    // Try to reconstruct URL from raw filename
                                                    if (profileData.rawProfileImage) {
                                                        e.target.src = `http://127.0.0.1:5000/api/doctor/profile_images/${profileData.rawProfileImage}`;
                                                    } else {
                                                        // Fallback to initial
                                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNFMkU4RjAiIHJ4PSI1MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjOTRBM0I4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+ezB9PC90ZXh0Pjwvc3ZnPg=='.replace('{0}', doctorName.charAt(0));
                                                    }
                                                }}
/>
                                        ) : (
                                            <div style={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: '#e2e8f0',
                                                color: '#475569',
                                                fontSize: '36px',
                                                fontWeight: 'bold',
                                                borderRadius: '50%'
                                            }}>
                                                {doctorName.charAt(0) || 'D'}
                                            </div>
                                        )}
                                    </div>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handlePhotoUpload} 
                                        style={{display: 'none'}} 
                                        id="photo-upload" 
                                    />
                                    <label htmlFor="photo-upload" style={dps.uploadButton}>
                                        {profileData.profilePhoto ? 'Change Photo' : 'Upload Photo'}
                                    </label>
                                    {profileData.profilePhoto && (
                                        <button 
                                            onClick={() => {
                                                setProfileData({...profileData, profilePhoto: null});
                                                // Here you would also call API to remove photo
                                            }}
                                            style={{
                                                ...dps.uploadButton,
                                                backgroundColor: '#fef2f2',
                                                color: '#dc2626',
                                                marginTop: '8px'
                                            }}
                                        >
                                            Remove Photo
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div style={dps.profileCard}>
                                <h3 style={dps.profileCardTitle}>Contact Information</h3>
                                <div style={dps.infoRow}>
                                    <label style={s.inputLabel}>Phone Number</label>
                                    <input 
                                        type="tel" 
                                        value={profileData.phone || ''} 
                                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})} 
                                        style={dps.editableField} 
                                        placeholder="Enter phone number"
                                    />
                                </div>
                                <div style={dps.infoRow}>
                                    <label style={s.inputLabel}>Address</label>
                                    <textarea 
                                        value={profileData.address || ''} 
                                        onChange={(e) => setProfileData({...profileData, address: e.target.value})} 
                                        style={{...dps.editableField, minHeight: '80px', resize: 'vertical'}} 
                                        placeholder="Enter address"
                                    />
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
                                            <img 
                                                src={profileData.digitalSignature} 
                                                alt="Signature" 
                                                style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}}
                                                onError={(e) => {
                                                    // Try to reconstruct URL from raw filename
                                                    if (profileData.rawDigitalSignature) {
                                                        e.target.src = `http://127.0.0.1:5000/api/doctor/profile_images/${profileData.rawDigitalSignature}`;
                                                    } else {
                                                        e.target.style.display = 'none';
                                                        e.target.parentElement.innerHTML = '<span style="font-size: 12px; color: #94a3b8">Signature image not found</span>';
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <span style={{fontSize: '12px', color: '#94a3b8'}}>No signature uploaded</span>
                                        )}
                                    </div>
                                    <div style={{display: 'flex', gap: '8px'}}>
                                        <input type="file" accept="image/*" onChange={handleSignatureUpload} style={{display: 'none'}} id="signature-upload" />
                                        <label htmlFor="signature-upload" style={{...dps.uploadButton, width: 'auto'}}>
                                            {profileData.digitalSignature ? 'Change Signature' : 'Upload Signature'}
                                        </label>
                                        {profileData.digitalSignature && (
                                            <button 
                                                onClick={() => {
                                                    setProfileData({...profileData, digitalSignature: null});
                                                    // Call API to remove signature
                                                    const token = localStorage.getItem("token");
                                                    fetch("http://127.0.0.1:5000/api/doctor/profile/update-signature", {
                                                        method: "PUT",
                                                        headers: {
                                                            "Content-Type": "application/json",
                                                            Authorization: `Bearer ${token}`,
                                                        },
                                                        body: JSON.stringify({
                                                            signature_path: null
                                                        })
                                                    });
                                                }}
                                                style={{
                                                    ...dps.uploadButton,
                                                    backgroundColor: '#fef2f2',
                                                    color: '#dc2626',
                                                    width: 'auto'
                                                }}
                                            >
                                                Remove
                                            </button>
                                        )}
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
                                        <div style={dps.readOnlyField}>{profileData.licenseNumber || 'Not specified'}</div>
                                    </div>
                                    <div style={dps.infoRow}>
                                    <label style={s.inputLabel}>Doctor ID</label>
                                    <div style={dps.readOnlyField}>{profileData.staffId || 'Not assigned'}</div>
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

                            {/* Monthly Statistics */}
                            {profileData.statistics && (
                                <div style={dps.profileCard}>
                                    <h3 style={dps.profileCardTitle}>Monthly Statistics</h3>
                                    <div style={dps.statsGrid}>
                                        <div style={dps.statItem}>
                                            <span style={dps.statNumber}>{profileData.statistics.appointmentsThisMonth || 0}</span>
                                            <span style={dps.statLabel}>Appointments</span>
                                        </div>
                                        <div style={dps.statItem}>
                                            <span style={dps.statNumber}>{profileData.statistics.scansMadeThisMonth || 0}</span>
                                            <span style={dps.statLabel}>Scans Completed</span>
                                        </div>
                                    </div>
                                </div>
                            )}

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
                                            placeholder="Enter current password" 
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
                                            placeholder="Enter new password" 
                                        />
                                        <button onClick={() => setShowNewPass(!showNewPass)} style={dps.eyeIconBtn}>
                                            {showNewPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                                        </button>
                                    </div>
                                </div>

                                {profileData.newPassword && (
                                    <div style={dps.strengthBarContainer}>
                                        <div style={{...dps.strengthBarFill, width: `${strength}%`, backgroundColor: strengthColor}}></div>
                                        <div style={{
                                            fontSize: '11px',
                                            color: '#64748b',
                                            marginTop: '4px',
                                            textAlign: 'right'
                                        }}>
                                            {strength < 40 ? 'Weak' : strength < 80 ? 'Medium' : 'Strong'}
                                        </div>
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
                                            placeholder="Confirm new password" 
                                        />
                                        <button onClick={() => setShowConfirmPass(!showConfirmPass)} style={dps.eyeIconBtn}>
                                            {showConfirmPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                                        </button>
                                    </div>
                                </div>
                                
                                <div style={{
                                    fontSize: '12px',
                                    color: '#64748b',
                                    marginTop: '12px',
                                    padding: '8px',
                                    backgroundColor: '#f8fafc',
                                    borderRadius: '6px',
                                    border: '1px solid #e2e8f0'
                                }}>
                                    Password must be at least 6 characters long
                                </div>
                            </div>

                            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '12px'}}>
                                <button 
                                    onClick={() => {
                                        // Reset form
                                        setProfileData({
                                            ...profileData,
                                            phone: originalPhone,
                                            address: originalAddress,
                                            password: '',
                                            newPassword: '',
                                            confirmPassword: ''
                                        });
                                    }}
                                    style={{
                                        ...dps.saveButton,
                                        backgroundColor: '#f1f5f9',
                                        color: '#64748b',
                                        border: '1px solid #e2e8f0'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button onClick={handleSave} style={dps.saveButton}>Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ========== PATIENTS LIST VIEW ==========
    const PatientsListView = ({ searchTerm, setSearchTerm, handlePatientClick }) => {
        const patientTableGrid = { 
            gridTemplateColumns: '100px 1.5fr 1.5fr 1fr 1fr 80px',
            alignItems: 'center'
        };

        const filteredPatients = patientsList.filter(p => {
            const term = searchTerm.toLowerCase();
            return (
                `P-${p.patient_id}`.toLowerCase().includes(term) ||
                (p.patient_name || '').toLowerCase().includes(term) ||
                (p.diagnosis || '').toLowerCase().includes(term) ||
                (p.last_visit_date || '').toLowerCase().includes(term) ||
                (p.next_visit_date || '').toLowerCase().includes(term)
            );
        });

        const totalPatients = patientsList.length;

        return (
            <div style={{...s.main, overflowY: 'auto'}}>
                
                {/* Welcome Banner */}
                <section style={{...dps.welcomeBanner, flexShrink: 0}}>
                    <div style={dps.decorativeCircle1}></div>
                    <div style={dps.decorativeCircle2}></div>
                    <div style={dps.welcomeTextBox}>
                        <h1 style={dps.welcomeTitle}>My Patients</h1>
                        <p style={dps.welcomeSubText}>
                            You are currently managing <span style={dps.welcomeHighlight}>{totalPatients} patient records</span>. 
                            Track their recovery progress and upcoming visits here.
                        </p>
                    </div>
                    <img src={myPatientsImage} alt="Patients" style={dps.welcomeIllustration} />
                </section>

                {/* Search & Title Section */}
                <div style={{marginBottom: '20px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '15px'}}>
                       <h2 style={s.sectionTitle}>Patient Records Directory</h2>
                       <div style={{fontSize: '14px', color: '#64748b'}}>Showing {filteredPatients.length} results</div>
                    </div>

                    <div style={s.searchContainer}>
                        <div style={s.searchWrapper}>
                            <Search size={18} style={s.searchIcon} />
                            <input 
                                type="text" 
                                style={s.searchInput} 
                                placeholder="Search by ID, Name, Diagnosis, or Date..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div style={s.contentContainer}>
                    <div style={s.section}>
                        <div style={s.tableContainer}>
                            <div style={{ ...s.tableHeader, ...patientTableGrid }}>
                                <div>Patient ID</div>
                                <div>Patient Name</div>
                                <div>Condition / Diagnosis</div>
                                <div>Last Visit Date</div>
                                <div>Next Visit Date</div>
                                <div>Viewer</div>
                            </div>
                            
                            <div style={s.scrollableRows}>
                                {filteredPatients.length > 0 ? (
                                    filteredPatients.map((patient) => (
                                        <div key={patient.patient_id} style={{ ...s.tableRow, ...patientTableGrid }}>
                                            {/* Patient ID Column */}
                                            <div style={{fontWeight:'600', color: '#475569'}}>
                                                P-{patient.patient_id}
                                            </div>

                                            {/* Clickable Patient Name Column */}
                                            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                                <div style={{width:'32px', height:'32px', borderRadius:'50%', background:'#e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'700', color:'#475569'}}>
                                                    {patient.patient_name?.charAt(0) || 'P'}
                                                </div>
                                                <button 
                                                    style={s.clickablePatientName} 
                                                    onClick={() => handlePatientClick(patient.patient_name)}
                                                >
                                                    {patient.patient_name}
                                                </button>
                                            </div>

                                            {/* Diagnosis Column */}
                                            <div style={{fontWeight: '500', color: '#334155'}}>{patient.diagnosis}</div>

                                            {/* Dates Columns */}
                                            <div style={{color: '#64748b'}}>{patient.last_visit_date || '-'}</div>
                                            <div style={{color: patient.next_visit_date === 'Pending' ? '#ef4444' : '#02505F', fontWeight:'500'}}>
                                                {patient.next_visit_date || 'Pending'}
                                            </div>

                                            {/* DICOM Viewer Button Column */}
                                            <div>
                                                <button 
                                                    onClick={() => {
                                                        const patientData = {
                                                            id: patient.patient_id,
                                                            name: patient.patient_name,
                                                            patientId: `P-${patient.patient_id}`,
                                                            age: patient.age,
                                                            gender: patient.gender,
                                                            diagnosis: patient.diagnosis,
                                                            bloodType: patient.blood_type
                                                        };
                                                        localStorage.setItem('selectedPatientForDicom', JSON.stringify(patientData));
                                                        window.location.href = `/dicom-viewer?patientId=P-${patient.patient_id}`;
                                                    }}
                                                    style={{
                                                        ...s.actionButton,
                                                        padding: '6px 12px',
                                                        backgroundColor: '#8b5cf6',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px',
                                                        fontWeight: '500'
                                                    }}
                                                    title="View DICOM Images"
                                                >
                                                    DICOM
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
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

    
    // ========== MAIN RENDER ==========
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
                        >
                            <Home size={20} /> <span>Home</span>
                        </button>
                        
                        <button 
                            style={{...s.navItem, ...(activeTab === 'patients' ? s.navItemActive : {})}} 
                            onClick={() => {setActiveTab('patients'); setSelectedPatient(null);}}
                        >
                            <Users size={20} /> <span>Patients</span>
                        </button>

                        {/* DICOM Viewer Button in Sidebar */}
                        <button 
                            style={{...s.navItem}} 
                            onClick={() => window.location.href = '/dicom-viewer'}
                        >
                            <span style={{fontSize: '18px'}}>🩻</span> <span>DICOM Viewer</span>
                        </button>

                        <button 
                            style={{...s.navItem, ...(activeTab === 'profile-settings' ? s.navItemActive : {})}} 
                            onClick={() => {setActiveTab('profile-settings'); setSelectedPatient(null);}}
                        >
                            <User size={20} /> <span>Profile</span>
                        </button>
                        
                        <button 
                            style={s.logout}
                            onClick={handleLogout}
                        >
                            <LogOut size={20} /> <span>Logout</span>
                        </button>
                    </nav>

                    <div style={s.sidebarFooter}>
                        <div style={s.profilePic}>{doctorName.charAt(0) || 'D'}</div>
                        <div style={s.profileName}>Dr. {doctorName || 'Doctor'}</div>
                    </div>
                </div>

                {/* ROUTING LOGIC */}
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
            {/* MODALS */}
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
                selectedPatient={selectedPatient}
                onPrescribeSuccess={() => {
                    // Optional: Refresh patient data or show confirmation
                    if (selectedPatient) {
                        // You could trigger a refetch of patient data here
                    }
                }}
            />
            <RenderScanOrderModal 
                show={showScanOrderModal} 
                onClose={() => setShowScanOrderModal(false)}
                selectedPatient={selectedPatient}
                onOrderSuccess={() => {
                    // Optional: Refresh scans data or show confirmation
                    if (selectedPatient) {
                        // You could trigger a refetch of patient scans here
                    }
                }}
            />
        </div>
    );
}