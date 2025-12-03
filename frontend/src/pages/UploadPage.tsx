import { useState } from "react";
import Papa from "papaparse";
import { UploadCloud, FileType, AlertCircle, CheckCircle } from "lucide-react";
import { predictBatch } from "../services/api";
import { FEATURE_CONFIG } from "../utils/formConfig";

const UploadPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setResults([]);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true, // Auto-convert numbers
      complete: (result) => {
        // Basic validation: Check if required columns exist
        const firstRow = result.data[0] as object;
        const requiredKeys = FEATURE_CONFIG.map(f => f.key);
        const missing = requiredKeys.filter(k => !(k in firstRow));

        if (missing.length > 0) {
          setError(`CSV is missing columns: ${missing.join(", ")}`);
          return;
        }

        // Take first 50 rows for demo performance
        setData(result.data.slice(0, 50)); 
      },
      error: (err) => setError("Failed to parse CSV: " + err.message)
    });
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      // 1. Filter data to only include the 10 required features
      const cleanData = data.map(row => {
        const cleanRow: any = {};
        FEATURE_CONFIG.forEach(f => {
          cleanRow[f.key] = row[f.key] || 0; // Default to 0 if missing
        });
        return cleanRow;
      });

      // 2. Send to Backend
      const response = await predictBatch(cleanData);
      setResults(response.results);
    } catch (err) {
      setError("Failed to process batch. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900">Batch Analysis</h1>
          <p className="text-slate-600 mt-2">Upload a CSV to process multiple candidates at once.</p>
        </div>

        {/* Upload Box */}
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center border-2 border-dashed border-indigo-100 mb-8">
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileUpload} 
            className="hidden" 
            id="csv-upload" 
          />
          <label htmlFor="csv-upload" className="cursor-pointer">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <UploadCloud className="w-8 h-8 text-indigo-600" />
            </div>
            <span className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Select CSV File
            </span>
            <p className="text-xs text-slate-400 mt-4">Max 50 rows for demo</p>
          </label>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}

        {/* Data Preview & Action */}
        {data.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <FileType className="w-5 h-5 text-slate-500" />
                <span className="font-semibold text-slate-700">{data.length} Candidates Loaded</span>
              </div>
              <button 
                onClick={handleAnalyze}
                disabled={loading || results.length > 0}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Processing..." : "Run AI Model"}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-600 uppercase tracking-wider text-xs">
                  <tr>
                    <th className="p-4">Status</th>
                    <th className="p-4">Confidence</th>
                    {FEATURE_CONFIG.slice(0, 4).map(f => (
                      <th key={f.key} className="p-4">{f.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((row, idx) => {
                    const res = results[idx];
                    return (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          {res ? (
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                              res.label === "CONFIRMED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}>
                              {res.label === "CONFIRMED" ? <CheckCircle className="w-3 h-3"/> : <AlertCircle className="w-3 h-3"/>}
                              {res.label}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Pending...</span>
                          )}
                        </td>
                        <td className="p-4 font-mono">
                          {res ? `${(res.confidence * 100).toFixed(1)}%` : "-"}
                        </td>
                        {FEATURE_CONFIG.slice(0, 4).map(f => (
                          <td key={f.key} className="p-4 text-slate-600">
                            {Number(row[f.key]).toFixed(2)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;