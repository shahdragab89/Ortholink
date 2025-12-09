from ..extensions import db
from datetime import datetime

class Patient(db.Model):
    __tablename__ = 'patient'
    
    patient_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False, unique=True)
    blood_type = db.Column(db.String(5))
    allergies = db.Column(db.Text)
    chronic_conditions = db.Column(db.Text)
    insurance_provider = db.Column(db.String(100))
    insurance_number = db.Column(db.String(50))
    registration_date = db.Column(db.DateTime, default=datetime.utcnow)
    emergency_contact_name = db.Column(db.String(100))
    emergency_contact_phone = db.Column(db.String(100))
    
    # Relationships - remove VisitRecord for now (will be added later)
    user = db.relationship("User", back_populates="patient", foreign_keys=[user_id])
    appointments = db.relationship("Appointment", back_populates="patient", cascade="all, delete-orphan")
    medications = db.relationship("Medication", back_populates="patient", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Patient {self.patient_id}>"