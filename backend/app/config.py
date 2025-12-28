# backend/app/config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "defaultsecret")  

    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    UPLOAD_FOLDER = os.path.join(BASE_DIR, '..', 'uploads')
    SCAN_FOLDERS_DIR = "scan_folders"
    
    # Add these new settings
    MAX_CONTENT_LENGTH = 500 * 1024 * 1024  # 16MB max file size
    JWT_SECRET_KEY = SECRET_KEY
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours in seconds

# Ensure directories exist
    @staticmethod
    def init_app(app):
        # Create necessary directories
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
        os.makedirs(os.path.join(Config.BASE_DIR, Config.SCAN_FOLDERS_DIR), exist_ok=True)
        
        # Create subdirectories
        subdirs = ['profile_pictures', 'signatures', 'dicom_scans']
        for subdir in subdirs:
            os.makedirs(os.path.join(Config.UPLOAD_FOLDER, subdir), exist_ok=True)