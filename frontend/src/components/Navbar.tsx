import { Link, useLocation } from "react-router-dom";
import { Rocket, Activity, Database, Sparkles } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => 
    location.pathname === path 
      ? "bg-slate-800 text-cyan-400 border border-slate-700/60 shadow-lg shadow-cyan-500/5" 
      : "text-slate-300 hover:bg-slate-900 hover:text-white border border-transparent";

  return (
    <nav className="bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl group-hover:scale-105 transition-all duration-300 shadow-md shadow-indigo-500/20">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
              EXO<span className="text-cyan-400 font-medium">SEEK</span>
            </span>
          </Link>
          
          {/* Scientific Telemetry Dashboard (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center space-x-6 text-[11px] font-mono text-slate-400 border-l border-r border-slate-800/80 px-6 py-1 bg-slate-900/30 rounded-lg">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
              <span>CORE MODEL: <span className="text-slate-200">RF-ENSEMBLE v1.4</span></span>
            </div>
            <span className="text-slate-800">|</span>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>VAL-ACCURACY: <span className="text-emerald-400">98.4%</span></span>
            </div>
            <span className="text-slate-800">|</span>
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-purple-400" />
              <span>SOURCE: <span className="text-slate-200">NASA KEPLER ARCHIVE</span></span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-3">
            <Link
              to="/manual"
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-wide transition-all duration-200 flex items-center gap-2 ${isActive('/manual')}`}
            >
              ANALYSIS_DECK
            </Link>
            <Link
              to="/upload"
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-wide transition-all duration-200 flex items-center gap-2 ${isActive('/upload')}`}
            >
              BATCH_LOADER
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;