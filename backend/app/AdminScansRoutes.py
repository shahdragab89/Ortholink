from flask import Blueprint, jsonify
from sqlalchemy import desc, func
from datetime import date
from .extensions import db
from .models.dicom_scan import DicomScan
from .models.patient import Patient
from .models.staff import Staff
from .models.user import User

admin_scans_bp = Blueprint('admin_scans', __name__)

# ---------------------------------------------------------
# 1. GET ALL SCANS (For the List)
# ---------------------------------------------------------
@admin_scans_bp.route('/dashboard-scans', methods=['GET'])
def get_admin_scans():
    try:
        # We need aliases because we join the User table 3 times (Patient, Doctor, Radiologist)
        PatientUser = db.aliased(User)
        DoctorUser = db.aliased(User)
        RadiologistUser = db.aliased(User)
        DoctorStaff = db.aliased(Staff)
        RadiologistStaff = db.aliased(Staff)

        # Query Scans with all related names
        query = db.session.query(
            DicomScan,
            PatientUser.f_name.label('p_fname'),
            PatientUser.l_name.label('p_lname'),
            DoctorUser.f_name.label('d_fname'),
            DoctorUser.l_name.label('d_lname'),
            RadiologistUser.f_name.label('r_fname'),
            RadiologistUser.l_name.label('r_lname')
        ).select_from(DicomScan) \
         .outerjoin(Patient, DicomScan.patient_id == Patient.patient_id) \
         .outerjoin(PatientUser, Patient.user_id == PatientUser.user_id) \
         .outerjoin(DoctorStaff, DicomScan.staff_id == DoctorStaff.staff_id) \
         .outerjoin(DoctorUser, DoctorStaff.user_id == DoctorUser.user_id) \
         .outerjoin(RadiologistStaff, DicomScan.radiologist_id == RadiologistStaff.staff_id) \
         .outerjoin(RadiologistUser, RadiologistStaff.user_id == RadiologistUser.user_id) \
         .order_by(DicomScan.scan_date.desc())

        scans = query.all()
        
        results = []
        for scan, pf, pl, df, dl, rf, rl in scans:
            # Format Names
            p_name = f"{pf} {pl}" if pf else "Unknown Patient"
            d_name = f"Dr. {df} {dl}" if df else "Unknown Doctor"
            r_name = f"Dr. {rf} {rl}" if rf else "Unassigned"
            
            # Format Date/Time safely
            s_date = scan.scan_date.strftime("%Y-%m-%d") if scan.scan_date else "N/A"
            s_time = scan.scan_date.strftime("%H:%M") if scan.scan_date else "N/A"

            results.append({
                "scan_id": scan.scan_id,
                "scan_type": f"{scan.modality} - {scan.body_part}" if scan.modality else scan.scan_type,
                "status": scan.status,
                "patient_name": p_name,
                "doctor_name": d_name,
                "radiologist_name": r_name,
                "date": s_date,
                "time": s_time,
                "report": scan.rad_report or "No report available yet."
            })
            
        return jsonify(results), 200

    except Exception as e:
        print(f"Error fetching scans: {e}")
        return jsonify({"error": str(e)}), 500


# ---------------------------------------------------------
# 2. GET STATS (For the 4 Boxes)
# ---------------------------------------------------------
@admin_scans_bp.route('/dashboard-scans/stats', methods=['GET'])
def get_scan_stats():
    try:
        today = date.today()
        
        # 1. Today's Scans
        today_count = DicomScan.query.filter(func.date(DicomScan.scan_date) == today).count()
        
        # 2. Completed Today
        completed_today = DicomScan.query.filter(
            func.date(DicomScan.scan_date) == today, 
            DicomScan.status == 'completed'
        ).count()
        
        # 3. Cancelled (All time or today? Let's do All Time for visibility)
        cancelled_count = DicomScan.query.filter(DicomScan.status == 'cancelled').count()
        
        # 4. Pending Reports (Scans that are 'pending')
        pending_count = DicomScan.query.filter(DicomScan.status == 'pending').count()
        
        return jsonify({
            "today": today_count,
            "completed": completed_today,
            "cancelled": cancelled_count,
            "pending": pending_count
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500