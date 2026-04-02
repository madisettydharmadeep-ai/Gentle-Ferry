'use client';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { playSwooshSound } from '../utils/sound';

export default function FerrySleeps({ isDarkMode, timeToMidnight, onOpenTomorrowModal }) {
  // Clean, subtle color variables
  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSub = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const borderCol = isDarkMode ? 'border-white/10' : 'border-slate-900/10';
  const bgCol = isDarkMode ? 'bg-black/40' : 'bg-white/40';
  const glowCol = isDarkMode ? 'bg-blue-500/10' : 'bg-slate-400/10';

  return (
    <div className="w-full min-h-[500px] relative flex flex-col items-center justify-center overflow-hidden">
      
      {/* Expanded ambient glow for full width */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`w-[80%] max-w-5xl h-[400px] rounded-[100%] blur-[120px] ${glowCol}`} />
      </div>

      {/* Main glass card - Removed max-w constraints, spans full width */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`relative z-10 w-full flex flex-col items-center justify-center backdrop-blur-xl border-y md:border ${borderCol} ${bgCol} rounded-none md:rounded-2xl p-10 md:p-20 text-center shadow-2xl`}
      >
        {/* Label */}
        <p className={`text-xs font-semibold tracking-[0.2em] uppercase mb-6 md:mb-8 ${textSub}`}>
          Ferry at Rest
        </p>

        {/* Time - Scaled up significantly for wide screens */}
        <div className={`font-mono text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tight mb-4 md:mb-6 ${textMain}`}>
          {timeToMidnight || '00:00:00'}
        </div>

        {/* Sub-label */}
        <p className={`text-sm md:text-base mb-10 md:mb-14 ${textSub}`}>
          Until the next departure
        </p>

        {/* Subtle Divider */}
        <div className="w-full flex justify-center mb-10 md:mb-12">
          <div className={`w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-${isDarkMode ? 'white/20' : 'slate-900/20'} to-transparent`} />
        </div>

        {/* Action Button - Auto width on larger screens to prevent absurd stretching */}
        <button
          onClick={() => { playSwooshSound(); onOpenTomorrowModal(); }}
          className={`group relative flex items-center justify-center gap-3 w-full sm:w-auto sm:min-w-[320px] py-4 px-8 rounded-xl transition-all duration-300
            ${isDarkMode
              ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
              : 'bg-slate-900/5 hover:bg-slate-900/10 text-slate-900 border border-slate-900/10'
            }`}
        >
          <Calendar size={18} className="opacity-70 group-hover:opacity-100 transition-opacity" />
          <span className="text-sm md:text-base font-medium tracking-wide">
            Plan Tomorrow
          </span>
          <ArrowRight size={18} className="opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all duration-300" />
        </button>
      </motion.div>
    </div>
  );
}