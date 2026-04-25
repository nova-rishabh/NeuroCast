import { TrendingUp, Target, RefreshCw, CheckCircle } from 'lucide-react';

export default function MetricsPanel({ metrics, challenge }) {
  if (!metrics) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[0,1,2,3].map(i => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="h-3 bg-[#2D3748] rounded mb-2 w-16"/>
            <div className="h-8 bg-[#2D3748] rounded w-20"/>
          </div>
        ))}
      </div>
    );
  }

  const items = {
    1: [
      { label: 'F1 Score', value: metrics.f1, icon: TrendingUp, color: 'text-amber-400' },
      { label: 'Precision', value: metrics.precision, icon: Target, color: 'text-indigo-400' },
      { label: 'Recall', value: metrics.recall, icon: RefreshCw, color: 'text-cyan-400' },
      { label: 'Accuracy', value: metrics.accuracy, icon: CheckCircle, color: 'text-green-400' },
    ],
    2: [
      { label: 'Accuracy', value: metrics.accuracy, icon: CheckCircle, color: 'text-red-400' },
      { label: 'Precision', value: metrics.precision, icon: Target, color: 'text-indigo-400' },
      { label: 'Recall', value: metrics.recall, icon: RefreshCw, color: 'text-cyan-400' },
      { label: 'F1 Score', value: metrics.f1, icon: TrendingUp, color: 'text-green-400' },
    ],
    3: [
      { label: 'ROC-AUC', value: metrics.roc_auc, icon: TrendingUp, color: 'text-cyan-400' },
      { label: 'Accuracy', value: metrics.accuracy, icon: CheckCircle, color: 'text-green-400' },
      { label: 'F1 Score', value: metrics.f1, icon: Target, color: 'text-indigo-400' },
      { label: 'Model', value: 'LR+TF-IDF', icon: RefreshCw, color: 'text-slate-400', isText: true },
    ],
  }[challenge] || [];

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item, i) => (
        <div key={i} className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <item.icon size={14} className={item.color} />
            <span className="text-xs text-slate-500">{item.label}</span>
          </div>
          <p className={`text-2xl font-bold ${item.color}`}>
            {item.isText ? item.value : item.value != null
              ? (item.value > 1 ? item.value : (item.value * 100).toFixed(1) + '%')
              : '—'}
          </p>
        </div>
      ))}
    </div>
  );
}