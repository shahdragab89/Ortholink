-- First, drop all tables in correct order (to handle foreign keys)
DROP TABLE IF EXISTS payment CASCADE;
DROP TABLE IF EXISTS bill_item CASCADE;
DROP TABLE IF EXISTS bill CASCADE;
DROP TABLE IF EXISTS scan_result CASCADE;
DROP TABLE IF EXISTS dicom_scan CASCADE;
DROP TABLE IF EXISTS medication CASCADE;
DROP TABLE IF EXISTS visit_record CASCADE;
DROP TABLE IF EXISTS appointment CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS patient CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Now create all tables
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(300) NOT NULL,
    role VARCHAR(100),
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    is_active BOOLEAN DEFAULT true,
    address TEXT,
    f_name VARCHAR(50),
    l_name VARCHAR(50),
    birth_date DATE,
    gender VARCHAR(10),
    phone VARCHAR(20)
);

CREATE TABLE patient (
    patient_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    blood_type VARCHAR(5),
    allergies TEXT,
    chronic_conditions TEXT,
    insurance_provider VARCHAR(100),
    insurance_number VARCHAR(50),
    registration_date TIMESTAMP DEFAULT NOW(),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(100)
);

CREATE TABLE staff (
    staff_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    f_name VARCHAR(50),
    l_name VARCHAR(50),
    license_number VARCHAR(50),
    phone VARCHAR(20),
    department VARCHAR(100),
    hire_date DATE,
    salary DECIMAL(10,2)
);

CREATE TABLE appointment (
    appointment_id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patient(patient_id) ON DELETE CASCADE,
    staff_id INT REFERENCES staff(staff_id) ON DELETE CASCADE,
    appointment_date DATE,
    appointment_time TIME,
    duration_minutes INT,
    appointment_type VARCHAR(50),
    status VARCHAR(20) CHECK (status IN ('scheduled','completed','cancelled','no-show')),
    reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE visit_record (
    record_id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patient(patient_id) ON DELETE CASCADE,
    staff_id INT REFERENCES staff(staff_id) ON DELETE CASCADE,
    appointment_id INT REFERENCES appointment(appointment_id) ON DELETE SET NULL,
    chief_complaint TEXT,
    diagnosis TEXT,
    treatment_plan TEXT,
    vital_signs JSON,
    physical_examination TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE medication (
    medication_id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patient(patient_id) ON DELETE CASCADE,
    staff_id INT REFERENCES staff(staff_id) ON DELETE CASCADE,
    record_id INT REFERENCES visit_record(record_id) ON DELETE CASCADE,
    medication_name VARCHAR(200),
    dosage VARCHAR(50),
    frequency VARCHAR(100),
    duration VARCHAR(50),
    instructions TEXT,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE dicom_scan (
    scan_id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patient(patient_id) ON DELETE CASCADE,
    staff_id INT REFERENCES staff(staff_id) ON DELETE CASCADE,
    record_id INT REFERENCES visit_record(record_id) ON DELETE CASCADE,
    scan_type VARCHAR(50),
    body_part VARCHAR(100),
    scan_date TIMESTAMP,
    file_path VARCHAR(500),
    file_size BIGINT,
    modality VARCHAR(20),
    description TEXT,
    status VARCHAR(20) CHECK (status IN ('pending','completed','reported')),
    uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scan_result (
    result_id SERIAL PRIMARY KEY,
    scan_id INT REFERENCES dicom_scan(scan_id) ON DELETE CASCADE,
    staff_id INT REFERENCES staff(staff_id) ON DELETE CASCADE,
    confidence_score DECIMAL(5,2),
    ai_recommendations TEXT,
    cdss_result JSON,
    doctor_notes TEXT,
    final_diagnosis TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP,
    verified_at TIMESTAMP
);

CREATE TABLE bill (
    bill_id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patient(patient_id) ON DELETE CASCADE,
    appointment_id INT REFERENCES appointment(appointment_id) ON DELETE CASCADE,
    bill_date DATE,
    total_amount DECIMAL(10,2),
    insurance_covered DECIMAL(10,2),
    patient_responsibility DECIMAL(10,2),
    paid_amount DECIMAL(10,2),
    balance DECIMAL(10,2),
    payment_status VARCHAR(20) CHECK (payment_status IN ('pending','partial','paid','overdue')),
    due_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bill_item (
    item_id SERIAL PRIMARY KEY,
    bill_id INT REFERENCES bill(bill_id) ON DELETE CASCADE,
    service_code VARCHAR(20),
    service_name VARCHAR(200),
    quantity INT,
    unit_price DECIMAL(10,2),
    total_price DECIMAL(10,2),
    description TEXT
);

CREATE TABLE payment (
    payment_id SERIAL PRIMARY KEY,
    bill_id INT REFERENCES bill(bill_id) ON DELETE CASCADE,
    staff_id INT REFERENCES staff(staff_id) ON DELETE CASCADE,
    payment_date TIMESTAMP DEFAULT NOW(),
    transaction_id VARCHAR(100),
    amount DECIMAL(10,2),
    payment_method VARCHAR(20) CHECK (payment_method IN ('cash','credit','debit','insurance','check')),
    notes TEXT
);