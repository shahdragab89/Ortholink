# 🦴 Ortholink

**Multi-role patient and radiology management system for orthopedic care.**

Ortholink connects doctors, radiologists, receptionists and patients in one web platform: book appointments, share scans and reports securely, and keep patient records in one place.

---

## Features

- **Role-based access** for doctors, radiologists, receptionists and patients
- **Appointment scheduling** and management
- **Scan viewing** in the browser (DICOM support via Cornerstone)
- **Secure scan and report sharing** between staff and patients
- **Centralized patient records**

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React |
| Backend | Node.js |
| Database | SQL |
| Medical imaging | cornerstone-core, cornerstone-wado-image-loader, dicom-parser |
| Testing | `tests/` folder |

## Project Structure

```
Ortholink/
├── backend/     # Node.js API and database logic
├── frontend/    # React app
├── tests/       # Tests
└── package.json # Root dependencies (DICOM viewer libraries)
```

## Getting Started

**Prerequisites:** Node.js 18+ and a running SQL database.

```bash
# 1. Clone the repo
git clone https://github.com/shahdragab89/Ortholink.git
cd Ortholink

# 2. Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install

# 3. Configure environment variables
#    Create a .env file in /backend with your database credentials and secrets

# 4. Run the backend and the frontend (in separate terminals)
cd backend && npm start
cd frontend && npm start
```

## User Roles

| Role | Can do |
| --- | --- |
| **Patient** | Book appointments, view own scans and reports |
| **Receptionist** | Manage appointments and patient registration |
| **Radiologist** | Upload scans and write reports |
| **Doctor** | Review scans and reports, manage patient records |
