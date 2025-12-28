export const dicomViewerStyles = {
  container: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#000000',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    color: '#e5e7eb',
    overflow: 'hidden',
  },

  // --- TOOLBAR (Restored to original horizontal layout) ---
  toolbar: {
    backgroundColor: '#1f2937',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #374151',
    height: '60px',
    flexShrink: 0,
    zIndex: 20, // Ensure it sits above other content
  },

  toolbarLeft: { display: 'flex', alignItems: 'center', gap: '16px' },

  backBtn: {
    backgroundColor: 'transparent',
    color: '#9ca3af',
    border: '1px solid #4b5563',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.2s',
  },

  toolbarTitle: { display: 'flex', alignItems: 'center', color: '#f3f4f6' },

  toolGroup: { 
    display: 'flex', 
    gap: '6px', 
    alignItems: 'center' 
  },

  toolBtn: {
    backgroundColor: '#374151',
    color: '#e5e7eb',
    border: '1px solid #4b5563',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.1s',
    height: '32px', // Fixed height to prevent stacking issues
    whiteSpace: 'nowrap',
  },

  toolBtnActive: {
    backgroundColor: '#059669',
    borderColor: '#10b981',
    color: 'white',
    boxShadow: '0 0 10px rgba(5, 150, 105, 0.4)',
  },

  toolbarRight: { display: 'flex', alignItems: 'center', gap: '12px' },

  zoomBtn: {
    backgroundColor: '#374151',
    color: 'white',
    border: 'none',
    width: '28px',
    height: '28px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  zoomDisplay: {
    color: '#9ca3af',
    fontSize: '13px',
    fontWeight: '600',
    minWidth: '45px',
    textAlign: 'center',
  },

  logoutBtn: {
    backgroundColor: 'transparent',
    color: '#ef4444',
    border: '1px solid #ef4444',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    marginLeft: '12px',
  },

  mainContent: {
    display: 'flex',
    flex: 1,
    height: 'calc(100vh - 90px)',
    overflow: 'hidden',
  },

  // --- SIDEBAR (Updated with Dark Scrollbar) ---
  sidebar: {
    width: '320px', // Slightly wider for CDSS inputs
    backgroundColor: '#111827',
    borderRight: '1px solid #374151',
    overflowY: 'auto',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flexShrink: 0,
    // Dark Scrollbar Styling
    scrollbarWidth: 'thin',
    scrollbarColor: '#374151 #111827',
  },

  // --- NEW: SIDEBAR TABS & CDSS STYLES ---
  sidebarTabs: {
    display: 'flex',
    backgroundColor: '#1f2937',
    borderRadius: '6px',
    padding: '4px',
    marginBottom: '8px',
    border: '1px solid #374151',
  },

  sidebarTab: {
    flex: 1,
    backgroundColor: 'transparent',
    color: '#9ca3af',
    border: 'none',
    padding: '6px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    transition: 'all 0.2s',
  },

  sidebarTabActive: {
    backgroundColor: '#374151',
    color: '#e5e7eb',
    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
  },

  cdssContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  cdssRunBtn: {
    backgroundColor: '#2563eb', // Blue to distinguish from tools
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },

  confidenceWidget: {
    backgroundColor: '#1f2937',
    borderRadius: '8px',
    padding: '12px',
    border: '1px solid #374151',
  },

  confidenceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    fontSize: '12px',
    color: '#9ca3af',
  },

  confidenceScoreBig: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#60a5fa', // Light blue
  },

  progressBarBg: {
    height: '6px',
    backgroundColor: '#111827',
    borderRadius: '3px',
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: '3px',
    transition: 'width 0.5s ease-out',
  },

  sectionTitle: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    marginTop: '8px',
    marginBottom: '4px',
  },

  findingBox: {
    backgroundColor: '#1f2937',
    borderRadius: '6px',
    padding: '10px',
    border: '1px solid #374151',
    marginBottom: '8px',
  },

  findingHeaderBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },

  findingTitleInput: {
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid transparent',
    color: '#e5e7eb',
    fontSize: '13px',
    fontWeight: '500',
    width: '100%',
    padding: '2px 0',
    outline: 'none',
  },

  findingMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: '#6b7280',
    marginTop: '4px',
  },

  confidenceTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    color: '#60a5fa',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '10px',
  },

  addFindingBtn: {
    width: '100%',
    backgroundColor: 'transparent',
    border: '1px dashed #4b5563',
    color: '#9ca3af',
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '11px',
    marginTop: '4px',
    transition: 'all 0.2s',
  },

  cdssTextArea: {
    width: '100%',
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    borderRadius: '6px',
    color: '#e5e7eb',
    padding: '8px',
    fontSize: '12px',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '60px',
    marginBottom: '8px',
  },

  cdssActionBtn: {
    flex: 1,
    backgroundColor: '#374151',
    color: '#e5e7eb',
    border: '1px solid #4b5563',
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },

  // --- ORIGINAL CARDS (Kept exactly the same) ---
  patientCard: {
    backgroundColor: '#1f2937',
    borderRadius: '8px',
    padding: '12px',
    border: '1px solid #374151',
  },
  
  seriesCard: {
    backgroundColor: '#1f2937',
    borderRadius: '8px',
    padding: '12px',
    border: '1px solid #374151',
  },

  enhancementCard: {
    backgroundColor: '#1f2937',
    borderRadius: '8px',
    padding: '12px',
    border: '1px solid #374151',
  },

  cardTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#34d399',
    marginBottom: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
    fontSize: '12px',
  },

  infoLabel: { color: '#9ca3af' },
  infoValue: { color: '#e5e7eb', fontWeight: '500' },
  infoBadge: {
    backgroundColor: '#059669',
    color: 'white',
    padding: '1px 6px',
    borderRadius: '4px',
    fontSize: '10px',
  },

  seriesList: { display: 'flex', flexDirection: 'column', gap: '6px' },

  seriesItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '1px solid transparent',
  },

  seriesItemActive: {
    backgroundColor: '#374151',
    border: '1px solid #34d399',
  },

  seriesThumb: {
    width: '32px',
    height: '32px',
    backgroundColor: 'black',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
  },

  seriesName: { fontSize: '12px', fontWeight: '600', color: '#e5e7eb' },
  seriesInfo: { fontSize: '10px', color: '#9ca3af' },

  sliderGroup: { marginBottom: '12px' },
  sliderLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
    fontSize: '11px',
    color: '#d1d5db',
  },
  sliderValue: { color: '#34d399' },
  slider: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    outline: 'none',
    background: '#111827',
    appearance: 'none',
    cursor: 'pointer',
    border: '1px solid #4b5563',
  },

  presetGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '6px',
  },
  presetBtn: {
    backgroundColor: '#374151',
    color: '#d1d5db',
    border: '1px solid #4b5563',
    padding: '6px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '10px',
  },

  viewportGrid: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr',
    gap: '1px',
    backgroundColor: '#1f2937',
  },

  viewport: {
    backgroundColor: 'black',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },

  viewportInner: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dicomImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundSize: '40px 40px',
    backgroundImage: 'linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)',
  },

  crosshairVertical: {
    position: 'absolute',
    width: '1px',
    height: '100%',
    backgroundColor: '#34d399',
    left: '50%',
    opacity: 0.6,
    pointerEvents: 'none',
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: '100%',
    height: '1px',
    backgroundColor: '#34d399',
    top: '50%',
    opacity: 0.6,
    pointerEvents: 'none',
  },

  planeLabel: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    color: '#34d399',
    fontSize: '14px',
    fontWeight: 'bold',
    textShadow: '0 1px 2px black',
  },

  sliceInfo: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    color: 'white',
    fontSize: '12px',
    fontFamily: 'monospace',
    textAlign: 'right',
    textShadow: '0 1px 2px black',
    lineHeight: '1.4',
  },

  anatomicalMarkers: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    color: '#34d399',
    fontSize: '12px',
    fontWeight: 'bold',
  },

  sliceSlider: {
    position: 'absolute',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60%',
    height: '4px',
    zIndex: 10,
    accentColor: '#34d399'
  },

  volumeContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  volumePlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6b7280',
    textAlign: 'center',
  },

  volumeControls: {
    position: 'absolute',
    bottom: '20px',
    display: 'flex',
    gap: '8px',
  },

  volumeBtn: {
    backgroundColor: '#374151',
    color: '#e5e7eb',
    border: '1px solid #4b5563',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '500',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  statusBar: {
    height: '30px',
    backgroundColor: '#111827',
    borderTop: '1px solid #374151',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    fontSize: '11px',
    color: '#9ca3af',
    flexShrink: 0,
  },
  
  statusLeft: { display: 'flex', gap: '20px' },
  statusRight: { display: 'flex', gap: '20px' },
  statusItem: { display: 'flex', alignItems: 'center', gap: '6px' },
};


