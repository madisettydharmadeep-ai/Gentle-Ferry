'use client';
import { Bookmark, CheckCircle2, FileText, Download, Share2, Frown, Meh, Smile, Play, Pause, PenTool, Hash, Clock, Quote, Stamp, X, ArrowRight } from "lucide-react";
import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MOOD_ICONS = { 1: Frown, 2: Meh, 3: Smile };
const MOOD_LABEL = { 1: 'Low', 2: 'Mid', 3: 'High' };
const MOOD_COLORS = { 1: '#ff6b6b', 2: '#ffcf54', 3: '#5ba882' };

const ReceiptCard = forwardRef(({ receipt, isDarkMode, theme, className = "" }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const audioInstance = useRef(null);

  useEffect(() => {
    return () => {
      if (audioInstance.current) {
        audioInstance.current.pause();
        audioInstance.current = null;
        setIsPlaying(false);
      }
    };
  }, [receipt?.id]);

  useImperativeHandle(ref, () => ({
    export: () => {} // Disabled as requested
  }));

  const toggleAudio = () => {
    if (!audioUrl) return;
    if (!audioInstance.current) {
      audioInstance.current = new Audio(audioUrl);
      audioInstance.current.onended = () => setIsPlaying(false);
    }
    if (isPlaying) {
      audioInstance.current.pause();
      setIsPlaying(false);
    } else {
      audioInstance.current.play();
      setIsPlaying(true);
    }
  };

  const id = receipt?.id || "ARCH_99";
  const date = receipt?.date || "A Day Unforgotten";
  const photo = receipt?.photo;
  const journal = receipt?.journal || null;
  const audioUrl = receipt?.audio || null;
  const journalType = receipt?.journalType || (audioUrl ? 'voice' : 'text');
  const tasks = receipt?.tasks || [];
  const mood = receipt?.mood || 3;

  const currentTheme = theme || { 
    taskCardText: 'text-[#2c2a25]', 
    taskCardBorder: 'border-[#2c2a25]',
    modalInputBg: 'bg-white'
  };

  return (
    <div className={`relative flex flex-col md:flex-row transition-all duration-700 overflow-hidden ${isDarkMode ? 'bg-[#1a1815]' : 'bg-[#fffcf8]'} border ${isDarkMode ? 'border-white/5' : 'border-stone-500/10'} rounded-[4px] ${className} ${isDarkMode ? 'shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)]' : 'shadow-[0_40px_100px_-30px_rgba(44,42,37,0.25)]'}`}>
      
      {/* Task Panel (Overlay) */}
      <AnimatePresence>
        {showTasks && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`absolute top-0 right-0 bottom-0 w-[280px] z-50 p-8 border-l ${isDarkMode ? 'bg-stone-900 border-white/10' : 'bg-white border-stone-200'} shadow-2xl overflow-y-auto`}
          >
            <div className="flex items-center justify-between mb-8">
              <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-stone-500' : 'text-stone-400'}`}>Tasks Accomplished</span>
              <button onClick={() => setShowTasks(false)} className="p-1 hover:bg-black/5 rounded-full transition-all text-stone-500"><X size={16} /></button>
            </div>
            <div className="flex flex-col gap-4">
              {tasks.map(t => (
                <div key={t.id} className="flex items-start gap-3">
                  <div className={`mt-1 h-3 w-3 rounded-full flex-shrink-0 border ${t.checked ? 'bg-[#5ba882] border-none' : 'border-stone-400 opacity-30'}`}>
                    {t.checked && <CheckCircle2 size={12} className="text-white" />}
                  </div>
                  <span className={`text-xs font-bold leading-relaxed ${t.checked ? 'opacity-30 line-through' : 'opacity-80'} ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>{t.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`flex-1 flex flex-col border-b md:border-b-0 md:border-r ${isDarkMode ? 'border-white/5' : 'border-stone-500/10'} relative overflow-hidden h-[400px] md:h-[500px]`}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/natural-paper.png')`, backgroundBlendMode: isDarkMode ? 'hard-light' : 'multiply', opacity: isDarkMode ? 0.7 : 1 }} />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/stardust.png')` }} />
        
        {/* Binding Shadow */}
        <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-black/20 via-black/5 to-transparent pointer-events-none z-20" />

        {/* Toggle Arrow (Top Right) */}
        <button 
          onClick={() => setShowTasks(!showTasks)}
          className={`absolute top-6 right-6 z-40 p-2 rounded-full transition-all ${isDarkMode ? 'hover:bg-white/5 text-stone-500 hover:text-stone-300' : 'hover:bg-black/5 text-stone-400 hover:text-stone-800'}`}
        >
          <ArrowRight size={20} className={`transition-transform duration-500 ${showTasks ? 'rotate-180' : ''}`} />
        </button>

        <div className="flex-1 p-14 relative z-10 overflow-y-auto scrollbar-hide">
          {journalType === 'text' && journal ? (
            <div 
              className={`font-serif italic text-lg md:text-2xl leading-[3.6rem] ${isDarkMode ? 'text-stone-300' : 'text-stone-800'} opacity-90 whitespace-pre-wrap`}
              style={{ 
                backgroundImage: `linear-gradient(transparent, transparent calc(3.6rem - 1px), ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px)`, 
                backgroundSize: '100% 3.6rem',
                minHeight: '100%'
              }}
            >
              {journal}
            </div>
          ) : journalType === 'voice' && audioUrl ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-center">
              <button 
                onClick={toggleAudio}
                className={`w-28 h-28 rounded-full flex items-center justify-center shadow-2xl transition-all ${isPlaying ? 'bg-[#5ba882]' : (isDarkMode ? 'bg-stone-800' : 'bg-white shadow-xl')}`}
              >
                {isPlaying ? <Pause size={36} fill="white" className="text-white" /> : <Play size={36} fill={isDarkMode ? 'white' : 'stone-800'} className="ml-2 text-stone-800" />}
              </button>
              <p className={`mt-8 font-serif text-xl ${isDarkMode ? 'text-stone-500' : 'text-stone-600'} italic opacity-60`}>
                {isPlaying ? "The archives are echoing..." : "A moment echoing in silence..."}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className={`w-full md:w-[320px] p-10 flex flex-col items-center justify-center ${isDarkMode ? 'bg-white/[0.01]' : 'bg-stone-500/[0.01]'}`}>
        <div className="relative group w-full px-4">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#d4a373]/20 backdrop-blur-sm rotate-2 z-20" />
          <div className={`aspect-square p-4 ${isDarkMode ? 'bg-[#252525]' : 'bg-white'} shadow-2xl transition-transform duration-700 -rotate-2 border ${isDarkMode ? 'border-white/5' : 'border-stone-100'}`}>
            {photo ? (
              <img src={photo} alt="Memory" className="w-full h-full object-cover grayscale-[0.1] opacity-90 sepia-[0.1]" />
            ) : (
              <div className="w-full h-full border border-dashed border-stone-500/10 flex flex-col items-center justify-center gap-4 text-stone-500/20">
                <FileText size={40} /><span className="text-[9px] font-black uppercase tracking-[0.3em]">Pure Intent</span>
              </div>
            )}
          </div>
        </div>
        <div className="mt-10 text-center">
           <p className={`font-serif italic text-xs ${isDarkMode ? 'text-stone-600' : 'text-stone-400'} opacity-70`}>{date} — Entry Log</p>
           <div className="mt-6 flex justify-center">
              <Stamp size={28} className={`${isDarkMode ? 'text-stone-500/10' : 'text-stone-800/5'} -rotate-12`} />
           </div>
        </div>
      </div>
    </div>
  );
});

export default ReceiptCard;