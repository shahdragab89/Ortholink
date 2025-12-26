from ..extensions import db
from datetime import datetime

class BillItem(db.Model):
    __tablename__ = 'bill_item'

    item_id = db.Column(db.Integer, primary_key=True)
    bill_id = db.Column(db.Integer, db.ForeignKey('bill.bill_id'), nullable=False)
    service_code = db.Column(db.String(50))
    service_name = db.Column(db.String(255), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    unit_price = db.Column(db.Numeric(10, 2))
    total_price = db.Column(db.Numeric(10, 2))
    description = db.Column(db.Text)
    

    def __repr__(self):
        return f"<BillItem {self.item_id} - {self.service_name}>"
