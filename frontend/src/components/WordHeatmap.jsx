export default function WordHeatmap({ text, wordWeights }) {
  if (!wordWeights || wordWeights.length === 0) return null;
  const weightMap = Object.fromEntries(wordWeights.map(w => [w.word.toLowerCase(), w.weight]));

  const getStyle = (word) => {
    const w = weightMap[word.toLowerCase()];
    if (w === undefined) return {};
    if (w > 0) {
      const alpha = Math.min(w, 1) * 0.6;
      return { backgroundColor: `rgba(239,68,68,${alpha})`, borderRadius: '3px', padding: '0 2px' };
    } else {
      const alpha = Math.min(Math.abs(w), 1) * 0.6;
      return { backgroundColor: `rgba(59,130,246,${alpha})`, borderRadius: '3px', padding: '0 2px' };
    }
  };

  return (
    <div className="mt-3">
      <p className="text-xs text-slate-500 mb-2 font-medium">Word Influence Heatmap</p>
      <div className="p-3 bg-[#111827] rounded-lg text-sm leading-7 flex flex-wrap gap-1">
        {text.split(/\s+/).map((word, i) => {
          const clean = word.replace(/[^a-zA-Z\u0900-\u097F]/g, '');
          const w = weightMap[clean.toLowerCase()];
          return (
            <span key={i} style={getStyle(clean)}
              title={w !== undefined ? `Weight: ${w.toFixed(3)}` : 'Not in top features'}>
              {word}
            </span>
          );
        })}
      </div>
      <p className="text-xs text-slate-600 mt-1">
        <span className="text-red-400">■ Red</span> = pushes toward positive class &nbsp;
        <span className="text-blue-400">■ Blue</span> = pushes toward negative class
      </p>
    </div>
  );
}