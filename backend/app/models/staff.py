# backend/app/models/staff.py
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
    
    # Add these relationships
    referred_scans = db.relationship("DicomScan", foreign_keys="DicomScan.staff_id", backref="referring_staff")
    radiologist_scans = db.relationship("DicomScan", foreign_keys="DicomScan.radiologist_id", backref="radiologist")
    scan_results = db.relationship("ScanResult", backref="doctor", foreign_keys="ScanResult.staff_id")
    visit_records = db.relationship("VisitRecord", backref="doctor", foreign_keys="VisitRecord.staff_id")
    prescribed_medications = db.relationship("Medication", backref="prescribing_doctor", foreign_keys="Medication.staff_id")
    
    def __repr__(self):
        return f"<Staff {self.staff_id}>"