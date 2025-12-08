import React, { useState } from 'react'; 
import { signupStyles } from '../styles/signupStyles';

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

    // const handleSubmit = () => {
    //     if (formData.password !== formData.confirmPassword) {
    //         alert('Passwords do not match!');
    //         return;
    //     }
    //     console.log('Sign Up:', formData);
    // };

   const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    const genderValue = formData.gender


    const dataToSend = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        birth_date: formData.birthDate,
        gender: genderValue,
        phone: formData.phone,
        address: formData.address,
        blood_type: formData.bloodType || null,
        allergies: hasAllergies ? formData.allergies : null,
        chronic_conditions: hasChronicConditions ? formData.chronicCondition : null,
        insurance_provider: formData.insuranceProvider || null,
        insurance_number: formData.insuranceNumber || null,
        emergency_contact_name: formData.emergencyContactName,
        emergency_contact_phone: formData.emergencyContactPhone
    };

    console.log('Sending signup data:', dataToSend);

    try {
    const response = await fetch('http://127.0.0.1:5000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
    });

    console.log('Response status:', response.status);

 
    const result = await response.json();
    console.log('Server response:', result);

    if (!response.ok) {
        alert(`Signup failed: ${result.message || JSON.stringify(result)}`);
        return;
    }

    alert('Signup successful!');
    window.location.href = `/patient/${result.patient_id}`;

} catch (error) {
    console.error('Error during signup:', error);
    
}


};


    const handleLoginClick = () => {
        window.location.href = '/';
    };

    return (
        <div style={signupStyles.container}>
            <div style={signupStyles.card}>
                <div style={signupStyles.gradientBar}></div>

                <div style={signupStyles.content}>
                    <h1 style={signupStyles.title}>Create Account</h1>
                    <p style={signupStyles.subtitle}>
                        Join us to manage your healthcare appointments
                    </p>

                    {/* Account Information */}
                    <div style={signupStyles.formGrid}>
                        <div style={signupStyles.inputWrapper}>
                            <label style={signupStyles.label}>Username *</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                style={signupStyles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={signupStyles.inputWrapper}>
                            <label style={signupStyles.label}>Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                style={signupStyles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={signupStyles.inputWrapper}>
                            <label style={signupStyles.label}>Password *</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                style={signupStyles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={signupStyles.inputWrapper}>
                            <label style={signupStyles.label}>Confirm Password *</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                style={signupStyles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                    </div>

                    {/* Personal Information */}
                    <h3 style={signupStyles.sectionTitle}>Personal Information</h3>
                    <div style={signupStyles.formGrid}>
                        <div style={signupStyles.inputWrapper}>
                            <label style={signupStyles.label}>First Name *</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                style={signupStyles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={signupStyles.inputWrapper}>
                            <label style={signupStyles.label}>Last Name *</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                style={signupStyles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={signupStyles.inputWrapper}>
                            <label style={signupStyles.label}>Birth Date *</label>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                style={signupStyles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={signupStyles.inputWrapper}>
                            <label style={signupStyles.label}>Gender *</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                style={signupStyles.select}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        <div style={signupStyles.inputWrapper}>
                            <label style={signupStyles.label}>Phone *</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                style={signupStyles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={signupStyles.inputWrapper}>
                            <label style={signupStyles.label}>Blood Type</label>
                            <select
                                name="bloodType"
                                value={formData.bloodType}
                                onChange={handleChange}
                                style={signupStyles.select}
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

                        <div style={{ ...signupStyles.inputWrapper, ...signupStyles.fullWidth }}>
                            <label style={signupStyles.label}>Address *</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                style={signupStyles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                    </div>

                    {/* Medical Information */}
                    <h3 style={signupStyles.sectionTitle}>Medical Information</h3>

                    <div style={signupStyles.checkboxWrapper}>
                        <input
                            type="checkbox"
                            id="hasAllergies"
                            checked={hasAllergies}
                            onChange={(e) => setHasAllergies(e.target.checked)}
                            style={signupStyles.checkbox}
                        />
                        <label htmlFor="hasAllergies" style={signupStyles.checkboxLabel}>
                            I have allergies
                        </label>
                    </div>

                    {hasAllergies && (
                        <div style={{ ...signupStyles.inputWrapper, ...signupStyles.fullWidth, marginBottom: '20px' }}>
                            <label style={signupStyles.label}>Please list your allergies</label>
                            <textarea
                                name="allergies"
                                value={formData.allergies}
                                onChange={handleChange}
                                placeholder="List any allergies..."
                                style={signupStyles.textarea}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                    )}

                    <div style={signupStyles.checkboxWrapper}>
                        <input
                            type="checkbox"
                            id="hasChronicConditions"
                            checked={hasChronicConditions}
                            onChange={(e) => setHasChronicConditions(e.target.checked)}
                            style={signupStyles.checkbox}
                        />
                        <label htmlFor="hasChronicConditions" style={signupStyles.checkboxLabel}>
                            I have chronic conditions
                        </label>
                    </div>

                    {hasChronicConditions && (
                        <div style={{ ...signupStyles.inputWrapper, ...signupStyles.fullWidth, marginBottom: '20px' }}>
                            <label style={signupStyles.label}>Please list your chronic conditions</label>
                            <textarea
                                name="chronicCondition"
                                value={formData.chronicCondition}
                                onChange={handleChange}
                                placeholder="List any chronic conditions..."
                                style={signupStyles.textarea}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                    )}

                    {/* Insurance Information */}
                    <h3 style={signupStyles.sectionTitle}>Insurance Information</h3>
                    <div style={signupStyles.formGrid}>
                        <div style={signupStyles.inputWrapper}>
                            <label style={signupStyles.label}>Insurance Provider</label>
                            <input
                                type="text"
                                name="insuranceProvider"
                                value={formData.insuranceProvider}
                                onChange={handleChange}
                                style={signupStyles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={signupStyles.inputWrapper}>
                            <label style={signupStyles.label}>Insurance Number</label>
                            <input
                                type="text"
                                name="insuranceNumber"
                                value={formData.insuranceNumber}
                                onChange={handleChange}
                                style={signupStyles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <h3 style={signupStyles.sectionTitle}>Emergency Contact</h3>
                    <div style={signupStyles.formGrid}>
                        <div style={signupStyles.inputWrapper}>
                            <label style={signupStyles.label}>Emergency Contact Name *</label>
                            <input
                                type="text"
                                name="emergencyContactName"
                                value={formData.emergencyContactName}
                                onChange={handleChange}
                                style={signupStyles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={signupStyles.inputWrapper}>
                            <label style={signupStyles.label}>Emergency Contact Phone *</label>
                            <input
                                type="tel"
                                name="emergencyContactPhone"
                                value={formData.emergencyContactPhone}
                                onChange={handleChange}
                                style={signupStyles.input}
                                onFocus={(e) => e.target.style.borderColor = '#5f9ea0'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        style={signupStyles.button}
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

                    <p style={signupStyles.loginText}>
                        Already have an account?{' '}
                        <button onClick={handleLoginClick} style={signupStyles.loginLink}>Log in</button>
                    </p>
                </div>
            </div>
        </div>
    );
}