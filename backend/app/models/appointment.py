# backend/app/models/appointment.py
from ..extensions import db
from datetime import datetime

# Add these columns to the existing Appointment model
class Appointment(db.Model):
    __tablename__ = 'appointment'
    
    appointment_id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.patient_id'), nullable=False)
    staff_id = db.Column(db.Integer, db.ForeignKey('staff.staff_id'), nullable=False)
    # doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.doctor_id'))  # Add this line
    #doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.doctor_id'))  # Add this line
    appointment_date = db.Column(db.Date)
    appointment_time = db.Column(db.Time)
    duration_minutes = db.Column(db.Integer)
    appointment_type = db.Column(db.String(50))
    status = db.Column(db.String(20))
    reason = db.Column(db.Text)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    patient = db.relationship("Patient", back_populates="appointments")
    staff = db.relationship("Staff", back_populates="appointments")
    
    def __repr__(self):
        return f"<Appointment {self.appointment_id}>"