import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Challenge1 from './pages/Challenge1';
import Challenge2 from './pages/Challenge2';
import Challenge3 from './pages/Challenge3';
import Dashboard from './pages/Dashboard';
import About from './pages/About';

function AppRoutes() {
  const location = useLocation();
  return (
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/challenge/1" element={<Challenge1 />} />
        <Route path="/challenge/2" element={<Challenge2 />} />
        <Route path="/challenge/3" element={<Challenge3 />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
      </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-brand-light text-brand-dark flex flex-col relative overflow-hidden">
        {/* Subtle grid pattern background overlay */}
        <div className="absolute inset-0 z-0 bg-grid-pattern opacity-50 pointer-events-none"></div>

        <Navbar />
        <main className="flex-grow flex flex-col z-10 relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <AppRoutes />
        </main>
        <footer className="text-center py-8 text-brand-gray text-sm border-t border-brand-border mt-auto bg-brand-light z-10 relative">
          NeuroLogic '26 Datathon • Global NLP Intelligence Platform
        </footer>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              color: '#0F172A',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }
          }}
        />
      </div>
    </Router>
  );
}
