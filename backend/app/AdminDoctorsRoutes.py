from flask import Blueprint, jsonify, request, send_from_directory
from .extensions import db
from .models.user import User, Role, Gender
from .models.staff import Staff
from datetime import datetime
import os
from sqlalchemy import func
from datetime import datetime, timedelta
from .models.appointment import Appointment
from .models.scans_results import ScanResult
from .models.bill import Bill
from werkzeug.security import generate_password_hash

admin_doctors_bp = Blueprint("admin_doctors_bp", __name__, url_prefix="/api/admin")

UPLOAD_DIR = os.path.join("uploads", "profile_images")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ✅ Serve uploaded profile images correctly
@admin_doctors_bp.route("/uploads/<path:filename>")
def serve_uploaded(filename):
    return send_from_directory("uploads/profile_images", filename)

# ==========================================================
# GET — All Doctors (returns full image URL + plain password)
# ==========================================================
@admin_doctors_bp.route("/doctors", methods=["GET"])
def get_all_doctors():
    from datetime import datetime, timedelta
    from sqlalchemy import func, or_
    from .models.appointment import Appointment
    from .models.scans_results import ScanResult
    from .models.bill import Bill

    now = datetime.utcnow().date()
    past_30d = now - timedelta(days=30)

    doctors = (
        db.session.query(User, Staff)
        .join(Staff, Staff.user_id == User.user_id)
        .filter(User.role == Role.DOCTOR)
        .all()
    )

    result = []
    for user, staff in doctors:
        # ---- 1. Unique patients in the last 30 days ----
        patients30d = (
            db.session.query(func.count(func.distinct(Appointment.patient_id)))
            .filter(
                Appointment.staff_id == staff.staff_id,
                Appointment.appointment_date >= past_30d
            )
            .scalar() or 0
        )

       

        # ---- 3. Revenue (sum of Bill.total_amount linked via Appointment) ----
        revenue30d = (
            db.session.query(func.sum(Bill.total_amount))
            .join(Appointment, Bill.appointment_id == Appointment.appointment_id)
            .filter(
                Appointment.staff_id == staff.staff_id,
                Bill.created_at >= past_30d
            )
            .scalar() or 0
        )

        # ---- 4. Image URL ----
        photo_url = (
            f"http://127.0.0.1:5000/{user.profile_image.replace(os.sep, '/')}"
            if user.profile_image else ""
        )

        result.append({
            "id": staff.staff_id,
            "name": f"Dr. {user.f_name or ''} {user.l_name or ''}".strip(),
            "professional_title": staff.department or "Orthopedics",
            "medical_license": staff.license_number or "N/A",
            "doctor_id": f"D-{staff.staff_id}",
            "username": user.username,
            "email": user.email,
            "password_hash": user.password_hash or "",
            "phone": user.phone or "N/A",
            "address": user.address or "N/A",
            "hire_date": staff.hire_date.strftime("%Y-%m-%d") if staff.hire_date else "",
            "birth_date": user.birth_date.strftime("%Y-%m-%d") if user.birth_date else "",
            "gender": user.gender.value if user.gender else "",
            "status": "Active" if user.is_active else "Inactive",
            "photo": photo_url,
            "schedule": "9 AM – 5 PM",
            "patients30d": patients30d,
            "revenue30d": f"{float(revenue30d):,.2f} EGP" if revenue30d else "0.00 EGP"
        })

    return jsonify(result), 200


# ==========================================================
# POST — Add Doctor (plain password + save correct relative path)
# ==========================================================
@admin_doctors_bp.route("/doctors", methods=["POST"])
def add_doctor():
    data = request.form
    file = request.files.get("photo")

    try:
        profile_path = None
        if file:
            filename = f"{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{file.filename}"
            save_path = os.path.join(UPLOAD_DIR, filename)
            file.save(save_path)
            profile_path = f"uploads/profile_images/{filename}"

        gender_value = Gender[data.get("gender", "MALE").upper()] if data.get("gender") else Gender.MALE

        user = User(
            username=data.get("username"),
            email=data.get("email"),
            password_hash=generate_password_hash(data.get("password_hash")),
            role=Role.DOCTOR,
            gender=gender_value,
            f_name=data.get("first_name"),
            l_name=data.get("last_name"),
            phone=data.get("phone"),
            address=data.get("address"),
            birth_date=datetime.strptime(data["birth_date"], "%Y-%m-%d") if data.get("birth_date") else None,
            profile_image=profile_path,
        )
        db.session.add(user)
        db.session.flush()

        staff = Staff(
            user_id=user.user_id,
            f_name=data.get("first_name"),
            l_name=data.get("last_name"),
            license_number=data.get("medical_license"),
            department=data.get("professional_title"),
            phone=data.get("phone"),
            hire_date=datetime.strptime(data["hire_date"], "%Y-%m-%d") if data.get("hire_date") else None,
        )
        db.session.add(staff)
        db.session.commit()

        return jsonify({"message": "Doctor added successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ==========================================================
# PUT — Update Doctor (updates plain password + photo)
# ==========================================================
@admin_doctors_bp.route("/doctors/<int:staff_id>", methods=["PUT"])
def update_doctor(staff_id):
    staff = Staff.query.get(staff_id)
    if not staff:
        return jsonify({"error": "Doctor not found"}), 404

    data = request.form
    file = request.files.get("photo")
    user = staff.user

    try:
        if file:
            filename = f"{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{file.filename}"
            save_path = os.path.join(UPLOAD_DIR, filename)
            file.save(save_path)
            user.profile_image = f"uploads/profile_images/{filename}"

        # update text fields
        for key in ["f_name", "l_name", "phone", "address", "email"]:
            if data.get(key):
                setattr(user, key, data[key])

        # update plain password
        if data.get("password_hash"):
            user.password_hash = data["password_hash"]

        if data.get("medical_license"):
            staff.license_number = data["medical_license"]
        if data.get("professional_title"):
            staff.department = data["professional_title"]
        if data.get("hire_date"):
            staff.hire_date = datetime.strptime(data["hire_date"], "%Y-%m-%d")

        db.session.commit()
        return jsonify({"message": "Doctor updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# ===============================
# GET — Stats for Doctors Page
# ===============================
@admin_doctors_bp.route("/doctors/stats", methods=["GET"])
def doctors_page_stats():
    from sqlalchemy import func
    from datetime import datetime, timedelta
    from .models.appointment import Appointment
    from .models.visit_record import VisitRecord
    from .models.bill import Bill  # or whatever your billing model is

    now = datetime.utcnow().date()
    past_30d = now - timedelta(days=30)

    # ---- total doctors ----
    total_doctors = (
        db.session.query(User)
        .filter(User.role == Role.DOCTOR)
        .count()
    )

    # ---- appointment capacity ----
    appointment_capacity = (
        db.session.query(Appointment)
        .filter(Appointment.appointment_date >= now)
        .count()
    )

    # ---- total reports (using visit records as proxy) ----
    total_reports = (
        db.session.query(VisitRecord)
        .filter(VisitRecord.created_at >= past_30d)
        .count()
    )

    # ---- avg visit duration (from Appointment) ----
    avg_visit_duration = (
        db.session.query(func.avg(Appointment.duration_minutes))
        .scalar()
    ) or 0

    return jsonify({
        "total_doctors": total_doctors,
        "appointment_capacity": appointment_capacity,
        "total_reports": total_reports,
        "avg_visit_duration": round(avg_visit_duration, 1),
    }), 200
