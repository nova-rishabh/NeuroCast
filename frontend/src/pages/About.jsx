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
    <div className={`card border ${section.color.split(' ')[1]} overflow-hidden`}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{section.icon}</span>
          <span className={`font-bold ${section.color.split(' ')[0]}`}>{section.title}</span>
        </div>
        {open ? <ChevronUp size={18} className="text-slate-500"/> : <ChevronDown size={18} className="text-slate-500"/>}
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-3 border-t border-[#2D3748]">
          {section.items.map((item, i) => (
            <div key={i} className="pt-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{item.label}</p>
              <p className="text-sm text-slate-300">{item.value}</p>
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="text-indigo-400" size={28}/>
        <div>
          <h1 className="text-3xl font-black text-slate-100">Methodology & Documentation</h1>
          <p className="text-slate-400 text-sm">NeuroCast · NeuroLogic '26 · GGITS AIML Dept · April 25, 2026</p>
        </div>
      </div>

      {/* Hackathon context */}
      <div className="card p-6 mb-6 border border-indigo-500/30"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(30,36,51,1))' }}>
        <p className="text-indigo-300 font-bold text-lg mb-1">NeuroLogic '26 — Global NLP Datathon</p>
        <p className="text-slate-400 text-sm">
          Hosted by the Department of AI & Machine Learning, Gyan Ganga Institute of Technology & Sciences.
          A 12-hour sprint tackling three real-world NLP challenges with prizes worth $1,250 USD.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {['F1-Score (C1)', 'Accuracy (C2)', 'ROC-AUC (C3)'].map(m => (
            <span key={m} className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30
              px-2 py-0.5 rounded-full">{m}</span>
          ))}
        </div>
      </div>

      {/* Accordions */}
      <div className="space-y-3 mb-8">
        {sections.map(s => <Accordion key={s.id} section={s}/>)}
      </div>

      {/* Tech stack */}
      <div className="card p-6 mb-6">
        <p className="text-sm font-semibold text-slate-300 mb-3">⚙️ Tech Stack</p>
        <div className="flex flex-wrap gap-2">
          {stack.map(t => (
            <span key={t} className="text-xs bg-[#111827] border border-[#2D3748] text-slate-300
              px-3 py-1.5 rounded-lg font-mono">{t}</span>
          ))}
        </div>
      </div>

      {/* GitHub */}
      <div className="card p-6 flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-200">GitHub Repository</p>
          <p className="text-sm text-slate-500">Public repo with full code, README, and prediction files</p>
        </div>
        <a href="https://github.com/nova-rishabh/NeuroCast" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#111827] hover:bg-[#1E2433] border border-[#2D3748]
            text-slate-300 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
          <Code size={16}/> View on GitHub
        </a>
      </div>
    </motion.div>
  );
}