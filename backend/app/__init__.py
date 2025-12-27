# backend/app/__init__.py
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .config import Config
from .extensions import db
import os
from datetime import timedelta
from flask import send_from_directory

def create_app():
    app = Flask(__name__, static_folder='../static')
    app.config.from_object(Config)
    
    # JWT configuration
    app.config["JWT_SECRET_KEY"] = app.config["SECRET_KEY"]
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)
    
    # Enable CORS
    CORS(app)
    
    # Initialize extensions
    db.init_app(app)
    JWTManager(app)
    
    # ===== FIX: Import and register blueprints =====
    
    # First, let's try to import doctor routes with a different name
    try:
        from .doctor_routes import doctor_bp as doctor_blueprint
        app.register_blueprint(doctor_blueprint)
        print("✓ Doctor blueprint registered")
    except Exception as e:
        print(f"⚠️ Could not register doctor blueprint: {e}")
    
    # Try auth routes
    try:
        from .routes import auth_bp as auth_blueprint
        app.register_blueprint(auth_blueprint, url_prefix='/api/auth')
        print("✓ Auth blueprint registered")
    except Exception as e:
        print(f"⚠️ Could not register auth blueprint: {e}")
    
    # Try other blueprints
    try:
        from .receptionist_routes import reception_bp as reception_blueprint
        app.register_blueprint(reception_blueprint, url_prefix="/api/receptionist")
        print("✓ Receptionist blueprint registered")
    except:
        print("⚠️ Could not register receptionist blueprint")
    
    try:
        from .radiologist_routes import radiologist_bp as radiologist_blueprint
        app.register_blueprint(radiologist_blueprint, url_prefix='/api/radiologist')
        print("✓ Radiologist blueprint registered")
    except:
        print("⚠️ Could not register radiologist blueprint")

    # Add DICOM routes
    try:
        from .dicom_routes import dicom_bp as dicom_blueprint
        app.register_blueprint(dicom_blueprint, url_prefix='/api/dicom')
        print("✓ DICOM blueprint registered")
    except Exception as e:
        print(f"⚠️ Could not register DICOM blueprint: {e}")
        
        
        # Admin Doctors
    try:
        from .AdminDoctorsRoutes import admin_doctors_bp as admin_doctors_blueprint
        app.register_blueprint(admin_doctors_blueprint, url_prefix="/api/admin")
        print("✓ Admin Doctors blueprint registered")
    except Exception as e:
        print(f"⚠️ Could not register Admin Doctors blueprint: {e}")

    # Register the main Admin Dashboard Blueprint
    try:
        from .AdminHomeRoutes import admin_bp as admin_dashboard_blueprint
        app.register_blueprint(admin_dashboard_blueprint, url_prefix="/api/admin")
        print("✓ Admin Dashboard blueprint registered")
    except Exception as e:
        print(f"⚠️ Could not register Admin Dashboard blueprint: {e}")

    
    # ===== Simple test routes =====
    
    @app.route('/')
    def home():
        return {"message": "Ortholink API is running!", "status": "ok"}
    
    @app.route('/api/test')
    def test():
        return {"test": "API is working"}
    
    @app.route('/api/health')
    def health():
        return {"status": "healthy"}

    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        return send_from_directory(os.path.join(app.root_path, '..', 'uploads'), filename)
    
    # Create uploads directory
    with app.app_context():
        upload_folder = os.path.join(app.root_path, '..', 'uploads')
        os.makedirs(upload_folder, exist_ok=True)
        
        # Create subdirectories
        subdirs = ['profile_pictures', 'signatures', 'dicom_scans']
        for subdir in subdirs:
            dir_path = os.path.join(upload_folder, subdir)
            os.makedirs(dir_path, exist_ok=True)
    
    print("✅ App created successfully")
    return app