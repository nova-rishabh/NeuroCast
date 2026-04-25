import { motion } from 'framer-motion';

export default function PredictionBadge({ label, labelText, challenge }) {
  const config = {
    1: {
      positive: { bg: 'bg-amber-500/20 border-amber-500/40 text-amber-300', icon: '🚨', display: 'INFORMATIVE' },
      negative: { bg: 'bg-slate-500/20 border-slate-500/40 text-slate-300', icon: '💤', display: 'NOT INFORMATIVE' },
      isPositive: label === 1,
    },
    2: {
      positive: { bg: 'bg-green-500/20 border-green-500/40 text-green-300', icon: '✅', display: 'REAL NEWS' },
      negative: { bg: 'bg-red-500/20 border-red-500/40 text-red-300', icon: '❌', display: 'FAKE NEWS' },
      isPositive: label === 'TRUE',
    },
    3: {
      positive: { bg: 'bg-red-500/20 border-red-500/40 text-red-300', icon: '⚠️', display: 'TOXIC' },
      negative: { bg: 'bg-green-500/20 border-green-500/40 text-green-300', icon: '✅', display: 'NON-TOXIC' },
      isPositive: label === 1,
    },
  };

  const cfg = config[challenge];
  const variant = cfg.isPositive ? cfg.positive : cfg.negative;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="flex flex-col items-start gap-2"
    >
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full border font-bold text-lg ${variant.bg}`}>
        <span>{variant.icon}</span>
        <span>{variant.display}</span>
        <span className="ml-1 w-2 h-2 rounded-full bg-current animate-pulse"/>
      </div>
      <span className="font-mono text-xs text-slate-500 ml-1">
        Raw label: <span className="text-slate-300">{String(label)}</span>
      </span>
    </motion.div>
  );
}