'use client';
import { useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, FileText, PenTool, 
  CheckSquare, Target, Download, Activity, Quote 
} from 'lucide-react';

export default function AlmanacReview({
  showYearReview, setShowYearReview, reviewYear, setReviewYear, 
  reviewMonth, setReviewMonth, MONTH_NAMES, reviewData, 
  playTapSound, MOOD_CONFIG, isDarkMode, theme
}) {
  const reviewRef = useRef(null);

  // THE FIX: Aggressive parsing + Ultimate Failsafe
  const chartPoints = useMemo(() => {
    if (!reviewData) return showYearReview ? Array(12).fill(null) : [];

    if (showYearReview) {
      let yearResult = Array(12).fill(null);

      // 1. Try to parse backend monthlyAvg
      if (Array.isArray(reviewData.monthlyAvg) && reviewData.monthlyAvg.length > 0) {
        yearResult = reviewData.monthlyAvg.map(val => {
          const num = Number(val);
          return (!isNaN(num) && num > 0) ? num : null;
        });
      } 
      // 2. Try to parse dailyMoods if monthlyAvg was useless
      else if (Array.isArray(reviewData.dailyMoods) && reviewData.dailyMoods.length > 0) {
        if (reviewData.dailyMoods.length <= 31) {
          const validMoods = reviewData.dailyMoods.map(Number).filter(v => !isNaN(v) && v > 0);
          if (validMoods.length > 0) {
            const avg = validMoods.reduce((a, b) => a + b, 0) / validMoods.length;
            yearResult[Number(reviewMonth)] = avg; // Jam it into the current month
          }
        } else {
          const monthSums = Array(12).fill(0);
          const monthCounts = Array(12).fill(0);
          reviewData.dailyMoods.forEach((val, i) => {
            const num = Number(val);
            if (!isNaN(num) && num > 0) {
              const mIdx = Math.min(Math.floor(i / 30.416), 11);
              monthSums[mIdx] += num;
              monthCounts[mIdx]++;
            }
          });
          monthSums.forEach((sum, i) => {
            if (monthCounts[i] > 0) yearResult[i] = sum / monthCounts[i];
          });
        }
      }

      // 3. THE ULTIMATE FAILSAFE
      // If the arrays are STILL totally blank, but we know you have logs...
      // Force the overall average mood into the currently selected month.
      if (yearResult.every(v => v === null) && reviewData.logs > 0 && reviewData.avgMood) {
        yearResult[Number(reviewMonth)] = Number(reviewData.avgMood);
      }

      return yearResult;
    }

    // Monthly View: strictly parse numbers, ignoring zeros and nulls
    return (reviewData.dailyMoods || []).map(val => {
      const num = Number(val);
      return (!isNaN(num) && num > 0) ? num : null;
    });
  }, [showYearReview, reviewData, reviewMonth, reviewYear]);

  const handleExportReview = async () => {
    try {
      const { toPng } = await import('html-to-image');
      if (!reviewRef.current) return;
      const url = await toPng(reviewRef.current, { backgroundColor: isDarkMode ? '#1a1815' : '#fffcf2', pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `ferry-log-${showYearReview ? reviewYear : `${MONTH_NAMES[reviewMonth]}-${reviewYear}`}.png`;
      link.href = url;
      link.click();
    } catch (e) { console.error('Export failed', e); }
  };

  const getMoodColor = (val) => {
    if (val === null || val === undefined || val === 0) return 'transparent';
    const rounded = Math.round(val);
    if (isDarkMode) {
      return rounded === 1 ? '#8c3535' : (rounded === 2 ? '#9e7511' : '#2b5f82');
    }
    return MOOD_CONFIG?.find(m => m.value === rounded)?.color || '#2c2a25';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="flex flex-col gap-6 will-change-transform"
    >
      {/* TOOLBAR */}
      <div className={`flex flex-row items-center justify-between gap-4 ${theme.modalInputBg} p-3 rounded-2xl border-[3px] ${theme.taskCardBorder} ${isDarkMode ? 'shadow-[4px_4px_0_#00000040]' : 'shadow-[4px_4px_0_#2c2a2510]'}`}>
        <div className="flex items-center gap-4">
          <div className={`flex ${isDarkMode ? 'bg-black/20' : 'bg-[#2c2a25]/5'} rounded-xl p-1 border-[2px] ${isDarkMode ? 'border-white/5' : 'border-[#2c2a25]/10'}`}>
            {['Mo', 'Yr'].map((lab) => {
              const isYr = lab === 'Yr';
              const active = isYr ? showYearReview : !showYearReview;
              return (
                <button
                  key={lab}
                  onClick={() => { playTapSound?.(); setShowYearReview(isYr); }}
                  className={`px-5 py-2 rounded-lg font-sans font-black text-[10px] uppercase tracking-widest transition-all ${active ? (isDarkMode ? 'bg-[#ffcf54] text-[#2c2a25]' : 'bg-[#2c2a25] text-[#ffcf54]') : (isDarkMode ? 'text-[#fdf8ea]/30' : 'text-[#2c2a25]/50')}`}
                >
                  {lab}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playTapSound?.();
                if (showYearReview) setReviewYear(y => y - 1);
                else {
                  if (reviewMonth === 0) { setReviewMonth(11); setReviewYear(y => y - 1); }
                  else setReviewMonth(m => m - 1);
                }
              }}
              className={`w-10 h-10 border-[3px] ${theme.taskCardBorder} rounded-xl flex items-center justify-center ${theme.modalInputBg} ${isDarkMode ? 'shadow-[3px_3px_0_#00000040]' : 'shadow-[3px_3px_0_#2c2a25]'} active:translate-y-[2px] transition-all ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'}`}
            ><ChevronLeft size={20} strokeWidth={3} /></button>
            
            <span className={`font-serif font-black text-lg ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'} uppercase tracking-tighter min-w-[90px] text-center`}>
               {showYearReview ? reviewYear : `${MONTH_NAMES[reviewMonth].substring(0, 3)} ${reviewYear}`}
            </span>

            <button
              onClick={() => {
                playTapSound?.();
                if (showYearReview) setReviewYear(y => y + 1);
                else {
                  if (reviewMonth === 11) { setReviewMonth(0); setReviewYear(y => y + 1); }
                  else setReviewMonth(m => m + 1);
                }
              }}
              className={`w-10 h-10 border-[3px] ${theme.taskCardBorder} rounded-xl flex items-center justify-center ${theme.modalInputBg} ${isDarkMode ? 'shadow-[3px_3px_0_#00000040]' : 'shadow-[3px_3px_0_#2c2a25]'} active:translate-y-[2px] transition-all ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'}`}
            ><ChevronRight size={20} strokeWidth={3} /></button>
          </div>
        </div>

        {reviewData?.logs > 0 && (
          <button onClick={handleExportReview} className={`w-12 h-12 ${isDarkMode ? 'bg-[#3d2f1f] text-[#ffcf54]' : 'bg-[#2c2a25] text-[#ffcf54]'} rounded-xl ${isDarkMode ? 'shadow-[4px_4px_0_#00000040]' : 'shadow-[4px_4px_0_rgba(44,42,37,0.3)]'} active:scale-95 transition-all flex items-center justify-center`}>
            <Download size={22} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* THE ALMANAC PAGE */}
      {reviewData && (
        <div ref={reviewRef} className={`w-full max-w-[800px] mx-auto ${theme.taskCardBg} border-[4px] ${theme.taskCardBorder} rounded-[32px] p-6 md:p-12 ${isDarkMode ? 'shadow-[12px_12px_0_#00000060]' : 'shadow-[12px_12px_0_#2c2a25]'} relative flex flex-col items-center transform-gpu overflow-hidden`}>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/lined-paper-2.png')] translate-z-0" />

          {reviewData.logs === 0 ? (
            <div className="py-20 flex flex-col items-center opacity-40">
                <Quote size={48} className={`mb-4 ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'}`} />
                <span className={`font-serif italic text-2xl ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'}`}>A quiet year, yet to be written...</span>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-10 relative z-10">

              {/* STATS GRID */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Logs', value: reviewData.logs, icon: FileText, color: '#ffcf54' },
                  { label: 'Journaled', value: reviewData.journaled, icon: PenTool, color: '#ff6b6b' },
                  { label: 'Peak Rhythm', value: reviewData.bestTime, icon: Activity, color: '#8fb3af' },
                  { label: 'Word Count', value: reviewData.words.toLocaleString(), icon: Target, color: '#a8e6cf' },
                ].map((s, i) => (
                <div key={i} className={`${theme.modalInputBg} border-[2px] ${theme.taskCardBorder} p-4 rounded-2xl flex flex-col items-center ${isDarkMode ? 'shadow-[4px_4px_0_#00000020]' : 'shadow-[4px_4px_0_#2c2a2508]'}`}>
                    <div className={`w-8 h-8 rounded-lg border-[2px] ${theme.taskCardBorder} flex items-center justify-center mb-2 ${theme.taskCardBg}`}>
                      <s.icon size={16} strokeWidth={2.5} style={{ color: s.color }} />
                    </div>
                    <span className={`font-serif font-black text-2xl ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'} leading-none mb-1`}>{s.value}</span>
                    <span className={`font-sans font-black text-[8px] uppercase tracking-widest ${isDarkMode ? 'text-[#fdf8ea]/40' : 'text-[#2c2a25]/40'} text-center`}>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* DYNAMIC TREND CHART */}
              <div className={`w-full ${theme.modalInputBg} border-[3px] ${theme.taskCardBorder} rounded-3xl p-6 ${isDarkMode ? 'shadow-[6px_6px_0_#00000020]' : 'shadow-[6px_6px_0_#2c2a2508]'}`}>
                <div className={`flex items-center justify-between mb-6 border-b-[2px] ${isDarkMode ? 'border-white/5' : 'border-[#2c2a25]/5'} pb-4`}>
                  <span className={`font-serif font-black text-lg uppercase ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'}`}>
                    {showYearReview ? 'Annual Resonance Trend' : 'Monthly Resonance'}
                  </span>
                  <div className="hidden sm:flex gap-3">
                    {MOOD_CONFIG?.map(m => (
                      <div key={m.value} className="flex items-center gap-1.5 opacity-60">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: isDarkMode ? (m.value === 1 ? '#ff8a8a' : (m.value === 2 ? '#ffcf54' : '#82cbfb')) : m.color }} />
                        <span className={`text-[7px] font-black uppercase ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'}`}>{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div 
                  className="w-full overflow-x-auto overflow-y-hidden pb-2" 
                  style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
                >
                  <div className={`flex items-end justify-between h-44 relative px-2 pt-4 ${showYearReview ? 'w-full' : 'min-w-[500px] md:min-w-full'}`}>
                    
                    {/* Baseline */}
                    <div className={`absolute bottom-6 left-0 right-0 h-[2px] ${isDarkMode ? 'bg-[#ffcf54]' : 'bg-[#2c2a25]'}`} />

                    {chartPoints?.map((val, i) => {
                      const hasValue = val !== null && val !== undefined && val > 0;
                      const maxMood = MOOD_CONFIG?.length || 3;
                      
                      const heightPercent = hasValue ? ((val - 1) / (maxMood - 1)) * 85 : 0;
                      
                      return (
                        <div key={i} className="relative flex flex-col items-center justify-end flex-1 h-full group z-10">
                          
                          {/* Bar Stem & Dot */}
                          <div className="h-[calc(100%-1.5rem)] w-full flex flex-col justify-end items-center pb-[2px]">
                            {hasValue && (
                              <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${Math.max(heightPercent, 5)}%` }} 
                                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                                className={`w-full max-w-[10px] ${isDarkMode ? 'bg-white/5' : 'bg-[#2c2a25]/5'} rounded-t-sm relative flex justify-center`}
                              >
                                <div 
                                  className={`absolute -top-2 w-3.5 h-3.5 rounded-full border-[2px] ${theme.taskCardBorder} z-20 transition-transform group-hover:scale-125 shadow-sm`}
                                  style={{ backgroundColor: getMoodColor(val) }}
                                />
                                <div className={`w-[1.5px] h-full ${isDarkMode ? 'bg-[#ffcf54]' : 'bg-[#2c2a25]'} opacity-20`} />
                              </motion.div>
                            )}
                          </div>
                          
                          {/* Labels */}
                          <div className="h-6 flex items-center justify-center mt-auto w-full">
                            {showYearReview ? (
                              <span className={`text-[8px] font-black ${isDarkMode ? 'text-[#fdf8ea]/60' : 'text-[#2c2a25]/60'} uppercase`}>
                                {MONTH_NAMES[i]?.substring(0, 3)}
                              </span>
                            ) : (
                              (i % 3 === 0 || i === 0 || i === chartPoints.length - 1) && (
                                <span className={`text-[7px] font-black ${isDarkMode ? 'text-[#fdf8ea]/40' : 'text-[#2c2a25]/40'}`}>
                                  {i + 1}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}