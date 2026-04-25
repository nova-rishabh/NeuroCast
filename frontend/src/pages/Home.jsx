import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Brain, Shield, Globe } from 'lucide-react';
import { useEffect, useRef } from 'react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

function AnimatedCounter({ target, suffix = '' }) {
  const ref = useRef();
  useEffect(() => {
    let current = 0;
    const increment = Math.ceil(target / 80);
    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      if (ref.current) ref.current.textContent = current.toLocaleString() + suffix;
      if (current >= target) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [target, suffix]);
  return <span ref={ref} />;
}

const challenges = [
  {
    num: 1, icon: '🚨', label: 'CHALLENGE 01',
    title: 'Disaster Tweet Classifier',
    desc: 'Classifies crisis tweets as Informative or Not Informative to power real-time emergency response filtering.',
    metric: 'Macro F1-Score', level: 'Beginner–Intermediate',
    accentColor: '#F59E0B', accentBg: 'rgba(245,158,11,0.08)',
    accentBorder: 'rgba(245,158,11,0.25)', to: '/challenge/1',
    icon2: Brain, stat: '25,933', statLabel: 'crisis tweets',
  },
  {
    num: 2, icon: '📰', label: 'CHALLENGE 02',
    title: 'Fake News Detector',
    desc: 'Identifies whether a news article is Real (TRUE) or Fake (FALSE) by analyzing headline and full body text.',
    metric: 'Overall Accuracy', level: 'Intermediate',
    accentColor: '#EF4444', accentBg: 'rgba(239,68,68,0.08)',
    accentBorder: 'rgba(239,68,68,0.25)', to: '/challenge/2',
    icon2: Shield, stat: '23,893', statLabel: 'news articles',
  },
  {
    num: 3, icon: '🌐', label: 'CHALLENGE 03',
    title: 'Multilingual Toxic Classifier',
    desc: 'Detects toxic comments in English and Hindi with binary labels, supporting scalable content moderation.',
    metric: 'Mean ROC-AUC', level: 'Advanced',
    accentColor: '#2DD4BF', accentBg: 'rgba(45,212,191,0.08)',
    accentBorder: 'rgba(45,212,191,0.25)', to: '/challenge/3',
    icon2: Globe, stat: '9,000', statLabel: 'multilingual comments',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden" style={{ background: '#03040A' }}>
      {/* Background grid */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none"/>

      {/* Ambient glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="glow-orb w-[600px] h-[600px] bg-indigo-600/20 -top-64 -left-32"/>
        <div className="glow-orb w-[400px] h-[400px] bg-cyan-500/10 top-1/3 -right-32"/>
        <div className="glow-orb w-[500px] h-[500px] bg-purple-600/10 bottom-0 left-1/3"/>
      </div>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center
        text-center px-4 pt-20 pb-16 z-10">

        {/* Hackathon badge */}
        <motion.div {...fadeUp(0)}>
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full
            bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.3)]">
            <span className="w-2 h-2 rounded-full bg-brand-violet animate-pulse"/>
            <span className="text-xs font-mono text-brand-purple font-medium tracking-wider">
              NEUROLOGIC '26 · GLOBAL NLP DATATHON · APRIL 25, 2026
            </span>
          </div>
        </motion.div>

        {/* Main headline */}
        <motion.div {...fadeUp(0.1)} className="mb-6">
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold
            tracking-tight leading-[1.05] text-white">
            Three NLP Problems.
            <br/>
            <span className="gradient-text">One Platform.</span>
          </h1>
        </motion.div>

        {/* Sub headline */}
        <motion.p {...fadeUp(0.2)} className="text-lg sm:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
          Real-time inference, batch predictions, explainable AI, and submission-ready
          outputs for all three NeuroLogic '26 challenges — built in one sprint.
        </motion.p>

        {/* CTAs */}
        <motion.div {...fadeUp(0.3)} className="flex flex-wrap gap-4 justify-center mb-16">
          <Link to="/challenge/1">
            <button className="btn-primary flex items-center gap-2 px-8 py-3.5 text-sm">
              Start with Challenge 1 <ArrowRight size={16}/>
            </button>
          </Link>
          <Link to="/dashboard">
            <button className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold
              text-slate-300 border border-[rgba(99,102,241,0.3)] hover:border-[rgba(99,102,241,0.5)]
              hover:bg-[rgba(99,102,241,0.05)] transition-all duration-200">
              <Zap size={16} className="text-brand-violet"/> View Dashboard
            </button>
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div {...fadeUp(0.4)}
          className="flex flex-wrap justify-center gap-8 sm:gap-16">
          {[
            { value: 25933, label: 'Crisis Tweets', color: '#F59E0B' },
            { value: 23893, label: 'News Articles', color: '#EF4444' },
            { value: 9000, label: 'Comments', color: '#2DD4BF' },
            { value: 3, label: 'ML Models', color: '#818CF8' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="font-display text-3xl sm:text-4xl font-bold"
                style={{ color: s.color }}>
                <AnimatedCounter target={s.value}/>
              </p>
              <p className="text-xs text-slate-500 mt-1 font-mono uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Challenge Cards */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-32">
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="text-center mb-14">
          <p className="text-xs font-mono text-slate-500 tracking-[4px] uppercase mb-4">
            THREE CHALLENGES
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
            Pick Your Challenge
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {challenges.map((c, i) => (
            <motion.div key={c.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22,1,0.36,1] }}>
              <Link to={c.to} className="block h-full">
                <div className="glass-card h-full p-6 cursor-pointer group"
                  style={{ '--challenge-color': c.accentColor }}>

                  {/* Top bar */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-semibold tracking-widest"
                      style={{ color: c.accentColor }}>
                      {c.label}
                    </span>
                    <span className="text-2xl">{c.icon}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-xl font-bold text-white mb-3 leading-tight
                    group-hover:text-brand-purple transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">{c.desc}</p>

                  {/* Stat */}
                  <div className="flex items-center gap-2 mb-6 p-3 rounded-xl"
                    style={{ background: c.accentBg, border: `1px solid ${c.accentBorder}` }}>
                    <span className="font-display font-bold text-lg" style={{ color: c.accentColor }}>
                      {c.stat}
                    </span>
                    <span className="text-xs text-slate-400">{c.statLabel} trained</span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <span className="status-badge text-xs"
                        style={{ background: c.accentBg, color: c.accentColor,
                          border: `1px solid ${c.accentBorder}` }}>
                        {c.metric}
                      </span>
                    </div>
                    <ArrowRight size={18} className="text-slate-600 group-hover:text-brand-purple
                      group-hover:translate-x-1 transition-all"/>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-14 font-mono text-xs text-slate-600 tracking-wider">
          POWERED BY TF-IDF · LOGISTIC REGRESSION · SCIKIT-LEARN · REACT 18
        </motion.p>
      </section>
    </div>
  );
}