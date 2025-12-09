from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from .extensions import db
from .models.user import User, Gender, Role
from .models.patient import Patient
from datetime import datetime
from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from .models.user import User
from .models.staff import Staff
from .extensions import db
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    # Hash the password
    hashed_password = generate_password_hash(data['password'])

 
    gender_value = Gender(data.get('gender').lower())  

    if not gender_value:
        return jsonify({"message": "Invalid gender value"}), 400

    new_user = User(
        username=data['username'],
        email=data['email'],
        password_hash=hashed_password,
        role=Role.PATIENT,  
        f_name=data.get('first_name'),
        l_name=data.get('last_name'),
        birth_date=datetime.strptime(data.get('birth_date'), "%Y-%m-%d"),  
        gender=gender_value,
        phone=data.get('phone'),
        address=data.get('address'),
        created_at=datetime.utcnow(),
        is_active=True
    )

    db.session.add(new_user)
    db.session.commit()  
    new_patient = Patient(
        user_id=new_user.user_id,
        blood_type=data.get('blood_type'),
        allergies=data.get('allergies'),
        chronic_conditions=data.get('chronic_conditions'),
        insurance_provider=data.get('insurance_provider'),
        insurance_number=data.get('insurance_number'),
        emergency_contact_name=data.get('emergency_contact_name'),
        emergency_contact_phone=data.get('emergency_contact_phone')
    )

    db.session.add(new_patient)
    db.session.commit()

    return jsonify({
        "message": "Signup successful",
        "patient_id": new_patient.patient_id
    }), 201

@auth_bp.route('/test', methods=['GET'])
def test():
    return {"message": "Auth blueprint is working!"}



@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password required"}), 400

    user = User.query.filter_by(email=email).first()
    
    if user and check_password_hash(user.password_hash, password):
        # Convert user_id to string for JWT compatibility
        access_token = create_access_token(identity=str(user.user_id))
        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "user_id": user.user_id,  # Still return as integer for frontend
            "role": user.role.value
        }), 200
    else:
        return jsonify({"message": "Invalid email or password"}), 401
    

@auth_bp.route('/radiologist/<int:user_id>', methods=['GET'])
@jwt_required()
def get_radiologist_profile(user_id):
    # Get the current user from JWT token
    current_user_id = get_jwt_identity()
    
    # Debug print to see what's being compared
    print(f"Debug: current_user_id (JWT) = '{current_user_id}' (type: {type(current_user_id)})")
    print(f"Debug: user_id (URL) = {user_id} (type: {type(user_id)})")
    
    # Convert current_user_id to int for comparison since URL param is int
    try:
        current_user_id_int = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity in token"}), 400
    
    # Check if the requested user_id matches the current user
    if current_user_id_int != user_id:
        return jsonify({"error": f"Unauthorized access. Token user: {current_user_id_int}, Requested user: {user_id}"}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    if user.role != Role.RADIOLOGIST:
        return jsonify({"error": "User is not a radiologist"}), 400
    
    staff = Staff.query.filter_by(user_id=user_id).first()
    
    if not staff:
        return jsonify({"error": "Staff record not found"}), 404
    
    return jsonify({
        "user_id": user.user_id,
        "username": user.username,
        "email": user.email,
        "f_name": user.f_name,
        "l_name": user.l_name,
        "phone": user.phone,
        "address": user.address,
        "birth_date": user.birth_date.strftime("%Y-%m-%d") if user.birth_date else None,
        "gender": user.gender.value if user.gender else None,
        "staff_id": staff.staff_id,
        "license_number": staff.license_number,
        "staff_phone": staff.phone,
        "department": staff.department,
        "hire_date": staff.hire_date.strftime("%Y-%m-%d") if staff.hire_date else None,
        "salary": float(staff.salary) if staff.salary else None,
        "role": user.role.value
    })

@auth_bp.route('/radiologist/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_radiologist_profile(user_id):
    current_user_id = get_jwt_identity()
    
    # Convert current_user_id to int for comparison
    try:
        current_user_id_int = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity in token"}), 400
    
    if current_user_id_int != user_id:
        return jsonify({"error": "Unauthorized access"}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    if user.role != Role.RADIOLOGIST:
        return jsonify({"error": "User is not a radiologist"}), 400
    
    data = request.json
    phone = data.get('phone')
    address = data.get('address')
    
    # Update user fields
    if phone:
        user.phone = phone
    if address:
        user.address = address
    
    # Also update staff phone if different
    staff = Staff.query.filter_by(user_id=user_id).first()
    if staff and phone:
        staff.phone = phone
    
    db.session.commit()
    
    return jsonify({
        "message": "Profile updated successfully",
        "user_id": user.user_id,
        "phone": user.phone,
        "address": user.address
    })