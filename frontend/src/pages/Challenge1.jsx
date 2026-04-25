import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import PredictionBadge from '../components/PredictionBadge';
import ConfidenceBar from '../components/ConfidenceBar';
import WordHeatmap from '../components/WordHeatmap';
import MetricsPanel from '../components/MetricsPanel';
import BatchUploader from '../components/BatchUploader';
import { ConfusionMatrix, ComparisonChart } from '../components/ChartComponents';
import { api, downloadBlob } from '../utils/api';

export default function Challenge1() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [batchLoading, setBatchLoading] = useState(false);

  useEffect(() => {
    api.c1Metrics().then(res => setMetrics(res.data)).catch(console.error);
    const saved = sessionStorage.getItem('c1_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handlePredict = async () => {
    if (!text.trim()) { toast.error('Please enter a tweet'); return; }
    setLoading(true);
    try {
      const res = await api.c1Predict(text);
      setResult(res.data);
      const newHistory = [{ text, ...res.data }, ...history].slice(0, 5);
      setHistory(newHistory);
      sessionStorage.setItem('c1_history', JSON.stringify(newHistory));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Prediction failed');
    }
    setLoading(false);
  };

  const handleBatch = async (file) => {
    setBatchLoading(true);
    try {
      const res = await api.c1Batch(file);
      downloadBlob(res.data, 'disaster_predictions.csv');
      toast.success('Batch processing complete!');
    } catch (err) {
      toast.error('Batch processing failed');
    }
    setBatchLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="border-b border-amber-500/30 pb-6 mb-8">
        <h1 className="text-3xl font-bold text-brand-navy flex items-center space-x-3">
          <span className="text-amber-500">🚨</span>
          <span>Disaster Tweet Classifier</span>
        </h1>
        <p className="text-brand-gray mt-2">Identify whether a tweet is reporting an actual crisis or not.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-3/5 space-y-6">
          <div className="card p-6 border-brand-border">
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 280))}
                className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-4 text-brand-navy focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none shadow-inner"
                placeholder="Paste a tweet here..."
              ></textarea>
              <div className={`absolute bottom-3 right-3 text-xs ${text.length > 260 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                {text.length} / 280
              </div>
            </div>
            
            <button
              onClick={handlePredict}
              disabled={loading}
              className="mt-4 w-full py-3 bg-brand-indigo hover:bg-brand-navy disabled:opacity-50 text-white font-semibold rounded-xl transition-all flex justify-center items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {loading && <Loader2 className="animate-spin h-5 w-5" />}
              <span>{loading ? 'Analyzing...' : 'Classify Tweet'}</span>
            </button>
          </div>

          {result && (
            <div className="card p-6 border-amber-500/30 shadow-lg shadow-amber-500/10">
              <div className="flex justify-between items-start mb-4">
                <PredictionBadge label={result.label} labelText={result.label_text} challenge={1} />
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
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold tracking-wide ${h.label === 1 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                        {h.label === 1 ? 'INFORMATIVE' : 'NOT INFORMATIVE'}
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
          <MetricsPanel metrics={metrics} challenge={1} />
          {metrics?.confusion_matrix && <ConfusionMatrix matrix={metrics.confusion_matrix} />}
          {metrics?.comparison && <ComparisonChart comparisonData={metrics.comparison} />}
          
          <BatchUploader
            challenge={1}
            accept=".csv"
            onUpload={handleBatch}
            isLoading={batchLoading}
          />

          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-brand-border text-sm text-slate-600">
            <strong className="text-brand-navy">Labels:</strong> 1 = Informative, 0 = Not Informative
          </div>
        </div>
      </div>
    </motion.div>
  );
}
