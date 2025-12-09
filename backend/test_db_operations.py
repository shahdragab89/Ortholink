# backend/test_db_operations.py
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.extensions import db
from app.models.user import User, Gender, Role
from werkzeug.security import generate_password_hash
from datetime import datetime

app = create_app()

def test_database_operations():
    with app.app_context():
        try:
            print("Testing basic database operations...\n")
            
            # Test 1: Create a User (without relationships)
            print("1. Creating a user...")
            test_user = User(
                username='testuser1',
                email='test1@ortholink.com',
                password_hash=generate_password_hash('test123'),
                role=Role.PATIENT,
                gender=Gender.MALE,
                f_name='Test',
                l_name='User1',
                birth_date=datetime(1990, 1, 1).date(),
                phone='1234567890',
                address='Test Address 1',
                is_active=True
            )
            
            db.session.add(test_user)
            db.session.commit()
            
            print(f"   ✅ User created: {test_user.username} (ID: {test_user.user_id})")
            
            # Test 2: Query the user
            print("\n2. Querying user...")
            fetched_user = User.query.filter_by(username='testuser1').first()
            if fetched_user:
                print(f"   ✅ User found: {fetched_user.username}")
                print(f"   Role: {fetched_user.role.value}")
                print(f"   Gender: {fetched_user.gender.value}")
            else:
                print("   ❌ User not found")
                return False
            
            # Test 3: Create another user with different role
            print("\n3. Creating a doctor user...")
            doctor_user = User(
                username='doctor1',
                email='doctor1@ortholink.com',
                password_hash=generate_password_hash('doctor123'),
                role=Role.DOCTOR,
                gender=Gender.FEMALE,
                f_name='Jane',
                l_name='Doe',
                birth_date=datetime(1985, 5, 15).date(),
                phone='0987654321',
                address='Hospital Address',
                is_active=True
            )
            
            db.session.add(doctor_user)
            db.session.commit()
            
            print(f"   ✅ Doctor created: {doctor_user.username}")
            
            # Test 4: List all users
            print("\n4. Listing all users...")
            users = User.query.all()
            print(f"   Total users: {len(users)}")
            for user in users:
                print(f"   - {user.username} ({user.role.value}) - {user.email}")
            
            # Test 5: Count by role
            print("\n5. Counting by role...")
            patients = User.query.filter_by(role=Role.PATIENT).count()
            doctors = User.query.filter_by(role=Role.DOCTOR).count()
            print(f"   Patients: {patients}")
            print(f"   Doctors: {doctors}")
            
            print("\n" + "="*50)
            print("✅ All database operations successful!")
            return True
            
        except Exception as e:
            print(f"\n❌ Error: {e}")
            import traceback
            traceback.print_exc()
            db.session.rollback()
            return False

if __name__ == "__main__":
    success = test_database_operations()
    if success:
        print("\n🎉 Database is working correctly!")
    else:
        print("\n❌ There were issues with the database.")