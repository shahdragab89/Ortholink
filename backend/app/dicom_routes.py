# backend/app/dicom_routes.py
from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.orm import joinedload
import os
from .extensions import db
from .models.user import User
from .models.staff import Staff
from .models.patient import Patient
from .models.dicom_scan import DicomScan
from .models.scans_results import ScanResult
from datetime import datetime

dicom_bp = Blueprint('dicom', __name__, url_prefix='/api/dicom')

@dicom_bp.route('/test', methods=['GET'])
def test_route():
    """Test route to check if blueprint is working"""
    return jsonify({
        "success": True,
        "message": "DICOM routes are working",
        "test": "OK"
    })

@dicom_bp.route('/patient-data/<int:patient_id>', methods=['GET'])
@jwt_required()
def get_patient_dicom_data(patient_id):
    """Get DICOM data for a specific patient"""
    try:
        print(f"🔍 Debug: Starting get_patient_dicom_data for patient_id={patient_id}")
        
        # Get current user
        current_user_id = get_jwt_identity()
        print(f"🔍 Debug: Current user ID: {current_user_id}")
        
        current_user = User.query.get(current_user_id)
        
        if not current_user:
            print("🔍 Debug: User not found")
            return jsonify({"error": "User not found"}), 401
        
        print(f"🔍 Debug: User found: {current_user.username}")
        
        # Find patient
        patient = Patient.query.filter_by(patient_id=patient_id).first()
        
        if not patient:
            print(f"🔍 Debug: Patient with ID {patient_id} not found in database")
            # Check what patients exist
            all_patients = Patient.query.all()
            print(f"🔍 Debug: Available patient IDs: {[p.patient_id for p in all_patients]}")
            return jsonify({"error": f"Patient {patient_id} not found"}), 404
        
        print(f"🔍 Debug: Patient found: {patient.patient_id}")
        
        # Get patient's user info
        patient_user = User.query.get(patient.user_id)
        
        if not patient_user:
            print(f"🔍 Debug: User for patient {patient_id} not found")
            return jsonify({"error": "Patient user info not found"}), 404
        
        print(f"🔍 Debug: Patient user found: {patient_user.f_name} {patient_user.l_name}")
        
        # Get patient's DICOM scans
        scans = DicomScan.query.filter_by(patient_id=patient_id).all()
        print(f"🔍 Debug: Found {len(scans)} scans for patient")
        
        # Format scan data
        formatted_scans = []
        for scan in scans:
            scan_result = ScanResult.query.filter_by(scan_id=scan.scan_id).first()
            
            scan_data = {
                "scan_id": scan.scan_id,
                "scan_type": scan.scan_type or "Unknown",
                "body_part": scan.body_part or "Unknown",
                "modality": scan.modality or "CT",
                "scan_date": scan.scan_date.strftime('%Y-%m-%d') if scan.scan_date else None,
                "description": scan.description,
                "status": scan.status or "pending",
                "folder_path": scan.folder_path,
                "has_files": bool(scan.folder_path),
                "rad_report": scan.rad_report
            }
            
            if scan_result:
                scan_data.update({
                    "confidence_score": scan_result.confidence_score,
                    "ai_recommendations": scan_result.ai_recommendations,
                    "cdss_result": scan_result.cdss_result,
                    "doctor_notes": scan_result.doctor_notes,
                    "final_diagnosis": scan_result.final_diagnosis,
                    "is_verified": scan_result.is_verified
                })
            
            formatted_scans.append(scan_data)
        
        # Group scans by series type
        series_data = []
        scan_types = set([scan.get("scan_type", "General") for scan in formatted_scans])
        
        for scan_type in scan_types:
            scans_of_type = [s for s in formatted_scans if s.get("scan_type") == scan_type]
            if scans_of_type:
                series_data.append({
                    "id": len(series_data) + 1,
                    "name": f"{scan_type} - {scans_of_type[0].get('body_part', 'Unknown')}",
                    "count": len(scans_of_type),
                    "type": scans_of_type[0].get("modality", "CT"),
                    "scans": scans_of_type
                })
        
        # If no real scans, provide mock series data
        if not series_data:
            print("🔍 Debug: No scans found, using mock data")
            series_data = [
                {
                    "id": 1,
                    "name": 'Coronal View - Knee',
                    "count": 1,
                    "type": 'MRI',
                    "scans": [{"scan_id": 1, "body_part": "Knee", "modality": "MRI"}]
                },
                {
                    "id": 2,
                    "name": 'Axial View - Knee',
                    "count": 120,
                    "type": 'CT',
                    "scans": [{"scan_id": 2, "body_part": "Knee", "modality": "CT"}]
                },
                {
                    "id": 3,
                    "name": 'Sagittal View - Knee',
                    "count": 85,
                    "type": 'MRI',
                    "scans": [{"scan_id": 3, "body_part": "Knee", "modality": "MRI"}]
                }
            ]
        
        # Get patient info
        patient_info = {
            "patient_id": f"P-{patient.patient_id}",
            "patient_name": f"{patient_user.f_name or ''} {patient_user.l_name or ''}".strip() or "Unknown Patient",
            "age": calculate_age(patient_user.birth_date) if patient_user.birth_date else 'N/A',
            "gender": patient_user.gender.value if hasattr(patient_user.gender, 'value') else str(patient_user.gender) if patient_user.gender else 'N/A',
            "blood_type": patient.blood_type or 'Unknown',
            "allergies": patient.allergies or 'None',
            "diagnosis": get_latest_diagnosis(patient_id) or "No diagnosis recorded",
            "modality": formatted_scans[0].get("modality", "CT") if formatted_scans else "CT",
            "body_part": formatted_scans[0].get("body_part", "Knee") if formatted_scans else "Knee"
        }
        
        print(f"🔍 Debug: Patient info prepared: {patient_info['patient_name']}")
        
        # Get CDSS data if available
        cdss_data = {
            "overallConfidence": 94,
            "findings": [
                {"id": 1, "title": 'Grade 3 Pivot Shift Injury', "confidence": 96},
                {"id": 2, "title": 'Complete ACL tear (mid-substance)', "confidence": 94},
                {"id": 3, "title": 'Medial Meniscal Pathology', "confidence": 88},
            ],
            "summary": 'MRI findings are consistent with a high-grade pivot shift injury pattern.',
            "recommendations": 'Surgical reconstruction of ACL recommended.',
            "differential": 'Partial ACL tear, tibial spine avulsion, isolated MCL injury.'
        }
        
        response_data = {
            "success": True,
            "patient": patient_info,
            "series": series_data,
            "scans": formatted_scans,
            "cdss_data": cdss_data,
            "debug": {
                "patient_id": patient_id,
                "has_scans": len(formatted_scans) > 0,
                "has_series": len(series_data) > 0
            }
        }
        
        print(f"🔍 Debug: Response prepared successfully")
        return jsonify(response_data)
        
    except Exception as e:
        import traceback
        print(f"❌ Error in get_patient_dicom_data: {str(e)}")
        print(f"❌ Traceback: {traceback.format_exc()}")
        return jsonify({
            "error": str(e),
            "traceback": traceback.format_exc()
        }), 500

