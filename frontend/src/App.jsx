import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler);

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Challenge1 from './pages/Challenge1';
import Challenge2 from './pages/Challenge2';
import Challenge3 from './pages/Challenge3';
import Dashboard from './pages/Dashboard';
import About from './pages/About';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#03040A] text-slate-100">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/challenge/1" element={<Challenge1 />} />
            <Route path="/challenge/2" element={<Challenge2 />} />
            <Route path="/challenge/3" element={<Challenge3 />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <footer className="border-t border-[rgba(99,102,241,0.1)] py-8 px-6 mt-20">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/NeuroCast.png" alt="NeuroCast" className="h-6 w-6 object-contain opacity-60"/>
              <span className="font-mono text-xs text-slate-600">
                NeuroCast · Built for NeuroLogic '26 · GGITS AIML · April 25, 2026
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>
              <span className="font-mono text-xs text-slate-600">All systems operational</span>
            </div>
          </div>
        </footer>
        <Toaster position="bottom-right" toastOptions={{
          style: { background: '#111327', color: '#F8FAFC', border: '1px solid rgba(99,102,241,0.15)' }
        }}/>
      </div>
    </Router>
  );
}