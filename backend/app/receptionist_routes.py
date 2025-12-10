from flask import Blueprint, request, jsonify
from .extensions import db
from .models.appointment import Appointment
from .models.staff import Staff
from .models.visit_record import VisitRecord
from .models.user import User
from .models.dicom_scan import DicomScan



reception_bp = Blueprint("reception", __name__)

# -----------------------
# GET ALL APPOINTMENTS
# -----------------------
@reception_bp.route("/appointments", methods=["GET"])
def get_appointments():
    appointments = Appointment.query.all()

    data = []
    for a in appointments:
        user = User.query.get(a.patient.user_id)
        staff = Staff.query.get(a.staff_id)

        data.append({
            "id": a.appointment_id,
            "name": f"{user.f_name} {user.l_name}",
            "patientId": f"P-{a.patient_id}",
            "phone": user.phone,
            "date": str(a.appointment_date),
            "time": str(a.appointment_time),
            "doctor": f"Dr. {staff.f_name}",
            "status": a.status,
            "billing": "Pending"
        })

    return jsonify(data), 200


# -----------------------
# RESCHEDULE APPOINTMENT
# -----------------------
@reception_bp.route("/appointment/<int:id>/reschedule", methods=["PUT"])
def reschedule_appointment(id):
    data = request.get_json()

    date = data.get("date")
    time = data.get("time")
    doctor_id = data.get("doctor_id")

    if not (date and time and doctor_id):
        return jsonify({"error": "Missing fields"}), 400

    old_app = Appointment.query.get(id)
    if not old_app:
        return jsonify({"error": "Appointment not found"}), 404

    # Create NEW appointment row
    new_app = Appointment(
        patient_id=old_app.patient_id,
        staff_id=doctor_id,
        date=date,
        time=time,
        status="Pending",
        billing="Not Paid"
    )

    db.session.add(new_app)
    db.session.commit()

    return jsonify({"message": "New appointment created", "new_id": new_app.appointment_id})

@reception_bp.route("/doctors", methods=["GET"])
def get_doctors():
    doctors = Staff.query.all()
    result = []

    for d in doctors:
        user = User.query.get(d.user_id)
        if user.role.upper() in ["DOCTOR", "ORTHOPEDIC", "ORTHOPEDICS"]:
            result.append({
                "staff_id": d.staff_id,
                "name": f"Dr. {d.f_name}",
            })

    return jsonify(result), 200

from .models.dicom_scan import DicomScan

@reception_bp.route("/scans", methods=["GET"])
def get_scans():
    scans = DicomScan.query.all()
    data = []

    for s in scans:
        # Get patient from patient_id → then get user
        patient = User.query.get(s.patient_id)

        if not patient:
            continue

        # Get radiologist (staff)
        radiologist = Staff.query.get(s.staff_id)
        if radiologist:
            radiologist_user = User.query.get(radiologist.user_id)
            radiologist_name = f"Dr. {radiologist_user.f_name}"
        else:
            radiologist_name = "Unknown"

        # scan_date is a timestamp, you stored it as DATE → convert safely
        scan_date = (
            s.scan_date.strftime("%Y-%m-%d") if s.scan_date else None
        )
        scan_time = (
            s.scan_date.strftime("%H:%M") if s.scan_date else None
        )

        data.append({
            "id": s.scan_id,
            "name": f"{patient.f_name} {patient.l_name}",
            "patientId": f"P-{s.patient_id}",
            "phone": patient.phone,
            "date": scan_date,
            "time": scan_time,
            "modality": s.modality,
            "radiologist": radiologist_name,
            "billing": "Pending",
            "status": s.status
        })

    return jsonify(data), 200


@reception_bp.route("/scan/<int:id>/reschedule", methods=["PUT"])
def reschedule_scan(id):
    data = request.get_json()

    date = data.get("date")
    time = data.get("time")
    staff_id = data.get("staff_id")     # radiologist_id coming from frontend

    if not (date and time and staff_id):
        return jsonify({"error": "Missing fields"}), 400

    old_scan = DicomScan.query.get(id)
    if not old_scan:
        return jsonify({"error": "Scan not found"}), 404

    # Create NEW scan row
    new_scan = DicomScan(
        patient_id=old_scan.patient_id,
        staff_id=staff_id,
        date=date,
        time=time,
        modality=old_scan.modality,
        status="Pending",
        billing="Not Paid"
    )

    db.session.add(new_scan)
    db.session.commit()

    return jsonify({"message": "New scan created", "new_id": new_scan.scan_id})
