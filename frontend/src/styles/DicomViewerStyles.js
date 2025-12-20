export const dicomViewerStyles = {
  // Main Container - LOCKED to screen height
  container: {
    height: '100vh', // Changed from minHeight to height
    width: '100vw',
    backgroundColor: '#000000', // Pure black for medical standard
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    color: '#e5e7eb',
    overflow: 'hidden', // Prevents full page scroll
  },

  // Top Toolbar
  toolbar: {
    backgroundColor: '#1f2937',
    padding: '8px 16px', // Reduced padding to save space
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #374151',
    height: '60px', // Fixed height
    flexShrink: 0, // Prevents shrinking
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

  toolGroup: { display: 'flex', gap: '6px' }, // Tighter gap

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
  },

  toolBtnActive: {
    backgroundColor: '#059669',
    borderColor: '#10b981',
    color: 'white',
    boxShadow: '0 0 10px rgba(5, 150, 105, 0.4)', // Glow effect
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

  // Main Content Area - The key to fixing layout
  mainContent: {
    display: 'flex',
    flex: 1, // Takes remaining height
    height: 'calc(100vh - 90px)', // Subtract toolbar + status bar
    overflow: 'hidden',
  },

  // Sidebar
  sidebar: {
    width: '260px', // Slightly narrower
    backgroundColor: '#111827',
    borderRight: '1px solid #374151',
    overflowY: 'auto', // ONLY sidebar scrolls
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flexShrink: 0,
  },

  // Cards
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

  // Info Rows (Compact)
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

  // Series List
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

  // Sliders (Compact)
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
    height: '4px',
    borderRadius: '2px',
    outline: 'none',
    background: '#4b5563',
    appearance: 'none',
    cursor: 'pointer',
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

  // Viewport Grid
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

  // Images
  dicomImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundSize: '40px 40px', // Grid background
    backgroundImage: 'linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)',
  },

  // Overlays
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
  },

  // Status Bar
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