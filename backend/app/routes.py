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
from .models.dicom_scan import DicomScan
from .models.scans_results import ScanResult
from .models.bill import Bill
from .models.bill_item import BillItem
from .models.payment import Payment
from datetime import datetime
from flask_cors import CORS, cross_origin
from sqlalchemy import desc, asc
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
auth_bp = Blueprint('api/auth', __name__)


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


@auth_bp.route('/patient_data/<int:user_id>', methods=['GET'])
@jwt_required()
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
@jwt_required()
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
@auth_bp.route('/all_doctors', methods=["GET"])
@jwt_required()
def all_doctors():

    doctors = Staff.query.join(User).filter(User.role=="DOCTOR").all()
    doctor_list = []
    for doc in doctors:
        doctor_list.append({
            "staff_id": doc.staff_id,
            "user_id": doc.user_id,
            "f_name": doc.f_name,
            "l_name": doc.l_name,
            "department": doc.department,
            "phone": doc.phone
        })

    return jsonify(doctor_list), 200


@auth_bp.route('/patient_Create_appointments', methods=['POST'])
@jwt_required()
def create_appointment():
    try:
        user_id = get_jwt_identity()  

    
        patient = Patient.query.filter_by(user_id=user_id).first()
        if not patient:
            return jsonify({"message": "Patient not found"}), 404

        

      
        data = request.get_json()

        new_appointment = Appointment(
            patient_id=patient.patient_id,
            staff_id=data['staff_id'],
            appointment_date=data['appointment_date'],
            appointment_time=data['appointment_time'],
            duration_minutes=data.get('duration_minutes', 30),
            appointment_type=data.get('appointment_type', 'General'),
            status='scheduled',
            reason=data.get('reason', ''),
            notes=data.get('notes', '')
        )

        db.session.add(new_appointment)
        db.session.commit()

        return jsonify({"message": "Appointment created successfully"}), 201
    except Exception as e:

        return jsonify({"message": str(e)}), 400
@auth_bp.route('/show_patient_appointments', methods=['GET', 'OPTIONS'])
@cross_origin(origin="http://localhost:5173", headers=["Content-Type", "Authorization"])
@jwt_required()
def show_patient_appointments():
    if request.method == "OPTIONS":
        return '', 200

    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({"msg": "Missing Authorization Header"}), 401

    patient = Patient.query.filter_by(user_id=user_id).first()
    if not patient:
        return jsonify({"message": "Patient not found"}), 404

    appointments = (
        db.session.query(
            Appointment.appointment_id,
            Appointment.appointment_date,
            Appointment.appointment_time,
            Staff.f_name,
            Staff.l_name
        )
        .join(Staff, Appointment.staff_id == Staff.staff_id)
        .filter(Appointment.patient_id == patient.patient_id)
        .all()
    )

    result = [
        {
            "id": a.appointment_id,
            "appointment_date": a.appointment_date.strftime("%Y-%m-%d"),
            "appointment_time": a.appointment_time.strftime("%H:%M"),
            "doctor_name": f"Dr. {a.f_name} {a.l_name}"
        } for a in appointments
    ]

    return jsonify(result), 200
@auth_bp.route('/all_medications', methods=['GET'])

@jwt_required()
def get_all_medications():
    user_id = get_jwt_identity()  # this is the logged-in user's id

    medications = (
        db.session.query(
            Medication.medication_id,
            Medication.medication_name,
            Medication.dosage,
            Medication.frequency,
            Medication.duration,
            Medication.instructions,
            Medication.start_date,
            Medication.end_date,
            Medication.is_active,
            Patient.patient_id,
            User.f_name.label("patient_first_name"),
            User.l_name.label("patient_last_name")
        )
        .join(Patient, Medication.patient_id == Patient.patient_id)
        .join(User, Patient.user_id == User.user_id)
        .filter(User.user_id == user_id)  # <-- only this patient's medications
        .all()
    )


    result = []
    for m in medications:
        result.append({
            "medication_id": m.medication_id,
            "medication_name": m.medication_name,
            "dosage": m.dosage,
            "frequency": m.frequency,
            "duration": m.duration,
            "instructions": m.instructions,
            "start_date": m.start_date.isoformat() if m.start_date else None,
            "end_date": m.end_date.isoformat() if m.end_date else None,
            "is_active": m.is_active,
            "patient_id": m.patient_id,
            "patient_name": f"{m.patient_first_name} {m.patient_last_name}"
        })

    return jsonify(result), 200



@auth_bp.route('/upcoming_scans', methods=['GET'])
@jwt_required()
def get_upcoming_scans():
    user_id = get_jwt_identity()
    now = datetime.utcnow()   

    scans = (
        db.session.query(DicomScan)
        .join(Patient, DicomScan.patient_id == Patient.patient_id)
        .join(User, Patient.user_id == User.user_id)
        .filter(
            User.user_id == user_id,
            DicomScan.scan_date > now   
        )
        .order_by(DicomScan.scan_date.asc())
        .all()
    )

    result = []
    for scan in scans:
        result.append({
            "scan_id": scan.scan_id,
            "date": scan.scan_date.strftime("%Y-%m-%d") if scan.scan_date else None,
            "time": scan.scan_date.strftime("%H:%M:%S") if scan.scan_date else None,
            "modality": scan.modality
        })

    return jsonify(result), 200

