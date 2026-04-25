import React from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

export function ConfusionMatrix({ matrix }) {
  if (!matrix) return null;
  const [[tn, fp], [fn, tp]] = matrix;
  const max = Math.max(tn, fp, fn, tp);
  
  const getColor = (val) => {
    const alpha = Math.max(0.1, val / max);
    return `rgba(79, 70, 229, ${alpha})`;
  };

  return (
    <div className="card p-4 mb-6">
      <h4 className="text-sm font-semibold mb-4 text-brand-navy">Confusion Matrix</h4>
      <div className="grid grid-cols-2 gap-2 text-center text-sm font-mono">
        <div className="p-4 rounded-lg flex flex-col justify-center border border-brand-border" style={{ backgroundColor: getColor(tn) }}>
          <span className="text-brand-gray text-xs">True Negative</span>
          <span className="font-bold text-lg text-brand-navy">{tn}</span>
        </div>
        <div className="p-4 rounded-lg flex flex-col justify-center border border-brand-border" style={{ backgroundColor: getColor(fp) }}>
          <span className="text-brand-gray text-xs">False Positive</span>
          <span className="font-bold text-lg text-brand-navy">{fp}</span>
        </div>
        <div className="p-4 rounded-lg flex flex-col justify-center border border-brand-border" style={{ backgroundColor: getColor(fn) }}>
          <span className="text-brand-gray text-xs">False Negative</span>
          <span className="font-bold text-lg text-brand-navy">{fn}</span>
        </div>
        <div className="p-4 rounded-lg flex flex-col justify-center border border-brand-border" style={{ backgroundColor: getColor(tp) }}>
          <span className="text-brand-gray text-xs">True Positive</span>
          <span className="font-bold text-lg text-brand-navy">{tp}</span>
        </div>
      </div>
    </div>
  );
}

export function BarChart({ data, title }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#64748B' } },
      title: { display: true, text: title, color: '#1A0B2E' }
    },
    scales: {
      y: { ticks: { color: '#64748B' }, grid: { color: '#E2E8F0' } },
      x: { ticks: { color: '#64748B' }, grid: { color: '#E2E8F0' } }
    }
  };
  return (
    <div className="card p-4 mb-6 h-64">
      <Bar options={options} data={data} />
    </div>
  );
}

export function DonutChart({ data, title }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#64748B' } },
      title: { display: true, text: title, color: '#1A0B2E' }
    },
    cutout: '70%',
  };
  return (
    <div className="card p-4 mb-6 h-64">
      <Doughnut options={options} data={data} />
    </div>
  );
}

export function RocCurve({ rocCurve, auc }) {
  if (!rocCurve) return null;
  const data = {
    labels: rocCurve.fpr,
    datasets: [
      {
        label: `ROC Curve (AUC = ${auc})`,
        data: rocCurve.tpr,
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Random Baseline',
        data: rocCurve.fpr,
        borderColor: '#94A3B8',
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#64748B' } },
    },
    scales: {
      x: { title: { display: true, text: 'False Positive Rate', color: '#64748B' }, ticks: { color: '#64748B' }, grid: { color: '#E2E8F0' } },
      y: { title: { display: true, text: 'True Positive Rate', color: '#64748B' }, ticks: { color: '#64748B' }, grid: { color: '#E2E8F0' } }
    }
  };

  return (
    <div className="card p-4 mb-6 h-64">
      <Line options={options} data={data} />
    </div>
  );
}

export function ComparisonChart({ comparisonData }) {
  if (!comparisonData) return null;
  
  const data = {
    labels: ['Logistic Regression', 'Naive Bayes', 'Linear SVM'],
    datasets: [
      {
        label: 'Score',
        data: [comparisonData.LR, comparisonData.NB, comparisonData.SVM],
        backgroundColor: ['#4F46E5', '#06B6D4', '#22C55E'],
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Model Comparison', color: '#1A0B2E' }
    },
    scales: {
      y: { min: 0, max: 1, ticks: { color: '#64748B' }, grid: { color: '#E2E8F0' } },
      x: { ticks: { color: '#64748B' }, grid: { color: '#E2E8F0' } }
    }
  };

  return (
    <div className="card p-4 mb-6 h-64">
      <Bar options={options} data={data} />
    </div>
  );
}
