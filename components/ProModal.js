'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles, Shield, Cloud, Zap, Crown, Camera, Mic, Mail, BarChart3, Sun } from 'lucide-react';
import { useAppContext } from '../app/context/AppContext';
import { playPopSound, playSwooshSound } from '../utils/sound';
import Logo from './Logo';

export default function ProModal() {
  const { 
    showProModal, setShowProModal, togglePremium, 
    isDarkMode, hasDriveAccess, setShowDriveModal 
  } = useAppContext();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [step, setStep] = useState('features'); // 'features' or 'success'

  if (!showProModal) return null;

  const features = [
    { 
      title: "Visual Journaling", 
      desc: "Add images to your entries that appear as rich thumbnails in your calendar view.",
      icon: Camera,
      color: "#82cbfb"
    },
    { 
      title: "Audio Reflection", 
      desc: "Record voice notes for your achievements when writing feels like too much.",
      icon: Mic,
      color: "#a8e6cf"
    },
    { 
      title: "Time Capsules", 
      desc: "Write letters to your future self that unlock automatically on specific dates.",
      icon: Mail,
      color: "#ffcf54"
    },
    { 
      title: "Grand Analytics", 
      desc: "Detailed yearly insights to track your long-term mood and habit trends.",
      icon: BarChart3,
      color: "#ff8a8a"
    },
    { 
      title: "Infinite Rhythm", 
      desc: "Remove the 3-habit limit and track every piece of your daily routine.",
      icon: Zap,
      color: "#b46a55"
    },
    { 
      title: "Dark Theme", 
      desc: "Switch to a focused Midnight mode for those late-night reflection sessions.",
      icon: Sun,
      color: "#8e8e93"
    }
  ];

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    playPopSound?.();
    // Proceed to authorization; premium status is granted upon success
    setShowDriveModal(true);
    setShowProModal(false);
    setIsUpgrading(false);
  };

  const handleConnectDrive = () => {
    setShowDriveModal(true);
    setShowProModal(false);
  };

  const handleClose = () => {
    playSwooshSound?.();
    setShowProModal(false);
  };

  return (
    <AnimatePresence>
      {showProModal && (
        <div className="fixed inset-0 z-[11000] flex items-center justify-center p-4 md:p-6 cursor-default">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-[#1b1a17]/90 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full max-w-4xl max-h-[90dvh] flex flex-col ${isDarkMode ? 'bg-[#1a1815]' : 'bg-[#fffcf2]'} border-[3px] ${isDarkMode ? 'border-[#ffcf54]/30' : 'border-[#31251c]'} rounded-2xl overflow-hidden shadow-[20px_20px_0_rgba(0,0,0,0.5)]`}
          >
            {/* Header / Banner */}
            <div className="relative h-32 md:h-48 bg-[#c65f4b] flex flex-col items-center justify-center text-center px-6 shrink-0 overflow-hidden">
               {/* Abstract background shapes */}
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                 className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl text-transparent"
               />
               <motion.div 
                 animate={{ rotate: -360 }}
                 transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                 className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#ffcf54]/20 rounded-full blur-3xl text-transparent"
               />

               <div className="relative z-10 flex flex-col items-center">
                  <Logo size="md" isDarkMode={true} rotate={3} className="mb-4 shadow-[4px_4px_0_#31251c]" />
                  <h2 className="font-serif font-black text-3xl md:text-4xl text-white uppercase tracking-tighter leading-none">
                    Ascend to Pro
                  </h2>
                  <p className="font-sans font-black text-[10px] text-white/80 uppercase tracking-[0.3em] mt-2">
                    Unlock the Full Horizon
                  </p>
               </div>

               <button 
                 onClick={handleClose}
                 className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:rotate-90 transition-all"
               >
                 <X size={24} strokeWidth={3} />
               </button>
            </div>

            {/* Content Container */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col md:flex-row divide-y-[3px] md:divide-y-0 md:divide-x-[3px] border-[#31251c]/5">
               {step === 'features' ? (
                 <>
                   {/* LEFT COL: Features list */}
                   <div className={`flex-1 p-6 md:p-10 ${isDarkMode ? 'bg-white/[0.02]' : 'bg-black/[0.01]'}`}>
                      <div className="grid grid-cols-1 gap-6">
                        {features.map((f, i) => (
                          <div key={i} className="flex gap-4 group">
                             <div 
                               style={{ color: f.color }}
                               className={`shrink-0 w-8 h-8 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-black/5'} flex items-center justify-center border-[2px] ${isDarkMode ? 'border-white/5' : 'border-[#31251c]/5'} group-hover:scale-110 transition-transform`}
                             >
                                <f.icon size={16} strokeWidth={3} />
                             </div>
                             <div className="flex flex-col gap-1">
                                <h4 className={`font-serif font-black text-sm ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#31251c]'} uppercase tracking-tight`}>{f.title}</h4>
                                <p className={`font-sans font-black text-[9px] ${isDarkMode ? 'text-[#fdf8ea]/40' : 'text-[#31251c]/40'} leading-relaxed`}>{f.desc}</p>
                             </div>
                          </div>
                        ))}
                      </div>
                   </div>

                   {/* RIGHT COL: Offer & Action */}
                   <div className="flex-1 p-8 md:p-10 flex flex-col gap-6 justify-center">
                      <div className={`p-6 rounded-xl border-[2.5px] ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-black/5 border-[#31251c]/5'} flex items-center justify-between`}>
                         <div className="flex flex-col">
                            <span className={`font-sans font-black text-[8px] uppercase tracking-widest ${isDarkMode ? 'text-[#fdf8ea]/40' : 'text-[#31251c]/40'}`}>Subscription Plan</span>
                            <span className={`font-serif font-black text-2xl ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#31251c]'} tracking-tighter`}>$3.00 / Lifetime</span>
                         </div>
                         <div className="flex items-center gap-1.5 px-3 py-1 bg-[#a8e6cf] text-[#2c2a25] rounded-full border-[2px] border-[#31251c] shadow-[2px_2px_0_#31251c]">
                            <Check size={10} strokeWidth={4} />
                            <span className="font-sans font-black text-[9px] uppercase tracking-widest">Active Offer</span>
                         </div>
                      </div>

                      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-[#31251c]/10'} border-[2.5px] border-dashed text-left`}>
                         <div className="flex items-center gap-2 mb-1">
                            <Sparkles size={10} className={isDarkMode ? 'text-[#ffcf54]' : 'text-[#c65f4b]'} />
                            <p className={`font-sans font-black text-[7px] md:text-[8px] uppercase tracking-widest ${isDarkMode ? 'text-[#ffcf54]' : 'text-[#c65f4b]'}`}>The Indie Promise</p>
                         </div>
                         <p className={`font-serif italic text-[10px] md:text-[11px] ${isDarkMode ? 'text-[#fdf8ea]/60' : 'text-[#31251c]/60'} leading-relaxed`}>
                            "Why only $3.00? Since you link your own Google Drive, I have zero storage costs. The $3.00 is a tip to keep me caffeinated so I can continue crafting this heirloom. One payment, forever yours."
                         </p>
                      </div>

                      <button
                        onClick={handleUpgrade}
                        disabled={isUpgrading}
                        className="group relative w-full h-16 bg-[#ffcf54] border-[3px] border-[#31251c] rounded-xl flex items-center justify-center gap-3 overflow-hidden shadow-[8px_8px_0_#31251c] hover:-translate-y-1 hover:shadow-[12px_12px_0_#31251c] active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50"
                      >
                         <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                         <Sparkles size={20} className="text-[#31251c]" strokeWidth={3} />
                         <span className="font-serif font-black text-xl text-[#31251c] uppercase tracking-tighter">
                           {isUpgrading ? 'Recording Rank...' : 'Become a Pro Explorer'}
                         </span>
                      </button>

                      <p className={`text-center font-sans font-black text-[8px] uppercase tracking-[0.2em] ${isDarkMode ? 'text-[#fdf8ea]/20' : 'text-[#31251c]/20'}`}>
                        Secure payment processed via Ferry Express
                      </p>
                   </div>
                 </>
               ) : (
                 <div className="w-full flex-1 p-8 md:p-12">
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="flex flex-col items-center text-center gap-6"
                   >
                      <div className="w-20 h-20 bg-[#a8e6cf] border-[3px] border-[#31251c] rounded-full flex items-center justify-center shadow-[6px_6px_0_#31251c]">
                         <Check size={40} className="text-[#31251c]" strokeWidth={4} />
                      </div>
                      
                      <div>
                         <h3 className={`font-serif font-black text-2xl ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#31251c]'} uppercase tracking-tight`}>Welcome, Master Voyager</h3>
                         <p className={`font-sans font-black text-xs ${isDarkMode ? 'text-[#fdf8ea]/60' : 'text-[#31251c]/60'} uppercase tracking-widest mt-2`}>Your rank has been updated across the fleet</p>
                      </div>

                      <div className={`p-6 rounded-xl border-[3px] border-dashed ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-[#31251c]/20'}`}>
                         <p className={`font-serif italic text-base ${isDarkMode ? 'text-[#fdf8ea]/80' : 'text-[#31251c]/80'}`}>
                           "To safeguard your journey's visual memories, we must now prepare your private cloud archives."
                         </p>
                      </div>

                      <button
                        onClick={handleConnectDrive}
                        className="group relative w-full h-16 bg-[#31251c] border-[3px] border-[#31251c] rounded-xl flex items-center justify-center gap-3 overflow-hidden shadow-[8px_8px_0_#ffcf54] hover:-translate-y-1 hover:shadow-[12px_12px_0_#ffcf54] active:translate-y-0.5 active:shadow-none transition-all"
                      >
                         <Shield size={20} className="text-[#ffcf54]" strokeWidth={3} />
                         <span className="font-serif font-black text-xl text-[#ffcf54] uppercase tracking-tighter">
                           Integrate Secure Storage
                         </span>
                      </button>
                      
                      <button 
                        onClick={handleClose}
                        className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-white/20 hover:text-white/60' : 'text-black/20 hover:text-black/60'} transition-colors`}
                      >
                        I'll configure it later
                      </button>
                   </motion.div>
                 </div>
               )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
