# backend/app/models/medication.py
from ..extensions import db
from datetime import datetime

class Medication(db.Model):
    __tablename__ = 'medication'
    
    medication_id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.patient_id'), nullable=False)
    staff_id = db.Column(db.Integer, db.ForeignKey('staff.staff_id'), nullable=False)
    record_id = db.Column(db.Integer, db.ForeignKey('visit_record.record_id'))
    medication_name = db.Column(db.String(200))
    dosage = db.Column(db.String(50))
    frequency = db.Column(db.String(100))
    duration = db.Column(db.String(50))
    instructions = db.Column(db.Text)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    patient = db.relationship("Patient", back_populates="medications")
    staff = db.relationship("Staff")
    visit_record = db.relationship("VisitRecord")
    
    def __repr__(self):
        return f"<Medication {self.medication_id}>"