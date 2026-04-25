import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Code2, Database, LayoutTemplate, Server } from 'lucide-react';

export default function About() {
  const [openSection, setOpenSection] = useState(1);

  const toggle = (id) => setOpenSection(openSection === id ? null : id);

  const sections = [
    {
      id: 1,
      title: 'Challenge 1: Disaster Tweet Classification',
      problem: 'Classify crisis tweets as informative or not.',
      dataset: 'CrisisLexT26, 25933 tweets, 2012–2013. Labels: 1 = Informative (16019), 0 = Not Informative (9914).',
      model: "TF-IDF (max 15k features, ngram 1-2) + Logistic Regression (class_weight='balanced').",
      pre: 'Lowercasing, TF-IDF sublinear scaling.',
      eval: 'Macro F1-Score (chosen because it handles the class imbalance of 16019 vs 9914 effectively).'
    },
    {
      id: 2,
      title: 'Challenge 2: Fake News Detection',
      problem: 'Classify news as real or fake.',
      dataset: 'Fake and Real News Dataset (Kaggle), 23893 articles. Labels: TRUE = Real (15438), FALSE = Fake (8455).',
      model: "TF-IDF on title+text (max 20k features) + Logistic Regression (C=5.0).",
      pre: 'Title and body concatenated before vectorization.',
      eval: 'Overall Accuracy (as the dataset is relatively balanced).'
    },
    {
      id: 3,
      title: 'Challenge 3: Multilingual Toxic Comment Classification',
      problem: 'Binary toxicity classification in English and Hindi.',
      dataset: 'HuggingFace Multilingual Toxicity Dataset, 9000 samples. Labels: 0 = Non-toxic (4506), 1 = Toxic (4494).',
      model: "TF-IDF + Logistic Regression (C=2.0) with class_weight='balanced'.",
      pre: 'No language-specific tokenization (TF-IDF handles it natively).',
      eval: 'Mean ROC-AUC Score (assesses classification performance across thresholds).'
    }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-brand-navy mb-4">📚 Methodology & Documentation</h1>
        <div className="card p-6 inline-block bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100">
          <h2 className="text-xl font-bold text-brand-indigo mb-1">NeuroLogic '26 · Global NLP Datathon</h2>
          <p className="text-slate-600">April 25, 2026</p>
          <p className="text-sm text-slate-500 mt-2 font-medium">Hosted by GGITS, Dept of AIML</p>
        </div>
      </div>

      <div className="space-y-4 mb-12">
        {sections.map((sec) => (
          <div key={sec.id} className="card overflow-hidden transition-all duration-300">
            <button
              onClick={() => toggle(sec.id)}
              className="w-full p-5 flex justify-between items-center bg-white hover:bg-slate-50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-brand-navy">{sec.title}</h3>
              <ChevronDown className={`transition-transform duration-300 ${openSection === sec.id ? 'rotate-180 text-brand-indigo' : 'text-slate-400'}`} />
            </button>
            <AnimatePresence>
              {openSection === sec.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-5 border-t border-slate-100 space-y-4 text-sm text-slate-600 bg-slate-50/50">
                    <div><strong className="text-brand-indigo font-semibold">Problem Statement:</strong> {sec.problem}</div>
                    <div><strong className="text-brand-indigo font-semibold">Dataset Details:</strong> {sec.dataset}</div>
                    <div><strong className="text-brand-indigo font-semibold">Model Architecture:</strong> {sec.model}</div>
                    <div><strong className="text-brand-indigo font-semibold">Preprocessing Steps:</strong> {sec.pre}</div>
                    <div><strong className="text-brand-indigo font-semibold">Evaluation Metric:</strong> {sec.eval}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-bold text-brand-navy mb-6 text-center">Tech Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-6 flex flex-col items-center justify-center text-center hover:border-brand-indigo transition-colors">
            <Server className="text-brand-indigo mb-3" size={28} />
            <span className="font-semibold text-sm text-brand-navy">Python / Flask</span>
          </div>
          <div className="card p-6 flex flex-col items-center justify-center text-center hover:border-amber-500 transition-colors">
            <Database className="text-amber-500 mb-3" size={28} />
            <span className="font-semibold text-sm text-brand-navy">scikit-learn / Pandas</span>
          </div>
          <div className="card p-6 flex flex-col items-center justify-center text-center hover:border-cyan-500 transition-colors">
            <Code2 className="text-cyan-500 mb-3" size={28} />
            <span className="font-semibold text-sm text-brand-navy">React 18 / Vite</span>
          </div>
          <div className="card p-6 flex flex-col items-center justify-center text-center hover:border-teal-500 transition-colors">
            <LayoutTemplate className="text-teal-500 mb-3" size={28} />
            <span className="font-semibold text-sm text-brand-navy">Tailwind CSS / Chart.js</span>
          </div>
        </div>
      </div>

      <div className="text-center card p-8 bg-slate-50 border-slate-200 shadow-none">
        <h3 className="text-lg font-bold text-brand-navy mb-2">Team NeuroCast</h3>
        <p className="text-sm text-slate-500 mb-6">Developed by the NeuroLogic '26 Datathon Finalists.</p>
        <button disabled className="px-6 py-2 bg-slate-200 text-slate-400 rounded-lg cursor-not-allowed border border-slate-300 font-medium">
          GitHub Repo (Link to be added)
        </button>
      </div>
    </motion.div>
  );
}
