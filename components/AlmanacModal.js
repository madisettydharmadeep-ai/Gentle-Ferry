'use client';
import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart2, ChevronLeft, ChevronRight, Frown, Meh, Smile, Lock } from 'lucide-react';
import { playSwooshSound, playTapSound } from '../utils/sound';
import { useAppContext } from '../app/context/AppContext';
import { navbarThemes } from '../utils/navbarThemes';
import AlmanacDashboard from './AlmanacDashboard';

// ======================== 2026 PLACEHOLDER DATA (demo/marketing) ========================
// 0 = no entry, 1 = sad, 2 = mid, 3 = high
const PLACEHOLDER_2026_MOODS = [
  // January (31)
  3,3,2,3,1,2,3,3,3,1,3,3,2,3,3,3,1,3,3,3,2,3,0,1,3,2,3,3,3,2,3,
  // February (28)
  3,2,3,3,3,2,3,3,2,1,3,3,2,3,3,2,1,3,3,2,3,3,2,3,3,3,1,3,
  // March 1–31
  1,3,3,2,3,3,3,2,3,3,2,3,3,3,2,3,1,2,3,3,3,2,3,1,2,3,3,2,3,3,3,
  // April 1–30
  1,3,3,2,3,3,3,2,3,3,2,3,3,3,2,3,1,2,3,3,3,2,3,1,2,3,3,2,3,3,
  // May 1–31
  1,3,3,2,3,3,3,2,3,3,2,3,3,3,2,3,1,2,3,3,3,2,3,1,2,3,3,2,3,3,3,
  // June 1–30
  1,3,3,2,3,3,3,2,3,3,2,3,3,3,2,3,1,2,3,3,3,2,3,1,2,3,3,2,3,3,
  // July 1–31
  1,3,3,2,3,3,3,2,3,3,2,3,3,3,2,3,1,2,3,3,3,2,3,1,2,3,3,2,3,3,3,
  // August 1–31
  1,3,3,2,3,3,3,2,3,3,2,3,3,3,2,3,1,2,3,3,3,2,3,1,2,3,3,2,3,3,3,
  // September 1–30
  1,3,3,2,3,3,3,2,3,3,2,3,3,3,2,3,1,2,3,3,3,2,3,1,2,3,3,2,3,3,
  // October 1–31
  1,3,3,2,3,3,3,2,3,3,2,3,3,3,2,3,1,2,3,3,3,2,3,1,2,3,3,2,3,3,3,
  // November 1–30
  1,3,3,2,3,3,3,2,3,3,2,3,3,3,2,3,1,2,3,3,3,2,3,1,2,3,3,2,3,3,
  // December 1–31
  1,3,3,2,3,3,3,2,3,3,2,3,3,3,2,3,1,2,3,3,3,2,3,1,2,3,3,2,3,3,3,
];

