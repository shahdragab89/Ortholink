import React, { useState, useEffect } from 'react';

import LoginPage from './pages/login'; 
import SignUpPage from './pages/signup';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientPage from './pages/PatientPage';
import ReceptionistPage from "./pages/ReceptionistPage";
import RadiologistPage from './pages/RadiologistPage';
import AdminPage from './pages/AdminPage';
import DicomViewerPage from './pages/DicomViewerPage';

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
      } else if (path === '/radiologist/dashboard') { 
        setCurrentPage('radiologist');
      } else if (path === '/receptionist') { 
        setCurrentPage('receptionist');
      }
       else if (path === '/doctor') { 
        setCurrentPage('doctor');
      }
      else if (path === '/admin') {
        setCurrentPage('admin');
      }
      else if (path === '/dicom-viewer') { 
        setCurrentPage('dicom-viewer');

      }
       else {
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
  if (currentPage === 'admin') return <AdminPage />;
  if (currentPage === 'dicom-viewer') return <DicomViewerPage />;

  return <LoginPage />;
}

export default App;
