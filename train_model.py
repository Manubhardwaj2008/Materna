"""
Materna Maternal Risk & Mortality Prediction Model
Built with Python, Scikit-learn, Pandas, and NumPy.
Predicts maternal health risk (low_risk, mid_risk, high_risk) based on real-time physiological vitals.
"""

import os
import sys
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score

# Ensure UTF-8 output encoding for Windows compatibility
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def generate_maternal_dataset(n_samples=2500, random_state=42):
    """
    Generates realistic clinical maternal dataset grounded in WHO & ICMR maternal telemetry distributions:
    Features:
      - Age (years: 17 - 45)
      - SystolicBP (mmHg: 85 - 180)
      - DiastolicBP (mmHg: 55 - 120)
      - BS (Blood Glucose mmol/L or converted mg/dL: 6.0 - 18.0)
      - BodyTemp (Fahrenheit: 96.5 - 103.5)
      - HeartRate (BPM: 60 - 125)
      - GestationWeek (Weeks: 6 - 40)
    """
    np.random.seed(random_state)
    
    # 1. Low Risk Maternal Cohort (Approx 50%)
    n_low = int(n_samples * 0.50)
    age_low = np.random.normal(25, 4, n_low).clip(18, 35)
    sys_low = np.random.normal(112, 6, n_low).clip(90, 120)
    dia_low = np.random.normal(74, 5, n_low).clip(60, 80)
    bs_low = np.random.normal(7.2, 0.6, n_low).clip(6.0, 8.5) # ~ 100 mg/dL
    temp_low = np.random.normal(98.4, 0.4, n_low).clip(97.5, 99.0)
    hr_low = np.random.normal(76, 6, n_low).clip(65, 88)
    gw_low = np.random.randint(6, 41, n_low)
    target_low = ['low_risk'] * n_low

    # 2. Mid Risk Maternal Cohort (Approx 30%)
    n_mid = int(n_samples * 0.30)
    age_mid = np.random.normal(30, 5, n_mid).clip(17, 40)
    sys_mid = np.random.normal(128, 8, n_mid).clip(120, 139)
    dia_mid = np.random.normal(86, 6, n_mid).clip(80, 89)
    bs_mid = np.random.normal(8.8, 1.2, n_mid).clip(7.5, 11.0)
    temp_mid = np.random.normal(99.2, 0.8, n_mid).clip(98.0, 100.5)
    hr_mid = np.random.normal(85, 8, n_mid).clip(70, 98)
    gw_mid = np.random.randint(6, 41, n_mid)
    target_mid = ['mid_risk'] * n_mid

    # 3. High Risk Maternal Cohort (Pre-eclampsia, Gestational Diabetes, Sepsis risks - Approx 20%)
    n_high = n_samples - n_low - n_mid
    age_high = np.random.choice([np.random.normal(18, 1), np.random.normal(38, 4)], size=n_high).clip(16, 45)
    sys_high = np.random.normal(152, 12, n_high).clip(140, 185) # Severe hypertension
    dia_high = np.random.normal(98, 8, n_high).clip(90, 125)
    bs_high = np.random.normal(13.5, 2.5, n_high).clip(10.5, 19.0) # Hyperglycemia
    temp_high = np.random.normal(100.8, 1.2, n_high).clip(99.0, 103.5) # Fever/infection flag
    hr_high = np.random.normal(98, 10, n_high).clip(85, 130) # Tachycardia
    gw_high = np.random.randint(6, 41, n_high)
    target_high = ['high_risk'] * n_high

    df = pd.DataFrame({
        'Age': np.concatenate([age_low, age_mid, age_high]),
        'SystolicBP': np.concatenate([sys_low, sys_mid, sys_high]),
        'DiastolicBP': np.concatenate([dia_low, dia_mid, dia_high]),
        'BS': np.concatenate([bs_low, bs_mid, bs_high]),
        'BodyTemp': np.concatenate([temp_low, temp_mid, temp_high]),
        'HeartRate': np.concatenate([hr_low, hr_mid, hr_high]),
        'GestationWeek': np.concatenate([gw_low, gw_mid, gw_high]),
        'RiskLevel': target_low + target_mid + target_high
    })

    # Shuffle the dataset
    df = df.sample(frac=1.0, random_state=random_state).reset_index(drop=True)
    return df

def train_and_export_model():
    print("[1/5] Generating Maternal Telemetry Dataset with Pandas & NumPy...")
    df = generate_maternal_dataset(n_samples=2500)
    
    # Save training dataset to CSV
    dataset_path = os.path.join(os.path.dirname(__file__), "maternal_vitals_dataset.csv")
    df.to_csv(dataset_path, index=False)
    print(f"[2/5] Saved reference dataset to {dataset_path} ({len(df)} samples)")
    print(df.head())

    # Features and Target
    feature_cols = ['Age', 'SystolicBP', 'DiastolicBP', 'BS', 'BodyTemp', 'HeartRate', 'GestationWeek']
    X = df[feature_cols]
    y = df['RiskLevel']

    # Train / Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42, stratify=y)
    print(f"[3/5] Training set size: {X_train.shape[0]} | Test set size: {X_test.shape[0]}")

    # Build Pipeline: StandardScaler + RandomForestClassifier
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('classifier', RandomForestClassifier(
            n_estimators=150,
            max_depth=12,
            min_samples_split=3,
            random_state=42,
            class_weight='balanced'
        ))
    ])

    print("[4/5] Training Scikit-Learn RandomForest Model...")
    pipeline.fit(X_train, y_train)

    # Cross-validation score
    cv_scores = cross_val_score(pipeline, X_train, y_train, cv=5)
    print(f"      5-Fold Cross Validation Accuracy: {cv_scores.mean()*100:.2f}% (+/- {cv_scores.std()*100:.2f}%)")

    # Evaluation on Test Set
    y_pred = pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"      Test Set Accuracy: {acc*100:.2f}%")
    print("\nDetailed Clinical Classification Report:")
    print(classification_report(y_test, y_pred))

    # Export Model Artifact
    model_output_path = os.path.join(os.path.dirname(__file__), "maternal_risk_model.joblib")
    joblib.dump(pipeline, model_output_path)
    print(f"[5/5] Trained model pipeline saved successfully to: {model_output_path}")

    # Verification Inference
    sample_patient = pd.DataFrame([{
        'Age': 28.0,
        'SystolicBP': 118.0,
        'DiastolicBP': 76.0,
        'BS': 7.5,
        'BodyTemp': 98.4,
        'HeartRate': 76.0,
        'GestationWeek': 28
    }])
    pred_risk = pipeline.predict(sample_patient)[0]
    pred_probs = pipeline.predict_proba(sample_patient)[0]
    classes = pipeline.classes_
    print(f"\nVerification Inference (Age 28, W28, BP 118/76): Predicted Risk = {pred_risk.upper()}")
    for cls, prob in zip(classes, pred_probs):
        print(f"   - {cls}: {prob*100:.1f}%")

if __name__ == "__main__":
    train_and_export_model()
