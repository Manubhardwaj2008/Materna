# 🌸 Materna (मातृ) — AI-Powered Maternal Health & Mortality Prevention Platform

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.4%2B-F7931E.svg?logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-4285F4.svg?logo=google&logoColor=white)](https://ai.google.dev/)
[![Database](https://img.shields.io/badge/PostgreSQL%20%2F%20Supabase-Ready-336791.svg?logo=postgresql&logoColor=white)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Materna** is a comprehensive, clinically grounded maternal healthcare super-app and risk prediction engine. Designed to curb maternal and infant mortality, Materna combines **real-time AI vitals telemetry**, an **Indian government maternity DBT scheme calculator**, a **voice-enabled Gemini AI Doula (AI Saathi)**, **ABHA/MCP digital health passport vault**, and a **1-click emergency SOS dispatch system**.

---

## 📑 Table of Contents

- [🌟 Key Highlights & Vision](#-key-highlights--vision)
- [🧩 Core Features & Architecture](#-core-features--architecture)
  - [1. AI Maternal Risk Classification Engine](#1-ai-maternal-risk-classification-engine)
  - [2. Indian Government DBT Schemes & Grants Calculator](#2-indian-government-dbt-schemes--grants-calculator)
  - [3. Materna AI Saathi (Gemini-Powered Virtual Doula)](#3-materna-ai-saathi-gemini-powered-virtual-doula)
  - [4. One-Click Emergency SOS & Blood Dispatch](#4-one-click-emergency-sos--blood-dispatch)
  - [5. ABHA, MCP Card & Document Vault](#5-abha-mcp-card--document-vault)
  - [6. Hospital & Blood Bank Readiness Hub](#6-hospital--blood-bank-readiness-hub)
- [🏗️ System Architecture & Workflow](#️-system-architecture--workflow)
- [📂 Project Directory Structure](#-project-directory-structure)
- [🚀 Quick Start & Installation](#-quick-start--installation)
  - [Prerequisites](#prerequisites)
  - [Installation Steps](#installation-steps)
  - [Training / Retraining the ML Model](#training--retraining-the-ml-model)
  - [Running the Application](#running-the-application)
- [📡 REST API Documentation](#-rest-api-documentation)
- [🗄️ Database Architecture](#️-database-architecture)
- [📄 Marketing & Enterprise PDF Generator](#-marketing--enterprise-pdf-generator)
- [🤝 Contributing & License](#-contributing--license)

---

## 🌟 Key Highlights & Vision

In developing countries, maternal mortality often stems from delays in recognizing critical danger signs (such as pre-eclampsia, gestational diabetes, and obstetric hemorrhage) and lack of access to financial and institutional maternity aid.

**Materna solves this three-stage delay:**
1. **Delay in Seeking Care:** Proactive AI telemetry flags risk conditions early and advises mothers in their local language.
2. **Delay in Reaching Care:** 1-Click SOS coordinates nearest emergency hospital dispatch with pre-reserved cross-matched blood units.
3. **Delay in Receiving Quality Care:** Instant digitized MCP/ABHA record sharing, financial DBT grant navigation (PMMVY, JSY, PM-JAY), and real-time hospital bed/OT telemetry.

---

## 🧩 Core Features & Architecture

### 1. AI Maternal Risk Classification Engine
- **Model:** Scikit-Learn `RandomForestClassifier` pipeline with `StandardScaler`.
- **Dataset:** 2,500+ synthetic clinical records grounded in WHO & ICMR maternal physiological standards.
- **Input Features:** Maternal Age, Systolic BP, Diastolic BP, Blood Glucose (mg/dL or mmol/L), Body Temperature (°F), Heart Rate (BPM), and Gestational Week.
- **Output:** Multi-class risk prediction (`low_risk`, `mid_risk`, `high_risk`), percentage confidence scores, clinical triage flags, and immediate medical action items.

### 2. Indian Government DBT Schemes & Grants Calculator
Calculates direct cash transfers, subsidies, and free institutional care eligibility across central and state-specific schemes:
- **Central Schemes:**
  - **PMMVY 2.0 (Pradhan Mantri Matru Vandana Yojana):** ₹5,000 cash grant (₹6,000 for 2nd girl child).
  - **JSY (Janani Suraksha Yojana):** ₹600 to ₹1,400 institutional delivery assistance + ASHA incentives.
  - **JSSK (Janani Shishu Suraksha Karyakram):** 100% cashless delivery, medicines, C-section, diet, and newborn care (est. value ₹12,000).
  - **Ayushman Bharat PM-JAY:** Up to ₹5,00,000 annual secondary/tertiary maternal hospitalization cover.
- **State Top-Ups:** Tamil Nadu (MRMBS ₹18,000), Telangana (KCR Kit ₹12k–₹13k), Rajasthan (IGMPY ₹6,000), Uttar Pradesh (Kanya Sumangala ₹25,000), Bihar (Kanya Utthan ₹5,000), Karnataka (Mathru Poorna), Haryana (Ladli Scheme), and Maharashtra.
- **Corporate Welfare:** Automatic check for **Maternity Benefit (Amendment) Act, 2017** (26 weeks paid leave + ₹3,500 medical bonus).

### 3. Materna AI Saathi (Gemini-Powered Virtual Doula)
- Integrated clinical chatbot powered by **Google Gemini 2.5 Flash / 1.5 Flash**.
- Multilingual conversational capabilities in **English, Hindi, and Hinglish**.
- **Voice Input:** Web Speech API integration for hands-free maternal voice queries.
- Built-in **Emergency Fallback Doula** when offline or without an API key.
- Guidance covers trimester milestones, Indian gestational diet (iron, calcium, folic acid), kick counting, and danger sign detection.

### 4. One-Click Emergency SOS & Blood Dispatch
- Live geolocation capture (Latitude & Longitude).
- Emergency hospital routing and ambulance ETA tracking.
- Automated reservation of cross-matched blood units (e.g., 2 Units A+).
- SMS broadcast triggers to nominated family contacts and the designated OB-GYN specialist.

### 5. ABHA, MCP Card & Document Vault
- Built-in vault for **Ayushman Bharat Health Account (ABHA ID)** and **Mother-Child Protection (MCP/RCH) Card**.
- Aadhaar-NPCI bank seeding status verification for Direct Benefit Transfer (DBT).
- Upload and storage for ultrasound sonography (USG), blood panel reports, and immunization records.

### 6. Hospital & Blood Bank Readiness Hub
- Real-time monitoring of ICU/maternity bed occupancy and OT readiness.
- Live blood stock availability (A+, B+, O+, AB+, and negative blood groups).
- Doctor roster and direct appointment booking for high-risk triage.

---

## 🏗️ System Architecture & Workflow

```
               ┌────────────────────────────────────────────────────────┐
               │              Materna Frontend Web Client               │
               │   (HTML5, Vanilla CSS, Tailwind, ES6 JS, Web Speech)   │
               └───────────┬────────────────────────────────┬───────────┘
                           │                                │
            REST API Calls │                 Direct Gemini  │ (Optional)
             & Telemetry   ▼                  Client Call   ▼
┌──────────────────────────────────────────┐    ┌───────────────────────┐
│        Python FastAPI Server (app.py)    │    │   Google Gemini API   │
│ ──────────────────────────────────────── │    │ (gemini-2.5-flash)    │
│ • /api/predict-risk                      │    └───────────────────────┘
│ • /api/schemes/calculate                 │
│ • /api/emergency/sos                     │
│ • /api/chat (Gemini Proxy)               │
│ • /api/health                            │
└───────────┬──────────────────────────────┘
            │
            ├────────────────────────────────────────┐
            ▼                                        ▼
┌──────────────────────────────────────┐  ┌─────────────────────────────────────┐
│  Scikit-Learn ML Inference Engine    │  │  PostgreSQL / Supabase Schema       │
│  (maternal_risk_model.joblib)        │  │  (database_schema.sql)              │
│  • StandardScaler + RandomForest     │  │  • Patients, Vitals, Predictions    │
│  • 3-Tier Risk Triage & Clinical Log │  │  • DBT Applications, SOS Dispatches │
└──────────────────────────────────────┘  └─────────────────────────────────────┘
```

---

## 📂 Project Directory Structure

```text
Materna/
├── app.py                             # FastAPI backend server & REST API endpoints
├── train_model.py                     # ML dataset generation & RandomForest training pipeline
├── maternal_risk_model.joblib         # Serialized Scikit-learn classification pipeline
├── maternal_vitals_dataset.csv        # Reference training dataset (2,500 samples)
├── database_schema.sql                # PostgreSQL & Supabase schema with RLS & indexes
├── generate_pdf_brochure.py           # ReportLab Python script for enterprise hospital brochures
├── chatbot.js                         # Materna AI Saathi client engine with Voice & Gemini integration
├── requirements.txt                   # Python package dependencies
├── index.html                         # Main Maternal Health Super-App & Patient Dashboard
├── about.html                         # Mission, clinical advisory board, and vision page
├── pricing.html                       # Community Free & Hospital SaaS Enterprise tiers
├── contact.html                       # 24/7 Helpline, Emergency contacts, and support page
└── assets/                            # Brand assets, logos, clinical UI illustrations
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Python 3.10+** installed on your system.
- Modern web browser (Chrome, Edge, Firefox, Safari).

### Installation Steps

1. **Clone or Navigate to the Workspace:**
   ```bash
   cd Materna
   ```

2. **Create and Activate a Virtual Environment:**
   - **Windows (PowerShell):**
     ```powershell
     python -m venv .venv
     .venv\Scripts\Activate.ps1
     ```
   - **Linux / macOS:**
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```

3. **Install Required Python Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

---

### Training / Retraining the ML Model

The repository includes a pre-trained model (`maternal_risk_model.joblib`). If you wish to regenerate the dataset or retrain the RandomForest model:

```bash
python train_model.py
```

**Training Pipeline Features:**
- Generates 2,500 clinically stratified patient profiles (Low, Mid, High risk).
- Standardizes numerical vitals with `StandardScaler`.
- Performs 5-Fold Cross Validation (~99% accuracy).
- Exports the compiled pipeline to `maternal_risk_model.joblib`.

---

### Running the Application

1. **Start the FastAPI Server:**
   ```bash
   python app.py
   ```
   *or with Uvicorn directly:*
   ```bash
   uvicorn app:app --host 127.0.0.1 --port 8000 --reload
   ```

2. **Open the Application in your Browser:**
   - **Dashboard & Super-App:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
   - **About Page:** [http://127.0.0.1:8000/about.html](http://127.0.0.1:8000/about.html)
   - **Pricing & Schemes:** [http://127.0.0.1:8000/pricing.html](http://127.0.0.1:8000/pricing.html)
   - **Contact & Support:** [http://127.0.0.1:8000/contact.html](http://127.0.0.1:8000/contact.html)
   - **Interactive Swagger API Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
   - **ReDoc API Documentation:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

3. *(Optional)* **Set up Google Gemini API Key:**
   - To enable live AI doula responses, enter your key inside the in-app settings modal, or set an environment variable:
     ```bash
     export GEMINI_API_KEY="your_api_key_here"      # Linux/macOS
     $env:GEMINI_API_KEY="your_api_key_here"         # Windows PowerShell
     ```

---

## 📡 REST API Documentation

### 1. Maternal Risk Prediction
- **Endpoint:** `POST /api/predict-risk`
- **Request Body:**
  ```json
  {
    "age": 28.0,
    "systolic_bp": 142.0,
    "diastolic_bp": 92.0,
    "blood_glucose": 145.0,
    "body_temp": 98.6,
    "heart_rate": 88.0,
    "gestation_week": 32,
    "symptoms": ["headache", "mild_edema"]
  }
  ```
- **Response:**
  ```json
  {
    "risk_level": "high_risk",
    "risk_score_label": "HIGH RISK (Immediate Attention Required)",
    "confidence": 94.2,
    "probabilities": {
      "low_risk": 0.02,
      "mid_risk": 0.04,
      "high_risk": 0.94
    },
    "clinical_flags": [
      "Hypertensive Spike (Gestational Pre-eclampsia risk threshold)",
      "Elevated postprandial glucose (Gestational Diabetes screening recommended)"
    ],
    "clinical_summary": "Urgent maternal risk parameters detected. High probability of acute hypertension/pre-eclampsia complications at Week 32.",
    "recommendations": [
      "🚨 Trigger Emergency SOS immediately or proceed to nearest maternal hospital.",
      "Cross-match Blood Type A+ and notify lead OB-GYN.",
      "Perform immediate urine protein dipstick & CTG fetal monitoring."
    ],
    "emergency_escalation_required": true,
    "timestamp": "2026-10-02 01:00:00"
  }
  ```

### 2. Maternity Scheme & DBT Calculation
- **Endpoint:** `POST /api/schemes/calculate`
- **Request Body:**
  ```json
  {
    "annual_income": "below25",
    "child_order": "second_girl",
    "state": "tamilnadu",
    "area_type": "rural",
    "category": "sc_st",
    "ration_card": "nfsa",
    "delivery_facility": "govt_public",
    "employment_type": "unorganized",
    "has_insurance": "pmjay"
  }
  ```
- **Response:** Returns cumulative DBT cash totals (`₹ 25,400`), breakdown across PMMVY 2.0, JSY, JSSK, state top-ups (MRMBS), tranche payment schedules, and mandatory documents.

### 3. Emergency SOS Protocol
- **Endpoint:** `POST /api/emergency/sos`
- **Request Body:**
  ```json
  {
    "patient_name": "Ananya Sharma",
    "blood_group": "A+",
    "lat": 28.4595,
    "lon": 77.0266,
    "emergency_type": "Pre-eclampsia Alert / Severe Hypertension"
  }
  ```
- **Response:** Returns active ambulance dispatch details, driver phone number, nearest hospital assignment, and blood bank cross-match reservation token.

### 4. Materna AI Saathi Chatbot
- **Endpoint:** `POST /api/chat`
- **Request Body:**
  ```json
  {
    "message": "I am in week 30 and experiencing severe headache with swelling in feet. Is this normal?",
    "history": []
  }
  ```

---

## 🗄️ Database Architecture

The project provides a production-grade **PostgreSQL / Supabase** schema (`database_schema.sql`) configured with Row Level Security (RLS) and query indexes:

| Table | Description |
|---|---|
| `patients` | Patient demographic profiles, ABHA Health ID, MCP Card No., Gestational Age, and Risk Baseline. |
| `maternal_vitals_telemetry` | Time-series vitals telemetry (BP, Fetal Heart Rate, Glucose, Hemoglobin, Kick counts). |
| `clinical_risk_predictions` | Historical ML inferences, confidence scores, probability distributions, and clinical flags. |
| `govt_scheme_applications` | Direct Benefit Transfer (DBT) scheme status, Aadhaar bank seeding, and PFMS tracking. |
| `emergency_sos_dispatches` | Geolocation coordinates, dispatched hospitals, ambulance telemetry, and blood cross-match tracking. |

To initialize on Supabase or local PostgreSQL:
```bash
psql -h <host> -U <user> -d <database> -f database_schema.sql
```

---

## 📄 Marketing & Enterprise PDF Generator

Generate high-resolution PDF brochures and hospital partnership decks with a single command:

```bash
python generate_pdf_brochure.py
```
*Outputs: `Materna_Competitor_Brochure_and_Advantage.pdf`*

---

## 🩺 Clinical Disclaimer

> **Important Notice:** Materna is an assistive clinical decision support and health literacy tool designed in accordance with WHO and ICMR guidelines. It does not replace professional medical advice, clinical diagnosis, or treatment. In case of acute symptoms, users are advised to contact emergency services or their registered medical practitioner immediately.

---

## 🤝 Contributing & License

Contributions, issues, and feature requests are welcome!
- Distributed under the **MIT License**.
- Developed for maternal wellness and mortality reduction.
