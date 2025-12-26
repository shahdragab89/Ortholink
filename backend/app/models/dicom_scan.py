from app.extensions import db
from datetime import datetime

class DicomScan(db.Model):
    __tablename__ = "dicom_scan"

    scan_id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey("patient.patient_id"))
    # Staff who referred/ordered the scan (physician)
    staff_id = db.Column(db.Integer, db.ForeignKey("staff.staff_id"))
    radiologist_id = db.Column(db.Integer, db.ForeignKey('staff.staff_id'))
    record_id = db.Column(db.Integer, db.ForeignKey("visit_record.record_id"))
    scan_type = db.Column(db.String(50))
    body_part = db.Column(db.String(100))
    scan_date = db.Column(db.Date)
    
    # Changed from file_path to folder_path for storing directory of DICOM images
    folder_path = db.Column(db.String(500))
    modality = db.Column(db.String(20))
    description = db.Column(db.Text)  # Original description from physician
    
    # NEW: Radiologist's report/comment
    rad_report = db.Column(db.String(2000))  # 2000 characters max
    
    status = db.Column(db.String(20), default='pending')
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    
