import React, { useState, useEffect } from 'react';

import LoginPage from './pages/login'; 
import SignUpPage from './pages/signup';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientPage from './pages/PatientPage';
import ReceptionistPage from "./pages/ReceptionistPage";
import RadiologistPage from './pages/RadiologistPage';

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  useEffect(() => {
    const handlePathChange = () => {
      const path = window.location.pathname;

      if (path === '/signup') {
        setCurrentPage('signup');

      } else if (path === '/doctor/dashboard') {
        setCurrentPage('doctor');

      } else if (path === '/patient/dashboard') {
        setCurrentPage('patient');
<<<<<<< HEAD

      } else if (path === '/radiologist/dashboard') {
        setCurrentPage('radiologist');

      } else if (path === '/receptionist') {
=======
      } else if (path === '/radiologist/dashboard') { 
        setCurrentPage('radiologist');
      } else if (path === '/receptionist') { 
>>>>>>> 788ab8c202fb416d450e4cd6312edf171faf4979
        setCurrentPage('receptionist');

      } else {
        setCurrentPage('login');
      }
    };

    handlePathChange();
    window.addEventListener('popstate', handlePathChange);
    return () => window.removeEventListener('popstate', handlePathChange);
  }, []);

  if (currentPage === 'signup') return <SignUpPage />;
  if (currentPage === 'doctor') return <DoctorDashboard />;
  if (currentPage === 'patient') return <PatientPage />;
  if (currentPage === 'radiologist') return <RadiologistPage />;
  if (currentPage === 'receptionist') return <ReceptionistPage />;

  return <LoginPage />;
}

export default App;
