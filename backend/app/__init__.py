# backend/app/__init__.py
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .config import Config
from .extensions import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # JWT configuration
    app.config["JWT_SECRET_KEY"] = app.config["SECRET_KEY"]
    
    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})  # Allow all for testing
    # Initialize extensions
    db.init_app(app)
    jwt = JWTManager(app)
    
    # Import models in correct order to avoid circular dependencies
    # IMPORTANT: Import in this specific order
    from .models.user import User
    from .models.staff import Staff
    from .models.appointment import Appointment
    from .models.visit_record import VisitRecord  # Import BEFORE patient
    from .models.patient import Patient
    from .models.medication import Medication
    
    # Import and register blueprints
    from .routes import auth_bp, doctor_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    from .receptionist_routes import reception_bp
    app.register_blueprint(reception_bp, url_prefix="/api/receptionist")

    # In your main Flask app file (app.py, __init__.py, or wherever you create your app)
    from .radiologist_routes import radiologist_bp

    # Register the blueprint with the '/api' prefix
    app.register_blueprint(radiologist_bp, url_prefix='/api/radiologist')
    
    # Add a test route directly on app
    @app.route('/')
    def home():
        return {"message": "Ortholink API is running!"}
    
    @app.route('/api/health')
    def health():
        return {"status": "healthy", "service": "ortholink-api"}
    
    return app