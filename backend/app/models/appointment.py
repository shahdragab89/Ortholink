from ..extensions import db
from .patient import Patient
from .staff import Staff

class Appointment(db.Model):
    __tablename__ = 'appointment'

    appointment_id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.patient_id'))
    staff_id = db.Column(db.Integer, db.ForeignKey('staff.staff_id'))
    appointment_date = db.Column(db.DateTime)
    notes = db.Column(db.Text)

    # define relationships
    patient = db.relationship('Patient', back_populates='appointments')
    staff = db.relationship('Staff', back_populates='appointments')
