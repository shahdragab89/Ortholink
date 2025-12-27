# backend/app/routes/doctor_routes.py
from flask import Blueprint, request, jsonify, current_app, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime, date
import os
import uuid

from .models.user import User, Role
from .models.staff import Staff
from .models.appointment import Appointment
from .models.patient import Patient
from .models.dicom_scan import DicomScan
from .models.scans_results import ScanResult
from .models.visit_record import VisitRecord
from .models.medication import Medication
from .extensions import db

doctor_bp = Blueprint('doctor', __name__, url_prefix='/api/doctor')

# Helper function to check if user is a doctor
def is_doctor(user_id):
    user = User.query.get(user_id)
    return user and user.role == Role.DOCTOR

# Helper function to get current doctor staff record
def get_current_doctor():
    user_id = get_jwt_identity()
    if not is_doctor(user_id):
        return None
    
    staff = Staff.query.filter_by(user_id=user_id).first()
    return staff

# Allowed file extensions for uploads
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
ALLOWED_SIGNATURE_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename, allowed_extensions):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

# 1. LOGIN FUNCTIONALITY
@doctor_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'error': 'Username and password required'}), 400
    
    username = data['username']
    password = data['password']
    
    # Find user
    user = User.query.filter_by(username=username).first()
    
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # Check if user is a doctor
    if user.role != Role.DOCTOR:
        return jsonify({'error': 'Access denied. Doctor role required'}), 403
    
    # Verify password
    if not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # Check if user is active
    if not user.is_active:
        return jsonify({'error': 'Account is deactivated'}), 403
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.session.commit()
    
    # Create access token
    access_token = create_access_token(identity=user.user_id)
    
    # Get doctor profile
    staff = Staff.query.filter_by(user_id=user.user_id).first()
    
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': {
            'user_id': user.user_id,
            'username': user.username,
            'email': user.email,
            'role': user.role.value,
            'f_name': user.f_name,
            'l_name': user.l_name,
            'profile_image': user.profile_image,
            'phone': user.phone,
            'address': user.address
        },
        'doctor': {
            'staff_id': staff.staff_id if staff else None,
            'license_number': staff.license_number if staff else None,
            'department': staff.department if staff else None
        }
    }), 200

# 9. GET APPOINTMENTS FIXED VERSION
@doctor_bp.route('/appointments', methods=['GET'])
@jwt_required()
def get_appointments():
    doctor = get_current_doctor()
    if not doctor:
        return jsonify({'error': 'Doctor access required'}), 403
    
    # Get query parameters
    status = request.args.get('status')
    date_filter = request.args.get('date')
    
    # Build query - filter by doctor's staff_id
    query = Appointment.query.filter_by(staff_id=doctor.staff_id)
    
    if status:
        query = query.filter_by(status=status)
    
    if date_filter:
        try:
            filter_date = datetime.strptime(date_filter, '%Y-%m-%d').date()
            query = query.filter_by(appointment_date=filter_date)
        except ValueError:
            pass
    
    # Get appointments
    appointments = query.order_by(Appointment.appointment_date, Appointment.appointment_time).all()
    
    result = []
    for apt in appointments:
        # Get patient details
        patient = Patient.query.get(apt.patient_id)
        if not patient:
            continue
            
        user = User.query.get(patient.user_id)
        
        # Format time properly
        appointment_time = apt.appointment_time
        if appointment_time:
            try:
                # Handle different time formats
                if isinstance(appointment_time, str):
                    appointment_time = datetime.strptime(appointment_time, '%H:%M:%S').time()
                formatted_time = appointment_time.strftime('%I:%M %p')
            except:
                formatted_time = 'N/A'
        else:
            formatted_time = 'N/A'
        
        result.append({
            'appointment_id': apt.appointment_id,
            'date': apt.appointment_date.strftime('%Y-%m-%d') if apt.appointment_date else None,
            'time': formatted_time,
            'patient_id': apt.patient_id,
            'patient_name': f"{user.f_name} {user.l_name}" if user else 'Unknown',
            'reason': apt.reason or 'Follow-up',
            'notes': apt.notes or '',
            'status': apt.status or 'scheduled',
            'appointment_type': apt.appointment_type or 'Consultation',
            'duration_minutes': apt.duration_minutes or 30,
            'created_at': apt.created_at.isoformat() if apt.created_at else None
        })
    
    return jsonify(result), 200

