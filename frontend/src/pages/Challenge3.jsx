import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader, Copy, ChevronDown, ChevronUp, MessageSquareWarning } from 'lucide-react';
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

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

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
    <div className="min-h-screen" style={{ background: '#03040A' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">

        <motion.div {...fadeUp(0)} className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs tracking-widest uppercase"
              style={{ color: '#2DD4BF' }}>
              CHALLENGE 03 · MEAN ROC-AUC
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">
            🌐 Multilingual Toxic Classifier
          </h1>
          <p className="text-slate-400 max-w-xl text-lg">Detects toxic comments in English and Hindi with binary labels, supporting scalable content moderation.</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="glass-card p-6 border-t-2 border-[#2DD4BF]">
              <div className="flex items-center justify-between mb-4">
                <label className="font-display font-semibold text-white text-base">Comment Text</label>
                {text.length > 0 && (
                  <span className="text-xs bg-[rgba(45,212,191,0.1)] text-[#2DD4BF] border border-[rgba(45,212,191,0.2)]
                    px-2 py-0.5 rounded-full">
                    {lang.flag} {lang.label}
                  </span>
                )}
              </div>
              <textarea value={text} onChange={e => setText(e.target.value)}
                rows={5} placeholder="Enter comment in English or Hindi... e.g. 'You are so stupid' or 'तुम बहुत बेकार हो'"
                className="neo-input"
                style={{ resize: 'vertical' }}/>
              <div className="flex justify-end mt-4">
                <button onClick={predict} disabled={loading}
                  className="btn-primary flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #2DD4BF, #5EEAD4)' }}>
                  {loading ? <><Loader size={14} className="animate-spin"/> Detecting...</> : 'Detect Toxicity'}
                </button>
              </div>
            </div>

            {result && (
              <div className="glass-card p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <PredictionBadge label={result.label} labelText={result.label_text} challenge={3}/>
                  <button onClick={copy} className="p-2 text-slate-500 hover:text-slate-300 transition-colors">
                    <Copy size={16}/>
                  </button>
                </div>
                <ConfidenceBar confidence={result.confidence}/>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Detected language:</span>
                  <span className="text-xs bg-[rgba(45,212,191,0.1)] text-[#2DD4BF] border border-[rgba(45,212,191,0.2)]
                    px-2 py-0.5 rounded-full">
                    {result.detected_language === 'hi' ? '🇮🇳 Hindi' : '🇬🇧 English'}
                  </span>
                </div>
                <WordHeatmap text={text} wordWeights={result.word_weights}/>
              </div>
            )}

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
                        <span className={`font-mono font-bold ${h.label === 1 ? 'text-red-400' : 'text-[#2DD4BF]'}`}>
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
                <div className="mt-4">
                  <ComparisonChart comparison={metrics.comparison} metricLabel="ROC-AUC"/>
                </div>
              )}
            </div>
            <div className="glass-card p-6">
              <BatchUploader
                onBatch={api.c3Batch}
                accept=".csv,.xlsx"
                challenge={3}
                fileName="toxicity_predictions.csv"
              />
              <div className="mt-4 p-3 bg-[rgba(45,212,191,0.1)] border border-[rgba(45,212,191,0.2)] rounded-xl">
                <p className="text-xs text-[#2DD4BF] font-mono text-center">Labels: 1 = Toxic · 0 = Non-toxic</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}