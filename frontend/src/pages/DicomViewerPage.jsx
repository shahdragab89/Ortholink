import React, { useState, useRef, useEffect } from 'react';
import { dicomViewerStyles } from "../styles/DicomViewerStyles";

// --- IMPORT RENDERING ENGINES ---
import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';

// --- INITIALIZE ENGINES & CONFIG ---
// 1. Link the libraries together
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

// 2. Configure Image Loader
cornerstoneWADOImageLoader.configure({
    useWebWorkers: false,
});

// 3. Add Auth Token to Image Requests
cornerstoneWADOImageLoader.configure({
    beforeSend: function(xhr) {
        const token = localStorage.getItem("token");
        if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
    }
});

export default function DicomViewerPage() {
  // --- STATE MANAGEMENT ---
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Upload States
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(""); 
  const [scanId, setScanId] = useState(null); 
  
  // --- SEPARATED IMAGE STACKS ---
  const [axialImages, setAxialImages] = useState([]);
  const [sagittalImages, setSagittalImages] = useState([]);
  const [coronalImages, setCoronalImages] = useState([]);
  const [hasUploadedData, setHasUploadedData] = useState(false);

  // View & Navigation States
  const [currentView, setCurrentView] = useState('single');
  const [currentPane, setCurrentPane] = useState('axial');
  const [activeTool, setActiveTool] = useState('pan');
  const [activeSeries, setActiveSeries] = useState(2); // Default to Mock Axial
  
  // Image Adjustment States
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [sharpness, setSharpness] = useState(50);
  const [noiseReduction, setNoiseReduction] = useState(0); 
  const [enableSmoothing, setEnableSmoothing] = useState(false);
  const [windowLevel, setWindowLevel] = useState({ width: 400, center: 40 });
  const [zoomLevel, setZoomLevel] = useState(100);
  
  // Navigation
  const [currentSlice, setCurrentSlice] = useState({ axial: 0, sagittal: 0, coronal: 0 });
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

  // --- STATE FOR PATIENT DATA ---
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
        // Fallback Mock Data
        setFallbackData();
      } catch (error) {
        console.error('Error fetching patient data:', error);
        setFallbackData();
      } finally {
        setIsLoading(false);
      }
    };
    
    const setFallbackData = () => {
      // Original Mock Data
      setSeriesData([
        { id: 1, name: 'Coronal View', count: 1, type: 'Localizer' },
        { id: 2, name: 'Axial Bone 2.0', count: 120, type: 'Bone' },
        { id: 3, name: 'Sagittal Reformat', count: 85, type: 'Soft Tissue' },
        { id: 4, name: '3D Volume View', count: 1, type: 'Volume' },
      ]);
      setPatientData({
          patient_name: "Demo Patient",
          patient_id: "P-DEMO",
          modality: "CT",
          body_part: "Knee",
          diagnosis: "ACL Tear"
      });
    };
    
    fetchPatientData();
  }, []);

  // --- HELPER: ROBUST DICOM SORTING ---
  const sortDicomByAxis = async (fileUrls) => {
    const axial = [];
    const sagittal = [];
    const coronal = [];
    const total = fileUrls.length;

    // Helper to fetch with Auth header
    const fetchWithAuth = async (url) => {
        const token = localStorage.getItem("token");
        return fetch(url, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
    };

    console.log(`Starting Sort for ${total} images...`);

    for (let i = 0; i < total; i++) {
        const url = fileUrls[i];
        
        // Update UI status every 5 images
        if (i % 5 === 0) setUploadStatus(`Sorting image ${i + 1} of ${total}...`);

        try {
            const response = await fetchWithAuth(url);
            if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
            
            const arrayBuffer = await response.arrayBuffer();
            const byteArray = new Uint8Array(arrayBuffer);
            const dataSet = dicomParser.parseDicom(byteArray);

            // 0020,0037 = Image Orientation (Patient)
            const orientation = dataSet.string('x00200037'); 
            const instanceNum = parseInt(dataSet.string('x00200013')) || 0;

            if (!orientation) {
                // FALLBACK: If no orientation tag, assume Axial
                axial.push({ url, instanceNum });
                continue;
            }

            // Parse Direction Cosines [rx, ry, rz, cx, cy, cz]
            const [rx, ry, rz, cx, cy, cz] = orientation.split('\\').map(Number);

            // Calculate Normal Vector (Cross Product)
            const nx = (ry * cz) - (rz * cy);
            const ny = (rz * cx) - (rx * cz);
            const nz = (rx * cy) - (ry * cx);

            const absX = Math.abs(nx);
            const absY = Math.abs(ny);
            const absZ = Math.abs(nz);

            // Determine plane based on largest normal component
            if (absX > absY && absX > absZ) {
                 sagittal.push({ url, instanceNum });
            } else if (absY > absX && absY > absZ) {
                 coronal.push({ url, instanceNum });
            } else {
                 axial.push({ url, instanceNum }); // Default to Axial if Z is largest
            }

        } catch (err) {
            console.warn(`Error parsing file ${i}, defaulting to Axial:`, err);
            // SAFETY NET: If parsing fails, don't lose the image. Put it in Axial.
            axial.push({ url, instanceNum: i });
        }
    }

    const sortByInstance = (a, b) => a.instanceNum - b.instanceNum;

    // Double Check: If ALL arrays are empty (rare failure), put raw list into Axial
    if (axial.length === 0 && sagittal.length === 0 && coronal.length === 0) {
        console.warn("Sorting produced 0 results. Fallback to raw list.");
        return {
            axial: fileUrls,
            sagittal: [],
            coronal: []
        };
    }

    return {
        axial: axial.sort(sortByInstance).map(i => i.url),
        sagittal: sagittal.sort(sortByInstance).map(i => i.url),
        coronal: coronal.sort(sortByInstance).map(i => i.url)
    };
  };

  // --- UPLOAD HANDLER ---
  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadStatus("Uploading files...");
    
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files[]", files[i]);
    }

    try {
      const token = localStorage.getItem("token");
      
      // 1. Upload Files
      const response = await fetch("http://127.0.0.1:5000/api/radiologist/scans/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        setScanId(data.scan_id);
        setUploadStatus("Fetching file list...");

        // 2. Get List of Filenames from Backend
        const listRes = await fetch(`http://127.0.0.1:5000/api/radiologist/scans/${data.scan_id}/files`, {
             headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        const listData = await listRes.json();
        
        if (listData.files && listData.files.length > 0) {
            
            // 3. Construct Full URLs (FIXED LOGIC)
            // Check if backend already sent full URLs to prevent double-wrapping
            const fileUrls = listData.files.map(f => {
                if (f.startsWith('http')) {
                    return f;
                } else {
                    return `http://127.0.0.1:5000/api/radiologist/scans/${data.scan_id}/dicom-files/${f}`;
                }
            });

            // 4. Run Sorting Engine
            setUploadStatus("Sorting into views...");
            const axisImages = await sortDicomByAxis(fileUrls);

            setAxialImages(axisImages.axial);
            setSagittalImages(axisImages.sagittal);
            setCoronalImages(axisImages.coronal);
            setHasUploadedData(true);

            // 5. Update Series List with NEW items
            setSeriesData(prev => [
                // Keep original mock data for reference? Or replace? 
                // Let's replace the main items to avoid confusion, or append.
                // Re-mapping existing IDs to the uploaded data:
                { id: 2, name: 'Axial (Uploaded)', count: axisImages.axial.length, type: 'DICOM' },
                { id: 3, name: 'Sagittal (Uploaded)', count: axisImages.sagittal.length, type: 'DICOM' },
                { id: 1, name: 'Coronal (Uploaded)', count: axisImages.coronal.length, type: 'DICOM' },
                { id: 4, name: '3D Volume View', count: 1, type: 'Volume' }
            ]);

            // 6. Set Default View (Axial)
            setActiveSeries(2); 
            setCurrentPane('axial');
            setCurrentSlice({ axial: 0, sagittal: 0, coronal: 0 });

            alert(`✅ Upload Complete!\nAxial: ${axisImages.axial.length}\nSagittal: ${axisImages.sagittal.length}\nCoronal: ${axisImages.coronal.length}`);
        }
      } else {
        alert("❌ Upload failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Network Error during upload.");
    } finally {
      setUploading(false);
      setUploadStatus("");
    }
  };

  const handleBackToDashboard = () => window.history.back();

  const handleToolSelect = (tool) => {
    setActiveTool(tool);
    if (tool !== 'measure') setMeasurePoints({ axial: [], sagittal: [], coronal: [] });
    if (tool !== 'angle') setAnglePoints({ axial: [], sagittal: [], coronal: [] });
  };

  const handleReset = () => {
    setBrightness(100); setContrast(100); setSharpness(50);
    setZoomLevel(100); setRotation({ axial: 0, sagittal: 0, coronal: 0 });
    setCurrentSlice({ axial: 0, sagittal: 0, coronal: 0 });
    setPanPosition({ axial: { x: 0, y: 0 }, sagittal: { x: 0, y: 0 }, coronal: { x: 0, y: 0 } });
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 300));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 25));

  const toggleView = () => setCurrentView(prev => prev === 'mpr' ? 'single' : 'mpr');

  const handleSeriesClick = (seriesId) => {
    setActiveSeries(seriesId);
    setCurrentView('single');
    
    // Switch pane based on series ID and reset slice to 0
    if (seriesId === 1) { setCurrentPane('coronal'); setCurrentSlice(prev => ({...prev, coronal: 0})); }
    else if (seriesId === 2) { setCurrentPane('axial'); setCurrentSlice(prev => ({...prev, axial: 0})); }
    else if (seriesId === 3) { setCurrentPane('sagittal'); setCurrentSlice(prev => ({...prev, sagittal: 0})); }
    else if (seriesId === 4) { setCurrentPane('3d'); }
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
    const dx = p2.x - p1.x; const dy = p2.y - p1.y;
    return (Math.sqrt(dx * dx + dy * dy) * 0.5).toFixed(1);
  };
  const calculateAngle = (p1, p2, p3) => {
    const angle1 = Math.atan2(p1.y - p2.y, p1.x - p2.x);
    const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
    let angle = Math.abs((angle1 - angle2) * 180 / Math.PI);
    if (angle > 180) angle = 360 - angle;
    return angle.toFixed(1);
  };

  // --- CDSS HANDLERS ---
  const toggleSidebarMode = (mode) => {
    setSidebarMode(mode);
    if (mode === 'cdss') setCurrentView('mpr');
  };
  const handleCdssTextChange = (field, value) => setCdssData(prev => ({ ...prev, [field]: value }));
  const handleFindingEdit = (id, newTitle) => {
    setCdssData(prev => ({ ...prev, findings: prev.findings.map(f => f.id === id ? { ...f, title: newTitle } : f) }));
  };
  const deleteFinding = (id) => setCdssData(prev => ({ ...prev, findings: prev.findings.filter(f => f.id !== id) }));
  const addNewFinding = () => {
    const newId = Date.now();
    setCdssData(prev => ({
      ...prev, findings: [...prev.findings, { id: newId, title: 'New finding detected...', confidence: 50 }]
    }));
  };
  const handleRunAIAnalysis = async () => { alert("AI Analysis triggered"); };
  const handleSaveCdssData = async () => { alert("Data Saved"); };


  // --- SUB-COMPONENTS ---
  
  const ViewportContent = ({ plane, sliceNumber }) => {
    const activeSeriesItem = seriesData.find(s => s.id === activeSeries);
    const viewportRef = useRef(null);
    const cornerstoneElementRef = useRef(null);
    
    // --- DETERMINE IMAGE SOURCE ---
    let currentStack = [];
    if (hasUploadedData) {
        if (plane === 'axial') currentStack = axialImages;
        else if (plane === 'sagittal') currentStack = sagittalImages;
        else if (plane === 'coronal') currentStack = coronalImages;
    }

    // --- CORNERSTONE RENDERING EFFECT ---
    useEffect(() => {
        // Only render if we have data for THIS plane
        if (hasUploadedData && cornerstoneElementRef.current && currentStack.length > 0) {
            const element = cornerstoneElementRef.current;
            try { cornerstone.enable(element); } catch (e) {}

            // Ensure slice number is valid
            const safeIndex = Math.min(Math.max(0, sliceNumber), currentStack.length - 1);
            const finalUrl = currentStack[safeIndex];

            if (!finalUrl) return;

            const imageId = "wadouri:" + finalUrl;

            cornerstone.loadImage(imageId).then(image => {
                cornerstone.displayImage(element, image);
                // Only reset viewport on first load (slice 0)
                if (sliceNumber === 0) {
                   try {
                       const viewport = cornerstone.getDefaultViewportForImage(element, image);
                       cornerstone.setViewport(element, viewport);
                   } catch(e) {}
                }
            }).catch(err => {
                console.error("Cornerstone Load Error:", err);
            });
        }
    }, [sliceNumber, hasUploadedData, currentStack, plane]);

    // --- MOUSE HANDLERS ---
    const handleMouseDown = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (!viewportRef.current) return;
      
      const rect = viewportRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left; const y = e.clientY - rect.top;

      if (activeTool === 'pan') {
        setIsPanning(true); setPanStart({ x: e.clientX, y: e.clientY }); setCurrentPane(plane);
      } else if (activeTool === 'window') {
        setIsAdjustingWL(true); setWlStart({ x: e.clientX, y: e.clientY }); setCurrentPane(plane);
      } else if (activeTool === 'measure') {
        setMeasurePoints(prev => {
          const points = [...prev[plane]];
          if (points.length >= 2) return { ...prev, [plane]: [{ x, y }] };
          return { ...prev, [plane]: [...points, { x, y }] };
        });
      } else if (activeTool === 'angle') {
        setAnglePoints(prev => {
          const points = [...prev[plane]];
          if (points.length >= 3) return { ...prev, [plane]: [{ x, y }] };
          return { ...prev, [plane]: [...points, { x, y }] };
        });
      }
    };

    const handleMouseMove = (e) => {
      if (isPanning && activeTool === 'pan' && currentPane === plane) {
        const dx = e.clientX - panStart.x; const dy = e.clientY - panStart.y;
        setPanPosition(prev => ({ ...prev, [plane]: { x: prev[plane].x + dx, y: prev[plane].y + dy } }));
        setPanStart({ x: e.clientX, y: e.clientY });
      } else if (isAdjustingWL && activeTool === 'window' && currentPane === plane) {
        const dx = e.clientX - wlStart.x; const dy = e.clientY - wlStart.y;
        setWindowLevel(prev => ({
          width: Math.max(1, prev.width + dx * 2),
          center: Math.max(-1024, Math.min(3071, prev.center - dy))
        }));
        setWlStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => { setIsPanning(false); setIsAdjustingWL(false); };

    const containerStyle = {
      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${sharpness}%) blur(${enableSmoothing ? '1px' : '0px'})`,
      transform: `scale(${zoomLevel / 100}) rotate(${rotation[plane]}deg) translate(${panPosition[plane].x}px, ${panPosition[plane].y}px)`,
      transition: activeTool === 'pan' || activeTool === 'window' ? 'none' : 'all 0.2s ease',
      width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: activeTool === 'pan' ? 'grab' : activeTool === 'window' ? 'crosshair' : activeTool === 'measure' || activeTool === 'angle' ? 'crosshair' : 'default'
    };

    const measurements = measurePoints[plane] || [];
    const angles = anglePoints[plane] || [];
    
    // MOCK URL fallback
    let mockImageUrl = '';
    if (plane === 'axial') mockImageUrl = patientData?.scanImage || '/axial.jpeg';
    else if (plane === 'sagittal') mockImageUrl = patientData?.scanImage || '/sagittal.jpg';
    else if (plane === 'coronal') mockImageUrl = patientData?.scanImage || '/coronal.jpg';

    // Calculate max slices
    const maxSlices = hasUploadedData && currentStack.length > 0 ? Math.max(0, currentStack.length - 1) : (activeSeriesItem?.count || 100);

    return (
      <div style={dicomViewerStyles.viewportInner} 
           onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
           ref={viewportRef}>
        
        <div style={containerStyle}>
            {hasUploadedData && currentStack.length > 0 ? (
                /* --- REAL CORNERSTONE RENDERER --- */
                <div ref={cornerstoneElementRef} style={{ width: '100%', height: '100%' }} onContextMenu={(e) => e.preventDefault()} />
            ) : (
                /* --- STATIC MOCK IMAGE RENDERER --- */
                <img src={mockImageUrl} alt={plane} draggable={false}
                    style={{width: '100%', height: '100%', objectFit: 'contain'}}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/500x500/000000/FFFFFF/?text=No+Image'; }} />
            )}
        </div>
          
        {currentView === 'mpr' && (
            <>
              <div style={dicomViewerStyles.crosshairVertical}></div>
              <div style={dicomViewerStyles.crosshairHorizontal}></div>
            </>
        )}

        {/* OVERLAYS */}
        {measurements.length === 2 && (
            <>
              <svg style={{position: 'absolute', inset: 0, pointerEvents: 'none', overflow:'visible'}}>
                <line x1={measurements[0].x} y1={measurements[0].y} x2={measurements[1].x} y2={measurements[1].y} stroke="#34d399" strokeWidth="2"/>
                <circle cx={measurements[0].x} cy={measurements[0].y} r="4" fill="#34d399" />
                <circle cx={measurements[1].x} cy={measurements[1].y} r="4" fill="#34d399" />
              </svg>
              <div style={{position: 'absolute', left: (measurements[0].x + measurements[1].x) / 2, top: (measurements[0].y + measurements[1].y) / 2 - 20, color: '#34d399', fontWeight: 'bold', fontSize: '14px', textShadow: '0 0 4px black', backgroundColor: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '4px'}}>
                {calculateDistance(measurements[0], measurements[1])} mm
              </div>
            </>
        )}

        {angles.length === 3 && (
            <>
              <svg style={{position: 'absolute', inset: 0, pointerEvents: 'none', overflow:'visible'}}>
                <line x1={angles[0].x} y1={angles[0].y} x2={angles[1].x} y2={angles[1].y} stroke="#fbbf24" strokeWidth="2" />
                <line x1={angles[1].x} y1={angles[1].y} x2={angles[2].x} y2={angles[2].y} stroke="#fbbf24" strokeWidth="2" />
                {angles.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="#fbbf24" />)}
              </svg>
              <div style={{position: 'absolute', left: angles[1].x + 10, top: angles[1].y - 25, color: '#fbbf24', fontWeight: 'bold', fontSize: '14px', textShadow: '0 0 4px black', backgroundColor: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '4px'}}>
                {calculateAngle(angles[0], angles[1], angles[2])}°
              </div>
            </>
        )}

        <div style={dicomViewerStyles.planeLabel}>{plane.toUpperCase()}</div>
        <div style={dicomViewerStyles.sliceInfo}>
            {hasUploadedData ? (
                <>
                    <div>Stack: {currentStack.length > 0 ? 'Loaded' : 'Empty'}</div>
                    <div>Slice: {sliceNumber + 1}/{currentStack.length}</div>
                </>
            ) : (
                <div>Slice: {sliceNumber}/{maxSlices}</div>
            )}
            <div>WL: {windowLevel.center} / WW: {windowLevel.width}</div>
            <div>Zoom: {zoomLevel}%</div>
        </div>
        <div style={dicomViewerStyles.anatomicalMarkers}>
             <span style={{position: 'absolute', top: 5, left: '50%'}}>S</span>
             <span style={{position: 'absolute', bottom: 5, left: '50%'}}>I</span>
             <span style={{position: 'absolute', left: 5, top: '50%'}}>R</span>
             <span style={{position: 'absolute', right: 5, top: '50%'}}>L</span>
        </div>

        {/* SLIDER CONTROLS */}
        <input type="range" min={0} max={maxSlices} value={sliceNumber}
          onMouseDown={(e) => e.stopPropagation()} onMouseMove={(e) => e.stopPropagation()}
          onChange={(e) => setCurrentSlice(prev => ({...prev, [plane]: parseInt(e.target.value)}))}
          style={dicomViewerStyles.sliceSlider}
          disabled={hasUploadedData && currentStack.length === 0}
        />
      </div>
    );
  };

  const VolumeView = () => {
    return (
      <div style={dicomViewerStyles.viewportInner}>
        <div style={dicomViewerStyles.volumeContainer}>
          <div style={dicomViewerStyles.volumePlaceholder}>
            <div style={{fontSize: '48px', marginBottom: '10px'}}>🦴</div>
            <div>3D Volume Rendering</div>
            <div style={{fontSize: '11px', color: '#4b5563'}}>Preset: Bone</div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div style={dicomViewerStyles.container}>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#111827', color: 'white'}}>
          Loading System...
        </div>
      </div>
    );
  }

  return (
    <div style={dicomViewerStyles.container}>
      {/* TOOLBAR */}
      <div style={dicomViewerStyles.toolbar}>
        <div style={dicomViewerStyles.toolbarLeft}>
          <button onClick={handleBackToDashboard} style={dicomViewerStyles.backBtn}>← Back</button>
          <div style={dicomViewerStyles.toolbarTitle}>
            <span style={{fontSize: '18px', fontWeight: '700'}}>OrthoLink Viewer</span>
            <span style={{fontSize: '12px', color: '#9ca3af', marginLeft: '12px'}}>
              {patientData ? `${patientData.patient_name} • ${patientData.patient_id}` : ''}
            </span>
          </div>
        </div>

        <div style={dicomViewerStyles.toolGroup}>
          <label style={{...dicomViewerStyles.toolBtn, backgroundColor: uploading ? '#b45309' : '#059669', borderColor: 'transparent', cursor: 'pointer'}}>
             {uploading ? (uploadStatus || '⏳ Processing...') : '📂 Upload Scan'}
             <input type="file" multiple webkitdirectory="" onChange={handleFileUpload} style={{display: 'none'}} disabled={uploading} />
          </label>
          <button style={{...dicomViewerStyles.toolBtn, ...(activeTool === 'pan' && dicomViewerStyles.toolBtnActive)}} onClick={() => handleToolSelect('pan')}>🤚 Pan</button>
          <button style={{...dicomViewerStyles.toolBtn, ...(activeTool === 'window' && dicomViewerStyles.toolBtnActive)}} onClick={() => handleToolSelect('window')}>⚪ W/L</button>
          <button style={{...dicomViewerStyles.toolBtn, ...(activeTool === 'measure' && dicomViewerStyles.toolBtnActive)}} onClick={() => handleToolSelect('measure')}>📏 Measure</button>
          <button style={{...dicomViewerStyles.toolBtn, ...(activeTool === 'angle' && dicomViewerStyles.toolBtnActive)}} onClick={() => handleToolSelect('angle')}>📐 Angle</button>
          <button style={dicomViewerStyles.toolBtn} onClick={handleRotate}>⤵️ Rotate</button>
          <button style={dicomViewerStyles.toolBtn} onClick={toggleView}>{currentView === 'mpr' ? '⊞' : '⊡'} MPR</button>
          <button style={dicomViewerStyles.toolBtn} onClick={handleReset}>↻ Reset</button>
        </div>

        <div style={dicomViewerStyles.toolbarRight}>
          <button style={dicomViewerStyles.zoomBtn} onClick={handleZoomOut}>−</button>
          <span style={dicomViewerStyles.zoomDisplay}>{zoomLevel}%</span>
          <button style={dicomViewerStyles.zoomBtn} onClick={handleZoomIn}>+</button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={dicomViewerStyles.mainContent}>
        {/* SIDEBAR */}
        <div style={dicomViewerStyles.sidebar}>
          <div style={dicomViewerStyles.sidebarTabs}>
            <button style={sidebarMode === 'viewer' ? {...dicomViewerStyles.sidebarTab, ...dicomViewerStyles.sidebarTabActive} : dicomViewerStyles.sidebarTab} onClick={() => toggleSidebarMode('viewer')}>Viewer</button>
            <button style={sidebarMode === 'cdss' ? {...dicomViewerStyles.sidebarTab, ...dicomViewerStyles.sidebarTabActive} : dicomViewerStyles.sidebarTab} onClick={() => toggleSidebarMode('cdss')}>CDSS Analysis</button>
          </div>
          
          <div style={dicomViewerStyles.patientCard}>
            <div style={dicomViewerStyles.cardTitle}>Patient Information</div>
            {patientData ? (
              <>
                <div style={dicomViewerStyles.infoRow}><span style={dicomViewerStyles.infoLabel}>Name:</span><span>{patientData.patient_name}</span></div>
                <div style={dicomViewerStyles.infoRow}><span style={dicomViewerStyles.infoLabel}>ID:</span><span>{patientData.patient_id}</span></div>
                <div style={dicomViewerStyles.infoRow}><span style={dicomViewerStyles.infoLabel}>Modality:</span><span style={dicomViewerStyles.infoBadge}>{patientData.modality}</span></div>
              </>
            ) : <div style={{color:'#9ca3af'}}>Loading...</div>}
          </div>

          {/* VIEWER MODE */}
          {sidebarMode === 'viewer' && (
            <>
              <div style={dicomViewerStyles.seriesCard}>
                <div style={dicomViewerStyles.cardTitle}>Series List</div>
                <div style={dicomViewerStyles.seriesList}>
                  {seriesData.map(series => (
                    <div key={series.id} onClick={() => handleSeriesClick(series.id)}
                      style={{...dicomViewerStyles.seriesItem, ...(activeSeries === series.id ? dicomViewerStyles.seriesItemActive : {})}}>
                      <div style={dicomViewerStyles.seriesThumb}>{hasUploadedData ? '✅' : '📷'}</div>
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

  {/* --- FIXED SECTION STARTS HERE --- */}
  <div style={dicomViewerStyles.sliderGroup}>
    <label style={dicomViewerStyles.sliderLabel}><span>✨ Sharpness</span><span style={dicomViewerStyles.sliderValue}>{sharpness}%</span></label>
    <input type="range" min="0" max="200" value={sharpness} onChange={(e) => setSharpness(parseInt(e.target.value))} style={dicomViewerStyles.slider} />
  </div>
  {/* --- FIXED SECTION ENDS HERE --- */}

  <div style={dicomViewerStyles.sliderGroup}>
    <label style={dicomViewerStyles.sliderLabel}><span>🔇 Noise Reduct.</span><span style={dicomViewerStyles.sliderValue}>{noiseReduction}%</span></label>
    <input type="range" min="0" max="100" value={noiseReduction} onChange={(e) => setNoiseReduction(parseInt(e.target.value))} style={dicomViewerStyles.slider} />
  </div>
  
  <div style={{...dicomViewerStyles.infoRow, marginTop: '12px'}}>
    <span style={dicomViewerStyles.infoLabel}>☁️ Smooth Filter</span>
    <input type="checkbox" checked={enableSmoothing} onChange={(e) => setEnableSmoothing(e.target.checked)} style={{accentColor: '#059669', width: '18px', height: '18px'}} />
  </div>
</div>
            </>
          )}

          {/* CDSS MODE */}
          {sidebarMode === 'cdss' && (
             <div style={dicomViewerStyles.cdssContainer}>
              <button style={dicomViewerStyles.cdssRunBtn} onClick={handleRunAIAnalysis} disabled={isAnalyzing}>
                {isAnalyzing ? '🔄 Analyzing...' : '🚀 Run AI Analysis'}
              </button>
              <div style={dicomViewerStyles.confidenceWidget}>
                <div style={dicomViewerStyles.confidenceHeader}><span>AI Confidence Level</span><span style={dicomViewerStyles.confidenceScoreBig}>{cdssData.overallConfidence}%</span></div>
                <div style={dicomViewerStyles.progressBarBg}><div style={{...dicomViewerStyles.progressBarFill, width: `${cdssData.overallConfidence}%`}}></div></div>
              </div>
              <div style={dicomViewerStyles.sectionTitle}>Detected Findings</div>
              <div>
                {cdssData.findings.map(finding => (
                  <div key={finding.id} style={dicomViewerStyles.findingBox}>
                    <div style={dicomViewerStyles.findingHeaderBar}>
                      <input type="text" value={finding.title} onChange={(e) => handleFindingEdit(finding.id, e.target.value)} style={dicomViewerStyles.findingTitleInput} />
                      <button onClick={() => deleteFinding(finding.id)} style={{background:'none', border:'none', color:'#ef4444', cursor:'pointer'}}>✕</button>
                    </div>
                    <div style={dicomViewerStyles.findingMeta}><span style={dicomViewerStyles.confidenceTag}>AI Conf: {finding.confidence}%</span></div>
                  </div>
                ))}
                <button style={dicomViewerStyles.addFindingBtn} onClick={addNewFinding}>+ Add New Finding</button>
              </div>
              <div style={{display:'flex', gap:'8px', marginTop:'8px'}}>
                 <button style={dicomViewerStyles.cdssActionBtn} onClick={handleSaveCdssData}>💾 Save Record</button>
              </div>
            </div>
          )}
        </div>

        {/* VIEWPORTS */}
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
          <span style={dicomViewerStyles.statusItem}>🖼️ Slice: {currentSlice.axial + 1}</span>
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