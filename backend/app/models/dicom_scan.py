from app.extensions import db
from datetime import datetime

class DicomScan(db.Model):
    __tablename__ = "dicom_scan"

    scan_id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey("patient.patient_id"))
    staff_id = db.Column(db.Integer, db.ForeignKey("staff.staff_id"))
    radiologist_id = db.Column(db.Integer, db.ForeignKey('staff.staff_id'))
    record_id = db.Column(db.Integer, db.ForeignKey("visit_record.record_id"))
    scan_type = db.Column(db.String(50))
    body_part = db.Column(db.String(100))
    scan_date = db.Column(db.Date)
    folder_path = db.Column(db.String(500))
    modality = db.Column(db.String(20))
    description = db.Column(db.Text)
    rad_report = db.Column(db.String(2000))
    status = db.Column(db.String(20), default='pending')
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    patient = db.relationship("Patient", backref="scans")
    visit_record = db.relationship("VisitRecord", backref="scans")
    scan_result = db.relationship("ScanResult", backref="scan", uselist=False)
    
    def __repr__(self):
        return f"<DicomScan {self.scan_id}>"