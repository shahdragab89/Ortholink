from flask import Blueprint, jsonify, request, send_from_directory
from .extensions import db
from .models.user import User, Role, Gender
from .models.staff import Staff
from .models.dicom_scan import DicomScan
from .models.scans_results import ScanResult
from .models.bill import Bill
from .models.bill_item import BillItem
from .models.appointment import Appointment
from datetime import datetime, timedelta
from sqlalchemy import func, or_
from werkzeug.security import generate_password_hash
import os

admin_radiologists_bp = Blueprint("admin_radiologists_bp", __name__, url_prefix="/api/admin")

UPLOAD_DIR = os.path.join("uploads", "profile_images")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ==========================================================
# Serve uploaded profile images
# ==========================================================
@admin_radiologists_bp.route("/uploads/<path:filename>")
def serve_uploaded(filename):
    return send_from_directory("uploads/profile_images", filename)

# ==========================================================
# GET — All Radiologists
# ==========================================================
@admin_radiologists_bp.route("/radiologists", methods=["GET"])
def get_all_radiologists():
    now = datetime.utcnow().date()
    past_30d = now - timedelta(days=30)

    radiologists = (
        db.session.query(User, Staff)
        .join(Staff, Staff.user_id == User.user_id)
        .filter(User.role == Role.RADIOLOGIST)
        .all()
    )

    result = []
    for user, staff in radiologists:
        # 1️⃣ Volume (scans handled in last 30 days)
        volume30d = (
            db.session.query(func.count(DicomScan.scan_id))
            .filter(
                DicomScan.radiologist_id == staff.staff_id,
                DicomScan.scan_date >= past_30d
            )
            .scalar() or 0
        )

       # 2️⃣ Revenue (linked through BillItem for scans)
        revenue30d = (
            db.session.query(func.sum(BillItem.total_price))
            .join(Bill, BillItem.bill_id == Bill.bill_id)
            .join(DicomScan, DicomScan.patient_id == Bill.patient_id)
            .filter(
                DicomScan.radiologist_id == staff.staff_id,
                BillItem.service_name.ilike("%scan%"),
                Bill.created_at >= past_30d
            )
            .scalar() or 0
        )



        # 3️⃣ Profile image URL
        photo_url = (
            f"http://127.0.0.1:5000/{user.profile_image.replace(os.sep, '/')}"
            if user.profile_image else ""
        )

        result.append({
            "id": staff.staff_id,
            "name": f"Dr. {user.f_name or ''} {user.l_name or ''}".strip(),
            "professional_title": staff.department or "Radiology",
            "medical_license": staff.license_number or "N/A",
            "radiologist_id": f"R-{staff.staff_id}",
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
            "schedule": "8 AM – 4 PM",
            "volume30d": volume30d,
            "revenue30d": f"{float(revenue30d):,.2f} EGP" if revenue30d else "0.00 EGP",
        })

    return jsonify(result), 200

# ==========================================================
# POST — Add Radiologist
# ==========================================================
@admin_radiologists_bp.route("/radiologists", methods=["POST"])
def add_radiologist():
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
            role=Role.RADIOLOGIST,
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
            department=data.get("professional_title") or "Radiology",
            phone=data.get("phone"),
            hire_date=datetime.strptime(data["hire_date"], "%Y-%m-%d") if data.get("hire_date") else None,
        )
        db.session.add(staff)
        db.session.commit()

        return jsonify({"message": "Radiologist added successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# ==========================================================
# PUT — Update Radiologist
# ==========================================================
@admin_radiologists_bp.route("/radiologists/<int:staff_id>", methods=["PUT"])
def update_radiologist(staff_id):
    staff = Staff.query.get(staff_id)
    if not staff:
        return jsonify({"error": "Radiologist not found"}), 404

    data = request.form
    file = request.files.get("photo")
    user = staff.user

    try:
        if file:
            filename = f"{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{file.filename}"
            save_path = os.path.join(UPLOAD_DIR, filename)
            file.save(save_path)
            user.profile_image = f"uploads/profile_images/{filename}"

        for key in ["f_name", "l_name", "phone", "address", "email"]:
            if data.get(key):
                setattr(user, key, data[key])

        if data.get("password_hash"):
            user.password_hash = data["password_hash"]

        if data.get("medical_license"):
            staff.license_number = data["medical_license"]
        if data.get("professional_title"):
            staff.department = data["professional_title"]
        if data.get("hire_date"):
            staff.hire_date = datetime.strptime(data["hire_date"], "%Y-%m-%d")

        db.session.commit()
        return jsonify({"message": "Radiologist updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# ==========================================================
# GET — Radiologist Stats (right-side boxes)
# ==========================================================
@admin_radiologists_bp.route("/radiologists/stats", methods=["GET"])
def radiologists_page_stats():
    now = datetime.utcnow().date()
    past_30d = now - timedelta(days=30)

    # Total Radiologists
    total_radiologists = (
        db.session.query(User)
        .filter(User.role == Role.RADIOLOGIST)
        .count()
    )

    # Scan capacity = total upcoming scans (today + future)
    scan_capacity = (
        db.session.query(DicomScan)
        .filter(DicomScan.scan_date >= now)
        .count()
    )


    # Most frequent scan type
    frequent_scan_type = (
        db.session.query(DicomScan.scan_type, func.count(DicomScan.scan_type))
        .filter(DicomScan.scan_date >= past_30d)
        .group_by(DicomScan.scan_type)
        .order_by(func.count(DicomScan.scan_type).desc())
        .first()
    )
    frequent_scan_type = frequent_scan_type[0] if frequent_scan_type else "N/A"

    # Average scan duration = difference between verified_at & processed_at
    avg_scan_duration = (
    db.session.query(
        func.avg(func.extract('epoch', ScanResult.verified_at - ScanResult.processed_at))
    )
        .filter(ScanResult.verified_at.isnot(None), ScanResult.processed_at.isnot(None))
        .scalar()
    )

    avg_scan_duration = round(avg_scan_duration / 60, 2) if avg_scan_duration else 0.0

    return jsonify({
        "total_radiologists": total_radiologists,
        "scan_capacity": scan_capacity,
        "frequent_scan_type": frequent_scan_type,
        "avg_scan_duration": avg_scan_duration,
    }), 200
