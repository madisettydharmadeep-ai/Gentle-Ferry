'use client';
import { motion } from 'framer-motion';
import { Calendar, Flame, TrendingUp, PenTool, Activity, Zap, Frown, Meh, Smile } from 'lucide-react';

// --- Stat Card Sub-Component ---
function StatCard({ icon: Icon, iconBg, label, value, valueClass = '', isDarkMode, theme }) {
  return (
    <div className={`flex-1 min-h-[60px] md:min-h-[70px] w-full flex items-center justify-between px-3 py-2 md:px-4 border-[2.5px] ${theme.taskCardBorder} ${isDarkMode ? 'shadow-[4px_4px_0_#00000040]' : 'shadow-[4px_4px_0_#2c2a2508]'} ${theme.modalInputBg} rounded-xl group hover:-translate-y-0.5 transition-all duration-300`}>
      <div className="flex items-center gap-2 md:gap-3">
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg border-[2px] ${theme.taskCardBorder} flex items-center justify-center shadow-[2px_2px_0_#2a282420] ${iconBg}`}>
          <Icon size={18} strokeWidth={2.5} className="md:w-5 md:h-5" />
        </div>
        <span className={`font-sans font-black text-[8px] md:text-[9px] uppercase tracking-[0.15em] ${isDarkMode ? 'text-[#fdf8ea]/40' : 'text-[#2c2a25]/40'}`}>{label}</span>
      </div>
      <span className={`font-serif font-black text-xl md:text-2xl ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'} leading-none tracking-tighter ${valueClass}`}>{value}</span>
    </div>
  );
}

// --- Mood Legend ---
function MoodLegend({ isDarkMode }) {
  const moods = [
    { label: 'Happy', color: isDarkMode ? '#2b5f82' : '#5ba882', Icon: Smile },
    { label: 'Mid',   color: isDarkMode ? '#9e7511' : '#ffcf54', Icon: Meh },
    { label: 'Sad',   color: isDarkMode ? '#8c3535' : '#ff6b6b', Icon: Frown },
    { label: 'None',  color: isDarkMode ? '#1a1815' : '#e6e2d3', Icon: null },
  ];
  return (
    <div className="flex items-center gap-4 flex-wrap">
      {moods.map(({ label, color, Icon }) => (
        <div key={label} className="flex items-center gap-1.5">
          <div
            className={`w-3 h-3 rounded-[4px] border ${isDarkMode ? 'border-white/10' : 'border-[#2c2a25]/10'}`}
            style={{ backgroundColor: color }}
          />
          {Icon && <Icon size={10} strokeWidth={3} style={{ color }} />}
          <span className={`font-sans font-black text-[8px] uppercase tracking-[0.2em] ${isDarkMode ? 'text-[#fdf8ea]/40' : 'text-[#2c2a25]/40'}`}>{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function AlmanacDashboard({
  totalLogs, currentStreak, longestStreak, totalWords, completionRate, mostProductiveDay,
  moodData, avgMood, moodDistribution, maxMoodCount, MOOD_CONFIG,
  heatmapWeeks, getCellColor, getMonthLabels, isDarkMode, theme
}) {
  const isMonthView = heatmapWeeks.length <= 6;
  const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getMoodColor = (cell) => {
    if (!cell || !cell.hasLog) return isDarkMode ? '#1a1815' : '#e6e2d3';
    if (!cell.mood) return isDarkMode ? '#3d3a33' : '#c5d5bc';
    if (isDarkMode) {
      return cell.mood === 1 ? '#8c3535' : cell.mood === 2 ? '#9e7511' : '#2b5f82';
    }
    return cell.mood === 1 ? '#ff6b6b' : cell.mood === 2 ? '#ffcf54' : '#5ba882';
  };

  const getMoodIcon = (mood) => {
    if (!mood) return null;
    if (mood === 1) return <Frown size={10} strokeWidth={3} className="text-white/70" />;
    if (mood === 2) return <Meh size={10} strokeWidth={3} className={isDarkMode ? 'text-white/70' : 'text-[#2c2a25]/60'} />;
    return <Smile size={10} strokeWidth={3} className="text-white/70" />;
  };

  return (
    <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6 pb-2">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard icon={Calendar} iconBg={`${isDarkMode ? 'bg-[#3d2f1f]' : 'bg-[#ffcf54]'} ${isDarkMode ? 'text-[#ffcf54]' : 'text-[#2c2a25]'}`} label="Logs" value={totalLogs} isDarkMode={isDarkMode} theme={theme} />
        <StatCard icon={Flame} iconBg="bg-[#ff6b6b] text-white" label="Streak" value={currentStreak} isDarkMode={isDarkMode} theme={theme} />
        <StatCard icon={TrendingUp} iconBg="bg-[#d97757] text-white" label="Peak" value={longestStreak} isDarkMode={isDarkMode} theme={theme} />
        <StatCard icon={PenTool} iconBg={`${isDarkMode ? 'bg-[#1a2e26]' : 'bg-[#a8e6cf]'} ${isDarkMode ? 'text-[#a8e6cf]' : 'text-[#2c2a25]'}`} label="Words" value={totalWords.toLocaleString()} isDarkMode={isDarkMode} theme={theme} />
        <StatCard icon={Activity} iconBg={`bg-[#2c2a25] ${isDarkMode ? 'text-[#ffcf54]' : 'text-[#ffcf54]'}`} label="Rate" value={`${completionRate}%`} isDarkMode={isDarkMode} theme={theme} />
        <StatCard icon={Zap} iconBg={`${isDarkMode ? 'bg-white/10' : 'bg-white'} ${isDarkMode ? 'text-[#ffcf54]' : 'text-[#2c2a25]'}`} label="Prime" value={mostProductiveDay} isDarkMode={isDarkMode} theme={theme} valueClass="text-[14px] md:text-[16px] uppercase" />
      </div>

      {/* Rhythm / Heatmap */}
      <div className={`border-[2.5px] ${theme.taskCardBorder} ${isDarkMode ? 'shadow-[6px_6px_0_#00000040]' : 'shadow-[6px_6px_0_#2c2a2505]'} ${theme.modalInputBg} p-4 md:p-6 rounded-3xl overflow-hidden relative group`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex flex-col gap-1">
            <span className={`font-sans font-black text-[9px] uppercase tracking-[0.3em] ${isDarkMode ? 'text-[#fdf8ea]/30' : 'text-[#2c2a25]/30'}`}>
              {isMonthView ? 'Monthly Rhythm' : 'Annual Rhythm'}
            </span>
            <div className="mt-1">
              <MoodLegend isDarkMode={isDarkMode} />
            </div>
          </div>
        </div>

        {isMonthView ? (
          /* ── BIG MONTH CALENDAR VIEW ── */
          <div className="w-full">
            {/* Day column headers */}
            <div className="grid grid-cols-7 gap-[5px] mb-2">
              {DAY_LABELS.map(d => (
                <div key={d} className="flex items-center justify-center">
                  <span className={`font-sans font-black text-[8px] md:text-[9px] uppercase tracking-[0.2em] ${isDarkMode ? 'text-[#fdf8ea]/25' : 'text-[#2c2a25]/30'}`}>{d}</span>
                </div>
              ))}
            </div>

            {/* Calendar cells */}
            <div className="flex flex-col gap-[5px]">
              {heatmapWeeks.map((week, wi) => (
                <div key={`week-${wi}`} className="grid grid-cols-7 gap-[5px]">
                  {week.map((cell, di) => {
                    const bg = getMoodColor(cell);
                    const isEmpty = !cell;
                    return (
                      <div
                        key={`m-${wi}-${di}`}
                        className={`relative h-[44px] md:h-[52px] rounded-xl border-[2px] flex flex-col items-center justify-center transition-all duration-200 ${
                          isEmpty
                            ? 'border-transparent bg-transparent'
                            : `${isDarkMode ? 'border-white/5' : 'border-[#2c2a25]/08'} hover:scale-105 hover:z-10 cursor-default`
                        }`}
                        style={{ backgroundColor: isEmpty ? 'transparent' : bg }}
                      >
                        {cell && (
                          <>
                            <span className={`font-serif font-black text-sm leading-none ${
                              cell.hasLog
                                ? 'text-white drop-shadow-sm'
                                : isDarkMode ? 'text-[#fdf8ea]/20' : 'text-[#2c2a25]/20'
                            }`}>
                              {cell.date.getDate()}
                            </span>
                            {cell.hasLog && cell.mood > 0 && (
                              <div className="mt-0.5">
                                {getMoodIcon(cell.mood)}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ── SMALL YEAR DOT VIEW ── */
          <div className="overflow-x-auto custom-scrollbar-thin pb-2">
            <div className="flex gap-[4px] min-w-max">
              {/* Day labels */}
              <div className="flex flex-col justify-between pr-3 mt-4 shrink-0 h-[84px] md:h-[98px]">
                {['', 'M', '', 'W', '', 'F', ''].map((d, i) => (
                  <span key={`dl-${i}`} className={`font-sans font-black text-[7px] md:text-[8px] ${isDarkMode ? 'text-[#fdf8ea]/20' : 'text-[#2c2a25]/20'} uppercase h-[10px] md:h-[12px] flex items-center`}>{d}</span>
                ))}
              </div>

              {/* Grid */}
              <div className="flex flex-col gap-1">
                <div className="flex gap-[3px]">
                  {heatmapWeeks.map((week, wi) => (
                    <div key={`week-${wi}`} className="flex flex-col gap-[3px]">
                      {week.map((cell, di) => (
                        <div
                          key={`y-${wi}-${di}`}
                          className={`w-[10px] h-[10px] md:w-[12px] md:h-[12px] rounded-[3.5px] border ${isDarkMode ? 'border-white/5' : 'border-[#2c2a25]/5'} transition-all hover:scale-150 hover:z-10`}
                          style={{ backgroundColor: getMoodColor(cell) }}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                {/* Month Labels */}
                <div className="relative h-3 mt-1">
                  {getMonthLabels().map((m, mi) => (
                    <span
                      key={mi}
                      className="absolute font-sans font-black text-[7px] text-[#2c2a25]/20 uppercase tracking-tighter"
                      style={{ left: `${m.weekIndex * (13 + 3)}px` }}
                    >
                      {m.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mood Summary */}
      {moodData.length > 0 && (
        <div className={`border-[2.5px] ${theme.taskCardBorder} ${isDarkMode ? 'shadow-[6px_6px_0_#00000040]' : 'shadow-[6px_6px_0_#2c2a2505]'} ${theme.modalInputBg} p-4 md:p-6 rounded-3xl overflow-hidden relative group`}>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <span className={`font-sans font-black text-[9px] uppercase tracking-[0.3em] ${isDarkMode ? 'text-[#fdf8ea]/30' : 'text-[#2c2a25]/30'}`}>Emotional Distribution</span>
            <div className="flex items-center gap-2">
               <span className={`text-[9px] font-sans font-black ${isDarkMode ? 'text-[#fdf8ea]/20' : 'text-[#2c2a25]/20'} uppercase tracking-widest`}>Global Avg</span>
               <span className={`font-serif font-black text-2xl ${isDarkMode ? 'text-[#ffcf54]' : 'text-[#2c2a25]'}`}>{avgMood}</span>
            </div>
          </div>

          <div className="flex items-end gap-3 md:gap-6 h-20 md:h-24 relative z-10 px-2">
            {moodDistribution.map(d => {
              const mc = MOOD_CONFIG.find(m => m.value === d.mood);
              if (!mc) return null;
              const h = (d.count / maxMoodCount) * 100;
              const pct = moodData.length > 0 ? Math.round((d.count / moodData.length) * 100) : 0;

              return (
                <div key={d.mood} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full flex flex-col items-center">
                     <span className={`absolute -top-5 font-serif font-black text-[10px] ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'}`}>{pct}%</span>
                     <div
                       className={`w-full rounded-xl border-[2px] ${theme.taskCardBorder} shadow-[3px_3px_0_#00000010] relative overflow-hidden`}
                       style={{
                         height: `${Math.max(h, 20)}%`,
                         backgroundColor: isDarkMode ? (d.mood === 1 ? '#8c3535' : (d.mood === 2 ? '#9e7511' : '#2b5f82')) : mc.color
                       }}
                     >
                        <div className="absolute inset-0 bg-white/10" />
                     </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 md:w-10 md:h-10 ${theme.taskCardBg} border-[2px] ${theme.taskCardBorder} rounded-xl flex items-center justify-center text-lg shadow-[2px_2px_0_#00000010] active:scale-95 transition-all`}>
                       <mc.Icon size={18} strokeWidth={2.5} style={{ color: isDarkMode ? (d.mood === 1 ? '#ff8a8a' : (d.mood === 2 ? '#ffcf54' : '#82cbfb')) : mc.color }} />
                    </div>
                    <span className={`font-sans font-black text-[7px] uppercase tracking-widest ${isDarkMode ? 'text-[#fdf8ea]/30' : 'text-[#2c2a25]/30'}`}>{mc.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
