from flask import Blueprint, jsonify
from sqlalchemy import desc
from datetime import date
from .extensions import db
from .models.appointment import Appointment
from .models.patient import Patient
from .models.staff import Staff
from .models.user import User
from .models.visit_record import VisitRecord
from .models.dicom_scan import DicomScan
from .models.medication import Medication

admin_appointments_bp = Blueprint('admin_appointments', __name__)

# ---------------------------------------------------------
# 1. GET ALL APPOINTMENTS (Robust List)
# ---------------------------------------------------------
@admin_appointments_bp.route('/dashboard-appointments', methods=['GET'])
def get_admin_appointments():
    try:
        # Use OUTER JOINs so appointments show up even if patient/doctor link is missing
        appointments = db.session.query(
            Appointment,
            User.f_name.label('p_fname'),
            User.l_name.label('p_lname'),
            Staff.f_name.label('doc_fname'),
            Staff.l_name.label('doc_lname')
        ).outerjoin(
            Patient, Appointment.patient_id == Patient.patient_id
        ).outerjoin(
            User, Patient.user_id == User.user_id
        ).outerjoin(
            Staff, Appointment.staff_id == Staff.staff_id
        ).order_by(Appointment.appointment_date.desc(), Appointment.appointment_time.desc()).all()

        results = []
        for appt, pf, pl, df, dl in appointments:
            # Handle missing names gracefully
            p_name = f"{pf} {pl}" if pf and pl else "Unknown Patient"
            doc_name = f"Dr. {df} {dl}" if df and dl else "Unknown Doctor"
            
            results.append({
                "id": appt.appointment_id,
                "patient_name": p_name,
                "status": appt.status,
                "doctor": doc_name,
                "reason": appt.reason or "Routine Checkup",
                "date": str(appt.appointment_date),
                "time": str(appt.appointment_time),
            })

        print(f"DEBUG: Found {len(results)} appointments") # Check terminal for this!
        return jsonify(results), 200

    except Exception as e:
        print(f"Error fetching appointments: {e}")
        return jsonify({"error": str(e)}), 500


# ---------------------------------------------------------
# 2. GET STATS (Today's Data)
# ---------------------------------------------------------
@admin_appointments_bp.route('/dashboard-appointments/stats', methods=['GET'])
def get_appointment_stats():
    try:
        today = date.today()

        # 1. Today's Appointments
        today_count = Appointment.query.filter(Appointment.appointment_date == today).count()

        # 2. Completed Today
        completed_today = Appointment.query.filter(
            Appointment.appointment_date == today,
            Appointment.status == 'completed'
        ).count()

        # 3. Cancelled/No Show (ALL TIME or TODAY? Let's do ALL TIME for better visibility)
        # If you prefer only today, add: Appointment.appointment_date == today
        cancelled_total = Appointment.query.filter(
            Appointment.status.in_(['cancelled', 'no_show'])
        ).count()

        # 4. Avg Wait Time (Mock logic)
        avg_wait = "12 min"

        return jsonify({
            "today": today_count,
            "completed": completed_today,
            "cancelled": cancelled_total, # Showing ALL cancelled to ensure it's not 0
            "avgWait": avg_wait
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# (Keep the get_appointment_details route exactly as it was)
@admin_appointments_bp.route('/dashboard-appointments/<int:id>/details', methods=['GET'])
def get_appointment_details(id):
    try:
        visit = VisitRecord.query.filter_by(appointment_id=id).first()
        
        data = {
            "complaint": "No record yet",
            "diagnosis": "Pending",
            "physical_exam": "None",
            "treatment_plan": "None",
            "ordered_scans": "None",
            "ordered_medications": "None"
        }

        if visit:
            data["complaint"] = visit.chief_complaint or "No complaint recorded"
            data["diagnosis"] = visit.diagnosis or "Pending"
            data["physical_exam"] = visit.physical_examination or "None"
            data["treatment_plan"] = visit.treatment_plan or "None"

            scans = DicomScan.query.filter_by(record_id=visit.record_id).all()
            if scans:
                data["ordered_scans"] = ", ".join([f"{s.scan_type} ({s.body_part})" for s in scans])

            meds = Medication.query.filter_by(record_id=visit.record_id).all()
            if meds:
                data["ordered_medications"] = ", ".join([f"{m.medication_name} {m.dosage}" for m in meds])

        return jsonify(data), 200

    except Exception as e:
        print(f"Error fetching details: {e}")
        return jsonify({"error": str(e)}), 500