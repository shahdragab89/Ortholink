from ..extensions import db
from datetime import datetime

class Bill(db.Model):
    __tablename__ = 'bill'

    bill_id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.patient_id'), nullable=False)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointment.appointment_id'))
    bill_date = db.Column(db.Date, default=datetime.utcnow)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    insurance_covered = db.Column(db.Numeric(10, 2), default=0)
    patient_responsibility = db.Column(db.Numeric(10, 2))
    paid_amount = db.Column(db.Numeric(10, 2), default=0)
    balance = db.Column(db.Numeric(10, 2), default=0)
    payment_status = db.Column(db.String(20))
    due_date = db.Column(db.Date)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    patient = db.relationship("Patient", backref="bills")
    appointment = db.relationship("Appointment", backref="bill")
    bill_items = db.relationship("BillItem", backref="bill", cascade="all, delete-orphan")
    payments = db.relationship("Payment", backref="bill", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Bill {self.bill_id}>"
