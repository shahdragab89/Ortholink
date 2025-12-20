import React, { useState, useRef } from 'react';
import { dicomViewerStyles } from "../styles/DicomViewerStyles";

// Mock Data for different series (So switching actually works)
const seriesData = [
  { id: 1, name: 'Scout View', count: 1, type: 'Localizer' },
  { id: 2, name: 'Axial Bone 2.0', count: 120, type: 'Bone' },
  { id: 3, name: 'Sagittal Reformat', count: 85, type: 'Soft Tissue' },
];

export default function DicomViewerPage() {
  // --- STATE MANAGEMENT ---
  const [currentView, setCurrentView] = useState('mpr'); 
  const [activeTool, setActiveTool] = useState('pan'); // 'pan', 'measure', 'angle'
  const [activeSeries, setActiveSeries] = useState(2); // Default to series 2
  
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

  // Interaction Visuals (Faking the tools)
  const [showMeasureLine, setShowMeasureLine] = useState(false);
  const [showAngleLines, setShowAngleLines] = useState(false);

  // --- HANDLERS ---
  const handleBackToDashboard = () => {
    window.history.back();
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleToolSelect = (tool) => {
    setActiveTool(tool);
    // Reset visuals when switching tools
    if (tool !== 'measure') setShowMeasureLine(false);
    if (tool !== 'angle') setShowAngleLines(false);
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
    setShowMeasureLine(false);
    setShowAngleLines(false);
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 300));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 25));

  const toggleView = () => {
    setCurrentView(prev => prev === 'mpr' ? 'single' : 'mpr');
  };

  // Logic to simulate clicking a new series
  const handleSeriesClick = (seriesId) => {
    setActiveSeries(seriesId);
    // Reset slices for the new series
    setCurrentSlice({ axial: 1, sagittal: 1, coronal: 1 });
    // Visual feedback
    alert(`Loading Series ${seriesId}... (Simulation)`);
  };

  // Logic to simulate using a tool on the image
  const handleImageClick = () => {
    if (activeTool === 'measure') setShowMeasureLine(true);
    if (activeTool === 'angle') setShowAngleLines(true);
  };

  // --- SUB-COMPONENTS ---
  
  // 1. The Image Viewport
  const ViewportContent = ({ plane, sliceNumber }) => {
    const activeSeriesData = seriesData.find(s => s.id === activeSeries);
    
    // CSS Filters to simulate image adjustments
    const filterStyle = {
      // We apply the filters to the IMAGE now, not the container
      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${sharpness}%) blur(${enableSmoothing ? '1px' : '0px'})`,
      transform: `scale(${zoomLevel / 100}) rotate(${rotation[plane]}deg)`,
      transition: 'all 0.2s ease',
      width: '100%',
      height: '100%',
      objectFit: 'contain' // This ensures the image fits inside the box
    };

    let imageUrl = '';
    if (plane === 'axial') {
      imageUrl = '/axial.jpeg'; // Real Axial Knee
    } else if (plane === 'sagittal') {
      imageUrl = '/sagittal.jpg'; // Real Sagittal Knee
    } else if (plane === 'coronal') {
      imageUrl = '/coronal.jpg'; // Real Coronal Knee
    }

    return (
      <div style={dicomViewerStyles.viewportInner} onClick={handleImageClick}>
        
        {/* The "Image" (with filters applied) */}
        <div style={{...dicomViewerStyles.dicomImage, ...filterStyle}}>

        {/* Render the Real Image instead of the fake gray box */}
        <img 
          src={imageUrl} 
          alt={plane}
          style={filterStyle} 
        />
          
          {/* Placeholder for the actual Bone/X-ray */}
          <div style={{
            width: '180px', height: '220px', 
            border: '2px solid #333', borderRadius: '40px',
            background: 'radial-gradient(circle at 30% 30%, #444, #000)',
            opacity: 0.8
          }}></div>

          {/* Crosshairs (Only in MPR) */}
          {currentView === 'mpr' && (
            <>
              <div style={dicomViewerStyles.crosshairVertical}></div>
              <div style={dicomViewerStyles.crosshairHorizontal}></div>
            </>
          )}

          {/* Fake Measurement Line */}
          {showMeasureLine && (
            <div style={{
              position: 'absolute', top: '40%', left: '40%', width: '100px', height: '2px', 
              backgroundColor: '#34d399', transform: 'rotate(45deg)', boxShadow: '0 0 4px black'
            }}>
              <span style={{position: 'absolute', top: '-20px', color: '#34d399', fontWeight: 'bold'}}>45.2 mm</span>
            </div>
          )}

          {/* Fake Angle Lines */}
          {showAngleLines && (
             <div style={{position: 'absolute', top: '50%', left: '50%'}}>
               <div style={{width: '60px', height: '2px', backgroundColor: '#fbbf24', transform: 'rotate(-20deg)', position: 'absolute'}}></div>
               <div style={{width: '60px', height: '2px', backgroundColor: '#fbbf24', transform: 'rotate(30deg)', position: 'absolute'}}></div>
               <span style={{position: 'absolute', top: '-30px', left: '20px', color: '#fbbf24', fontWeight: 'bold'}}>50°</span>
             </div>
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

        {/* The Slice Slider */}
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

  // 2. The 3D Volume View
  const VolumeView = () => {
    return (
      <div style={dicomViewerStyles.viewportInner}>
        <div style={dicomViewerStyles.volumeContainer}>
          <div style={dicomViewerStyles.volumePlaceholder}>
            <div style={dicomViewerStyles.volumeIcon}>🦴</div>
            <div style={{marginTop: '15px', fontSize: '14px', color: '#9ca3af'}}>3D Volume Rendering</div>
          </div>
          <div style={dicomViewerStyles.volumeControls}>
            <button style={dicomViewerStyles.volumeBtn} title="Rotate">🔄</button>
            <button style={dicomViewerStyles.volumeBtn} title="Preset 1">📊</button>
            <button style={dicomViewerStyles.volumeBtn} title="Preset 2">🔬</button>
          </div>
        </div>
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

        {/* Center Tools */}
        <div style={dicomViewerStyles.toolGroup}>
          <button 
            style={{...dicomViewerStyles.toolBtn, ...(activeTool === 'pan' && dicomViewerStyles.toolBtnActive)}}
            onClick={() => handleToolSelect('pan')}
          >🤚 Pan</button>
          {/* <button 
            style={{...dicomViewerStyles.toolBtn, ...(activeTool === 'zoom' && dicomViewerStyles.toolBtnActive)}}
            onClick={() => handleToolSelect('zoom')}
          >🔍 Zoom</button> */}
          <button 
            style={{...dicomViewerStyles.toolBtn, ...(activeTool === 'window' && dicomViewerStyles.toolBtnActive)}}
            onClick={() => handleToolSelect('window')}
          >⚪ W/L</button>
          <button 
            style={{...dicomViewerStyles.toolBtn, ...(activeTool === 'measure' && dicomViewerStyles.toolBtnActive)}}
            onClick={() => handleToolSelect('measure')}
          >📏 Measure</button>
          <button 
            style={{...dicomViewerStyles.toolBtn, ...(activeTool === 'angle' && dicomViewerStyles.toolBtnActive)}}
            onClick={() => handleToolSelect('angle')}
          >📐 Angle</button>
          {/* ROTATE BUTTON ADDED HERE */}
          <button 
            style={dicomViewerStyles.toolBtn}
            onClick={() => setRotation(prev => ({...prev, axial: (prev.axial + 90) % 360}))}
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
          
          {/* Patient Card */}
          <div style={dicomViewerStyles.patientCard}>
            <div style={dicomViewerStyles.cardTitle}>Patient Information</div>
            <div style={dicomViewerStyles.infoRow}><span style={dicomViewerStyles.infoLabel}>Name:</span><span>Ahmed Ali</span></div>
            <div style={dicomViewerStyles.infoRow}><span style={dicomViewerStyles.infoLabel}>ID:</span><span>P-105</span></div>
            <div style={dicomViewerStyles.infoRow}><span style={dicomViewerStyles.infoLabel}>Modality:</span><span style={dicomViewerStyles.infoBadge}>CT</span></div>
            <div style={dicomViewerStyles.infoRow}><span style={dicomViewerStyles.infoLabel}>Body Part:</span><span>Knee</span></div>
          </div>

          {/* Series List (Interactive) */}
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

          {/* Image Enhancement (RESTORED FULLY) */}
          <div style={dicomViewerStyles.enhancementCard}>
            <div style={dicomViewerStyles.cardTitle}>Image Enhancement</div>
            
            {/* Brightness */}
            <div style={dicomViewerStyles.sliderGroup}>
              <label style={dicomViewerStyles.sliderLabel}><span>☀️ Brightness</span><span style={dicomViewerStyles.sliderValue}>{brightness}%</span></label>
              <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(parseInt(e.target.value))} style={dicomViewerStyles.slider} />
            </div>

            {/* Contrast */}
            <div style={dicomViewerStyles.sliderGroup}>
              <label style={dicomViewerStyles.sliderLabel}><span>◐ Contrast</span><span style={dicomViewerStyles.sliderValue}>{contrast}%</span></label>
              <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(parseInt(e.target.value))} style={dicomViewerStyles.slider} />
            </div>

            {/* Sharpness */}
            <div style={dicomViewerStyles.sliderGroup}>
              <label style={dicomViewerStyles.sliderLabel}><span>✨ Sharpness</span><span style={dicomViewerStyles.sliderValue}>{sharpness}%</span></label>
              <input type="range" min="0" max="200" value={sharpness} onChange={(e) => setSharpness(parseInt(e.target.value))} style={dicomViewerStyles.slider} />
            </div>

            {/* Noise Reduction */}
            <div style={dicomViewerStyles.sliderGroup}>
              <label style={dicomViewerStyles.sliderLabel}><span>🔇 Noise Reduct.</span><span style={dicomViewerStyles.sliderValue}>{noiseReduction}%</span></label>
              <input type="range" min="0" max="100" value={noiseReduction} onChange={(e) => setNoiseReduction(parseInt(e.target.value))} style={dicomViewerStyles.slider} />
            </div>

            {/* Smoothing */}
            <div style={{...dicomViewerStyles.infoRow, marginTop: '12px'}}>
              <span style={dicomViewerStyles.infoLabel}>☁️ Smooth Filter</span>
              <input type="checkbox" checked={enableSmoothing} onChange={(e) => setEnableSmoothing(e.target.checked)} style={{accentColor: '#059669', width: '18px', height: '18px', cursor: 'pointer'}} />
            </div>

            {/* Presets Grid */}
            <div style={{marginTop: '20px'}}>
              <div style={{...dicomViewerStyles.sliderLabel, marginBottom: '10px'}}><span>Presets</span></div>
              <div style={dicomViewerStyles.presetGrid}>
                <button style={dicomViewerStyles.presetBtn} onClick={() => setWindowLevel({width: 400, center: 40})}>Bone</button>
                <button style={dicomViewerStyles.presetBtn} onClick={() => setWindowLevel({width: 350, center: 50})}>Soft Tissue</button>
                <button style={dicomViewerStyles.presetBtn} onClick={() => setWindowLevel({width: 1500, center: -600})}>Lung</button>
                <button style={dicomViewerStyles.presetBtn} onClick={() => setWindowLevel({width: 80, center: 40})}>Brain</button>
              </div>
            </div>
          </div>
        </div>

        {/* VIEWPORT GRID */}
        <div style={dicomViewerStyles.viewportGrid}>
          {currentView === 'mpr' ? (
            <>
              <div style={dicomViewerStyles.viewport}><ViewportContent plane="axial" sliceNumber={currentSlice.axial} /></div>
              <div style={dicomViewerStyles.viewport}><ViewportContent plane="sagittal" sliceNumber={currentSlice.sagittal} /></div>
              <div style={dicomViewerStyles.viewport}><ViewportContent plane="coronal" sliceNumber={currentSlice.coronal} /></div>
              <div style={dicomViewerStyles.viewport}><VolumeView /></div>
            </>
          ) : (
            <div style={{...dicomViewerStyles.viewport, gridColumn: '1 / -1', gridRow: '1 / -1'}}>
              <ViewportContent plane="axial" sliceNumber={currentSlice.axial} />
            </div>
          )}
        </div>
      </div>

      {/* STATUS BAR */}
      <div style={dicomViewerStyles.statusBar}>
        <div style={dicomViewerStyles.statusLeft}>
          <span style={dicomViewerStyles.statusItem}>🖼️ Slice: {currentSlice.axial}</span>
          {/* <span style={dicomViewerStyles.statusItem}>🔍 Zoom: {zoomLevel}%</span> */}
          <span style={dicomViewerStyles.statusItem}>⚪ W/L: {windowLevel.center}/{windowLevel.width}</span>
        </div>
        <div style={dicomViewerStyles.statusRight}>
          <span style={dicomViewerStyles.statusItem}>🛠️ Active Tool: {activeTool.toUpperCase()}</span>
          <span style={dicomViewerStyles.statusItem}>📊 {seriesData.find(s=>s.id === activeSeries).type}</span>
        </div>
      </div>

    </div>
  );
}