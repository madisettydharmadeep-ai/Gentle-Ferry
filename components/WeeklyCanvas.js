'use client';
import { createPortal } from 'react-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, CheckCircle2, Frown, Meh, Smile, Mail, Image as ImageIcon, Heart, Sparkles, Bookmark, Anchor, Compass } from 'lucide-react';
import { playSwooshSound, playTapSound } from '../utils/sound';
import { useAppContext } from '../app/context/AppContext';
import Logo from './Logo';

const MOOD_ICONS = { 1: Frown, 2: Meh, 3: Smile };
const MOOD_COLORS = { 1: '#ff6b6b', 2: '#ffcf54', 3: '#5ba882' };

export default function WeeklyCanvas() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { receipts, today, isDarkMode } = useAppContext();
  const canvasRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => setMounted(true), []);

  const parseReceiptDate = (r) => {
    if (r.date) {
      const d = new Date(r.date);
      if (!isNaN(d.getTime())) return d;
    }
    const timestamp = parseInt(r.id);
    if (!isNaN(timestamp) && timestamp > 1000000000000) {
      return new Date(timestamp);
    }
    return new Date();
  };

  // Today's Date at Midnight
  const todayMidnight = new Date(today);
  todayMidnight.setHours(0, 0, 0, 0);

  // Calculate the START of the current Monday
  const day = today.getDay(); // 0 Sun, 1 Mon
  const diffToLastMonday = (day === 0 ? 6 : day - 1);
  
  const thisMonday = new Date(todayMidnight);
  thisMonday.setDate(todayMidnight.getDate() - diffToLastMonday);
  
  // The Range: Previous Monday (start) to This Monday (end)
  const endOfRange = thisMonday.getTime(); 
  const startOfRange = endOfRange - (7 * 24 * 60 * 60 * 1000);

  // Filter and group by day (Mon -> Sun)
  const dayGroups = {};
  [...(receipts || [])].forEach(r => {
    const rDate = parseReceiptDate(r);
    const rTime = rDate.getTime();
    
    if (rTime >= startOfRange && rTime < endOfRange) {
      const dayKey = rDate.toDateString(); 
      if (r.photo && (!dayGroups[dayKey] || rTime > parseReceiptDate(dayGroups[dayKey]).getTime())) {
        dayGroups[dayKey] = r;
      }
    }
  });

  const photoReceipts = Object.values(dayGroups)
    .sort((a, b) => parseReceiptDate(a).getTime() - parseReceiptDate(b).getTime());

  const weekReceipts = [...(receipts || [])].filter(r => {
    const rTime = parseReceiptDate(r).getTime();
    return rTime >= startOfRange && rTime < endOfRange;
  });

  let totalTasksCompleted = 0;
  let moods = [];
  weekReceipts.forEach(r => {
     if (r.tasks) {
       totalTasksCompleted += r.tasks.filter(t => t.checked).length;
     }
     if (r.mood) moods.push(r.mood);
  });

  const stormCount = moods.filter(m => m === 1).length;
  const sunCount = moods.filter(m => m === 3).length;

  const performExport = async () => {
    try {
      setIsExporting(true);
      await new Promise(res => setTimeout(res, 350));
      const { toPng } = await import('html-to-image');
      const url = await toPng(canvasRef.current, { pixelRatio: 2, backgroundColor: isDarkMode ? '#1a1b1e' : '#fdf8ea' });
      setIsExporting(false);
      const link = document.createElement('a');
      link.download = `weekly-voyage-${Date.now()}.png`;
      link.href = url;
      link.click();
    } catch (e) {
      console.error('Export error:', e);
      setIsExporting(false);
    }
  };

  if (!mounted) return null;

  const content = (
    <div className={`fixed inset-0 z-[9999] flex justify-center bg-black/80 backdrop-blur-xl p-4 sm:p-6 ${isExporting ? 'items-start overflow-auto' : 'items-center'}`}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className={`relative w-full flex flex-col items-center transition-all ${isExporting ? 'max-w-[800px] min-w-[800px]' : 'max-w-5xl max-h-full'}`}
      >
        <div className={`w-full ${isDarkMode ? 'bg-[#1a1b1e] border-white/10' : 'bg-[#fffdfa] border-[#2c2a25]'} border-[3px] shadow-[24px_24px_0_rgba(0,0,0,0.2)] rounded-[32px] flex flex-col relative z-20 ${isExporting ? 'overflow-visible' : 'overflow-hidden max-h-[90vh]'}`}>
          
          <div className="absolute top-5 right-5 md:top-8 md:right-8 z-50">
             <button 
               onClick={() => { playSwooshSound(); setIsOpen(false); }}
               className={`w-10 h-10 flex items-center justify-center rounded-xl border-[3px] transition-all hover:scale-110 active:scale-95 hover:-rotate-12 ${
                 isDarkMode 
                   ? 'bg-[#c65f4b] border-[#1a1b1e] text-white shadow-[4px_4px_0_#000000]' 
                   : 'bg-[#ff6868] border-[#2c2a25] text-white shadow-[4px_4px_0_#2c2a25]'
               } ${isExporting ? 'hidden' : ''}`}
             >
               <X size={22} strokeWidth={3.5} />
             </button>
          </div>

           <div className={`w-full flex-1 flex flex-col ${isExporting ? 'overflow-visible' : 'overflow-y-auto overflow-x-hidden custom-scrollbar overscroll-contain'}`}>
               <div 
                 ref={canvasRef} 
                 className={`w-full relative p-8 md:p-16 flex flex-col items-center transform-gpu ${isExporting ? 'w-[800px] shrink-0' : ''}`}
                 style={{
                   backgroundColor: isDarkMode ? '#1a1b1e' : '#fffdfa',
                   backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
                 }}
               >
                  {/* Header Title */}
                  <div className="w-full flex flex-col items-center mb-16 z-10 relative">
                     <Logo size="md" isDarkMode={isDarkMode} rotate={0} className="mb-6" />
                     <h2 className={`font-serif font-black ${isDarkMode ? 'text-white' : 'text-[#2c2a25]'} text-4xl md:text-5xl uppercase tracking-tighter text-center leading-none`}>
                       Weekly Voyage
                     </h2>
                     <div className={`w-12 h-1 ${isDarkMode ? 'bg-[#ffcf54]' : 'bg-[#c65f4b]'} my-6 rounded-full`} />
                     <div className="flex items-center gap-6">
                        <div className="flex flex-col items-center">
                           <span className={`font-sans font-black text-[10px] uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-[#2c2a25]/40'}`}>Duties</span>
                           <span className={`font-serif text-2xl ${isDarkMode ? 'text-[#ffcf54]' : 'text-[#2c2a25]'}`}>{totalTasksCompleted}</span>
                        </div>
                        <div className={`w-[1px] h-8 ${isDarkMode ? 'bg-white/10' : 'bg-[#2c2a25]/10'}`} />
                        <div className="flex flex-col items-center">
                           <span className={`font-sans font-black text-[10px] uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-[#2c2a25]/40'}`}>Vibe</span>
                           <span className={`font-serif text-2xl ${isDarkMode ? 'text-[#ffcf54]' : 'text-[#2c2a25]'}`}>
                              {stormCount > sunCount ? 'Steady' : sunCount > 0 ? 'Radiant' : 'Calm'}
                           </span>
                        </div>
                     </div>
                  </div>

                  {/* Photos Grid - Clean balanced layout */}
                  <div className="w-full relative mb-16">
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                        {photoReceipts.length > 0 ? (
                           photoReceipts.map((r, i) => (
                                 <motion.div 
                                    key={r.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="relative flex flex-col"
                                 >
                                    <div className={`aspect-[4/5] bg-white border-[2px] ${isDarkMode ? 'border-white/10' : 'border-[#2c2a25]'} overflow-hidden rounded-2xl relative shadow-md group`}>
                                       <img src={r.photo} alt="Memory" className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500" />
                                       
                                       <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                       
                                       <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-black/5 flex items-center gap-2 shadow-sm">
                                          <span className="font-sans font-black text-[9px] uppercase tracking-widest text-black/80">
                                             {parseReceiptDate(r).toLocaleDateString('en-US', { weekday: 'short' })}
                                          </span>
                                       </div>

                                       <div className="absolute bottom-4 left-4 flex items-center">
                                          {r.mood && (
                                             <div 
                                                className="w-8 h-8 rounded-full border-[2px] border-[#2c2a25] shadow-[2px_2px_0_#2c2a25] flex items-center justify-center"
                                                style={{ backgroundColor: MOOD_COLORS[r.mood] || '#ffcf54' }}
                                             >
                                                {(() => {
                                                   const Icon = MOOD_ICONS[r.mood] || Meh;
                                                   return <Icon size={14} strokeWidth={3} className="text-[#2c2a25]" />;
                                                })()}
                                             </div>
                                          )}
                                       </div>
                                    </div>
                                 </motion.div>
                              )
                           )
                        ) : (
                           <div className="col-span-full flex flex-col items-center justify-center opacity-40 py-24 text-center">
                              <Compass size={48} className={`mb-4 ${isDarkMode ? 'text-white' : 'text-[#2c2a25]'}`} strokeWidth={1} />
                              <p className={`font-serif italic text-xl ${isDarkMode ? 'text-white' : 'text-[#2c2a25]'}`}>
                                Your voyage log awaits its first entry.
                              </p>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Captain's Summary */}
                  {weekReceipts.length > 0 && (
                     <div className={`w-full max-w-2xl text-center relative z-10 ${isExporting ? 'mb-8' : ''}`}>
                        <p className={`font-serif italic text-xl md:text-2xl leading-relaxed ${isDarkMode ? 'text-white/80' : 'text-[#2c2a25]/80'}`}>
                           "{stormCount > sunCount ? "While the winds were strong, your steady hand kept the journal true." : sunCount > 0 ? "A week of bright horizons and clear skies. Your progress is monumental." : "A peaceful journey through calm waters, marking each day with purpose."}"
                        </p>
                        <div className={`mt-8 font-sans font-black text-[10px] uppercase tracking-[0.5em] ${isDarkMode ? 'text-white/20' : 'text-[#2c2a25]/20'}`}>
                           End of Voyage Report
                        </div>
                     </div>
                  )}
               </div>

               {/* Export Toolbar */}
               <div className={`w-full ${isDarkMode ? 'bg-[#1a1b1e] border-white/5' : 'bg-white border-[#2c2a25]/5'} border-t p-6 flex justify-between items-center px-10 shrink-0`}>
                  <div className="flex items-center gap-2 opacity-40">
                    <Anchor size={14} className={isDarkMode ? 'text-white' : 'text-black'} />
                    <span className={`font-sans font-black text-[9px] uppercase tracking-[0.3em] ${isDarkMode ? 'text-white' : 'text-black'}`}>
                      Voyage Summary
                    </span>
                  </div>
                  <button 
                    onClick={performExport}
                    className={`flex items-center gap-3 px-6 py-3 ${isDarkMode ? 'bg-[#ffcf54] text-[#1a1b1e]' : 'bg-[#2c2a25] text-white'} rounded-full font-sans font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl`}
                  >
                     <Download size={16} strokeWidth={2.5} /> {isExporting ? 'Drafting...' : 'Export Voyage'}
                  </button>
               </div>
           </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {today.getDay() === 1 && weekReceipts.length > 0 && !isOpen && (
          <motion.button 
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ y: -5, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => { playSwooshSound(); setIsOpen(true); }}
            className={`fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[80] flex items-center justify-center p-4 ${isDarkMode ? 'bg-[#ffcf54]' : 'bg-[#c65f4b]'} rounded-2xl border-[3.5px] border-[#2c2a25] shadow-[8px_8px_0_rgba(0,0,0,0.15)] group`}
            title="A message from the harbor"
          >
             <div className="relative">
                <Mail size={32} strokeWidth={2.5} className={isDarkMode ? "text-[#2c2a25]" : "text-white"} />
                
                {/* Red Wax Seal / Notification Badge */}
                <span className="absolute -top-1 -right-2 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6868] opacity-75"></span>
                  <span className={`relative inline-flex rounded-full h-5 w-5 bg-[#ff6868] border-[2px] ${isDarkMode ? 'border-[#2c2a25]' : 'border-white'}`}></span>
                </span>
             </div>

              <div className="absolute top-1/2 right-[120%] -translate-y-1/2 w-max opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className={`${isDarkMode ? 'bg-[#2c2a25] text-white border-white/10' : 'bg-white text-[#2c2a25] border-[#2c2a25]'} border-[3px] shadow-[4px_4px_0_rgba(0,0,0,0.1)] px-4 py-2 font-sans font-black text-[10px] uppercase tracking-widest rounded-lg`}>
                   Your Weekly Voyage
                </div>
              </div>
          </motion.button>
        )}
      </AnimatePresence>

      {createPortal(
        <AnimatePresence>
          {isOpen && content}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
