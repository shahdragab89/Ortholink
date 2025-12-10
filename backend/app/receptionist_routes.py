from flask import Blueprint, request, jsonify
from .extensions import db
from .models.appointment import Appointment
from .models.staff import Staff
from .models.visit_record import VisitRecord
from .models.user import User
from .models.dicom_scan import DicomScan
from .models.patient import Patient



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

    date = data.get("date")        # "2025-02-10"
    time = data.get("time")        # "14:00:00"
    staff_id = data.get("staff_id")

    if not (date and time and staff_id):
        return jsonify({"error": "Missing fields"}), 400

    old_app = Appointment.query.get(id)
    if not old_app:
        return jsonify({"error": "Appointment not found"}), 404

    new_app = Appointment(
        patient_id=old_app.patient_id,
        staff_id=staff_id,
        appointment_date=date,
        appointment_time=time,
        status="scheduled"
    )

    db.session.add(new_app)
    db.session.commit()

    return jsonify({"message": "New appointment created"})

@reception_bp.route("/doctors", methods=["GET"])
def get_doctors():
    doctors = Staff.query.all()
    result = []

    for d in doctors:
        user = User.query.get(d.user_id)
        # if user.role in ["DOCTOR", "Orthopedics", "ORTHOPEDICS"]:
        if d.department and d.department.lower() in ["orthopedics", "orthopedic"]:
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
        pat = Patient.query.get(s.patient_id)
        if not pat:
            continue

        user = User.query.get(pat.user_id)
        if not user:
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
            "name": f"{user.f_name} {user.l_name}",
            "patientId": f"P-{s.patient_id}",
            "phone": user.phone,
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
    staff_id = data.get("staff_id")

    if not (date and time and staff_id):
        return jsonify({"error": "Missing fields"}), 400

    old_scan = DicomScan.query.get(id)
    if not old_scan:
        return jsonify({"error": "Scan not found"}), 404

    # Convert "2025-02-05" + "14:00:00" to one datetime
    from datetime import datetime
    try:
        scan_dt = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M:%S")
    except:
        return jsonify({"error": "Invalid date/time"}), 400

    new_scan = DicomScan(
        patient_id=old_scan.patient_id,
        staff_id=staff_id,
        scan_date=scan_dt,
        modality=old_scan.modality,
        body_part=old_scan.body_part,
        scan_type=old_scan.scan_type,
        record_id=None,
        status="pending"
    )

    db.session.add(new_scan)
    db.session.commit()

    return jsonify({"message": "New scan created"})


