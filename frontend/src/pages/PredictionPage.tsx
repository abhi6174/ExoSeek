import React, { useState, useEffect, useRef } from "react";
import { FEATURE_CONFIG } from "../utils/formConfig";
import { predictExoplanet } from "../services/api";
import type { ExoFeatures, PredictionResponse } from "../types/ExoTypes";
import { EXOPLANET_PRESETS } from "../utils/presetData";
import type { ExoplanetPreset } from "../utils/presetData";
import { calculatePhysicalProperties } from "../utils/physics";
import { 
  Sparkles, 
  HelpCircle, 
  Orbit, 
  ChevronRight, 
  Compass, 
  Activity, 
  RotateCcw, 
  Thermometer, 
  Globe, 
  Weight, 
  Space, 
  MessageSquare,
  Bot
} from "lucide-react";

// Range limits for each feature key for clean sliders
const getFeatureRange = (key: string) => {
  switch (key) {
    case "koi_period": return { min: 0.5, max: 400, step: 0.1 };
    case "koi_prad": return { min: 0.2, max: 20, step: 0.05 };
    case "koi_model_snr": return { min: 2.0, max: 200, step: 0.5 };
    case "koi_duration_err1": return { min: 0.001, max: 0.5, step: 0.001 };
    case "koi_duration_err2": return { min: -0.5, max: -0.001, step: 0.001 };
    case "koi_prad_err1": return { min: 0.0, max: 3.0, step: 0.01 };
    case "koi_prad_err2": return { min: -3.0, max: 0.0, step: 0.01 };
    case "koi_insol_err1": return { min: 0.0, max: 500, step: 0.1 };
    case "koi_steff_err1": return { min: 0.0, max: 250, step: 1 };
    case "koi_steff_err2": return { min: -250, max: 0.0, step: 1 };
    default: return { min: 0, max: 100, step: 1 };
  }
};

