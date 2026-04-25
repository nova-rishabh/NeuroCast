import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldAlert, FileWarning, Globe } from 'lucide-react';

export default function Home() {
  const cards = [
    {
      id: 1,
      title: 'Disaster Tweet Detection',
      icon: <ShieldAlert className="text-cyan-400 mb-4" size={32} />,
      border: 'border-cyan-500/20',
      description: 'Classify crisis-related tweets to aid emergency responders.',
      link: '/challenge/1'
    },
    {
      id: 2,
      title: 'Fake News Detection',
      icon: <FileWarning className="text-cyan-400 mb-4" size={32} />,
      border: 'border-cyan-500/20',
      description: 'Analyze news articles for misinformation and deceptive patterns.',
      link: '/challenge/2'
    },
    {
      id: 3,
      title: 'Multilingual Toxicity',
      icon: <Globe className="text-cyan-400 mb-4" size={32} />,
      border: 'border-cyan-500/20',
      description: 'Detect toxic comments across English and Hindi texts.',
      link: '/challenge/3'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center pt-24 pb-12 w-full flex-grow"
    >
      <div className="text-center max-w-3xl mb-24 pt-10 relative z-10">
        <div className="flex justify-center mb-8">
            <span className="px-4 py-1.5 rounded-full bg-brand-indigo/10 border border-brand-indigo/20 text-xs font-medium text-brand-indigo tracking-wide flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-indigo animate-pulse"></span>
            <span>Live inference online</span>
            </span>
        </div>
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="NeuroCast Logo" className="h-32 w-auto object-contain drop-shadow-sm" />
        </div>
        <h1 className="text-5xl font-extrabold text-brand-navy mb-4 tracking-tight">NeuroCast</h1>
        <p className="text-xl text-brand-gray font-normal mb-8 leading-relaxed">
            3 challenges. 1 platform.<br/>Global NLP Intelligence Datathon
        </p>
        <Link to="/dashboard" className="inline-block px-8 py-3 rounded-full bg-brand-indigo text-white font-semibold text-sm hover:bg-brand-navy shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 border border-transparent relative z-20 cursor-pointer">
            View Global Dashboard
        </Link>
      </div>

      <div className="w-full border-y border-brand-border bg-white/50 backdrop-blur-sm py-12 mb-24 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-around items-center space-y-8 md:space-y-0">
            <div className="text-center">
                <div className="text-4xl font-black text-brand-navy mb-2 tracking-tight">25,933</div>
                <div className="text-xs text-brand-gray font-semibold tracking-widest uppercase">Total Training Samples</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-brand-border"></div>
            <div className="text-center">
                <div className="text-4xl font-black text-brand-navy mb-2 tracking-tight">23,893</div>
                <div className="text-xs text-brand-gray font-semibold tracking-widest uppercase">Total Validation Samples</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-brand-border"></div>
            <div className="text-center">
                <div className="text-4xl font-black text-brand-navy mb-2 tracking-tight">3</div>
                <div className="text-xs text-brand-gray font-semibold tracking-widest uppercase">Active Models</div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-16 px-4 relative z-10">
        {cards.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            viewport={{ once: true }}
            className={`card p-8 flex flex-col h-full bg-white border border-brand-border hover:border-brand-indigo transition-all rounded-2xl group`}
          >
            <div className="p-3 bg-slate-50 rounded-xl w-fit mb-6 text-brand-indigo group-hover:bg-brand-indigo/10 transition-colors">
              {React.cloneElement(card.icon, { className: 'text-brand-indigo mb-0', size: 28 })}
            </div>
            <h3 className="text-xl font-bold mb-3 text-brand-navy">{card.title}</h3>
            <p className="text-sm text-brand-gray mb-8 flex-grow leading-relaxed">{card.description}</p>
            <Link
              to={card.link}
              className="mt-auto block w-full py-2 text-left text-sm font-semibold text-brand-indigo hover:text-brand-navy transition-colors flex items-center space-x-2"
            >
              <span>Run Inference</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
