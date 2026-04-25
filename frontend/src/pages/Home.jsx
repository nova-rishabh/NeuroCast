import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import { useEffect, useRef } from 'react';

function CountUp({ target, suffix = '' }) {
  const ref = useRef();
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      if (ref.current) ref.current.textContent = start.toLocaleString() + suffix;
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, suffix]);
  return <span ref={ref}>0</span>;
}

const challenges = [
  {
    num: 1, icon: '🚨', title: 'Disaster Tweet Classifier',
    desc: 'Classifies crisis tweets as Informative or Not Informative to support emergency response systems.',
    metric: 'Macro F1-Score', level: 'Beginner–Intermediate',
    border: 'border-t-amber-500', badge: 'bg-amber-500/20 text-amber-400', to: '/challenge/1',
  },
  {
    num: 2, icon: '📰', title: 'Fake News Detector',
    desc: 'Identifies whether a news article is Real (TRUE) or Fake (FALSE) using title and body text.',
    metric: 'Overall Accuracy', level: 'Intermediate',
    border: 'border-t-red-500', badge: 'bg-red-500/20 text-red-400', to: '/challenge/2',
  },
  {
    num: 3, icon: '🌐', title: 'Multilingual Toxic Classifier',
    desc: 'Detects toxic comments across English and Hindi, returning binary labels 0 or 1.',
    metric: 'Mean ROC-AUC', level: 'Advanced',
    border: 'border-t-cyan-500', badge: 'bg-cyan-500/20 text-cyan-400', to: '/challenge/3',
  },
];

export default function Home() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* Hero */}
      <div className="text-center py-20 px-4"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.15), transparent 70%)' }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <span className="inline-flex items-center gap-1.5 text-xs bg-indigo-500/20 text-indigo-400
            border border-indigo-500/30 px-3 py-1 rounded-full font-medium mb-6">
            <Zap size={12}/> NeuroLogic '26 · Global NLP Datathon · April 25, 2026
          </span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-6xl sm:text-7xl font-black mb-4
            bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          NeuroCast
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-xl text-slate-400 mb-2 font-light">
          Global NLP Intelligence Platform
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-slate-500 text-sm mb-12">
          3 Challenges · Real Inference · Submission-Ready Predictions
        </motion.p>

        {/* Challenge Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 text-left">
          {challenges.map((c, i) => (
            <motion.div key={c.num}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className={`card p-6 border-t-4 ${c.border} flex flex-col justify-between`}>
              <div>
                <div className="text-3xl mb-3">{c.icon}</div>
                <p className="text-xs text-slate-500 font-mono mb-1">CHALLENGE {c.num}</p>
                <h3 className="text-lg font-bold text-slate-100 mb-2">{c.title}</h3>
                <p className="text-sm text-slate-400 mb-4">{c.desc}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${c.badge}`}>
                    {c.metric}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400 border border-slate-600">
                    {c.level}
                  </span>
                </div>
              </div>
              <Link to={c.to}
                className="flex items-center gap-2 text-sm font-semibold text-indigo-400
                  hover:text-indigo-300 transition-colors group">
                Launch Challenge <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="mt-12 flex flex-wrap justify-center gap-8 text-center">
          {[
            { value: 25933, label: 'Crisis Tweets' },
            { value: 23893, label: 'News Articles' },
            { value: 9000, label: 'Comments' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-3xl font-black text-indigo-400">
                <CountUp target={s.value}/>
              </p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          className="mt-10 text-xs text-slate-600 font-mono">
          Powered by TF-IDF · Logistic Regression · scikit-learn · Hugging Face Datasets
        </motion.p>
      </div>
    </motion.div>
  );
}