const PredictionPage = () => {
  // 1. Initial State
  const [formData, setFormData] = useState<ExoFeatures>(() => {
    const initial: any = {};
    FEATURE_CONFIG.forEach((feature) => {
      initial[feature.key] = feature.defaultValue;
    });
    return initial;
  });

  const [selectedPresetId, setSelectedPresetId] = useState<string>("custom");
  const [stellarLuminosity, setStellarLuminosity] = useState<number>(1.0); // Default Sun-like
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. AI Explorer Terminal state
  const [terminalText, setTerminalText] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // 3. Animation Phase for Light Curve scanning
  const [scanOffset, setScanOffset] = useState(0);

  // Physics properties calculated dynamically in real-time
  const physics = calculatePhysicalProperties(
    formData.koi_period, 
    formData.koi_prad, 
    stellarLuminosity
  );

  // Synchronize Scan Offset animation
  useEffect(() => {
    let animationFrameId: number;
    const update = () => {
      setScanOffset((prev) => (prev + 1) % 400);
      animationFrameId = requestAnimationFrame(update);
    };
    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Scroll terminal logs to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalText, chatMessages]);

  // 4. Handle Input Changes
  const handleFeatureChange = (key: keyof ExoFeatures, value: number) => {
    setSelectedPresetId("custom"); // Override preset flag
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Reset form to defaults
  const handleReset = () => {
    const initial: any = {};
    FEATURE_CONFIG.forEach((feature) => {
      initial[feature.key] = feature.defaultValue;
    });
    setFormData(initial);
    setStellarLuminosity(1.0);
    setSelectedPresetId("custom");
    setResult(null);
    setTerminalText([]);
    setChatMessages([]);
  };

  // Load a Kepler preset candidate
  const handleLoadPreset = (preset: ExoplanetPreset) => {
    setSelectedPresetId(preset.id);
    setFormData(preset.features);
    
    // Set stellar luminosity approximation for known planets
    let lum = 1.0;
    if (preset.id === "kepler-22b") lum = 0.79;
    else if (preset.id === "kepler-186f") lum = 0.055;
    else if (preset.id === "kepler-16b") lum = 0.148;
    else if (preset.id === "koi-256") lum = 0.01; // Red dwarf baseline
    else if (preset.id === "kepler-10b") lum = 1.0;
    setStellarLuminosity(lum);

    // Clear previous results & chat
    setResult(null);
    setTerminalText([]);
    setChatMessages([]);
  };

  // 5. Submit prediction parameters to the backend ML model
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setTerminalText([]);
    setChatMessages([]);
    setIsTyping(true);

    try {
      const data = await predictExoplanet(formData);
      setResult(data);
      triggerTerminalSequence(data);
    } catch (err: any) {
      setError(err.message || "Failed to establish uplink with ExoSeek Neural Core. Verify backend status.");
      setIsTyping(false);
    } finally {
      setLoading(false);
    }
  };

  // Typewriter sequence for terminal log output
  const triggerTerminalSequence = (pred: PredictionResponse) => {
    const logs = [
      `Initializing telemetry feed scan for target sector...`,
      `Orbital period detected: ${formData.koi_period.toFixed(4)} Earth days.`,
      `Transit signal strength (SNR): ${formData.koi_model_snr.toFixed(1)}.`,
      `Computed transit depth signature shows planetary radius of ${formData.koi_prad.toFixed(2)}x Earth radii.`,
      `Estimated semi-major axis: ${physics.semiMajorAxis.toFixed(3)} AU.`,
      `Stellar irradiance calculated: ${physics.estimatedInsolation.toFixed(2)}x solar flux.`,
      `Atmospheric equilibrium temperature estimation: ${physics.equilibriumTemp.toFixed(0)} K (${physics.equilibriumTempC.toFixed(0)}°C).`,
      `Running Random Forest classifiers across NASA Kepler database...`,
      `>> TELEMETRY CLASSIFICATION RESULT: [${pred.label}]`,
      `>> CLASSIFIER CONFIDENCE LEVEL: ${(pred.confidence * 100).toFixed(1)}%`,
      pred.label === "CONFIRMED" 
        ? `PLANETARY SYSTEM LOCKED. Planet Class: ${physics.planetClass}. Habitability index: ${(physics.earthSimilarityIndex * 100).toFixed(0)}% (${physics.habitableZoneStatus} Zone).`
        : `CLASSIFIED AS ANOMALY / FALSE POSITIVE. Signal suggests Stellar Eclipsing Binary or high camera noise.`,
      `Survey log completed. AI Exo-Explorer agent ready for query.`
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setTerminalText((prev) => [...prev, logs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 450);
  };

  // Handle preset assistant chat questions
  const handleChatQuestion = (questionKey: "atmosphere" | "surface" | "life") => {
    if (isTyping) return;
    
    let questionText = "";
    let answerText = "";

    if (questionKey === "atmosphere") {
      questionText = "Analyze atmospheric composition and potential gases.";
    } else if (questionKey === "surface") {
      questionText = "What are the surface characteristics and gravity conditions?";
    } else if (questionKey === "life") {
      questionText = "Assess biological habitability and search for biosignatures.";
    }

    // Check if we loaded a preset
    const preset = EXOPLANET_PRESETS.find(p => p.id === selectedPresetId);
    if (preset) {
      answerText = preset.chatResponses[questionKey];
    } else {
      // Dynamic response for custom inputs based on physical calculations
      if (result?.label === "FALSE POSITIVE") {
        answerText = "Uplink report confirms this is a False Positive signal (non-planetary). No atmosphere, surface, or habitable metrics are valid because the transit signal is likely caused by an eclipsing companion star or instrumental telemetry noise.";
      } else {
        if (questionKey === "atmosphere") {
          answerText = `This ${physics.planetClass} orbits its star in ${formData.koi_period.toFixed(1)} days. Given its equilibrium temperature of ${physics.equilibriumTempC.toFixed(0)}°C, ` + 
            (physics.equilibriumTemp > 350 
              ? "gases like water vapor would completely boil off. The atmosphere is likely dry, thick with vaporized metals or depleted entirely by solar winds." 
              : physics.equilibriumTemp < 190 
              ? "its atmosphere is severely frozen, potentially locking carbon dioxide and nitrogen into surface sheets of dry ice."
              : "it could retain a stable nitrogen-oxygen envelope, though a high greenhouse gas count would be required to prevent global glaciation.");
        } else if (questionKey === "surface") {
          answerText = `With a planetary radius of ${formData.koi_prad.toFixed(1)}x Earth, the surface gravity is approximately ${physics.surfaceGravity.toFixed(1)}g. ` +
            (formData.koi_prad > 3.0 
              ? "Being a Gas/Mini-Neptune giant, it has no solid ground. Heavy gravity and crushing hydrogen-helium pressures increase as you descend toward a superheated core." 
              : `This is a rocky candidate. Running on a solid core, standing on its surface would feel like carrying ${(physics.surfaceGravity).toFixed(1)} times your weight. Volcanic formations are highly probable.`);
        } else if (questionKey === "life") {
          answerText = `The planet features an Earth Similarity Index (ESI) of ${(physics.earthSimilarityIndex * 100).toFixed(0)}%. ` +
            (physics.habitableZoneStatus === "Conservative" 
              ? "Liquid surface water is highly stable here! Biosignature analysis indicates optimal conditions for microbial or plant life adaptation. Photosynthesis potential is green."
              : physics.habitableZoneStatus === "Optimistic"
              ? "It lies in the optimistic margins of habitability. Subsurface oceans under sheet ice or warm thermal vents near the poles offer high biological incubation possibilities."
              : "Surface liquid water is completely unstable due to extreme temperatures. Biological development would require highly sheltered subterranean vents away from stellar radiation.");
        }
      }
    }

    setChatMessages((prev) => [
      ...prev,
      { sender: "user", text: questionText },
      { sender: "bot", text: answerText }
    ]);
  };

  // Generate real-time SVG Path for Light Curve
  const generateLightCurvePoints = () => {
    const points: string[] = [];
    const width = 400;
    
    // Scale period to determine number of transit dips in the graph window
    // Period range: 0.5 (many transits) to 400 (one transit or none)
    const freq = Math.max(1, Math.min(5, 30 / formData.koi_period)); 
    
    // Dip depth relative to planetary radius (larger radius = deeper transit dip)
    const transitDepth = Math.min(45, Math.pow(formData.koi_prad, 1.2) * 2.2);
    
    // Transit duration width relative to period length (roughly 8% of orbit path)
    const transitWidth = 0.08; 
    
    // Signal Noise amplitude (lower SNR = higher distortion)
    const noiseAmplitude = Math.max(0, 10 - Math.log(formData.koi_model_snr) * 2);

    for (let x = 0; x <= width; x++) {
      const xNormalized = x / width;
      const wave = (xNormalized * freq) % 1; // values 0 to 1
      
      let y = 45; // Baseline y position (representing 100% star brightness)

      // Calculate dip (planet block star light) at phase centered around 0.5
      const distanceToCenter = Math.abs(wave - 0.5);
      if (distanceToCenter < transitWidth / 2) {
        const normDist = distanceToCenter / (transitWidth / 2); // 0 to 1
        // Smooth transit curve using cosine curve interpolation
        const dipFactor = Math.cos(normDist * Math.PI / 2);
        y += transitDepth * dipFactor;
      }

      // Add noise fluctuations
      const randomNoise = (Math.sin(x * 0.9) * 0.4 + (Math.random() - 0.5) * 1.6) * noiseAmplitude;
      y += randomNoise;

      points.push(`${x},${y}`);
    }

    return points.join(" ");
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Background space elements */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/60 via-slate-950 to-slate-950 z-0"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono text-xs mb-3 animate-pulse">
            <Orbit className="w-3.5 h-3.5" /> SYSTEM RADAR DECK ACTIVATED
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
            Exoplanet Detection <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 font-extrabold">Control Deck</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto">
            Input Kepler light curve parameters manually, select preset targets, and let the ExoSeek neural network determine exoplanet status.
          </p>
        </div>

        {/* SECTION 1: PRESET SELECTOR CATALOG */}
        <div className="mb-10">
          <h2 className="text-xs font-mono tracking-widest text-cyan-400 uppercase mb-4 flex items-center gap-1.5">
            <Compass className="w-4 h-4" /> SELECT TARGET TELEMETRY PRESET
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {EXOPLANET_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleLoadPreset(preset)}
                className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                  selectedPresetId === preset.id
                    ? "bg-slate-900 border-cyan-400/80 shadow-md shadow-cyan-500/10"
                    : "bg-slate-900/40 border-slate-800 hover:bg-slate-900/80 hover:border-slate-700"
                }`}
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="font-bold text-sm text-slate-100 group-hover:text-cyan-400 transition-colors">
                  {preset.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1 uppercase">
                  {preset.classLabel}
                </div>
                <div className="text-[9px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                  {preset.description}
                </div>
                {selectedPresetId === preset.id && (
                  <div className="absolute bottom-1 right-2 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></div>
                )}
              </button>
            ))}
            
            <button
              onClick={handleReset}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                selectedPresetId === "custom"
                  ? "bg-slate-900 border-indigo-500 shadow-md shadow-indigo-500/10"
                  : "bg-slate-900/20 border-slate-800 hover:bg-slate-900/40 hover:border-slate-800"
              }`}
            >
              <div className="font-bold text-sm text-slate-300 flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-indigo-400" /> Reset Manual
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-1">CUSTOM SETUP</div>
              <div className="text-[9px] text-slate-500 mt-1 leading-snug">
                Configure parameters manually via sliders.
              </div>
            </button>
          </div>
        </div>

        {/* MAIN DECK CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT TELEMETRY COLUMN (Sliders & Light curve) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. VISUALIZER PANEL */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden shadow-xl shadow-black/40">
              <h2 className="text-xs font-mono tracking-widest text-cyan-400 uppercase mb-4 flex items-center gap-1.5">
                <Activity className="w-4 h-4" /> Live Light-Curve & Orbit Simulator
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Orbit animation (4 columns) */}
                <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-slate-950/70 border border-slate-900 rounded-xl min-h-[140px] relative overflow-hidden">
                  <div className="text-[10px] font-mono text-slate-500 absolute top-2 left-2 uppercase">Orbit Model</div>
                  
                  {/* Glowing host star */}
                  <div 
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-yellow-300 shadow-2xl relative z-10 flex items-center justify-center"
                    style={{
                      boxShadow: `0 0 ${Math.min(40, 10 + formData.koi_prad * 2)}px rgba(251, 146, 60, 0.8)`,
                      filter: `hue-rotate(${Math.min(30, Math.max(-60, (5000 - 5778) / 100))}deg)`
                    }}
                  ></div>

                  {/* Elliptical orbital path */}
                  <div 
                    className="absolute border border-slate-800 border-dashed rounded-full pointer-events-none"
                    style={{
                      width: `${Math.max(50, Math.min(100, 50 + (formData.koi_period / 4)))}px`,
                      height: `${Math.max(30, Math.min(60, 30 + (formData.koi_period / 8)))}px`,
                    }}
                  >
                    {/* Planet revolving along orbit */}
                    <div 
                      className="absolute rounded-full bg-slate-400 shadow-sm"
                      style={{
                        width: `${Math.max(3, Math.min(12, 2 + formData.koi_prad * 0.6))}px`,
                        height: `${Math.max(3, Math.min(12, 2 + formData.koi_prad * 0.6))}px`,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        animation: `spin ${Math.max(0.4, Math.min(8, formData.koi_period / 12))}s linear infinite`,
                        transformOrigin: '0% 0%',
                        offsetPath: `path('M -35,0 A 35,18 0 1,1 35,0 A 35,18 0 1,1 -35,0')`,
                        offsetDistance: '0%'
                      }}
                    >
                      {/* Planet ring for gas giant */}
                      {formData.koi_prad > 5 && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-1 border border-slate-500 rounded-full rotate-12 opacity-80 pointer-events-none"></div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-[10px] font-mono text-slate-400 mt-5 uppercase">
                    Rp: <span className="text-cyan-400 font-bold">{formData.koi_prad.toFixed(2)} R⊕</span>
                  </div>
                </div>

                {/* Light Curve Graph (8 columns) */}
                <div className="md:col-span-8 flex flex-col justify-center p-3 bg-slate-950/70 border border-slate-900 rounded-xl relative">
                  <div className="text-[10px] font-mono text-slate-500 absolute top-2 left-2 uppercase">Relative Flux Intensity</div>
                  <div className="text-[9px] font-mono text-slate-600 absolute bottom-2 right-2">Time (Days)</div>
                  
                  {/* Graph Render */}
                  <svg className="w-full h-[100px] overflow-visible mt-4" viewBox="0 0 400 110">
                    {/* Normal brightness dashed line */}
                    <line x1="0" y1="45" x2="400" y2="45" stroke="#334155" strokeDasharray="3 3" />
                    
                    {/* Plotted light curve */}
                    <polyline
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={generateLightCurvePoints()}
                      style={{ filter: "drop-shadow(0 0 2px rgba(34, 211, 238, 0.4))" }}
                    />

                    {/* Vertical scanning line */}
                    <line
                      x1={scanOffset}
                      y1="0"
                      x2={scanOffset}
                      y2="110"
                      stroke="rgba(168, 85, 247, 0.5)"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                    />

                    {/* Scanner glow point */}
                    <circle
                      cx={scanOffset}
                      cy="45"
                      r="4"
                      fill="#a855f7"
                      className="animate-pulse"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* 2. PARAMETERS FORM CONFIG */}
            <form onSubmit={handleSubmit} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl shadow-black/40">
              <h2 className="text-xs font-mono tracking-widest text-cyan-400 uppercase mb-5 flex items-center gap-1.5">
                <Orbit className="w-4 h-4" /> Telemetry Control Deck
              </h2>

              <div className="space-y-6">
                
                {/* CATEGORY 1: PLANETARY METRICS */}
                <div>
                  <h3 className="text-[10px] font-mono tracking-widest text-slate-400 uppercase border-b border-slate-800 pb-1 mb-4">
                    PLANETARY ORBITAL TELEMETRY
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {FEATURE_CONFIG.slice(0, 3).map((feature) => {
                      const { min, max, step } = getFeatureRange(feature.key);
                      return (
                        <div key={feature.key} className="space-y-1 bg-slate-950/30 p-3 rounded-xl border border-slate-900/60">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-semibold text-slate-300">
                              {feature.label}
                            </label>
                            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-900/20">
                              {formData[feature.key]}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={min}
                            max={max}
                            step={step}
                            value={formData[feature.key]}
                            onChange={(e) => handleFeatureChange(feature.key, parseFloat(e.target.value))}
                            className="w-full accent-cyan-400 cursor-pointer bg-slate-800 h-1.5 rounded-lg appearance-none"
                          />
                          <p className="text-[9px] text-slate-500 leading-snug">
                            {feature.description}
                          </p>
                        </div>
                      );
                    })}

                    {/* Stellar Luminosity Slider (extra physics feature helper) */}
                    <div className="space-y-1 bg-slate-950/30 p-3 rounded-xl border border-slate-900/60">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-slate-300">
                          Stellar Luminosity (L☉)
                        </label>
                        <span className="text-xs font-mono font-bold text-orange-400 bg-orange-950/30 px-2 py-0.5 rounded border border-orange-900/20">
                          {stellarLuminosity.toFixed(3)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.01"
                        max="3.0"
                        step="0.01"
                        value={stellarLuminosity}
                        onChange={(e) => {
                          setSelectedPresetId("custom");
                          setStellarLuminosity(parseFloat(e.target.value));
                        }}
                        className="w-full accent-orange-400 cursor-pointer bg-slate-800 h-1.5 rounded-lg appearance-none"
                      />
                      <p className="text-[9px] text-slate-500 leading-snug">
                        Luminosity of host star relative to our Sun (L☉). Used for temperature calculation.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CATEGORY 2: MEASUREMENT ERRORS / TELEMETRY UNCERTAINTIES */}
                <div>
                  <h3 className="text-[10px] font-mono tracking-widest text-slate-400 uppercase border-b border-slate-800 pb-1 mb-4 flex justify-between items-center">
                    <span>TELEMETRY ERROR CHANNELS</span>
                    <span className="text-[8px] text-slate-500 normal-case">(Affects AI Classifier Confidence)</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {FEATURE_CONFIG.slice(3).map((feature) => {
                      const { min, max, step } = getFeatureRange(feature.key);
                      return (
                        <div key={feature.key} className="space-y-1 bg-slate-950/20 p-2.5 rounded-lg border border-slate-900/40">
                          <div className="flex justify-between items-center">
                            <label className="text-[11px] text-slate-400">
                              {feature.label}
                            </label>
                            <span className="text-[10px] font-mono text-slate-300">
                              {formData[feature.key] > 0 ? `+${formData[feature.key]}` : formData[feature.key]}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={min}
                            max={max}
                            step={step}
                            value={formData[feature.key]}
                            onChange={(e) => handleFeatureChange(feature.key, parseFloat(e.target.value))}
                            className="w-full accent-slate-500 cursor-pointer bg-slate-800 h-1 rounded appearance-none"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Submit Trigger */}
              <div className="mt-8 flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-4 px-6 rounded-xl text-sm font-bold font-mono tracking-widest text-white transition-all transform duration-200 border flex items-center justify-center gap-2
                    ${loading 
                      ? "bg-slate-800 border-slate-700 cursor-not-allowed text-slate-500" 
                      : "bg-gradient-to-r from-cyan-600 to-indigo-600 border-cyan-500 hover:from-cyan-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 active:translate-y-0"
                    }`}
                >
                  {loading ? (
                    <>
                      <Activity className="w-5 h-5 animate-spin text-cyan-400" />
                      ANALYZING TELEMETRY FEED...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                      RUN AI CLASSIFIER
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl transition-all"
                  title="Reset form"
                >
                  <RotateCcw className="w-5 h-5 text-slate-400" />
                </button>
              </div>

            </form>
          </div>

          {/* RIGHT SCREEN COLUMN (Classification & Sci-Fi HUD) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* NO RESULTS HUD PLACEHOLDER */}
            {!result && !loading && !error && (
              <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 bg-slate-950 rounded-full flex items-center justify-center border border-slate-800/80 mb-4 text-cyan-500/50">
                  <Activity className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="font-mono text-sm tracking-widest text-cyan-400 uppercase mb-2">UPLINK SYSTEM IDLE</h3>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                  The neural core is awaiting Kepler planetary telemetry parameters. Select a preset or adjust sliders and press <span className="text-cyan-400">RUN AI CLASSIFIER</span>.
                </p>
              </div>
            )}

            {/* ERROR DISPLAY */}
            {error && (
              <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-6 text-center text-red-400 font-mono text-xs shadow-lg">
                <HelpCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
                {error}
              </div>
            )}

            {/* DYNAMIC RESULTS SCREEN */}
            {(result || isTyping) && (
              <div className="space-y-6">
                
                {/* 1. CLASSIFICATION MAIN HUD */}
                {result && (
                  <div className={`p-6 rounded-2xl border-2 shadow-xl backdrop-blur-md relative overflow-hidden transition-all duration-700 ${
                    result.label === "CONFIRMED"
                      ? "bg-slate-900/80 border-emerald-500/40 shadow-emerald-500/5"
                      : "bg-slate-900/80 border-red-500/40 shadow-red-500/5"
                  }`}>
                    {/* Glowing corner indicator */}
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-20 pointer-events-none ${
                      result.label === "CONFIRMED" ? "from-emerald-500 to-transparent" : "from-red-500 to-transparent"
                    }`}></div>

                    <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-1.5">
                      CLASSIFICATION REPORT
                    </div>

                    <div className={`text-3xl font-black tracking-wider uppercase mb-4 flex items-center gap-2 ${
                      result.label === "CONFIRMED" ? "text-emerald-400" : "text-red-400"
                    }`}>
                      {result.label}
                      <span className="inline-flex w-2.5 h-2.5 rounded-full bg-current animate-ping"></span>
                    </div>

                    {/* Progress score bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                        <span>CLASSIFIER CONFIDENCE</span>
                        <span className="font-bold">{(result.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            result.label === "CONFIRMED" ? "bg-emerald-400" : "bg-red-400"
                          }`}
                          style={{ width: `${result.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center mt-2">
                      <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl">
                        <span className="block text-[9px] font-mono text-slate-500 uppercase">Neural Label</span>
                        <span className="font-mono text-sm font-bold text-slate-300">
                          ID: {result.prediction_int}
                        </span>
                      </div>
                      <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl">
                        <span className="block text-[9px] font-mono text-slate-500 uppercase">Telemetry status</span>
                        <span className="font-mono text-sm font-bold text-slate-300">
                          NOMINAL
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. DYNAMIC SCIENCE METRICS (Only show if CONFIRMED exoplanet) */}
                {result && result.label === "CONFIRMED" && (
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-lg space-y-4">
                    <h3 className="text-xs font-mono tracking-widest text-cyan-400 uppercase border-b border-slate-850 pb-1 mb-2">
                      DERIVED PHYSICS PROFILE
                    </h3>

                    {/* Physical property grid */}
                    <div className="grid grid-cols-2 gap-4">
                      
                      {/* Temp Dial */}
                      <div className="bg-slate-950/50 border border-slate-900 p-3 rounded-xl flex items-center gap-3">
                        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400 border border-orange-500/20">
                          <Thermometer className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="block text-[9px] font-mono text-slate-500 uppercase">Equilibrium Temp</span>
                          <span className="font-mono font-bold text-sm text-slate-200">
                            {physics.equilibriumTempC.toFixed(0)}°C
                          </span>
                          <span className="block text-[8px] text-slate-500 font-mono">
                            {physics.equilibriumTemp.toFixed(0)} K
                          </span>
                        </div>
                      </div>

                      {/* Gravity */}
                      <div className="bg-slate-950/50 border border-slate-900 p-3 rounded-xl flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
                          <Weight className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="block text-[9px] font-mono text-slate-500 uppercase">Surface Gravity</span>
                          <span className="font-mono font-bold text-sm text-slate-200">
                            {physics.surfaceGravity.toFixed(1)} g
                          </span>
                          <span className="block text-[8px] text-slate-500 font-mono">
                            Relative to Earth
                          </span>
                        </div>
                      </div>

                      {/* ESI Gauge */}
                      <div className="bg-slate-950/50 border border-slate-900 p-3 rounded-xl flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="block text-[9px] font-mono text-slate-500 uppercase">Earth Similarity</span>
                          <span className="font-mono font-bold text-sm text-emerald-400">
                            {(physics.earthSimilarityIndex * 100).toFixed(0)}% ESI
                          </span>
                          <span className="block text-[8px] text-slate-500 font-mono">
                            Earth = 100%
                          </span>
                        </div>
                      </div>

                      {/* Orbit Semimajor Axis */}
                      <div className="bg-slate-950/50 border border-slate-900 p-3 rounded-xl flex items-center gap-3">
                        <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 border border-cyan-500/20">
                          <Space className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="block text-[9px] font-mono text-slate-500 uppercase">Orbital Axis</span>
                          <span className="font-mono font-bold text-sm text-slate-200">
                            {physics.semiMajorAxis.toFixed(3)} AU
                          </span>
                          <span className="block text-[8px] text-slate-500 font-mono">
                            Earth = 1.0 AU
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Habitability Alert Strip */}
                    <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono font-bold ${physics.habitableZoneColor}`}>
                      <span>HABITABILITY ZONE STATUS:</span>
                      <span className="uppercase">{physics.habitableZoneStatus} ZONE</span>
                    </div>

                    {/* PLANET SIZE COMPARISON CHART */}
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-905">
                      <div className="text-[10px] font-mono text-slate-500 uppercase mb-3 text-center">Planetary Size Comparison</div>
                      <div className="flex items-end justify-around h-20 pb-2 relative">
                        
                        {/* Comparison bars */}
                        <div className="flex flex-col items-center">
                          <div className="w-4 h-4 rounded-full bg-slate-600 mb-1"></div>
                          <span className="text-[8px] font-mono text-slate-500">Mars (0.5R)</span>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-indigo-500 mb-1 shadow-md shadow-indigo-500/20"></div>
                          <span className="text-[8px] font-mono text-slate-500">Earth (1.0R)</span>
                        </div>

                        {/* Candidate Planet */}
                        <div className="flex flex-col items-center scale-105">
                          <div 
                            className="rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 mb-1 shadow-lg shadow-cyan-400/20"
                            style={{
                              width: `${Math.max(8, Math.min(60, 6 + formData.koi_prad * 2.5))}px`,
                              height: `${Math.max(8, Math.min(60, 6 + formData.koi_prad * 2.5))}px`
                            }}
                          ></div>
                          <span className="text-[9px] font-mono text-cyan-400 font-bold">Candidate ({formData.koi_prad.toFixed(1)}R)</span>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="w-14 h-14 rounded-full bg-orange-400/40 border border-orange-500/20 mb-1"></div>
                          <span className="text-[8px] font-mono text-slate-500">Jupiter (11R)</span>
                        </div>

                      </div>
                    </div>

                  </div>
                )}

                {/* 3. AI SURVEILLANCE LOGS TERMINAL & CHAT */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/50">
                  
                  {/* Terminal Header */}
                  <div className="bg-slate-950 border-b border-slate-850 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60"></div>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 tracking-wider flex items-center gap-1">
                        <Bot className="w-3.5 h-3.5 text-cyan-400" /> AI_EXO_EXPLORER_TERM v2.0
                      </span>
                    </div>
                    {isTyping && (
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                        <span className="font-mono text-[9px] text-cyan-400 uppercase">Transmitting...</span>
                      </div>
                    )}
                  </div>

                  {/* Terminal Screen Body */}
                  <div className="p-4 bg-black/80 min-h-[180px] max-h-[280px] overflow-y-auto font-mono text-xs text-cyan-400/90 leading-relaxed border-b border-slate-850">
                    
                    {/* Log lines */}
                    {terminalText.map((line, idx) => (
                      <div key={idx} className="flex gap-1.5 mb-1.5">
                        <ChevronRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <span>{line}</span>
                      </div>
                    ))}

                    {/* Chat messaging display */}
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`p-2 rounded-lg my-2 text-xs leading-relaxed max-w-[90%] ${
                        msg.sender === "user" 
                          ? "bg-slate-800/80 border border-slate-700/50 text-slate-200 ml-auto" 
                          : "bg-cyan-950/20 border border-cyan-900/30 text-cyan-300 mr-auto"
                      }`}>
                        <div className="text-[8px] text-slate-500 uppercase mb-0.5">
                          {msg.sender === "user" ? "QUERY" : "EXPLORER RESPONSE"}
                        </div>
                        {msg.text}
                      </div>
                    ))}

                    {/* Typewriter cursor blinking */}
                    {isTyping && (
                      <div className="w-2 h-4 bg-cyan-400 animate-pulse inline-block ml-1"></div>
                    )}

                    <div ref={terminalEndRef} />
                  </div>

                  {/* Interactive Questions Buttons */}
                  <div className="p-3 bg-slate-950 flex flex-col gap-2">
                    <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" /> SELECT ENQUIRY DIRECTIVE:
                    </div>
                    
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => handleChatQuestion("atmosphere")}
                        disabled={isTyping || !result}
                        className="py-2 px-1 text-[9px] font-bold font-mono tracking-tighter bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/80 text-cyan-400 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        [ATMOSPHERE]
                      </button>
                      <button
                        onClick={() => handleChatQuestion("surface")}
                        disabled={isTyping || !result}
                        className="py-2 px-1 text-[9px] font-bold font-mono tracking-tighter bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/80 text-cyan-400 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        [SURFACE_G]
                      </button>
                      <button
                        onClick={() => handleChatQuestion("life")}
                        disabled={isTyping || !result}
                        className="py-2 px-1 text-[9px] font-bold font-mono tracking-tighter bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/80 text-cyan-400 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        [HABITABILITY]
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default PredictionPage;