@dicom_bp.route('/scan-files/<int:scan_id>', methods=['GET'])
@jwt_required()
def get_scan_files(scan_id):
    """Get list of files for a specific scan"""
    try:
        scan = DicomScan.query.get(scan_id)
        
        if not scan:
            return jsonify({"error": "Scan not found"}), 404
        
        if not scan.folder_path:
            return jsonify({"files": []})
        
        # Mock file list - in real implementation, you'd scan the directory
        # and return actual DICOM files
        files = []
        
        # This is a mock - in production, you'd use:
        # import os
        # scan_dir = os.path.join('uploads', 'dicom_scans', scan.folder_path)
        # if os.path.exists(scan_dir):
        #     files = [f for f in os.listdir(scan_dir) if f.lower().endswith('.dcm')]
        
        # For now, return mock files based on scan type
        if scan.modality == 'CT':
            files = ["axial_001.dcm", "axial_002.dcm", "axial_003.dcm"]
        elif scan.modality == 'MRI':
            files = ["sagittal_001.dcm", "sagittal_002.dcm", "coronal_001.dcm"]
        else:
            files = ["image_001.dcm", "image_002.dcm"]
        
        return jsonify({
            "success": True,
            "scan_id": scan_id,
            "files": files,
            "folder_path": scan.folder_path
        })
        
    except Exception as e:
        print(f"Error in get_scan_files: {str(e)}")
        return jsonify({"error": str(e)}), 500

@dicom_bp.route('/dicom-image/<int:scan_id>/<path:filename>', methods=['GET'])
def get_dicom_image(scan_id, filename):
    """Serve DICOM image file"""
    try:
        scan = DicomScan.query.get(scan_id)
        
        if not scan or not scan.folder_path:
            # Return placeholder image
            return send_file('static/placeholder.jpg', mimetype='image/jpeg')
        
        # In production, you'd serve the actual DICOM file
        # file_path = os.path.join('uploads', 'dicom_scans', scan.folder_path, filename)
        # if os.path.exists(file_path):
        #     return send_file(file_path)
        
        # For now, return placeholder based on modality
        if 'axial' in filename.lower():
            return send_file('static/axial_placeholder.jpg', mimetype='image/jpeg')
        elif 'sagittal' in filename.lower():
            return send_file('static/sagittal_placeholder.jpg', mimetype='image/jpeg')
        elif 'coronal' in filename.lower():
            return send_file('static/coronal_placeholder.jpg', mimetype='image/jpeg')
        else:
            return send_file('static/placeholder.jpg', mimetype='image/jpeg')
            
    except Exception as e:
        print(f"Error serving DICOM image: {str(e)}")
        return send_file('static/placeholder.jpg', mimetype='image/jpeg')
