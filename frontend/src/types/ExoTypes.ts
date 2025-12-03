// 10 Features our Model needs
export interface ExoFeatures {
    koi_period: number;
    koi_duration_err1: number;
    koi_duration_err2: number;
    koi_prad: number;
    koi_prad_err1: number;
    koi_prad_err2: number;
    koi_insol_err1: number;
    koi_model_snr: number;
    koi_steff_err1: number;
    koi_steff_err2: number;
}

//  Response to expect from FastAPI
export interface PredictionResponse {
    label: "CONFIRMED" | "FALSE POSITIVE";
    confidence: number;
    prediction_int: 0 | 1;
}

//  Helper for the Input Form (Label + Description)
export interface FeatureMetadata {
    key: keyof ExoFeatures;
    label: string;
    description: string;
    step: string; 
    defaultValue: number;
}