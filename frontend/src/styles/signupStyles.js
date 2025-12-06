export const signupStyles = {
    container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `url("/Background.png")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: '40px 20px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        },
        card: {
            width: '100%',
            maxWidth: '900px',
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
        formGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            marginBottom: '20px'
        },
        inputWrapper: {
            position: 'relative'
        },
        fullWidth: {
            gridColumn: '1 / -1'
        },
        label: {
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#475569',
            marginBottom: '8px'
        },
        input: {
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '15px',
            outline: 'none',
            transition: 'all 0.2s',
            color: '#334155',
            boxSizing: 'border-box',
            backgroundColor: 'white'
        },
        select: {
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '15px',
            outline: 'none',
            transition: 'all 0.2s',
            color: '#334155',
            boxSizing: 'border-box',
            backgroundColor: 'white',
            cursor: 'pointer'
        },
        textarea: {
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '15px',
            outline: 'none',
            transition: 'all 0.2s',
            color: '#334155',
            boxSizing: 'border-box',
            backgroundColor: 'white',
            minHeight: '80px',
            resize: 'vertical',
            fontFamily: 'inherit'
        },
        checkboxWrapper: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '15px'
        },
        checkbox: {
            width: '18px',
            height: '18px',
            cursor: 'pointer',
            accentColor: '#5f9ea0'
        },
        checkboxLabel: {
            fontSize: '15px',
            color: '#475569',
            fontWeight: '500',
            cursor: 'pointer'
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
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(95,158,160,0.3)',
            marginTop: '20px'
        },
        loginText: {
            textAlign: 'center',
            marginTop: '24px',
            color: '#64748b',
            fontSize: '15px'
        },
        loginLink: {
            color: '#5f9ea0',
            fontWeight: '600',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'none'
        },
        sectionTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#334155',
            marginTop: '30px',
            marginBottom: '20px',
            paddingBottom: '10px',
            borderBottom: '2px solid #e2e8f0'
        }

};