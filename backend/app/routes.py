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
from .models.appointment import Appointment
from .models.visit_record import VisitRecord
from .models.medication import Medication
from .extensions import db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint('api/auth', __name__)
doctor_bp = Blueprint('doctor', __name__)


@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    # Hash the password
    hashed_password = generate_password_hash(data['password'])

 
    gender_value = Gender(data.get('gender').upper())  

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



def get_current_doctor():
    user_id = get_jwt_identity()
    doctor = User.query.filter_by(user_id=user_id, role=Role.DOCTOR).first()
    return doctor



@doctor_bp.route('/appointments', methods=['GET'])
@jwt_required()
def upcoming_appointments():
    doctor = get_current_doctor()
    if not doctor:
        return jsonify({"message": "Unauthorized"}), 403
    
    appointments = Appointment.query.filter(
        Appointment.staff_id == doctor.user_id,
        Appointment.appointment_date >= datetime.utcnow()
    ).all()

    result = []
    for appt in appointments:
        result.append({
            "appointment_id": appt.appointment_id,
            "patient_id": appt.patient_id,
            "date": appt.appointment_date.isoformat(),
            "time": appt.appointment_time.isoformat(),
           "reason": appt.reason,
           "notes": appt.notes,
           "status": appt.status

            #time,#oatient_name,#reason,#notes,#status
        })
    return jsonify(result), 200


@doctor_bp.route('/patient/<int:patient_id>', methods=['GET'])
@jwt_required()
def patient_info(patient_id):
    doctor = get_current_doctor()
    if not doctor:
        return jsonify({"message": "Unauthorized"}), 403

    patient = Patient.query.get(patient_id)
    if not patient:
        return jsonify({"message": "Patient not found"}), 404

    visit_history = VisitRecord.query.filter_by(patient_id=patient_id).all()
    visits = []
    for visit in visit_history:
        visits.append({
            "visit_id": visit.visit_id,
            "notes": visit.notes,
            "diagnosis": visit.diagnosis,
            "treatment_plan": visit.treatment_plan,
            "date": visit.date.isoformat()
        })

    return jsonify({
        "patient_id": patient.patient_id,
        "name": f"{patient.user.f_name} {patient.user.l_name}",
        "blood_type": patient.blood_type,
        "allergies": patient.allergies,
        "chronic_conditions": patient.chronic_conditions,
        "insurance_provider": patient.insurance_provider,
        "visit_history": visits
    }), 200


@doctor_bp.route('/visit/<int:visit_id>', methods=['PUT'])
@jwt_required()
def update_visit(visit_id):
    doctor = get_current_doctor()
    if not doctor:
        return jsonify({"message": "Unauthorized"}), 403

    visit = VisitRecord.query.get(visit_id)
    if not visit:
        return jsonify({"message": "Visit not found"}), 404

    data = request.get_json()
    visit.notes = data.get('notes', visit.notes)
    visit.diagnosis = data.get('diagnosis', visit.diagnosis)
    visit.treatment_plan = data.get('treatment_plan', visit.treatment_plan)
    visit.updated_at = datetime.utcnow()

    db.session.commit()
    return jsonify({"message": "Visit updated successfully"}), 200
    

@doctor_bp.route('/order_scan', methods=['POST'])
@jwt_required()
def order_scan():
    doctor = get_current_doctor()
    if not doctor:
        return jsonify({"message": "Unauthorized"}), 403

    data = request.get_json()
    # For simplicity, we just create a VisitRecord with a "scan" note
    visit = VisitRecord(
        patient_id=data['patient_id'],
        doctor_id=doctor.user_id,
        notes=f"Scan ordered: {data.get('scan_type', 'General')}",
        diagnosis=None,
        treatment_plan=None,
        date=datetime.utcnow()
    )
    db.session.add(visit)
    db.session.commit()

    return jsonify({"message": "Scan ordered successfully", "visit_id": visit.visit_id}), 201



@doctor_bp.route('/order_medication', methods=['POST'])
@jwt_required()
def order_medication():
    doctor = get_current_doctor()
    if not doctor:
        return jsonify({"message": "Unauthorized"}), 403

    data = request.get_json()
    med = Medication(
        patient_id=data['patient_id'],
        doctor_id=doctor.user_id,
        name=data['name'],
        dosage=data['dosage'],
        instructions=data.get('instructions')
    )
    db.session.add(med)
    db.session.commit()

    return jsonify({"message": "Medication ordered", "medication_id": med.medication_id}), 201



@doctor_bp.route('/write_report/<int:visit_id>', methods=['PUT'])
@jwt_required()
def write_report(visit_id):
    doctor = get_current_doctor()
    if not doctor:
        return jsonify({"message": "Unauthorized"}), 403

    visit = VisitRecord.query.get(visit_id)
    if not visit:
        return jsonify({"message": "Visit not found"}), 404

    data = request.get_json()
    visit.report = data.get('report', '')
    visit.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({"message": "Report saved"}), 200



@doctor_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    doctor = get_current_doctor()
    if not doctor:
        return jsonify({"message": "Unauthorized"}), 403

    data = request.get_json()
    doctor.f_name = data.get('first_name', doctor.f_name)
    doctor.l_name = data.get('last_name', doctor.l_name)
    doctor.phone = data.get('phone', doctor.phone)
    doctor.address = data.get('address', doctor.address)
    db.session.commit()

    return jsonify({"message": "Profile updated successfully"}), 200