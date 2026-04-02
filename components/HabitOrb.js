'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { ICON_MAP } from '../utils/icons';
import { playTapSound } from '../utils/sound';

export default function HabitOrb({ task, idx, isDarkMode, onToggle, onLongPress }) {
  const [isHovered, setIsHovered] = useState(false);
  const longPressTimer = useRef(null);
  
  const iconData = ICON_MAP[task.iconName] || ICON_MAP['Sparkles'];
  const Icon = iconData.component;

  const handlePointerDown = () => {
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        playTapSound();
        onLongPress(task);
      }, 600);
    }
  };

  const handlePointerUp = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
      }}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className={`absolute -top-16 left-1/2 -translate-x-1/2 px-4 py-3 ${isDarkMode ? 'bg-[#1a1815] border-white/10' : 'bg-white border-[#2c2a25]'} border-[2.5px] rounded-xl shadow-2xl z-[100] w-[200px] text-center pointer-events-none`}
          >
            <span className={`font-serif font-black text-[10px] md:text-[11px] uppercase tracking-tighter ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'} leading-tight block`}>
              {task.text}
            </span>
            <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-r-[2.5px] border-b-[2.5px] ${isDarkMode ? 'bg-[#1a1815] border-white/10' : 'bg-white border-[#2c2a25]'} `} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (longPressTimer.current) clearTimeout(longPressTimer.current);
          onToggle(task.id);
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className={`w-12 h-12 rounded-full border-[3px] flex items-center justify-center relative shadow-[4px_4px_0_#2c2a2510] group transition-all overflow-hidden ${
          task.checked 
            ? (isDarkMode ? 'bg-[#3d2f1f] border-[#ffcf54]' : 'bg-[#ffcf54] border-[#2c2a25]') 
            : (isDarkMode ? 'bg-[#2c2a25] border-white/10 hover:border-[#ffcf54]' : 'bg-white border-[#2c2a25] hover:bg-[#ffcf54]')
        }`}
      >
        <Icon 
          size={20} 
          className={task.checked 
            ? (isDarkMode ? 'text-[#ffcf54]' : 'text-[#2c2a25]') 
            : (isDarkMode ? (isHovered ? 'text-[#ffcf54]' : 'text-white') : 'text-[#2c2a25]')
          } 
          strokeWidth={2.5} 
        />
        
        {/* Shine Effect */}
        {!task.checked && (
          <motion.div
            animate={{
              x: ['-200%', '200%'],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              repeatDelay: 6,
              delay: idx * 0.25,
              ease: "easeInOut",
            }}
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: isDarkMode 
                ? 'linear-gradient(135deg, transparent 35%, rgba(255,255,255,0.4) 50%, transparent 65%)'
                : 'linear-gradient(135deg, transparent 35%, rgba(255, 207, 84, 0.6) 50%, transparent 65%)',
              transform: 'skewX(-20deg)',
            }}
          />
        )}
      </motion.button>
    </div>
  );
}
