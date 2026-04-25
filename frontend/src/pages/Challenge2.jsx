import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader, Copy, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../utils/api';
import PredictionBadge from '../components/PredictionBadge';
import ConfidenceBar from '../components/ConfidenceBar';
import WordHeatmap from '../components/WordHeatmap';
import MetricsPanel from '../components/MetricsPanel';
import BatchUploader from '../components/BatchUploader';
import { LabelDistributionChart, ComparisonChart } from '../components/ChartComponents';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Challenge2() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    api.c2Metrics().then(r => setMetrics(r.data)).catch(() => {});
  }, []);

  const predict = async () => {
    if (!title.trim() && !text.trim()) return toast.error('Please enter a headline or article text.');
    setLoading(true);
    try {
      const r = await api.c2Predict(title, text, subject, date);
      setResult(r.data);
      setHistory(h => [{ text: title.slice(0, 50) || text.slice(0, 50), ...r.data, time: new Date().toLocaleTimeString() }, ...h].slice(0, 5));
    } catch { toast.error('Prediction failed. Is the backend running?'); }
    finally { setLoading(false); }
  };

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(`Label: ${result.label} (${result.label_display}) | Confidence: ${Math.round(result.confidence * 100)}%`);
    toast.success('Copied!');
  };

  return (
    <div className="min-h-screen" style={{ background: '#03040A' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">

        <motion.div {...fadeUp(0)} className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs tracking-widest uppercase"
              style={{ color: '#EF4444' }}>
              CHALLENGE 02 · OVERALL ACCURACY
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">
            📰 Fake News Detector
          </h1>
          <p className="text-slate-400 max-w-xl text-lg">Identifies whether a news article is Real (TRUE) or Fake (FALSE) by analyzing headline and full body text.</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="glass-card p-6 border-t-2 border-[#EF4444]">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Article Headline / Title</label>
                  <input value={title} onChange={e => setTitle(e.target.value)}
                    placeholder="Enter the news headline..."
                    className="neo-input"/>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Article Body / Text</label>
                  <textarea value={text} onChange={e => setText(e.target.value)}
                    rows={8} placeholder="Paste the full article text..."
                    className="neo-input"
                    style={{ resize: 'vertical' }}/>
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <div className="flex-1">
                  <label className="text-xs text-slate-500 mb-1 block">Subject <span className="text-slate-600">(optional)</span></label>
                  <input value={subject} onChange={e => setSubject(e.target.value)}
                    placeholder="e.g. politicsNews"
                    className="neo-input"/>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-slate-500 mb-1 block">Date <span className="text-slate-600">(optional)</span></label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)}
                    className="neo-input"/>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button onClick={predict} disabled={loading}
                  className="btn-primary flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #EF4444, #F87171)' }}>
                  {loading ? <><Loader size={14} className="animate-spin"/> Analyzing...</> : 'Analyze Article'}
                </button>
              </div>
            </div>

            {result && (
              <div className="glass-card p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <PredictionBadge label={result.label} labelText={result.label_display} challenge={2}/>
                  <button onClick={copy} className="p-2 text-slate-500 hover:text-slate-300 transition-colors">
                    <Copy size={16}/>
                  </button>
                </div>
                <ConfidenceBar confidence={result.confidence}/>
                <WordHeatmap text={`${title} ${text}`} wordWeights={result.word_weights}/>
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
                        <span className={`font-mono font-bold ${h.label === 'TRUE' ? 'text-green-400' : 'text-[#EF4444]'}`}>
                          {h.label} · {Math.round(h.confidence * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="w-full lg:w-[400px] space-y-4">
            <div className="glass-card p-6">
              <p className="font-display font-semibold text-white mb-4 text-base">Model Performance</p>
              <MetricsPanel metrics={metrics} challenge={2}/>
              <div className="mt-4">
                <LabelDistributionChart
                  data={[15438, 8455]}
                  labels={['TRUE (Real)', 'FALSE (Fake)']}
                  colors={['rgba(34,197,94,0.7)', 'rgba(239,68,68,0.7)']}
                />
              </div>
              {metrics?.comparison && (
                <div className="mt-4">
                   <ComparisonChart comparison={metrics.comparison} metricLabel="Accuracy"/>
                </div>
              )}
            </div>
            <div className="glass-card p-6">
              <BatchUploader
                onBatch={api.c2Batch}
                accept=".csv"
                challenge={2}
                fileName="fakenews_predictions.csv"
              />
              <div className="mt-4 p-3 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] rounded-xl">
                <p className="text-xs text-[#EF4444] font-mono text-center">Labels: "TRUE" = Real · "FALSE" = Fake</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}