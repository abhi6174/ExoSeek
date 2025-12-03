import { Link, useLocation } from "react-router-dom";
import { Rocket, FileText, UploadCloud } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => 
    location.pathname === path ? "bg-indigo-700 text-white" : "text-indigo-100 hover:bg-indigo-600";

  return (
    <nav className="bg-slate-900 shadow-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-indigo-600 rounded-lg group-hover:bg-indigo-500 transition-colors">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">
              ExoSeek <span className="text-indigo-400">AI</span>
            </span>
          </Link>
          
          <div className="flex space-x-4">
            <Link
              to="/manual"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${isActive('/manual')}`}
            >
              <FileText className="w-4 h-4" />
              Manual Analysis
            </Link>
            <Link
              to="/upload"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${isActive('/upload')}`}
            >
              <UploadCloud className="w-4 h-4" />
              Batch Upload
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;