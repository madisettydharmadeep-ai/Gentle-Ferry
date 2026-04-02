'use client';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check, Trash2, Target } from 'lucide-react';
import { playPopSound, playTapSound, playTrashSound, playCheckSound } from '../utils/sound';
import { ICON_MAP } from '../utils/icons';
import { useAppContext } from '../app/context/AppContext';
import { navbarThemes } from '../utils/navbarThemes';

export default function TaskDetailModal({ task, onClose, onToggle, onDelete, onUpdateSchedule }) {
  const iconData = ICON_MAP[task.iconName] || ICON_MAP['Sparkles'] || { component: X, color: 'text-gray-400' };
  const Icon = iconData.component;
  const [mounted, setMounted] = useState(false);
  const { isDarkMode, today } = useAppContext();
  const isActualToday = today ? today.toDateString() === new Date().toDateString() : true;
  const theme = isDarkMode ? navbarThemes.dark : navbarThemes.light;
  
  useEffect(() => setMounted(true), []);

  const RHYTHMS = [
    { value: 'once', label: 'Today', color: '#ffffff' },
    { value: 'daily', label: 'Daily', color: '#ffcf54' },
    { value: 'weekdays', label: 'Weekdays', color: '#82cbfb' },
    { value: 'weekends', label: 'Weekends', color: '#ff8a8a' },
  ];

  const currentRhythm = !task.isHabit ? 'once' : (task.habitSchedule?.type || 'daily');

  const content = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#2c2a25]/60 backdrop-blur-sm p-4" onClick={() => { playPopSound(); onClose(); }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-[580px] h-auto border-[4px] ${theme.taskCardBorder} rounded-xl ${isDarkMode ? 'shadow-[12px_12px_0_#00000060]' : 'shadow-[12px_12px_0_#2c2a25]'} relative flex flex-col overflow-hidden ${theme.taskCardBg} bg-[url('https://www.transparenttextures.com/patterns/lined-paper-2.png')]`}
      >
        {/* Notebook Top Bar (Fresh Canvas Style) */}
        <div className={`absolute top-0 left-0 right-0 h-8 bg-[#c65f4b] border-b-[4px] ${theme.taskCardBorder} flex items-center justify-evenly px-8 z-30`}>
           {[1, 2, 3, 4, 5, 6].map(i => (
               <div key={i} className={`w-3 h-5 ${theme.modalBg} border-[2px] ${theme.taskCardBorder} rounded-full shadow-inner`} />
           ))}
        </div>

        {/* Close Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); playPopSound(); onClose(); }}
          className={`absolute top-10 right-4 p-1.5 ${theme.modalInputBg} border-[3px] ${theme.taskCardBorder} ${isDarkMode ? 'shadow-[3px_3px_0_#00000040]' : 'shadow-[3px_3px_0_#2c2a2510]'} rounded-lg hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all z-40 ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'}`}
        >
          <X size={18} strokeWidth={3} />
        </button>

        <div className="p-8 sm:p-10 pt-16 flex flex-col relative z-20 w-full">
          {/* Header - Mode Indicator */}
          <div className="flex flex-col items-start mb-6 w-full">
            <div className="flex items-center gap-3 mb-2">
               <div className={`w-10 h-10 rounded-xl border-[3px] ${theme.taskCardBorder} flex items-center justify-center shadow-[3px_3px_0_#2a2824] ${
                 currentRhythm === 'once' ? theme.modalInputBg : 
                 currentRhythm === 'daily' ? `bg-[${theme.recurrenceDaily}]` : 
                 currentRhythm === 'weekdays' ? `bg-[${theme.recurrenceWeekdays}]` : `bg-[${theme.recurrenceWeekends}]`
               }`} style={{ backgroundColor: currentRhythm === 'once' ? '' : (currentRhythm === 'daily' ? theme.recurrenceDaily : (currentRhythm === 'weekdays' ? theme.recurrenceWeekdays : theme.recurrenceWeekends)) }}>
                  <Icon size={20} className={isDarkMode ? 'text-[#ddd6cc]' : 'text-[#2c2a25]'} strokeWidth={2.5} />
               </div>
               <h2 className={`font-serif font-black text-3xl ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'} uppercase tracking-tighter`}>
                 Focus Detail
               </h2>
            </div>
            <div className={`w-16 h-[3px] ${isDarkMode ? 'bg-[#ffcf54]' : 'bg-[#2c2a25]'} rounded-full opacity-20`} />
          </div>

          <div className="flex flex-col gap-6 w-full">
            {/* Task Text Area */}
            <div className={`w-full ${theme.modalInputBg} border-[4px] ${theme.taskCardBorder} rounded-xl p-6 ${isDarkMode ? 'shadow-[6px_6px_0_#00000040]' : 'shadow-[6px_6px_0_#2c2a2508]'} relative group overflow-hidden`}>
                <div className="absolute top-4 right-4 opacity-5">
                   <Target size={40} strokeWidth={4} className={isDarkMode ? 'text-[#ffcf54]' : 'text-[#2c2a25]'} />
                </div>
                <p className={`w-full text-2xl font-serif font-medium leading-relaxed relative z-10 text-justify ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'} ${task.checked ? 'opacity-30 line-through decoration-[3px] decoration-[#ff6b6b]' : ''}`}>
                   {task.text}
                </p>
            </div>

            {/* Recurrence Selection */}
            <div className="flex flex-col gap-4">
               <div className="flex items-center gap-3">
                  <span className="font-sans font-black text-[10px] uppercase tracking-[0.2em] text-[#2c2a25]/40">Recurring Rhythm</span>
                  <div className="flex-1 h-[2px] bg-[#2c2a25]/5" />
               </div>
               
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {RHYTHMS.map(opt => {
                  const isActive = (opt.value === 'once' && !task.isHabit) || (task.isHabit && task.habitSchedule?.type === opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { 
                        playPopSound?.(); 
                        const isHabit = opt.value !== 'once';
                        onUpdateSchedule(task.id, isHabit, isHabit ? opt.value : null);
                      }}
                      className={`relative py-3 rounded-xl border-[3px] ${theme.taskCardBorder} font-sans font-black text-[10px] uppercase tracking-widest transition-all duration-200 overflow-hidden ${
                        isActive 
                          ? `${isDarkMode ? 'text-[#ddd6cc]' : 'text-[#2c2a25]'} shadow-none translate-y-1 translate-x-1` 
                          : `${theme.modalInputBg} ${isDarkMode ? 'text-[#ddd6cc]/40' : 'text-[#2c2a25]'} shadow-[4px_4px_0_#2a282480] hover:-translate-y-0.5`
                      }`}
                      style={{ backgroundColor: isActive ? (isDarkMode ? (opt.value === 'once' ? theme.recurrenceToday : theme.recurrenceDaily) : opt.color) : '' }}
                    >
                      <span className="relative z-10">{opt.label}</span>
                    </button>
                  );
                })}
               </div>
            </div>

            {/* Action Row */}
            <div className="flex items-center gap-4 mt-4 pt-6 border-t-[3px] border-[#2c2a25]/5">
            {!task.isHabit && (
                <button 
                  type="button" 
                  onClick={() => { playTrashSound(); onDelete(task.id); onClose(); }}
                  className={`flex-1 py-4 ${theme.modalInputBg} text-[#ff6b6b] border-[3px] ${theme.taskCardBorder} shadow-[4px_4px_0_#2a282480] hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all font-sans font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2`}
                >
                  <Trash2 size={16} strokeWidth={3} />
                  Void
                </button>
              )}

              <button 
                onClick={() => { playCheckSound?.(!task.checked); onToggle(task.id); }}
                className={`flex-[1.8] py-4 border-[3px] ${isDarkMode ? 'border-[#d1a23b]' : 'border-[#2c2a25]'} rounded-xl ${isDarkMode ? 'shadow-[6px_6px_0_#00000060]' : 'shadow-[6px_6px_0_rgba(44,42,37,0.2)]'} hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all font-sans font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 ${
                  task.checked ? (isDarkMode ? 'bg-[#3d2f1f] text-[#d1a23b]' : 'bg-[#a8e6cf] text-[#2c2a25]') : (isDarkMode ? 'bg-[#2c2a25] text-[#fdf8ea]' : 'bg-[#2c2a25] text-white')
                }`}
                style={{ color: task.checked ? (isDarkMode ? '#d1a23b' : '#2c2a25') : (
                  isDarkMode ? (
                              currentRhythm === 'daily' ? theme.recurrenceDaily : 
                              currentRhythm === 'weekdays' ? theme.recurrenceWeekdays : 
                              currentRhythm === 'weekends' ? theme.recurrenceWeekends : '#ddd6cc'
                  ) : (
                              currentRhythm === 'daily' ? '#ffcf54' : 
                              currentRhythm === 'weekdays' ? '#82cbfb' : 
                              currentRhythm === 'weekends' ? '#ff8a8a' : '#fff'
                  )
                )}}
              >
                {task.checked ? <Check size={18} strokeWidth={4} /> : <Target size={18} strokeWidth={3} />}
                {task.checked ? 'Discharged' : 'Formalize Done'}
              </button>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(content, document.body);
}
