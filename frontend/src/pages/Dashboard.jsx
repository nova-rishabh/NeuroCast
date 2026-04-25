import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, downloadBlob } from '../utils/api';
import { ComparisonChart } from '../components/ChartComponents';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    api.dashboardMetrics().then(r => setMetrics(r.data)).catch(() => {});
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const r = await api.downloadAll();
      downloadBlob(r.data, 'neuroCast_all_predictions.zip');
      toast.success('All predictions downloaded!');
    } catch { toast.error('Download failed.'); }
    finally { setDownloading(false); }
  };

  const summaryCards = metrics ? [
    { label: 'Challenge 1 · F1 Score', value: metrics.challenge1?.f1, color: 'text-amber-400', border: 'border-amber-500/30' },
    { label: 'Challenge 2 · Accuracy', value: metrics.challenge2?.accuracy, color: 'text-red-400', border: 'border-red-500/30' },
    { label: 'Challenge 3 · ROC-AUC', value: metrics.challenge3?.roc_auc, color: 'text-cyan-400', border: 'border-cyan-500/30' },
  ] : [];

  const comparisonData = metrics ? {
    c1: metrics.challenge1?.comparison,
    c2: metrics.challenge2?.comparison,
    c3: metrics.challenge3?.comparison,
  } : null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Activity className="text-indigo-400" size={28}/>
            <h1 className="text-3xl font-black text-slate-100">Mission Control</h1>
          </div>
          <p className="text-slate-400 ml-10">Aggregate performance across all three NLP challenges</p>
        </div>
        <button onClick={handleDownload} disabled={downloading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700
            disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-xl
            text-sm transition-colors">
          <Download size={16}/>
          {downloading ? 'Preparing...' : 'Download All Predictions (ZIP)'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {summaryCards.length === 0
          ? [0,1,2].map(i => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-3 bg-[#2D3748] rounded w-32 mb-3"/>
              <div className="h-10 bg-[#2D3748] rounded w-24"/>
            </div>
          ))
          : summaryCards.map((c, i) => (
            <div key={i} className={`card p-6 border ${c.border}`}>
              <p className="text-xs text-slate-500 mb-1">{c.label}</p>
              <p className={`text-4xl font-black ${c.color}`}>
                {c.value != null ? `${(c.value * 100).toFixed(1)}%` : '—'}
              </p>
            </div>
          ))
        }
      </div>

      {/* Model Comparison Charts */}
      {comparisonData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-5">
            <p className="text-sm font-semibold text-amber-400 mb-3">🚨 Challenge 1 — F1 Score</p>
            <ComparisonChart comparison={comparisonData.c1} metricLabel="F1 Score"/>
          </div>
          <div className="card p-5">
            <p className="text-sm font-semibold text-red-400 mb-3">📰 Challenge 2 — Accuracy</p>
            <ComparisonChart comparison={comparisonData.c2} metricLabel="Accuracy"/>
          </div>
          <div className="card p-5">
            <p className="text-sm font-semibold text-cyan-400 mb-3">🌐 Challenge 3 — ROC-AUC</p>
            <ComparisonChart comparison={comparisonData.c3} metricLabel="ROC-AUC"/>
          </div>
        </div>
      )}

      {/* Architecture note */}
      <div className="card p-6 mt-6">
        <p className="text-sm font-semibold text-slate-300 mb-3">📐 Architecture Overview</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400">
          {[
            { ch: 'Challenge 1', model: 'TF-IDF (15k, ngram 1-2) + Logistic Regression (balanced)', metric: 'Macro F1' },
            { ch: 'Challenge 2', model: 'TF-IDF (20k, title+text) + Logistic Regression (C=5)', metric: 'Accuracy' },
            { ch: 'Challenge 3', model: 'TF-IDF (15k) + Logistic Regression (balanced)', metric: 'ROC-AUC' },
          ].map((m, i) => (
            <div key={i} className="bg-[#111827] rounded-lg p-3">
              <p className="font-semibold text-slate-200 mb-1">{m.ch}</p>
              <p className="text-slate-500">{m.model}</p>
              <p className="text-indigo-400 mt-1 font-mono">Metric: {m.metric}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}