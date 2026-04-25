import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Activity, Target, Zap } from 'lucide-react';
import { ComparisonChart } from '../components/ChartComponents';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    api.dashboardMetrics().then(res => setMetrics(res.data)).catch(console.error);

    const c1 = JSON.parse(sessionStorage.getItem('c1_history') || '[]');
    const c2 = JSON.parse(sessionStorage.getItem('c2_history') || '[]');
    const c3 = JSON.parse(sessionStorage.getItem('c3_history') || '[]');

    const combined = [
      ...c1.map(h => ({ ...h, ch: 'C1 (Disaster)', input: h.text, time: new Date().toLocaleTimeString() })),
      ...c2.map(h => ({ ...h, ch: 'C2 (Fake News)', input: h.title, time: new Date().toLocaleTimeString() })),
      ...c3.map(h => ({ ...h, ch: 'C3 (Toxic)', input: h.text, time: new Date().toLocaleTimeString() }))
    ];
    setHistoryLogs(combined.slice(0, 10));
  }, []);

  const handleDownloadAll = async () => {
    setDownloading(true);
    try {
      const res = await api.downloadAll();
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'neuroCast_all_predictions.zip';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Downloaded ZIP file');
    } catch (err) {
      toast.error('Download failed');
    }
    setDownloading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy flex items-center space-x-3">
            <span className="text-brand-indigo">📊</span>
            <span>Mission Control Dashboard</span>
          </h1>
        </div>
        <button
          onClick={handleDownloadAll}
          disabled={downloading}
          className="mt-4 md:mt-0 flex items-center space-x-2 px-4 py-2 bg-brand-indigo hover:bg-brand-navy disabled:opacity-50 text-white rounded-lg transition-colors font-semibold shadow-md"
        >
          <Download size={18} />
          <span>{downloading ? 'Zipping...' : 'Download All Prediction Files (ZIP)'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 flex flex-col items-center text-center group hover:border-brand-indigo transition-colors">
          <Target className="text-amber-500 mb-2 group-hover:scale-110 transition-transform" size={28} />
          <h3 className="text-sm font-semibold text-brand-gray">C1: Best F1 Score</h3>
          <div className="text-4xl font-bold text-brand-indigo mt-2">
            {metrics?.challenge1?.f1 ? (metrics.challenge1.f1 * 100).toFixed(1) + '%' : '...'}
          </div>
        </div>
        <div className="card p-6 flex flex-col items-center text-center group hover:border-brand-indigo transition-colors">
          <Zap className="text-red-500 mb-2 group-hover:scale-110 transition-transform" size={28} />
          <h3 className="text-sm font-semibold text-brand-gray">C2: Best Accuracy</h3>
          <div className="text-4xl font-bold text-brand-indigo mt-2">
            {metrics?.challenge2?.accuracy ? (metrics.challenge2.accuracy * 100).toFixed(1) + '%' : '...'}
          </div>
        </div>
        <div className="card p-6 flex flex-col items-center text-center group hover:border-brand-indigo transition-colors">
          <Activity className="text-cyan-500 mb-2 group-hover:scale-110 transition-transform" size={28} />
          <h3 className="text-sm font-semibold text-brand-gray">C3: Best ROC-AUC</h3>
          <div className="text-4xl font-bold text-brand-indigo mt-2">
            {metrics?.challenge3?.roc_auc ? (metrics.challenge3.roc_auc * 100).toFixed(1) + '%' : '...'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 text-brand-navy">How Our Models Compare</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-xs text-brand-gray mb-2 font-semibold uppercase tracking-wider">Challenge 1 (F1-Score)</h4>
              <ComparisonChart comparisonData={metrics?.challenge1?.comparison} />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 text-brand-navy">Session Prediction Log</h3>
          {historyLogs.length === 0 ? (
            <div className="text-center text-brand-gray py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              No predictions yet — try a challenge!
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-brand-border">
              <table className="w-full text-sm text-left text-brand-gray">
                <thead className="text-xs uppercase bg-slate-100 text-brand-gray border-b border-brand-border">
                  <tr>
                    <th className="px-4 py-3">Challenge</th>
                    <th className="px-4 py-3">Input Preview</th>
                    <th className="px-4 py-3">Label</th>
                    <th className="px-4 py-3">Confidence</th>
                    <th className="px-4 py-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {historyLogs.map((log, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-brand-navy">{log.ch}</td>
                      <td className="px-4 py-3 truncate max-w-[150px]">{log.input}</td>
                      <td className="px-4 py-3 font-mono text-brand-navy bg-slate-100 rounded px-2 py-1 inline-block mt-2">{String(log.label)}</td>
                      <td className="px-4 py-3 font-semibold text-brand-indigo">{(log.confidence * 100).toFixed(1)}%</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
