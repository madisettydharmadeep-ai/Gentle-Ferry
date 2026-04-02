import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Zap, Trash2, X, Flame } from 'lucide-react';
import { useAppContext } from '../app/context/AppContext';
import { playTrashSound, playPopSound } from '../utils/sound';

import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Sortable Wrapper ---
function SortableHabitCard({ habit, idx, onClick, isOverlay, isDarkMode, theme }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: habit.text });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 0 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="h-full"
    >
      <HabitCard 
        habit={habit} 
        idx={idx} 
        onClick={onClick} 
        isOverlay={isOverlay} 
        isDarkMode={isDarkMode}
        theme={theme}
      />
    </div>
  );
}

// --- Actual Card UI ---
function HabitCard({ habit, idx, onClick, isOverlay, isDarkMode, theme }) {
  return (
    <motion.div 
      layout={!isOverlay}
      initial={!isOverlay ? { opacity: 0, scale: 0.95 } : false}
      animate={!isOverlay ? { opacity: 1, scale: 1 } : false}
      whileHover={!isOverlay ? { y: -6, rotate: idx % 2 === 0 ? 1 : -1 } : {}}
      onClick={() => onClick(habit)}
      style={{ backgroundColor: isDarkMode ? '#1a1815' : habit.color.bg }}
      className={`group border-[3px] ${isDarkMode ? 'border-white/10' : 'border-[#31251c]'} p-6 flex flex-col items-center justify-center text-center cursor-pointer ${isDarkMode ? 'shadow-[8px_8px_0_#00000040]' : 'shadow-[8px_8px_0_#31251c20]'} hover:shadow-[12px_12px_0_#c65f4b40] transition-all min-h-[140px] relative rounded-2xl touch-none h-full ${
        isOverlay ? '!rotate-2 !scale-105 !shadow-[16px_16px_0_#00000080] !z-[1000] opacity-100 cursor-grabbing !rounded-2xl' : ''
      }`}
    >
      <div 
        style={{ backgroundColor: isDarkMode ? habit.color.accent + '33' : habit.color.accent }}
        className={`w-10 h-10 border-[2px] ${isDarkMode ? 'border-white/10' : 'border-[#31251c]'} rounded-full flex items-center justify-center ${isDarkMode ? '' : 'text-white'} mb-3 shadow-[2px_2px_0_#00000020]`}
      >
        <Zap size={18} fill="currentColor" style={{ color: isDarkMode ? habit.color.accent : 'currentColor' }} />
      </div>
      <h3 className={`font-serif font-black text-sm md:text-base ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#31251c]'} uppercase tracking-tight line-clamp-2 px-2 group-hover:text-[#c65f4b] transition-colors`}>
        {habit.text}
      </h3>
      {habit.streak > 0 && (
        <div className={`absolute top-2 right-2 ${isDarkMode ? 'bg-[#2c2a25]' : 'bg-white'} border ${isDarkMode ? 'border-white/10' : 'border-[#31251c]'} px-2 py-0.5 rounded shadow-[2px_2px_0_#00000020] flex items-center gap-1`}>
           <Flame size={10} className="text-[#ff6b6b]" fill="currentColor" />
           <span className={`font-serif font-black text-xs ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#31251c]'}`}>{habit.streak}</span>
        </div>
      )}
    </motion.div>
  );
}

