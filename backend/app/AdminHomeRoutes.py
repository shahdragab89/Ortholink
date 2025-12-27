from flask import Blueprint, jsonify, request
from sqlalchemy import func, desc, extract
from datetime import datetime
from .extensions import db
from .models.user import User, Role
from .models.patient import Patient
from .models.appointment import Appointment
from .models.bill import Bill
from .models.dicom_scan import DicomScan
from .models.staff import Staff

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/dashboard-stats', methods=['GET'])
def get_dashboard_stats():
    try:
        # 1. Get the filter from the URL (default to 'this_month')
        period = request.args.get('period', 'this_month')
        
        now = datetime.utcnow()
        start_date = None
        end_date = now

        # 2. Determine the Date Range
        if period == 'this_month':
            start_date = datetime(now.year, now.month, 1)
        elif period == 'last_month':
            if now.month == 1:
                start_date = datetime(now.year - 1, 12, 1)
                end_date = datetime(now.year, 1, 1)
            else:
                start_date = datetime(now.year, now.month - 1, 1)
                end_date = datetime(now.year, now.month, 1)
        elif period == 'this_year':
            start_date = datetime(now.year, 1, 1)
        else:
            start_date = datetime(2000, 1, 1)

        # --- 3. CALCULATE METRICS ---
        
        # A. REVENUE (Filtered by Date)
        # Only sum bills from the selected period
        revenue_query = db.session.query(func.sum(Bill.total_amount)).filter(
            Bill.bill_date >= start_date,
            Bill.bill_date < end_date
        )
        total_revenue = revenue_query.scalar() or 0

        # B. TOTAL PATIENTS (ALL TIME - NO FILTER)
        # You want to see the total database size, not just new registrations
        total_patients = Patient.query.count()

        # C. APPOINTMENTS (Filtered by Date)
        # Shows workload for the selected period
        appointments_query = db.session.query(func.count(Appointment.appointment_id)).filter(
            Appointment.appointment_date >= start_date,
            Appointment.appointment_date < end_date
        )
        total_appointments = appointments_query.scalar() or 0

        # D. STAFF (Total Active - NO FILTER)
        doctors_count = User.query.filter(User.role == Role.DOCTOR).count()
        radiologists_count = User.query.filter(User.role == Role.RADIOLOGIST).count()
        receptionists_count = User.query.filter(User.role == Role.RECEPTIONIST).count()

        # --- 4. CHARTS (Filtered by Date) ---
        
        # Appointment Outcomes
        appt_status_query = db.session.query(
            Appointment.status, func.count(Appointment.appointment_id)
        ).filter(
            Appointment.appointment_date >= start_date,
            Appointment.appointment_date < end_date
        ).group_by(Appointment.status).all()
        status_dict = {status: count for status, count in appt_status_query}

        # Modality
        modality_query = db.session.query(
            DicomScan.modality, func.count(DicomScan.scan_id)
        ).filter(
            DicomScan.scan_date >= start_date,
            DicomScan.scan_date < end_date
        ).group_by(DicomScan.modality).all()
        modality_stats = [{"label": m[0] or "Unknown", "value": m[1]} for m in modality_query if m[0]]

        # Doctor Workload
        top_doctors = db.session.query(
            Staff.f_name, Staff.l_name, Staff.department, func.count(Appointment.appointment_id)
        ).join(Appointment, Staff.staff_id == Appointment.staff_id)\
         .filter(Appointment.appointment_date >= start_date, Appointment.appointment_date < end_date)\
         .group_by(Staff.staff_id)\
         .order_by(desc(func.count(Appointment.appointment_id)))\
         .limit(3).all()

        doctor_workload = [
            {"name": f"Dr. {d[0]} {d[1]}", "role": d[2] or "Specialist", "value": d[3]} 
            for d in top_doctors
        ]

        # Radiologist Workload
        top_radiologists = db.session.query(
            Staff.f_name, Staff.l_name, func.count(DicomScan.scan_id)
        ).join(DicomScan, Staff.staff_id == DicomScan.radiologist_id)\
         .filter(DicomScan.scan_date >= start_date, DicomScan.scan_date < end_date)\
         .group_by(Staff.staff_id)\
         .order_by(desc(func.count(DicomScan.scan_id)))\
         .limit(3).all()
         
        radiologist_workload = [
            {"name": f"Dr. {r[0]} {r[1]}", "value": r[2]} 
            for r in top_radiologists
        ]

        # --- 5. FINANCIAL GROWTH (Last 3 Months Static) ---
        financial_growth = []
        # We assume "Last 3 Months" means Oct, Nov, Dec of 2025 based on your data
        for month_offset in [10, 11, 12]:
            month_rev = db.session.query(func.sum(Bill.total_amount)).filter(
                extract('month', Bill.bill_date) == month_offset,
                extract('year', Bill.bill_date) == 2025 
            ).scalar() or 0
            
            m_name = {10: "Oct", 11: "Nov", 12: "Dec"}[month_offset]
            financial_growth.append({"month": m_name, "value": float(month_rev)})

        return jsonify({
            "overview": {
                "revenue": f"${total_revenue:,.0f}",
                "patients": total_patients,         # Now shows TOTAL (7+)
                "appointments": total_appointments, # Shows THIS MONTH's appointments
                "doctors": doctors_count,
                "radiologists": radiologists_count,
                "receptionists": receptionists_count
            },
            "appointment_outcomes": {
                "completed": status_dict.get('completed', 0),
                "upcoming": status_dict.get('scheduled', 0),
                "cancelled": status_dict.get('cancelled', 0),
                "noshow": status_dict.get('no_show', 0)
            },
            "modality_stats": modality_stats,
            "doctor_workload": doctor_workload,
            "radiologist_workload": radiologist_workload,
            "financial_growth": financial_growth
        }), 200

    except Exception as e:
        print(f"Error fetching admin stats: {e}")
        return jsonify({"error": str(e)}), 500