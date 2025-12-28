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

// 2. Configure Image Loader (Disable web workers for easier setup)
cornerstoneWADOImageLoader.configure({
    useWebWorkers: false,
});

// 3. IMPORTANT: Add Auth Token to Image Requests
cornerstoneWADOImageLoader.configure({
    beforeSend: function(xhr) {
        const token = localStorage.getItem("token");
        if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
    }
});

export default function DicomViewerPage() {
  const [uploading, setUploading] = useState(false);
  const [scanId, setScanId] = useState(null); 
  const [loadedImages, setLoadedImages] = useState([]); 
  const [currentSliceIndex, setCurrentSliceIndex] = useState(0); 
  const [activeSeries, setActiveSeries] = useState(2); // 999 = Uploaded Scan
  
  const dicomElementRef = useRef(null);

  // --- RENDER THE DICOM IMAGE ---
  useEffect(() => {
    // Check if we have images and the element is ready
    if (activeSeries === 999 && loadedImages.length > 0 && dicomElementRef.current) {
        
        const element = dicomElementRef.current;
        
        // 1. Enable Cornerstone
        try {
            cornerstone.enable(element);
        } catch (e) {
            // Element already enabled
        }

        // 2. Smart URL Detection
        const fileEntry = loadedImages[currentSliceIndex];
        let finalUrl;

        // CHECK: Did the backend give us a full URL or just a filename?
        if (fileEntry.startsWith("http")) {
            finalUrl = fileEntry;
        } else {
            // Case B: Backend sent just a filename (Build the URL ourselves)
            finalUrl = `http://127.0.0.1:5000/api/radiologist/scans/${scanId}/dicom-files/${fileEntry}`;
        }
        
        const imageId = "wadouri:" + finalUrl;

        // 3. Load & Display
        cornerstone.loadImage(imageId).then(image => {
            cornerstone.displayImage(element, image);
            
            // Auto-adjust window/level (brightness) for the first slice only
            if (currentSliceIndex === 0) {
                const viewport = cornerstone.getDefaultViewportForImage(element, image);
                cornerstone.setViewport(element, viewport);
            }
        }).catch(err => {
            console.error("Error loading DICOM:", err);
        });
    }
  }, [activeSeries, loadedImages, currentSliceIndex, scanId]);


  // --- UPLOAD HANDLER ---
  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files[]", files[i]);
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/radiologist/scans/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(`✅ Uploaded! Loading Scan ID: ${data.scan_id}...`);
        setScanId(data.scan_id);

        const listRes = await fetch(`http://127.0.0.1:5000/api/radiologist/scans/${data.scan_id}/files`, {
             headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const listData = await listRes.json();
        
        if (listData.files && listData.files.length > 0) {
            // Sort files naturally
            const sortedFiles = listData.files.sort((a, b) => {
                return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
            });
            
            setLoadedImages(sortedFiles);
            setActiveSeries(999); 
            setCurrentSliceIndex(Math.floor(sortedFiles.length / 2)); 
        }
      } else {
        alert("❌ Upload failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Network Error.");
    } finally {
      setUploading(false);
    }
  };

  // --- MOUSE WHEEL SCROLL ---
  const handleWheel = (e) => {
      e.stopPropagation(); 
      if (activeSeries === 999 && loadedImages.length > 0) {
          if (e.deltaY > 0) {
              setCurrentSliceIndex(prev => Math.min(prev + 1, loadedImages.length - 1));
          } else {
              setCurrentSliceIndex(prev => Math.max(prev - 1, 0));
          }
      }
  };

  // --- SLIDER CHANGE HANDLER ---
  const handleSliderChange = (e) => {
      setCurrentSliceIndex(Number(e.target.value));
  };

  return (
    <div style={dicomViewerStyles.container}>
      
      {/* HEADER */}
      <header style={dicomViewerStyles.header}>
        <div style={dicomViewerStyles.logoArea}>
          <div style={dicomViewerStyles.logoCircle}>O</div>
          <span style={dicomViewerStyles.logoText}>OrthoLink Viewer</span>
        </div>
        
        <div style={dicomViewerStyles.toolbar}>
          <label style={{ 
             ...dicomViewerStyles.toolButton, 
             backgroundColor: uploading ? "#555" : "#0A7C88", 
             color: "white", 
             cursor: uploading ? "wait" : "pointer" 
          }}>
            {uploading ? "⏳ Uploading..." : "📂 Upload DICOM Folder"}
            <input 
                type="file" 
                multiple 
                webkitdirectory="" 
                onChange={handleFileUpload} 
                style={{ display: "none" }} 
                disabled={uploading} 
            />
          </label>
        </div>
      </header>

      <div style={dicomViewerStyles.mainContent}>
        {/* SIDEBAR */}
        <div style={dicomViewerStyles.leftSidebar}>
          <div style={dicomViewerStyles.panelHeader}>Series</div>
          
          {loadedImages.length > 0 && (
            <div 
                style={{...dicomViewerStyles.seriesItem, ...(activeSeries === 999 ? dicomViewerStyles.activeSeries : {})}}
                onClick={() => setActiveSeries(999)}
            >
                <div style={{...dicomViewerStyles.seriesThumbnail, backgroundColor: '#0A7C88', display:'flex', alignItems:'center', justifyContent:'center'}}>📁</div>
                <div>
                    <div style={{...dicomViewerStyles.seriesName, color: '#0A7C88', fontWeight:'bold'}}>UPLOADED SCAN</div>
                    <div style={dicomViewerStyles.seriesInfo}>{loadedImages.length} images</div>
                </div>
            </div>
          )}
        </div>

        {/* MAIN VIEWPORT */}
        <div style={{...dicomViewerStyles.viewerGrid, display: 'flex', flexDirection: 'column', position: 'relative'}}>
            
            {/* DICOM CANVAS AREA */}
            <div 
                style={{
                    flex: 1,
                    position: 'relative',
                    backgroundColor: 'black',
                    overflow: 'hidden'
                }}
            >
                <div 
                    ref={dicomElementRef} 
                    onWheel={handleWheel}
                    style={{
                        width: '100%', 
                        height: '100%', 
                    }}
                ></div>

                {/* Info Overlay */}
                <div style={{position: 'absolute', top: 10, left: 10, color: 'lime', zIndex: 99, pointerEvents: 'none', textShadow: '1px 1px 2px black'}}>
                    {activeSeries === 999 && loadedImages.length > 0 ? (
                        <>
                            SLICE: {currentSliceIndex + 1} / {loadedImages.length} <br/>
                            FILE: {loadedImages[currentSliceIndex]} <br/>
                            TYPE: DICOM (Lossless)
                        </>
                    ) : (
                        <span style={{color: '#888'}}>
                           {uploading ? "Uploading..." : "Upload a scan to begin viewing."}
                        </span>
                    )}
                </div>
            </div>

            {/* NEW: SLICE SLIDER CONTROL */}
            {activeSeries === 999 && loadedImages.length > 0 && (
                <div style={{
                    height: '50px', 
                    backgroundColor: '#1a1a1a', 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '0 20px',
                    borderTop: '1px solid #333'
                }}>
                    <span style={{color: 'white', marginRight: '15px', fontSize: '14px'}}>Slice:</span>
                    <input 
                        type="range" 
                        min="0" 
                        max={loadedImages.length - 1} 
                        value={currentSliceIndex} 
                        onChange={handleSliderChange}
                        style={{
                            flex: 1,
                            cursor: 'pointer',
                            accentColor: '#0A7C88' // This matches your theme color
                        }} 
                    />
                    <span style={{color: 'white', marginLeft: '15px', fontSize: '14px', minWidth: '40px'}}>
                        {currentSliceIndex + 1}
                    </span>
                </div>
            )}

        </div>
      </div>
    </div>
  );
}