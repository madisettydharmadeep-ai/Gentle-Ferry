'use client';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Trash2, PenTool, X, Check } from 'lucide-react';
import { playPopSound, playTapSound, playTypeSound } from '../utils/sound';
import { ICON_MAP } from '../utils/icons';
import { useAppContext } from '../app/context/AppContext';
import { navbarThemes } from '../utils/navbarThemes';

export default function AddTaskModal({ onClose, onAdd }) {
  const [value, setValue] = useState('');
  const [selectedIconName, setSelectedIconName] = useState('Wind');
  const [isHabit, setIsHabit] = useState(false);
  const [scheduleType, setScheduleType] = useState('daily');
  const [customDays, setCustomDays] = useState([]);
  const [mounted, setMounted] = useState(false);
  const { isDarkMode, isPremium, setShowProModal, tasks } = useAppContext();
  const theme = isDarkMode ? navbarThemes.dark : navbarThemes.light;

  useEffect(() => setMounted(true), []);

  const modeData = {
    once: { title: 'New Intent', placeholder: 'What focus will you inscribe today?' },
    daily: { title: 'Daily Rhythm', placeholder: 'What habit will you practice daily?' },
    weekdays: { title: 'Weekday Craft', placeholder: 'What focus will you inscribe for weekdays?' },
    weekends: { title: 'Weekend Rest', placeholder: 'What joy will you inscribe for weekends?' }
  };
  const currentMode = isHabit ? scheduleType : 'once';
  const { title, placeholder } = modeData[currentMode];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    
    // Check Pro logic for more than 3 habits
    if (isHabit && !isPremium) {
       const existingHabits = tasks.filter(t => t.isHabit).length;
       if (existingHabits >= 3) {
          setShowProModal(true);
          return;
       }
    }

    // Use selected icon if habit, otherwise force Sparkles
    const selectedIcon = isHabit ? selectedIconName : 'Sparkles';

    onAdd(
      value.trim(), 
      selectedIcon, 
      isHabit, 
      isHabit ? { type: scheduleType } : null
    );
    setValue("");
    onClose();
  };

  const content = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#2c2a25]/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={`w-full max-w-[580px] h-auto border-[4px] ${theme.taskCardBorder} rounded-xl ${isDarkMode ? 'shadow-[12px_12px_0_#00000060]' : 'shadow-[12px_12px_0_#2c2a25]'} relative flex flex-col overflow-hidden ${theme.modalBg} bg-[url('https://www.transparenttextures.com/patterns/lined-paper-2.png')]`}
      >
        {/* Notebook Top Bar (Fresh Canvas Style) */}
        <div className={`absolute top-0 left-0 right-0 h-8 bg-[#c65f4b] border-b-[4px] ${theme.taskCardBorder} flex items-center justify-evenly px-8 z-20`}>
           {[1, 2, 3, 4, 5, 6].map(i => (
                     <div key={i} className={`w-3 h-5 ${theme.modalBg} border-[2px] ${theme.taskCardBorder} rounded-full shadow-inner`} />
           ))}
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className={`absolute top-10 right-4 p-1.5 ${theme.modalInputBg} border-[3px] ${theme.taskCardBorder} ${isDarkMode ? 'shadow-[3px_3px_0_#00000040]' : 'shadow-[3px_3px_0_#2c2a2510]'} rounded-lg hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all z-30`}
        >
          <X size={18} strokeWidth={3} className={isDarkMode ? 'text-[#ddd6cc]' : 'text-[#2c2a25]'} />
        </button>

        <div className="p-8 sm:p-10 pt-24 flex flex-col relative z-10 w-full">
          {/* Header - Mode Indicator */}
          <div className="flex flex-col items-start w-full">
            <div className="flex items-center gap-3 mb-2">
               <div className={`w-10 h-10 rounded-xl border-[3px] ${theme.taskCardBorder} flex items-center justify-center shadow-[3px_3px_0_#2a2824] ${
                 !isHabit ? theme.modalInputBg : 
                 scheduleType === 'daily' ? `bg-[${theme.recurrenceDaily}]` : 
                 scheduleType === 'weekdays' ? `bg-[${theme.recurrenceWeekdays}]` : `bg-[${theme.recurrenceWeekends}]`
               }`} style={{ backgroundColor: !isHabit ? '' : (scheduleType === 'daily' ? theme.recurrenceDaily : (scheduleType === 'weekdays' ? theme.recurrenceWeekdays : theme.recurrenceWeekends)) }}>
                  <PenTool size={20} className={isDarkMode ? 'text-[#ddd6cc]' : 'text-[#2c2a25]'} strokeWidth={2.5} />
               </div>
               <h2 className={`font-serif font-black text-3xl ${isDarkMode ? 'text-[#cdc8bc]' : 'text-[#2c2a25]'} uppercase tracking-tighter`}>
                 {title}
               </h2>
            </div>
            <div className={`w-16 h-[3px] ${isDarkMode ? 'bg-[#d1a23b]' : 'bg-[#2c2a25]'} rounded-full opacity-20`} />
          </div>

          <div className="flex items-center justify-end gap-3 mb-2">
               {[
                  { value: 'once', label: 'T', colors: { light: '#ffffff', dark: theme.recurrenceToday } },
                  { value: 'daily', label: 'D', colors: { light: '#ffcf54', dark: theme.recurrenceDaily } },
                  { value: 'weekdays', label: 'W', colors: { light: '#82cbfb', dark: theme.recurrenceWeekdays } },
                  { value: 'weekends', label: 'S', colors: { light: '#ff8a8a', dark: theme.recurrenceWeekends } },
                ].map(opt => {
                  const isActive = (opt.value === 'once' && !isHabit) || (isHabit && scheduleType === opt.value);
                  const activeColor = isDarkMode ? opt.colors.dark : opt.colors.light;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { 
                        playPopSound?.(); 
                        if (opt.value === 'once') {
                          setIsHabit(false);
                        } else {
                          setIsHabit(true);
                          setScheduleType(opt.value);
                          if (selectedIconName === 'Sparkles') setSelectedIconName('Wind');
                        }
                      }}
                      className={`w-9 h-9 rounded-full border-[3px] ${theme.taskCardBorder} font-sans font-black text-[12px] uppercase transition-all flex items-center justify-center ${
                        isActive 
                          ? `${isDarkMode ? 'text-[#2a2824]' : 'text-[#2c2a25]'} shadow-none scale-110` 
                          : `${theme.modalInputBg} ${isDarkMode ? 'text-white/10' : 'text-[#2c2a25]/20'}`
                      }`}
                      style={{ backgroundColor: isActive ? activeColor : '' }}
                      title={opt.value}
                    >
                      {opt.label}
                    </button>
                  );
                })}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
            {/* Main Input area */}
            <div className={`w-full ${theme.modalInputBg} border-[4px] ${theme.taskCardBorder} rounded-xl p-8 ${isDarkMode ? 'shadow-[6px_6px_0_#00000040]' : 'shadow-[6px_6px_0_#2c2a2508]'} relative group overflow-hidden`}>
                <textarea
                  autoFocus
                  className={`w-full bg-transparent border-none text-2xl font-serif font-medium ${isDarkMode ? 'text-white' : 'text-black'} ${isDarkMode ? 'placeholder:text-white/30' : 'placeholder:text-black/30'} outline-none resize-none leading-relaxed relative z-10 px-2`}
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  onKeyDown={(e) => { 
                    playTypeSound?.();
                    if (e.key === 'Enter' && !e.shiftKey) {
                      handleSubmit(e);
                    }
                  }}
                  placeholder={placeholder}
                  maxLength={80} 
                  rows={3}
                />
            </div>
            
            {/* Icon Picker - Only for habits */}
            <AnimatePresence>
              {isHabit && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-4 overflow-hidden"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-sans font-black text-[10px] uppercase tracking-[0.2em] text-[#2c2a25]/40">Visual Cipher</span>
                    <div className="flex-1 h-[2px] bg-[#2c2a25]/5" />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pb-2">
                    {Object.keys(ICON_MAP).map(iconKey => {
                      const IconNode = ICON_MAP[iconKey].component;
                      const isSel = selectedIconName === iconKey;
                      return (
                        <button
                          key={iconKey}
                          type="button"
                          onClick={() => { playTapSound(); setSelectedIconName(iconKey); }}
                          className={`w-10 h-10 rounded-full border-[3px] transition-all flex items-center justify-center ${
                            isSel 
                              ? `${isDarkMode ? 'bg-[#ffcf54] border-[#2c2a25]' : 'bg-[#ffcf54] border-[#2c2a25] shadow-none translate-y-0.5'}` 
                              : `${theme.modalInputBg} ${theme.taskCardBorder} opacity-40 hover:opacity-100`
                          }`}
                        >
                          <IconNode size={18} className={isSel ? 'text-[#2c2a25]' : (isDarkMode ? 'text-white' : 'text-[#2c2a25]')} />
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Row */}
            <div className="flex items-center gap-4 mt-4 pt-6 border-t-[3px] border-[#2c2a25]/5">
              <button 
                type="button" 
                onClick={() => { playTapSound?.(); onClose(); }}
                className={`flex-1 py-4 ${theme.modalInputBg} ${isDarkMode ? 'text-[#cdc8bc]' : 'text-[#2c2a25]'} border-[3px] ${theme.taskCardBorder} shadow-[4px_4px_0_#2a282480] hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all font-sans font-black text-[11px] uppercase tracking-widest`}
              >
                Discard
              </button>

              <button 
                type="submit" 
                disabled={!value.trim()}
                className={`flex-[1.8] py-4 ${isDarkMode ? 'bg-[#3d2f1f]' : 'bg-[#2c2a25]'} ${isDarkMode ? 'text-[#d1a23b]' : 'text-white'} border-[3px] ${isDarkMode ? 'border-[#d1a23b]' : theme.taskCardBorder} ${isDarkMode ? 'shadow-[6px_6px_0_#00000060]' : 'shadow-[6px_6px_0_rgba(44,42,37,0.2)]'} hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all font-sans font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-20 disabled:pointer-events-none`}
                style={{ color: isDarkMode ? (
                  !isHabit ? '#ddd6cc' : 
                  scheduleType === 'daily' ? theme.recurrenceDaily : 
                  scheduleType === 'weekdays' ? theme.recurrenceWeekdays : theme.recurrenceWeekends
                ) : (
                  !isHabit ? '#fff' : 
                  scheduleType === 'daily' ? '#ffcf54' : 
                  scheduleType === 'weekdays' ? '#82cbfb' : '#ff8a8a'
                )}}
              >
                <PenTool size={18} strokeWidth={3} />
                Formalize Record
              </button>
            </div>
          </form>
        </div>

      </motion.div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(content, document.body);
}