// export const dicomViewerStyles = {
//   container: {
//     display: 'flex',
//     flexDirection: 'column',
//     height: '100vh',
//     backgroundColor: '#000',
//     color: '#fff',
//     fontFamily: 'sans-serif',
//     overflow: 'hidden',
//   },
//   header: {
//     height: '60px',
//     backgroundColor: '#1a1a1a',
//     borderBottom: '1px solid #333',
//     display: 'flex',
//     alignItems: 'center',
//     padding: '0 20px',
//     justifyContent: 'space-between',
//   },
//   logoArea: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '10px',
//   },
//   logoCircle: {
//     width: '32px',
//     height: '32px',
//     backgroundColor: '#0A7C88',
//     borderRadius: '50%',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     fontWeight: 'bold',
//   },
//   logoText: {
//     fontSize: '18px',
//     fontWeight: '600',
//     color: '#eee',
//   },
//   toolbar: {
//     display: 'flex',
//     gap: '10px',
//     alignItems: 'center',
//   },
//   toolButton: {
//     padding: '8px 12px',
//     backgroundColor: '#333',
//     border: 'none',
//     borderRadius: '4px',
//     color: '#ccc',
//     cursor: 'pointer',
//     fontSize: '13px',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '5px',
//   },
//   activeTool: {
//     backgroundColor: '#0A7C88',
//     color: 'white',
//   },
//   separator: {
//     width: '1px',
//     height: '24px',
//     backgroundColor: '#444',
//     margin: '0 5px',
//   },
//   userProfile: {
//     display: 'flex',
//     alignItems: 'center',
//   },
//   analyzeButton: {
//     backgroundColor: '#D97706',
//     color: 'white',
//     border: 'none',
//     padding: '8px 16px',
//     borderRadius: '4px',
//     fontWeight: 'bold',
//     cursor: 'pointer',
//   },
//   mainContent: {
//     display: 'flex',
//     flex: 1,
//     height: 'calc(100vh - 90px)', 
//   },
//   leftSidebar: {
//     width: '240px',
//     backgroundColor: '#111',
//     borderRight: '1px solid #333',
//     display: 'flex',
//     flexDirection: 'column',
//     overflowY: 'auto',
//   },
//   panelHeader: {
//     padding: '15px',
//     fontSize: '12px',
//     textTransform: 'uppercase',
//     color: '#666',
//     fontWeight: 'bold',
//     letterSpacing: '1px',
//   },
//   seriesItem: {
//     display: 'flex',
//     padding: '10px 15px',
//     cursor: 'pointer',
//     borderLeft: '3px solid transparent',
//     gap: '10px',
//   },
//   activeSeries: {
//     backgroundColor: '#222',
//     borderLeft: '3px solid #0A7C88',
//   },
//   seriesThumbnail: {
//     width: '50px',
//     height: '50px',
//     backgroundColor: '#333',
//     borderRadius: '4px',
//   },
//   seriesName: {
//     fontSize: '13px',
//     color: '#ddd',
//     marginBottom: '4px',
//   },
//   seriesInfo: {
//     fontSize: '11px',
//     color: '#888',
//   },
//   sliderContainer: {
//     marginBottom: '15px',
//   },
//   label: {
//     display: 'block',
//     fontSize: '11px',
//     color: '#aaa',
//     marginBottom: '5px',
//   },
//   slider: {
//     width: '100%',
//     accentColor: '#0A7C88',
//   },
//   viewerGrid: {
//     flex: 1,
//     display: 'grid',
//     gridTemplateColumns: '1fr 1fr',
//     gridTemplateRows: '1fr 1fr',
//     gap: '2px',
//     backgroundColor: '#000',
//   },
//   viewport: {
//     backgroundColor: '#000',
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   statusBar: {
//     height: '30px',
//     backgroundColor: '#1a1a1a',
//     borderTop: '1px solid #333',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: '0 15px',
//     fontSize: '12px',
//     color: '#888',
//   },
//   statusLeft: {
//     display: 'flex',
//     gap: '20px',
//   },
//   statusRight: {
//     display: 'flex',
//     gap: '20px',
//   },
//   statusItem: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '6px',
//   },
// };