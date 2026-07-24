import { useState } from "react";
import Papa from "papaparse";
import { UploadCloud, FileType, AlertCircle, CheckCircle, Orbit, Activity, ShieldCheck } from "lucide-react";
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
        if (!firstRow) {
          setError("The uploaded CSV file appears to be empty.");
          return;
        }

        const requiredKeys = FEATURE_CONFIG.map(f => f.key);
        const missing = requiredKeys.filter(k => !(k in firstRow));

        if (missing.length > 0) {
          setError(`CSV is missing required Kepler columns: ${missing.join(", ")}`);
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
    setError(null);
    try {
      // 1. Filter data to only include the 10 required features
      const cleanData = data.map(row => {
        const cleanRow: any = {};
        FEATURE_CONFIG.forEach(f => {
          cleanRow[f.key] = row[f.key] !== undefined && row[f.key] !== null ? Number(row[f.key]) : 0;
        });
        return cleanRow;
      });

      // 2. Send to Backend
      const response = await predictBatch(cleanData);
      setResults(response.results);
    } catch (err) {
      setError("Failed to process batch. Ensure the backend FastAPI server is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData([]);
    setResults([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-slate-100 relative">
      
      {/* Background space elements */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-slate-950 to-slate-950 z-0"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs mb-3 animate-pulse">
            <Orbit className="w-3.5 h-3.5" /> BATCH DATA LOADER MODULE
          </div>
          <h1 className="text-3xl font-extrabold text-white">Batch Telemetry Scanner</h1>
          <p className="text-slate-400 mt-2 max-w-lg mx-auto text-sm">
            Upload CSV light curve datasets to run parallel classification on multiple exoplanet candidates simultaneously.
          </p>
        </div>

        {/* Upload Box */}
        <div className="bg-slate-900/60 border border-slate-800 backdrop-blur-md rounded-2xl p-8 text-center mb-8 shadow-xl shadow-black/40 relative overflow-hidden group">
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileUpload} 
            className="hidden" 
            id="csv-upload" 
          />
          <label htmlFor="csv-upload" className="cursor-pointer block">
            <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-800 group-hover:border-cyan-500/50 transition-all duration-300 shadow-md">
              <UploadCloud className="w-8 h-8 text-cyan-400 group-hover:scale-105 transition-transform" />
            </div>
            <span className="inline-block bg-gradient-to-r from-cyan-600 to-indigo-600 border border-cyan-500 text-white text-xs font-mono font-bold tracking-wider px-6 py-2.5 rounded-lg hover:from-cyan-500 hover:to-indigo-500 transition-all shadow-md shadow-indigo-500/10">
              UPLOAD TELEMETRY CSV
            </span>
            <p className="text-[10px] text-slate-500 mt-4 font-mono uppercase">
              Drag & drop or click to upload • Max 50 targets per scan
            </p>
          </label>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-950/20 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3 font-mono text-xs shadow-lg">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" /> 
            <div>{error}</div>
          </div>
        )}

        {/* Data Preview & Action Table */}
        {data.length > 0 && (
          <div className="bg-slate-900/60 border border-slate-800 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl shadow-black/40">
            
            {/* Table Header Controls */}
            <div className="p-4 border-b border-slate-800/80 flex justify-between items-center bg-slate-950/50">
              <div className="flex items-center gap-2">
                <FileType className="w-5 h-5 text-cyan-400" />
                <span className="font-mono text-xs font-bold text-slate-300 uppercase">
                  {data.length} Candidate Targets Ready
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 px-4 py-2 rounded-lg text-xs font-mono transition-all"
                >
                  CLEAR
                </button>
                <button 
                  onClick={handleAnalyze}
                  disabled={loading || results.length > 0}
                  className="bg-gradient-to-r from-emerald-600 to-cyan-600 border border-emerald-500 text-white px-5 py-2 rounded-lg text-xs font-mono font-bold tracking-wider hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-emerald-500/10 flex items-center gap-1.5"
                >
                  {loading ? (
                    <>
                      <Activity className="w-3.5 h-3.5 animate-spin" /> SCANNING...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" /> EXECUTE SCANNERS
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase tracking-wider text-[10px] border-b border-slate-850">
                  <tr>
                    <th className="p-4 font-semibold">STATUS</th>
                    <th className="p-4 font-semibold">CONFIDENCE</th>
                    {FEATURE_CONFIG.slice(0, 4).map(f => (
                      <th key={f.key} className="p-4 font-semibold">{f.label.split(" (")[0]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 bg-slate-900/10">
                  {data.map((row, idx) => {
                    const res = results[idx];
                    return (
                      <tr key={idx} className="hover:bg-slate-900/50 transition-colors border-slate-800/40">
                        <td className="p-4">
                          {res ? (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider ${
                              res.label === "CONFIRMED" 
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}>
                              {res.label === "CONFIRMED" ? <CheckCircle className="w-3 h-3"/> : <AlertCircle className="w-3 h-3"/>}
                              {res.label}
                            </span>
                          ) : (
                            <span className="text-slate-500 italic font-mono text-[10px]">Awaiting Uplink...</span>
                          )}
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-200">
                          {res ? (
                            res.label === "ERROR" ? (
                              <span className="text-red-500">FAILED</span>
                            ) : (
                              `${(res.confidence * 100).toFixed(1)}%`
                            )
                          ) : "-"}
                        </td>
                        {FEATURE_CONFIG.slice(0, 4).map(f => (
                          <td key={f.key} className="p-4 text-slate-400 font-mono">
                            {row[f.key] !== undefined && row[f.key] !== null ? Number(row[f.key]).toFixed(4) : "-"}
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