import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Code, BookOpen } from 'lucide-react';

const sections = [
  {
    id: 1,
    icon: '🚨',
    title: 'Challenge 1 — Disaster Tweet Classification',
    color: 'text-amber-400 border-amber-500/30',
    items: [
      { label: 'Problem', value: 'Classify crisis tweets as Informative (1) or Not Informative (0) to support emergency response.' },
      { label: 'Dataset', value: 'CrisisLexT26 — 25,933 tweets from 26 real-world crisis events (2012–2013). Informative: 16,019 | Not Informative: 9,914' },
      { label: 'Model', value: 'TF-IDF Vectorizer (max_features=15000, ngram_range=(1,2), sublinear_tf=True) → Logistic Regression (C=1.0, class_weight="balanced")' },
      { label: 'Preprocessing', value: 'Lowercasing, TF-IDF sublinear TF scaling, English stop-word removal, train/test split 80/20 stratified.' },
      { label: 'Evaluation', value: 'Macro F1-Score — chosen to handle class imbalance (16019 vs 9914).' },
      { label: 'Submission Format', value: 'Integer labels: 1 = Informative, 0 = Not Informative' },
    ]
  },
  {
    id: 2,
    icon: '📰',
    title: 'Challenge 2 — Fake News Detection',
    color: 'text-red-400 border-red-500/30',
    items: [
      { label: 'Problem', value: 'Classify news articles as Real (TRUE) or Fake (FALSE) using headline + body text.' },
      { label: 'Dataset', value: 'Fake and Real News Dataset (Kaggle) — 23,893 articles. TRUE: 15,438 | FALSE: 8,455' },
      { label: 'Model', value: 'TF-IDF (title+text combined, max_features=20000, ngram 1-2) → Logistic Regression (C=5.0)' },
      { label: 'Preprocessing', value: 'Title and body concatenated before vectorization. NaN filled with empty string.' },
      { label: 'Evaluation', value: 'Overall Accuracy — standard metric for balanced binary news classification.' },
      { label: 'Submission Format', value: 'String labels: "TRUE" = Real News, "FALSE" = Fake News (exact case required)' },
    ]
  },
  {
    id: 3,
    icon: '🌐',
    title: 'Challenge 3 — Multilingual Toxic Comment Classification',
    color: 'text-cyan-400 border-cyan-500/30',
    items: [
      { label: 'Problem', value: 'Binary toxicity classification across English and Hindi text.' },
      { label: 'Dataset', value: 'HuggingFace Multilingual Toxicity Dataset — 9,000 samples. Non-toxic (0): 4,506 | Toxic (1): 4,494' },
      { label: 'Model', value: 'TF-IDF (max_features=15000, ngram 1-2, sublinear_tf=True) → Logistic Regression (C=2.0, class_weight="balanced")' },
      { label: 'Preprocessing', value: 'No language-specific tokenization — TF-IDF handles multilingual text via character-level features. Class balancing used.' },
      { label: 'Evaluation', value: 'Mean ROC-AUC Score — appropriate for probability-based toxic detection.' },
      { label: 'Submission Format', value: 'Integer labels: 1 = Toxic, 0 = Non-toxic (strictly enforced)' },
    ]
  },
];

function Accordion({ section }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`glass-card border-t-2 ${section.color.split(' ')[1]} overflow-hidden transition-all duration-300`}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-4">
          <span className="text-3xl bg-white/5 p-3 rounded-2xl">{section.icon}</span>
          <span className={`text-xl font-heading font-bold ${section.color.split(' ')[0]}`}>{section.title}</span>
        </div>
        {open ? <ChevronUp size={20} className="text-gray-400"/> : <ChevronDown size={20} className="text-gray-400"/>}
      </button>
      {open && (
        <div className="px-6 pb-6 space-y-4 border-t border-white/10 pt-4 bg-black/20">
          {section.items.map((item, i) => (
            <div key={i} className="pt-2">
              <p className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest mb-2">{item.label}</p>
              <p className="text-sm text-gray-300 leading-relaxed font-sans">{item.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function About() {
  const stack = ['Python 3.11', 'Flask', 'scikit-learn', 'TF-IDF', 'React 18', 'Vite', 'Tailwind CSS', 'Chart.js'];

  return (
    <div className="min-h-screen" style={{ background: '#03040A' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-4xl mx-auto space-y-12">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-4 bg-[rgba(99,102,241,0.1)] rounded-2xl border border-[rgba(99,102,241,0.2)]">
               <BookOpen className="text-brand-violet" size={32}/>
            </div>
            <div>
              <h1 className="font-display text-5xl font-bold text-white">Methodology & Documentation</h1>
              <p className="text-slate-400 text-sm mt-2 font-mono uppercase tracking-widest">NeuroCast · NeuroLogic '26 · GGITS AIML Dept · April 25, 2026</p>
            </div>
          </div>

          {/* Hackathon context */}
          <div className="glass-card p-8 mb-8 relative overflow-hidden" style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(17,19,39,0.8))'
          }}>
            <p className="text-brand-purple font-display font-bold text-2xl mb-2">NeuroLogic '26 — Global NLP Datathon</p>
            <p className="text-slate-300 text-base leading-relaxed max-w-3xl">
              Hosted by the Department of AI & Machine Learning, Gyan Ganga Institute of Technology & Sciences.
              A 12-hour sprint tackling three real-world NLP challenges with prizes worth $1,250 USD.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              {['F1-Score (C1)', 'Accuracy (C2)', 'ROC-AUC (C3)'].map(m => (
                <span key={m} className="text-xs bg-[rgba(99,102,241,0.2)] text-white border border-[rgba(99,102,241,0.4)]
                  px-3 py-1 rounded-full font-mono uppercase tracking-wider">{m}</span>
              ))}
            </div>
          </div>

          {/* Accordions */}
          <div className="space-y-6 mb-12">
            {sections.map(s => <Accordion key={s.id} section={s}/>)}
          </div>

          {/* Tech stack */}
          <div className="glass-card p-8 mb-8">
            <p className="text-sm font-display font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2"><Code size={18} className="text-brand-cyan"/> Tech Stack</p>
            <div className="flex flex-wrap gap-3">
              {stack.map(t => (
                <span key={t} className="text-xs bg-[#0D0F1C] border border-[rgba(99,102,241,0.2)] text-brand-purple
                  px-4 py-2 rounded-xl font-mono">{t}</span>
              ))}
            </div>
          </div>

          {/* GitHub */}
          <div className="glass-card p-8 flex items-center justify-between group hover:border-[rgba(99,102,241,0.4)] transition-colors">
            <div>
              <p className="font-display font-bold text-xl text-white">GitHub Repository</p>
              <p className="text-sm text-slate-400 mt-1">Public repo with full code, README, and prediction files</p>
            </div>
            <a href="https://github.com/nova-rishabh/NeuroCast" target="_blank" rel="noopener noreferrer"
              className="btn-primary flex items-center gap-2 whitespace-nowrap">
              <Code size={18}/> View on GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}