@auth_bp.route('/scan_results', methods=['GET'])
@jwt_required()
def get_scan_results():
    user_id = get_jwt_identity()

    results = (
        db.session.query(DicomScan, ScanResult)
        .join(Patient, DicomScan.patient_id == Patient.patient_id)
        .join(User, Patient.user_id == User.user_id)
        .join(ScanResult, ScanResult.scan_id == DicomScan.scan_id)
        .filter(User.user_id == user_id)
        .all()
    )

    response = []

    for scan, result in results:
        response.append({
            "id": scan.scan_id,
            "title": f"{scan.modality} Scan - {scan.body_part}",
            "date": scan.scan_date.strftime("%Y-%m-%d") if scan.scan_date else None,
            "modality": scan.modality,

            "report": result.final_diagnosis if result else None,
            "confidence_score": result.confidence_score if result else None,
            "doctor_notes": result.doctor_notes if result else None,

            "images": [scan.folder_path] if scan.folder_path else []
        })

    return jsonify(response), 200




# @auth_bp.route("/patient/visits", methods=["GET"])
# @jwt_required()
# def get_patient_visits():
#     user_id = get_jwt_identity()

#     query = text("""
#         SELECT
#             a.appointment_id,

#             -- Appointment
#             a.appointment_date,
#             a.appointment_time,
#             a.reason AS complaint,

#             -- Doctor
#             s.full_name AS doctor_name,

#             -- Scan result
#             sr.final_diagnosis,
#             sr.doctor_notes AS physical_exam,
#             sr.cdss_result AS treatment_plan,

#             -- Scan ordered
#             ds.scan_type,
#             ds.body_part,

#             -- Medication
#             m.medication_name,
#             m.dosage,
#             m.frequency,
#             m.duration,
#             m.instructions,

#             -- Billing
#             b.total_amount,
#             p.payment_method

#         FROM appointment a

#         JOIN patient pt
#             ON a.patient_id = pt.patient_id

#         JOIN "user" u
#             ON pt.user_id = u.user_id

#         LEFT JOIN staff s
#             ON a.staff_id = s.staff_id

#         LEFT JOIN dicom_scan ds
#             ON ds.record_id = a.appointment_id

#         LEFT JOIN scan_result sr
#             ON sr.scan_id = ds.scan_id

#         LEFT JOIN medication m
#             ON m.record_id = a.appointment_id

#         LEFT JOIN bill b
#             ON b.appointment_id = a.appointment_id

#         LEFT JOIN payment p
#             ON p.bill_id = b.bill_id

#         WHERE u.user_id = :user_id
#         ORDER BY a.appointment_date DESC;
#     """)

#     rows = db.session.execute(query, {"user_id": user_id}).fetchall()

#     visits = {}

#     for r in rows:
#         visit_id = r.appointment_id

#         if visit_id not in visits:
#             visits[visit_id] = {
#                 "date": r.appointment_date.strftime("%d %b %Y"),
#                 "time": r.appointment_time.strftime("%I:%M %p") if r.appointment_time else None,
#                 "doctor": r.doctor_name,
#                 "diagnosis": r.final_diagnosis,
#                 "summary": "View",
#                 "billing": "Paid" if r.payment_method else "Unpaid",

#                 "visitDetails": {
#                     "complaint": r.complaint,
#                     "physicalExam": r.physical_exam,
#                     "treatmentPlan": r.treatment_plan,
#                     "scansOrdered": (
#                         f"{r.scan_type} {r.body_part}"
#                         if r.scan_type else None
#                     )
#                 },

#                 "medications": [],

#                 "billingDetails": {
#                     "amount": float(r.total_amount) if r.total_amount else None,
#                     "method": r.payment_method
#                 }
#             }

#         # Add medication (can be multiple per visit)
#         if r.medication_name:
#             visits[visit_id]["medications"].append({
#                 "name": r.medication_name,
#                 "dosage": r.dosage,
#                 "frequency": r.frequency,
#                 "duration": r.duration,
#                 "instructions": r.instructions
#             })

