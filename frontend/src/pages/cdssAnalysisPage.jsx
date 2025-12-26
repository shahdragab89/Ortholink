import React, { useState, useRef } from 'react';
import { cdssStyles } from '../styles/cdss';

export default function CDSSAnalysisPage() {
  // State Management
  const [activeTool, setActiveTool] = useState('pan');
  const [zoomLevel, setZoomLevel] = useState(100);
  
  // Slice State
  const [currentSlices, setCurrentSlices] = useState({
    axial: 60,
    sagittal: 50,
    coronal: 55,
    heatmap: 60, 
  });
  
  // Panning State (Restored)
  const [panPosition, setPanPosition] = useState({
    axial: { x: 0, y: 0 },
    sagittal: { x: 0, y: 0 },
    coronal: { x: 0, y: 0 },
    heatmap: { x: 0, y: 0 },
  });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [activePane, setActivePane] = useState(null);

  // Patient Data
  const patientData = {
    name: 'Ahmed Ali',
    id: 'P-105',
    age: '45 Y',
    gender: 'M',
    scanDate: '20-12-2025',
    modality: 'CT Knee',
  };

  // CDSS Analysis Results
  const cdssResults = {
    riskLevel: 'high',
    confidence: 92, 
    findings: [
      {
        title: 'Tibial Plateau Fracture',
        description: 'Displaced fracture line detected in lateral plateau.',
        location: 'Slice 60 (Axial)',
        severity: 'high',
      },
      {
        title: 'Joint Effusion',
        description: 'Moderate fluid accumulation indicating inflammation.',
        location: 'Slice 45 (Sagittal)',
        severity: 'medium',
      },
    ],
    recommendations: [
      'Urgent Orthopedic Consultation',
      'CT 3D Reconstruction suggested for surgical planning',
      'Immobilization of the knee joint',
    ],
  };

  const handleBack = () => window.history.back();
  const handleClose = () => window.location.href = '/dashboard';

  // Image Viewport Component
  const ImageViewport = ({ plane, imageUrl, sliceCount, isHeatmap = false }) => {
    const currentSlice = currentSlices[plane];

    // Panning Handlers
    const handleMouseDown = (e) => {
      if (activeTool === 'pan') {
        setIsPanning(true);
        setPanStart({ x: e.clientX, y: e.clientY });
        setActivePane(plane);
      }
    };

    const handleMouseMove = (e) => {
      if (isPanning && activeTool === 'pan' && activePane === plane) {
        const dx = e.clientX - panStart.x;
        const dy = e.clientY - panStart.y;
        
        setPanPosition(prev => ({
          ...prev,
          [plane]: {
            x: prev[plane].x + dx,
            y: prev[plane].y + dy,
          }
        }));
        
        setPanStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsPanning(false);
      setActivePane(null);
    };

    // Style for the image based on pan/zoom
    const transformStyle = {
      transform: `scale(${zoomLevel / 100}) translate(${panPosition[plane].x}px, ${panPosition[plane].y}px)`,
      cursor: activeTool === 'pan' ? (isPanning ? 'grabbing' : 'grab') : 'default',
      transition: isPanning ? 'none' : 'transform 0.1s ease-out'
    };

    return (
      <div style={cdssStyles.imageViewport}>
        <div 
          style={cdssStyles.imageContainer}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Main Image */}
          <img
            src={imageUrl}
            alt={plane}
            style={{ 
              ...cdssStyles.dicomImage, 
              ...transformStyle,
              filter: isHeatmap ? 'grayscale(100%) contrast(1.2)' : 'none'
            }}
            draggable={false}
          />
          
          {/* Heatmap Overlay (moves with image) */}
          {isHeatmap && (
             <div style={{
               ...cdssStyles.heatmapOverlay,
               ...transformStyle
             }} />
          )}
          
          {/* Text Overlay (Static) */}
          <div style={cdssStyles.imageOverlay}>
            {isHeatmap ? 'HEAT MAP' : plane.toUpperCase()}
          </div>

          <div style={cdssStyles.sliceInfo}>
            <div>{currentSlice} / {sliceCount}</div>
          </div>

          {/* Render Bounding Box with Label */}
          {!isHeatmap && plane === 'axial' && (
            <div
              style={{
                ...cdssStyles.boundingBox,
                ...transformStyle, // Box moves with image
                left: '45%', top: '40%', width: '15%', height: '12%' // Base position
              }}
            >
              <div style={cdssStyles.detectionLabel}>
                Fracture 92%
              </div>
            </div>
          )}
        </div>

        {/* Scrollbar/Slider */}
        <div style={cdssStyles.sliderContainer}>
          <input
            type="range"
            min="1"
            max={sliceCount}
            value={currentSlice}
            onChange={(e) => setCurrentSlices(prev => ({ ...prev, [plane]: parseInt(e.target.value) }))}
            style={cdssStyles.slider}
          />
        </div>
      </div>
    );
  };

  return (
    <div style={cdssStyles.container}>
      {/* GLOBAL STYLE INJECTION FOR SCROLLBARS */}
      <style>
        {`
          ::-webkit-scrollbar { width: 8px; height: 8px; }
          ::-webkit-scrollbar-track { background: #111827; }
          ::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: #4b5563; }
        `}
      </style>

      {/* Header */}
      <div style={cdssStyles.header}>
        <div style={cdssStyles.headerLeft}>
          <button onClick={handleBack} style={cdssStyles.backBtn}>
            &larr; Back to List
          </button>
          <div style={cdssStyles.headerTitle}>
            CDSS Analysis
            <span style={cdssStyles.headerSubtitle}>AI Model V3</span>
          </div>
        </div>

        <div style={cdssStyles.headerRight}>
          <button onClick={handleClose} style={cdssStyles.closeBtn}>
            Close Viewer &times;
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={cdssStyles.mainContent}>
        
        {/* Left Section - DICOM Viewer */}
        <div style={cdssStyles.leftSection}>
          
          {/* Patient Summary Bar */}
          <div style={cdssStyles.patientSummary}>
            <div style={cdssStyles.summaryLeft}>
              <div style={cdssStyles.summaryItem}>
                <span style={cdssStyles.summaryLabel}>Patient</span>
                <span style={cdssStyles.summaryValue}>{patientData.name}</span>
              </div>
              <div style={cdssStyles.summaryItem}>
                <span style={cdssStyles.summaryLabel}>MRN/ID</span>
                <span style={cdssStyles.summaryValue}>{patientData.id}</span>
              </div>
              <div style={cdssStyles.summaryItem}>
                <span style={cdssStyles.summaryLabel}>Demographics</span>
                <span style={cdssStyles.summaryValue}>{patientData.age} / {patientData.gender}</span>
              </div>
              <div style={cdssStyles.summaryItem}>
                <span style={cdssStyles.summaryLabel}>Study</span>
                <span style={cdssStyles.summaryValue}>{patientData.modality}</span>
              </div>
            </div>
          </div>

          {/* Grid Viewer */}
          <div style={cdssStyles.dicomViewerContainer}>
            <div style={cdssStyles.viewerHeader}>
              <span style={cdssStyles.viewerTitle}>DICOM Views</span>
              <div style={cdssStyles.viewerTools}>
                <button
                  style={{
                    ...cdssStyles.toolBtn,
                    ...(activeTool === 'pan' && cdssStyles.toolBtnActive),
                  }}
                  onClick={() => setActiveTool('pan')}
                >
                  Pan
                </button>
                <button style={cdssStyles.toolBtn} onClick={() => setZoomLevel(z => Math.max(z-10, 50))}>−</button>
                <span style={{ fontSize: '11px', color: '#9ca3af', minWidth: '30px', textAlign: 'center' }}>
                  {zoomLevel}%
                </span>
                <button style={cdssStyles.toolBtn} onClick={() => setZoomLevel(z => Math.min(z+10, 200))}>+</button>
              </div>
            </div>

            <div style={cdssStyles.imagesGrid}>
              <ImageViewport plane="axial" imageUrl="/axial.jpeg" sliceCount={120} />
              <ImageViewport plane="sagittal" imageUrl="/sagittal.jpg" sliceCount={85} />
              <ImageViewport plane="coronal" imageUrl="/coronal.jpg" sliceCount={85} />
              <ImageViewport plane="heatmap" imageUrl="/axial.jpeg" sliceCount={120} isHeatmap={true} />
            </div>
          </div>
        </div>

        {/* Right Sidebar - CDSS Insights */}
        <div style={cdssStyles.rightSidebar}>
          <div style={cdssStyles.sidebarHeader}>
            <div style={cdssStyles.sidebarTitle}>Analysis Findings</div>
          </div>

          <div style={cdssStyles.sidebarContent}>
            
            {/* Risk Level */}
            <div style={cdssStyles.insightCard}>
              <div style={cdssStyles.insightHeader}>
                <span style={cdssStyles.insightTitle}>Assessment</span>
                <div style={cdssStyles.riskBadge}>
                  <div style={{...cdssStyles.riskDot, color: '#ef4444'}}></div>
                  <span style={{color: '#ef4444'}}>High Risk</span>
                </div>
              </div>
              
              <div style={cdssStyles.confidenceBarContainer}>
                <span style={cdssStyles.insightTitle}>AI Confidence</span>
                <div style={cdssStyles.confidenceValue}>{cdssResults.confidence}%</div>
                <div style={cdssStyles.confidenceBar}>
                  <div style={{ ...cdssStyles.confidenceFill, width: `${cdssResults.confidence}%` }}></div>
                </div>
              </div>
            </div>

            {/* Findings List */}
            <div style={cdssStyles.findingsList}>
              <span style={cdssStyles.insightTitle}>Detected Pathologies</span>
              
              {cdssResults.findings.map((finding, idx) => (
                <div key={idx} style={cdssStyles.findingItem}>
                  <div style={{
                    ...cdssStyles.findingSeverityIndicator,
                    backgroundColor: finding.severity === 'high' ? '#ef4444' : '#f59e0b'
                  }}></div>
                  <div style={cdssStyles.findingContent}>
                    <div style={cdssStyles.findingTitle}>{finding.title}</div>
                    <div style={cdssStyles.findingDescription}>{finding.description}</div>
                    <div style={cdssStyles.findingMeta}>
                      <span>{finding.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

             {/* Recommendations (RESTORED) */}
             <div>
                <span style={{...cdssStyles.insightTitle, display: 'block', marginBottom: '8px'}}>Recommendations</span>
                <div style={cdssStyles.recommendationsList}>
                  {cdssResults.recommendations.map((rec, idx) => (
                    <div key={idx} style={cdssStyles.recommendationItem}>
                      <span style={cdssStyles.recIcon}>✓</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
}