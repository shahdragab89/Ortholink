from app.extensions import db

class DicomScan(db.Model):
    __tablename__ = "dicom_scan"

    scan_id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey("patient.patient_id"))
    staff_id = db.Column(db.Integer, db.ForeignKey("staff.staff_id"))
    record_id = db.Column(db.Integer, db.ForeignKey("visit_record.record_id"))
    scan_type = db.Column(db.String(50))
    body_part = db.Column(db.String(100))
    scan_date = db.Column(db.Date)
    file_path = db.Column(db.String(500))
    file_size = db.Column(db.BigInteger)
    modality = db.Column(db.String(20))
    description = db.Column(db.Text)
    status = db.Column(db.String(20))
    uploaded_at = db.Column(db.DateTime)
