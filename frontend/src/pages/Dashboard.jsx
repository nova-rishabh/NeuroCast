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
    <div className="min-h-screen" style={{ background: '#03040A' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-12 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-5">
              <div>
                <h1 className="font-display text-5xl font-bold text-white">Mission Control</h1>
                <p className="text-slate-400 mt-2">Aggregate performance across all NLP challenges</p>
              </div>
            </div>
            <button onClick={handleDownload} disabled={downloading}
              className="btn-primary flex items-center gap-2 whitespace-nowrap">
              <Download size={18}/>
              {downloading ? 'Preparing Archive...' : 'Download Predictions (.zip)'}
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {summaryCards.length === 0
              ? [0,1,2].map(i => (
                <div key={i} className="glass-card p-8 animate-pulse border-t-4 border-white/10">
                  <div className="h-4 bg-white/10 rounded w-1/2 mb-4"/>
                  <div className="h-12 bg-white/10 rounded w-1/3"/>
                </div>
              ))
              : summaryCards.map((c, i) => (
                <div key={i} className={`glass-card p-8 border-t-4 ${c.border} group hover:-translate-y-2 relative overflow-hidden`}>
                  <p className="text-xs text-gray-400 mb-3 font-mono uppercase tracking-widest">{c.label}</p>
                  <p className="font-display text-5xl font-bold gradient-text group-hover:scale-105 transition-transform transform origin-left">
                    {c.value != null ? `${(c.value * 100).toFixed(1)}%` : '—'}
                  </p>
                </div>
              ))
            }
          </div>

          {/* Model Comparison Charts */}
          {comparisonData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-6 border-t-2 border-amber-500/30">
                <p className="text-sm font-display font-bold text-amber-400 mb-6 uppercase tracking-widest flex items-center gap-2">🚨 C1 F1 Score</p>
                <ComparisonChart comparison={comparisonData.c1} metricLabel="F1 Score"/>
              </div>
              <div className="glass-card p-6 border-t-2 border-red-500/30">
                <p className="text-sm font-display font-bold text-red-400 mb-6 uppercase tracking-widest flex items-center gap-2">📰 C2 Accuracy</p>
                <ComparisonChart comparison={comparisonData.c2} metricLabel="Accuracy"/>
              </div>
              <div className="glass-card p-6 border-t-2 border-cyan-500/30">
                <p className="text-sm font-display font-bold text-cyan-400 mb-6 uppercase tracking-widest flex items-center gap-2">🌐 C3 ROC-AUC</p>
                <ComparisonChart comparison={comparisonData.c3} metricLabel="ROC-AUC"/>
              </div>
            </div>
          )}

          {/* Architecture note */}
          <div className="glass-card p-8 mt-12 hover:border-[rgba(99,102,241,0.4)] transition-colors">
            <p className="font-display font-semibold text-white mb-6 text-base">📐 Architecture Overview</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-400">
              {[
                { ch: 'Challenge 1', model: 'TF-IDF (15k, ngram 1-2) + Logistic Regression (balanced)', metric: 'Macro F1' },
                { ch: 'Challenge 2', model: 'TF-IDF (20k, title+text) + Logistic Regression (C=5)', metric: 'Accuracy' },
                { ch: 'Challenge 3', model: 'TF-IDF (15k) + Logistic Regression (balanced)', metric: 'ROC-AUC' },
              ].map((m, i) => (
                <div key={i} className="bg-black/40 rounded-xl p-5 border border-white/5">
                  <p className="font-display font-bold text-white mb-2">{m.ch}</p>
                  <p className="text-gray-400 leading-relaxed mb-3">{m.model}</p>
                  <p className="text-brand-violet font-mono text-xs uppercase tracking-widest">Metric: {m.metric}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}