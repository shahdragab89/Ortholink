import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// // Inside LoginPage component:
// const navigate = useNavigate();

// const handleSignUp = () => {
//     navigate('/signup');
// };

const BACKGROUND_IMAGE_URL = '/Background.png';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        console.log('Login:', { email, password });
        // Add your login logic here
    };

    const handleSignUp = () => {
        // Navigate to sign up page
        window.location.href = '/signup';
    };

    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `url("${BACKGROUND_IMAGE_URL}")`,
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

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.gradientBar}></div>

                <div style={styles.content}>
                    <h1 style={styles.title}>Welcome Back!</h1>
                    <p style={styles.subtitle}>
                        Access your portal to view appointments and more.
                    </p>

                    <div>
                        <div style={styles.inputWrapper}>
                            <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={styles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={styles.inputWrapper}>
                            <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                                style={styles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={styles.forgotPassword}>
                            <button style={styles.link}>Forgot Password?</button>
                        </div>

                        <button
                            onClick={handleSubmit}
                            style={styles.button}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.02)';
                                e.target.style.boxShadow = '0 8px 20px rgba(95,158,160,0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)';
                                e.target.style.boxShadow = '0 4px 12px rgba(95,158,160,0.3)';
                            }}
                        >
                            Log In
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div>

                    <p style={styles.signupText}>
                        Don't have an account?{' '}
                        <button onClick={handleSignUp} style={styles.signupLink}>Sign up</button>
                    </p>
                </div>
            </div>
        </div>
    );
}