# backend/app/AdminPatientsRoutes.py
from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
from sqlalchemy import func
import os

from .extensions import db
from .models.user import User, Role
from .models.patient import Patient
from .models.appointment import Appointment
from .models.visit_record import VisitRecord
from .models.dicom_scan import DicomScan
from .models.scans_results import ScanResult
from .models.bill import Bill
from .models.staff import Staff

admin_patients_bp = Blueprint("admin_patients_bp", __name__, url_prefix="/api/admin")

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "..", "uploads")


# ======================================================
# GET — All Patients (User + Patient merged)
# ======================================================
@admin_patients_bp.route("/patients", methods=["GET"])
def get_all_patients():
    now = datetime.utcnow().date()
    patients = (
        db.session.query(User, Patient)
        .join(Patient, Patient.user_id == User.user_id)
        .filter(User.role == Role.PATIENT)
        .all()
    )

    result = []
    for user, patient in patients:
        # Last visit (from Appointment)
        last_visit = (
            db.session.query(func.max(Appointment.appointment_date))
            .filter(Appointment.patient_id == patient.patient_id)
            .scalar()
        )

        # Last scan (from DicomScan)
        last_scan = (
            db.session.query(func.max(DicomScan.scan_date))
            .filter(DicomScan.patient_id == patient.patient_id)
            .scalar()
        )

        # Last diagnosis (from VisitRecord)
        last_diag = (
            db.session.query(VisitRecord.diagnosis)
            .filter(VisitRecord.patient_id == patient.patient_id)
            .order_by(VisitRecord.created_at.desc())
            .first()
        )
        last_diag = last_diag[0] if last_diag else "N/A"

        # Profile photo from User
        photo_url = (
            f"http://127.0.0.1:5000/{user.profile_image}"
            if user.profile_image
            else "/placeholder-patient.png"
        )

        result.append({
            "patient_id": patient.patient_id,
            "name": f"{user.f_name or ''} {user.l_name or ''}".strip(),
            "age": (now.year - user.birth_date.year) if user.birth_date else "N/A",
            "gender": user.gender.value if user.gender else "N/A",
            "photo": photo_url,
            "last_diagnosis": last_diag,
            "last_visit": last_visit.strftime("%Y-%m-%d") if last_visit else "N/A",
            "last_scan": last_scan.strftime("%Y-%m-%d") if last_scan else "N/A",
            "email": user.email,
            "phone": user.phone or "N/A",
            "address": user.address or "N/A",
            "registered_at": user.created_at.strftime("%Y-%m-%d") if user.created_at else "N/A",
            "blood_type": patient.blood_type or "N/A",
            "allergies": patient.allergies or "N/A",
            "insurance_provider": patient.insurance_provider or "N/A",
            "insurance_number": patient.insurance_number or "N/A",
            "emergency_name": patient.emergency_contact_name or "N/A",
            "emergency_phone": patient.emergency_contact_phone or "N/A",
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
    active_patients = (
        db.session.query(Appointment.patient_id)
        .filter(Appointment.appointment_date >= past_30d)
        .distinct()
        .count()
    )
    pending_bills = db.session.query(Bill).filter(Bill.payment_status == "pending").count()

    # Follow-ups = upcoming appointments explicitly marked as "follow up"
    followups = (
        db.session.query(Appointment)
        .filter(Appointment.appointment_date > now)
        .filter(func.lower(Appointment.reason).like("%follow%"))
        .count()
    )

    return jsonify({
        "total": total_patients,
        "active30d": active_patients,
        "pendingBills": pending_bills,
        "followups": followups
    }), 200


# ======================================================
# GET — Patient Appointments (Appointment + VisitRecord)
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
        visit = (
            db.session.query(VisitRecord)
            .filter(VisitRecord.appointment_id == a.appointment_id)
            .order_by(VisitRecord.created_at.desc())
            .first()
        )

        doctor = db.session.query(Staff).filter(Staff.staff_id == a.staff_id).first()

        result.append({
            "date": a.appointment_date.strftime("%Y-%m-%d") if a.appointment_date else "N/A",
            "doctor": f"{doctor.f_name} {doctor.l_name}" if doctor else "N/A",
            "reason": a.reason or "N/A",
            "diagnosis": visit.diagnosis if visit else "N/A",
            "medication": visit.treatment_plan if visit else "N/A",
            "scan": "Yes" if visit and visit.scans else "No"
        })

    return jsonify(result), 200


@admin_patients_bp.route("/patients/<int:patient_id>/scans", methods=["GET"])
def get_patient_scans(patient_id):
    scans = (
        db.session.query(DicomScan)
        .filter(DicomScan.patient_id == patient_id)
        .order_by(DicomScan.scan_date.desc())
        .all()
    )

    if not scans:
        return jsonify([{"scan_name": "N/A", "report": "No scans or reports available now"}]), 200

    result = []
    for s in scans:
        scan_result = (
            db.session.query(ScanResult)
            .filter(ScanResult.scan_id == s.scan_id)
            .first()
        )
        rad = db.session.query(Staff).filter(Staff.staff_id == s.radiologist_id).first()

        # Handle missing report gracefully
        if not scan_result and not s.rad_report:
            report_text = "No scans or reports available now"
        else:
            report_text = (
                (scan_result.final_diagnosis if scan_result and scan_result.final_diagnosis else None)
                or (scan_result.cdss_result if scan_result and scan_result.cdss_result else None)
                or (s.rad_report if s.rad_report else None)
                or "No scans or reports available now"
            )

        result.append({
            "scan_name": s.scan_type or "N/A",
            "date": s.scan_date.strftime("%Y-%m-%d") if s.scan_date else "N/A",
            "radiologist": f"{rad.f_name} {rad.l_name}" if rad else "N/A",
            "report": report_text,
        })

    return jsonify(result), 200


# ======================================================
# POST — Upload Profile Photo (updates User.profile_image)
# ======================================================
@admin_patients_bp.route("/patients/<int:patient_id>/photo", methods=["POST"])
def upload_patient_photo(patient_id):
    file = request.files.get("photo")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    patient = Patient.query.get(patient_id)
    if not patient:
        return jsonify({"error": "Patient not found"}), 404

    filename = f"user_{patient.user_id}_{file.filename}"
    save_path = os.path.join(UPLOAD_FOLDER, "profile_images", filename)
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    file.save(save_path)

    user = User.query.get(patient.user_id)
    user.profile_image = f"uploads/profile_images/{filename}"
    db.session.commit()

    return jsonify({
        "photo": f"http://127.0.0.1:5000/uploads/profile_images/{filename}"
    }), 200

# ======================================================
# PUT — Update patient personal info (User + Patient)
# ======================================================
@admin_patients_bp.route("/patients/<int:patient_id>", methods=["PUT"])
def update_patient_info(patient_id):
    data = request.get_json()
    patient = Patient.query.get(patient_id)
    if not patient:
        return jsonify({"error": "Patient not found"}), 404

    user = User.query.get(patient.user_id)
    if not user:
        return jsonify({"error": "Linked user not found"}), 404

    # ---- Update User fields ----
    user.f_name = data.get("f_name", user.f_name)
    user.l_name = data.get("l_name", user.l_name)
    user.email = data.get("email", user.email)
    user.phone = data.get("phone", user.phone)
    user.address = data.get("address", user.address)
    user.gender = data.get("gender", user.gender)
    user.birth_date = (
        datetime.strptime(data["birth_date"], "%Y-%m-%d").date()
        if data.get("birth_date")
        else user.birth_date
    )

    # ---- Update Patient fields ----
    patient.blood_type = data.get("blood_type", patient.blood_type)
    patient.allergies = data.get("allergies", patient.allergies)
    patient.insurance_provider = data.get("insurance_provider", patient.insurance_provider)
    patient.insurance_number = data.get("insurance_number", patient.insurance_number)
    patient.emergency_contact_name = data.get("emergency_name", patient.emergency_contact_name)
    patient.emergency_contact_phone = data.get("emergency_phone", patient.emergency_contact_phone)

    db.session.commit()

    return jsonify({"message": "Patient info updated successfully"}), 200