const generate2026Placeholders = () => {
  const segments = [
    { m: 0, days: 31 },
    { m: 1, days: 28 },
    { m: 2, days: 31 },
    { m: 3, days: 30 },
    { m: 4, days: 31 },
    { m: 5, days: 30 },
    { m: 6, days: 31 },
    { m: 7, days: 31 },
    { m: 8, days: 30 },
    { m: 9, days: 31 },
    { m: 10, days: 30 },
    { m: 11, days: 31 },
  ];
  const result = [];
  let idx = 0;
  const journalSnippets = [
    "The morning mist settled over the deck as I opened my notebook, the tea growing cold beside me. Found a kind of peace in the slowness of it all — one thought at a time, one page at a time.",
    "Caught the last light from the window before it slipped behind the clouds. These small, unheld moments feel worth keeping.",
    "Something quiet happened today — nothing that would make tomorrow's headlines, but something that mattered to me.",
    "Spent the evening rearranging thoughts like furniture. Some things fit better elsewhere.",
    "The ferry was loud today, but I found a corner. Wrote two pages. Felt lighter after.",
    "Days like these remind me that ordinary is just extraordinary wearing plain clothes.",
    "The kind of day that asks nothing dramatic of you. I was grateful for it.",
  ];
  segments.forEach(({ m, days }) => {
    for (let d = 1; d <= days; d++) {
      const mood = PLACEHOLDER_2026_MOODS[idx++];
      if (!mood) continue;
      const dateObj = new Date(2026, m, d, 10, 30, 0, 0);
      const dateStr = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      result.push({
        id: String(dateObj.getTime()),
        date: dateStr,
        mood,
        journal: journalSnippets[(d + m * 3) % journalSnippets.length],
        tasks: [
          { id: `demo-${m}-${d}-1`, text: 'Visit temple and stay for 30 min', checked: d % 3 === 0 },
          { id: `demo-${m}-${d}-2`, text: 'Fix the bug and raise the PR by EOD', checked: d % 2 === 0 },
          { id: `demo-${m}-${d}-3`, text: "Finish up little sister's school project", checked: d % 4 === 1 },
          { id: `demo-${m}-${d}-4`, text: 'Order the games in cart today', checked: d % 5 === 2 },
        ],
        habitStats: { total: 4, checked: Math.round(4 * (0.4 + (d % 3) * 0.2)) },
      });
    }
  });
  return result;
};

const DEMO_2026_RECEIPTS = generate2026Placeholders();
// ===================================================================================

const MOOD_CONFIG = [
  { value: 1, Icon: Frown, label: 'Low', color: '#ff6b6b' },
  { value: 2, Icon: Meh, label: 'Mid', color: '#ffcf54' },
  { value: 3, Icon: Smile, label: 'High', color: '#5ba882' },
];

