# backend/app/models/visit_record.py
from ..extensions import db
from datetime import datetime
import json

class VisitRecord(db.Model):
    __tablename__ = 'visit_record'
    
    record_id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.patient_id'), nullable=False)
    staff_id = db.Column(db.Integer, db.ForeignKey('staff.staff_id'), nullable=False)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointment.appointment_id'))
    chief_complaint = db.Column(db.Text)
    diagnosis = db.Column(db.Text)
    treatment_plan = db.Column(db.Text)
    vital_signs = db.Column(db.JSON)
    physical_examination = db.Column(db.Text)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    patient = db.relationship("Patient", backref="visit_records", foreign_keys=[patient_id])
    staff = db.relationship("Staff")
    appointment = db.relationship("Appointment")
    
    def __repr__(self):
        return f"<VisitRecord {self.record_id}>"