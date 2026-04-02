'use client';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Frown, Meh, Smile } from 'lucide-react';
import { playPopSound, playTapSound } from '../utils/sound';
import { useAppContext } from '../app/context/AppContext';

const MOODS = [
  { value: 1, label: 'Low', color: '#ff6b6b', Icon: Frown },
  { value: 2, label: 'Mid', color: '#ffcf54', Icon: Meh },
  { value: 3, label: 'High', color: '#5ba882', Icon: Smile },
];

export default function AchievementUnlockedModal({ onLog, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [selectedMood, setSelectedMood] = useState(2);
  const [messageIndex] = useState(Math.floor(Math.random() * 3));
  const { isDarkMode, theme } = useAppContext();
  
  useEffect(() => {
    setMounted(true);
    playPopSound?.();
  }, []);

  const ENCOURAGEMENTS = [
    {
      title: "A Day Well Lived",
      subtitle: "You’ve inscribed your intent. Now, let the evening bloom.",
      color: isDarkMode ? "#2c2a25" : "#ffdbc5", // Deep Charcoal or Soft Peach
      heartColor: isDarkMode ? "#ff6b6b" : "#ff6b6b"
    },
    {
      title: "Time to Rest",
      subtitle: "You did exactly enough today. The horizon waits for your return.",
      color: isDarkMode ? "#1a2e26" : "#e2f0d9", // Deep Forest or Soft Sage
      heartColor: isDarkMode ? "#3aae51" : "#3aae51"
    },
    {
      title: "Beautiful Work",
      subtitle: "Each entry is a step. Be proud of the rhythm you've kept.",
      color: isDarkMode ? "#2c2a25" : "#fff4bd", // Deep Charcoal or Soft Sun
      heartColor: isDarkMode ? "#ffcf54" : "#ffcf54"
    }
  ];

  const current = ENCOURAGEMENTS[messageIndex];

  const content = (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center p-6 overflow-hidden">
      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className={`absolute inset-0 ${isDarkMode ? 'bg-black/80' : 'bg-[#2c2a25]/85'} backdrop-blur-[6px]`}
         onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`w-full max-w-[480px] ${isDarkMode ? 'bg-[#1a1815]' : 'bg-[#fffcf2]'} border-[6px] ${isDarkMode ? 'border-white/10' : 'border-[#2c2a25]'} rounded-xl p-8 md:p-10 relative z-10 flex flex-col items-center ${isDarkMode ? 'shadow-[24px_24px_0_rgba(0,0,0,0.6)]' : 'shadow-[12px_12px_0_#2c2a25]'}`}
      >
         {/* The Central Heart Icon */}
         <motion.div 
           initial={{ y: -10, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.2 }}
           className={`w-20 h-20 rounded-full border-[4px] ${isDarkMode ? 'border-white/10' : 'border-[#2c2a25]'} ${isDarkMode ? 'shadow-[5px_5px_0_rgba(0,0,0,0.4)]' : 'shadow-[5px_5px_0_#2c2a25]'} flex items-center justify-center mb-6 relative`}
           style={{ backgroundColor: current.color }}
         >
           <Heart size={44} fill={current.heartColor} className={isDarkMode ? 'text-white/80' : 'text-[#2c2a25]'} strokeWidth={3} />
         </motion.div>

         <div className="flex flex-col items-center text-center gap-1 mb-8">
            <h2 className={`text-3xl md:text-4xl font-serif font-black ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'} uppercase tracking-tighter leading-none mb-1`}>
              {current.title}
            </h2>
            <div className={`w-10 h-1 ${isDarkMode ? 'bg-white/20' : 'bg-[#ffcf54]'} rounded-full mb-2`} />
            <p className={`font-sans font-extrabold ${isDarkMode ? 'text-[#fdf8ea]/60' : 'text-[#2c2a25]/60'} text-[15px] md:text-[16px] leading-relaxed max-w-[280px]`}>
              {current.subtitle}
            </p>
         </div>

         {/* Mood Picker: Simplified */}
         <div className={`w-full ${isDarkMode ? 'bg-white/5' : 'bg-[#f8f5ee]'} rounded-xl p-5 mb-8 flex flex-col items-center gap-4 border-[3px] ${isDarkMode ? 'border-white/5' : 'border-[#2c2a2510]'}`}>
            <span className={`font-sans font-black text-[9px] uppercase tracking-[0.4em] ${isDarkMode ? 'text-[#fdf8ea]/30' : 'text-[#2c2a25]/30'} text-center`}>
               How did today feel?
            </span>
            <div className="flex justify-center w-full gap-3">
               {MOODS.map(m => (
                 <button
                   key={m.value}
                   onClick={() => { playTapSound(); setSelectedMood(m.value); }}
                   className={`w-20 h-20 rounded-xl border-[4px] ${isDarkMode ? 'border-white/10' : 'border-[#2c2a25]'} flex flex-col items-center justify-center gap-1 transition-all group ${
                     selectedMood === m.value 
                       ? 'shadow-none translate-y-1' 
                       : (isDarkMode ? 'bg-[#2c2a25] shadow-[5px_5px_0_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:shadow-[7px_7px_0_rgba(0,0,0,0.4)]' : 'bg-white shadow-[5px_5px_0_#2c2a25] hover:-translate-y-1 hover:shadow-[7px_7px_0_#2c2a25]')
                   }`}
                   style={{ backgroundColor: selectedMood === m.value ? m.color : '' }}
                 >
                    <m.Icon size={28} strokeWidth={2.5} className={selectedMood === m.value ? 'text-white' : ''} style={{ color: selectedMood !== m.value ? m.color : '' }} />
                    <span className={`font-sans font-black text-[8px] uppercase tracking-widest ${selectedMood === m.value ? 'text-white' : (isDarkMode ? 'text-[#fdf8ea]/20' : 'text-[#2c2a25]/40')}`}>
                       {m.label}
                    </span>
                 </button>
               ))}
            </div>
         </div>

         <div className="flex flex-col w-full gap-3 relative z-20">
            <button
              onClick={() => onLog(selectedMood)}
              className={`w-full ${isDarkMode ? 'bg-[#ffcf54] text-[#2c2a25]' : 'bg-[#2c2a25] text-[#ffcf54]'} py-4 rounded-xl border-[4px] ${isDarkMode ? 'border-transparent' : 'border-[#2c2a25]'} ${isDarkMode ? 'shadow-[5px_5px_0_rgba(0,0,0,0.4)]' : 'shadow-[5px_5px_0_#ffcf5430]'} hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all font-sans font-black uppercase tracking-[0.2em] text-[15px] flex items-center justify-center gap-4`}
            >
              Sign & Archive Record
            </button>
            
            <button
              onClick={onClose}
              className={`w-full bg-transparent ${isDarkMode ? 'text-[#fdf8ea]/20' : 'text-[#2c2a25]/30'} py-1 transition-all font-sans font-black uppercase tracking-widest text-[9px] ${isDarkMode ? 'hover:text-[#fdf8ea]' : 'hover:text-[#2c2a25]'}`}
            >
              Not Right Now
            </button>
         </div>
      </motion.div>
    </div>
  );

   if (!mounted) return null;
   return createPortal(content, document.body);
 }
