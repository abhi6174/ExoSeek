# 🪐 ExoSeek: Exoplanet Detection System

ExoSeek is a full-stack MLOps application that identifies confirmed exoplanets from NASA Kepler telescope data using Machine Learning.

## 🏗️ Architecture

* **Pillar 1: The Lab (ML Pipeline)** - Scikit-Learn Random Forest model with DVC versioning.
* **Pillar 2: The Engine (Backend)** - FastAPI serving real-time predictions.
* **Pillar 3: The Cockpit (Frontend)** - React + TypeScript + Tailwind CSS UI.
* **Pillar 4: Deployment** - Fully containerized with Docker & Docker Compose.

## 🚀 Quick Start (Docker)

The easiest way to run the application is using Docker Compose.

```bash
# 1. Clone the repository
git clone [https://github.com/YOUR_USERNAME/ExoSeek.git](https://github.com/YOUR_USERNAME/ExoSeek.git)
cd ExoSeek

# 2. Start the application
docker compose up --build

Access the application at: http://localhost:3000

🔧 Manual Setup
Backend
Bash

cd backend
pip install -r requirements.txt
uvicorn main:app --reload
Frontend
Bash

cd frontend
npm install
npm run dev
📊 Features
Real-time Analysis: Instant classification of light curve data.

Batch Processing: Upload CSV files to analyze hundreds of candidates at once.

Confidence Scoring: Returns probability scores for every prediction.