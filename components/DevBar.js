'use client';

import { useState } from 'react';
import { useAppContext } from '../app/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, X, RotateCcw, ChevronUp, ChevronDown, Radio } from 'lucide-react';
import Link from 'next/link';

export default function DevBar() {
  const { today, setToday, isPremium, togglePremium, userId, isDarkMode } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  const handleDateChange = (e) => {
    setToday(e.target.value);
  };

  const handlePremiumToggle = async () => {
    const newPremium = !isPremium;
    togglePremium();
    // Sync to DB so it persists
    if (userId) {
      try {
        await fetch('/api/auth/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, settings: { isPremium: newPremium, isDarkMode } })
        });
      } catch(e) { console.error('Dev premium sync failed', e); }
    }
  };

  const resetDate = () => {
    setToday(new Date());
  };

  const formatDateForInput = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  // Show if explicitly enabled via env or localStorage
  const isDevMode = process.env.NEXT_PUBLIC_APP_MODE === 'dev' || 
                   (typeof window !== 'undefined' && localStorage.getItem('gentle_ferry_dev_mode') === 'true');

  if (!isDevMode) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(10px)' }}
            className="pointer-events-auto bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 p-4 rounded-3xl shadow-2xl flex flex-col gap-4 w-64"
          >
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                Dev Controls
              </span>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X size={14} className="text-zinc-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 ml-1">
                  Synthetic Today
                </label>
                <div className="relative group">
                  <input
                    type="date"
                    value={formatDateForInput(today)}
                    onChange={handleDateChange}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-zinc-500/10 transition-all appearance-none"
                  />
                  <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              <button
                onClick={resetDate}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium hover:opacity-90 transition-opacity active:scale-[0.98]"
              >
                <RotateCcw size={12} />
                Reset to System Date
              </button>

              <button
                onClick={handlePremiumToggle}
                className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium transition-all active:scale-[0.98] border ${
                  isPremium 
                    ? 'bg-amber-500 border-amber-600 text-white shadow-[0_4px_0_#d97706]' 
                    : 'bg-zinc-100 border-zinc-200 text-zinc-600'
                }`}
              >
                {isPremium ? 'Premium Active ✓' : 'Enable Premium'}
              </button>

              <Link
                href="/admin/broadcasts"
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 border border-indigo-700 text-white text-xs font-medium hover:bg-indigo-700 transition-colors active:scale-[0.98] shadow-[0_4px_0_#4338ca]"
              >
                <Radio size={12} className="animate-pulse" />
                Manage Broadcasts
              </Link>
            </div>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center px-1">
              <span className="text-[10px] text-zinc-400">
                Current: {new Date(today).toLocaleDateString()}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        layout
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95 group overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? (
          <ChevronDown size={20} className="text-zinc-600 dark:text-zinc-300" />
        ) : (
          <Calendar size={20} className="text-zinc-600 dark:text-zinc-300" />
        )}
      </motion.button>
    </div>
  );
}
