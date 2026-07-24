import { Link } from "react-router-dom";
import { ArrowRight, Database, Cpu, Globe } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">

      {/* Dynamic drifting particle starfield placeholder in CSS */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-slate-950 z-0"></div>

      {/* Background stardust glow image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-screen z-0"></div>

      {/* Orbit paths in the hero background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] border border-slate-900 rounded-full rotate-12 opacity-30 pointer-events-none z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] border border-slate-900 rounded-full -rotate-12 opacity-20 pointer-events-none z-0"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center z-10">

        {/* Banner Tag */}


        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
          Hunt New Worlds with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500">
            Neural Intelligence
          </span>
        </h1>

        <p className="mt-4 text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Unlock the secrets of the cosmos. ExoSeek analyzes Kepler Space Telescope light curves using optimized machine learning algorithms to identify confirmed exoplanets with high precision.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto mb-20">
          <Link
            to="/manual"
            className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-indigo-600 border border-cyan-500 rounded-xl font-bold text-sm font-mono tracking-wider hover:from-cyan-500 hover:to-indigo-500 transition-all shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
          >
            LAUNCH_RADAR_DECK <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/upload"
            className="px-8 py-4 bg-slate-950 border border-slate-800 rounded-xl font-bold text-sm font-mono tracking-wider hover:bg-slate-900 hover:border-slate-700 transition-all flex items-center justify-center"
          >
            BATCH_LOADER
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="max-w-7xl mx-auto px-4 mt-10">
          <h2 className="text-xs font-mono tracking-widest text-slate-500 uppercase mb-8">CORE CORE MODULES</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Database className="w-6 h-6 text-cyan-400" />}
              title="Kepler Telemetry Feed"
              desc="Ingests raw flux data from thousands of celestial objects monitored during NASA's pioneering Kepler mission."
            />
            <FeatureCard
              icon={<Cpu className="w-6 h-6 text-indigo-400" />}
              title="Random Forest Ensembles"
              desc="Processes complex light curve signals using optimized decision trees trained for robust signal-to-noise classification."
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6 text-purple-400" />}
              title="Habitability Assessment"
              desc="Derives Equilibrium Temperature, Earth Similarity Index (ESI), and gravity models for confirmed worlds."
            />
          </div>
        </div>

      </div>

      {/* Tech stats bar */}
      <div className="border-t border-slate-900 bg-slate-950/60 backdrop-blur-md relative z-10 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-around gap-6 text-center font-mono">
          <div>
            <div className="text-2xl font-black text-cyan-400">9,564+</div>
            <div className="text-[9px] text-slate-500 uppercase tracking-wider mt-1">Kepler Objects Evaluated</div>
          </div>
          <div className="h-8 w-px bg-slate-900 hidden sm:block"></div>
          <div>
            <div className="text-2xl font-black text-indigo-400">98.4%</div>
            <div className="text-[9px] text-slate-500 uppercase tracking-wider mt-1">Classification Accuracy</div>
          </div>
          <div className="h-8 w-px bg-slate-900 hidden sm:block"></div>
          <div>
            <div className="text-2xl font-black text-purple-400">0.00s</div>
            <div className="text-[9px] text-slate-500 uppercase tracking-wider mt-1">Telemetry Uplink Latency</div>
          </div>
        </div>
      </div>

    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-slate-800 transition-all hover:bg-slate-900/70 text-left relative overflow-hidden group shadow-lg">
    <div className="mb-4 bg-slate-950 w-12 h-12 rounded-xl flex items-center justify-center border border-slate-900 group-hover:border-cyan-500/30 transition-colors">
      {icon}
    </div>
    <h3 className="text-lg font-bold mb-2 text-slate-100 group-hover:text-cyan-400 transition-colors">{title}</h3>
    <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;