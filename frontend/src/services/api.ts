import type { ExoFeatures, PredictionResponse } from "../types/ExoTypes";

const API_URL = import.meta.env.VITE_API_URL

export const predictExoplanet = async (features: ExoFeatures): Promise<PredictionResponse> => {
  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ features }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Prediction failed");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const predictBatch = async (featuresList: any[]): Promise<any> => {
  try {
    // Transform simple list to the shape Backend expects: { inputs: [ {features: ...}, ... ] }
    const payload = {
      inputs: featuresList.map(f => ({ features: f }))
    };

    const response = await fetch(`${API_URL}/predict/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Batch prediction failed");
    return await response.json();
  } catch (error) {
    console.error("Batch API Error:", error);
    throw error;
  }
};
