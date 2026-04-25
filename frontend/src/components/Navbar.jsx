import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../utils/api';

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [health, setHealth] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    api.health().then(r => setHealth(r.data)).catch(() => {});
  }, []);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/challenge/1', label: 'Challenge 1', dot: '#F59E0B' },
    { to: '/challenge/2', label: 'Challenge 2', dot: '#EF4444' },
    { to: '/challenge/3', label: 'Challenge 3', dot: '#2DD4BF' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/about', label: 'Docs' },
  ];

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-[#03040A]/90 backdrop-blur-xl border-b border-[rgba(99,102,241,0.12)] shadow-lg shadow-black/20'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/NeuroCast.png" alt="NeuroCast" className="h-8 w-8 object-contain" />
          <span className="font-display font-bold text-lg text-white group-hover:text-brand-purple transition-colors">
            NeuroCast
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium
                transition-all duration-200
                ${isActive(l.to)
                  ? 'bg-[rgba(99,102,241,0.12)] text-brand-purple'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}>
              {l.dot && (
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: l.dot }}/>
              )}
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Model health indicators */}
          {health && (
            <div className="hidden sm:flex items-center gap-1.5 bg-[rgba(13,15,28,0.8)] border border-[rgba(99,102,241,0.15)] rounded-full px-3 py-1.5">
              {['disaster','fakenews','toxic'].map((k, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    health.models?.[k] ? 'bg-green-400 shadow-[0_0_6px_#4ade80]' : 'bg-red-500'
                  }`}/>
                </div>
              ))}
              <span className="text-xs text-slate-500 font-mono ml-1">models</span>
            </div>
          )}

          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono
            bg-[rgba(99,102,241,0.1)] text-brand-purple border border-[rgba(99,102,241,0.3)]
            px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-brand-violet rounded-full animate-pulse"/>
            LIVE · NeuroLogic '26
          </span>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1 p-2">
            <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}/>
            <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`}/>
            <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}/>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0D0F1C] border-t border-[rgba(99,102,241,0.15)] px-6 py-4 space-y-1">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium
                ${isActive(l.to) ? 'text-brand-purple bg-[rgba(99,102,241,0.1)]' : 'text-slate-400'}`}>
              {l.dot && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: l.dot }}/>}
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}