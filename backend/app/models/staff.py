from ..extensions import db

class Staff(db.Model):
    staff_id = db.Column(db.Integer, primary_key=True)
    salary= db.Column(db.Integer, nullable = False, unique= False)
    license_number = db.Column(db.String(15), unique= True)
    department = db.Column(db.String(100))
    hire_date= db.Column(db.DateTime, nullable= False )
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))

    user = db.relationship("User", back_populates="staff", uselist=False)
    appointments = db.relationship("Appointment", back_populates="staff", uselist=True)
    
    def __repr__(self):
        return f"<User {self.username}>"
