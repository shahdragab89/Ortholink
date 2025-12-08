from ..extensions import db
from .user import User

class Patient(db.Model):
    __tablename__ = 'patient'

    patient_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    blood_type = db.Column(db.String(5))
    allergies = db.Column(db.Text)
    chronic_conditions = db.Column(db.Text)
    insurance_provider = db.Column(db.String(100))
    insurance_number = db.Column(db.String(50))
    registration_date = db.Column(db.DateTime, default=db.func.now())
    emergency_contact_name = db.Column(db.String(100))
    emergency_contact_phone = db.Column(db.String(100))

    user = db.relationship('User', back_populates='patients')
    appointments = db.relationship('Appointment', back_populates='patient', lazy='dynamic')
