import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import PredictionBadge from '../components/PredictionBadge';
import ConfidenceBar from '../components/ConfidenceBar';
import WordHeatmap from '../components/WordHeatmap';
import MetricsPanel from '../components/MetricsPanel';
import BatchUploader from '../components/BatchUploader';
import { DonutChart } from '../components/ChartComponents';
import { api, downloadBlob } from '../utils/api';

export default function Challenge2() {
  const [inputs, setInputs] = useState({ title: '', text: '', subject: '', date: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [batchLoading, setBatchLoading] = useState(false);

  useEffect(() => {
    api.c2Metrics().then(res => setMetrics(res.data)).catch(console.error);
    const saved = sessionStorage.getItem('c2_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handlePredict = async () => {
    if (!inputs.title.trim() && !inputs.text.trim()) {
      toast.error('Please enter headline or text');
      return;
    }
    setLoading(true);
    try {
      const res = await api.c2Predict(inputs.title, inputs.text, inputs.subject, inputs.date);
      setResult(res.data);
      const newHistory = [{ title: inputs.title, ...res.data }, ...history].slice(0, 5);
      setHistory(newHistory);
      sessionStorage.setItem('c2_history', JSON.stringify(newHistory));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Prediction failed');
    }
    setLoading(false);
  };

  const handleBatch = async (file) => {
    setBatchLoading(true);
    try {
      const res = await api.c2Batch(file);
      downloadBlob(res.data, 'fakenews_predictions.csv');
      toast.success('Batch processing complete!');
    } catch (err) {
      toast.error('Batch processing failed');
    }
    setBatchLoading(false);
  };

  const donutData = {
    labels: ['Real News (TRUE)', 'Fake News (FALSE)'],
    datasets: [{
      label: 'Count',
      data: [15438, 8455],
      backgroundColor: ['#22C55E', '#EF4444'],
    }]
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="border-b border-red-500/30 pb-6 mb-8">
        <h1 className="text-3xl font-bold text-brand-navy flex items-center space-x-3">
          <span className="text-red-500">📰</span>
          <span>Fake News Detector</span>
        </h1>
        <p className="text-brand-gray mt-2">Analyze news articles to classify them as real or fake.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-3/5 space-y-6">
          <div className="card p-6 space-y-4 border-brand-border">
            <input
              type="text"
              value={inputs.title}
              onChange={(e) => setInputs({ ...inputs, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-brand-navy focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-inner"
              placeholder="Article Headline / Title..."
            />
            <textarea
              value={inputs.text}
              onChange={(e) => setInputs({ ...inputs, text: e.target.value })}
              className="w-full h-40 bg-slate-50 border border-slate-200 rounded-xl p-4 text-brand-navy focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all resize-none shadow-inner"
              placeholder="Full Article Text..."
            ></textarea>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="text-xs text-brand-gray block mb-1">Subject (optional)</label>
                <input
                  type="text"
                  value={inputs.subject}
                  onChange={(e) => setInputs({ ...inputs, subject: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-brand-navy focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-brand-gray block mb-1">Date (optional)</label>
                <input
                  type="date"
                  value={inputs.date}
                  onChange={(e) => setInputs({ ...inputs, date: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-brand-navy focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>
            
            <button
              onClick={handlePredict}
              disabled={loading}
              className="mt-4 w-full py-3 bg-brand-indigo hover:bg-brand-navy disabled:opacity-50 text-white font-semibold rounded-xl transition-all flex justify-center items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {loading && <Loader2 className="animate-spin h-5 w-5" />}
              <span>{loading ? 'Analyzing...' : 'Analyze Article'}</span>
            </button>
          </div>

          {result && (
            <div className="card p-6 border-red-500/30 shadow-lg shadow-red-500/10">
              <div className="flex justify-between items-start mb-4">
                <PredictionBadge label={result.label} labelText={result.label_display} challenge={2} />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`Label: ${result.label} | Confidence: ${(result.confidence*100).toFixed(1)}%`);
                    toast.success('Copied to clipboard!');
                  }}
                  className="p-2 text-slate-400 hover:text-brand-indigo bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Copy Result"
                >
                  <Copy size={18} />
                </button>
              </div>
              <ConfidenceBar confidence={result.confidence} />
              <WordHeatmap text={`${inputs.title} ${inputs.text}`} wordWeights={result.word_weights} />
            </div>
          )}

          {history.length > 0 && (
            <div className="card p-6 border-brand-border">
              <h3 className="text-sm font-semibold text-brand-gray mb-4 uppercase tracking-wider">Recent Predictions</h3>
              <div className="space-y-3">
                {history.map((h, i) => (
                  <div key={i} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                    <span className="truncate w-1/2 text-brand-navy font-medium">"{h.title || 'No Title'}"</span>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold tracking-wide ${h.label === 'TRUE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {h.label === 'TRUE' ? 'REAL' : 'FAKE'}
                      </span>
                      <span className="text-slate-500 font-mono">{(h.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-2/5">
          <MetricsPanel metrics={metrics} challenge={2} />
          
          <DonutChart data={donutData} title="Training Label Distribution" />

          <BatchUploader
            challenge={2}
            accept=".csv"
            onUpload={handleBatch}
            isLoading={batchLoading}
          />

          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-brand-border text-sm text-slate-600">
            <strong className="text-brand-navy">Labels:</strong> TRUE = Real News, FALSE = Fake News
          </div>
        </div>
      </div>
    </motion.div>
  );
}
