from flask import Blueprint, request, jsonify
from .extensions import db
from .models.appointment import Appointment
from .models.staff import Staff
from .models.visit_record import VisitRecord
from .models.user import User
from .models.dicom_scan import DicomScan
from .models.patient import Patient
from .models.bill import Bill
from .models.bill_item import BillItem
from .models.payment import Payment
from datetime import datetime
from decimal import Decimal



reception_bp = Blueprint("reception", __name__)

@reception_bp.route("/me", methods=["GET"])
def get_receptionist_username():
    user_id = request.args.get("user_id", type=int)
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    user = User.query.get(user_id)
    if not user or user.role.value.lower() != "receptionist":
        return jsonify({"error": "Receptionist not found"}), 404

    return jsonify({"username": user.username}), 200

# -----------------------
# GET ALL APPOINTMENTS
# -----------------------
@reception_bp.route("/appointments", methods=["GET"])
def get_appointments():
    appointments = Appointment.query.all()
    data = []

    for a in appointments:
        user = User.query.get(a.patient.user_id)
        staff = Staff.query.get(a.staff_id)

        # --- check billing state dynamically ---
        bill = Bill.query.filter_by(appointment_id=a.appointment_id).first()
        billing_status = "Pending"
        if bill and bill.payment_status and bill.payment_status.lower() == "paid":
            billing_status = "Paid"

        # --- format status and append record ---
        data.append({
            "id": a.appointment_id,
            "name": f"{user.f_name} {user.l_name}",
            "patientId": f"P-{a.patient_id}",
            "phone": user.phone,
            "date": str(a.appointment_date),
            "time": str(a.appointment_time),
            "doctor": f"Dr. {staff.f_name}",
            "status": a.status.capitalize() if a.status else "Pending",
            "billing": billing_status
        })

    return jsonify(data), 200

# -----------------------
# RESCHEDULE APPOINTMENT
# -----------------------


@reception_bp.route("/appointment/<int:id>/reschedule", methods=["PUT"])
def reschedule_appointment(id):
    data = request.get_json()

    date = data.get("date")        # "2025-02-10"
    time = data.get("time")        # "14:00:00"
    staff_id = data.get("staff_id")

    if not (date and time and staff_id):
        return jsonify({"error": "Missing fields"}), 400

    old_app = Appointment.query.get(id)
    if not old_app:
        return jsonify({"error": "Appointment not found"}), 404

    new_app = Appointment(
        patient_id=old_app.patient_id,
        staff_id=staff_id,
        appointment_date=date,
        appointment_time=time,
        status="scheduled"
    )

    db.session.add(new_app)
    db.session.commit()

    return jsonify({"message": "New appointment created"})

@reception_bp.route("/doctors", methods=["GET"])
def get_doctors():
    # Join Staff ↔ User and check role case-insensitively
    doctors = (
        db.session.query(Staff)
        .join(User, User.user_id == Staff.user_id)
        .filter(db.func.lower(User.role) == "doctor")  # ✅ works with "DOCTOR" or "doctor"
        .all()
    )

    result = []
    for d in doctors:
        user = User.query.get(d.user_id)
        result.append({
            "staff_id": d.staff_id,
            "name": f"Dr. {user.f_name or d.f_name}",
        })

    return jsonify(result), 200


from .models.dicom_scan import DicomScan

@reception_bp.route("/scans", methods=["GET"])
def get_scans():
    scans = DicomScan.query.all()
    data = []

    for s in scans:
        # Get patient
        pat = Patient.query.get(s.patient_id)
        if not pat:
            continue

        user = User.query.get(pat.user_id)
        if not user:
            continue

        # Get radiologist
        radiologist = Staff.query.get(s.staff_id)
        if radiologist:
            radiologist_user = User.query.get(radiologist.user_id)
            radiologist_name = f"Dr. {radiologist_user.f_name}"
        else:
            radiologist_name = "Unknown"

        # Format date/time
        scan_date = s.scan_date.strftime("%Y-%m-%d") if s.scan_date else None
        scan_time = s.scan_date.strftime("%H:%M") if s.scan_date else None

        # --- ✅ Billing check ---
        bill = Bill.query.filter_by(patient_id=s.patient_id).first()
        billing_status = "Pending"
        if bill and bill.payment_status and bill.payment_status.lower() == "paid":
            billing_status = "Paid"

        # --- ✅ Normalize status (capitalize) ---
        status = s.status.capitalize() if s.status else "Pending"

        data.append({
            "id": s.scan_id,
            "name": f"{user.f_name} {user.l_name}",
            "patientId": f"P-{s.patient_id}",
            "phone": user.phone,
            "date": scan_date,
            "time": scan_time,
            "modality": s.modality,
            "radiologist": radiologist_name,
            "billing": billing_status,
            "status": status
        })

    return jsonify(data), 200

@reception_bp.route("/scan/<int:id>/reschedule", methods=["PUT"])
def reschedule_scan(id):
    data = request.get_json()

    date = data.get("date")
    time = data.get("time")
    staff_id = data.get("staff_id")

    if not (date and time and staff_id):
        return jsonify({"error": "Missing fields"}), 400

    old_scan = DicomScan.query.get(id)
    if not old_scan:
        return jsonify({"error": "Scan not found"}), 404

    # Convert "2025-02-05" + "14:00:00" to one datetime
    from datetime import datetime
    try:
        scan_dt = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M:%S")
    except:
        return jsonify({"error": "Invalid date/time"}), 400

    new_scan = DicomScan(
        patient_id=old_scan.patient_id,
        staff_id=staff_id,
        scan_date=scan_dt,
        modality=old_scan.modality,
        body_part=old_scan.body_part,
        scan_type=old_scan.scan_type,
        record_id=None,
        status="pending"
    )

    db.session.add(new_scan)
    db.session.commit()

    return jsonify({"message": "New scan created"})

