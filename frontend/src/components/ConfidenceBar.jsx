import { useEffect, useState } from 'react';

export default function ConfidenceBar({ confidence }) {
  const [width, setWidth] = useState(0);
  const pct = Math.round(confidence * 100);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 80);
    return () => clearTimeout(t);
  }, [pct]);

  const color = pct >= 75
    ? 'bg-green-500'
    : pct >= 60
    ? 'bg-yellow-500'
    : 'bg-red-500';

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>Confidence</span>
        <span className="font-mono font-semibold text-slate-200">{pct}%</span>
      </div>
      <div className="h-2 bg-[#2D3748] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}