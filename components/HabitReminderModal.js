'use client';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';
import { playPopSound, playTapSound } from '../utils/sound';
import { useAppContext } from '../app/context/AppContext';
import HabitOrb from './HabitOrb';

export default function HabitReminderModal({ tasks, onToggleTask, onProceed, onClose }) {
  const [mounted, setMounted] = useState(false);
  const { isDarkMode } = useAppContext();
  
  useEffect(() => {
    setMounted(true);
    playPopSound?.();
  }, []);

  const habits = tasks.filter(t => t.isHabit);

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
         {/* Minimal Header */}
         <div className="flex flex-col items-center text-center gap-1 mb-10">
            <div className={`w-12 h-12 rounded-full border-[3px] ${isDarkMode ? 'border-white/10' : 'border-[#2c2a25]'} flex items-center justify-center mb-4 bg-[#ffcf54]`}>
               <Sparkles size={24} className="text-[#2c2a25]" strokeWidth={3} />
            </div>
            <h2 className={`text-3xl font-serif font-black ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'} uppercase tracking-tighter leading-none mb-1`}>
              Just a Quick Reminder
            </h2>
            <div className={`w-10 h-1 ${isDarkMode ? 'bg-white/20' : 'bg-[#ffcf54]'} rounded-full mb-3`} />
            <p className={`font-sans font-extrabold ${isDarkMode ? 'text-[#fdf8ea]/60' : 'text-[#2c2a25]/60'} text-[15px] leading-relaxed`}>
              In case you forgot to mark them on the main deck—did you practice any of these rhythms today?
            </p>
         </div>
         
         {/* Habit Orbs Section - No Container */}
         <div className="flex flex-wrap justify-center gap-6 mb-12">
            {habits.map((task, idx) => (
              <HabitOrb 
                key={task.id}
                task={task}
                idx={idx}
                isDarkMode={isDarkMode}
                onToggle={onToggleTask}
              />
            ))}
         </div>

         <div className="flex flex-col w-full gap-3 relative z-20">
            <button
              onClick={() => { playTapSound(); onProceed(); }}
              className={`w-full ${isDarkMode ? 'bg-[#ffcf54] text-[#2c2a25]' : 'bg-[#2c2a25] text-[#ffcf54]'} py-4 rounded-xl border-[4px] ${isDarkMode ? 'border-transparent' : 'border-[#2c2a25]'} ${isDarkMode ? 'shadow-[5px_5px_0_rgba(0,0,0,0.4)]' : 'shadow-[5px_5px_0_#ffcf5430]'} hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all font-sans font-black uppercase tracking-[0.2em] text-[15px] flex items-center justify-center gap-4`}
            >
              Continue to Evening Log <ArrowRight size={18} strokeWidth={4} />
            </button>
            
            <button
              onClick={onClose}
              className={`w-full bg-transparent ${isDarkMode ? 'text-[#fdf8ea]/20' : 'text-[#2c2a25]/30'} py-1 transition-all font-sans font-black uppercase tracking-widest text-[9px] ${isDarkMode ? 'hover:text-[#fdf8ea]' : 'hover:text-[#2c2a25]'}`}
            >
              Back to Deck
            </button>
         </div>
      </motion.div>
    </div>
  );

   if (!mounted) return null;
   return createPortal(content, document.body);
}
