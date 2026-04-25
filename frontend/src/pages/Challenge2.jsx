import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../utils/api';
import PredictionBadge from '../components/PredictionBadge';
import ConfidenceBar from '../components/ConfidenceBar';
import WordHeatmap from '../components/WordHeatmap';
import MetricsPanel from '../components/MetricsPanel';
import BatchUploader from '../components/BatchUploader';
import { LabelDistributionChart, ComparisonChart } from '../components/ChartComponents';

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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">📰</span>
          <h1 className="text-3xl font-black text-slate-100">Fake News Detector</h1>
        </div>
        <p className="text-slate-400 ml-12">
          Classify news as <span className="text-green-400 font-semibold">TRUE</span> (Real) or{' '}
          <span className="text-red-400 font-semibold">FALSE</span> (Fake)
        </p>
        <div className="ml-12 mt-2 flex gap-2">
          <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">
            Metric: Accuracy
          </span>
          <span className="text-xs bg-slate-700/50 text-slate-400 border border-slate-600 px-2 py-0.5 rounded-full">
            Dataset: 23,893 articles
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="card p-5 space-y-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Article Headline / Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="Enter the news headline..."
                className="w-full bg-[#111827] border border-[#2D3748] focus:border-red-500/50
                  rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none transition-colors
                  placeholder-slate-600"/>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Article Body / Text</label>
              <textarea value={text} onChange={e => setText(e.target.value)}
                rows={8} placeholder="Paste the full article text..."
                className="w-full bg-[#111827] border border-[#2D3748] focus:border-red-500/50
                  rounded-xl px-4 py-3 text-sm text-slate-100 resize-none outline-none
                  transition-colors placeholder-slate-600"/>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-slate-500 mb-1 block">Subject <span className="text-slate-600">(optional)</span></label>
                <input value={subject} onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. politicsNews"
                  className="w-full bg-[#111827] border border-[#2D3748] rounded-xl px-3 py-2
                    text-sm text-slate-100 outline-none placeholder-slate-600"/>
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-500 mb-1 block">Date <span className="text-slate-600">(optional)</span></label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  className="w-full bg-[#111827] border border-[#2D3748] rounded-xl px-3 py-2
                    text-sm text-slate-100 outline-none"/>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={predict} disabled={loading}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700
                  disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-xl
                  text-sm transition-colors">
                {loading ? <><Loader size={14} className="animate-spin"/> Analyzing...</> : 'Analyze Article'}
              </button>
            </div>
          </div>

          {result && (
            <div className="card p-5 space-y-4">
              <div className="flex items-start justify-between">
                <PredictionBadge label={result.label} labelText={result.label_display} challenge={2}/>
                <button onClick={copy} className="p-2 text-slate-500 hover:text-slate-300">
                  <Copy size={16}/>
                </button>
              </div>
              <ConfidenceBar confidence={result.confidence}/>
              <WordHeatmap text={`${title} ${text}`} wordWeights={result.word_weights}/>
            </div>
          )}

          {history.length > 0 && (
            <div className="card p-4">
              <button onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 w-full">
                {showHistory ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                History ({history.length})
              </button>
              {showHistory && (
                <div className="mt-3 space-y-2">
                  {history.map((h, i) => (
                    <div key={i} className="flex items-center justify-between text-xs bg-[#111827] rounded-lg px-3 py-2">
                      <span className="text-slate-400 truncate max-w-[200px]">{h.text}...</span>
                      <span className={`font-bold ${h.label === 'TRUE' ? 'text-green-400' : 'text-red-400'}`}>
                        {h.label} · {Math.round(h.confidence * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-full lg:w-80 space-y-4">
          <div className="card p-5">
            <p className="text-sm font-semibold text-slate-300 mb-3">Model Performance</p>
            <MetricsPanel metrics={metrics} challenge={2}/>
            <div className="mt-4">
              <LabelDistributionChart
                data={[15438, 8455]}
                labels={['TRUE (Real)', 'FALSE (Fake)']}
                colors={['rgba(34,197,94,0.7)', 'rgba(239,68,68,0.7)']}
              />
            </div>
            {metrics?.comparison && (
              <ComparisonChart comparison={metrics.comparison} metricLabel="Accuracy"/>
            )}
          </div>
          <div className="card p-5">
            <BatchUploader
              onBatch={api.c2Batch}
              accept=".csv"
              challenge={2}
              fileName="fakenews_predictions.csv"
            />
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-xs text-red-400 font-mono">Labels: "TRUE" = Real · "FALSE" = Fake</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}