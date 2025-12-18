import os
from flask import Blueprint, request, jsonify, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from werkzeug.utils import secure_filename

from .extensions import db
from .models.user import User, Role
from .models.staff import Staff
from .models.visit_record import VisitRecord

from .config import Config  # Import config


radiologist_bp = Blueprint('radiologist', __name__)

# Use config-based upload folder
UPLOAD_FOLDER = Config.UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

# ===============================
# Helpers
# ===============================
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def get_current_radiologist():
    user_id = get_jwt_identity()
    return User.query.filter_by(user_id=user_id, role=Role.RADIOLOGIST).first()


# ===============================
# Get Radiologist Profile
# ===============================
@radiologist_bp.route('/radiologist/<int:user_id>', methods=['GET'])
@jwt_required()
def get_radiologist_profile(user_id):
    current_user_id = get_jwt_identity()

    try:
        current_user_id = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid token"}), 400

    if current_user_id != user_id:
        return jsonify({"error": "Unauthorized access"}), 403

    user = User.query.get(user_id)
    if not user or user.role != Role.RADIOLOGIST:
        return jsonify({"error": "Radiologist not found"}), 404

    staff = Staff.query.filter_by(user_id=user_id).first()
    if not staff:
        return jsonify({"error": "Staff record not found"}), 404

    return jsonify({
        "user_id": user.user_id,
        "username": user.username,
        "email": user.email,
        "f_name": user.f_name,
        "l_name": user.l_name,
        "phone": user.phone,
        "address": user.address,
        "birth_date": user.birth_date.strftime("%Y-%m-%d") if user.birth_date else None,
        "gender": user.gender.value if user.gender else None,
        "profile_image": user.profile_image,
        "staff_id": staff.staff_id,
        "license_number": staff.license_number,
        "department": staff.department,
        "hire_date": staff.hire_date.strftime("%Y-%m-%d") if staff.hire_date else None,
        "salary": float(staff.salary) if staff.salary else None,
        "role": user.role.value
    })


# ===============================
# Update Radiologist Profile
# ===============================
@radiologist_bp.route('/radiologist/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_radiologist_profile(user_id):
    current_user_id = int(get_jwt_identity())

    if current_user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    user = User.query.get(user_id)
    if not user or user.role != Role.RADIOLOGIST:
        return jsonify({"error": "Radiologist not found"}), 404

    staff = Staff.query.filter_by(user_id=user_id).first()
    if not staff:
        return jsonify({"error": "Staff record not found"}), 404

    data = request.json or {}

    if "phone" in data:
        user.phone = data["phone"]
        staff.phone = data["phone"]

    if "address" in data:
        user.address = data["address"]

    db.session.commit()

    return jsonify({"message": "Profile updated successfully"}), 200

# ===============================
# Upload Profile Image (FIXED)
# ===============================
@radiologist_bp.route('/radiologist/<int:user_id>/profile-image', methods=['POST'])
@jwt_required()
def upload_radiologist_profile_image(user_id):
    current_user_id = int(get_jwt_identity())

    if current_user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    user = User.query.get(user_id)
    if not user or user.role != Role.RADIOLOGIST:
        return jsonify({"error": "Radiologist not found"}), 404

    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid image type"}), 400

    # Ensure upload folder exists
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    ext = file.filename.rsplit(".", 1)[1].lower()
    filename = secure_filename(f"radiologist_{user_id}.{ext}")
    filepath = os.path.join(UPLOAD_FOLDER, filename)

    # Remove old image if exists
    if user.profile_image:
        old_filename = os.path.basename(user.profile_image)
        old_filepath = os.path.join(UPLOAD_FOLDER, old_filename)
        if os.path.exists(old_filepath):
            try:
                os.remove(old_filepath)
            except:
                pass

    file.save(filepath)

    # Store the filename only or relative path
    user.profile_image = filename

    db.session.commit()

    return jsonify({
        "message": "Profile image uploaded successfully",
        "profile_image": user.profile_image  # This returns something like "profile_images/radiologist_123.jpg"
    }), 200


# ===============================
# Serve Profile Images
# ===============================
@radiologist_bp.route('/profile_images/<filename>')
def serve_profile_image(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

print("UPLOAD_FOLDER =", UPLOAD_FOLDER)

# ===============================
# Get Radiologist Scans
# ===============================
@radiologist_bp.route("/radiologist/<int:user_id>/scans", methods=["GET"])
@jwt_required()
def get_radiologist_scans(user_id):
    current_user_id = int(get_jwt_identity())

    if current_user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    staff = Staff.query.filter_by(user_id=user_id).first()
    if not staff:
        return jsonify({"error": "Radiologist staff record not found"}), 404

    from .models.dicom_scan import DicomScan
    from .models.patient import Patient

    scans = DicomScan.query.filter_by(staff_id=staff.staff_id).all()

    results = []
    for s in scans:
        patient = Patient.query.get(s.patient_id)
        user = User.query.get(patient.user_id)

        results.append({
            "id": s.scan_id,
            "date": s.scan_date.strftime("%Y-%m-%d"),
            "time": s.scan_date.strftime("%H:%M"),
            "patient": f"{user.f_name} {user.l_name}",
            "pid": patient.patient_id,
            "bodyType": s.body_part,
            "module": s.modality,
            "desc": s.description,
            "status": s.status,
            "recordId": s.record_id
        })

    return jsonify(results), 200