const VIEW_MODES = [
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
];

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function AlmanacModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'year'
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { receipts, today, isDarkMode, isPremium, setShowProModal, fetchVoyages } = useAppContext();
  const theme = isDarkMode ? navbarThemes.dark : navbarThemes.light;
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isOpen) {
      if (viewMode === 'year') {
        fetchVoyages(null, selectedYear.toString());
      } else {
        fetchVoyages(MONTH_NAMES[selectedMonth], selectedYear.toString());
      }
    }
  }, [isOpen, viewMode, selectedMonth, selectedYear, fetchVoyages]);

  // Merge real receipts with 2026 placeholders (placeholder only fills dates with no real entry)
  const mergedReceipts2026 = (selectedYear === 2026)
    ? [...(receipts || []), ...DEMO_2026_RECEIPTS.filter(p => !(receipts || []).some(r => r.date === p.date))]
    : (receipts || []);
  const activeReceipts = selectedYear === 2026 ? mergedReceipts2026 : (receipts || []);

  // ======================== CALCULATIONS ========================

  // ======================== HEATMAP ========================

  const generateHeatmapData = () => {
    const cells = [];
    
    if (viewMode === 'year') {
      // Full year view (364 days back from end of selected year or current today if current year)
      const endDate = selectedYear === today.getFullYear() ? new Date(today) : new Date(selectedYear, 11, 31);
      for (let i = 364; i >= 0; i--) {
        const date = new Date(endDate);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const receipt = activeReceipts.find(r => r.date === dateStr);
        cells.push({
          date: new Date(date),
          hasLog: !!receipt,
          mood: receipt?.mood || 0,
        });
      }
    } else {
      // Month view
      const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(selectedYear, selectedMonth, i);
        const dateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const receipt = activeReceipts.find(r => r.date === dateStr);
        cells.push({
          date: new Date(date),
          hasLog: !!receipt,
          mood: receipt?.mood || 0,
        });
      }
    }

    // Pad start to align with Sunday
    const firstDay = cells[0].date.getDay();
    const padded = new Array(firstDay).fill(null).concat(cells);
    // Group into weeks (columns of 7)
    const weeks = [];
    for (let i = 0; i < padded.length; i += 7) {
      const week = padded.slice(i, i + 7);
      while (week.length < 7) week.push(null);
      weeks.push(week);
    }
    return weeks;
  };

  const getCellColor = (cell) => {
    if (!cell || !cell.hasLog) return '#e6e2d3';
    if (!cell.mood) return '#c5d5bc';
    return MOOD_CONFIG.find(m => m.value === cell.mood)?.color || '#c5d5bc';
  };

  const heatmapWeeks = isOpen ? generateHeatmapData() : [];

  // Month labels for heatmap
  const getMonthLabels = () => {
    if (heatmapWeeks.length === 0) return [];
    const labels = [];
    let lastMonth = -1;
    heatmapWeeks.forEach((week, wi) => {
      const firstCell = week.find(c => c);
      if (firstCell) {
        const m = firstCell.date.getMonth();
        if (m !== lastMonth) {
          labels.push({ weekIndex: wi, label: MONTH_NAMES[m].substring(0, 3) });
          lastMonth = m;
        }
      }
    });
    return labels;
  };

  // ======================== REVIEW DATA ========================

  // ======================== PERIOD CALCULATIONS ========================
  
  const filteredReceipts = activeReceipts.filter(r => {
    const d = new Date(parseInt(r.id));
    if (isNaN(d.getTime())) return false;
    if (viewMode === 'year') return d.getFullYear() === selectedYear;
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  const totalLogs = filteredReceipts.length;

  const getPeakStreak = (list) => {
    if (!list || list.length === 0) return 0;
    let current = 1, longest = 1;
    const sorted = [...list].sort((a, b) => parseInt(a.id) - parseInt(b.id));
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(parseInt(sorted[i - 1].id));
      const curr = new Date(parseInt(sorted[i].id));
      const diff = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
      if (diff === 1) { current++; longest = Math.max(longest, current); }
      else if (diff > 1) current = 1;
    }
    return longest;
  };

  const peakStreak = getPeakStreak(filteredReceipts);
  
  // Global current streak (usually users want to see their actual current momentum)
  const getCurrentStreak = () => {
    if (!activeReceipts || activeReceipts.length === 0) return 0;
    const sorted = [...activeReceipts].filter(r => !isNaN(parseInt(r.id))).sort((a, b) => parseInt(b.id) - parseInt(a.id));
    if (sorted.length === 0) return 0;
    const isToday = (d) => d.toDateString() === today.toDateString();
    const isYesterday = (d) => {
      const yest = new Date(today);
      yest.setDate(yest.getDate() - 1);
      return d.toDateString() === yest.toDateString();
    };
    
    // Check if the latest log is today or yesterday
    const latest = new Date(parseInt(sorted[0].id));
    if (!isToday(latest) && !isYesterday(latest)) return 0;
    
    let streak = 0;
    let expectedDate = new Date(latest);
    for (const r of sorted) {
      const rDate = new Date(parseInt(r.id));
      if (rDate.toDateString() === expectedDate.toDateString()) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else break;
    }
    return streak;
  };

  const totalWords = filteredReceipts.reduce((acc, r) => {
    if (typeof r.journal === 'string' && r.journal.trim().length > 0)
      return acc + r.journal.trim().split(/\s+/).filter(w => w.length > 0).length;
    return acc;
  }, 0);

  let totalTasks = 0, completedTasks = 0;
  const timeCounts = { 'Early Mrng': 0, 'Morning': 0, 'Afternoon': 0, 'Evening': 0, 'Night': 0, 'Midnight': 0 };
  
  filteredReceipts.forEach(r => {
    const d = new Date(parseInt(r.id));
    // Completion rate
    if (r.tasks) {
      r.tasks.forEach(t => {
        totalTasks++;
        if (t.checked) completedTasks++;
      });
    }
    // Prime Time
    const h = d.getHours();
    if (h >= 5 && h < 8) timeCounts['Early Mrng']++;
    else if (h >= 8 && h < 12) timeCounts['Morning']++;
    else if (h >= 12 && h < 17) timeCounts['Afternoon']++;
    else if (h >= 17 && h < 21) timeCounts['Evening']++;
    else if (h >= 21 && h < 24) timeCounts['Night']++;
    else timeCounts['Midnight']++;
  });

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const primeTime = Object.entries(timeCounts).reduce((a, b) => b[1] > a[1] ? b : a, ['None', 0])[0];

  // Period Mood stats
  const moodData = filteredReceipts.filter(r => r.mood).map(r => r.mood);
  const avgMood = moodData.length > 0 ? (moodData.reduce((a, b) => a + b, 0) / moodData.length).toFixed(1) : '--';
  const moodDistribution = [1, 2, 3].map(m => ({ mood: m, count: moodData.filter(v => v === m).length }));
  const maxMoodCount = Math.max(...moodDistribution.map(d => d.count), 1);

  // ======================== RENDER ========================

  const content = (
    <motion.div
      key="almanac-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#2c2a25]/60 backdrop-blur-sm p-4 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`w-full max-w-[1100px] h-[90dvh] max-h-[800px] ${theme.taskCardBg} ${isDarkMode ? 'shadow-[16px_16px_0_#00000060]' : 'shadow-[16px_16px_0_#2c2a25]'} relative flex flex-col border-[4px] ${theme.taskCardBorder} overflow-hidden rounded-xl bg-[url('https://www.transparenttextures.com/patterns/lined-paper-2.png')]`}
      >
        {/* Notebook Top Bar (Fresh Canvas Style) */}
        <div className={`absolute top-0 left-0 right-0 h-8 bg-[#c65f4b] border-b-[4px] ${theme.taskCardBorder} flex items-center justify-evenly px-8 z-30`}>
           {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
               <div key={i} className={`w-3 h-5 ${theme.modalBg} border-[2px] ${theme.taskCardBorder} rounded-full shadow-inner`} />
           ))}
        </div>

        {/* Close Button */}
        <button 
          onClick={() => { playTapSound?.(); setIsOpen(false); }}
          className={`absolute top-10 right-4 p-1.5 ${theme.modalInputBg} border-[3px] ${theme.taskCardBorder} ${isDarkMode ? 'shadow-[3px_3px_0_#00000040]' : 'shadow-[3px_3px_0_#2c2a25]'} rounded-lg hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all z-40 ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'}`}
        >
          <X size={18} strokeWidth={3} />
        </button>

        {/* Header - Brand Style */}
        <div className="pt-14 px-6 md:px-10 shrink-0 flex flex-col items-start relative z-20">
           <h2 className={`font-serif font-black text-3xl md:text-4xl ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'} uppercase tracking-tighter leading-none mb-2`}>
             The Almanac
           </h2>
           <div className={`w-20 h-[4px] ${isDarkMode ? 'bg-[#ffcf54]' : 'bg-[#2c2a25]'} rounded-full opacity-20`} />
        </div>

        {/* Unified Selection Toolbar */}
        <div className="w-full shrink-0 flex items-center px-4 md:px-10 mt-6 gap-6 relative z-20">
          <div className={`flex ${isDarkMode ? 'bg-black/20' : 'bg-[#2c2a25]/5'} rounded-xl p-1 border-[2px] ${isDarkMode ? 'border-white/5' : 'border-[#2c2a25]/10'}`}>
            {VIEW_MODES.map(mode => (
              <button
                key={mode.id}
                onClick={() => { 
                  playTapSound?.(); 
                  if (mode.id === 'year' && !isPremium) {
                    setShowProModal(true);
                  } else {
                    setViewMode(mode.id);
                  }
                }}
                className={`px-6 py-2 rounded-lg font-sans font-black text-[10px] uppercase tracking-widest transition-all relative flex items-center gap-2 ${viewMode === mode.id ? (isDarkMode ? 'bg-[#ffcf54] text-[#2c2a25]' : 'bg-[#2c2a25] text-[#ffcf54]') : (isDarkMode ? 'text-[#fdf8ea]/30' : 'text-[#2c2a25]/40')}`}
              >
                {mode.id === 'year' && !isPremium && <Lock size={10} strokeWidth={3} className={isDarkMode ? 'text-[#ffcf54]' : 'text-[#2c2a25]'} />}
                {mode.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playTapSound?.();
                if (viewMode === 'year') setSelectedYear(y => y - 1);
                else {
                  if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(y => y - 1); }
                  else setSelectedMonth(m => m - 1);
                }
              }}
              className={`w-10 h-10 border-[3px] ${theme.taskCardBorder} rounded-xl flex items-center justify-center ${theme.modalInputBg} ${isDarkMode ? 'shadow-[3px_3px_0_#00000040]' : 'shadow-[3px_3px_0_#2c2a25]'} active:translate-y-[2px] transition-all ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'}`}
            ><ChevronLeft size={18} strokeWidth={3} /></button>
            
            <span className={`font-serif font-black text-lg ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'} uppercase tracking-tighter min-w-[100px] text-center`}>
               {viewMode === 'year' ? selectedYear : `${MONTH_NAMES[selectedMonth].substring(0, 3)} ${selectedYear}`}
            </span>

            <button
              onClick={() => {
                playTapSound?.();
                if (viewMode === 'year') setSelectedYear(y => y + 1);
                else {
                  if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(y => y + 1); }
                  else setSelectedMonth(m => m + 1);
                }
              }}
              className={`w-10 h-10 border-[3px] ${theme.taskCardBorder} rounded-xl flex items-center justify-center ${theme.modalInputBg} ${isDarkMode ? 'shadow-[3px_3px_0_#00000040]' : 'shadow-[3px_3px_0_#2c2a25]'} active:translate-y-[2px] transition-all ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'}`}
            ><ChevronRight size={18} strokeWidth={3} /></button>
          </div>
        </div>

        {/* Content - Removed Glassmorphism and Added Corner Decoration */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6 md:p-10 relative z-10 custom-scrollbar">
          <AnimatePresence mode="wait">

            <AlmanacDashboard
              totalLogs={totalLogs}
              currentStreak={getCurrentStreak()}
              longestStreak={peakStreak}
              totalWords={totalWords}
              completionRate={completionRate}
              mostProductiveDay={primeTime} // Repurposing mostProductiveDay for Prime Time string
              moodData={moodData}
              avgMood={avgMood}
              moodDistribution={moodDistribution}
              maxMoodCount={maxMoodCount}
              MOOD_CONFIG={MOOD_CONFIG}
              heatmapWeeks={heatmapWeeks}
              getCellColor={getCellColor}
              getMonthLabels={getMonthLabels}
              isDarkMode={isDarkMode}
              theme={theme}
            />

          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { playSwooshSound?.(); setIsOpen(true); }}
        className={`flex items-center justify-center p-2 md:p-2.5 rounded-xl border-[3px] transition-all duration-200 ${
          isDarkMode 
            ? 'bg-[#3d2f1f] border-[#332f2b] text-[#d1a23b] shadow-[4px_4px_0_#00000040] hover:shadow-[6px_6px_0_#00000050]' 
            : 'bg-[#fac282] border-[#2c2a25] text-[#2c2a25] shadow-[4px_4px_0_#2c2a25] hover:shadow-[6px_6px_0_#2c2a25]'
        } hover:-translate-y-1 hover:-translate-x-1 active:translate-y-1 active:translate-x-1 active:shadow-none`}
      >
        <BarChart2 size={18} className="md:w-5 md:h-5" strokeWidth={2.5} />
      </motion.button>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && content}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
