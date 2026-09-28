-- ==========================================================
-- Materna: PostgreSQL & Supabase Database Architecture Schema
-- Handles patient profiles, continuous maternal vitals, ML predictions,
-- Indian DBT Scheme applications, and emergency SOS dispatches.
-- ==========================================================

-- 1. Patients Table (Aligned with ABHA ID & Supabase Auth)
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    abha_id VARCHAR(25) UNIQUE, -- Ayushman Bharat Health Account (e.g. 91-8874-2900-4102)
    mcp_card_number VARCHAR(50), -- Mother and Child Protection RCH Card
    blood_group VARCHAR(5) NOT NULL DEFAULT 'A+',
    age NUMERIC(4, 1) NOT NULL,
    lmp_date DATE NOT NULL, -- Last Menstrual Period
    estimated_due_date DATE NOT NULL,
    current_gestation_week INT NOT NULL DEFAULT 1,
    state VARCHAR(50) NOT NULL,
    district VARCHAR(50),
    annual_income_bracket VARCHAR(50),
    social_category VARCHAR(30) DEFAULT 'General',
    has_bpl_card BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Maternal Vitals Telemetry Table (Time-Series Data)
CREATE TABLE IF NOT EXISTS maternal_vitals_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    gestation_week INT NOT NULL,
    systolic_bp NUMERIC(5, 1) NOT NULL, -- mmHg (e.g. 118.0)
    diastolic_bp NUMERIC(5, 1) NOT NULL, -- mmHg (e.g. 76.0)
    fetal_heart_rate NUMERIC(5, 1), -- BPM (e.g. 142.0)
    blood_glucose NUMERIC(5, 1), -- mg/dL (e.g. 104.0)
    hemoglobin NUMERIC(4, 1), -- g/dL (e.g. 11.8)
    body_temperature NUMERIC(4, 1) DEFAULT 98.4, -- Fahrenheit
    maternal_weight_kg NUMERIC(5, 2), -- kg (e.g. 64.9)
    fetal_kick_count INT DEFAULT 0,
    symptoms_reported TEXT[], -- Array of strings (e.g. ['mild_swelling', 'headache'])
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Scikit-Learn Clinical Risk Predictions Table
CREATE TABLE IF NOT EXISTS clinical_risk_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    vitals_telemetry_id UUID REFERENCES maternal_vitals_telemetry(id),
    predicted_risk_level VARCHAR(20) NOT NULL, -- 'low_risk', 'mid_risk', 'high_risk'
    model_confidence_pct NUMERIC(5, 2) NOT NULL, -- e.g. 96.4%
    probability_distribution JSONB NOT NULL, -- {'low_risk': 0.96, 'mid_risk': 0.03, 'high_risk': 0.01}
    clinical_flags TEXT[] NOT NULL,
    clinical_recommendations TEXT[] NOT NULL,
    emergency_escalation_required BOOLEAN DEFAULT FALSE,
    model_version VARCHAR(50) DEFAULT 'scikit-learn-rf-v1.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Indian Government Scheme & DBT Applications Table (PMMVY, JSY, PM-JAY)
CREATE TABLE IF NOT EXISTS govt_scheme_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    scheme_code VARCHAR(30) NOT NULL, -- 'PMMVY', 'JSY', 'PMJAY', 'PMSMA'
    scheme_name VARCHAR(150) NOT NULL,
    entitled_grant_inr NUMERIC(10, 2) NOT NULL, -- in INR (e.g. 5000.00)
    application_status VARCHAR(30) DEFAULT 'DOCUMENTS_VERIFIED', -- 'PENDING', 'APPROVED', 'DISBURSED'
    bank_account_dbt_seeded BOOLEAN DEFAULT TRUE,
    dbt_disbursement_reference VARCHAR(100),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    disbursed_at TIMESTAMP WITH TIME ZONE
);

-- 5. Emergency SOS Dispatches & Telemetry Table
CREATE TABLE IF NOT EXISTS emergency_sos_dispatches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    gps_latitude NUMERIC(10, 7) NOT NULL,
    gps_longitude NUMERIC(10, 7) NOT NULL,
    emergency_trigger_reason VARCHAR(200) NOT NULL,
    dispatched_hospital VARCHAR(150) NOT NULL,
    ambulance_assigned_id VARCHAR(50),
    ambulance_eta_minutes INT,
    blood_group_required VARCHAR(5) NOT NULL DEFAULT 'A+',
    blood_units_crossmatched INT DEFAULT 2,
    family_sms_alert_dispatched BOOLEAN DEFAULT TRUE,
    doctor_alerted_name VARCHAR(100),
    status VARCHAR(30) DEFAULT 'EN_ROUTE', -- 'TRIGGERED', 'EN_ROUTE', 'ARRIVED_AT_OT', 'RESOLVED'
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create Indexes for High Performance Querying
CREATE INDEX IF NOT EXISTS idx_vitals_patient_id ON maternal_vitals_telemetry(patient_id);
CREATE INDEX IF NOT EXISTS idx_predictions_patient_id ON clinical_risk_predictions(patient_id);
CREATE INDEX IF NOT EXISTS idx_schemes_patient_id ON govt_scheme_applications(patient_id);
CREATE INDEX IF NOT EXISTS idx_emergency_patient_id ON emergency_sos_dispatches(patient_id);

-- Enable Row Level Security (RLS) for Supabase / PostgreSQL
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE maternal_vitals_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_risk_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE govt_scheme_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_sos_dispatches ENABLE ROW LEVEL SECURITY;
