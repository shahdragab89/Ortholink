import React, { useState, useRef, useEffect } from 'react';
import { dicomViewerStyles } from "../styles/DicomViewerStyles";

// Mock Data for different series
const seriesData = [
  { id: 1, name: 'Scout View', count: 1, type: 'Localizer' },
  { id: 2, name: 'Axial Bone 2.0', count: 120, type: 'Bone' },
  { id: 3, name: 'Sagittal Reformat', count: 85, type: 'Soft Tissue' },
];

// CDSS Mock Data
const cdssFindings = [
  { id: 1, name: 'Medial Meniscus Tear', confidence: 94, color: '#ef4444' },
  { id: 2, name: 'ACL Partial Tear', confidence: 87, color: '#f59e0b' },
  { id: 3, name: 'Patellar Chondromalacia', confidence: 76, color: '#8b5cf6' },
  { id: 4, name: 'Joint Effusion', confidence: 92, color: '#3b82f6' },
];

const differentialDiagnosis = [
  "Meniscal tear (most likely)",
  "ACL injury",
  "Osteoarthritis",
  "Bone contusion",
  "Synovitis"
];

export default function DicomViewerPage() {
  // --- STATE MANAGEMENT ---
  const [currentView, setCurrentView] = useState('mpr'); 
  const [activeTool, setActiveTool] = useState('pan');
  const [activeSeries, setActiveSeries] = useState(2);
  const [activeTab, setActiveTab] = useState('viewer'); // 'viewer' or 'cdss'
  
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
  const [currentPane, setCurrentPane] = useState('axial');

  // Measurement tool state
  const [measurePoints, setMeasurePoints] = useState({ axial: [], sagittal: [], coronal: [] });
  const [anglePoints, setAnglePoints] = useState({ axial: [], sagittal: [], coronal: [] });
  
  // Window/Level adjustment state
  const [isAdjustingWL, setIsAdjustingWL] = useState(false);
  const [wlStart, setWlStart] = useState({ x: 0, y: 0 });

  // CDSS States
  const [cdssAnalysis, setCdssAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [aiInsights, setAiInsights] = useState('');
  const [confidenceLevel, setConfidenceLevel] = useState(0);

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

  // CDSS Functions
  const runCdssAnalysis = () => {
    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResult = {
        abnormalities: [
          "Medial meniscus posterior horn tear",
          "Moderate joint effusion",
          "Mild patellofemoral osteoarthritis",
          "ACL appears intact"
        ],
        findings: "High-grade medial meniscal tear with associated joint effusion. Mild degenerative changes.",
        recommendations: [
          "MRI for detailed meniscal assessment",
          "Orthopedic consultation",
          "Physical therapy referral",
          "Consider arthroscopic evaluation"
        ],
        differentialDiagnosis: differentialDiagnosis,
        severity: "Moderate",
        confidence: 87,
        aiInsights: "AI detected posterior horn discontinuity with fluid signal. High likelihood of traumatic meniscal injury."
      };
      
      setCdssAnalysis(mockResult);
      setAiInsights(mockResult.aiInsights);
      setConfidenceLevel(mockResult.confidence);
      setIsAnalyzing(false);
    }, 2000);
  };

  const exportReport = () => {
    const report = {
      patient: "Ahmed Ali (P-105)",
      findings: cdssAnalysis.findings,
      recommendations: cdssAnalysis.recommendations,
      date: new Date().toISOString().split('T')[0]
    };
    alert(`Report exported for ${report.patient}\nFindings: ${report.findings}`);
  };

  const handleFindingClick = (finding) => {
    setSelectedFinding(finding);
    // In a real app, this might highlight the finding on the viewer
  };

  // --- SUB-COMPONENTS ---
  
  const ViewportContent = ({ plane, sliceNumber }) => {
    const activeSeriesData = seriesData.find(s => s.id === activeSeries);
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

    let imageUrl = '';
    if (plane === 'axial') {
      imageUrl = '/axial.jpeg';
    } else if (plane === 'sagittal') {
      imageUrl = '/sagittal.jpg';
    } else if (plane === 'coronal') {
      imageUrl = '/coronal.jpg';
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
            <div>Slice: {sliceNumber}/{activeSeriesData.count}</div>
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
          max={activeSeriesData.count}
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

  const CdssTab = () => {
    return (
      <div style={{
        padding: '20px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        height: '100%',
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{color: '#111827', fontSize: '18px', fontWeight: '600'}}>AI-Powered CDSS Analysis</h3>
          <button 
            onClick={runCdssAnalysis}
            disabled={isAnalyzing}
            style={{
              padding: '8px 16px',
              backgroundColor: isAnalyzing ? '#9ca3af' : '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isAnalyzing ? 'not-allowed' : 'pointer',
              fontWeight: '500'
            }}
          >
            {isAnalyzing ? 'Analyzing...' : 'Run AI Analysis'}
          </button>
        </div>

        {isAnalyzing ? (
          <div style={{textAlign: 'center', padding: '40px 20px'}}>
            <div style={{
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #059669',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <p style={{color: '#6b7280'}}>AI is analyzing the scan...</p>
          </div>
        ) : cdssAnalysis ? (
          <>
            {/* AI Insights */}
            <div style={{
              backgroundColor: '#fefce8',
              border: '1px solid #fbbf24',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h4 style={{color: '#92400e', marginBottom: '10px', fontSize: '14px'}}>AI Insights</h4>
              <p style={{color: '#92400e', fontSize: '13px'}}>{aiInsights}</p>
              
              <div style={{marginTop: '15px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                  <span style={{fontSize: '12px', color: '#92400e', fontWeight: '600'}}>Confidence Level</span>
                  <span style={{fontWeight: '600', color: '#047857'}}>{confidenceLevel}%</span>
                </div>
                <div style={{height: '6px', backgroundColor: '#e5e7eb', borderRadius: '3px', overflow: 'hidden'}}>
                  <div style={{height: '100%', backgroundColor: '#10b981', width: `${confidenceLevel}%`}}></div>
                </div>
              </div>
            </div>

            {/* Detected Findings */}
            <div style={{marginBottom: '20px'}}>
              <h4 style={{color: '#374151', marginBottom: '15px', fontSize: '14px'}}>Detected Findings</h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                {cdssFindings.map(finding => (
                  <div 
                    key={finding.id}
                    onClick={() => handleFindingClick(finding)}
                    style={{
                      padding: '12px',
                      backgroundColor: selectedFinding?.id === finding.id ? '#dbeafe' : 'white',
                      border: `1px solid ${finding.color}40`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span style={{fontWeight: '500', fontSize: '13px'}}>{finding.name}</span>
                      <span style={{
                        backgroundColor: finding.color,
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {finding.confidence}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Findings */}
            <div style={{marginBottom: '20px'}}>
              <h4 style={{color: '#374151', marginBottom: '10px', fontSize: '14px'}}>Key Findings</h4>
              <div style={{
                backgroundColor: '#f0f9ff',
                padding: '15px',
                borderRadius: '6px',
                borderLeft: '3px solid #3b82f6'
              }}>
                <p style={{color: '#1e40af', fontSize: '13px'}}>{cdssAnalysis.findings}</p>
              </div>
            </div>

            {/* Recommendations */}
            <div style={{marginBottom: '20px'}}>
              <h4 style={{color: '#374151', marginBottom: '10px', fontSize: '14px'}}>Recommendations</h4>
              <ul style={{paddingLeft: '20px'}}>
                {cdssAnalysis.recommendations?.map((rec, index) => (
                  <li key={index} style={{marginBottom: '8px', fontSize: '13px', color: '#374151'}}>
                    <span style={{color: '#059669', marginRight: '8px'}}>✓</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Differential Diagnosis */}
            <div style={{marginBottom: '20px'}}>
              <h4 style={{color: '#374151', marginBottom: '10px', fontSize: '14px'}}>Differential Diagnosis</h4>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                {cdssAnalysis.differentialDiagnosis?.map((dx, index) => (
                  <span key={index} style={{
                    backgroundColor: index === 0 ? '#dbeafe' : '#f3f4f6',
                    color: index === 0 ? '#1e40af' : '#374151',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    border: index === 0 ? '1px solid #93c5fd' : '1px solid #e5e7eb'
                  }}>
                    {dx}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '10px',
              marginTop: '25px',
              paddingTop: '15px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <button 
                onClick={exportReport}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  flex: 1
                }}
              >
                Export Report
              </button>
              <button 
                onClick={() => alert('Saved to patient record')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  flex: 1
                }}
              >
                Save to Record
              </button>
            </div>
          </>
        ) : (
          <div style={{textAlign: 'center', padding: '40px 20px', color: '#9ca3af'}}>
            <div style={{fontSize: '48px', marginBottom: '20px'}}>🤖</div>
            <h4 style={{color: '#6b7280', marginBottom: '10px'}}>AI Analysis Ready</h4>
            <p style={{fontSize: '14px', marginBottom: '20px'}}>Run AI analysis to get detailed insights and recommendations.</p>
            <button 
              onClick={runCdssAnalysis}
              style={{
                padding: '10px 20px',
                backgroundColor: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Start Analysis
            </button>
          </div>
        )}
      </div>
    );
  };

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
              Ahmed Ali • P-105
            </span>
          </div>
        </div>

        <div style={dicomViewerStyles.toolGroup}>
          {/* Tab Toggles */}
          <button 
            style={{
              ...dicomViewerStyles.toolBtn,
              ...(activeTab === 'viewer' && dicomViewerStyles.toolBtnActive),
              backgroundColor: activeTab === 'viewer' ? '#3b82f6' : '#374151'
            }}
            onClick={() => setActiveTab('viewer')}
            title="DICOM Viewer"
          >
            🩻 Viewer
          </button>
          <button 
            style={{
              ...dicomViewerStyles.toolBtn,
              ...(activeTab === 'cdss' && dicomViewerStyles.toolBtnActive),
              backgroundColor: activeTab === 'cdss' ? '#8b5cf6' : '#374151'
            }}
            onClick={() => setActiveTab('cdss')}
            title="AI Analysis"
          >
            🤖 CDSS
          </button>
          
          <div style={{width: '1px', backgroundColor: '#4b5563', margin: '0 10px'}}></div>
          
          {/* Viewer Tools (only show when in viewer tab) */}
          {activeTab === 'viewer' && (
            <>
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
            </>
          )}
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
          
          <div style={dicomViewerStyles.patientCard}>
            <div style={dicomViewerStyles.cardTitle}>Patient Information</div>
            <div style={dicomViewerStyles.infoRow}><span style={dicomViewerStyles.infoLabel}>Name:</span><span>Ahmed Ali</span></div>
            <div style={dicomViewerStyles.infoRow}><span style={dicomViewerStyles.infoLabel}>ID:</span><span>P-105</span></div>
            <div style={dicomViewerStyles.infoRow}><span style={dicomViewerStyles.infoLabel}>Modality:</span><span style={dicomViewerStyles.infoBadge}>CT</span></div>
            <div style={dicomViewerStyles.infoRow}><span style={dicomViewerStyles.infoLabel}>Body Part:</span><span>Knee</span></div>
          </div>

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

          {/* Show enhancement controls only in viewer mode */}
          {activeTab === 'viewer' && (
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
          )}
        </div>

        {/* MAIN VIEWER / CDSS AREA */}
        <div style={dicomViewerStyles.viewportGrid}>
          {activeTab === 'viewer' ? (
            currentView === 'mpr' ? (
              <>
                <div style={dicomViewerStyles.viewport} onClick={() => setCurrentPane('axial')}><ViewportContent plane="axial" sliceNumber={currentSlice.axial} /></div>
                <div style={dicomViewerStyles.viewport} onClick={() => setCurrentPane('sagittal')}><ViewportContent plane="sagittal" sliceNumber={currentSlice.sagittal} /></div>
                <div style={dicomViewerStyles.viewport} onClick={() => setCurrentPane('coronal')}><ViewportContent plane="coronal" sliceNumber={currentSlice.coronal} /></div>
                <div style={dicomViewerStyles.viewport}><VolumeView /></div>
              </>
            ) : (
              <div style={{...dicomViewerStyles.viewport, gridColumn: '1 / -1', gridRow: '1 / -1'}}>
                <ViewportContent plane={currentPane} sliceNumber={currentSlice[currentPane]} />
              </div>
            )
          ) : (
            <div style={{...dicomViewerStyles.viewport, gridColumn: '1 / -1', gridRow: '1 / -1'}}>
              <CdssTab />
            </div>
          )}
        </div>
      </div>

      {/* STATUS BAR */}
      <div style={dicomViewerStyles.statusBar}>
        <div style={dicomViewerStyles.statusLeft}>
          <span style={dicomViewerStyles.statusItem}>
            {activeTab === 'viewer' ? '🖼️' : '🤖'} 
            {activeTab === 'viewer' ? `Slice: ${currentSlice.axial}` : 'AI Analysis Mode'}
          </span>
          {activeTab === 'viewer' && (
            <span style={dicomViewerStyles.statusItem}>⚪ W/L: {windowLevel.center}/{windowLevel.width}</span>
          )}
        </div>
        <div style={dicomViewerStyles.statusRight}>
          <span style={dicomViewerStyles.statusItem}>
            🛠️ Active: {activeTab === 'viewer' ? activeTool.toUpperCase() : 'CDSS'}
          </span>
          <span style={dicomViewerStyles.statusItem}>
            📊 {seriesData.find(s=>s.id === activeSeries).type}
          </span>
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
}