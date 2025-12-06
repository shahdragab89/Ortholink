export const loginStyles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url("/Background.png")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    card: {
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        overflow: 'hidden'
    },
    gradientBar: {
        height: '8px',
        background: 'linear-gradient(90deg, #5f9ea0 0%, #4a7c7e 100%)'
    },
    content: {
        padding: '48px 40px'
    },
    title: {
        fontSize: '36px',
        fontWeight: '700',
        color: '#1e293b',
        textAlign: 'center',
        marginBottom: '12px'
    },
    subtitle: {
        fontSize: '16px',
        color: '#64748b',
        textAlign: 'center',
        marginBottom: '40px'
    },
    inputWrapper: {
        position: 'relative',
        marginBottom: '20px'
    },
    icon: {
        position: 'absolute',
        left: '16px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#94a3b8',
        width: '20px',
        height: '20px'
    },
    input: {
        width: '100%',
        padding: '16px 16px 16px 48px',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        fontSize: '16px',
        outline: 'none',
        transition: 'all 0.2s',
        color: '#334155',
        boxSizing: 'border-box',
        backgroundColor: 'white'
    },
    forgotPassword: {
        textAlign: 'right',
        marginBottom: '20px'
    },
    link: {
        color: '#5f9ea0',
        fontSize: '14px',
        fontWeight: '500',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        textDecoration: 'none'
    },
    button: {
        width: '100%',
        padding: '16px',
        background: 'linear-gradient(90deg, #5f9ea0 0%, #4a7c7e 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.2s',
        boxShadow: '0 4px 12px rgba(95,158,160,0.3)'
    },
    signupText: {
        textAlign: 'center',
        marginTop: '32px',
        color: '#64748b',
        fontSize: '15px'
    },
    signupLink: {
        color: '#5f9ea0',
        fontWeight: '600',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        textDecoration: 'none'
    }
};