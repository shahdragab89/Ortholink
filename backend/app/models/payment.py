from ..extensions import db
from datetime import datetime

class Payment(db.Model):
    __tablename__ = 'payment'

    payment_id = db.Column(db.Integer, primary_key=True)
    bill_id = db.Column(db.Integer, db.ForeignKey('bill.bill_id'), nullable=False)
    staff_id = db.Column(db.Integer, db.ForeignKey('staff.staff_id'))
    payment_date = db.Column(db.DateTime, default=datetime.utcnow)
    transaction_id = db.Column(db.String(50), unique=True)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    notes = db.Column(db.Text)


    # Relationships
    staff = db.relationship("Staff", backref="payments")

    def __repr__(self):
        return f"<Payment {self.payment_id} - {self.payment_method}>"
