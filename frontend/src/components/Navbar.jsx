import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, BrainCircuit } from 'lucide-react';
import axios from 'axios';

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modelStatus, setModelStatus] = useState(false);
  const location = useLocation();

  useEffect(() => {
    axios.get('/api/health').then(res => {
      if (res.data.status === 'ok') setModelStatus(true);
    }).catch(() => setModelStatus(false));
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const navLinks = [
    { name: 'Disaster', path: '/challenge/1' },
    { name: 'Fake News', path: '/challenge/2' },
    { name: 'Toxic', path: '/challenge/3' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="NeuroCast Logo" className="h-8 w-8 object-contain" />
              <span className="text-xl font-bold text-brand-navy tracking-tight">NeuroCast</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-brand-indigo border-b-2 border-brand-indigo pb-1'
                      : 'text-brand-gray hover:text-brand-navy'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-brand-gray">
             <div className="flex items-center space-x-1" title={modelStatus ? "Models Ready" : "Models Loading"}>
                <div className={`h-2 w-2 rounded-full ${modelStatus ? 'bg-green-500' : 'bg-red-500'}`}></div>
             </div>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-brand-gray hover:text-brand-navy">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-brand-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-3 py-2 rounded-md text-base font-medium text-brand-gray hover:text-brand-navy hover:bg-slate-50"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
