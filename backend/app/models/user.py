# backend/app/models/user.py
import enum
from ..extensions import db
from datetime import datetime

class Gender(enum.Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"
    OTHER = "OTHER"

class Role(enum.Enum):
    DOCTOR = "doctor"
    PATIENT = 'patient'
    ADMIN = 'admin'
    NURSE = 'nurse'
    RECEPTIONIST = 'receptionist'
    RADIOLOGIST = 'radiologist'

class User(db.Model):
    __tablename__ = 'users'
    
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password_hash = db.Column(db.String(300), nullable=False)
    
    # Use Enum with native_enum=False
    role = db.Column(db.Enum(Role, native_enum=False, length=100), nullable=False)
    gender = db.Column(db.Enum(Gender, native_enum=False, length=10), nullable=False)
    
    last_login = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    address = db.Column(db.Text)
    f_name = db.Column(db.String(50))
    l_name = db.Column(db.String(50))
    birth_date = db.Column(db.Date)
    phone = db.Column(db.String(20))
    
    # Relationships - use string references to avoid circular imports
    patient = db.relationship("Patient", back_populates="user", uselist=False, foreign_keys="[Patient.user_id]")
    staff = db.relationship("Staff", back_populates="user", uselist=False, foreign_keys="[Staff.user_id]")
    
    def __repr__(self):
        return f"<User {self.username} ({self.role.value})>"