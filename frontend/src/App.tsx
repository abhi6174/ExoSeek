import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import PredictionPage from "./pages/PredictionPage"; // This is your Manual Page
import UploadPage from "./pages/UploadPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/manual" element={<PredictionPage />} />
          <Route path="/upload" element={<UploadPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