@reception_bp.route("/billing/<string:source>/<int:ref_id>/confirm", methods=["PUT"])
def confirm_billing(source, ref_id):
    """
    source = 'appointment' or 'scan'
    ref_id = appointment_id or scan_id
    """

    data = request.get_json()
    payment_method = data.get("payment_method", "cash").lower()
    amount = Decimal(data.get("amount", 0))
    user_id = data.get("staff_id")  # from frontend (receptionist's user_id)

    # ✅ Lookup staff_id from user_id (Receptionist)
    staff = Staff.query.filter_by(user_id=user_id).first()
    staff_id = staff.staff_id if staff else None

    if not staff_id:
        return jsonify({"error": "Receptionist staff record not found"}), 404

    # ---------------------------
    # Case 1: Appointment Billing
    # ---------------------------
    if source == "appointment":
        appointment = Appointment.query.get(ref_id)
        if not appointment:
            return jsonify({"error": "Appointment not found"}), 404

        # Check for existing bill
        bill = Bill.query.filter_by(appointment_id=appointment.appointment_id).first()
        if not bill:
            # ✅ Create new Bill safely (exclude generated columns)
            bill = Bill(
                patient_id=appointment.patient_id,
                appointment_id=appointment.appointment_id,
                bill_date=datetime.utcnow(),
                total_amount=amount,
                paid_amount=amount,
                balance=0,
                payment_status="paid",
                due_date=None,
                notes=f"Auto-generated bill for appointment {appointment.appointment_id}",
            )
            db.session.add(bill)
            db.session.flush()  # get bill_id

            # ✅ Add related BillItem
            item = BillItem(
                bill_id=bill.bill_id,
                service_name="Consultation Fee",
                quantity=1,
                unit_price=amount,
                total_price=amount,
            )
            db.session.add(item)

        else:
            bill.payment_status = "paid"
            bill.paid_amount = amount
            bill.balance = 0

        # ✅ Record Payment
        payment = Payment(
            bill_id=bill.bill_id,
            staff_id=staff_id,
            amount=amount,
            payment_method=payment_method,
            notes=f"Appointment payment confirmed by receptionist {staff_id} on {datetime.utcnow().date()}",
        )

        db.session.add(payment)
        db.session.commit()
        return jsonify({"message": "Appointment billing updated"}), 200

    # ---------------------------
    # Case 2: Scan Billing
    # ---------------------------
    elif source == "scan":
        scan = DicomScan.query.get(ref_id)
        if not scan:
            return jsonify({"error": "Scan not found"}), 404

        bills = Bill.query.filter_by(patient_id=scan.patient_id).all()
        matched_bill = None
        for b in bills:
            for item in b.bill_items:
                if "scan" in item.service_name.lower():
                    matched_bill = b
                    break

        if not matched_bill:
            # ✅ Create new Bill for scan
            matched_bill = Bill(
                patient_id=scan.patient_id,
                bill_date=datetime.utcnow(),
                total_amount=amount,
                paid_amount=amount,
                balance=0,
                payment_status="paid",
                notes=f"Auto-generated bill for scan {scan.scan_id}",
            )
            db.session.add(matched_bill)
            db.session.flush()

            scan_item = BillItem(
                bill_id=matched_bill.bill_id,
                service_name=f"{scan.modality or 'Scan'} - {scan.body_part or 'General'}",
                quantity=1,
                unit_price=amount,
                total_price=amount,
            )
            db.session.add(scan_item)
        else:
            matched_bill.payment_status = "paid"
            matched_bill.paid_amount = amount
            matched_bill.balance = 0

        # ✅ Record Payment
        new_payment = Payment(
            bill_id=matched_bill.bill_id,
            staff_id=staff_id,
            payment_date=datetime.utcnow(),
            transaction_id=None,
            amount=amount,
            payment_method=payment_method,
            notes=f"Scan payment confirmed by receptionist {staff_id} on {datetime.utcnow().date()}",
        )

        db.session.add(new_payment)
        db.session.commit()
        return jsonify({"message": "Scan billing updated"}), 200

    else:
        return jsonify({"error": "Invalid source"}), 400

# -----------------------
# UPDATE STATUS (Appointments / Scans)
# -----------------------

@reception_bp.route("/appointment/<int:id>/status", methods=["PUT"])
def update_appointment_status(id):
    data = request.get_json()
    new_status = data.get("status", "").lower().replace(" ", "_")


    appt = Appointment.query.get(id)
    if not appt:
        return jsonify({"error": "Appointment not found"}), 404

    appt.status = new_status
    db.session.commit()

    return jsonify({"message": "Appointment status updated"}), 200


@reception_bp.route("/scan/<int:id>/status", methods=["PUT"])
def update_scan_status(id):
    data = request.get_json()
    new_status = data.get("status", "").lower()


    scan = DicomScan.query.get(id)
    if not scan:
        return jsonify({"error": "Scan not found"}), 404

    # Enforce only Pending/Completed
    if new_status.lower() not in ["pending", "completed"]:
        return jsonify({"error": "Invalid scan status"}), 400

    scan.status = new_status.lower()
    db.session.commit()

    return jsonify({"message": "Scan status updated"}), 200

