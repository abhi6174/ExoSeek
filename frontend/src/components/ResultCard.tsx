import type { PredictionResponse } from "../types/ExoTypes";

interface ResultCardProps {
  result: PredictionResponse;
}

const ResultCard = ({ result }: ResultCardProps) => {
  const isConfirmed = result.label === "CONFIRMED";

  return (
    <div className={`mt-8 p-6 rounded-xl border-2 shadow-lg text-center transform transition-all duration-500 hover:scale-105 ${
      isConfirmed 
        ? "bg-green-50 border-green-400 shadow-green-100" 
        : "bg-red-50 border-red-400 shadow-red-100"
    }`}>
      <h2 className="text-gray-500 uppercase tracking-wider text-sm font-semibold mb-2">
        Analysis Result
      </h2>
      
      <div className={`text-4xl font-extrabold mb-4 ${
        isConfirmed ? "text-green-700" : "text-red-700"
      }`}>
        {result.label}
      </div>

      <div className="flex justify-center items-center gap-4 text-gray-700">
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          <span className="block text-xs text-gray-400 uppercase">Confidence</span>
          <span className="font-mono font-bold text-xl">
            {(result.confidence * 100).toFixed(1)}%
          </span>
        </div>
        
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          <span className="block text-xs text-gray-400 uppercase">AI Class</span>
          <span className="font-mono font-bold text-xl">
            {result.prediction_int}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;