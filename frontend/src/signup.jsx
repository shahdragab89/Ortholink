import React, { useState } from 'react';

const BACKGROUND_IMAGE_URL = '/Background.png';

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        birthDate: '',
        gender: '',
        phone: '',
        address: '',
        bloodType: '',
        allergies: '',
        chronicCondition: '',
        insuranceProvider: '',
        insuranceNumber: '',
        emergencyContactName: '',
        emergencyContactPhone: ''
    });

    const [hasAllergies, setHasAllergies] = useState(false);
    const [hasChronicConditions, setHasChronicConditions] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = () => {
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        console.log('Sign Up:', formData);
        // Add your sign up logic here
    };

    const handleLoginClick = () => {
        window.location.href = '/';
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

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.gradientBar}></div>

                <div style={styles.content}>
                    <h1 style={styles.title}>Create Account</h1>
                    <p style={styles.subtitle}>
                        Join us to manage your healthcare appointments
                    </p>

                    {/* Account Information */}
                    <div style={styles.formGrid}>
                        <div style={styles.inputWrapper}>
                            <label style={styles.label}>Username *</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                style={styles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={styles.inputWrapper}>
                            <label style={styles.label}>Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                style={styles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={styles.inputWrapper}>
                            <label style={styles.label}>Password *</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                style={styles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={styles.inputWrapper}>
                            <label style={styles.label}>Confirm Password *</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                style={styles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                    </div>

                    {/* Personal Information */}
                    <h3 style={styles.sectionTitle}>Personal Information</h3>
                    <div style={styles.formGrid}>
                        <div style={styles.inputWrapper}>
                            <label style={styles.label}>First Name *</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                style={styles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={styles.inputWrapper}>
                            <label style={styles.label}>Last Name *</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                style={styles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={styles.inputWrapper}>
                            <label style={styles.label}>Birth Date *</label>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                style={styles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={styles.inputWrapper}>
                            <label style={styles.label}>Gender *</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                style={styles.select}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        <div style={styles.inputWrapper}>
                            <label style={styles.label}>Phone *</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                style={styles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={styles.inputWrapper}>
                            <label style={styles.label}>Blood Type</label>
                            <select
                                name="bloodType"
                                value={formData.bloodType}
                                onChange={handleChange}
                                style={styles.select}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            >
                                <option value="">Select Blood Type</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>

                        <div style={{...styles.inputWrapper, ...styles.fullWidth}}>
                            <label style={styles.label}>Address *</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                style={styles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                    </div>

                    {/* Medical Information */}
                    <h3 style={styles.sectionTitle}>Medical Information</h3>
                    
                    <div style={styles.checkboxWrapper}>
                        <input
                            type="checkbox"
                            id="hasAllergies"
                            checked={hasAllergies}
                            onChange={(e) => setHasAllergies(e.target.checked)}
                            style={styles.checkbox}
                        />
                        <label htmlFor="hasAllergies" style={styles.checkboxLabel}>
                            I have allergies
                        </label>
                    </div>

                    {hasAllergies && (
                        <div style={{...styles.inputWrapper, ...styles.fullWidth, marginBottom: '20px'}}>
                            <label style={styles.label}>Please list your allergies</label>
                            <textarea
                                name="allergies"
                                value={formData.allergies}
                                onChange={handleChange}
                                placeholder="List any allergies..."
                                style={styles.textarea}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                    )}

                    <div style={styles.checkboxWrapper}>
                        <input
                            type="checkbox"
                            id="hasChronicConditions"
                            checked={hasChronicConditions}
                            onChange={(e) => setHasChronicConditions(e.target.checked)}
                            style={styles.checkbox}
                        />
                        <label htmlFor="hasChronicConditions" style={styles.checkboxLabel}>
                            I have chronic conditions
                        </label>
                    </div>

                    {hasChronicConditions && (
                        <div style={{...styles.inputWrapper, ...styles.fullWidth, marginBottom: '20px'}}>
                            <label style={styles.label}>Please list your chronic conditions</label>
                            <textarea
                                name="chronicCondition"
                                value={formData.chronicCondition}
                                onChange={handleChange}
                                placeholder="List any chronic conditions..."
                                style={styles.textarea}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                    )}

                    {/* Insurance Information */}
                    <h3 style={styles.sectionTitle}>Insurance Information</h3>
                    <div style={styles.formGrid}>
                        <div style={styles.inputWrapper}>
                            <label style={styles.label}>Insurance Provider</label>
                            <input
                                type="text"
                                name="insuranceProvider"
                                value={formData.insuranceProvider}
                                onChange={handleChange}
                                style={styles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={styles.inputWrapper}>
                            <label style={styles.label}>Insurance Number</label>
                            <input
                                type="text"
                                name="insuranceNumber"
                                value={formData.insuranceNumber}
                                onChange={handleChange}
                                style={styles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <h3 style={styles.sectionTitle}>Emergency Contact</h3>
                    <div style={styles.formGrid}>
                        <div style={styles.inputWrapper}>
                            <label style={styles.label}>Emergency Contact Name *</label>
                            <input
                                type="text"
                                name="emergencyContactName"
                                value={formData.emergencyContactName}
                                onChange={handleChange}
                                style={styles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={styles.inputWrapper}>
                            <label style={styles.label}>Emergency Contact Phone *</label>
                            <input
                                type="tel"
                                name="emergencyContactPhone"
                                value={formData.emergencyContactPhone}
                                onChange={handleChange}
                                style={styles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
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
                        Create Account
                    </button>

                    <p style={styles.loginText}>
                        Already have an account?{' '}
                        <button onClick={handleLoginClick} style={styles.loginLink}>Log in</button>
                    </p>
                </div>
            </div>
        </div>
    );
}