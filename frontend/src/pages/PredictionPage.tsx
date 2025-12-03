import { useState } from "react";
import { FEATURE_CONFIG } from "../utils/formConfig";
import { predictExoplanet } from "../services/api";
import type { ExoFeatures, PredictionResponse } from "../types/ExoTypes";
import ResultCard from "../components/ResultCard";

const PredictionPage = () => {
  // 1. Initialize State dynamically from our Config
  const [formData, setFormData] = useState<ExoFeatures>(() => {
    const initial: any = {};
    FEATURE_CONFIG.forEach((feature) => {
      initial[feature.key] = feature.defaultValue;
    });
    return initial;
  });

  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Handle Input Changes
  const handleChange = (key: keyof ExoFeatures, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: parseFloat(value),
    }));
  };

  // 3. Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await predictExoplanet(formData);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong connecting to the AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
            ExoSeek <span className="text-indigo-600">AI</span>
          </h1>
          <p className="text-lg text-slate-600">
            Enter the Keplar data parameters below to detect exoplanet candidates.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Dynamic Grid Layout for 10 Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {FEATURE_CONFIG.map((feature) => (
                  <div key={feature.key} className="relative group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {feature.label}
                    </label>
                    <input
                      type="number"
                      step={feature.step}
                      required
                      value={formData[feature.key]}
                      onChange={(e) => handleChange(feature.key, e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border hover:border-indigo-300 transition-colors"
                    />
                    <p className="mt-1 text-xs text-gray-400 group-hover:text-indigo-500 transition-colors">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-md text-sm text-center">
                  ⚠️ {error}
                </div>
              )}

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all
                  ${loading 
                    ? "bg-indigo-400 cursor-not-allowed" 
                    : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5"
                  }`}
              >
                {loading ? "Analyzing Light Curves..." : "Analyze Candidate"}
              </button>
            </form>

            {/* Result Section */}
            {result && <ResultCard result={result} />}
          </div>
        </div>
        
        <p className="text-center text-slate-400 text-xs mt-8">
          Powered by Scikit-Learn • FastAPI • React
        </p>
      </div>
    </div>
  );
};

export default PredictionPage;