from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from .extensions import db
from .models.user import User, Role
from .models.staff import Staff
from .models.visit_record import VisitRecord
# from .models.radiology_report import RadiologyReport  # You might need to create this model
# from .models.scan_order import ScanOrder  # You might need to create this model

radiologist_bp = Blueprint('radiologist', __name__)

def get_current_radiologist():
    """Helper function to get the current radiologist from JWT token"""
    user_id = get_jwt_identity()
    radiologist = User.query.filter_by(user_id=user_id, role=Role.RADIOLOGIST).first()
    return radiologist

@radiologist_bp.route('/radiologist/<int:user_id>', methods=['GET'])
@jwt_required()
def get_radiologist_profile(user_id):
    # Get the current user from JWT token
    current_user_id = get_jwt_identity()
    
    # Convert current_user_id to int for comparison
    try:
        current_user_id_int = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity in token"}), 400
    
    # Check if the requested user_id matches the current user
    if current_user_id_int != user_id:
        return jsonify({"error": f"Unauthorized access. Token user: {current_user_id_int}, Requested user: {user_id}"}), 403
    
    # Get user from User table
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    if user.role != Role.RADIOLOGIST:
        return jsonify({"error": "User is not a radiologist"}), 400
    
    # Get staff record using the foreign key user_id
    staff = Staff.query.filter_by(user_id=user_id).first()
    print(f"DEBUG: Looking for staff with user_id={user_id}, found: {staff}")  # Debug print
    
    if not staff:
        return jsonify({"error": "Staff record not found"}), 404
    
    print(f"DEBUG: Staff data - staff_id: {staff.staff_id}, license: {staff.license_number}, dept: {staff.department}")  # Debug print
    
    return jsonify({
        "user_id": user.user_id,
        "username": user.username,
        "email": user.email,
        "f_name": user.f_name,
        "l_name": user.l_name,
        "phone": user.phone,
        "address": user.address,
        "birth_date": user.birth_date.strftime("%Y-%m-%d") if user.birth_date else None,
        "gender": user.gender.value if user.gender else None,
        "staff_id": staff.staff_id,  # From Staff table
        "license_number": staff.license_number,  # From Staff table
        "staff_phone": staff.phone,  # From Staff table (might be different)
        "department": staff.department,  # From Staff table
        "hire_date": staff.hire_date.strftime("%Y-%m-%d") if staff.hire_date else None,
        "salary": float(staff.salary) if staff.salary else None,
        "role": user.role.value
    })

@radiologist_bp.route('/radiologist/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_radiologist_profile(user_id):
    current_user_id = get_jwt_identity()
    
    # Convert current_user_id to int for comparison
    try:
        current_user_id_int = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity in token"}), 400
    
    if current_user_id_int != user_id:
        return jsonify({"error": "Unauthorized access"}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    if user.role != Role.RADIOLOGIST:
        return jsonify({"error": "User is not a radiologist"}), 400
    
    # Get staff record
    staff = Staff.query.filter_by(user_id=user_id).first()
    if not staff:
        return jsonify({"error": "Staff record not found"}), 404
    
    data = request.json
    phone = data.get('phone')
    address = data.get('address')
    
    # Update user fields
    if phone:
        user.phone = phone
        # Also update staff phone
        staff.phone = phone
    
    if address:
        user.address = address
    
    db.session.commit()
    
    return jsonify({
        "message": "Profile updated successfully",
        "user_id": user.user_id,
        "phone": user.phone,
        "address": user.address
    })