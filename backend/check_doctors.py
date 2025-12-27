# backend/check_doctors.py
from app import create_app
from app.models.user import User, Role
from app.models.staff import Staff

app = create_app()

with app.app_context():
    # Check doctors
    doctors = User.query.filter_by(role=Role.DOCTOR).all()
    print(f"Total doctors in database: {len(doctors)}")
    
    for doctor in doctors:
        staff = Staff.query.filter_by(user_id=doctor.user_id).first()
        print(f"Doctor: {doctor.f_name} {doctor.l_name} | Username: {doctor.username}")
        print(f"  - User ID: {doctor.user_id}")
        print(f"  - Staff ID: {staff.staff_id if staff else 'No staff record'}")
        print(f"  - Email: {doctor.email}")
        print()