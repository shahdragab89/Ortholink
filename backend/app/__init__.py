from flask import Flask
from .extensions import db
from .config import Config
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from .models.user import User
from .models.patient import Patient
from .models.staff import Staff
from .models.appointment import Appointment
from .routes import auth_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    CORS(app)  # خلي CORS قبل الـ routes
    jwt = JWTManager(app)

    with app.app_context():
        db.create_all()

    app.register_blueprint(auth_bp, url_prefix='/auth')

    return app
