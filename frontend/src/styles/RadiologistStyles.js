export const radiologistStyles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f3f4f6', // Slightly darker grey for better contrast with white cards
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
    },
    // --- Header (Sticky Top Bar) ---
    header: {
        backgroundColor: '#ffffff',
        padding: '12px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    logoGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    logoText: {
        fontSize: '22px',
        fontWeight: '800',
        color: '#065f46', // Dark Emerald Green
        margin: 0,
        letterSpacing: '-0.5px',
    },
    profileSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    profileCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        padding: '6px 12px',
        borderRadius: '8px',
        transition: 'background 0.2s',
    },
    avatar: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: '#059669', // Emerald Green
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
        fontSize: '14px',
    },
    doctorName: {
        fontWeight: '600',
        color: '#374151',
        fontSize: '14px',
    },
    logoutBtn: {
        color: '#dc2626', // Red
        background: 'none',
        border: '1px solid #fecaca',
        padding: '6px 14px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '13px',
        transition: 'all 0.2s',
    },

    // --- Main Content Area ---
    main: {
        padding: '30px 40px',
        maxWidth: '1280px', // Slightly constrained max width for better readability
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
        flex: 1,
    },

    // --- Big Welcome Section ---
    welcomeBanner: {
        backgroundColor: '#d1fae5', // Light Green background
        borderRadius: '20px',
        padding: '40px',
        marginBottom: '40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    },
    welcomeTextBox: {
        zIndex: 2,
        maxWidth: '60%',
    },
    welcomeTitle: {
        fontSize: '36px',
        fontWeight: '800',
        color: '#064e3b', // Very dark green
        marginBottom: '16px',
        lineHeight: '1.2',
    },
    welcomeSubText: {
        fontSize: '16px',
        color: '#047857',
        maxWidth: '500px',
        lineHeight: '1.5',
    },
    welcomeHighlight: {
        color: '#059669',
        fontWeight: '700',
    },
    // Placeholder for the illustration seen in your examples
    welcomeIllustration: {
        height: '180px',
        // Using a placeholder colored div instead of a real image for now
        width: '250px',
        backgroundColor: '#a7f3d0',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#065f46',
        fontWeight: 'bold',
        zIndex: 2,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
    // Optional decorative circles background
    decorativeCircle1: { position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', backgroundColor: '#ecfdf5', zIndex: 1 },
    decorativeCircle2: { position: 'absolute', bottom: '-80px', left: '100px', width: '150px', height: '150px', borderRadius: '50%', backgroundColor: '#ecfdf5', zIndex: 1 },


    pageTitle: {
        color: '#111827',
        marginBottom: '24px',
        fontSize: '24px',
        fontWeight: '700',
    },

    // --- Search Bar ---
    searchContainer: {
        marginBottom: '25px',
    },
    searchInput: {
        width: '100%',
        maxWidth: '400px',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #d1d5db',
        fontSize: '14px',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        outline: 'none',
        transition: 'border-color 0.2s',
    },

    // --- Table ---
    tableContainer: {
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
        border: '1px solid #e5e7eb',
    },
    table: {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: 0,
        textAlign: 'left',
    },
    th: {
        backgroundColor: '#f9fafb',
        color: '#6b7280',
        fontWeight: '600',
        padding: '16px 24px',
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        borderBottom: '1px solid #e5e7eb',
    },
    td: {
        padding: '16px 24px',
        borderBottom: '1px solid #f3f4f6',
        color: '#374151',
        fontSize: '14px',
        verticalAlign: 'middle',
    },
    actionBtn: {
        backgroundColor: '#059669', // Emerald Green
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    },
    disabledBtn: {
        backgroundColor: '#e5e7eb',
        color: '#9ca3af',
        border: '1px solid #d1d5db',
        padding: '8px 16px',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'not-allowed',
        boxShadow: 'none',
    },
    statusBadge: {
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        display: 'inline-block',
    },

    // --- Modal (Upload Form) ---
    overlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(17, 24, 39, 0.6)', // Darker overlay
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(2px)',
    },
    modal: {
        backgroundColor: 'white',
        width: '100%',
        maxWidth: '600px',
        borderRadius: '20px',
        padding: '32px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        maxHeight: '90vh',
        overflowY: 'auto',
    },
    modalHeader: {
        fontSize: '22px',
        fontWeight: '700',
        color: '#111827',
        marginBottom: '24px',
    },
    infoBox: {
        backgroundColor: '#f0fdf4', // Light green background
        border: '1px solid #bbf7d0',
        borderRadius: '10px',
        padding: '16px',
        marginBottom: '24px',
        fontSize: '14px',
        color: '#166534',
        lineHeight: '1.6',
    },
    formLabel: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151',
    },
    uploadBox: {
        border: '2px dashed #d1d5db',
        borderRadius: '10px',
        padding: '30px',
        textAlign: 'center',
        cursor: 'pointer',
        marginBottom: '24px',
        color: '#6b7280',
        backgroundColor: '#f9fafb',
        transition: 'border-color 0.2s',
    },
    textArea: {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #d1d5db',
        minHeight: '100px',
        marginBottom: '24px',
        fontFamily: 'inherit',
        fontSize: '14px',
        resize: 'vertical',
        outline: 'none',
        boxSizing: 'border-box', // Fixes padding causing overflow
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
    },

    // --- Profile Editor (Redesigned) ---
    profileContainer: {
        backgroundColor: 'white',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        maxWidth: '800px', // Constrain width specifically for profile
        margin: '0 auto',
    },
    backButton: {
        background: 'none',
        border: 'none',
        color: '#6b7280',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: 0,
    },
    // New centered layout for profile
    profileContentWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    profilePhotoSection: {
        textAlign: 'center',
        marginBottom: '30px',
        position: 'relative',
    },
    largeAvatar: {
        width: '140px',
        height: '140px',
        borderRadius: '50%',
        backgroundColor: '#e5e7eb',
        margin: '0 auto 16px',
        objectFit: 'cover',
        border: '4px solid white',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    },
    editPhotoBtn: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#059669',
        backgroundColor: 'white',
        border: '1px solid #d1fae5',
        padding: '8px 16px',
        borderRadius: '20px',
        cursor: 'pointer',
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
        transition: 'all 0.2s',
    },
    // Stacked form grid
    formStack: {
        width: '100%',
        maxWidth: '500px', // Controls the width of the form fields
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#111827',
        marginTop: '10px',
        marginBottom: '15px',
        paddingBottom: '8px',
        borderBottom: '2px solid #f3f4f6',
    },
    inputGroup: {
        marginBottom: '0', // managed by flex gap
    },
    readOnlyField: {
        width: '100%',
        padding: '12px 16px',
        backgroundColor: '#f3f4f6',
        border: '1px solid transparent',
        borderRadius: '8px',
        color: '#6b7280',
        fontWeight: '500',
        fontSize: '14px',
        boxSizing: 'border-box',
    },
    editableInput: {
        width: '100%',
        padding: '12px 16px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        color: '#1f2937',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    // New Stats section styles
    statsContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '10px',
    },
    statCard: {
        backgroundColor: '#ecfdf5', // Very light green
        padding: '16px',
        borderRadius: '12px',
        textAlign: 'center',
        border: '1px solid #d1fae5',
    },
    statNumber: {
        display: 'block',
        fontSize: '24px',
        fontWeight: '800',
        color: '#059669',
    },
    statLabel: {
        fontSize: '13px',
        color: '#064e3b',
        fontWeight: '600',
    },
    // Centered, fitted save button
    saveBtn: {
        backgroundColor: '#059669',
        color: 'white',
        border: 'none',
        padding: '12px 32px',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '15px',
        cursor: 'pointer',
        marginTop: '20px',
        alignSelf: 'center', // Centers in flex column
        width: 'fit-content', // Only as wide as needed
        boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.2)',
        transition: 'transform 0.1s',
    }
};