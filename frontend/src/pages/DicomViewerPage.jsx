import React, { useState, useRef, useEffect } from 'react';
import { dicomViewerStyles } from "../styles/DicomViewerStyles";

export default function DicomViewerPage() {
  // --- STATE MANAGEMENT ---
  const [currentView, setCurrentView] = useState('single');
  const [currentPane, setCurrentPane] = useState('axial');
  const [activeTool, setActiveTool] = useState('pan');
  const [activeSeries, setActiveSeries] = useState(2);
  
  // Image Adjustment States
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [sharpness, setSharpness] = useState(50);
  const [noiseReduction, setNoiseReduction] = useState(0); 
  const [enableSmoothing, setEnableSmoothing] = useState(false);
  const [windowLevel, setWindowLevel] = useState({ width: 400, center: 40 });
  const [zoomLevel, setZoomLevel] = useState(100);
  
  // Navigation
  const [currentSlice, setCurrentSlice] = useState({ axial: 60, sagittal: 60, coronal: 60 });
  const [rotation, setRotation] = useState({ axial: 0, sagittal: 0, coronal: 0 });
  
  // Pan state
  const [panPosition, setPanPosition] = useState({ axial: { x: 0, y: 0 }, sagittal: { x: 0, y: 0 }, coronal: { x: 0, y: 0 } });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Measurement tool state
  const [measurePoints, setMeasurePoints] = useState({ axial: [], sagittal: [], coronal: [] });
  const [anglePoints, setAnglePoints] = useState({ axial: [], sagittal: [], coronal: [] });
  
  // Window/Level adjustment state
  const [isAdjustingWL, setIsAdjustingWL] = useState(false);
  const [wlStart, setWlStart] = useState({ x: 0, y: 0 });

  // --- NEW STATE FOR PATIENT DATA ---
  const [sidebarMode, setSidebarMode] = useState('viewer');
  const [patientData, setPatientData] = useState(null);
  const [seriesData, setSeriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [cdssData, setCdssData] = useState({
    overallConfidence: 94,
    findings: [
      { id: 1, title: 'Grade 3 Pivot Shift Injury', confidence: 96 },
      { id: 2, title: 'Complete ACL tear (mid-substance)', confidence: 94 },
      { id: 3, title: 'Medial Meniscal Pathology', confidence: 88 },
    ],
    summary: 'MRI findings are consistent with a high-grade pivot shift injury pattern. Complete ACL tear and associated medial meniscal pathology detected.',
    recommendations: 'Surgical reconstruction of ACL recommended. Meniscal repair vs meniscectomy to be determined intra-operatively.',
    differential: 'Partial ACL tear, tibial spine avulsion, isolated MCL injury.'
  });

  // --- USE EFFECT FOR LOADING PATIENT DATA ---
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setIsLoading(true);
        
        // Get patient ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const patientIdParam = urlParams.get('patientId');
        
        if (!patientIdParam) {
          console.error('No patient ID in URL');
          setIsLoading(false);
          return;
        }
        
        // Extract numeric ID from "P-31" format
        const patientId = patientIdParam.replace('P-', '');
        
        // Get token for authentication
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('No authentication token found');
          setIsLoading(false);
          return;
        }
        
        // Fetch patient DICOM data
        const response = await fetch(`http://127.0.0.1:5000/api/dicom/patient-data/${patientId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success) {
            setPatientData(data.patient);
            setSeriesData(data.series || []);
            
            // If CDSS data is available from API, use it
            if (data.cdss_data) {
              setCdssData(data.cdss_data);
            }
            
            console.log('Patient data loaded:', data.patient);
          } else {
            console.error('Failed to load patient data:', data.error);
            // Fallback to mock data
            setFallbackData();
          }
        } else {
          console.error('API error:', response.status);
          setFallbackData();
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
        setFallbackData();
      } finally {
        setIsLoading(false);
      }
    };
    
    const setFallbackData = () => {
      // Get patient from localStorage as fallback
      const storedPatient = localStorage.getItem('selectedPatientForDicom');
      if (storedPatient) {
        try {
          const parsedPatient = JSON.parse(storedPatient);
          setPatientData(parsedPatient);
        } catch (e) {
          console.error('Error parsing stored patient:', e);
        }
      }
      
      // Set fallback series data
      setSeriesData([
        { id: 1, name: 'Coronal View', count: 1, type: 'Localizer' },
        { id: 2, name: 'Axial Bone 2.0', count: 120, type: 'Bone' },
        { id: 3, name: 'Sagittal Reformat', count: 85, type: 'Soft Tissue' },
        { id: 4, name: '3D Volume View', count: 1, type: 'Volume' },
      ]);
    };
    
    fetchPatientData();
  }, []);

  // --- HANDLERS ---
  const handleBackToDashboard = () => {
    window.history.back();
  };

  const handleLogout = () => {
    window.location.href = '/login';
  };

  const handleToolSelect = (tool) => {
    setActiveTool(tool);
    if (tool !== 'measure') setMeasurePoints({ axial: [], sagittal: [], coronal: [] });
    if (tool !== 'angle') setAnglePoints({ axial: [], sagittal: [], coronal: [] });
  };

  const handleReset = () => {
    setBrightness(100);
    setContrast(100);
    setSharpness(50);
    setNoiseReduction(0);
    setEnableSmoothing(false);
    setZoomLevel(100);
    setRotation({ axial: 0, sagittal: 0, coronal: 0 });
    setCurrentSlice({ axial: 60, sagittal: 60, coronal: 60 });
    setPanPosition({ axial: { x: 0, y: 0 }, sagittal: { x: 0, y: 0 }, coronal: { x: 0, y: 0 } });
    setMeasurePoints({ axial: [], sagittal: [], coronal: [] });
    setAnglePoints({ axial: [], sagittal: [], coronal: [] });
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 300));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 25));

  const toggleView = () => {
    setCurrentView(prev => prev === 'mpr' ? 'single' : 'mpr');
  };

  const handleSeriesClick = (seriesId) => {
    setActiveSeries(seriesId);
    setCurrentView('single');

    // Map each series to its corresponding plane
    if (seriesId === 1) {
      setCurrentPane('coronal');
    } else if (seriesId === 2) {
      setCurrentPane('axial');
    } else if (seriesId === 3) {
      setCurrentPane('sagittal');
    } else if (seriesId === 4) {
      setCurrentPane('3d');
    }

    setCurrentSlice({ axial: 1, sagittal: 1, coronal: 1 });
  };

  const handleRotate = () => {
    if (currentView === 'single') {
      setRotation(prev => ({...prev, [currentPane]: (prev[currentPane] + 90) % 360}));
    } else {
      setRotation(prev => ({
        axial: (prev.axial + 90) % 360,
        sagittal: (prev.sagittal + 90) % 360,
        coronal: (prev.coronal + 90) % 360
      }));
    }
  };

  const calculateDistance = (p1, p2) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const pixels = Math.sqrt(dx * dx + dy * dy);
    return (pixels * 0.5).toFixed(1);
  };

  const calculateAngle = (p1, p2, p3) => {
    const angle1 = Math.atan2(p1.y - p2.y, p1.x - p2.x);
    const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
    let angle = Math.abs((angle1 - angle2) * 180 / Math.PI);
    if (angle > 180) angle = 360 - angle;
    return angle.toFixed(1);
  };

  // --- CDSS SPECIFIC HANDLERS ---
  const toggleSidebarMode = (mode) => {
    setSidebarMode(mode);
    if (mode === 'cdss') {
      setCurrentView('mpr');
    }
  };

  const handleCdssTextChange = (field, value) => {
    setCdssData(prev => ({ ...prev, [field]: value }));
  };

  const handleFindingEdit = (id, newTitle) => {
    setCdssData(prev => ({
      ...prev,
      findings: prev.findings.map(f => f.id === id ? { ...f, title: newTitle } : f)
    }));
  };

  const deleteFinding = (id) => {
    setCdssData(prev => ({
      ...prev,
      findings: prev.findings.filter(f => f.id !== id)
    }));
  };

  const addNewFinding = () => {
    const newId = Date.now();
    setCdssData(prev => ({
      ...prev,
      findings: [...prev.findings, { id: newId, title: 'New finding detected...', confidence: 50 }]
    }));
  };

  // Update the handleSaveCdssData function in DicomViewerPage.jsx
  const handleSaveCdssData = async () => {
    try {
      // Get patient ID from URL or state
      const urlParams = new URLSearchParams(window.location.search);
      const patientIdParam = urlParams.get('patientId');
      const patientId = patientIdParam ? patientIdParam.replace('P-', '') : patientData?.patient_id?.replace('P-', '');
      
      if (!patientId) {
        alert('No patient ID available');
        return;
      }
      
      // First, fetch the patient's scans to find the right scan ID
      const token = localStorage.getItem('token');
      
      // Fetch patient data to get scans
      const response = await fetch(`http://127.0.0.1:5000/api/dicom/patient-data/${patientId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch patient data');
      }
      
      const data = await response.json();
      
      if (!data.success || !data.scans || data.scans.length === 0) {
        alert('No scans found for this patient');
        return;
      }
      
      // Use the first scan or let user select one
      // For now, use the first scan that matches the current modality/body part
      let targetScan = data.scans[0];
      
      // Try to find a scan matching the current view
      if (patientData?.modality && patientData?.body_part) {
        const matchingScan = data.scans.find(scan => 
          scan.modality === patientData.modality && 
          scan.body_part === patientData.body_part
        );
        if (matchingScan) targetScan = matchingScan;
      }
      
      const scanId = targetScan.scan_id;
      
      console.log('Saving CDSS data to scan ID:', scanId, 'for patient ID:', patientId);
      
      // Now save the CDSS data
      const saveResponse = await fetch(`http://127.0.0.1:5000/api/dicom/update-cdss/${scanId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          doctor_notes: cdssData.summary,
          final_diagnosis: cdssData.summary,
          ai_recommendations: cdssData.recommendations,
          cdss_result: cdssData.differential,
          is_verified: true,
          confidence_score: cdssData.overallConfidence
        })
      });
      
      if (saveResponse.ok) {
        const result = await saveResponse.json();
        alert('CDSS data saved successfully!');
        console.log('Save response:', result);
        
        // Update local state to reflect saved changes
        setCdssData(prev => ({
          ...prev,
          is_verified: true
        }));
      } else {
        const error = await saveResponse.json();
        alert(`Failed to save: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving CDSS data:', error);
      alert('Error saving CDSS data: ' + error.message);
    }
  };

  // --- SUB-COMPONENTS ---
  
  const ViewportContent = ({ plane, sliceNumber }) => {
    const activeSeriesItem = seriesData.find(s => s.id === activeSeries);
    const viewportRef = useRef(null);
    
    const handleMouseDown = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (activeTool === 'pan') {
        setIsPanning(true);
        setPanStart({ x: e.clientX, y: e.clientY });
        setCurrentPane(plane);
      } else if (activeTool === 'window') {
        setIsAdjustingWL(true);
        setWlStart({ x: e.clientX, y: e.clientY });
        setCurrentPane(plane);
      } else if (activeTool === 'measure') {
        setMeasurePoints(prev => {
          const points = [...prev[plane]];
          if (points.length >= 2) {
            return { ...prev, [plane]: [{ x, y }] };
          }
          return { ...prev, [plane]: [...points, { x, y }] };
        });
      } else if (activeTool === 'angle') {
        setAnglePoints(prev => {
          const points = [...prev[plane]];
          if (points.length >= 3) {
            return { ...prev, [plane]: [{ x, y }] };
          }
          return { ...prev, [plane]: [...points, { x, y }] };
        });
      }
    };

    const handleMouseMove = (e) => {
      if (isPanning && activeTool === 'pan' && currentPane === plane) {
        const dx = e.clientX - panStart.x;
        const dy = e.clientY - panStart.y;
        setPanPosition(prev => ({
          ...prev,
          [plane]: {
            x: prev[plane].x + dx,
            y: prev[plane].y + dy
          }
        }));
        setPanStart({ x: e.clientX, y: e.clientY });
      } else if (isAdjustingWL && activeTool === 'window' && currentPane === plane) {
        const dx = e.clientX - wlStart.x;
        const dy = e.clientY - wlStart.y;
        
        setWindowLevel(prev => ({
          width: Math.max(1, prev.width + dx * 2),
          center: Math.max(-1024, Math.min(3071, prev.center - dy))
        }));
        setWlStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsPanning(false);
      setIsAdjustingWL(false);
    };

    const filterStyle = {
      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${sharpness}%) blur(${enableSmoothing ? '1px' : '0px'})`,
      transform: `scale(${zoomLevel / 100}) rotate(${rotation[plane]}deg) translate(${panPosition[plane].x}px, ${panPosition[plane].y}px)`,
      transition: activeTool === 'pan' || activeTool === 'window' ? 'none' : 'all 0.2s ease',
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      cursor: activeTool === 'pan' ? 'grab' : activeTool === 'window' ? 'crosshair' : activeTool === 'measure' || activeTool === 'angle' ? 'crosshair' : 'default'
    };

    // Use patient-specific images if available
    let imageUrl = '';
    if (plane === 'axial') {
      imageUrl = patientData?.scanImage || '/axial.jpeg';
    } else if (plane === 'sagittal') {
      imageUrl = patientData?.scanImage || '/sagittal.jpg';
    } else if (plane === 'coronal') {
      imageUrl = patientData?.scanImage || '/coronal.jpg';
    }

    const measurements = measurePoints[plane] || [];
    const angles = anglePoints[plane] || [];

    return (
      <div style={dicomViewerStyles.viewportInner} 
           onMouseDown={handleMouseDown}
           onMouseMove={handleMouseMove}
           onMouseUp={handleMouseUp}
           onMouseLeave={handleMouseUp}
           ref={viewportRef}>
        
        <div style={dicomViewerStyles.dicomImage}>
          <img 
            src={imageUrl} 
            alt={plane}
            style={filterStyle}
            draggable={false}
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              if (plane === 'axial') {
                e.target.src = '/axial.jpeg';
              } else if (plane === 'sagittal') {
                e.target.src = '/sagittal.jpg';
              } else if (plane === 'coronal') {
                e.target.src = '/coronal.jpg';
              }
            }}
          />
          
          {currentView === 'mpr' && (
            <>
              <div style={dicomViewerStyles.crosshairVertical}></div>
              <div style={dicomViewerStyles.crosshairHorizontal}></div>
            </>
          )}

          {measurements.length === 2 && (
            <>
              <svg style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
                <line 
                  x1={measurements[0].x} 
                  y1={measurements[0].y} 
                  x2={measurements[1].x} 
                  y2={measurements[1].y} 
                  stroke="#34d399" 
                  strokeWidth="2"
                />
                <circle cx={measurements[0].x} cy={measurements[0].y} r="4" fill="#34d399" />
                <circle cx={measurements[1].x} cy={measurements[1].y} r="4" fill="#34d399" />
              </svg>
              <div style={{
                position: 'absolute',
                left: (measurements[0].x + measurements[1].x) / 2,
                top: (measurements[0].y + measurements[1].y) / 2 - 20,
                color: '#34d399',
                fontWeight: 'bold',
                fontSize: '14px',
                textShadow: '0 0 4px black',
                backgroundColor: 'rgba(0,0,0,0.7)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                {calculateDistance(measurements[0], measurements[1])} mm
              </div>
            </>
          )}

          {angles.length === 3 && (
            <>
              <svg style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
                <line x1={angles[0].x} y1={angles[0].y} x2={angles[1].x} y2={angles[1].y} stroke="#fbbf24" strokeWidth="2" />
                <line x1={angles[1].x} y1={angles[1].y} x2={angles[2].x} y2={angles[2].y} stroke="#fbbf24" strokeWidth="2" />
                <circle cx={angles[0].x} cy={angles[0].y} r="4" fill="#fbbf24" />
                <circle cx={angles[1].x} cy={angles[1].y} r="4" fill="#fbbf24" />
                <circle cx={angles[2].x} cy={angles[2].y} r="4" fill="#fbbf24" />
              </svg>
              <div style={{
                position: 'absolute',
                left: angles[1].x + 10,
                top: angles[1].y - 25,
                color: '#fbbf24',
                fontWeight: 'bold',
                fontSize: '14px',
                textShadow: '0 0 4px black',
                backgroundColor: 'rgba(0,0,0,0.7)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                {calculateAngle(angles[0], angles[1], angles[2])}°
              </div>
            </>
          )}

          <div style={dicomViewerStyles.planeLabel}>{plane.toUpperCase()}</div>
          
          <div style={dicomViewerStyles.sliceInfo}>
            <div>Slice: {sliceNumber}/{activeSeriesItem?.count || 120}</div>
            <div>WL: {windowLevel.center} / WW: {windowLevel.width}</div>
            <div>Zoom: {zoomLevel}%</div>
            {enableSmoothing && <div style={{color: '#10b981'}}>Smooth: ON</div>}
          </div>

          <div style={dicomViewerStyles.anatomicalMarkers}>
             <span style={{position: 'absolute', top: 5, left: '50%'}}>S</span>
             <span style={{position: 'absolute', bottom: 5, left: '50%'}}>I</span>
             <span style={{position: 'absolute', left: 5, top: '50%'}}>R</span>
             <span style={{position: 'absolute', right: 5, top: '50%'}}>L</span>
          </div>
        </div>

        <input
          type="range"
          min="1"
          max={activeSeriesItem?.count || 120}
          value={sliceNumber}
          onChange={(e) => setCurrentSlice(prev => ({...prev, [plane]: parseInt(e.target.value)}))}
          style={dicomViewerStyles.sliceSlider}
        />
      </div>
    );
  };

  const VolumeView = () => {
    const [volumePreset, setVolumePreset] = useState('bone');
    
    return (
      <div style={dicomViewerStyles.viewportInner}>
        <div style={dicomViewerStyles.volumeContainer}>
          <div style={dicomViewerStyles.volumePlaceholder}>
            <div style={{fontSize: '48px', marginBottom: '10px'}}>🦴</div>
            <div style={{fontSize: '14px', color: '#9ca3af', marginBottom: '8px'}}>
              3D Volume Rendering
            </div>
            <div style={{fontSize: '12px', color: '#6b7280'}}>
              Preset: {volumePreset === 'bone' ? 'Bone' : volumePreset === 'mip' ? 'Maximum Intensity' : 'Surface Rendering'}
            </div>
            <div style={{fontSize: '11px', color: '#4b5563', marginTop: '8px'}}>
              Interactive 3D reconstruction would appear here
            </div>
          </div>
          <div style={dicomViewerStyles.volumeControls}>
            <button 
              style={{...dicomViewerStyles.volumeBtn, backgroundColor: volumePreset === 'bone' ? '#059669' : '#374151'}} 
              title="Bone Preset"
              onClick={() => setVolumePreset('bone')}
            >
              🦴 Bone
            </button>
            <button 
              style={{...dicomViewerStyles.volumeBtn, backgroundColor: volumePreset === 'mip' ? '#059669' : '#374151'}} 
              title="Maximum Intensity Projection"
              onClick={() => setVolumePreset('mip')}
            >
              📊 MIP
            </button>
            <button 
              style={{...dicomViewerStyles.volumeBtn, backgroundColor: volumePreset === 'surface' ? '#059669' : '#374151'}} 
              title="Surface Rendering"
              onClick={() => setVolumePreset('surface')}
            >
              🔬 Surface
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div style={dicomViewerStyles.container}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#111827',
          color: 'white'
        }}>
          Loading DICOM viewer for patient...
        </div>
      </div>
    );
  }

  return (
    <div style={dicomViewerStyles.container}>
      
      {/* --- TOP TOOLBAR --- */}
      <div style={dicomViewerStyles.toolbar}>
        <div style={dicomViewerStyles.toolbarLeft}>
          <button 
            onClick={handleBackToDashboard}
            style={dicomViewerStyles.backBtn}
          >
            ← Back
          </button>
          <div style={dicomViewerStyles.toolbarTitle}>
            <span style={{fontSize: '18px', fontWeight: '700'}}>DICOM Viewer</span>
            <span style={{fontSize: '12px', color: '#9ca3af', marginLeft: '12px'}}>
              {patientData ? `${patientData.patient_name} • ${patientData.patient_id}` : 'Loading...'}
            </span>
          </div>
        </div>

        <div style={dicomViewerStyles.toolGroup}>
          <button 
            style={{...dicomViewerStyles.toolBtn, ...(activeTool === 'pan' && dicomViewerStyles.toolBtnActive)}}
            onClick={() => handleToolSelect('pan')}
            title="Pan - Drag to move the image"
          >🤚 Pan</button>
          <button 
            style={{...dicomViewerStyles.toolBtn, ...(activeTool === 'window' && dicomViewerStyles.toolBtnActive)}}
            onClick={() => handleToolSelect('window')}
            title="Window/Level - Adjust brightness and contrast"
          >⚪ W/L</button>
          <button 
            style={{...dicomViewerStyles.toolBtn, ...(activeTool === 'measure' && dicomViewerStyles.toolBtnActive)}}
            onClick={() => handleToolSelect('measure')}
            title="Measure - Click two points to measure distance"
          >📏 Measure</button>
          <button 
            style={{...dicomViewerStyles.toolBtn, ...(activeTool === 'angle' && dicomViewerStyles.toolBtnActive)}}
            onClick={() => handleToolSelect('angle')}
            title="Angle - Click three points to measure angle"
          >📐 Angle</button>
          <button 
            style={dicomViewerStyles.toolBtn}
            onClick={handleRotate}
            title="Rotate - Rotate the image 90 degrees"
          >⤵️ Rotate</button>
          <button 
            style={dicomViewerStyles.toolBtn}
            onClick={toggleView}
          >{currentView === 'mpr' ? '⊞' : '⊡'} MPR</button>
          <button 
            style={dicomViewerStyles.toolBtn}
            onClick={handleReset}
          >↻ Reset</button>
        </div>

        <div style={dicomViewerStyles.toolbarRight}>
          <button style={dicomViewerStyles.zoomBtn} onClick={handleZoomOut}>−</button>
          <span style={dicomViewerStyles.zoomDisplay}>{zoomLevel}%</span>
          <button style={dicomViewerStyles.zoomBtn} onClick={handleZoomIn}>+</button>
          <button style={dicomViewerStyles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div style={dicomViewerStyles.mainContent}>
        
        {/* LEFT SIDEBAR */}
        <div style={dicomViewerStyles.sidebar}>
          
          {/* --- NEW: SIDEBAR TABS --- */}
          <div style={dicomViewerStyles.sidebarTabs}>
            <button 
              style={sidebarMode === 'viewer' ? {...dicomViewerStyles.sidebarTab, ...dicomViewerStyles.sidebarTabActive} : dicomViewerStyles.sidebarTab}
              onClick={() => toggleSidebarMode('viewer')}
            >
              👁️ Viewer
            </button>
            <button 
              style={sidebarMode === 'cdss' ? {...dicomViewerStyles.sidebarTab, ...dicomViewerStyles.sidebarTabActive} : dicomViewerStyles.sidebarTab}
              onClick={() => toggleSidebarMode('cdss')}
            >
              🤖 CDSS Analysis
            </button>
          </div>
          {/* ------------------------- */}
          
          <div style={dicomViewerStyles.patientCard}>
            <div style={dicomViewerStyles.cardTitle}>Patient Information</div>
            {patientData ? (
              <>
                <div style={dicomViewerStyles.infoRow}>
                  <span style={dicomViewerStyles.infoLabel}>Name:</span>
                  <span>{patientData.patient_name}</span>
                </div>
                <div style={dicomViewerStyles.infoRow}>
                  <span style={dicomViewerStyles.infoLabel}>ID:</span>
                  <span>{patientData.patient_id}</span>
                </div>
                <div style={dicomViewerStyles.infoRow}>
                  <span style={dicomViewerStyles.infoLabel}>Modality:</span>
                  <span style={dicomViewerStyles.infoBadge}>{patientData.modality}</span>
                </div>
                <div style={dicomViewerStyles.infoRow}>
                  <span style={dicomViewerStyles.infoLabel}>Body Part:</span>
                  <span>{patientData.body_part}</span>
                </div>
                <div style={dicomViewerStyles.infoRow}>
                  <span style={dicomViewerStyles.infoLabel}>Diagnosis:</span>
                  <span style={{color: '#ef4444', fontSize: '12px'}}>{patientData.diagnosis}</span>
                </div>
              </>
            ) : (
              <div style={{padding: '20px', textAlign: 'center', color: '#9ca3af'}}>
                Loading patient data...
              </div>
            )}
          </div>

          {/* --- CONDITION 1: STANDARD VIEWER MODE --- */}
          {sidebarMode === 'viewer' && (
            <>
              <div style={dicomViewerStyles.seriesCard}>
                <div style={dicomViewerStyles.cardTitle}>Series List</div>
                <div style={dicomViewerStyles.seriesList}>
                  {seriesData.map(series => (
                    <div 
                      key={series.id}
                      onClick={() => handleSeriesClick(series.id)}
                      style={{
                        ...dicomViewerStyles.seriesItem,
                        ...(activeSeries === series.id ? dicomViewerStyles.seriesItemActive : {})
                      }}
                    >
                      <div style={dicomViewerStyles.seriesThumb}>📷</div>
                      <div>
                        <div style={dicomViewerStyles.seriesName}>{series.name}</div>
                        <div style={dicomViewerStyles.seriesInfo}>{series.count} images</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={dicomViewerStyles.enhancementCard}>
                <div style={dicomViewerStyles.cardTitle}>Image Enhancement</div>
                
                <div style={dicomViewerStyles.sliderGroup}>
                  <label style={dicomViewerStyles.sliderLabel}><span>☀️ Brightness</span><span style={dicomViewerStyles.sliderValue}>{brightness}%</span></label>
                  <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(parseInt(e.target.value))} style={dicomViewerStyles.slider} />
                </div>

                <div style={dicomViewerStyles.sliderGroup}>
                  <label style={dicomViewerStyles.sliderLabel}><span>◐ Contrast</span><span style={dicomViewerStyles.sliderValue}>{contrast}%</span></label>
                  <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(parseInt(e.target.value))} style={dicomViewerStyles.slider} />
                </div>

                <div style={dicomViewerStyles.sliderGroup}>
                  <label style={dicomViewerStyles.sliderLabel}><span>✨ Sharpness</span><span style={dicomViewerStyles.sliderValue}>{sharpness}%</span></label>
                  <input type="range" min="0" max="200" value={sharpness} onChange={(e) => setSharpness(parseInt(e.target.value))} style={dicomViewerStyles.slider} />
                </div>

                <div style={dicomViewerStyles.sliderGroup}>
                  <label style={dicomViewerStyles.sliderLabel}><span>🔇 Noise Reduct.</span><span style={dicomViewerStyles.sliderValue}>{noiseReduction}%</span></label>
                  <input type="range" min="0" max="100" value={noiseReduction} onChange={(e) => setNoiseReduction(parseInt(e.target.value))} style={dicomViewerStyles.slider} />
                </div>

                <div style={{...dicomViewerStyles.infoRow, marginTop: '12px'}}>
                  <span style={dicomViewerStyles.infoLabel}>☁️ Smooth Filter</span>
                  <input type="checkbox" checked={enableSmoothing} onChange={(e) => setEnableSmoothing(e.target.checked)} style={{accentColor: '#059669', width: '18px', height: '18px', cursor: 'pointer'}} />
                </div>

                <div style={{marginTop: '20px'}}>
                  <div style={{...dicomViewerStyles.sliderLabel, marginBottom: '10px'}}><span>Presets</span></div>
                  <div style={dicomViewerStyles.presetGrid}>
                    <button style={dicomViewerStyles.presetBtn} onClick={() => setWindowLevel({width: 400, center: 40})}>Bone</button>
                    <button style={dicomViewerStyles.presetBtn} onClick={() => setWindowLevel({width: 350, center: 50})}>Soft Tissue</button>
                    <button style={dicomViewerStyles.presetBtn} onClick={() => setWindowLevel({width: 250, center: 35})}>Cartilage</button>
                    <button style={dicomViewerStyles.presetBtn} onClick={() => setWindowLevel({width: 1500, center: -600})}>Reset</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* --- CONDITION 2: CDSS ANALYSIS MODE --- */}
          {sidebarMode === 'cdss' && (
             <div style={dicomViewerStyles.cdssContainer}>
              <button style={dicomViewerStyles.cdssRunBtn}>
                🚀 Run AI Analysis
              </button>

              <div style={dicomViewerStyles.confidenceWidget}>
                <div style={dicomViewerStyles.confidenceHeader}>
                  <span>AI Confidence Level</span>
                  <span style={dicomViewerStyles.confidenceScoreBig}>{cdssData.overallConfidence}%</span>
                </div>
                <div style={dicomViewerStyles.progressBarBg}>
                  <div style={{...dicomViewerStyles.progressBarFill, width: `${cdssData.overallConfidence}%`}}></div>
                </div>
              </div>

              <div style={dicomViewerStyles.sectionTitle}>Detected Findings (Editable)</div>
              <div>
                {cdssData.findings.map(finding => (
                  <div key={finding.id} style={dicomViewerStyles.findingBox}>
                    <div style={dicomViewerStyles.findingHeaderBar}>
                      <input 
                        type="text" 
                        value={finding.title}
                        onChange={(e) => handleFindingEdit(finding.id, e.target.value)}
                        style={dicomViewerStyles.findingTitleInput}
                      />
                      <button 
                        onClick={() => deleteFinding(finding.id)}
                        style={{background:'none', border:'none', color:'#ef4444', cursor:'pointer'}}
                      >✕</button>
                    </div>
                    <div style={dicomViewerStyles.findingMeta}>
                      <span style={dicomViewerStyles.confidenceTag}>AI Conf: {finding.confidence}%</span>
                    </div>
                  </div>
                ))}
                <button style={dicomViewerStyles.addFindingBtn} onClick={addNewFinding}>+ Add New Finding</button>
              </div>

              <div style={dicomViewerStyles.sectionTitle}>Key Findings Summary</div>
              <textarea 
                style={dicomViewerStyles.cdssTextArea} 
                value={cdssData.summary}
                onChange={(e) => handleCdssTextChange('summary', e.target.value)}
              />

              <div style={dicomViewerStyles.sectionTitle}>Recommendations</div>
              <textarea 
                style={dicomViewerStyles.cdssTextArea} 
                value={cdssData.recommendations}
                onChange={(e) => handleCdssTextChange('recommendations', e.target.value)}
              />

              <div style={dicomViewerStyles.sectionTitle}>Differential Diagnosis</div>
              <textarea 
                style={dicomViewerStyles.cdssTextArea} 
                value={cdssData.differential}
                onChange={(e) => handleCdssTextChange('differential', e.target.value)}
              />

              <div style={{display:'flex', gap:'8px', marginTop:'8px'}}>
                 <button style={dicomViewerStyles.cdssActionBtn} onClick={handleSaveCdssData}>💾 Save Record</button>
                 <button style={dicomViewerStyles.cdssActionBtn}>📄 Export Report</button>
              </div>
            </div>
          )}

        </div>

        {/* VIEWPORT GRID */}
        <div style={dicomViewerStyles.viewportGrid}>
          {currentView === 'mpr' ? (
            <>
              <div style={dicomViewerStyles.viewport} onClick={() => setCurrentPane('axial')}><ViewportContent plane="axial" sliceNumber={currentSlice.axial} /></div>
              <div style={dicomViewerStyles.viewport} onClick={() => setCurrentPane('sagittal')}><ViewportContent plane="sagittal" sliceNumber={currentSlice.sagittal} /></div>
              <div style={dicomViewerStyles.viewport} onClick={() => setCurrentPane('coronal')}><ViewportContent plane="coronal" sliceNumber={currentSlice.coronal} /></div>
              <div style={dicomViewerStyles.viewport}><VolumeView /></div>
            </>
          ) : (
            <div style={{...dicomViewerStyles.viewport, gridColumn: '1 / -1', gridRow: '1 / -1'}}>
              {currentPane === '3d' ? (
                <VolumeView />
              ) : (
                <ViewportContent plane={currentPane} sliceNumber={currentSlice[currentPane]} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* STATUS BAR */}
      <div style={dicomViewerStyles.statusBar}>
        <div style={dicomViewerStyles.statusLeft}>
          <span style={dicomViewerStyles.statusItem}>🖼️ Slice: {currentSlice.axial}</span>
          <span style={dicomViewerStyles.statusItem}>⚪ W/L: {windowLevel.center}/{windowLevel.width}</span>
        </div>
        <div style={dicomViewerStyles.statusRight}>
          <span style={dicomViewerStyles.statusItem}>🛠️ Active Tool: {activeTool.toUpperCase()}</span>
          <span style={dicomViewerStyles.statusItem}>📊 {seriesData.find(s=>s.id === activeSeries)?.type || 'N/A'}</span>
        </div>
      </div>

    </div>
  );
}