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
import { RocCurveChart, ComparisonChart, LabelDistributionChart } from '../components/ChartComponents';

function detectLang(text) {
  const devanagari = /[\u0900-\u097F]/;
  return devanagari.test(text) ? { code: 'HI', flag: '🇮🇳', label: 'Hindi Detected' }
    : { code: 'EN', flag: '🇬🇧', label: 'English Detected' };
}

export default function Challenge3() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const lang = detectLang(text);

  useEffect(() => {
    api.c3Metrics().then(r => setMetrics(r.data)).catch(() => {});
  }, []);

  const predict = async () => {
    if (!text.trim()) return toast.error('Please enter a comment.');
    setLoading(true);
    try {
      const r = await api.c3Predict(text);
      setResult(r.data);
      setHistory(h => [{ text: text.slice(0, 50), ...r.data, time: new Date().toLocaleTimeString() }, ...h].slice(0, 5));
    } catch { toast.error('Prediction failed. Is the backend running?'); }
    finally { setLoading(false); }
  };

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(`Label: ${result.label} (${result.label_text}) | Confidence: ${Math.round(result.confidence * 100)}%`);
    toast.success('Copied!');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🌐</span>
          <h1 className="text-3xl font-black text-slate-100">Multilingual Toxic Classifier</h1>
        </div>
        <p className="text-slate-400 ml-12">
          Detect toxic comments in <span className="text-cyan-400 font-semibold">English 🇬🇧</span> and{' '}
          <span className="text-cyan-400 font-semibold">Hindi 🇮🇳</span>
        </p>
        <div className="ml-12 mt-2 flex gap-2">
          <span className="text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full">
            Metric: ROC-AUC
          </span>
          <span className="text-xs bg-slate-700/50 text-slate-400 border border-slate-600 px-2 py-0.5 rounded-full">
            Dataset: 9,000 multilingual comments
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-300">Comment Text</label>
              {text.length > 0 && (
                <span className="text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30
                  px-2 py-0.5 rounded-full">
                  {lang.flag} {lang.label}
                </span>
              )}
            </div>
            <textarea value={text} onChange={e => setText(e.target.value)}
              rows={5} placeholder="Enter comment in English or Hindi... e.g. 'You are so stupid' or 'तुम बहुत बेकार हो'"
              className="w-full bg-[#111827] border border-[#2D3748] focus:border-cyan-500/50
                rounded-xl px-4 py-3 text-slate-100 text-sm resize-none outline-none
                transition-colors placeholder-slate-600"/>
            <div className="flex justify-end mt-3">
              <button onClick={predict} disabled={loading}
                className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700
                  disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-xl
                  text-sm transition-colors">
                {loading ? <><Loader size={14} className="animate-spin"/> Detecting...</> : 'Detect Toxicity'}
              </button>
            </div>
          </div>

          {result && (
            <div className="card p-5 space-y-4">
              <div className="flex items-start justify-between">
                <PredictionBadge label={result.label} labelText={result.label_text} challenge={3}/>
                <button onClick={copy} className="p-2 text-slate-500 hover:text-slate-300">
                  <Copy size={16}/>
                </button>
              </div>
              <ConfidenceBar confidence={result.confidence}/>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Detected language:</span>
                <span className="text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30
                  px-2 py-0.5 rounded-full">
                  {result.detected_language === 'hi' ? '🇮🇳 Hindi' : '🇬🇧 English'}
                </span>
              </div>
              <WordHeatmap text={text} wordWeights={result.word_weights}/>
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
                      <span className={`font-bold ${h.label === 1 ? 'text-red-400' : 'text-green-400'}`}>
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
            <MetricsPanel metrics={metrics} challenge={3}/>
            {metrics?.roc_curve && (
              <div className="mt-4">
                <RocCurveChart
                  fpr={metrics.roc_curve.fpr}
                  tpr={metrics.roc_curve.tpr}
                  auc={metrics.roc_auc}
                />
              </div>
            )}
            <div className="mt-4">
              <LabelDistributionChart
                data={[4506, 4494]}
                labels={['Non-toxic (0)', 'Toxic (1)']}
                colors={['rgba(34,197,94,0.7)', 'rgba(239,68,68,0.7)']}
              />
            </div>
            {metrics?.comparison && (
              <ComparisonChart comparison={metrics.comparison} metricLabel="ROC-AUC"/>
            )}
          </div>
          <div className="card p-5">
            <BatchUploader
              onBatch={api.c3Batch}
              accept=".csv,.xlsx"
              challenge={3}
              fileName="toxic_predictions.csv"
            />
            <div className="mt-3 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
              <p className="text-xs text-cyan-400 font-mono">Labels: 1 = Toxic · 0 = Non-toxic</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}