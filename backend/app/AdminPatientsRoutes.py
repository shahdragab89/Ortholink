# backend/app/AdminPatientsRoutes.py
from flask import Blueprint, jsonify
from .extensions import db
from .models.user import User, Role, Gender
from .models.patient import Patient
from .models.appointment import Appointment
from .models.dicom_scan import DicomScan
from .models.bill import Bill
from datetime import datetime, timedelta
from sqlalchemy import func
from flask import request
import os

admin_patients_bp = Blueprint("admin_patients_bp", __name__, url_prefix="/api/admin")
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "..", "uploads")
# ======================================================
# GET — All Patients
# ======================================================
@admin_patients_bp.route("/patients", methods=["GET"])
def get_all_patients():
    now = datetime.utcnow().date()
    past_30d = now - timedelta(days=30)

    patients = (
        db.session.query(User, Patient)
        .join(Patient, Patient.user_id == User.user_id)
        .filter(User.role == Role.PATIENT)
        .all()
    )

    result = []
    for user, patient in patients:
        # 1️⃣ Last visit
        last_visit = (
            db.session.query(func.max(Appointment.appointment_date))
            .filter(Appointment.patient_id == patient.patient_id)
            .scalar()
        )

        # 2️⃣ Last scan
        last_scan = (
            db.session.query(func.max(DicomScan.scan_date))
            .filter(DicomScan.patient_id == patient.patient_id)
            .scalar()
        )

        # 3️⃣ Last diagnosis (from recent appointment)
        last_diag = (
            db.session.query(Appointment.diagnosis)
            .filter(Appointment.patient_id == patient.patient_id)
            .order_by(Appointment.appointment_date.desc())
            .first()
        )
        last_diag = last_diag[0] if last_diag else "N/A"

        photo_url = None
        if patient.photo_path:
            photo_url = f"http://127.0.0.1:5000/uploads/{patient.photo_path}"


        result.append({
            "photo": photo_url or None,
            "patient_id": patient.patient_id,
            "name": f"{user.f_name or ''} {user.l_name or ''}".strip(),
            "age": (now.year - user.birth_date.year) if user.birth_date else "N/A",
            "gender": user.gender.value if user.gender else "N/A",
            "last_diagnosis": last_diag,
            "last_visit": last_visit.strftime("%Y-%m-%d") if last_visit else "N/A",
            "last_scan": last_scan.strftime("%Y-%m-%d") if last_scan else "N/A",
            "email": user.email,
            "phone": user.phone or "N/A",
            "address": user.address or "N/A",
            "blood_type": patient.blood_type or "N/A",
            "allergies": patient.allergies or "N/A",
            "insurance_provider": patient.insurance_provider or "N/A",
            "insurance_number": patient.insurance_number or "N/A",
            "emergency_name": patient.emergency_contact_name or "N/A",
            "emergency_phone": patient.emergency_contact_phone or "N/A",
            "registered_at": patient.registration_date.strftime("%Y-%m-%d") if patient.registration_date else "N/A",
        })

    return jsonify(result), 200

# ======================================================
# GET — Patient Statistics (for right-side boxes)
# ======================================================
@admin_patients_bp.route("/patients/stats", methods=["GET"])
def patients_stats():
    now = datetime.utcnow().date()
    past_30d = now - timedelta(days=30)

    total_patients = db.session.query(Patient).count()

    # Patients with visits in last 30 days
    active_patients = (
        db.session.query(Appointment.patient_id)
        .filter(Appointment.appointment_date >= past_30d)
        .distinct()
        .count()
    )

    # Pending bills
    pending_bills = (
        db.session.query(Bill)
        .filter(Bill.payment_status == "pending")
        .count()
    )

    # Follow-ups scheduled (future appointments)
    followups = (
        db.session.query(Appointment)
        .filter(Appointment.appointment_date > now)
        .count()
    )

    return jsonify({
        "total": total_patients,
        "active30d": active_patients,
        "pendingBills": pending_bills,
        "followups": followups
    }), 200

# ======================================================
# GET — Patient Appointments
# ======================================================
@admin_patients_bp.route("/patients/<int:patient_id>/appointments", methods=["GET"])
def get_patient_appointments(patient_id):
    appointments = (
        db.session.query(Appointment)
        .filter(Appointment.patient_id == patient_id)
        .order_by(Appointment.appointment_date.desc())
        .all()
    )

    result = []
    for a in appointments:
        result.append({
            "date": a.appointment_date.strftime("%Y-%m-%d") if a.appointment_date else "N/A",
            "doctor": a.doctor_name if hasattr(a, "doctor_name") else "N/A",
            "reason": a.reason or "N/A",
            "diagnosis": a.diagnosis or "N/A",
            "medication": a.medication or "N/A",
            "scan": a.scan_type or "N/A"
        })

    return jsonify(result), 200


# ======================================================
# GET — Patient Scans
# ======================================================
@admin_patients_bp.route("/patients/<int:patient_id>/scans", methods=["GET"])
def get_patient_scans(patient_id):
    scans = (
        db.session.query(DicomScan)
        .filter(DicomScan.patient_id == patient_id)
        .order_by(DicomScan.scan_date.desc())
        .all()
    )

    result = []
    for s in scans:
        result.append({
            "scan_name": s.scan_name or "N/A",
            "date": s.scan_date.strftime("%Y-%m-%d") if s.scan_date else "N/A",
            "radiologist": s.radiologist_name if hasattr(s, "radiologist_name") else "N/A",
            "report": s.report_text or "No report available"
        })

    return jsonify(result), 200
@admin_patients_bp.route("/patients/<int:patient_id>/photo", methods=["POST"])
def upload_patient_photo(patient_id):
    file = request.files.get("photo")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    filename = f"patient_{patient_id}_{file.filename}"
    save_path = os.path.join(UPLOAD_FOLDER, filename)
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    file.save(save_path)

    patient = Patient.query.get(patient_id)
    if patient:
        patient.photo_path = filename
        db.session.commit()
        return jsonify({"photo": f"http://127.0.0.1:5000/uploads/{filename}"}), 200
    else:
        return jsonify({"error": "Patient not found"}), 404