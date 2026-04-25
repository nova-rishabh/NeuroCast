import { Bar, Line, Doughnut } from 'react-chartjs-2';

const darkOptions = {
  responsive: true,
  plugins: {
    legend: { labels: { color: '#94A3B8', font: { size: 11 } } },
    title: { color: '#94A3B8' },
  },
  scales: {
    x: { ticks: { color: '#94A3B8' }, grid: { color: '#2D3748' } },
    y: { ticks: { color: '#94A3B8' }, grid: { color: '#2D3748' }, max: 1 },
  },
};

export function ConfusionMatrix({ matrix }) {
  if (!matrix || matrix.length < 2) return null;
  const [[tn, fp], [fn, tp]] = matrix;
  const cells = [
    { label: 'True Neg', value: tn, color: 'bg-green-500/20 text-green-300' },
    { label: 'False Pos', value: fp, color: 'bg-red-500/20 text-red-300' },
    { label: 'False Neg', value: fn, color: 'bg-red-500/20 text-red-300' },
    { label: 'True Pos', value: tp, color: 'bg-green-500/20 text-green-300' },
  ];
  return (
    <div>
      <p className="text-xs text-slate-500 mb-2 font-medium">Confusion Matrix</p>
      <div className="grid grid-cols-2 gap-2">
        {cells.map((c, i) => (
          <div key={i} className={`rounded-lg p-3 text-center ${c.color} border border-current/20`}>
            <p className="text-xs text-slate-500">{c.label}</p>
            <p className="text-xl font-bold">{c.value?.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LabelDistributionChart({ data, labels, colors }) {
  const chartData = {
    labels,
    datasets: [{ data, backgroundColor: colors, borderColor: 'transparent' }],
  };
  return (
    <div>
      <p className="text-xs text-slate-500 mb-2 font-medium">Label Distribution (Training)</p>
      <Doughnut data={chartData}
        options={{ responsive: true, plugins: { legend: { labels: { color: '#94A3B8' } } } }}/>
    </div>
  );
}

export function RocCurveChart({ fpr, tpr, auc }) {
  const data = {
    datasets: [
      {
        label: `ROC Curve (AUC = ${auc})`,
        data: fpr.map((x, i) => ({ x, y: tpr[i] })),
        borderColor: '#22D3EE', backgroundColor: 'rgba(34,211,238,0.1)',
        fill: true, tension: 0.3, pointRadius: 0,
      },
      {
        label: 'Random',
        data: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
        borderColor: '#4B5563', borderDash: [5, 5],
        pointRadius: 0, fill: false,
      },
    ],
  };
  const opts = {
    responsive: true,
    scales: {
      x: { type: 'linear', min: 0, max: 1, title: { display: true, text: 'FPR', color: '#94A3B8' },
        ticks: { color: '#94A3B8' }, grid: { color: '#2D3748' } },
      y: { min: 0, max: 1, title: { display: true, text: 'TPR', color: '#94A3B8' },
        ticks: { color: '#94A3B8' }, grid: { color: '#2D3748' } },
    },
    plugins: { legend: { labels: { color: '#94A3B8', font: { size: 11 } } } },
  };
  return (
    <div>
      <p className="text-xs text-slate-500 mb-2 font-medium">ROC Curve</p>
      <Line data={data} options={opts}/>
    </div>
  );
}

export function ComparisonChart({ comparison, metricLabel }) {
  if (!comparison) return null;
  const data = {
    labels: ['Logistic Regression', 'Naive Bayes', 'SVM'],
    datasets: [{
      label: metricLabel,
      data: [comparison.LR, comparison.NB, comparison.SVM],
      backgroundColor: ['rgba(99,102,241,0.7)', 'rgba(34,211,238,0.7)', 'rgba(245,158,11,0.7)'],
      borderRadius: 6,
    }],
  };
  return (
    <div className="mt-4">
      <p className="text-xs text-slate-500 mb-2 font-medium">Model Comparison ({metricLabel})</p>
      <Bar data={data} options={{ ...darkOptions, scales: { ...darkOptions.scales, y: { ...darkOptions.scales.y, min: 0 } } }}/>
    </div>
  );
}