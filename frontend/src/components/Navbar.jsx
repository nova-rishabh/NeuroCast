import { Link, useLocation } from 'react-router-dom';
import { Zap, Sun, Moon, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../utils/api';

export default function Navbar() {
  const location = useLocation();
  const [dark, setDark] = useState(true);
  const [health, setHealth] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  useEffect(() => {
    api.health().then(r => setHealth(r.data)).catch(() => {});
  }, []);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/challenge/1', label: 'Challenge 1' },
    { to: '/challenge/2', label: 'Challenge 2' },
    { to: '/challenge/3', label: 'Challenge 3' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/about', label: 'About' },
  ];

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <nav className="sticky top-0 z-50 bg-[#0A0E1A]/80 backdrop-blur-md border-b border-[#2D3748]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Zap className="text-indigo-400" size={22} />
          <span className="font-extrabold text-lg bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            NeuroCast
          </span>
          {health && (
            <div className="hidden sm:flex gap-1 ml-2" title="Model status">
              {['disaster','fakenews','toxic'].map((k,i) => (
                <span key={i} title={`${k}: ${health.models?.[k] ? 'Ready' : 'Not loaded'}`}
                  className={`w-2 h-2 rounded-full ${health.models?.[k] ? 'bg-green-400' : 'bg-red-500'}`}/>
              ))}
            </div>
          )}
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${isActive(l.to)
                  ? 'text-indigo-400 border-b-2 border-indigo-400'
                  : 'text-slate-400 hover:text-slate-100'}`}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">
            NeuroLogic '26
          </span>
          <button onClick={() => setDark(!dark)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-[#1E2433] transition-colors">
            {dark ? <Sun size={18}/> : <Moon size={18}/>}
          </button>
          {/* Hamburger */}
          <button className="md:hidden p-2 text-slate-400" onClick={() => setMenuOpen(!menuOpen)}>
            <Activity size={20}/>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#2D3748] bg-[#0A0E1A] px-4 pb-4">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
              className={`block py-2 text-sm font-medium
                ${isActive(l.to) ? 'text-indigo-400' : 'text-slate-400'}`}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}