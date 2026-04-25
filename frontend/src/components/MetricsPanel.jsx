import React from 'react';
import { Target, Activity, Zap, CheckCircle2 } from 'lucide-react';

export default function MetricsPanel({ metrics, challenge }) {
  if (!metrics) {
    return (
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-4 h-24 bg-slate-200 animate-pulse rounded-xl"></div>
        ))}
      </div>
    );
  }

  let displayMetrics = [];

  const formatVal = (val) => (val * 100).toFixed(1) + '%';

  if (challenge === 1) {
    displayMetrics = [
      { name: 'Macro F1-Score', value: formatVal(metrics.f1), icon: <Target className="text-amber-500" /> },
      { name: 'Precision', value: formatVal(metrics.precision), icon: <CheckCircle2 className="text-amber-500" /> },
      { name: 'Recall', value: formatVal(metrics.recall), icon: <Activity className="text-amber-500" /> },
      { name: 'Accuracy', value: formatVal(metrics.accuracy), icon: <Zap className="text-amber-500" /> },
    ];
  } else if (challenge === 2) {
    displayMetrics = [
      { name: 'Accuracy', value: formatVal(metrics.accuracy), icon: <Zap className="text-red-500" /> },
      { name: 'Precision', value: formatVal(metrics.precision), icon: <CheckCircle2 className="text-red-500" /> },
      { name: 'Recall', value: formatVal(metrics.recall), icon: <Activity className="text-red-500" /> },
      { name: 'F1-Score', value: formatVal(metrics.f1), icon: <Target className="text-red-500" /> },
    ];
  } else if (challenge === 3) {
    displayMetrics = [
      { name: 'ROC-AUC', value: formatVal(metrics.roc_auc), icon: <Target className="text-cyan-500" /> },
      { name: 'Accuracy', value: formatVal(metrics.accuracy), icon: <Zap className="text-cyan-500" /> },
      { name: 'F1-Score', value: formatVal(metrics.f1 || 0), icon: <CheckCircle2 className="text-cyan-500" /> },
      { name: 'Threshold', value: '0.5', icon: <Activity className="text-gray-500" /> },
    ];
  }

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {displayMetrics.map((m, i) => (
        <div key={i} className="card p-4 flex flex-col justify-between hover:border-brand-indigo transition-colors">
          <div className="flex items-center space-x-2 mb-2 text-brand-gray">
            {m.icon}
            <span className="text-sm font-medium">{m.name}</span>
          </div>
          <div className="text-2xl font-bold text-brand-navy">{m.value}</div>
        </div>
      ))}
    </div>
  );
}
