import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader, Copy, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, downloadBlob } from '../utils/api';
import PredictionBadge from '../components/PredictionBadge';
import ConfidenceBar from '../components/ConfidenceBar';
import WordHeatmap from '../components/WordHeatmap';
import MetricsPanel from '../components/MetricsPanel';
import BatchUploader from '../components/BatchUploader';
import { ConfusionMatrix, ComparisonChart } from '../components/ChartComponents';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Challenge1() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    api.c1Metrics().then(r => setMetrics(r.data)).catch(() => {});
  }, []);

  const predict = async () => {
    if (!text.trim()) return toast.error('Please enter a tweet.');
    setLoading(true);
    try {
      const r = await api.c1Predict(text);
      setResult(r.data);
      setHistory(h => [{ text: text.slice(0, 50), ...r.data, time: new Date().toLocaleTimeString() }, ...h].slice(0, 5));
    } catch { toast.error('Prediction failed. Is the backend running?'); }
    finally { setLoading(false); }
  };

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(`Label: ${result.label} (${result.label_text}) | Confidence: ${Math.round(result.confidence * 100)}%`);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen" style={{ background: '#03040A' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">

        <motion.div {...fadeUp(0)} className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs tracking-widest uppercase"
              style={{ color: '#F59E0B' }}>
              CHALLENGE 01 · MACRO F1-SCORE
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">
            🚨 Disaster Tweet Classifier
          </h1>
          <p className="text-slate-400 max-w-xl text-lg">Classify tweets as Informative or Not Informative to power real-time emergency response filtering.</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left */}
          <div className="flex-1 space-y-4">
            <div className="glass-card p-6 border-t-2 border-[#F59E0B]">
              <label className="font-display font-semibold text-white mb-4 text-base block">
                Tweet Text
              </label>
              <textarea
                value={text} onChange={e => setText(e.target.value)}
                maxLength={280} rows={4} placeholder="Paste a tweet here... e.g. 'Fire burning near downtown, people evacuating'"
                className="neo-input"
                style={{ resize: 'vertical' }}
              />
              <div className="flex justify-between items-center mt-4">
                <span className={`text-xs font-mono ${text.length > 250 ? 'text-red-400' : 'text-slate-600'}`}>
                  {text.length}/280
                </span>
                <button onClick={predict} disabled={loading}
                  className="btn-primary flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #F59E0B, #FBBF24)' }}>
                  {loading ? <><Loader size={14} className="animate-spin"/> Classifying...</> : 'Classify Tweet'}
                </button>
              </div>
            </div>

            {result && (
              <div className="glass-card p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <PredictionBadge label={result.label} labelText={result.label_text} challenge={1}/>
                  <button onClick={copy} className="p-2 text-slate-500 hover:text-slate-300 transition-colors">
                    <Copy size={16}/>
                  </button>
                </div>
                <ConfidenceBar confidence={result.confidence}/>
                <WordHeatmap text={text} wordWeights={result.word_weights}/>
              </div>
            )}

            {/* History */}
            {history.length > 0 && (
              <div className="glass-card p-6">
                <button onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 w-full">
                  {showHistory ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                  Prediction History ({history.length})
                </button>
                {showHistory && (
                  <div className="mt-4 space-y-2">
                    {history.map((h, i) => (
                      <div key={i} className="flex items-center justify-between text-xs bg-[#0D0F1C] border border-[rgba(99,102,241,0.1)] rounded-xl px-4 py-3">
                        <span className="text-slate-400 truncate max-w-[200px]">{h.text}...</span>
                        <span className={`font-mono font-bold ${h.label === 1 ? 'text-[#F59E0B]' : 'text-slate-500'}`}>
                          {h.label} · {Math.round(h.confidence * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right */}
          <div className="w-full lg:w-[400px] space-y-4">
            <div className="glass-card p-6">
              <p className="font-display font-semibold text-white mb-4 text-base">Model Performance</p>
              <MetricsPanel metrics={metrics} challenge={1}/>
              {metrics?.confusion_matrix && (
                <div className="mt-4">
                  <ConfusionMatrix matrix={metrics.confusion_matrix}/>
                </div>
              )}
              {metrics?.comparison && (
                <ComparisonChart comparison={metrics.comparison} metricLabel="F1 Score"/>
              )}
            </div>
            <div className="glass-card p-6">
              <BatchUploader
                onBatch={api.c1Batch}
                accept=".csv"
                challenge={1}
                fileName="disaster_predictions.csv"
              />
              <div className="mt-4 p-3 bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)] rounded-xl">
                <p className="text-xs text-[#F59E0B] font-mono text-center">Labels: 1 = Informative · 0 = Not Informative</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}