export const cdssStyles = {
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

  header: {
    backgroundColor: '#111827',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #374151',
    height: '56px',
    flexShrink: 0,
  },

  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },

  backBtn: {
    backgroundColor: 'transparent',
    color: '#9ca3af',
    border: 'none',
    padding: '6px 0',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  headerTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderLeft: '1px solid #374151',
    paddingLeft: '16px',
  },

  headerSubtitle: {
    fontSize: '13px',
    color: '#34d399',
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    padding: '2px 8px',
    borderRadius: '4px',
    fontWeight: '500',
  },

  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  closeBtn: {
    backgroundColor: 'transparent',
    color: '#9ca3af',
    border: '1px solid #4b5563',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },

  mainContent: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },

  leftSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: '#000000',
  },

  patientSummary: {
    backgroundColor: '#1f2937',
    padding: '12px 20px',
    borderBottom: '1px solid #374151',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
  },

  summaryLeft: {
    display: 'flex',
    gap: '32px',
  },

  summaryItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },

  summaryLabel: {
    fontSize: '10px',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  summaryValue: {
    fontSize: '13px',
    color: '#e5e7eb',
    fontWeight: '500',
  },

  dicomViewerContainer: {
    flex: 1,
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    overflow: 'auto',
  },

  viewerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },

  viewerTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#d1d5db',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  viewerTools: {
    display: 'flex',
    gap: '8px',
  },

  toolBtn: {
    backgroundColor: '#1f2937',
    color: '#e5e7eb',
    border: '1px solid #374151',
    padding: '4px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  toolBtnActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
    color: 'white',
  },

  imagesGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr',
    gap: '8px',
    flex: 1,
    minHeight: '0',
  },

  imageViewport: {
    backgroundColor: '#000000',
    borderRadius: '4px',
    border: '1px solid #374151',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
  },

  imageContainer: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  dicomImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    // Transform is handled inline for performance
  },

  heatmapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 60% 40%, rgba(255, 0, 0, 0.4) 0%, rgba(255, 255, 0, 0.2) 30%, transparent 60%)',
    mixBlendMode: 'screen',
    pointerEvents: 'none',
  },

  imageOverlay: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    color: '#34d399',
    fontSize: '12px',
    fontWeight: '600',
    textShadow: '0 1px 2px black',
    pointerEvents: 'none',
  },

  sliceInfo: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    color: '#d1d5db',
    fontSize: '11px',
    fontFamily: 'monospace',
    textAlign: 'right',
    textShadow: '0 1px 2px black',
    pointerEvents: 'none',
  },

  boundingBox: {
    position: 'absolute',
    border: '2px solid #ef4444',
    pointerEvents: 'none',
    boxShadow: '0 0 8px rgba(239, 68, 68, 0.4)',
  },

  detectionLabel: {
    position: 'absolute',
    top: '-22px', 
    left: '-2px',
    backgroundColor: '#ef4444',
    color: 'white',
    fontSize: '11px',
    fontWeight: 'bold',
    padding: '2px 6px',
    borderRadius: '2px',
    whiteSpace: 'nowrap',
  },

  sliderContainer: {
    padding: '4px 8px',
    backgroundColor: '#111827',
    borderTop: '1px solid #374151',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    height: '28px',
  },

  slider: {
    flex: 1,
    height: '4px',
    borderRadius: '2px',
    outline: 'none',
    background: '#374151',
    appearance: 'none',
    cursor: 'pointer',
  },

  rightSidebar: {
    width: '360px',
    backgroundColor: '#111827',
    borderLeft: '1px solid #374151',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    flexShrink: 0,
  },

  sidebarHeader: {
    padding: '16px',
    borderBottom: '1px solid #374151',
    backgroundColor: '#111827',
  },

  sidebarTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#f3f4f6',
    letterSpacing: '0.3px',
  },

  sidebarContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px', // Increased gap between sections
  },

  insightCard: {
    backgroundColor: '#1f2937',
    borderRadius: '6px',
    padding: '14px',
    border: '1px solid #374151',
  },

  insightHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },

  insightTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  riskBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  riskDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },

  findingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  findingItem: {
    backgroundColor: '#111827',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #374151',
    display: 'flex',
    alignItems: 'start',
    gap: '12px',
  },

  findingSeverityIndicator: {
    width: '4px',
    alignSelf: 'stretch',
    borderRadius: '2px',
  },

  findingContent: {
    flex: 1,
  },

  findingTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: '4px',
  },

  findingDescription: {
    fontSize: '12px',
    color: '#9ca3af',
    lineHeight: '1.4',
    marginBottom: '6px',
  },

  findingMeta: {
    fontSize: '11px',
    color: '#6b7280',
    display: 'flex',
    justifyContent: 'space-between',
  },

  confidenceBarContainer: {
    marginTop: '8px',
  },

  confidenceBar: {
    width: '100%',
    height: '6px',
    backgroundColor: '#111827',
    borderRadius: '3px',
    overflow: 'hidden',
    marginTop: '6px',
  },

  confidenceFill: {
    height: '100%',
    backgroundColor: '#34d399',
    borderRadius: '3px',
  },

  confidenceValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#e5e7eb',
  },

  recommendationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  recommendationItem: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
    fontSize: '13px',
    color: '#d1d5db',
    lineHeight: '1.5',
    backgroundColor: '#1f2937',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #374151',
  },

  recIcon: {
    color: '#34d399',
    fontWeight: 'bold',
    marginTop: '1px',
  },
};