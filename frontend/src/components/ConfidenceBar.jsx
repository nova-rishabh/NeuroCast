import React, { useState, useEffect } from 'react';

export default function ConfidenceBar({ confidence }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(confidence * 100), 100);
    return () => clearTimeout(timer);
  }, [confidence]);

  let barColor = 'bg-red-500';
  if (confidence >= 0.75) barColor = 'bg-green-500';
  else if (confidence >= 0.6) barColor = 'bg-yellow-500';

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between text-sm font-medium mb-1 text-brand-navy">
        <span>Confidence</span>
        <span className="font-mono">{(confidence * 100).toFixed(1)}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden shadow-inner">
        <div
          className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${barColor}`}
          style={{ width: `${width}%` }}
        ></div>
      </div>
    </div>
  );
}
