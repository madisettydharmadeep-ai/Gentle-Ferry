'use client';
import { motion } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';
import { useAppContext } from '../app/context/AppContext';
import { playTapSound } from '../utils/sound';

export default function ProButton({ className = "", children = "Upgrade to Pro", icon = true }) {
  const { setShowProModal, isDarkMode } = useAppContext();

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95, y: 0 }}
      onClick={(e) => {
        e.stopPropagation();
        if (playTapSound) playTapSound();
        setShowProModal(true);
      }}
      className={`group relative flex items-center gap-2 px-4 py-2 bg-[#ffcf54] border-[2.5px] border-[#2c2a25] rounded-xl shadow-[4px_4px_0_#2c2a25] hover:shadow-[6px_6px_0_#2c2a25] active:shadow-none transition-all ${className}`}
    >
      {icon && <Zap size={14} className="text-[#2c2a25] group-hover:rotate-12 transition-transform" strokeWidth={3} fill="currentColor" />}
      <span className="font-sans font-black text-[10px] uppercase tracking-widest text-[#2c2a25]">
        {children}
      </span>
      
      {/* Sparkle effects on hover */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute -top-1 -right-1"
      >
        <Sparkles size={12} className="text-[#ffcf54] stroke-[#2c2a25] stroke-[2px]" />
      </motion.div>
    </motion.button>
  );
}
