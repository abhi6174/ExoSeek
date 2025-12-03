from pydantic import BaseModel
from typing import Dict,List

class PredictionInput(BaseModel):
    features: Dict[str,float]

class PredictionOutput(BaseModel):
    label: str
    confidence: float
    prediction_int : int
    
class BatchPredictionInput(BaseModel):
    inputs: List[PredictionInput]

class BatchPredictionOutput(BaseModel):
    results: List[PredictionOutput]