# 🪐 ExoSeek: Exoplanet Detection & Classification System

ExoSeek is a full-stack, production-ready MLOps application that identifies confirmed exoplanets from NASA Kepler space telescope observations using Machine Learning.

**🔗 Live Website:** [https://exoseek.vercel.app]

---

## 🎨 Key Features

*   **Real-time Analysis (Manual Predictor):** Input individual planetary parameters (e.g., transit duration, orbital period, planet radius, stellar properties) to get instant classifications.
*   **Batch Processing:** Upload large Kepler CSV datasets to run batch predictions on hundreds of candidates simultaneously.
*   **Aesthetic & Interactive Dashboard:** Clean, interactive dark-themed UI built with React, Vite, Tailwind CSS, and custom physical orbital animations.
*   **Robust ML Pipeline:** Versioned using **DVC (Data Version Control)** to manage raw datasets, feature engineering steps, model artifacts, and evaluation metrics.
*   **Production API:** Built with **FastAPI**, featuring automatic Swagger documentation (`/docs`), strict Pydantic validation, and dynamic CORS configuration.

---

## 🏗️ Project Architecture

```
├── .dvc/                   # Data Version Control configuration & cache
├── backend/                # FastAPI Application
│   ├── app/                # Schema definitions & app logic
│   ├── models/             # ML Model & features (versioned by DVC)
│   ├── main.py             # FastAPI entry point
│   ├── vercel.json         # Vercel Serverless routing config
│   └── requirements.txt    # Python dependencies
├── frontend/               # React + TypeScript + Vite UI
│   ├── src/                # Frontend source code (pages, components, utilities)
│   ├── vercel.json         # Vercel SPA rewrite configuration
│   └── package.json        # Frontend dependencies
├── training_pipeline/      # Scikit-Learn model training scripts
│   └── src/                # Ingestion, preprocessing, engineering, training scripts
├── dvc.yaml                # DVC pipeline stages definitions
└── docker-compose.yml      # Docker Compose setup for local containerization
```

---

## 🚀 Quick Start (Docker)

The fastest way to spin up the entire application locally is using Docker Compose:

```bash
# 1. Clone the repository
git clone https://github.com/abhi6174/ExoSeek.git
cd ExoSeek

# 2. Run containers
docker compose up --build
```

Access the services:
*   **Frontend Dashboard:** [http://localhost:3000]
*   **Backend API Docs:** [http://localhost:8000/docs]

---

## 🔧 Manual Local Setup

### 1. Backend Setup
Make sure you have Python 3.10+ installed:

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Create .env file
echo "FRONTEND_URL=http://localhost:5173" > .env

# Run FastAPI server
uvicorn main:app --reload
```

### 2. Frontend Setup
Make sure you have Node.js 18+ installed:

```bash
cd frontend

# Install packages
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env

# Start development server
npm run dev
```

---

## 📊 ML Pipeline Stages (DVC)

The model lifecycle is tracked stage-by-stage in `dvc.yaml`:

1.  **`data_ingestion`**: Downloads/imports raw Kepler dataset.
2.  **`data_preprocessing`**: Cleans missing data, maps targets, and prepares clean records.
3.  **`feature_engineering`**: Extracts selected features and splits data into Train/Test sets.
4.  **`model_training`**: Trains a Random Forest Classifier using Scikit-Learn.
5.  **`model_evaluation`**: Evaluates model performance and saves the results to `metrics.json`.