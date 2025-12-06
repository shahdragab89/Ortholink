import React, { useState, useEffect } from 'react';
// These imports will now work because we moved the files into the 'pages' folder
import LoginPage from './pages/login';
import SignUpPage from './pages/signup';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientPage from './pages/PatientPage'; // Importing the new page

function App() {
  // Options: 'login', 'signup', 'doctor', 'patient'
  const [currentPage, setCurrentPage] = useState('login');

  useEffect(() => {
    // Function to handle URL changes
    const handlePathChange = () => {
      const path = window.location.pathname;
      if (path === '/signup') {
        setCurrentPage('signup');
      } else if (path === '/doctor') {
        setCurrentPage('doctor');
      } else if (path === '/patient') { // New route for patient
        setCurrentPage('patient');
      } else {
        setCurrentPage('login');
      }
    };

    // Run on mount
    handlePathChange();

    // Listen for back/forward navigation
    window.addEventListener('popstate', handlePathChange);
    return () => window.removeEventListener('popstate', handlePathChange);
  }, []);

  // Render the correct page based on state
  if (currentPage === 'signup') {
    return <SignUpPage />;
  }
  if (currentPage === 'doctor') {
    return <DoctorDashboard />;
  }
  if (currentPage === 'patient') {
    return <PatientPage />;
  }

  return <LoginPage />;
}

export default App;