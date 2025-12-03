import joblib
import json
import pandas as pd
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.schemas import PredictionInput, PredictionOutput, BatchPredictionInput, BatchPredictionOutput


model_artifacts = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(current_dir, "models/exoplanet_model.pkl")
    features_path = os.path.join(current_dir, "models/model_features.json")
    
    try:
        if os.path.exists(model_path):
            model_artifacts["model"] = joblib.load(model_path)
            print(f"✅ Model loaded from {model_path}")
        else:
            print(f"❌ Error: Model file not found at {model_path}")

        if os.path.exists(features_path):
            with open(features_path, 'r') as f:
                model_artifacts["features"] = json.load(f)
            print(f"✅ Feature list loaded from {features_path}")
        else:
            print(f"❌ Error: Features file not found at {features_path}")
            
    except Exception as e:
        print(f"❌ Critical Error loading artifacts: {e}")
    
    yield
    

    model_artifacts.clear()

app = FastAPI(title="ExoSeek API", version="1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

@app.get("/")
def home():
    return {"message": "ExoSeek API is running. Go to /docs for the UI."}

@app.post("/predict", response_model=PredictionOutput)
def predict(input_data: PredictionInput):
    # 1. Validation
    if "model" not in model_artifacts or "features" not in model_artifacts:
        raise HTTPException(status_code=500, detail="Model is not loaded properly.")
    
    required_features = model_artifacts["features"]
    input_dict = input_data.features
    

    missing_features = [f for f in required_features if f not in input_dict]
    if missing_features:
        raise HTTPException(status_code=400, detail=f"Missing features: {missing_features}")
        
  
    df = pd.DataFrame([input_dict])
    df = df[required_features] 
    

    model = model_artifacts["model"]
    prediction = model.predict(df)[0]
    
  
    probability = model.predict_proba(df)[0].max()
    
   
    label = "CONFIRMED" if prediction == 1 else "FALSE POSITIVE"
    
    return {
        "label": label,
        "confidence": float(probability),
        "prediction_int": int(prediction)
    }

@app.post("/predict/batch", response_model=BatchPredictionOutput)
def predict_batch(batch_data: BatchPredictionInput):
    if "model" not in model_artifacts or "features" not in model_artifacts:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    required_features = model_artifacts["features"]
    model = model_artifacts["model"]
    
    results = []
    

    for item in batch_data.inputs:
        input_dict = item.features
        

        try:
            df = pd.DataFrame([input_dict])
            df = df[required_features] 
            
            prediction = model.predict(df)[0]
            probability = model.predict_proba(df)[0].max()
            
            results.append({
                "label": "CONFIRMED" if prediction == 1 else "FALSE POSITIVE",
                "confidence": float(probability),
                "prediction_int": int(prediction)
            })
        except Exception as e:

            results.append({
                "label": "ERROR",
                "confidence": 0.0,
                "prediction_int": -1
            })

    return {"results": results}