# 10. GET TODAY'S APPOINTMENTS (SPECIAL ENDPOINT)
@doctor_bp.route('/appointments/today', methods=['GET'])
@jwt_required()
def get_todays_appointments():
    doctor = get_current_doctor()
    if not doctor:
        return jsonify({'error': 'Doctor access required'}), 403
    
    today = date.today()
    
    # Get today's appointments
    appointments = Appointment.query.filter(
        Appointment.staff_id == doctor.staff_id,
        Appointment.appointment_date == today
    ).order_by(Appointment.appointment_time).all()
    
    result = []
    for apt in appointments:
        patient = Patient.query.get(apt.patient_id)
        if not patient:
            continue
            
        user = User.query.get(patient.user_id)
        
        # Format time
        appointment_time = apt.appointment_time
        if appointment_time:
            try:
                if isinstance(appointment_time, str):
                    appointment_time = datetime.strptime(appointment_time, '%H:%M:%S').time()
                formatted_time = appointment_time.strftime('%I:%M %p')
            except:
                formatted_time = 'N/A'
        else:
            formatted_time = 'N/A'
        
        result.append({
            'id': apt.appointment_id,
            'appointment_id': apt.appointment_id,
            'date': today.strftime('%Y-%m-%d'),
            'time': formatted_time,
            'patient_id': apt.patient_id,
            'patient_name': f"{user.f_name} {user.l_name}" if user else 'Unknown',
            'reason': apt.reason or 'Follow-up',
            'notes': apt.notes or '',
            'status': apt.status or 'scheduled',
            'appointment_type': apt.appointment_type or 'Consultation'
        })
    
    return jsonify(result), 200

# 3. GET SCANS (DICOM scans)
@doctor_bp.route('/scans', methods=['GET'])
@jwt_required()
def get_scans():
    doctor = get_current_doctor()
    if not doctor:
        return jsonify({'error': 'Doctor access required'}), 403
    
    # Get query parameters
    patient_id = request.args.get('patient_id')
    status = request.args.get('status', 'pending')
    
    # Build query
    query = DicomScan.query
    
    # Filter by patient if specified
    if patient_id:
        query = query.filter_by(patient_id=patient_id)
    
    # Filter by status
    query = query.filter_by(status=status)
    
    # Get scans
    scans = query.order_by(DicomScan.scan_date.desc()).all()
    
    result = []
    for scan in scans:
        # Get patient details
        patient = Patient.query.get(scan.patient_id)
        user = User.query.get(patient.user_id) if patient else None
        
        # Get referring doctor (staff)
        referring_doctor = Staff.query.get(scan.staff_id)
        referring_user = User.query.get(referring_doctor.user_id) if referring_doctor else None
        
        # Get radiologist details
        radiologist = Staff.query.get(scan.radiologist_id) if scan.radiologist_id else None
        radiologist_user = User.query.get(radiologist.user_id) if radiologist else None
        
        # Get scan result if exists
        scan_result = ScanResult.query.filter_by(scan_id=scan.scan_id).first()
        
        result.append({
            'scan_id': scan.scan_id,
            'patient_id': scan.patient_id,
            'patient_name': f"{user.f_name} {user.l_name}" if user else 'Unknown',
            'patient_age': calculate_age(user.birth_date) if user and user.birth_date else None,
            'patient_gender': user.gender.value if user else None,
            'scan_type': scan.scan_type,
            'body_part': scan.body_part,
            'modality': scan.modality,
            'scan_date': scan.scan_date.strftime('%Y-%m-%d') if scan.scan_date else None,
            'description': scan.description,
            'status': scan.status,
            'radiologist': f"{radiologist_user.f_name} {radiologist_user.l_name}" if radiologist_user else 'Not Assigned',
            'referring_doctor': f"{referring_user.f_name} {referring_user.l_name}" if referring_user else 'Unknown',
            'folder_path': scan.folder_path,
            'rad_report': scan.rad_report,
            'ai_confidence': scan_result.confidence_score if scan_result else None,
            'ai_recommendations': scan_result.ai_recommendations if scan_result else None,
            'doctor_notes': scan_result.doctor_notes if scan_result else None,
            'final_diagnosis': scan_result.final_diagnosis if scan_result else None,
            'is_verified': scan_result.is_verified if scan_result else False
        })
    
    return jsonify(result), 200

