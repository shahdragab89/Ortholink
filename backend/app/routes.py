from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from .extensions import db
from .models.user import User, Gender, Role
from .models.patient import Patient
from datetime import datetime
from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from .models.user import User
from flask_jwt_extended import create_access_token

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



@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password required"}), 400

    user = User.query.filter_by(email=email).first()
    
    if user and check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=user.user_id)
        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "role": user.role.value,
            "user_id":user.user_id
        }), 200
    else:
        return jsonify({"message": "Invalid email or password"}), 401
    

@auth_bp.route('/patient/<int:user_id>', methods=['GET'])
def get_patient_profile(user_id):
    user = User.query.get(user_id)
    patient = Patient.query.filter_by(user_id=user_id).first()

    return jsonify({
        "name": f"{user.f_name} {user.l_name}",
        
        "email": user.email,
        "phone": user.phone,
        "address": user.address,
        "birth_date": user.birth_date.strftime("%Y-%m-%d"),
        "gender": user.gender.value,
        "blood_type": patient.blood_type,
        "allergies": patient.allergies,
        "chronic_conditions": patient.chronic_conditions,
        "insurance_provider": patient.insurance_provider,
        "insurance_number": patient.insurance_number,
        "emergency_contact_name": patient.emergency_contact_name,
        "emergency_contact_phone": patient.emergency_contact_phone
    })
@auth_bp.route('/edit_patient/<int:user_id>',methods=["PUT"])
def edit_patient_profile(user_id):
    data = request.get_json()
    
    user = User.query.get(user_id)
    patient = Patient.query.filter_by(user_id=user_id).first()
    
    if not user or not patient:
        return jsonify({"message": "Patient not found"}), 404
    
    # Update User fields
    user.f_name = data.get("first_name", user.f_name)
    user.l_name = data.get("last_name", user.l_name)
    user.phone = data.get("phone", user.phone)
    user.address = data.get("address", user.address)
    
    # Update Patient fields
    patient.blood_type = data.get("blood_type", patient.blood_type)
    patient.allergies = data.get("allergies", patient.allergies)
    patient.chronic_conditions = data.get("chronic_conditions", patient.chronic_conditions)
    patient.insurance_provider = data.get("insurance_provider", patient.insurance_provider)
    patient.insurance_number = data.get("insurance_number", patient.insurance_number)
    patient.emergency_contact_name = data.get("emergency_contact_name", patient.emergency_contact_name)
    patient.emergency_contact_phone = data.get("emergency_contact_phone", patient.emergency_contact_phone)
    
    db.session.commit()
    
    return jsonify({"message": "Patient profile updated successfully"})
