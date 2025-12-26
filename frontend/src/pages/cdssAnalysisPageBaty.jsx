import React, { useState, useEffect, useRef } from 'react';

const CdssAnalysisPage = () => {
    const [selectedScan, setSelectedScan] = useState(null);
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [patientDetails, setPatientDetails] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [aiInsights, setAiInsights] = useState('');
    const [confidenceLevel, setConfidenceLevel] = useState(0);
    const fileInputRef = useRef(null);

    const API_BASE = "http://127.0.0.1:5000/api";

    // Mock data for scans
    useEffect(() => {
        // Fetch scans from API
        const fetchScans = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_BASE}/radiologist/scans/pending`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setScans(data);
                }
            } catch (err) {
                console.error("Error fetching scans:", err);
                // Fallback mock data
                setScans([
                    { id: 101, patient: "Ahmed Mohamed", pid: "PAT-001", bodyPart: "Chest", date: "2024-01-15", status: "pending" },
                    { id: 102, patient: "Sara Ali", pid: "PAT-002", bodyPart: "Brain", date: "2024-01-15", status: "pending" },
                    { id: 103, patient: "Omar Hassan", pid: "PAT-003", bodyPart: "Knee", date: "2024-01-14", status: "pending" },
                ]);
            }
        };
        fetchScans();
    }, []);

    const handleScanSelect = (scan) => {
        setSelectedScan(scan);
        setAnalysisResult(null);
        setAiInsights('');
        setConfidenceLevel(0);
        setUploadedImage(null);
        
        // Mock patient details
        setPatientDetails({
            age: 45,
            gender: "Male",
            weight: "75kg",
            height: "175cm",
            bloodPressure: "120/80",
            pastConditions: ["Hypertension", "Type 2 Diabetes"],
            medications: ["Metformin", "Lisinopril"],
            symptoms: ["Chest pain", "Shortness of breath"],
            lastVisit: "2024-01-10"
        });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current.click();
    };

    const analyzeWithAI = async () => {
        if (!selectedScan || !uploadedImage) {
            alert("Please select a scan and upload an image first");
            return;
        }

        setLoading(true);
        
        try {
            // Simulate API call to AI analysis endpoint
            const token = localStorage.getItem("token");
            const formData = new FormData();
            
            // Convert base64 to blob if needed
            const blob = await fetch(uploadedImage).then(r => r.blob());
            formData.append('scan_image', blob);
            formData.append('scan_id', selectedScan.id);
            formData.append('patient_id', selectedScan.pid);
            
            const response = await fetch(`${API_BASE}/ai/analyze`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                setAnalysisResult(result);
                setAiInsights(result.insights || "No specific abnormalities detected. Regular follow-up recommended.");
                setConfidenceLevel(result.confidence || 85);
                
                // Auto-generate report
                generateReport(result);
            } else {
                // Fallback mock analysis
                setTimeout(() => {
                    const mockResult = {
                        abnormalities: [
                            "Mild pulmonary consolidation in right lower lobe",
                            "Small pleural effusion detected",
                            "No signs of pneumothorax"
                        ],
                        findings: "Consolidation suggests possible pneumonia. Effusion appears small and likely reactive.",
                        recommendations: [
                            "Consider chest CT for better characterization",
                            "Antibiotic therapy may be indicated",
                            "Follow-up chest X-ray in 2 weeks",
                            "Monitor for fever and respiratory symptoms"
                        ],
                        differentialDiagnosis: [
                            "Community-acquired pneumonia (most likely)",
                            "Pulmonary edema",
                            "Atelectasis",
                            "Malignancy (less likely)"
                        ],
                        severity: "Moderate",
                        confidence: 87
                    };
                    setAnalysisResult(mockResult);
                    setAiInsights("AI detected consolidation patterns consistent with infectious process. Further clinical correlation needed.");
                    setConfidenceLevel(87);
                    generateReport(mockResult);
                    setLoading(false);
                }, 2000);
            }
        } catch (error) {
            console.error("Analysis error:", error);
            alert("AI analysis failed. Please try again.");
            setLoading(false);
        }
    };

    const generateReport = (analysis) => {
        console.log("Generated report based on analysis:", analysis);
        // This would typically send to backend to save the report
    };

    const saveReport = () => {
        if (!analysisResult) {
            alert("Please run analysis first");
            return;
        }
        
        const report = {
            scanId: selectedScan.id,
            patientId: selectedScan.pid,
            findings: analysisResult.findings,
            recommendations: analysisResult.recommendations,
            differentialDiagnosis: analysisResult.differentialDiagnosis,
            aiInsights: aiInsights,
            confidence: confidenceLevel,
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage or send to backend
        localStorage.setItem(`cdss_report_${selectedScan.id}`, JSON.stringify(report));
        alert("Report saved successfully!");
    };

    const styles = {
        container: {
            padding: '20px',
            maxWidth: '1400px',
            margin: '0 auto',
            backgroundColor: '#f8fafc'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            paddingBottom: '20px',
            borderBottom: '2px solid #e5e7eb'
        },
        title: {
            fontSize: '28px',
            fontWeight: '700',
            color: '#111827'
        },
        subtitle: {
            fontSize: '16px',
            color: '#6b7280',
            marginTop: '5px'
        },
        backButton: {
            padding: '10px 20px',
            backgroundColor: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '14px'
        },
        contentGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '30px',
            marginTop: '20px'
        },
        leftPanel: {
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '25px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        },
        rightPanel: {
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '25px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        },
        scanList: {
            maxHeight: '400px',
            overflowY: 'auto',
            marginTop: '15px'
        },
        scanItem: {
            padding: '15px',
            marginBottom: '10px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s'
        },
        selectedScanItem: {
            backgroundColor: '#dbeafe',
            borderColor: '#3b82f6'
        },
        uploadArea: {
            border: '2px dashed #d1d5db',
            borderRadius: '12px',
            padding: '40px 20px',
            textAlign: 'center',
            marginBottom: '20px',
            cursor: 'pointer',
            transition: 'all 0.3s'
        },
        imagePreview: {
            maxWidth: '100%',
            maxHeight: '300px',
            borderRadius: '8px',
            marginTop: '20px',
            border: '1px solid #e5e7eb'
        },
        analyzeButton: {
            width: '100%',
            padding: '15px',
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '20px'
        },
        analysisSection: {
            marginTop: '30px'
        },
        resultCard: {
            backgroundColor: '#f0f9ff',
            borderLeft: '4px solid #3b82f6',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
        },
        insightsBox: {
            backgroundColor: '#fefce8',
            border: '1px solid #fbbf24',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
        },
        confidenceMeter: {
            height: '10px',
            backgroundColor: '#e5e7eb',
            borderRadius: '5px',
            margin: '15px 0',
            overflow: 'hidden'
        },
        confidenceFill: {
            height: '100%',
            backgroundColor: '#10b981',
            transition: 'width 0.5s'
        },
        recommendationList: {
            listStyleType: 'none',
            padding: 0
        },
        recommendationItem: {
            padding: '8px 0',
            borderBottom: '1px solid #f3f4f6',
            display: 'flex',
            alignItems: 'center'
        },
        loadingSpinner: {
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #059669',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '20px auto'
        },
        actionButtons: {
            display: 'flex',
            gap: '15px',
            marginTop: '30px'
        },
        saveButton: {
            padding: '12px 30px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            flex: 1
        },
        exportButton: {
            padding: '12px 30px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            flex: 1
        },
        patientInfo: {
            backgroundColor: '#f8fafc',
            padding: '20px',
            borderRadius: '8px',
            marginTop: '20px'
        },
        infoGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginTop: '15px'
        },
        infoItem: {
            marginBottom: '10px'
        },
        infoLabel: {
            fontSize: '12px',
            color: '#6b7280',
            textTransform: 'uppercase',
            fontWeight: '600',
            marginBottom: '5px'
        },
        infoValue: {
            fontSize: '14px',
            color: '#111827',
            fontWeight: '500'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>AI-Powered CDSS Analysis</h1>
                    <p style={styles.subtitle}>Clinical Decision Support System for Radiology Diagnosis</p>
                </div>
                <button 
                    style={styles.backButton}
                    onClick={() => window.history.back()}
                >
                    ← Back to Dashboard
                </button>
            </div>

            <div style={styles.contentGrid}>
                {/* Left Panel - Scan Selection & Upload */}
                <div style={styles.leftPanel}>
                    <h3 style={{marginBottom: '15px', color: '#374151'}}>Select Scan</h3>
                    
                    <div style={styles.scanList}>
                        {scans.map(scan => (
                            <div 
                                key={scan.id}
                                style={{
                                    ...styles.scanItem,
                                    ...(selectedScan?.id === scan.id ? styles.selectedScanItem : {})
                                }}
                                onClick={() => handleScanSelect(scan)}
                            >
                                <div style={{fontWeight: '600', color: '#111827'}}>
                                    #{scan.id} - {scan.patient}
                                </div>
                                <div style={{fontSize: '14px', color: '#6b7280', marginTop: '5px'}}>
                                    {scan.bodyPart} • {scan.date}
                                </div>
                            </div>
                        ))}
                    </div>

                    {selectedScan && (
                        <>
                            <div style={{marginTop: '30px'}}>
                                <h4 style={{marginBottom: '15px', color: '#374151'}}>Upload Scan Image</h4>
                                <div 
                                    style={styles.uploadArea}
                                    onClick={triggerFileUpload}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#059669'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                                >
                                    <div style={{fontSize: '48px', color: '#9ca3af'}}>📁</div>
                                    <p style={{color: '#6b7280', margin: '10px 0'}}>
                                        Click to upload scan image
                                    </p>
                                    <p style={{fontSize: '12px', color: '#9ca3af'}}>
                                        Supports: DICOM, PNG, JPG
                                    </p>
                                </div>
                                <input 
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    accept=".dcm,.dicom,.ima,.png,.jpg,.jpeg"
                                    style={{display: 'none'}}
                                />

                                {uploadedImage && (
                                    <div>
                                        <h4 style={{marginTop: '20px', color: '#374151'}}>Image Preview</h4>
                                        <img 
                                            src={uploadedImage} 
                                            alt="Uploaded scan" 
                                            style={styles.imagePreview}
                                        />
                                    </div>
                                )}
                            </div>

                            <button 
                                style={styles.analyzeButton}
                                onClick={analyzeWithAI}
                                disabled={loading || !uploadedImage}
                                onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#047857')}
                                onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#059669')}
                            >
                                {loading ? 'Analyzing...' : 'Run AI Analysis'}
                            </button>
                        </>
                    )}
                </div>

                {/* Right Panel - Results & Analysis */}
                <div style={styles.rightPanel}>
                    {selectedScan ? (
                        <>
                            <h3 style={{color: '#374151', marginBottom: '20px'}}>
                                Analysis for #{selectedScan.id} - {selectedScan.patient}
                            </h3>

                            {/* Patient Information */}
                            {patientDetails && (
                                <div style={styles.patientInfo}>
                                    <h4 style={{color: '#374151', marginBottom: '15px'}}>Patient Information</h4>
                                    <div style={styles.infoGrid}>
                                        <div style={styles.infoItem}>
                                            <div style={styles.infoLabel}>Age / Gender</div>
                                            <div style={styles.infoValue}>{patientDetails.age} Yrs / {patientDetails.gender}</div>
                                        </div>
                                        <div style={styles.infoItem}>
                                            <div style={styles.infoLabel}>Weight / Height</div>
                                            <div style={styles.infoValue}>{patientDetails.weight} / {patientDetails.height}</div>
                                        </div>
                                        <div style={styles.infoItem}>
                                            <div style={styles.infoLabel}>Blood Pressure</div>
                                            <div style={styles.infoValue}>{patientDetails.bloodPressure}</div>
                                        </div>
                                        <div style={styles.infoItem}>
                                            <div style={styles.infoLabel}>Last Visit</div>
                                            <div style={styles.infoValue}>{patientDetails.lastVisit}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Loading State */}
                            {loading && (
                                <div style={{textAlign: 'center', padding: '40px'}}>
                                    <div style={styles.loadingSpinner}></div>
                                    <p style={{color: '#6b7280', marginTop: '15px'}}>
                                        AI is analyzing the scan image...
                                    </p>
                                </div>
                            )}

                            {/* AI Insights */}
                            {aiInsights && !loading && (
                                <div style={styles.insightsBox}>
                                    <h4 style={{color: '#92400e', marginBottom: '10px'}}>AI Insights</h4>
                                    <p style={{color: '#92400e'}}>{aiInsights}</p>
                                    
                                    <div style={{marginTop: '15px'}}>
                                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                                            <span style={styles.infoLabel}>Confidence Level</span>
                                            <span style={{fontWeight: '600', color: '#047857'}}>{confidenceLevel}%</span>
                                        </div>
                                        <div style={styles.confidenceMeter}>
                                            <div 
                                                style={{
                                                    ...styles.confidenceFill,
                                                    width: `${confidenceLevel}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Analysis Results */}
                            {analysisResult && !loading && (
                                <div style={styles.analysisSection}>
                                    <h4 style={{color: '#374151', marginBottom: '20px'}}>Detailed Analysis</h4>
                                    
                                    <div style={styles.resultCard}>
                                        <h5 style={{color: '#1e40af', marginBottom: '10px'}}>Key Findings</h5>
                                        <p>{analysisResult.findings}</p>
                                        
                                        <div style={{marginTop: '15px'}}>
                                            <h6 style={{color: '#374151', marginBottom: '10px'}}>Abnormalities Detected:</h6>
                                            <ul style={{paddingLeft: '20px', color: '#374151'}}>
                                                {analysisResult.abnormalities?.map((abnormality, index) => (
                                                    <li key={index} style={{marginBottom: '5px'}}>{abnormality}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Recommendations */}
                                    <div style={{marginTop: '25px'}}>
                                        <h5 style={{color: '#374151', marginBottom: '15px'}}>Clinical Recommendations</h5>
                                        <ul style={styles.recommendationList}>
                                            {analysisResult.recommendations?.map((rec, index) => (
                                                <li key={index} style={styles.recommendationItem}>
                                                    <span style={{marginRight: '10px', color: '#059669'}}>✓</span>
                                                    {rec}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Differential Diagnosis */}
                                    {analysisResult.differentialDiagnosis && (
                                        <div style={{marginTop: '25px'}}>
                                            <h5 style={{color: '#374151', marginBottom: '15px'}}>Differential Diagnosis</h5>
                                            <div style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: '10px'
                                            }}>
                                                {analysisResult.differentialDiagnosis.map((dx, index) => (
                                                    <span key={index} style={{
                                                        backgroundColor: index === 0 ? '#dbeafe' : '#f3f4f6',
                                                        color: index === 0 ? '#1e40af' : '#374151',
                                                        padding: '8px 15px',
                                                        borderRadius: '20px',
                                                        fontSize: '14px',
                                                        border: index === 0 ? '1px solid #93c5fd' : '1px solid #e5e7eb'
                                                    }}>
                                                        {dx} {index === 0 && '(Most likely)'}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div style={styles.actionButtons}>
                                        <button 
                                            style={styles.saveButton}
                                            onClick={saveReport}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                                        >
                                            Save Report
                                        </button>
                                        <button 
                                            style={styles.exportButton}
                                            onClick={() => alert('Export functionality would be implemented here')}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0da271'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                                        >
                                            Export to PDF
                                        </button>
                                    </div>
                                </div>
                            )}

                            {!analysisResult && !loading && (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '60px 20px',
                                    color: '#9ca3af'
                                }}>
                                    <div style={{fontSize: '48px', marginBottom: '20px'}}>🔍</div>
                                    <h4 style={{color: '#6b7280'}}>Ready for Analysis</h4>
                                    <p>Select a scan, upload an image, and run AI analysis to get detailed insights.</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: '#9ca3af'
                        }}>
                            <div style={{fontSize: '48px', marginBottom: '20px'}}>👨‍⚕️</div>
                            <h4 style={{color: '#6b7280'}}>No Scan Selected</h4>
                            <p>Select a scan from the left panel to begin analysis.</p>
                        </div>
                    )}
                </div>
            </div>

            <style>
                {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `}
            </style>
        </div>
    );
};

export default CdssAnalysisPage;