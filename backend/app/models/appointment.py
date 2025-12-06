from ..extensions import db

class Appointment(db.Model):
    appointment_id = db.Column(db.Integer, primary_key=True)
    appointment_type = db.Column(db.String(50), nullable=False, unique=True)
    appointment_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50), nullable=False, unique=True)
    reason = db.Column(db.String(50), nullable=False, unique=True)
    notes = db.Column(db.Text, nullable=False, unique=False)
    duration_minutes = db.Column(db.Integer, nullable=False, unique=False)
    staff_id = db.Column(db.Integer, db.ForeignKey("staff.staff_id"))

    staff = db.relationship("Staff", back_populates="appointments", uselist=False)
