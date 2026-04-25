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
      <div className="min-h-screen bg-[#0A0E1A] text-slate-100">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/challenge/1" element={<Challenge1 />} />
            <Route path="/challenge/2" element={<Challenge2 />} />
            <Route path="/challenge/3" element={<Challenge3 />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <footer className="text-center py-6 text-slate-600 text-xs border-t border-[#2D3748] mt-16">
          Built for NeuroLogic '26 · Global NLP Datathon · GGITS AIML Dept · April 25, 2026
        </footer>
        <Toaster position="bottom-right" toastOptions={{
          style: { background: '#1E2433', color: '#F1F5F9', border: '1px solid #2D3748' }
        }}/>
      </div>
    </Router>
  );
}