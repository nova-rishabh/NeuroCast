import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import PredictionBadge from '../components/PredictionBadge';
import ConfidenceBar from '../components/ConfidenceBar';
import WordHeatmap from '../components/WordHeatmap';
import MetricsPanel from '../components/MetricsPanel';
import BatchUploader from '../components/BatchUploader';
import { RocCurve, BarChart } from '../components/ChartComponents';
import { api, downloadBlob } from '../utils/api';

export default function Challenge3() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [detectedLangUI, setDetectedLangUI] = useState('Type to detect');

  useEffect(() => {
    api.c3Metrics().then(res => setMetrics(res.data)).catch(console.error);
    const saved = sessionStorage.getItem('c3_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!text.trim()) {
      setDetectedLangUI('Type to detect');
      return;
    }
    const handler = setTimeout(() => {
      // Simple heuristic for Hindi
      const hasDevanagari = /[\u0900-\u097F]/.test(text);
      if (hasDevanagari) setDetectedLangUI('🇮🇳 Hindi Detected');
      else setDetectedLangUI('🇬🇧 English Detected');
    }, 500);
    return () => clearTimeout(handler);
  }, [text]);

  const handlePredict = async () => {
    if (!text.trim()) { toast.error('Please enter a comment'); return; }
    setLoading(true);
    try {
      const res = await api.c3Predict(text);
      setResult(res.data);
      const newHistory = [{ text, ...res.data }, ...history].slice(0, 5);
      setHistory(newHistory);
      sessionStorage.setItem('c3_history', JSON.stringify(newHistory));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Prediction failed');
    }
    setLoading(false);
  };

  const handleBatch = async (file) => {
    setBatchLoading(true);
    try {
      const res = await api.c3Batch(file);
      downloadBlob(res.data, 'toxic_predictions.csv');
      toast.success('Batch processing complete!');
    } catch (err) {
      toast.error('Batch processing failed');
    }
    setBatchLoading(false);
  };

  const balanceData = {
    labels: ['Non-toxic (0)', 'Toxic (1)'],
    datasets: [{
      label: 'Count',
      data: [4506, 4494],
      backgroundColor: ['#22C55E', '#EF4444'],
    }]
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="border-b border-cyan-500/30 pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy flex items-center space-x-3">
            <span className="text-cyan-500">🌐</span>
            <span>Multilingual Toxic Comment Classifier</span>
          </h1>
          <p className="text-brand-gray mt-2">Identify toxicity in comments.</p>
        </div>
        <div className="mt-4 md:mt-0 px-4 py-2 bg-slate-50 rounded-full border border-slate-200 text-sm text-cyan-600 font-medium shadow-sm">
          Supports 🇬🇧 English & 🇮🇳 Hindi
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-3/5 space-y-6">
          <div className="card p-6 border-brand-border">
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-4 text-brand-navy focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none shadow-inner"
                placeholder="Enter comment in English or Hindi..."
              ></textarea>
              <div className="absolute top-3 right-3 text-xs bg-slate-200/80 px-2 py-1 rounded text-cyan-700 font-medium backdrop-blur-sm">
                {detectedLangUI}
              </div>
            </div>
            
            <button
              onClick={handlePredict}
              disabled={loading}
              className="mt-4 w-full py-3 bg-brand-indigo hover:bg-brand-navy disabled:opacity-50 text-white font-semibold rounded-xl transition-all flex justify-center items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {loading && <Loader2 className="animate-spin h-5 w-5" />}
              <span>{loading ? 'Analyzing...' : 'Detect Toxicity'}</span>
            </button>
          </div>

          {result && (
            <div className="card p-6 border-cyan-500/30 shadow-lg shadow-cyan-500/10">
              <div className="flex justify-between items-start mb-4">
                <PredictionBadge label={result.label} labelText={result.label_text} challenge={3} />
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
              <div className="text-sm text-brand-gray mb-4 flex items-center space-x-2">
                <span>API Lang:</span>
                <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-brand-navy font-medium rounded">{result.detected_language}</span>
              </div>
              <ConfidenceBar confidence={result.confidence} />
              <WordHeatmap text={text} wordWeights={result.word_weights} />
            </div>
          )}

          {history.length > 0 && (
            <div className="card p-6 border-brand-border">
              <h3 className="text-sm font-semibold text-brand-gray mb-4 uppercase tracking-wider">Recent Predictions</h3>
              <div className="space-y-3">
                {history.map((h, i) => (
                  <div key={i} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                    <span className="truncate w-1/2 text-brand-navy font-medium">"{h.text}"</span>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold tracking-wide ${h.label === 1 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-700'}`}>
                        {h.label === 1 ? 'TOXIC' : 'NON-TOXIC'}
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
          <MetricsPanel metrics={metrics} challenge={3} />
          
          <RocCurve rocCurve={metrics?.roc_curve} auc={metrics?.roc_auc} />
          <BarChart data={balanceData} title="Class Balance" />

          <BatchUploader
            challenge={3}
            accept=".csv, .xlsx"
            onUpload={handleBatch}
            isLoading={batchLoading}
          />

          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-brand-border text-sm text-slate-600">
            <strong className="text-brand-navy">Labels:</strong> 1 = Toxic, 0 = Non-toxic
          </div>
        </div>
      </div>
    </motion.div>
  );
}
