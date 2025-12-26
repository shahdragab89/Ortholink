import os
from flask import Blueprint, request, jsonify, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from werkzeug.utils import secure_filename
import shutil

from .extensions import db
from .models.user import User, Role
from .models.staff import Staff
from .models.visit_record import VisitRecord
from .config import Config

radiologist_bp = Blueprint('radiologist', __name__)

# Use config-based upload folder
UPLOAD_FOLDER = Config.UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

# Define scan folders directory
SCAN_FOLDERS_DIR = "scan_folders"

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
        "profile_image": user.profile_image
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
    from .models.user import User as PatientUser
    from sqlalchemy import func
    
    today = datetime.now().date()

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
    
    try:
        data = request.get_json()
        print(f"DEBUG: Received data type: {type(data)}")
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        # Update scan status to 'Completed'
        scan.status = 'completed'
        
        # SAFELY handle rad_report - convert to string and limit length
        if 'rad_report' in data:
            # Get the report text
            report_text = data['rad_report']
            
            # Convert to string if it's not None
            if report_text is not None:
                report_str = str(report_text)
                print(f"DEBUG: Converting rad_report to string. Length: {len(report_str)}")
                
                # Optional: Truncate if too long (for VARCHAR safety)
                if len(report_str) > 2000:
                    print(f"DEBUG: Truncating report from {len(report_str)} to 2000 chars")
                    report_str = report_str[:2000]
                
                scan.rad_report = report_str
            else:
                scan.rad_report = None
        
        # Update folder path - also ensure it's a string
        if 'folder_path' in data and data['folder_path'] is not None:
            scan.folder_path = str(data['folder_path'])
        
        # Set uploaded timestamp
        scan.uploaded_at = datetime.now()
        
        print(f"DEBUG: Before commit - rad_report type: {type(scan.rad_report)}")
        db.session.commit()
        print(f"DEBUG: Commit successful!")
        
        return jsonify({
            "message": "Scan completed successfully",
            "scan_id": scan.scan_id,
            "status": scan.status,
            "has_report": scan.rad_report is not None,
            "report_length": len(scan.rad_report) if scan.rad_report else 0,
            "report_preview": scan.rad_report[:100] + "..." if scan.rad_report and len(scan.rad_report) > 100 else scan.rad_report
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"ERROR in complete_scan: {str(e)}")
        import traceback
        traceback.print_exc()
        
        # Check if it's a database constraint error
        error_msg = str(e).lower()
        if 'string' in error_msg or 'text' in error_msg or 'varchar' in error_msg:
            return jsonify({
                "error": "Database type error", 
                "details": "The rad_report data type is incompatible with the database column",
                "solution": "Change database column to VARCHAR(2000) or TEXT"
            }), 500
        
        return jsonify({"error": "Database error", "details": str(e)}), 500     
# ===============================
# Upload Scan Folder (ANY FILES ALLOWED)
# ===============================
@radiologist_bp.route('/scans/<int:scan_id>/upload-folder', methods=['POST'])
@jwt_required()
def upload_scan_folder(scan_id):
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
    
    # Check if files were uploaded
    if 'files[]' not in request.files:
        return jsonify({"error": "No files provided"}), 400
    
    files = request.files.getlist('files[]')
    
    # ACCEPT ANY FILE TYPE - NO VALIDATION
    if len(files) == 0 or all(f.filename == '' for f in files):
        return jsonify({"error": "No valid files found"}), 400
    
    # Create scan-specific folder in backend/scan_folders/
    scan_folders_base = os.path.join(Config.BASE_DIR, SCAN_FOLDERS_DIR)
    os.makedirs(scan_folders_base, exist_ok=True)
    
    # Use timestamp to make folder name unique
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    folder_name = f"scan_{scan_id}_{timestamp}"
    scan_folder = os.path.join(scan_folders_base, folder_name)
    os.makedirs(scan_folder, exist_ok=True)
    
    # Save all files (ANY FILE TYPE ALLOWED)
    saved_files = []
    total_size = 0
    
    for file in files:
        if file.filename == '':
            continue
        
        # Secure the filename
        filename = secure_filename(file.filename)
        file_path = os.path.join(scan_folder, filename)
        file.save(file_path)
        saved_files.append(filename)
        
        # Calculate file size
        try:
            total_size += os.path.getsize(file_path)
        except:
            pass
    
    # Store RELATIVE path in database: scan_folders/folder_name
    relative_path = f"{SCAN_FOLDERS_DIR}/{folder_name}"
    scan.folder_path = relative_path
    
    db.session.commit()
    
    return jsonify({
        "message": "Scan files uploaded successfully",
        "scan_id": scan.scan_id,
        "folder_path": relative_path,  # Relative path for frontend
        "absolute_path": scan_folder,  # Absolute path for reference
        "files_count": len(saved_files),
        "total_size_bytes": total_size,
        "files": saved_files[:10]  # Return first 10 filenames
    }), 200

# ===============================
# Serve Scan Files (for downloading/viewing)
# ===============================
@radiologist_bp.route('/scan_files/<path:filename>')
@jwt_required()
def serve_scan_file(filename):
    # Security: Validate that user has access to this scan
    # You should add proper authorization logic here
    
    # Build absolute path
    file_path = os.path.join(Config.BASE_DIR, filename)
    
    # Check if file exists
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404
    
    # Serve the file
    return send_from_directory(os.path.dirname(file_path), os.path.basename(file_path))