@dicom_bp.route('/update-cdss/<int:scan_id>', methods=['PUT'])
@jwt_required()
def update_cdss_data(scan_id):
    """Update CDSS findings for a scan"""
    try:
        data = request.json
        print(f"🔍 Debug: Updating CDSS for scan_id={scan_id}")
        print(f"🔍 Debug: Received data: {data}")
        
        # Get scan and verify it exists
        scan = DicomScan.query.get(scan_id)
        
        if not scan:
            print(f"❌ Error: Scan {scan_id} not found")
            return jsonify({"error": f"Scan {scan_id} not found"}), 404
        
        print(f"🔍 Debug: Found scan for patient_id={scan.patient_id}")
        
        # Get or create scan result
        scan_result = ScanResult.query.filter_by(scan_id=scan_id).first()
        if not scan_result:
            scan_result = ScanResult(scan_id=scan_id)
            db.session.add(scan_result)
            print(f"🔍 Debug: Created new ScanResult for scan_id={scan_id}")
        else:
            print(f"🔍 Debug: Found existing ScanResult (result_id={scan_result.result_id})")
        
        # Update current user as the staff who verified
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if current_user and current_user.staff:
            scan_result.staff_id = current_user.staff.staff_id
            print(f"🔍 Debug: Set staff_id to {current_user.staff.staff_id}")
        
        # Update fields from request
        if 'doctor_notes' in data:
            scan_result.doctor_notes = data['doctor_notes']
            print(f"🔍 Debug: Updated doctor_notes")
        
        if 'final_diagnosis' in data:
            scan_result.final_diagnosis = data['final_diagnosis']
            print(f"🔍 Debug: Updated final_diagnosis")
        
        if 'ai_recommendations' in data:
            scan_result.ai_recommendations = data['ai_recommendations']
            print(f"🔍 Debug: Updated ai_recommendations")
        
        if 'cdss_result' in data:
            scan_result.cdss_result = data['cdss_result']
            print(f"🔍 Debug: Updated cdss_result")
        
        if 'confidence_score' in data:
            scan_result.confidence_score = data['confidence_score']
            print(f"🔍 Debug: Updated confidence_score to {data['confidence_score']}")
        
        # Set verification status
        is_verified = data.get('is_verified', scan_result.is_verified)
        scan_result.is_verified = is_verified
        
        if is_verified:
            scan_result.verified_at = datetime.utcnow()
            print(f"🔍 Debug: Set verified_at to {scan_result.verified_at}")
        
        scan_result.processed_at = datetime.utcnow()
        
        db.session.commit()
        
        print(f"✅ Success: CDSS data updated for scan_id={scan_id}")
        
        return jsonify({
            "success": True,
            "message": "CDSS data updated successfully",
            "scan_id": scan_id,
            "patient_id": scan.patient_id,
            "updated_at": scan_result.processed_at.isoformat()
        })
        
    except Exception as e:
        db.session.rollback()
        import traceback
        print(f"❌ Error updating CDSS data: {str(e)}")
        print(f"❌ Traceback: {traceback.format_exc()}")
        return jsonify({
            "error": str(e),
            "traceback": traceback.format_exc()
        }), 500

def calculate_age(birth_date):
    """Calculate age from birth date"""
    today = datetime.today()
    age = today.year - birth_date.year
    if today.month < birth_date.month or (today.month == birth_date.month and today.day < birth_date.day):
        age -= 1
    return f"{age} Y"

def get_latest_diagnosis(patient_id):
    """Get latest diagnosis from visit records"""
    try:
        from .models.visit_record import VisitRecord
        
        print(f"🔍 Debug: Looking for VisitRecord for patient {patient_id}")
        
        # Query the latest visit record using created_at
        latest_record = VisitRecord.query\
            .filter_by(patient_id=patient_id)\
            .order_by(VisitRecord.created_at.desc())\
            .first()
        
        if latest_record:
            print(f"🔍 Debug: Found visit record with diagnosis: {latest_record.diagnosis}")
            return latest_record.diagnosis or "No diagnosis recorded"
        else:
            print(f"🔍 Debug: No visit records found for patient {patient_id}")
            return "No diagnosis recorded"
        
    except Exception as e:
        print(f"⚠️ Warning in get_latest_diagnosis: {e}")
        import traceback
        print(f"⚠️ Traceback: {traceback.format_exc()}")
        return "Diagnosis not available"