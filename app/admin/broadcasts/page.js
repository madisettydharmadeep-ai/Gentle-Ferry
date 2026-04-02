'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Radio, Ship } from 'lucide-react';
import { useAppContext } from '../../../app/context/AppContext';
import { navbarThemes } from '../../../utils/navbarThemes';
import BroadcastDashboard from '../../../components/BroadcastDashboard';

export default function BroadcastAdminPage() {
  const router = useRouter();
  const { isDarkMode } = useAppContext();
  const theme = isDarkMode ? navbarThemes.dark : navbarThemes.light;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0f1a15]' : 'bg-[#fdfaf5]'} p-4 md:p-8 flex flex-col items-center`}>
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => router.push('/dashboard')}
              className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-[#a8e6cf]/40 hover:text-[#a8e6cf]' : 'text-[#2c2a25]/40 hover:text-[#2c2a25]'} transition-colors w-fit group`}
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Return to Journal
            </button>
            <div className="flex items-center gap-4 mt-2">
              <div className={`p-4 rounded-2xl border-[3px] ${theme.taskCardBorder} ${isDarkMode ? 'bg-[#3d2f1f] text-[#ffcf54]' : 'bg-[#ffcf54] text-[#2c2a25]'} shadow-[4px_4px_0_#00000020]`}>
                <Radio size={24} strokeWidth={3} className="animate-pulse" />
              </div>
              <div>
                <h1 className={`font-serif font-black text-4xl md:text-5xl ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'} uppercase tracking-tight leading-none`}>
                  News Station
                </h1>
                <p className={`font-sans font-black text-[10px] uppercase tracking-[0.3em] ${isDarkMode ? 'text-[#a8e6cf]/40' : 'text-[#2c2a25]/40'} mt-2`}>
                  Broadcast Management Terminal
                </p>
              </div>
            </div>
          </div>

          <div className={`hidden md:flex items-center gap-3 px-6 py-4 rounded-2xl border-[3px] ${theme.taskCardBorder} ${isDarkMode ? 'bg-[#1a2e26]/50' : 'bg-white/50'} backdrop-blur-sm`}>
             <Ship size={20} className={isDarkMode ? 'text-[#a8e6cf]' : 'text-[#c65f4b]'} />
             <div className="flex flex-col">
               <span className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-[#a8e6cf]/40' : 'text-[#2c2a25]/40'}`}>System Status</span>
               <span className={`text-xs font-bold ${isDarkMode ? 'text-[#a8e6cf]' : 'text-[#2c2a25]'}`}>Direct Link Active</span>
             </div>
          </div>
        </div>

        {/* Dashboard Component */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full ${theme.taskCardBg} border-[4px] ${theme.taskCardBorder} rounded-3xl p-6 md:p-8 ${isDarkMode ? 'shadow-[16px_16px_0_#00000060]' : 'shadow-[16px_16px_0_#2c2a25]'} min-h-[600px] flex flex-col`}
        >
          <BroadcastDashboard isDarkMode={isDarkMode} theme={theme} />
        </motion.div>
        
        <p className={`mt-12 text-center text-[10px] font-black uppercase tracking-[0.4em] ${isDarkMode ? 'text-[#a8e6cf]/20' : 'text-[#2c2a25]/20'}`}>
          Gentle Ferry Broadcast Network &copy; 2026
        </p>
      </div>
    </div>
  );
}
