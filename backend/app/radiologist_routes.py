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

def calculate_age(birth_date):
    """Calculate age from birth date"""
    if not birth_date:
        return "N/A"
    
    today = datetime.now().date()
    age = today.year - birth_date.year
    
    # Adjust if birthday hasn't occurred yet this year
    if (today.month, today.day) < (birth_date.month, birth_date.day):
        age -= 1
    
    return age

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
    
    # DEBUG LOGGING
    print(f"DEBUG: Current user_id: {user_id}")
    print(f"DEBUG: Found staff record - staff_id: {staff.staff_id}, user_id: {staff.user_id}")
    print(f"DEBUG: Looking for scans with radiologist_id = {staff.staff_id}")

    from .models.dicom_scan import DicomScan
    from .models.patient import Patient
    from .models.user import User as PatientUser
    
    today = datetime.now().date()

    # FIXED: Use f_name and l_name instead of full_name
    # Also use func.concat to combine first and last names
    from sqlalchemy import func
    
    scans = db.session.query(
        DicomScan,
        Staff.f_name,
        Staff.l_name,
        Staff.staff_id.label('referring_doctor_id')
    ).join(
        Staff, DicomScan.staff_id == Staff.staff_id
    ).filter(
        DicomScan.radiologist_id == staff.staff_id
    ).all()
    
    # ADD MORE DEBUG
    print(f"DEBUG: Found {len(scans)} scans in query")
    for scan, f_name, l_name, doc_id in scans:
        print(f"DEBUG: Scan ID: {scan.scan_id}, Radiologist ID: {scan.radiologist_id}, Referring Dr: {f_name} {l_name}")

    results = []
    for scan, doc_f_name, doc_l_name, doc_id in scans:
        # Get patient info
        patient = Patient.query.get(scan.patient_id)
        
        if patient:
            user = PatientUser.query.get(patient.user_id)
            if user:
                patient_name = f"{user.f_name} {user.l_name}"
                # Calculate age
                if user.birth_date:
                    birth_date = user.birth_date
                    age = today.year - birth_date.year
                    if (today.month, today.day) < (birth_date.month, birth_date.day):
                        age -= 1
                    patient_age = str(age)
                else:
                    patient_age = "N/A"
                
                patient_gender = user.gender.value if user.gender else "N/A"
            else:
                patient_name = "Unknown Patient"
                patient_age = "N/A"
                patient_gender = "N/A"
        else:
            patient_name = "Unknown Patient"
            patient_age = "N/A"
            patient_gender = "N/A"

        # Combine doctor's first and last name
        referring_doctor_name = f"{doc_f_name} {doc_l_name}" if doc_f_name and doc_l_name else "Unknown Doctor"

        results.append({
            "id": scan.scan_id,
            "date": scan.scan_date.strftime("%Y-%m-%d") if scan.scan_date else "N/A",
            "time": scan.scan_date.strftime("%H:%M") if scan.scan_date else "N/A",
            "patient": patient_name,
            "pid": patient.patient_id if patient else "N/A",
            "doctor": referring_doctor_name,
            "did": doc_id or "N/A",
            "bodyType": scan.body_part or "N/A",
            "module": scan.modality or "N/A",
            "desc": scan.description or "No description",
            "status": scan.status or "pending",
            "recordId": scan.record_id or "N/A",
            "age": patient_age,
            "gender": patient_gender
        })
    
    print(f"DEBUG: Returning {len(results)} results")
    return jsonify(results), 200
# ===============================
# Complete Scan (Update Status)
# ===============================
@radiologist_bp.route('/scans/<int:scan_id>/complete', methods=['PUT'])
@jwt_required()
def complete_scan(scan_id):
    current_user_id = int(get_jwt_identity())
    
    # Get radiologist staff record
    radiologist_staff = Staff.query.filter_by(user_id=current_user_id).first()
    if not radiologist_staff:
        return jsonify({"error": "Radiologist staff record not found"}), 404
    
    from .models.dicom_scan import DicomScan
    
    scan = DicomScan.query.get(scan_id)
    if not scan:
        return jsonify({"error": "Scan not found"}), 404
    
    # Verify this scan is assigned to this radiologist
    if scan.radiologist_id != radiologist_staff.staff_id:
        return jsonify({"error": "This scan is not assigned to you"}), 403
    
    data = request.json or {}
    
    # Update scan status
    if 'status' in data:
        scan.status = data['status']
    
    # You might want to update other fields like file_path, description, etc.
    if 'notes' in data:
        scan.description = f"{scan.description or ''}\n\nRadiologist Notes: {data['notes']}"
    
    scan.uploaded_at = datetime.now()
    
    db.session.commit()
    
    return jsonify({
        "message": "Scan completed successfully",
        "scan_id": scan.scan_id,
        "status": scan.status
    }), 200