from ..extensions import db
from datetime import datetime

class Staff(db.Model):
    __tablename__ = 'staff'
    
    staff_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False, unique=True)
    f_name = db.Column(db.String(50))
    l_name = db.Column(db.String(50))
    license_number = db.Column(db.String(50))
    phone = db.Column(db.String(20))
    department = db.Column(db.String(100))
    hire_date = db.Column(db.Date)
    salary = db.Column(db.Numeric(10, 2))
    
    # Relationships
    user = db.relationship("User", back_populates="staff", foreign_keys=[user_id])
    appointments = db.relationship("Appointment", back_populates="staff", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Staff {self.staff_id}>"