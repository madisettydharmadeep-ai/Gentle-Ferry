'use client';
import { motion } from 'framer-motion';
import { Anchor } from 'lucide-react';

export default function Logo({ size = 'md', className = '', isDarkMode = false, rotate = -6 }) {
  const sizes = {
    sm: { container: 'w-10 h-10', icon: 20, border: 'border-[3px]' },
    md: { container: 'w-14 h-14', icon: 28, border: 'border-[4px]' },
    lg: { container: 'w-24 h-24', icon: 48, border: 'border-[5px]' },
    xl: { container: 'w-32 h-32', icon: 64, border: 'border-[6px]' }
  };

  const s = sizes[size] || sizes.md;

  return (
    <motion.div
      initial={{ rotate: rotate - 10, scale: 0.8 }}
      animate={{ rotate: rotate, scale: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
      className={`${s.container} ${isDarkMode ? 'bg-[#ffcf54]' : 'bg-[#c65f4b]'} text-white rounded-[24px] flex items-center justify-center shadow-xl ${s.border} ${isDarkMode ? 'border-[#1e1a1b]' : 'border-white'} ${className}`}
      style={{ rotate: `${rotate}deg` }}
    >
      <Anchor 
        size={s.icon} 
        className={isDarkMode ? 'text-[#2c2a25]' : 'text-white'} 
        strokeWidth={2.5} 
      />
    </motion.div>
  );
}
