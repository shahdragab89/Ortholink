import enum
from ..extensions import db

class Gender(enum.Enum):
    MALE = "male"
    FEMALE = "female"

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
    f_name = db.Column(db.String(50), nullable=False, unique=False)
    l_name = db.Column(db.String(50), nullable=False, unique=False)
    email = db.Column(db.String(120), unique=True)
    birth_date = db.Column(db.DateTime, nullable=False)
    phone = db.Column(db.String(11), nullable=False)
    address = db.Column(db.Text, nullable=False)
    gender = db.Column(db.Enum(Gender), nullable=False)
    role = db.Column(db.Enum(Role), nullable=False)
    last_login = db.Column(db.DateTime, nullable = True, unique=False)
    created_at = db.Column(db.DateTime, nullable = False, unique=False)
    is_active = db.Column(db.Boolean, default = False)
    # bcrypt
    password_hash = db.Column(db.String(500), nullable = False)


    patients = db.relationship("Patient", back_populates="user")
    staff = db.relationship("Staff", back_populates="user", uselist=False)
