'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X } from 'lucide-react';
import { playSwooshSound, playSuccessSound, playPopSound } from '../utils/sound';
import { useAppContext } from '../app/context/AppContext';

export default function FutureLetterPopup() {
  const [letter, setLetter] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const { today, loaded, isDarkMode, isPremium } = useAppContext();

  // Colors based on your Gentle Ferry theme
  const theme = {
    bg: isDarkMode ? '#1a1815' : '#fdfaf5', // Dark charcoal or Off-white cream
    border: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#31251c', // Muted white or Dark brown/charcoal
    accent: '#d97757', // Muted terra-cotta/red for the seal
    text: isDarkMode ? '#fdf8ea' : '#31251c',
    shadow: isDarkMode ? 'rgba(0, 0, 0, 0.6)' : '#31251c',
  };

  useEffect(() => {
    if (!loaded) return;

    const timer = setTimeout(() => {
      if (!isPremium) return; // Feature locked for non-pro
      
      const letters = JSON.parse(localStorage.getItem('gentle_ferry_future_letters') || '[]');
      const y = today.getFullYear();
      const m = String(today.getMonth() + 1).padStart(2, '0');
      const d = String(today.getDate()).padStart(2, '0');
      const todayStr = `${y}-${m}-${d}`;

      const dueLetter = letters.find(l => l.deliveryDate <= todayStr && !l.isRead);

      if (dueLetter) {
        setLetter(dueLetter);
        setIsOpen(true);
        playSuccessSound?.();
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [today, loaded, isPremium]);

  const handleReveal = () => {
    playSwooshSound?.();
    setIsRevealed(true);
  };

  const handleClose = () => {
    if (!letter) return;
    const letters = JSON.parse(localStorage.getItem('gentle_ferry_future_letters') || '[]');
    const updatedLetters = letters.map(l => 
      l.id === letter.id ? { ...l, isRead: true, readOnDate: new Date().toISOString().split('T')[0] } : l
    );
    localStorage.setItem('gentle_ferry_future_letters', JSON.stringify(updatedLetters));
    setIsOpen(false);
    playPopSound?.();
  };

  return (
    <AnimatePresence>
      {isOpen && letter && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className={`fixed inset-0 z-[10000] flex items-center justify-center ${isDarkMode ? 'bg-black/80' : 'bg-[#31251c]/40'} backdrop-blur-sm p-4 sm:p-6`}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-full max-w-2xl"
          >
            <AnimatePresence mode="wait">
              {!isRevealed ? (
                /* PHASE 1: BLOCKY INDIE ENVELOPE */
                <motion.div 
                  key="sealed-envelope"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  onClick={handleReveal}
                  className="cursor-pointer group relative mx-auto max-w-md w-full aspect-[4/3] sm:aspect-[3/2]"
                >
                  <div 
                    className={`absolute inset-0 rounded-2xl border-[3px] transition-all duration-300 group-hover:-translate-y-1 overflow-hidden`}
                    style={{ 
                        backgroundColor: theme.bg, 
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#31251c',
                        boxShadow: `8px 8px 0 ${theme.shadow}` 
                    }}
                  >
                    
                    {/* Blocky Envelope Flap */}
                    <div className="absolute top-0 inset-x-0 h-1/2 border-b-[3px] opacity-20" 
                         style={{ 
                            clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                            borderColor: theme.border 
                         }} />
                    
                    {/* Central Seal Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-16 h-16 rounded-xl border-[3px] flex items-center justify-center transition-all`}
                        style={{ 
                            backgroundColor: theme.accent,
                            borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#31251c',
                            boxShadow: `4px 4px 0 ${theme.shadow}`
                        }}
                      >
                        <Mail size={28} className="text-[#fdfaf5]" strokeWidth={2.5} />
                      </motion.div>
                    </div>

                    <div className="absolute bottom-6 inset-x-0 text-center">
                      <p className="font-sans text-xs font-bold tracking-[0.15em] uppercase" style={{ color: theme.text }}>
                        New Letter Arrived
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* PHASE 2: CLEAN BUT BLOCKY LETTER */
                <motion.div 
                  key="revealed-letter"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="w-full"
                >
                  <div 
                    className={`rounded-2xl border-[3px] p-6 sm:p-10 relative flex flex-col`}
                    style={{ 
                        backgroundColor: theme.bg, 
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#31251c',
                        boxShadow: `12px 12px 0 ${theme.shadow}` 
                    }}
                  >
                    
                    {/* Blocky Close Button */}
                    <button 
                       onClick={handleClose}
                       className={`absolute -top-4 -right-4 border-[3px] transition-colors p-2 rounded-xl active:translate-y-1 active:translate-x-1 active:shadow-none z-10`}
                       style={{ 
                           backgroundColor: theme.bg, 
                           borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : '#31251c',
                           color: theme.text,
                           boxShadow: `4px 4px 0 ${theme.shadow}`
                       }}
                       aria-label="Close letter"
                    >
                       <X size={20} strokeWidth={3} />
                    </button>

                    {/* Header Section */}
                    <div className={`mb-6 pb-4 border-b-[3px] flex flex-col sm:flex-row sm:items-end justify-between gap-2`} style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(49, 37, 28, 0.1)' }}>
                       <h2 className="font-serif font-bold text-3xl leading-none" style={{ color: theme.text }}>
                         A note from the past
                       </h2>
                       <p 
                        className="font-sans font-bold text-[10px] uppercase tracking-[0.1em] px-3 py-1.5 rounded-md self-start sm:self-auto border"
                        style={{ 
                            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(49, 37, 28, 0.05)',
                            borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(49, 37, 28, 0.1)',
                            color: isDarkMode ? 'rgba(253, 248, 234, 0.6)' : 'rgba(49, 37, 28, 0.6)'
                        }}
                       >
                         {new Date(Number(letter.id)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                       </p>
                    </div>

                    {/* SCROLLABLE CONTENT AREA - Clean Typography */}
                    <div className="max-h-[50vh] overflow-y-auto custom-scrollbar pr-2 sm:pr-4">
                      <p className="font-serif text-lg sm:text-xl leading-[1.8] whitespace-pre-wrap" style={{ color: theme.text }}>
                         {letter.text}
                      </p>
                    </div>

                    {/* Footer Action */}
                    <div className="mt-8 pt-6 flex justify-end">
                       <button 
                          onClick={handleClose}
                          className="px-8 py-3 font-sans font-bold text-xs tracking-wider uppercase rounded-xl border-[3px] transition-all active:translate-y-1 active:translate-x-1 active:shadow-none"
                          style={{ 
                              backgroundColor: isDarkMode ? '#ffcf54' : '#31251c',
                              color: isDarkMode ? '#1a1815' : '#fdfaf5',
                              borderColor: isDarkMode ? 'transparent' : '#31251c',
                              boxShadow: `4px 4px 0 ${theme.accent}`
                          }}
                       >
                          Tuck away safely
                       </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}