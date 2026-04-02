'use client';
import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Moon, Sun, Plus } from 'lucide-react';
import { playSwooshSound, playPopSound } from '../utils/sound';
import { TaskCard } from './TaskCard';
import { useAppContext } from '../app/context/AppContext';

export default function TomorrowModal({ onClose, tasks, onAddTask, onToggleTask, onDeleteTask }) {
  const [mounted, setMounted] = useState(false);
  const { today, isHabitScheduledForDay, isDarkMode, theme } = useAppContext();
  
  useEffect(() => {
    setMounted(true);
    playSwooshSound();
  }, []);

  // Calculate Tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowDateStr = tomorrow.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Filter tasks for tomorrow
  // 1. Habits scheduled for tomorrow
  // 2. Unchecked non-habit tasks (because they will roll over)
  const tomorrowTasks = tasks.filter(t => {
     if (t.isHabit) return isHabitScheduledForDay(t, tomorrow);
     return !t.checked; // Non-habits stay if unchecked
  });

  if (!mounted) return null;

  const content = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`relative w-full max-w-4xl ${isDarkMode ? 'bg-[#1a1815]' : 'bg-[#fdfaf2]'} border-[4px] ${isDarkMode ? 'border-white/10' : 'border-[#2c2a25]'} ${isDarkMode ? 'shadow-[24px_24px_0_rgba(0,0,0,0.6)]' : 'shadow-[12px_12px_0_#2c2a25]'} rounded-xl flex flex-col overflow-hidden max-h-[85vh]`}
      >
        {/* Header Section */}
        <div className={`p-6 md:p-8 border-b-[3px] ${isDarkMode ? 'border-white/5' : 'border-[#2c2a25]/5'} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
          <div className="flex items-center gap-4">
             <div className={`w-12 h-12 ${isDarkMode ? 'bg-[#2c2a25]' : 'bg-[#ffcf54]'} border-[3px] ${isDarkMode ? 'border-white/10' : 'border-[#2c2a25]'} rounded-xl flex items-center justify-center ${isDarkMode ? 'shadow-[4px_4px_0_rgba(0,0,0,0.4)]' : 'shadow-[4px_4px_0_#2c2a25]'}`}>
                <Sparkles size={24} className={isDarkMode ? 'text-[#ffcf54]' : 'text-[#2c2a25]'} strokeWidth={2.5} />
             </div>
             <div>
                <h2 className={`font-serif font-black text-2xl md:text-3xl ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'} uppercase tracking-tighter leading-none`}>
                   Tomorrow's Seeds
                </h2>
                <p className={`font-sans font-black text-[10px] uppercase tracking-[0.2em] ${isDarkMode ? 'text-[#fdf8ea]/20' : 'text-[#2c2a25]/40'} mt-1`}>
                   Drafting the Next Awakening • {tomorrowDateStr}
                </p>
             </div>
          </div>
          
          <button 
            onClick={onClose}
            className={`absolute top-6 right-6 p-2 ${isDarkMode ? 'bg-[#2c2a25]' : 'bg-white'} border-[3px] ${isDarkMode ? 'border-white/10' : 'border-[#2c2a25]'} ${isDarkMode ? 'shadow-[3px_3px_0_rgba(0,0,0,0.4)]' : 'shadow-[3px_3px_0_#2c2a25]'} rounded-lg hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all`}
          >
            <X size={20} strokeWidth={3} className={isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'} />
          </button>
        </div>

        {/* Task List Section */}
        <div className={`flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/lined-paper-2.png')] ${isDarkMode ? 'bg-white/[0.02]' : ''}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             <AnimatePresence mode="popLayout">
                {tomorrowTasks.map(task => (
                  <TaskCard 
                    key={task.id}
                    task={task}
                    onToggle={onToggleTask}
                    onDelete={onDeleteTask}
                    onClick={() => {}}
                    isDarkMode={isDarkMode}
                    theme={theme}
                  />
                ))}
                
                {/* Add Inline Card Placeholder */}
                <motion.button 
                   layout
                   onClick={onAddTask}
                   className={`h-full min-h-[140px] border-[3px] border-dashed ${isDarkMode ? 'border-white/10 text-[#fdf8ea]/20' : 'border-[#2c2a25]/20 text-[#2c2a25]/30'} rounded-xl flex flex-col items-center justify-center gap-3 group hover:border-[#2c2a25] hover:bg-[#ffcf54]/5 transition-all duration-300`}
                >
                   <div className={`w-10 h-10 ${isDarkMode ? 'bg-[#2c2a25]' : 'bg-white'} border-[2px] ${isDarkMode ? 'border-white/10' : 'border-[#2c2a25]/10'} rounded-full flex items-center justify-center group-hover:border-[#2c2a25] group-hover:bg-[#ffcf54] group-hover:scale-110 transition-all`}>
                      <Plus size={20} strokeWidth={3} className={`${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]/30'} group-hover:text-[#2c2a25]`} />
                   </div>
                   <span className={`font-sans font-black text-[10px] uppercase tracking-widest ${isDarkMode ? 'text-[#fdf8ea]/20' : 'text-[#2c2a25]/30'} group-hover:text-[#2c2a25]`}>Plant a new seed</span>
                </motion.button>
             </AnimatePresence>
          </div>
          
          {tomorrowTasks.length === 0 && (
             <div className={`pt-12 flex flex-col items-center text-center ${isDarkMode ? 'opacity-20' : 'opacity-40'}`}>
                <Sun size={48} strokeWidth={1.5} className="mb-4" />
                <p className={`font-serif italic text-lg max-w-xs ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'}`}>
                   Your tomorrow is currently a blank canvas. Let's add some intentions.
                </p>
             </div>
          )}
        </div>

        {/* Footer Info */}
        <div className={`p-6 ${isDarkMode ? 'bg-[#2c2a25]' : 'bg-white'} border-t-[3px] ${isDarkMode ? 'border-white/5' : 'border-[#2c2a25]'} flex items-center justify-between`}>
            <div className="flex items-center gap-2">
               <Moon size={16} className={isDarkMode ? 'text-[#fdf8ea]/20' : 'text-[#2c2a25]/20'} />
               <span className={`font-sans font-black text-[9px] uppercase tracking-[0.3em] ${isDarkMode ? 'text-[#fdf8ea]/30' : 'text-[#2c2a25]/30'}`}>
                  Saved to the archives for the next sunrise
               </span>
            </div>
            
            <button 
              onClick={onClose}
              className={`px-6 py-2.5 ${isDarkMode ? 'bg-[#ffcf54] text-[#2c2a25]' : 'bg-[#2c2a25] text-white'} font-sans font-black text-[10px] uppercase tracking-widest rounded-lg ${isDarkMode ? 'shadow-[4px_4px_0_rgba(0,0,0,0.4)]' : 'shadow-[4px_4px_0_rgba(44,42,37,0.2)]'} hover:-translate-y-0.5 transition-all`}
            >
              Done Planning
            </button>
        </div>
      </motion.div>
    </div>
  );

  return createPortal(content, document.body);
}
