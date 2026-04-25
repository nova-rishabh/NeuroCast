# NeuroCast — Global NLP Intelligence Platform
> NeuroLogic '26 · Global NLP Datathon · GGITS AIML Dept · April 25, 2026

## Overview
NeuroCast is a full-stack NLP platform solving all three NeuroLogic '26 challenges:
- Challenge 1: Disaster Tweet Classification (Metric: Macro F1-Score)
- Challenge 2: Fake News Detection (Metric: Accuracy)
- Challenge 3: Multilingual Toxic Comment Classification (Metric: ROC-AUC)

## Results

| Challenge | Model | Metric | Score |
|-----------|-------|--------|-------|
| 1 — Disaster Tweets | TF-IDF + Logistic Regression | Macro F1 | **95]** |
| 2 — Fake News | TF-IDF + Logistic Regression | Accuracy | **98** |
| 3 — Toxic Comments | TF-IDF + Logistic Regression | ROC-AUC | **97** |

## Approach

### Challenge 1 — Disaster Tweet Classification
- **Dataset**: CrisisLexT26 (25,933 tweets, 2012–2013)
- **Labels**: 1 = Informative, 0 = Not Informative
- **Model**: TF-IDF (max_features=15000, ngram_range=(1,2), sublinear_tf=True) → Logistic Regression (C=1.0, class_weight='balanced')
- **Train/Test Split**: 80/20 stratified
- **Metric**: Macro F1-Score (handles class imbalance: 16019 vs 9914)

### Challenge 2 — Fake News Detection
- **Dataset**: Fake and Real News Dataset (23,893 articles)
- **Labels**: "TRUE" = Real, "FALSE" = Fake
- **Feature Engineering**: title + text concatenated before vectorization
- **Model**: TF-IDF (max_features=20000, ngram_range=(1,2)) → Logistic Regression (C=5.0)
- **Train/Test Split**: 80/20 stratified
- **Metric**: Overall Accuracy

### Challenge 3 — Multilingual Toxic Comments
- **Dataset**: HuggingFace Multilingual Toxicity Dataset (9,000 samples, EN + HI)
- **Labels**: 0 = Non-toxic, 1 = Toxic
- **Model**: TF-IDF (max_features=15000, sublinear_tf=True) → Logistic Regression (C=2.0, class_weight='balanced')
- **Train/Test Split**: 80/20 stratified
- **Metric**: Mean ROC-AUC

## How to Reproduce Results

### Prerequisites
- Python 3.11+
- Node.js 18+
- pip

### Setup & Run

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python train_models.py    # trains all 3 models, saves .pkl files
python app.py             # starts API on port 5000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev               # starts UI on port 3000
```

**Generate Submission CSVs:**
1. Visit http://localhost:3000/dashboard
2. Click "Download All Predictions (ZIP)"
3. Unzip — contains disaster_predictions.csv, fakenews_predictions.csv, toxic_predictions.csv

### Dataset Usage
Place the following files in backend/data/ before running train_models.py:
- Disaster_with_label.csv + Disaster_no_label.csv
- fakenews_with_labels.csv + FakeNews_no_labels.csv
- toxic_labeled.xlsx + toxic_no_label_evaluation.xlsx

(Available from the NeuroLogic '26 official Google Drive)

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Backend API | Flask 3.0, Flask-CORS |
| ML | scikit-learn, TF-IDF, Logistic Regression |
| Data | pandas, numpy, openpyxl, joblib |
| Frontend | React 18, Vite, Tailwind CSS |
| Charts | Chart.js, react-chartjs-2 |
| Animations | Framer Motion |
| Language Detection | langdetect |

## Prediction Files
- `backend/predictions/disaster_predictions.csv` — labels: 0 or 1 (integer)
- `backend/predictions/fakenews_predictions.csv` — labels: "TRUE" or "FALSE" (string)
- `backend/predictions/toxic_predictions.csv` — labels: 0 or 1 (integer)