#     return jsonify(list(visits.values())), 200
@auth_bp.route("/patient/visits", methods=["GET"])
@jwt_required()
def get_patient_visits():
    user_id = get_jwt_identity()

    # Get the patient's record
    patient = db.session.query(Patient).filter_by(user_id=user_id).first()
    if not patient:
        return jsonify([]), 200

    visits = []

    for visit in patient.visit_records:
        # Insert new visit record if you want (example)
        # Uncomment if you need to insert
        """
        if visit.record_id == 1:
            new_visit = VisitRecord(
                patient_id=patient.patient_id,
                staff_id=visit.staff_id,
                appointment_id=visit.appointment_id,
                chief_complaint="New complaint",
                diagnosis=None,
                treatment_plan=None
            )
            db.session.add(new_visit)
            db.session.commit()
        """

        appointment = visit.appointment
        doctor_name = f"{visit.staff.f_name} {visit.staff.l_name}" if visit.staff else None

        # Scans for this visit record
        scans = db.session.query(DicomScan).filter_by(record_id=visit.record_id).all()
        scan_results = []
        for scan in scans:
            sr = db.session.query(ScanResult).filter_by(scan_id=scan.scan_id).first()
            scan_results.append({
                "scan_type": scan.scan_type,
                "body_part": scan.body_part,
                "final_diagnosis": sr.final_diagnosis if sr else None,
                "doctor_notes": sr.doctor_notes if sr else None,
                "treatment_plan": sr.cdss_result if sr else None,
                "medication": sr.ai_recommendations if sr else None,
                "scan_date": scan.scan_date.isoformat() if scan.scan_date else None,
            })

        # Medications for this visit record
        meds = db.session.query(Medication).filter_by(record_id=visit.record_id).all()
        medications = [{
            "medication_name": m.medication_name,
            "dosage": m.dosage,
            "frequency": m.frequency,
            "duration": m.duration,
            "instructions": m.instructions,
            "start_date": m.start_date.isoformat() if m.start_date else None,
            "end_date": m.end_date.isoformat() if m.end_date else None,
            "is_active": m.is_active
        } for m in meds]

        # Billing
        bill = db.session.query(Bill).filter_by(appointment_id=appointment.appointment_id).first() if appointment else None
        payment = db.session.query(Payment).filter_by(bill_id=bill.bill_id).first() if bill else None

        # Split payment datetime into date and time
        payment_date = payment.payment_date.date().isoformat() if payment and payment.payment_date else None
        payment_time = payment.payment_date.time().strftime("%H:%M") if payment and payment.payment_date else None

        visits.append({
            "date": appointment.appointment_date.isoformat() if appointment and appointment.appointment_date else None,
            "time": appointment.appointment_time.isoformat() if appointment and appointment.appointment_time else None,
            "doctor": doctor_name,
            "diagnosis": visit.diagnosis,
            "summary": "View",
            "billing": "Paid" if payment else "Unpaid",
            "visitDetails": {
                "complaint": visit.chief_complaint,
                "physicalExam": visit.physical_examination,
                "treatmentPlan": visit.treatment_plan,
                "scansOrdered": [f"{s['scan_type']} {s['body_part']}" for s in scan_results]
            },
            "medications": medications,
            "billingDetails": {
                "amount": float(bill.total_amount) if bill else None,
                "method": payment.payment_method if payment else None,
                "date": payment_date,
                "time": payment_time
            }
        })

    return jsonify(visits), 200
import re
@auth_bp.route("/patien_previous_scans", methods=["GET"])
@jwt_required()
def get_patient_scans():
    user_id = get_jwt_identity()

    # Get patient
    patient = db.session.query(Patient).filter_by(user_id=user_id).first()
    if not patient:
        return jsonify([]), 200

    scans_list = []
    today = datetime.today().date()

    scans = db.session.query(DicomScan).filter_by(patient_id=patient.patient_id).all()

    for scan in scans:

        # only previous scans
        if not scan.scan_date or scan.scan_date.date() > today:
            continue

        # -------- Radiologist --------
        radiologist = None
        if scan.radiologist_id:
            staff = db.session.query(Staff).filter_by(staff_id=scan.radiologist_id).first()
            if staff:
                radiologist = f"{staff.f_name} {staff.l_name}"

        # -------- Scan Report --------
        sr = db.session.query(ScanResult).filter_by(scan_id=scan.scan_id).first()
        report = sr.final_diagnosis if sr else None

        # -------- Billing item (contains "scan") --------
        bill_item = (
                db.session.query(BillItem)
                .join(Bill, Bill.bill_id == BillItem.bill_id)
                .filter(Bill.patient_id == patient.patient_id)  # instead of appointment_id
                .filter(BillItem.service_name.ilike("%scan%"))
                .first()
            )

        # -------- Payment --------
        payment = None
        if bill_item:
            payment = db.session.query(Payment).filter_by(bill_id=bill_item.bill_id).first()

        # -------- Scan type from service_name --------
        scan_type = None
        if bill_item and bill_item.service_name:
            # Extract the word(s) before "scan", case-insensitive
            match = re.search(r"(.*?)\bscan\b", bill_item.service_name, re.IGNORECASE)
            if match:
                scan_type = match.group(1).strip().upper()  # e.g., "MRI", "CT"

        scans_list.append({
            "scan_date": scan.scan_date.date().isoformat(),
            "scan_time": scan.scan_date.time().strftime("%H:%M"),

            "radiologist": radiologist,
            "scan_type": scan_type,   
            "body_part": scan.body_part,
            "report": report,
            "item_id":bill_item.item_id,

            "billing_amount": bill_item.total_price if bill_item else None,
            "billing_status": "Paid" if payment else "Unpaid",

            "payment_date": payment.payment_date.date().isoformat() if payment and payment.payment_date else None,
            "payment_time": payment.payment_date.time().strftime("%H:%M") if payment and payment.payment_date else None,
            "payment_method": payment.payment_method if payment else None
        })

    return jsonify(scans_list), 200
