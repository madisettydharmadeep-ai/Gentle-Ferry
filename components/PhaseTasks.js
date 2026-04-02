'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Archive,Moon,ArrowRight, CheckCircle2, Sparkles, Check } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useAppContext } from '../app/context/AppContext';
import TutorialOverlay from './TutorialOverlay';

// Shared Utils & Sounds
import { playPopSound, playCheckSound, playTrashSound, playSuccessSound, playTapSound, playSwooshSound } from '../utils/sound';
import { ICON_MAP } from '../utils/icons';
import { navbarThemes } from '../utils/navbarThemes';

// Sub-components
import TaskDetailModal from './TaskDetailModal';
import AddTaskModal from './AddTaskModal';
import AchievementUnlockedModal from './AchievementUnlockedModal';
import HabitOrb from './HabitOrb';
import HabitReminderModal from './HabitReminderModal';
import TomorrowModal from './TomorrowModal';
import { TaskCard, SortableTaskCard } from './TaskCard';
const AchievementLog = dynamic(() => import('./AchievementLog'), { ssr: false });
const ChillSpaceFlow = dynamic(() => import('./ChillSpaceFlow'), { ssr: false });
import FerrySleeps from './FerrySleeps';

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
} from '@dnd-kit/sortable';

export default function PhaseTasks({ tasks, setTasks, isAuthenticated, onRequireLogin, onSaveReceipt }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [viewingTask, setViewingTask] = useState(null);
  const [activeDragId, setActiveDragId] = useState(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [congratsDismissed, setCongratsDismissed] = useState(false);
  const [pendingLog, setPendingLog] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [timeToMidnight, setTimeToMidnight] = useState('');
  const [isTomorrowModalOpen, setIsTomorrowModalOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showHabitReminder, setShowHabitReminder] = useState(false);
  
  const { today, isHabitScheduledForDay, receipts, isDarkMode, ignoredHabits, syncHabit, isProductive } = useAppContext();
  const theme = isDarkMode ? navbarThemes.dark : navbarThemes.light;
  const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const isDayDone = receipts?.some(r => r.date === dateStr);

  useEffect(() => {
    // ALWAYS SHOW TUTORIAL ON REFRESH FOR DEV
    // const isDone = localStorage.getItem('gentle_ferry_tutorial_done');
    // if (!isDone) {
      // Small delay to let initial entrance animations finish
      const timer = setTimeout(() => setShowTutorial(true), 1500);
      return () => clearTimeout(timer);
    // }
  }, []);

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    // localStorage.setItem('gentle_ferry_tutorial_done', 'true');
  };

  const activeTasks = tasks.filter(t => {
    // Basic schedule check
    if (t.isHabit && !isHabitScheduledForDay(t, today)) return false;
    // Ignored habits check
    if (t.isHabit && ignoredHabits?.includes(t.text)) return false;
    return true;
  });
  const habits = activeTasks.filter(t => t.isHabit);
  const oneOffs = activeTasks.filter(t => !t.isHabit);

  useEffect(() => {
    if (isDayDone) {
      const timer = setInterval(() => {
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        const diff = midnight - now;
        
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        
        setTimeToMidnight(
          `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
        );
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isDayDone]);

  const addTask = (text, iconName, isHabit = false, habitSchedule = null) => {
    playPopSound();
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newTask = {
      id: uniqueId,
      text,
      checked: false,
      iconName: iconName,
      isHabit: isHabit,
      habitSchedule: isHabit ? habitSchedule : null,
      updatedAt: new Date()
    };

    if (isHabit) {
      syncHabit({
        text,
        iconName,
        habitSchedule,
        isActive: true
      });
    }

    setTasks(prev => [...prev, newTask]);
    setIsModalOpen(false);
  };

  const toggleTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      playCheckSound(!task.checked);
    }
    setTasks(prev => prev.map(t => t.id === id ? { ...t, checked: !t.checked, updatedAt: new Date() } : t));
  };

  const deleteTask = (id) => {
    playTrashSound();
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const resetTasks = () => {
    setTasks(prev => 
      prev
        .filter(t => t.isHabit)
        .map(t => ({ ...t, checked: false, updatedAt: new Date() }))
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveDragId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (over && active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((t) => t.id === active.id);
        const newIndex = items.findIndex((t) => t.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      playPopSound();
    }
  };

  const allChecked = activeTasks.length > 0 && activeTasks.every(t => t.checked);

  useEffect(() => {
    if (isAuthenticated && pendingLog) {
      setPendingLog(false);
      setIsLogOpen(true);
    }
  }, [isAuthenticated, pendingLog]);

  useEffect(() => {
    setCongratsDismissed(false);
  }, [activeTasks.length]);

  return (
    <div className="w-full relative">
      <AnimatePresence>
        {isModalOpen && (
          <AddTaskModal 
            onClose={() => setIsModalOpen(false)} 
            onAdd={addTask} 
          />
        )}
        {viewingTask && (
          <TaskDetailModal 
            task={viewingTask} 
            onClose={() => setViewingTask(null)} 
            onToggle={(id) => {
              toggleTask(id);
              setViewingTask(prev => ({ ...prev, checked: !prev.checked }));
            }} 
            onDelete={deleteTask}
            onUpdateSchedule={(id, isHabit, scheduleType) => {
               const newSchedule = isHabit ? { type: scheduleType } : null;
               setTasks(prev => prev.map(t => t.id === id ? { ...t, isHabit, habitSchedule: newSchedule } : t));
               setViewingTask(prev => prev?.id === id ? { ...prev, isHabit, habitSchedule: newSchedule } : prev);
            }}
          />
        )}
        {showHabitReminder && (
          <HabitReminderModal 
            tasks={tasks}
            onToggleTask={toggleTask}
            onProceed={() => {
              setShowHabitReminder(false);
              setShowCongrats(true);
            }}
            onClose={() => setShowHabitReminder(false)}
          />
        )}
        {showCongrats && (
          <AchievementUnlockedModal 
            onLog={(mood) => {
               playPopSound();
               setSelectedMood(mood);
               setShowCongrats(false);
               if (!isAuthenticated) {
                  setPendingLog(true);
                  onRequireLogin();
               } else {
                  setIsLogOpen(true);
               }
            }} 
            onClose={() => {
               playPopSound();
               setShowCongrats(false);
               setCongratsDismissed(true);
            }} 
          />
        )}
        {isLogOpen && (
          <AchievementLog 
            isOpen={isLogOpen}
            onClose={() => setIsLogOpen(false)}
            tasks={tasks}
            onReset={resetTasks}
            onSaveReceipt={onSaveReceipt}
            onToggleTask={toggleTask}
            mood={selectedMood}
          />
        )}
        {isTomorrowModalOpen && (
          <TomorrowModal 
            onClose={() => setIsTomorrowModalOpen(false)}
            tasks={tasks}
            onAddTask={() => {
               setIsTomorrowModalOpen(false);
               setIsModalOpen(true);
            }}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
          />
        )}
      </AnimatePresence>

      {isDayDone && (activeTasks.length > 0 || !isProductive) ? (
        <FerrySleeps 
          isDarkMode={isDarkMode} 
          timeToMidnight={timeToMidnight} 
          onOpenTomorrowModal={() => setIsTomorrowModalOpen(true)} 
        />
      ) : !isProductive ? (
        <div className="w-full mt-4 max-w-[1200px] mx-auto px-4 md:px-8 pb-10">
          <ChillSpaceFlow tasks={tasks} onSaveReceipt={onSaveReceipt} />
        </div>
      ) : (
        /* ACTIVE FERRY VIEW */
        <>
          {activeTasks.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="w-full flex justify-center mb-12"
            >
              <div className="flex items-center justify-center flex-wrap gap-4 w-full px-4">
                <button 
                  id="add-duty-btn"
                  onClick={() => { playPopSound(); setIsModalOpen(true); }}
                  className={`px-8 h-11 ${isDarkMode ? 'bg-[#2c2a25] text-white border-white/10' : 'bg-white text-[#2c2a25] border-[#2c2a25]'} border-[3px] shadow-[4px_4px_0_#2c2a25] text-[11px] font-sans font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-[6px_6px_0_#2c2a25] active:translate-y-0.5 active:shadow-none transition-all group shrink-0`}
                  style={isDarkMode ? { boxShadow: '4px 4px 0 rgba(0,0,0,0.6)' } : {}}
                >
                  <Plus size={16} strokeWidth={4} className="group-hover:rotate-90 transition-transform" />
                  Add Duty
                </button>

                <button 
                  id="finish-day-btn"
                  onClick={() => {
                    const habitsForToday = tasks.filter(t => t.isHabit && isHabitScheduledForDay(t, today));
                    const hasCheckedHabits = habitsForToday.some(h => h.checked);

                    if (habitsForToday.length > 0 && !hasCheckedHabits) {
                      playSuccessSound();
                      setShowHabitReminder(true);
                    } else {
                      playSuccessSound();
                      setShowCongrats(true);
                    }
                  }}
                  className={`flex-1 max-w-[280px] h-11 font-sans font-black uppercase tracking-[0.2em] text-[11px] rounded-xl flex items-center justify-center gap-3 transition-all group border-[3px] ${
                    allChecked 
                      ? `${isDarkMode ? 'bg-[#ffcf54] text-[#2c2a25] border-[#2c2a25] shadow-[6px_6px_0_rgba(0,0,0,0.6)]' : 'bg-[#ffcf54] text-[#2c2a25] border-[#2c2a25] shadow-[6px_6px_0_#2c2a25]'} hover:-translate-y-1` 
                      : `${isDarkMode ? 'bg-white/5 text-white/20 border-white/5' : 'bg-white/50 text-[#2c2a25]/40 border-[#2c2a25]/10'} shadow-[3px_3px_0_#2c2a2505] hover:bg-[#2c2a25] hover:text-white hover:shadow-[6px_6px_0_rgba(0,0,0,0.4)] hover:-translate-y-1`
                  } active:translate-y-0.5 active:shadow-none`}
                >
                  <Archive size={16} strokeWidth={3} className={`transition-transform duration-300 ${allChecked ? 'scale-110' : 'group-hover:scale-110'}`} />
                  Finish My Day
                </button>
              </div>
            </motion.div>
          )}

          <div className="w-full mt-4 max-w-[1200px] mx-auto px-4 md:px-8">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={() => setActiveDragId(null)}
            >
                {/* Rhythms (Habits) as Circles at Top */}
                {habits.length > 0 && (
                  <div id="habit-orbs-container" className="flex flex-wrap items-center justify-center gap-4 pb-6 w-full">
                    {habits.map((task, idx) => (
                      <HabitOrb 
                        key={task.id}
                        task={task}
                        idx={idx}
                        isDarkMode={isDarkMode}
                        onToggle={toggleTask}
                        onLongPress={(t) => setViewingTask(t)}
                      />
                    ))}
                  </div>
                )}

                <SortableContext
                  items={oneOffs.map((t) => t.id)}
                  strategy={rectSortingStrategy}
                >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full cursor-grab active:cursor-grabbing">
                  <AnimatePresence initial={false} mode="popLayout">
                    {oneOffs.map((task) => (
                      <SortableTaskCard
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                        onClick={(t) => { if (!activeDragId) { playTapSound(); setViewingTask(t); } }}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </SortableContext>
              
              <DragOverlay zIndex={9999}>
                {activeDragId ? (
                  <TaskCard
                    task={oneOffs.find((t) => t.id === activeDragId) || habits.find(t => t.id === activeDragId)}
                    onToggle={() => {}}
                    onDelete={() => {}}
                    onClick={() => {}}
                    isOverlay
                  />
                ) : null}
              </DragOverlay>
            </DndContext>
            
            {activeTasks.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full relative mt-10 md:mt-14 group cursor-pointer max-w-3xl mx-auto"
                onClick={() => { playPopSound(); setIsModalOpen(true); }}
              >
                <div 
                  className={`absolute -top-5 left-4 right-4 h-10 border-[4px] ${theme.taskCardBorder} rounded-t-lg ${isDarkMode ? 'shadow-[4px_4px_0_#00000060]' : 'shadow-[4px_4px_0_#2c2a25]'} z-20 flex items-center justify-evenly px-4 md:px-12 transition-transform duration-300 group-hover:-translate-y-1`}
                  style={{ backgroundColor: theme.topBarBg || '#c65f4b' }}
                >
                  {[1, 2, 3, 4, 5, 6, 7].map(i => (
                     <div key={i} className={`w-3 md:w-4 h-8 ${theme.modalBg} border-[3px] ${theme.taskCardBorder} rounded-full shadow-inner -translate-y-1`} />
                  ))}
                </div>

                <div className={`w-full ${theme.modalBg} border-[4px] ${theme.taskCardBorder} rounded-b-xl p-12 md:p-24 flex flex-col items-center justify-center text-center ${theme.taskCardShadow} transition-all duration-300 group-hover:scale-[1.01] group-hover:-translate-y-1 relative overflow-hidden ${isDarkMode ? 'bg-[url("https://www.transparenttextures.com/patterns/lined-paper-2.png")]' : 'bg-[url("https://www.transparenttextures.com/patterns/lined-paper-2.png")]'}`}>
                  <div className={`w-20 h-20 ${theme.modalInputBg} border-[4px] ${theme.taskCardBorder} rounded-full flex items-center justify-center ${isDarkMode ? 'shadow-[4px_4px_0_#00000060]' : 'shadow-[4px_4px_0_#2c2a25]'} mb-8 ${theme.taskCardText} group-hover:bg-[#ffcf54] group-hover:text-[#2c2a25] group-hover:scale-110 group-hover:rotate-90 group-hover:shadow-[6px_6px_0_#2c2a25] transition-all duration-500 z-10 active:scale-95 active:shadow-none active:translate-y-1`}>
                    <Plus size={40} strokeWidth={3} />
                  </div>
                  <h3 className={`font-serif font-black ${theme.taskCardText} text-3xl md:text-5xl tracking-tighter uppercase leading-none mb-4 relative z-10 ${!isDarkMode && 'drop-shadow-[2px_2px_0_rgba(253,248,234,1)]'}`}>
                    Fresh Canvas
                  </h3>
                  <div className={`w-12 h-[4px] ${isDarkMode ? 'bg-white/10' : 'bg-[#2c2a25]/20'} mb-5 rounded-full group-hover:w-32 group-hover:bg-[#ffcf54] transition-all duration-500 ease-out`} />
                  <p className={`font-sans ${theme.taskCardSecondaryText} text-xs md:text-sm uppercase tracking-[0.2em] font-bold max-w-xs transition-colors duration-300 ${isDarkMode ? 'group-hover:text-[#ffcf54]' : 'group-hover:text-[#2c2a25]'}`}>
                    No duties inscribed. <br/> Tap to begin your next entry.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </>
      )}

      {showTutorial && (
        <TutorialOverlay 
          isDarkMode={isDarkMode} 
          onComplete={handleTutorialComplete} 
        />
      )}
    </div>
  );
}