// --- Heatmap Component ---
function HabitHeatmap({ receipts, isDarkMode, theme }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // 1. Calculate activity intensity
  const activity = {};
  receipts.forEach(r => {
    if (!r.date) return;
    try {
      const d = new Date(r.date);
      const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
      const count = r.tasks?.filter(t => t.isHabit && t.checked).length || 0;
      activity[key] = (activity[key] || 0) + count;
    } catch (e) {}
  });

  // 2. Generate dates for the last 6 months
  const today = new Date();
  const weeks = [];
  let currentWeek = [];

  const startDate = new Date();
  startDate.setDate(today.getDate() - (26 * 7));
  while (startDate.getDay() !== 0) startDate.setDate(startDate.getDate() - 1);

  const iterDate = new Date(startDate);
  while (iterDate <= today || currentWeek.length > 0) {
    const key = `${iterDate.getFullYear()}-${(iterDate.getMonth() + 1).toString().padStart(2, '0')}-${iterDate.getDate().toString().padStart(2, '0')}`;
    const count = activity[key] || 0;
    
    currentWeek.push({
      date: new Date(iterDate),
      count,
      level: count === 0 ? 0 : Math.min(4, Math.ceil(count / 2))
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    
    if (iterDate > today) {
      if (currentWeek.length > 0) {
         while (currentWeek.length < 7) currentWeek.push(null);
         weeks.push(currentWeek);
      }
      break;
    }
    iterDate.setDate(iterDate.getDate() + 1);
  }

  const getLevelColor = (level) => {
    if (level === 0) return isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
    const baseColor = isDarkMode ? '#ffcf54' : '#c65f4b';
    const opacities = [0, 0.2, 0.4, 0.7, 1];
    return baseColor + Math.round(opacities[level] * 255).toString(16).padStart(2, '0');
  };

  return (
    <div className={`w-full overflow-x-auto custom-scrollbar pb-4 flex flex-col gap-4`}>
       <div className="flex gap-[3px] md:gap-1.5 min-w-max">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-[3px] md:gap-1.5">
              {week.map((day, dayIdx) => {
                if (!day) return <div key={dayIdx} className="w-3 h-3 md:w-4 md:h-4 opacity-0" />;
                return (
                  <motion.div
                    key={dayIdx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (weekIdx * 7 + dayIdx) * 0.001 }}
                    title={`${day.date.toDateString()}: ${day.count} habits`}
                    style={{ backgroundColor: getLevelColor(day.level) }}
                    className={`w-3 h-3 md:w-4 md:h-4 rounded-[2px] border ${isDarkMode ? 'border-white/5' : 'border-[#31251c]/5'}`}
                  />
                );
              })}
            </div>
          ))}
       </div>
       <div className="flex items-center gap-4 mt-2">
          <span className={`font-sans font-black text-[8px] uppercase tracking-widest ${isDarkMode ? 'text-[#fdf8ea]/20' : 'text-[#31251c]/20'}`}>Less</span>
          <div className="flex gap-1">
             {[0, 1, 2, 3, 4].map(l => (
               <div key={l} style={{ backgroundColor: getLevelColor(l) }} className="w-3 h-3 md:w-4 md:h-4 rounded-[2px]" />
             ))}
          </div>
          <span className={`font-sans font-black text-[8px] uppercase tracking-widest ${isDarkMode ? 'text-[#fdf8ea]/20' : 'text-[#31251c]/20'}`}>More</span>
       </div>
    </div>
  );
}

