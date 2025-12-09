# backend/test_complete_models.py
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.extensions import db
from app.models.user import User, Gender, Role
from app.models.patient import Patient
from app.models.staff import Staff
from app.models.appointment import Appointment
from werkzeug.security import generate_password_hash
from datetime import datetime, time

app = create_app()

def test_complete_workflow():
    with app.app_context():
        try:
            print("Testing complete model workflow...\n")
            
            # Clean up previous test data
            db.session.query(Appointment).delete()
            db.session.query(Patient).delete()
            db.session.query(Staff).delete()
            db.session.query(User).delete()
            db.session.commit()
            
            # 1. Create a patient user
            print("1. Creating patient user and patient record...")
            patient_user = User(
                username='batyy',
                email='baty@example.com',
                password_hash=generate_password_hash('baty123'),
                role=Role.PATIENT,
                gender=Gender.MALE,
                f_name='baty',
                l_name='bob',
                birth_date=datetime(1985, 6, 15).date(),
                phone='555-0101',
                address='123 Main St',
                is_active=True
            )
            db.session.add(patient_user)
            db.session.flush()  # Get the user_id
            
            # Create patient record
            patient = Patient(
                user_id=patient_user.user_id,
                blood_type='O+',
                allergies='Penicillin',
                chronic_conditions='Hypertension',
                insurance_provider='HealthPlus',
                insurance_number='HP123456',
                emergency_contact_name='Jane Doe',
                emergency_contact_phone='555-0102'
            )
            db.session.add(patient)
            
            # 2. Create a doctor user
            print("2. Creating doctor user and staff record...")
            doctor_user = User(
                username='dr_smith',
                email='smith@ortholink.com',
                password_hash=generate_password_hash('doctor123'),
                role=Role.DOCTOR,
                gender=Gender.FEMALE,
                f_name='Sarah',
                l_name='Smith',
                birth_date=datetime(1978, 3, 22).date(),
                phone='555-0201',
                address='456 Oak Ave',
                is_active=True
            )
            db.session.add(doctor_user)
            db.session.flush()
            
            # Create staff record
            doctor_staff = Staff(
                user_id=doctor_user.user_id,
                f_name='Sarah',
                l_name='Smith',
                license_number='MD123456',
                phone='555-0202',
                department='Orthopedics',
                hire_date=datetime(2015, 7, 1).date(),
                salary=150000.00
            )
            db.session.add(doctor_staff)
            
            db.session.commit()
            print(f"   ✅ Patient created: {patient.patient_id}")
            print(f"   ✅ Doctor created: {doctor_staff.staff_id}")
            
            # 3. Create an appointment
            print("\n3. Creating appointment...")
            appointment = Appointment(
                patient_id=patient.patient_id,
                staff_id=doctor_staff.staff_id,
                appointment_date=datetime(2024, 1, 20).date(),
                appointment_time=time(14, 30),
                duration_minutes=30,
                appointment_type='Consultation',
                status='scheduled',
                reason='Knee pain follow-up',
                notes='Patient reports ongoing discomfort'
            )
            db.session.add(appointment)
            db.session.commit()
            
            print(f"   ✅ Appointment created: {appointment.appointment_id}")
            print(f"   Patient: {appointment.patient.user.f_name} {appointment.patient.user.l_name}")
            print(f"   Doctor: {appointment.staff.user.f_name} {appointment.staff.user.l_name}")
            print(f"   Date: {appointment.appointment_date} at {appointment.appointment_time}")
            
            # 4. Query and display relationships
            print("\n4. Testing relationships...")
            
            # From patient, get appointments
            patient_appointments = patient.appointments
            print(f"   Patient's appointments: {len(patient_appointments)}")
            for appt in patient_appointments:
                print(f"     - Appointment {appt.appointment_id} with Dr. {appt.staff.user.l_name}")
            
            # From doctor, get appointments
            doctor_appointments = doctor_staff.appointments
            print(f"   Doctor's appointments: {len(doctor_appointments)}")
            for appt in doctor_appointments:
                print(f"     - Appointment {appt.appointment_id} with {appt.patient.user.f_name}")
            
            # 5. Test user relationships
            print("\n5. Testing user relationships...")
            print(f"   Patient user -> Patient record: {patient_user.patient.patient_id}")
            print(f"   Doctor user -> Staff record: {doctor_user.staff.staff_id}")
            print(f"   Patient record -> User: {patient.user.username}")
            print(f"   Staff record -> User: {doctor_staff.user.username}")
            
            print("\n" + "="*50)
            print("✅ Complete model workflow successful!")
            print(f"   Total Users: {User.query.count()}")
            print(f"   Total Patients: {Patient.query.count()}")
            print(f"   Total Staff: {Staff.query.count()}")
            print(f"   Total Appointments: {Appointment.query.count()}")
            
            return True
            
        except Exception as e:
            print(f"\n❌ Error: {e}")
            import traceback
            traceback.print_exc()
            db.session.rollback()
            return False

if __name__ == "__main__":
    success = test_complete_workflow()
    if success:
        print("\n🎉 All models are working correctly together!")
    else:
        print("\n❌ There were issues with the models.")