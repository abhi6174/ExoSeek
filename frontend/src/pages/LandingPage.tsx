import { Link } from "react-router-dom";
import { ArrowRight, Database, Cpu, Globe } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Discover New Worlds
          </h1>
          <p className="mt-4 text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Harnessing the power of Machine Learning to analyze Kepler Telescope data and identify confirmed exoplanets with 98% accuracy.
          </p>
          <div className="flex justify-center gap-6">
            <Link
              to="/manual"
              className="px-8 py-4 bg-indigo-600 rounded-lg font-bold text-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2"
            >
              Start Analysis <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/upload"
              className="px-8 py-4 bg-slate-800 border border-slate-700 rounded-lg font-bold text-lg hover:bg-slate-700 transition-all"
            >
              Upload Dataset
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Database className="w-8 h-8 text-indigo-400" />}
            title="NASA Kepler Data"
            desc="Trained on thousands of light curves and planetary parameters from the official NASA archive."
          />
          <FeatureCard 
            icon={<Cpu className="w-8 h-8 text-cyan-400" />}
            title="Advanced ML"
            desc="Uses Random Forest Ensembles with optimized hyperparameters for high-precision classification."
          />
          <FeatureCard 
            icon={<Globe className="w-8 h-8 text-purple-400" />}
            title="Real-time Scoring"
            desc="Instant analysis of planetary candidates via our high-performance FastAPI backend."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-indigo-500/50 transition-colors">
    <div className="mb-4 bg-slate-900/50 w-16 h-16 rounded-xl flex items-center justify-center border border-slate-700">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;