# Helper function to calculate age from birth date
def calculate_age(birth_date):
    if not birth_date:
        return None
    today = date.today()
    return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))

# 4. GET PROFILE
@doctor_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    doctor = get_current_doctor()
    if not doctor:
        return jsonify({'error': 'Doctor access required'}), 403
    
    # Get user details
    user = User.query.get(doctor.user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Get doctor's patients count
    patients_count = db.session.query(Patient).join(Appointment).filter(
        Appointment.staff_id == doctor.staff_id
    ).distinct().count()
    
    # Get appointments this month
    current_month = datetime.utcnow().month
    current_year = datetime.utcnow().year
    
    appointments_this_month = Appointment.query.filter(
        Appointment.staff_id == doctor.staff_id,
        db.extract('month', Appointment.created_at) == current_month,
        db.extract('year', Appointment.created_at) == current_year
    ).count()
    
    # Get scans made this month
    scans_this_month = DicomScan.query.filter(
        DicomScan.staff_id == doctor.staff_id,
        db.extract('month', DicomScan.uploaded_at) == current_month,
        db.extract('year', DicomScan.uploaded_at) == current_year
    ).count()
    
    profile_data = {
        'user_id': user.user_id,
        'username': user.username,
        'email': user.email,
        'f_name': user.f_name,
        'l_name': user.l_name,
        'full_name': f"{user.f_name} {user.l_name}",
        'profile_image': user.profile_image,
        'phone': user.phone,
        'address': user.address,
        'birth_date': user.birth_date.strftime('%Y-%m-%d') if user.birth_date else None,
        'gender': user.gender.value if user.gender else None,
        'role': user.role.value,
        'is_active': user.is_active,
        'last_login': user.last_login.isoformat() if user.last_login else None,
        'created_at': user.created_at.isoformat() if user.created_at else None,
        'doctor_info': {
            'staff_id': doctor.staff_id,
            'license_number': doctor.license_number,
            'department': doctor.department,
            'professional_title': doctor.department,  # Using department as title
            'hire_date': doctor.hire_date.strftime('%Y-%m-%d') if doctor.hire_date else None,
            'phone': doctor.phone,
            'f_name': doctor.f_name,
            'l_name': doctor.l_name
        },
        'statistics': {
            'total_patients': patients_count,
            'appointments_this_month': appointments_this_month,
            'scans_this_month': scans_this_month
        }
    }
    
    return jsonify(profile_data), 200

# 5. UPDATE PROFILE (phone, address, password)
@doctor_bp.route('/profile/update', methods=['PUT'])
@jwt_required()
def update_profile():
    doctor = get_current_doctor()
    if not doctor:
        return jsonify({'error': 'Doctor access required'}), 403
    
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Get user
    user = User.query.get(doctor.user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    update_fields = []
    
    # Update phone if provided
    if 'phone' in data:
        user.phone = data['phone']
        doctor.phone = data['phone']
        update_fields.append('phone')
    
    # Update address if provided
    if 'address' in data:
        user.address = data['address']
        update_fields.append('address')
    
    # Update password if provided (requires current password verification)
    if 'current_password' in data and 'new_password' in data:
        current_password = data['current_password']
        new_password = data['new_password']
        
        # Verify current password
        if not check_password_hash(user.password_hash, current_password):
            return jsonify({'error': 'Current password is incorrect'}), 400
        
        # Update to new password
        user.password_hash = generate_password_hash(new_password)
        update_fields.append('password')
    
    try:
        db.session.commit()
        return jsonify({
            'message': 'Profile updated successfully',
            'updated_fields': update_fields
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update profile: {str(e)}'}), 500

# 6. UPLOAD PROFILE PICTURE (UPDATED TO MATCH RADIOLOGIST)
@doctor_bp.route('/profile/upload-picture', methods=['POST'])
@jwt_required()
def upload_profile_picture():
    doctor = get_current_doctor()
    if not doctor:
        return jsonify({'error': 'Doctor access required'}), 403
    
    # Check if file is in request
    if 'image' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['image']
    
    # Check if file is selected
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Check file type
    if not allowed_file(file.filename, ALLOWED_IMAGE_EXTENSIONS):
        return jsonify({'error': f'Allowed file types: {", ".join(ALLOWED_IMAGE_EXTENSIONS)}'}), 400
    
    # Ensure upload folder exists
    upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
    os.makedirs(upload_folder, exist_ok=True)
    
    # Get file extension
    ext = file.filename.rsplit('.', 1)[1].lower()
    
    # Use consistent naming: doctor_{user_id}.{ext}
    filename = secure_filename(f"doctor_{doctor.user_id}.{ext}")
    filepath = os.path.join(upload_folder, filename)
    
    # Get user
    user = User.query.get(doctor.user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Remove old image if exists
    if user.profile_image:
        old_filename = os.path.basename(user.profile_image)
        old_filepath = os.path.join(upload_folder, old_filename)
        if os.path.exists(old_filepath):
            try:
                os.remove(old_filepath)
            except:
                pass
    
    # Save new file
    file.save(filepath)
    
    # Store filename only (not full path)
    user.profile_image = filename
    
    try:
        db.session.commit()
        return jsonify({
            'message': 'Profile image uploaded successfully',
            'profile_image': user.profile_image
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update profile image: {str(e)}'}), 500

# Serve Profile Images
@doctor_bp.route('/profile_images/<filename>')
def serve_profile_image(filename):
    upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
    return send_from_directory(upload_folder, filename)
# 7. UPLOAD DIGITAL SIGNATURE (UPDATED)
@doctor_bp.route('/profile/upload-signature', methods=['POST'])
@jwt_required()
def upload_signature():
    doctor = get_current_doctor()
    if not doctor:
        return jsonify({'error': 'Doctor access required'}), 403
    
    if 'image' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Check file type
    if not allowed_file(file.filename, ALLOWED_SIGNATURE_EXTENSIONS):
        return jsonify({'error': f'Allowed file types: {", ".join(ALLOWED_SIGNATURE_EXTENSIONS)}'}), 400
    
    # Ensure upload folder exists
    upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
    os.makedirs(upload_folder, exist_ok=True)
    
    # Get file extension
    ext = file.filename.rsplit('.', 1)[1].lower()
    
    # Use consistent naming: signature_{user_id}.{ext}
    filename = secure_filename(f"signature_{doctor.user_id}.{ext}")
    filepath = os.path.join(upload_folder, filename)
    
    # Save file
    file.save(filepath)
    
    return jsonify({
        'message': 'Signature uploaded successfully',
        'profile_image': filename  # Consistent naming with profile image
    }), 200

# 8. UPDATE SIGNATURE IN DATABASE
@doctor_bp.route('/profile/update-signature', methods=['PUT'])
@jwt_required()
def update_signature_in_db():
    doctor = get_current_doctor()
    if not doctor:
        return jsonify({'error': 'Doctor access required'}), 403
    
    data = request.get_json()
    
    if not data or 'signature_path' not in data:
        return jsonify({'error': 'Signature path is required'}), 400
    
    # Get user
    user = User.query.get(doctor.user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Store signature path in user table (add this column to your User model)
    # Or store in a separate doctor_signature table
    user.digital_signature = data['signature_path']
    
    try:
        db.session.commit()
        return jsonify({
            'message': 'Signature saved successfully',
            'signature_url': data['signature_path']
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to save signature: {str(e)}'}), 500
    
# 8. GET PATIENT LIST
@doctor_bp.route('/patients', methods=['GET'])
@jwt_required()
def get_patients():
    doctor = get_current_doctor()
    if not doctor:
        return jsonify({'error': 'Doctor access required'}), 403
    
    # Get search parameters
    search = request.args.get('search', '')
    
    # Query patients who have appointments with this doctor
    patients_query = db.session.query(Patient).join(Appointment).filter(
        Appointment.staff_id == doctor.staff_id
    ).distinct()
    
    if search:
        patients_query = patients_query.join(User).filter(
            db.or_(
                User.f_name.ilike(f'%{search}%'),
                User.l_name.ilike(f'%{search}%'),
                Patient.patient_id.ilike(f'%{search}%')
            )
        )
    
    patients = patients_query.all()
    
    result = []
    for patient in patients:
        user = User.query.get(patient.user_id)
        
        if user:
            # Get last appointment
            last_appointment = Appointment.query.filter_by(
                patient_id=patient.patient_id,
                staff_id=doctor.staff_id
            ).order_by(Appointment.appointment_date.desc()).first()
            
            # Get next appointment
            next_appointment = Appointment.query.filter(
                Appointment.patient_id == patient.patient_id,
                Appointment.staff_id == doctor.staff_id,
                Appointment.status == 'scheduled',
                Appointment.appointment_date >= date.today()
            ).order_by(Appointment.appointment_date.asc()).first()
            
            # Get diagnosis from latest visit record
            latest_record = VisitRecord.query.filter_by(
                patient_id=patient.patient_id,
                staff_id=doctor.staff_id
            ).order_by(VisitRecord.created_at.desc()).first()
            
            result.append({
                'patient_id': patient.patient_id,
                'patient_name': f"{user.f_name} {user.l_name}",
                'age': calculate_age(user.birth_date),
                'gender': user.gender.value if user.gender else None,
                'blood_type': patient.blood_type,
                'allergies': patient.allergies,
                'diagnosis': latest_record.diagnosis if latest_record else 'No diagnosis recorded',
                'last_visit_date': last_appointment.appointment_date.strftime('%Y-%m-%d') if last_appointment else None,
                'next_visit_date': next_appointment.appointment_date.strftime('%Y-%m-%d') if next_appointment else 'Pending',
                'phone': user.phone,
                'email': user.email,
                'registration_date': patient.registration_date.strftime('%Y-%m-%d') if patient.registration_date else None
            })
    
    return jsonify(result), 200

# 9. GET PATIENT DETAILS
@doctor_bp.route('/patient/<int:patient_id>', methods=['GET'])
@jwt_required()
def get_patient_details(patient_id):
    doctor = get_current_doctor()
    if not doctor:
        return jsonify({'error': 'Doctor access required'}), 403
    
    # Check if doctor has access to this patient
    has_access = Appointment.query.filter_by(
        staff_id=doctor.staff_id,
        patient_id=patient_id
    ).first()
    
    if not has_access:
        return jsonify({'error': 'Patient not found or access denied'}), 404
    
    # Get patient
    patient = Patient.query.get(patient_id)
    if not patient:
        return jsonify({'error': 'Patient not found'}), 404
    
    user = User.query.get(patient.user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Get visit records
    visit_records = VisitRecord.query.filter_by(
        patient_id=patient_id,
        staff_id=doctor.staff_id
    ).order_by(VisitRecord.created_at.desc()).all()
    
    # Get medications
    medications = Medication.query.filter_by(
        patient_id=patient_id
    ).order_by(Medication.start_date.desc()).all()
    
    # Get scans
    scans = DicomScan.query.filter_by(
        patient_id=patient_id
    ).order_by(DicomScan.scan_date.desc()).all()
    
    # Build response
    patient_data = {
        'patient_id': patient.patient_id,
        'patient_name': f"{user.f_name} {user.l_name}",
        'age': calculate_age(user.birth_date),
        'gender': user.gender.value if user.gender else None,
        'birth_date': user.birth_date.strftime('%Y-%m-%d') if user.birth_date else None,
        'blood_type': patient.blood_type,
        'allergies': patient.allergies,
        'chronic_conditions': patient.chronic_conditions,
        'insurance_provider': patient.insurance_provider,
        'emergency_contact': {
            'name': patient.emergency_contact_name,
            'phone': patient.emergency_contact_phone
        },
        'phone': user.phone,
        'email': user.email,
        'address': user.address,
        'registration_date': patient.registration_date.strftime('%Y-%m-%d') if patient.registration_date else None,
        'visit_records': [],
        'medications': [],
        'scans': []
    }
    
    # Add visit records
    for record in visit_records:
        patient_data['visit_records'].append({
            'record_id': record.record_id,
            'date': record.created_at.strftime('%Y-%m-%d'),
            'chief_complaint': record.chief_complaint,
            'diagnosis': record.diagnosis,
            'treatment_plan': record.treatment_plan,
            'vital_signs': record.vital_signs,
            'physical_examination': record.physical_examination,
            'notes': record.notes
        })
    
    # Add medications
    for med in medications:
        patient_data['medications'].append({
            'medication_id': med.medication_id,
            'medication_name': med.medication_name,
            'dosage': med.dosage,
            'frequency': med.frequency,
            'duration': med.duration,
            'instructions': med.instructions,
            'start_date': med.start_date.strftime('%Y-%m-%d') if med.start_date else None,
            'end_date': med.end_date.strftime('%Y-%m-%d') if med.end_date else None,
            'is_active': med.is_active
        })
    
    # Add scans
    for scan in scans:
        scan_result = ScanResult.query.filter_by(scan_id=scan.scan_id).first()
        
        patient_data['scans'].append({
            'scan_id': scan.scan_id,
            'scan_type': scan.scan_type,
            'body_part': scan.body_part,
            'modality': scan.modality,
            'scan_date': scan.scan_date.strftime('%Y-%m-%d') if scan.scan_date else None,
            'status': scan.status,
            'description': scan.description,
            'radiologist_report': scan.rad_report,
            'folder_path': scan.folder_path,
            'ai_confidence': scan_result.confidence_score if scan_result else None,
            'doctor_notes': scan_result.doctor_notes if scan_result else None,
            'is_verified': scan_result.is_verified if scan_result else False
        })
    
    return jsonify(patient_data), 200

# 10. UPDATE SCAN RESULT/REPORT
@doctor_bp.route('/scan/<int:scan_id>/report', methods=['PUT'])
@jwt_required()
def update_scan_report(scan_id):
    doctor = get_current_doctor()
    if not doctor:
        return jsonify({'error': 'Doctor access required'}), 403
    
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Get scan
    scan = DicomScan.query.get(scan_id)
    if not scan:
        return jsonify({'error': 'Scan not found'}), 404
    
    # Check if doctor has access (either referring doctor or assigned)
    if scan.staff_id != doctor.staff_id and scan.radiologist_id != doctor.staff_id:
        return jsonify({'error': 'Access denied to this scan'}), 403
    
    # Update scan report
    if 'rad_report' in data:
        scan.rad_report = data['rad_report']
    
    if 'status' in data:
        scan.status = data['status']
    
    # Update or create scan result
    scan_result = ScanResult.query.filter_by(scan_id=scan_id).first()
    
    if not scan_result:
        scan_result = ScanResult(
            scan_id=scan_id,
            staff_id=doctor.staff_id,
            processed_at=datetime.utcnow()
        )
        db.session.add(scan_result)
    
    # Update scan result fields
    if 'doctor_notes' in data:
        scan_result.doctor_notes = data['doctor_notes']
    
    if 'final_diagnosis' in data:
        scan_result.final_diagnosis = data['final_diagnosis']
    
    if 'is_verified' in data:
        scan_result.is_verified = data['is_verified']
        if data['is_verified']:
            scan_result.verified_at = datetime.utcnow()
    
    if 'ai_recommendations' in data:
        scan_result.ai_recommendations = data['ai_recommendations']
    
    if 'cdss_result' in data:
        scan_result.cdss_result = data['cdss_result']
    
    try:
        db.session.commit()
        return jsonify({
            'message': 'Scan report updated successfully',
            'scan_id': scan_id,
            'status': scan.status,
            'is_verified': scan_result.is_verified
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update scan report: {str(e)}'}), 500

# 11. CREATE VISIT RECORD
@doctor_bp.route('/patient/<int:patient_id>/visit-record', methods=['POST'])
@jwt_required()
def create_visit_record(patient_id):
    doctor = get_current_doctor()
    if not doctor:
        return jsonify({'error': 'Doctor access required'}), 403
    
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Check if doctor has access to this patient
    has_access = Appointment.query.filter_by(
        staff_id=doctor.staff_id,
        patient_id=patient_id
    ).first()
    
    if not has_access:
        return jsonify({'error': 'Patient not found or access denied'}), 404
    
    # Get current appointment if any
    appointment_id = data.get('appointment_id')
    
    # Create visit record
    visit_record = VisitRecord(
        patient_id=patient_id,
        staff_id=doctor.staff_id,
        appointment_id=appointment_id,
        chief_complaint=data.get('chief_complaint'),
        diagnosis=data.get('diagnosis'),
        treatment_plan=data.get('treatment_plan'),
        vital_signs=data.get('vital_signs'),
        physical_examination=data.get('physical_examination'),
        notes=data.get('notes')
    )
    
    try:
        db.session.add(visit_record)
        db.session.commit()
        
        return jsonify({
            'message': 'Visit record created successfully',
            'record_id': visit_record.record_id,
            'date': visit_record.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create visit record: {str(e)}'}), 500

# 12. PRESCRIBE MEDICATION
@doctor_bp.route('/patient/<int:patient_id>/medication', methods=['POST'])
@jwt_required()
def prescribe_medication(patient_id):
    doctor = get_current_doctor()
    if not doctor:
        return jsonify({'error': 'Doctor access required'}), 403
    
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Check required fields
    required_fields = ['medication_name', 'dosage']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400
    
    # Check if doctor has access to this patient
    has_access = Appointment.query.filter_by(
        staff_id=doctor.staff_id,
        patient_id=patient_id
    ).first()
    
    if not has_access:
        return jsonify({'error': 'Patient not found or access denied'}), 404
    
    # Get current visit record if available
    record_id = data.get('record_id')
    
    # Create medication
    medication = Medication(
        patient_id=patient_id,
        staff_id=doctor.staff_id,
        record_id=record_id,
        medication_name=data['medication_name'],
        dosage=data['dosage'],
        frequency=data.get('frequency'),
        duration=data.get('duration'),
        instructions=data.get('instructions'),
        start_date=datetime.strptime(data['start_date'], '%Y-%m-%d').date() if 'start_date' in data else date.today(),
        end_date=datetime.strptime(data['end_date'], '%Y-%m-%d').date() if 'end_date' in data else None,
        is_active=data.get('is_active', True)
    )
    
    try:
        db.session.add(medication)
        db.session.commit()
        
        return jsonify({
            'message': 'Medication prescribed successfully',
            'medication_id': medication.medication_id,
            'medication_name': medication.medication_name
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to prescribe medication: {str(e)}'}), 500

# 13. ORDER NEW SCAN
@doctor_bp.route('/patient/<int:patient_id>/scan', methods=['POST'])
@jwt_required()
def order_scan(patient_id):
    doctor = get_current_doctor()
    if not doctor:
        return jsonify({'error': 'Doctor access required'}), 403
    
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Check required fields
    required_fields = ['scan_type', 'body_part', 'modality']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400
    
    # Check if doctor has access to this patient
    has_access = Appointment.query.filter_by(
        staff_id=doctor.staff_id,
        patient_id=patient_id
    ).first()
    
    if not has_access:
        return jsonify({'error': 'Patient not found or access denied'}), 404
    
    # Get current record if available
    record_id = data.get('record_id')
    
    # Create scan order
    scan = DicomScan(
        patient_id=patient_id,
        staff_id=doctor.staff_id,
        record_id=record_id,
        scan_type=data['scan_type'],
        body_part=data['body_part'],
        modality=data['modality'],
        description=data.get('description'),
        scan_date=date.today(),
        status='pending',
        folder_path=data.get('folder_path')  # Will be populated when images are uploaded
    )
    
    try:
        db.session.add(scan)
        db.session.commit()
        
        return jsonify({
            'message': 'Scan ordered successfully',
            'scan_id': scan.scan_id,
            'scan_type': scan.scan_type,
            'status': scan.status
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to order scan: {str(e)}'}), 500

# 14. UPDATE APPOINTMENT STATUS
@doctor_bp.route('/appointment/<int:appointment_id>/status', methods=['PUT'])
@jwt_required()
def update_appointment_status(appointment_id):
    doctor = get_current_doctor()
    if not doctor:
        return jsonify({'error': 'Doctor access required'}), 403
    
    data = request.get_json()
    
    if not data or 'status' not in data:
        return jsonify({'error': 'Status is required'}), 400
    
    # Get appointment
    appointment = Appointment.query.get(appointment_id)
    if not appointment:
        return jsonify({'error': 'Appointment not found'}), 404
    
    # Check if appointment belongs to this doctor
    if appointment.staff_id != doctor.staff_id:
        return jsonify({'error': 'Access denied to this appointment'}), 403
    
    # Update status
    appointment.status = data['status']
    
    # Add notes if provided
    if 'notes' in data:
        appointment.notes = data['notes']
    
    try:
        db.session.commit()
        return jsonify({
            'message': 'Appointment status updated successfully',
            'appointment_id': appointment_id,
            'status': appointment.status
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update appointment status: {str(e)}'}), 500

# 15. LOGOUT (client-side token removal)
@doctor_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # JWT tokens are stateless, so logout is handled client-side
    # by removing the token from localStorage
    return jsonify({'message': 'Logout successful'}), 200

# 16. DASHBOARD STATISTICS
@doctor_bp.route('/dashboard/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    doctor = get_current_doctor()
    if not doctor:
        return jsonify({'error': 'Doctor access required'}), 403
    
    # Get current date
    today = date.today()
    
    # Today's appointments
    todays_appointments = Appointment.query.filter(
        Appointment.staff_id == doctor.staff_id,
        Appointment.appointment_date == today
    ).count()
    
    # Pending scans
    pending_scans = DicomScan.query.filter(
        DicomScan.staff_id == doctor.staff_id,
        DicomScan.status == 'pending'
    ).count()
    
    # Total patients
    total_patients = db.session.query(Patient).join(Appointment).filter(
        Appointment.staff_id == doctor.staff_id
    ).distinct().count()
    
    # This month's appointments
    month_start = today.replace(day=1)
    this_month_appointments = Appointment.query.filter(
        Appointment.staff_id == doctor.staff_id,
        Appointment.appointment_date >= month_start
    ).count()
    
    stats = {
        'todays_appointments': todays_appointments,
        'pending_scans': pending_scans,
        'total_patients': total_patients,
        'this_month_appointments': this_month_appointments,
        'date': today.strftime('%Y-%m-%d')
    }
    
    return jsonify(stats), 200

# Add this at the end of doctor_routes.py
@doctor_bp.route('/test', methods=['GET'])
def test():
    return jsonify({'message': 'Doctor routes working!'}), 200