'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, Plus } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ICON_MAP } from '../utils/icons';
import { useAppContext } from '../app/context/AppContext';
import { navbarThemes } from '../utils/navbarThemes';

// Helper to get recurrence styling
const getRecurrenceDecor = (task, theme) => {
  const type = task.isHabit ? task.habitSchedule?.type : 'once';
  
  const map = {
    once: { label: 'Today', color: theme.recurrenceToday, accent: '#2c2a25', bg: 'bg-white' },
    daily: { label: 'Daily', color: theme.recurrenceDaily, accent: '#2c2a25', bg: 'bg-[#ffcf54]' },
    weekdays: { label: 'Weekdays', color: theme.recurrenceWeekdays, accent: '#2c2a25', bg: 'bg-[#82cbfb]' },
    weekends: { label: 'Weekends', color: theme.recurrenceWeekends, accent: '#2c2a25', bg: 'bg-[#ff8a8a]' }
  };
  
  return map[type] || map.once;
};

// Normal Task Card
export function TaskCard({ task, onToggle, onDelete, onClick, isOverlay, isCompact }) {
  const { isDarkMode, today } = useAppContext();
  const isActualToday = today ? today.toDateString() === new Date().toDateString() : true;
  const theme = isDarkMode ? navbarThemes.dark : navbarThemes.light;
  const decor = getRecurrenceDecor(task, theme);
  const iconData = ICON_MAP[task.iconName] || ICON_MAP['Sparkles'] || { component: Check, color: 'text-gray-400' };
  const Icon = iconData.component;
  
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const isClamped = textRef.current.scrollHeight > textRef.current.clientHeight;
      setIsTruncated(isClamped);
    }
  }, [task.text]);

  const hexMatch = iconData.color.match(/#([0-9a-fA-F]{6})/);
  const hexColor = hexMatch ? `#${hexMatch[1]}` : '#a1aca2';

  const taskDate = new Date(parseInt(task.id));
  const dateString = isNaN(taskDate.getTime()) ? '' : taskDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();

  return (
    <motion.div
      layout={!isOverlay}
      initial={!isOverlay ? { opacity: 0, y: 30 } : false}
      animate={!isOverlay ? { opacity: 1, y: 0 } : false}
      exit={!isOverlay ? { opacity: 0, scale: 0.9 } : false}
      className={`group relative flex flex-col ${isCompact ? 'p-3 h-[120px]' : 'p-5 h-[210px]'} w-full rounded-xl cursor-pointer transition-all duration-300 overflow-hidden border-[3px] ${theme.taskCardBorder} ${
        task.checked 
          ? `${theme.taskCardCheckedBg} opacity-90 shadow-[2px_2px_0_#2a2824]` 
          : `${theme.taskCardBg} bg-[url("https://www.transparenttextures.com/patterns/lined-paper-2.png")] ${theme.taskCardShadow} hover:-translate-y-1.5 hover:-translate-x-1 hover:shadow-[8px_8px_0_#2a282440]`
      } ${isOverlay ? '!rotate-2 !scale-105 !shadow-[10px_10px_0_#00000060] !z-[9999] opacity-100 cursor-grabbing' : 'hover:z-10'}`}
      onClick={() => onClick(task)}
    >
      {/* Notebook Top Accent (Artisan Ledger Style) */}
      {!task.checked && (
        <div className={`absolute top-0 left-0 right-0 ${isCompact ? 'h-2' : 'h-4'} bg-[#c65f4b] border-b-[3px] ${theme.taskCardBorder} flex items-center justify-evenly px-4 z-20`}>
           {[1, 2, 3, 4].map(i => (
              <div key={i} className={`${isCompact ? 'w-1 h-1.5' : 'w-1.5 h-2.5'} ${isDarkMode ? 'bg-[#1b1a17]' : 'bg-[#f8f5ee]'} border-[1.5px] ${theme.taskCardBorder} rounded-full`} />
           ))}
        </div>
      )}


      <div className={`flex items-center justify-between ${isCompact ? 'mb-1' : 'mb-2'} w-full relative z-10 ${!task.checked ? (isCompact ? 'mt-1' : 'mt-3') : ''}`}>
        <div 
          className={`flex items-center ${theme.modalInputBg} rounded-lg border-[2.5px] md:border-[3px] ${theme.taskCardBorder} ${isDarkMode ? 'shadow-[2px_2px_0_#00000040]' : 'shadow-[2px_2px_0_#2c2a2510]'} overflow-hidden transition-transform duration-200 ${
            task.checked ? 'opacity-40 grayscale' : 'group-hover:-rotate-2'
          }`}
        >
          {/* Recurrence Accent Seal */}
          <div 
            className={`flex items-center justify-center ${isCompact ? 'w-6 h-6' : 'w-10 h-10'} border-r-[2.5px] md:border-r-[3px] ${theme.taskCardBorder} transition-colors duration-300`}
            style={{ backgroundColor: task.checked ? (isDarkMode ? '#2a2824' : '#d1ccc0') : decor.color }}
          >
            <Icon size={isCompact ? 12 : 18} className={isDarkMode ? 'text-[#ddd6cc]' : 'text-[#2c2a25]'} strokeWidth={isCompact ? 3 : 2.5} />
          </div>
          
          {!isCompact && (
            <div className="px-3 py-1 flex flex-col justify-center">
               <span className={`font-sans text-[10px] font-black uppercase tracking-[0.15em] ${isDarkMode ? 'text-[#ddd6cc]' : 'text-[#2c2a25]'}`}>
                 {decor.label}
               </span>
            </div>
          )}
        </div>
        
        <button 
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(task.id);
          }}
          className={`${isCompact ? 'w-6 h-6' : 'w-10 h-10'} rounded-lg flex items-center justify-center border-[2.5px] md:border-[3px] ${theme.taskCardBorder} transition-all duration-150 active:translate-y-1 active:translate-x-1 active:shadow-none ${isDarkMode ? 'shadow-[2px_2px_0_#00000040]' : 'shadow-[2px_2px_0_#2c2a2510]'} ${
            task.checked ? (isDarkMode ? 'bg-[#3d2f1f] border-[#d1a23b]' : 'bg-[#2c2a25]') : theme.modalInputBg
          }`}
        >
          <Check size={isCompact ? 14 : 20} strokeWidth={4} className={`transition-all duration-150 ${task.checked ? (isDarkMode ? 'text-[#d1a23b]' : 'text-white') : (isDarkMode ? 'text-white/5' : 'text-[#2c2a25]/5')}`} />
        </button>
      </div>

      <div className="w-full h-[2px] bg-[#2c2a25]/10 mb-3 rounded-full" />

      <div className={`flex-1 relative z-10 w-full ${isCompact ? 'px-0.5 pb-1' : 'px-1 pb-4'}`}>
        <p 
          ref={textRef}
          className={`relative z-10 ${isCompact ? 'text-[13px] md:text-[14px]' : 'text-[17px] md:text-[18px]'} leading-snug font-serif font-bold tracking-tight line-clamp-2 transition-all duration-200 ${
          task.checked ? `${isDarkMode ? 'text-[#6d6a62]' : 'text-[#8a857a]'} opacity-50 line-through decoration-[3px] ${isDarkMode ? 'decoration-[#d1a23b]/30' : 'decoration-[#2c2a25]/20'}` : theme.taskCardText
        }`}>
          {task.text}
        </p>
        
        {isTruncated && !task.checked && (
          <div className={`absolute bottom-1 right-0 flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity ${isDarkMode ? 'bg-[#1b1a17]/90' : 'bg-[#fdf8ea]/90'} backdrop-blur-sm pl-2 py-0.5 rounded-tl-md`}>
            <span className={`font-sans text-[7px] font-black uppercase tracking-widest ${theme.taskCardSecondaryText}`}>Read more</span>
            <Plus size={8} strokeWidth={4} className={theme.taskCardSecondaryText} />
          </div>
        )}
      </div>
      
      {dateString && (
        <span className={`absolute bottom-4 left-6 z-20 font-sans text-[9px] uppercase tracking-[0.15em] font-black pointer-events-none transition-colors duration-200 ${task.checked ? (isDarkMode ? 'text-[#4a4842]' : 'text-[#8a857a]') : theme.taskCardSecondaryText}`}>
          {dateString}
        </span>
      )}
      
      {!task.isHabit && (
        <div className="mt-auto flex justify-end w-full relative z-20 px-1">
          <button 
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 ${isDarkMode ? 'bg-[#5c2d2d]' : 'bg-[#ff6b6b]'} border-[3px] ${theme.taskCardBorder} shadow-[3px_3px_0_#2a282480] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none ${isDarkMode ? 'text-[#ff8a8a]' : 'text-[#2c2a25]'}`}
          >
            <Trash2 size={16} strokeWidth={2.5} />
          </button>
        </div>
      )}
    </motion.div>
  );
}

// Sortable wrapper
export function SortableTaskCard(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.task.id });

  const style = {
    transform: CSS?.Translate?.toString(transform) || '',
    transition,
    opacity: isDragging ? 0.3 : 1,
    position: 'relative',
    zIndex: isDragging ? 0 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard {...props} isOverlay={false} />
    </div>
  );
}
