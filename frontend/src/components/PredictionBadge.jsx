import React from 'react';
import { motion } from 'framer-motion';

export default function PredictionBadge({ label, labelText, challenge }) {
  let bgColor = 'bg-gray-600';
  let textColor = 'text-white';
  let dotColor = 'bg-gray-300';
  let displayLabel = labelText;

  if (challenge === 1) {
    if (label === 1) {
      bgColor = 'bg-red-100';
      textColor = 'text-red-600';
      dotColor = 'bg-red-600';
      displayLabel = '🚨 INFORMATIVE';
    } else {
      bgColor = 'bg-slate-100';
      textColor = 'text-slate-600';
      dotColor = 'bg-slate-500';
      displayLabel = '💤 NOT INFORMATIVE';
    }
  } else if (challenge === 2) {
    if (label === 'TRUE') {
      bgColor = 'bg-green-100';
      textColor = 'text-green-700';
      dotColor = 'bg-green-600';
      displayLabel = '✅ REAL NEWS';
    } else {
      bgColor = 'bg-red-100';
      textColor = 'text-red-600';
      dotColor = 'bg-red-600';
      displayLabel = '❌ FAKE NEWS';
    }
  } else if (challenge === 3) {
    if (label === 1) {
      bgColor = 'bg-orange-100';
      textColor = 'text-orange-600';
      dotColor = 'bg-orange-500';
      displayLabel = '⚠️ TOXIC';
    } else {
      bgColor = 'bg-green-100';
      textColor = 'text-green-700';
      dotColor = 'bg-green-600';
      displayLabel = '✅ NON-TOXIC';
    }
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="flex flex-col items-start space-y-2 mb-4"
    >
      <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border border-current ${bgColor} ${textColor} font-bold tracking-wider`}>
        <span className={`w-2 h-2 rounded-full animate-ping ${dotColor}`}></span>
        <span>{displayLabel}</span>
      </div>
      <div className="font-mono text-xs text-gray-500">
        Raw label: {String(label)}
      </div>
    </motion.div>
  );
}
