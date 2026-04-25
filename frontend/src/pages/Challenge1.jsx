import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, downloadBlob } from '../utils/api';
import PredictionBadge from '../components/PredictionBadge';
import ConfidenceBar from '../components/ConfidenceBar';
import WordHeatmap from '../components/WordHeatmap';
import MetricsPanel from '../components/MetricsPanel';
import BatchUploader from '../components/BatchUploader';
import { ConfusionMatrix, ComparisonChart } from '../components/ChartComponents';

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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🚨</span>
          <h1 className="text-3xl font-black text-slate-100">Disaster Tweet Classifier</h1>
        </div>
        <p className="text-slate-400 ml-12">
          Classify tweets as <span className="text-amber-400 font-semibold">Informative</span> (1) or{' '}
          <span className="text-slate-500 font-semibold">Not Informative</span> (0)
        </p>
        <div className="ml-12 mt-2 flex gap-2">
          <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
            Metric: Macro F1-Score
          </span>
          <span className="text-xs bg-slate-700/50 text-slate-400 border border-slate-600 px-2 py-0.5 rounded-full">
            Dataset: CrisisLexT26 · 25,933 tweets
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left */}
        <div className="flex-1 space-y-4">
          <div className="card p-5">
            <label className="text-sm font-semibold text-slate-300 mb-2 block">
              Tweet Text
            </label>
            <textarea
              value={text} onChange={e => setText(e.target.value)}
              maxLength={280} rows={4} placeholder="Paste a tweet here... e.g. 'Fire burning near downtown, people evacuating'"
              className="w-full bg-[#111827] border border-[#2D3748] focus:border-amber-500/50
                rounded-xl px-4 py-3 text-slate-100 text-sm resize-none
                outline-none transition-colors placeholder-slate-600"
            />
            <div className="flex justify-between items-center mt-2">
              <span className={`text-xs font-mono ${text.length > 250 ? 'text-red-400' : 'text-slate-600'}`}>
                {text.length}/280
              </span>
              <button onClick={predict} disabled={loading}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700
                  disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-xl
                  text-sm transition-colors">
                {loading ? <><Loader size={14} className="animate-spin"/> Classifying...</> : 'Classify Tweet'}
              </button>
            </div>
          </div>

          {result && (
            <div className="card p-5 space-y-4">
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
            <div className="card p-4">
              <button onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 w-full">
                {showHistory ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                Prediction History ({history.length})
              </button>
              {showHistory && (
                <div className="mt-3 space-y-2">
                  {history.map((h, i) => (
                    <div key={i} className="flex items-center justify-between text-xs bg-[#111827] rounded-lg px-3 py-2">
                      <span className="text-slate-400 truncate max-w-[200px]">{h.text}...</span>
                      <span className={`font-mono font-bold ${h.label === 1 ? 'text-amber-400' : 'text-slate-500'}`}>
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
        <div className="w-full lg:w-80 space-y-4">
          <div className="card p-5">
            <p className="text-sm font-semibold text-slate-300 mb-3">Model Performance</p>
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
          <div className="card p-5">
            <BatchUploader
              onBatch={api.c1Batch}
              accept=".csv"
              challenge={1}
              fileName="disaster_predictions.csv"
            />
            <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-xs text-amber-400 font-mono">Labels: 1 = Informative · 0 = Not Informative</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}