from ..extensions import db

class ScanResult(db.Model):
    __tablename__ = "scan_result"

    result_id = db.Column(db.Integer, primary_key=True)

    scan_id = db.Column(
        db.Integer,
        db.ForeignKey("dicom_scan.scan_id"),
        nullable=False
    )

    staff_id = db.Column(
        db.Integer,
        db.ForeignKey("staff.staff_id"),
        nullable=True
    )

    confidence_score = db.Column(db.Float)  

    ai_recommendations = db.Column(db.Text, nullable=True)
    cdss_result = db.Column(db.Text, nullable=True)

    doctor_notes = db.Column(db.Text, nullable=True)
    final_diagnosis = db.Column(db.Text, nullable=True)

    is_verified = db.Column(db.Boolean, default=False)

    processed_at = db.Column(db.DateTime, nullable=True)
    verified_at = db.Column(db.DateTime, nullable=True)
