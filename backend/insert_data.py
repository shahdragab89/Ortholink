# insert_data.py
from app import create_app, db
from app.models.user import User, Role, Gender
from app.models.patient import Patient
from app.models.staff import Staff
from app.models.appointment import Appointment
from app.models.visit_record import VisitRecord
from app.models.medication import Medication
from app.models.dicom_scan import DicomScan
from datetime import datetime, date, time
import json
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    print("Starting data insertion with hashed passwords...")
    print("=" * 50)
    
    # Common password for easy login
    common_password = "Password123!"
    
    # 1. Create Users with hashed passwords
    users_data = [
        {
            'username': 'john_doe',
            'email': 'john@example.com',
            'password_hash': generate_password_hash(common_password),
            'role': Role.PATIENT,
            'gender': Gender.MALE,
            'f_name': 'John',
            'l_name': 'Doe',
            'birth_date': date(1985, 5, 15),
            'phone': '1234567890',
            'address': '123 Main St'
        },
        {
            'username': 'dr_smith',
            'email': 'smith@hospital.com',
            'password_hash': generate_password_hash(common_password),
            'role': Role.DOCTOR,
            'gender': Gender.MALE,
            'f_name': 'Michael',
            'l_name': 'Smith',
            'birth_date': date(1975, 8, 20),
            'phone': '0987654321',
            'address': '456 Oak Ave'
        },
        {
            'username': 'radiologist_jane',
            'email': 'jane@hospital.com',
            'password_hash': generate_password_hash(common_password),
            'role': Role.RADIOLOGIST,
            'gender': Gender.FEMALE,
            'f_name': 'Jane',
            'l_name': 'Wilson',
            'birth_date': date(1980, 3, 10),
            'phone': '5551234567',
            'address': '789 Pine Rd'
        },
        # Adding more users for testing different roles
        {
            'username': 'admin_alex',
            'email': 'admin@hospital.com',
            'password_hash': generate_password_hash(common_password),
            'role': Role.ADMIN,
            'gender': Gender.MALE,
            'f_name': 'Alex',
            'l_name': 'Johnson',
            'birth_date': date(1970, 1, 1),
            'phone': '9998887777',
            'address': '101 Admin Blvd'
        },
        {
            'username': 'nurse_lisa',
            'email': 'lisa@hospital.com',
            'password_hash': generate_password_hash(common_password),
            'role': Role.NURSE,
            'gender': Gender.FEMALE,
            'f_name': 'Lisa',
            'l_name': 'Brown',
            'birth_date': date(1988, 7, 30),
            'phone': '3334445555',
            'address': '202 Nurse Lane'
        },
        {
            'username': 'receptionist_mark',
            'email': 'mark@hospital.com',
            'password_hash': generate_password_hash(common_password),
            'role': Role.RECEPTIONIST,
            'gender': Gender.MALE,
            'f_name': 'Mark',
            'l_name': 'Davis',
            'birth_date': date(1990, 12, 5),
            'phone': '7776665555',
            'address': '303 Reception St'
        }
    ]
    
    users = []
    for user_data in users_data:
        user = User(**user_data)
        users.append(user)
        db.session.add(user)
        print(f"Created user: {user.username} ({user.role.value})")
    
    db.session.commit()
    print(f"✓ Created {len(users)} users")
    
    # 2. Create Patients (linked to user 1 and additional patients)
    # We need to refresh users to ensure they're in the session
    user_refs = {user.user_id: user for user in users}
    
    patients_data = [
        {
            'user_id': users[0].user_id,  # John Doe
            'blood_type': 'O+',
            'allergies': 'Penicillin, Peanuts',
            'chronic_conditions': 'Hypertension',
            'insurance_provider': 'HealthCare Inc',
            'insurance_number': 'INS123456',
            'emergency_contact_name': 'Jane Doe',
            'emergency_contact_phone': '1112223333'
        }
    ]
    
    patients = []
    for patient_data in patients_data:
        patient = Patient(**patient_data)
        patients.append(patient)
        db.session.add(patient)
        # Get user info from our dictionary instead of relationship
        user = user_refs[patient.user_id]
        print(f"Created patient: {user.f_name} {user.l_name} (User ID: {patient.user_id})")
    
    db.session.commit()
    print(f"✓ Created {len(patients)} patients")
    
    # 3. Create Staff (linked to users 2, 3, 4, 5, 6)
    staff_data = [
        {
            'user_id': users[1].user_id,  # Dr. Smith
            'f_name': 'Michael',
            'l_name': 'Smith',
            'license_number': 'MD123456',
            'phone': '0987654321',
            'department': 'Cardiology',
            'hire_date': date(2015, 6, 1),
            'salary': 120000.00
        },
        {
            'user_id': users[2].user_id,  # Jane Wilson
            'f_name': 'Jane',
            'l_name': 'Wilson',
            'license_number': 'RAD789012',
            'phone': '5551234567',
            'department': 'Radiology',
            'hire_date': date(2018, 9, 15),
            'salary': 95000.00
        },
        {
            'user_id': users[4].user_id,  # Nurse Lisa
            'f_name': 'Lisa',
            'l_name': 'Brown',
            'license_number': 'RN345678',
            'phone': '3334445555',
            'department': 'Emergency',
            'hire_date': date(2020, 3, 10),
            'salary': 75000.00
        },
        {
            'user_id': users[5].user_id,  # Receptionist Mark
            'f_name': 'Mark',
            'l_name': 'Davis',
            'license_number': 'REC901234',
            'phone': '7776665555',
            'department': 'Administration',
            'hire_date': date(2021, 1, 15),
            'salary': 50000.00
        }
    ]
    
    staff_members = []
    for staff_data_item in staff_data:
        staff = Staff(**staff_data_item)
        staff_members.append(staff)
        db.session.add(staff)
        print(f"Created staff: {staff.f_name} {staff.l_name} ({staff.department})")
    
    db.session.commit()
    print(f"✓ Created {len(staff_members)} staff members")
    
    # 4. Create Appointments
    appointments_data = [
        {
            'patient_id': patients[0].patient_id,  # John Doe
            'staff_id': staff_members[0].staff_id,  # Dr. Smith
            'appointment_date': date(2024, 1, 20),
            'appointment_time': time(14, 30),
            'duration_minutes': 30,
            'appointment_type': 'Consultation',
            'status': 'completed',
            'reason': 'Regular checkup',
            'notes': 'Patient needs blood work'
        },
        {
            'patient_id': patients[0].patient_id,
            'staff_id': staff_members[1].staff_id,  # Jane Wilson
            'appointment_date': date(2024, 1, 25),
            'appointment_time': time(10, 0),
            'duration_minutes': 60,
            'appointment_type': 'Scan',
            'status': 'scheduled',
            'reason': 'Chest X-ray',
            'notes': 'Follow-up scan'
        }
    ]
    
    appointments = []
    for appointment_data in appointments_data:
        appointment = Appointment(**appointment_data)
        appointments.append(appointment)
        db.session.add(appointment)
    
    db.session.commit()
    print(f"✓ Created {len(appointments)} appointments")
    
    # 5. Create Visit Records
    visit_records_data = [
        {
            'patient_id': patients[0].patient_id,
            'staff_id': staff_members[0].staff_id,
            'appointment_id': appointments[0].appointment_id,
            'chief_complaint': 'Chest pain and fatigue',
            'diagnosis': 'Hypertension',
            'treatment_plan': 'Prescribed medication, follow-up in 2 weeks',
            'vital_signs': json.dumps({
                'blood_pressure': '140/90',
                'heart_rate': 78,
                'temperature': 98.6,
                'oxygen_saturation': 98
            }),
            'physical_examination': 'Normal heart sounds, clear lungs',
            'notes': 'Patient advised to reduce salt intake'
        }
    ]
    
    visit_records = []
    for visit_record_data in visit_records_data:
        visit_record = VisitRecord(**visit_record_data)
        visit_records.append(visit_record)
        db.session.add(visit_record)
    
    db.session.commit()
    print(f"✓ Created {len(visit_records)} visit records")
    
    # 6. Create Medications
    medications_data = [
        {
            'patient_id': patients[0].patient_id,
            'staff_id': staff_members[0].staff_id,
            'record_id': visit_records[0].record_id,
            'medication_name': 'Lisinopril',
            'dosage': '10mg',
            'frequency': 'Once daily',
            'duration': '30 days',
            'instructions': 'Take in the morning with food',
            'start_date': date(2024, 1, 20),
            'end_date': date(2024, 2, 20)
        },
        {
            'patient_id': patients[0].patient_id,
            'staff_id': staff_members[0].staff_id,
            'medication_name': 'Aspirin',
            'dosage': '81mg',
            'frequency': 'Once daily',
            'duration': 'Ongoing',
            'instructions': 'Take with plenty of water',
            'start_date': date(2024, 1, 20),
            'is_active': True
        }
    ]
    
    medications = []
    for medication_data in medications_data:
        medication = Medication(**medication_data)
        medications.append(medication)
        db.session.add(medication)
    
    db.session.commit()
    print(f"✓ Created {len(medications)} medications")
    
    # 7. Create DICOM Scans
    dicom_scans_data = [
        {
            'patient_id': patients[0].patient_id,
            'doctor_id': staff_members[0].staff_id,
            'radiologist_id': staff_members[1].staff_id,
            'record_id': visit_records[0].record_id,
            'body_part': 'Chest',
            'scan_date': datetime(2024, 1, 20, 15, 30),
            'file_path': '/scans/chest_scan_001.dcm',
            'file_size': 2048576,
            'modality': 'CT',
            'description': 'Chest CT scan for hypertension evaluation',
            'status': 'completed'
        }
    ]
    
    for dicom_scan_data in dicom_scans_data:
        dicom_scan = DicomScan(**dicom_scan_data)
        db.session.add(dicom_scan)
        print(f"Created DICOM scan: {dicom_scan.body_part} {dicom_scan.modality}")
    
    db.session.commit()
    print(f"✓ Created {len(dicom_scans_data)} DICOM scans")
    
    print("=" * 50)
    print("✅ Successfully inserted sample data!")
    print("=" * 50)
    print("\n📋 LOGIN CREDENTIALS:")
    print("All users have the same password for testing: 'Password123!'")
    print("\nAvailable users to login with:")
    print("=" * 40)
    print("PATIENTS:")
    print("  Username: john_doe")
    print("  Password: Password123!")
    print("\nSTAFF:")
    print("  Username: dr_smith (Doctor)")
    print("  Password: Password123!")
    print("  Username: radiologist_jane (Radiologist)")
    print("  Password: Password123!")
    print("  Username: nurse_lisa (Nurse)")
    print("  Password: Password123!")
    print("  Username: receptionist_mark (Receptionist)")
    print("  Password: Password123!")
    print("\nADMIN:")
    print("  Username: admin_alex")
    print("  Password: Password123!")
    print("=" * 40)