// --- Main Component ---
export default function HabitTracker({ receipts, tasks, isDarkMode, theme }) {
  const { ignoredHabits, ignoreHabit, masterHabits } = useAppContext();
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [orderedHabits, setOrderedHabits] = useState([]);
  const [activeDragId, setActiveDragId] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const habitRecords = {};
  masterHabits.forEach(h => {
    habitRecords[h.text] = { text: h.text, iconName: h.iconName || 'Sparkles', firstSeen: 'Present', dailyStatus: {} };
  });

  const sortedReceipts = [...receipts].sort((a, b) => new Date(a.date) - new Date(b.date));
  sortedReceipts.forEach(receipt => {
    receipt.tasks.forEach(task => {
      if (task.isHabit) {
        if (ignoredHabits?.includes(task.text)) return;
        if (!habitRecords[task.text]) {
          habitRecords[task.text] = { text: task.text, iconName: task.iconName, firstSeen: receipt.date, dailyStatus: {} };
        } else if (habitRecords[task.text].firstSeen === 'Present') {
          habitRecords[task.text].firstSeen = receipt.date;
        }
        const prevStatus = habitRecords[task.text].dailyStatus[receipt.date] || false;
        habitRecords[task.text].dailyStatus[receipt.date] = prevStatus || task.checked;
      }
    });
  });

  const FOLIO_COLORS = [
    { bg: '#fdf8ea', accent: '#c65f4b' },
    { bg: '#f2f7f1', accent: '#8eb69b' },
    { bg: '#f1f6f9', accent: '#5198a2' },
    { bg: '#fffaf0', accent: '#ffcf54' },
    { bg: '#fcf5f3', accent: '#c65f4b' },
    { bg: '#f0f4f8', accent: '#607d8b' },
  ];

  const processedHabits = Object.values(habitRecords).map((habit, idx) => {
    const history = Object.entries(habit.dailyStatus)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([date, checked]) => ({ date, checked }));
    const completions = history.filter(h => h.checked).length;
    let streak = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].checked) streak++; else break;
    }
    return { ...habit, history, streak, completionRate: history.length > 0 ? Math.round((completions / history.length) * 100) : 0, color: FOLIO_COLORS[idx % FOLIO_COLORS.length] };
  });

  useEffect(() => {
    const currentTexts = orderedHabits.map(h => h.text).sort().join(',');
    const processedTexts = processedHabits.map(h => h.text).sort().join(',');
    if (currentTexts !== processedTexts) {
      if (orderedHabits.length > 0) {
        const newOrdered = orderedHabits.filter(h => processedHabits.some(ph => ph.text === h.text)).map(h => processedHabits.find(ph => ph.text === h.text));
        const newlyAdded = processedHabits.filter(ph => !orderedHabits.some(h => h.text === ph.text));
        setOrderedHabits([...newOrdered, ...newlyAdded]);
      } else {
        setOrderedHabits(processedHabits.sort((a, b) => b.streak - a.streak));
      }
    }
  }, [receipts, ignoredHabits, tasks, processedHabits.length]);

  const handleDragStart = (event) => setActiveDragId(event.active.id);
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragId(null);
    if (over && active.id !== over.id) {
      setOrderedHabits((items) => {
        const oldIndex = items.findIndex((t) => t.text === active.id);
        const newIndex = items.findIndex((t) => t.text === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      playPopSound();
    }
  };

  if (processedHabits.length === 0 && (ignoredHabits?.length === 0 || !ignoredHabits)) {
    return (
      <div className="p-24 flex flex-col items-center text-center">
        <Target size={32} className={`mb-6 ${isDarkMode ? 'text-[#fdf8ea]/10' : 'text-[#31251c]/10'}`} />
        <p className={`font-serif italic text-xl ${isDarkMode ? 'text-[#fdf8ea]/30' : 'text-[#31251c]/30'} uppercase tracking-widest`}>No Disciplines Observed</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 px-8 py-10 md:px-14">
      <div className={`flex flex-col border-b-[3px] ${isDarkMode ? 'border-[#fdf8ea]/10' : 'border-[#31251c]'} pb-10 gap-8`}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-[#c65f4b] animate-pulse" />
                <span className={`font-sans font-black text-[9px] uppercase tracking-[0.4em] ${isDarkMode ? 'text-[#fdf8ea]/40' : 'text-[#31251c]/40'}`}>Voyage Intensity Map</span>
            </div>
            <h2 className={`font-serif font-black text-4xl md:text-5xl ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#31251c]'} uppercase tracking-tighter`}>Consistency</h2>
          </div>
          <div className="flex flex-col md:items-end">
            <span className={`font-sans font-black text-[8px] uppercase tracking-widest ${isDarkMode ? 'text-[#fdf8ea]/20' : 'text-[#31251c]/20'}`}>The last 6 months of your journey</span>
          </div>
        </div>
        <HabitHeatmap receipts={receipts} isDarkMode={isDarkMode} theme={theme} />
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
           <h3 className={`font-serif font-black text-xl md:text-2xl ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#31251c]'} uppercase tracking-tight`}>Active Disciplines</h3>
           <span className={`font-sans font-black text-[8px] uppercase tracking-widest ${isDarkMode ? 'text-[#fdf8ea]/20' : 'text-[#31251c]/20'}`}>Tap to inspect records</span>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={() => setActiveDragId(null)}>
          <SortableContext items={orderedHabits.map((h) => h.text)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 cursor-grab active:cursor-grabbing">
              <AnimatePresence>
                {orderedHabits.map((habit, idx) => (
                  <SortableHabitCard key={habit.text} habit={habit} idx={idx} onClick={(h) => { if (!activeDragId) { playPopSound(); setSelectedHabit(h); } }} isDarkMode={isDarkMode} theme={theme} />
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
          <DragOverlay zIndex={1000}>
            {activeDragId ? <HabitCard habit={orderedHabits.find((h) => h.text === activeDragId)} idx={0} onClick={() => {}} isOverlay isDarkMode={isDarkMode} theme={theme} /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      <AnimatePresence>
        {selectedHabit && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedHabit(null)} className={`absolute inset-0 ${isDarkMode ? 'bg-black/80' : 'bg-[#31251c]/80'} backdrop-blur-md pointer-events-auto`} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 40 }} style={{ backgroundColor: isDarkMode ? '#1a1815' : selectedHabit.color.bg }} className={`w-full max-w-2xl max-h-[85vh] border-[4px] ${isDarkMode ? 'border-white/10' : 'border-[#31251c]'} ${isDarkMode ? 'shadow-[24px_24px_0_rgba(0,0,0,0.6)]' : 'shadow-[24px_24px_0_rgba(0,0,0,0.3)]'} relative flex flex-col pointer-events-auto overflow-hidden rounded-2xl`}>
              <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-hide">
                <button onClick={() => setSelectedHabit(null)} className={`absolute top-4 right-4 w-10 h-10 border-[2px] ${isDarkMode ? 'border-white/10' : 'border-[#31251c]'} rounded-full flex items-center justify-center ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#31251c]'} ${isDarkMode ? 'bg-[#2c2a25]' : 'bg-white'} hover:rotate-90 transition-all z-10 ${isDarkMode ? 'shadow-[4px_4px_0_#00000040]' : 'shadow-[4px_4px_0_#31251c]'}`}>
                  <X size={20} strokeWidth={3} />
                </button>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                       <span className={`font-sans font-black text-[9px] uppercase tracking-[0.5em] ${isDarkMode ? 'text-[#fdf8ea]/30' : 'text-[#31251c]/30'}`}>Dossier #A7</span>
                       <div className={`h-[2px] flex-1 ${isDarkMode ? 'bg-white/5' : 'bg-[#31251c]/10'}`} />
                    </div>
                    <h3 className={`font-serif font-black text-3xl md:text-4xl ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#31251c]'} leading-[1.1] tracking-tighter uppercase break-words pr-12`}>{selectedHabit.text}</h3>
                  </div>
                  <div className={`grid grid-cols-2 md:grid-cols-3 gap-6 py-8 border-y-[3px] ${isDarkMode ? 'border-white/10' : 'border-[#31251c]'}`}>
                     <div className="flex flex-col items-center md:items-start">
                        <div className="flex items-baseline gap-2">
                           <span className={`font-serif font-black text-6xl ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#31251c]'} leading-none tracking-tighter`}>{selectedHabit.streak}</span>
                           <Flame size={24} className="text-[#ff6b6b]" fill="currentColor" />
                        </div>
                        <span className={`font-sans font-black text-[9px] uppercase tracking-[0.3em] ${isDarkMode ? 'text-[#fdf8ea]/40' : 'text-[#31251c]/40'} mt-1`}>Active Streak</span>
                     </div>
                     <div className="flex flex-col items-center md:items-end">
                        <span className={`font-serif font-black text-4xl ${isDarkMode ? 'text-[#fdf8ea]/60' : 'text-[#31251c]/60'} leading-none`}>{selectedHabit.completionRate}%</span>
                        <span className={`font-sans font-black text-[9px] uppercase tracking-widest ${isDarkMode ? 'text-[#fdf8ea]/30' : 'text-[#31251c]/30'}`}>Mastery Score</span>
                     </div>
                     <div className={`hidden md:flex flex-col items-end justify-center border-l-[2px] ${isDarkMode ? 'border-white/10' : 'border-[#31251c]/5'} pl-6`}>
                        <span className={`font-sans font-black text-[9px] uppercase tracking-widest ${isDarkMode ? 'text-[#fdf8ea]/20' : 'text-[#31251c]/20'}`}>Observation Period</span>
                        <span className={`font-serif font-bold text-xs ${isDarkMode ? 'text-[#fdf8ea]/40' : 'text-[#31251c]/40'}`}>{selectedHabit.firstSeen} — Present</span>
                     </div>
                  </div>
                  <div className="flex flex-col gap-6">
                     <span className={`font-sans font-black text-[10px] uppercase tracking-[0.4em] ${isDarkMode ? 'text-[#fdf8ea]/40' : 'text-[#31251c]/40'}`}>Historical Archive // All Records</span>
                     <div className="flex flex-wrap gap-2 md:gap-3 max-w-3xl mx-auto w-full">
                        {selectedHabit.history.map((record, i) => (
                           <div key={i} className="group/day relative flex flex-col items-center">
                             <div className={`w-8 h-8 md:w-10 md:h-10 border-[2px] ${isDarkMode ? 'border-white/10' : 'border-[#31251c]'} rounded-sm transition-all flex items-center justify-center shrink-0 ${record.checked ? `${isDarkMode ? 'bg-[#2c2a25] shadow-[3px_3px_0_#00000040]' : 'bg-white shadow-[3px_3px_0_#31251c]'}` : `${isDarkMode ? 'bg-white/5 opacity-5' : 'bg-black/5 opacity-10'} border-dashed scale-90`}`} title={new Date(record.date).toLocaleDateString()}>
                               {record.checked && <div style={{ backgroundColor: selectedHabit.color.accent }} className="w-1/2 h-1/2 rounded-full" />}
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                  <div className={`flex items-center justify-between pt-6 border-t ${isDarkMode ? 'border-white/5' : 'border-[#31251c]/10'}`}>
                     <span className={`font-mono text-[8px] ${isDarkMode ? 'text-[#fdf8ea]/20' : 'text-[#31251c]/20'} uppercase tracking-widest`}>ARCH-V2-#{selectedHabit.text.substring(0,3)}</span>
                     <button onClick={(e) => { e.stopPropagation(); playTrashSound(); ignoreHabit(selectedHabit.text); setSelectedHabit(null); }} className="group flex items-center gap-2 text-[#ff6b6b] hover:bg-[#ff6b6b]/10 px-3 py-1.5 rounded transition-all">
                       <Trash2 size={12} strokeWidth={3} />
                       <span className="font-sans font-black text-[9px] uppercase tracking-widest">Discard Record</span>
                     </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
