import React, { useState } from 'react'; 
import { loginStyles } from '../styles/loginStyles';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
    if (!email || !password) {
        alert("Please enter email and password");
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });


        const result = await response.json();

if (response.ok) {
    localStorage.setItem("token", result.access_token);
    localStorage.setItem("role", result.role);
    localStorage.setItem("user_id", result.user_id);

    if (result.role === "patient") {
        window.location.href = "/patient/dashboard";

    }else if (role === "receptioinist") {
        window.location.href = "/receptionist";

    } else if (result.role === "doctor") {
        window.location.href = "/doctor/dashboard";
    } else if (result.role === "radiologist") {
        window.location.href = "/radiologist/dashboard";
    } else {
        window.location.href = "/";
    }

} else {
    alert(`Login failed: ${result.message}`);
}

    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong");
    }
};


    const handleSignUp = () => {
        window.location.href = '/signup';
    };

    return (
        <div style={loginStyles.container}>
            <div style={loginStyles.card}>
                <div style={loginStyles.gradientBar}></div>

                <div style={loginStyles.content}>
                    <h1 style={loginStyles.title}>Welcome Back!</h1>
                    <p style={loginStyles.subtitle}>
                        Access your portal to view appointments and more.
                    </p>

                    <div>
                        <div style={loginStyles.inputWrapper}>
                            <svg style={loginStyles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={loginStyles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={loginStyles.inputWrapper}>
                            <svg style={loginStyles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                                style={loginStyles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={loginStyles.forgotPassword}>
                            <button style={loginStyles.link}>Forgot Password?</button>
                        </div>

                        <button
                            onClick={handleSubmit}
                            style={loginStyles.button}
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

                    <p style={loginStyles.signupText}>
                        Don't have an account?{' '}
                        <button onClick={handleSignUp} style={loginStyles.signupLink}>Sign up</button>
                    </p>
                </div>
            </div>
        </div>
    );
}