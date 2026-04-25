import React from 'react';

export default function WordHeatmap({ text, wordWeights }) {
  if (!text || !wordWeights) return null;

  const words = text.split(/\s+/);
  
  const getBackgroundColor = (word) => {
    const cleanWord = word.toLowerCase().replace(/[^\w\s]/gi, '');
    const weightObj = wordWeights.find((w) => w.word === cleanWord);
    
    if (!weightObj) return 'transparent';
    
    const weight = weightObj.weight;
    if (weight > 0) {
      return `rgba(239, 68, 68, ${weight * 0.8})`; // Red for positive
    } else {
      return `rgba(59, 130, 246, ${Math.abs(weight) * 0.8})`; // Blue for negative
    }
  };

  const getTooltip = (word) => {
    const cleanWord = word.toLowerCase().replace(/[^\w\s]/gi, '');
    const weightObj = wordWeights.find((w) => w.word === cleanWord);
    return weightObj ? `Weight: ${weightObj.weight.toFixed(3)}` : '';
  };

  return (
    <div className="card p-4 mt-4 bg-slate-50 border-brand-border">
      <h4 className="text-sm font-semibold mb-2 text-brand-navy">Word Importance Heatmap</h4>
      <div className="leading-relaxed whitespace-pre-wrap text-brand-navy">
        {words.map((word, idx) => (
          <span
            key={idx}
            className="px-1 rounded transition-colors duration-200 hover:ring-1 ring-slate-400 cursor-default inline-block"
            style={{ backgroundColor: getBackgroundColor(word) }}
            title={getTooltip(word)}
          >
            {word}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center space-x-4 text-xs text-brand-gray">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-500/50 rounded"></div>
          <span>Positive Impact</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-500/50 rounded"></div>
          <span>Negative Impact</span>
        </div>
      </div>
    </div>
  );
}
