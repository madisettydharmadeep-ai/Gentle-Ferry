'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from './context/AppContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Ship, 
  ArrowRight, 
  Sparkles, 
  Camera, 
  Mic, 
  CalendarDays, 
  LineChart, 
  Newspaper, 
  Mail,
  CheckCircle2,
  Sun,
  TrendingUp,
  BarChart3,
  Clock,
  Zap,
  ShieldCheck,
  HardDrive,
  Type
} from 'lucide-react';
import { playTapSound, playSwooshSound } from '../utils/sound';
import Logo from '../components/Logo';


export default function LandingPage() {
  const { 
    isAuthenticated, loaded, setShowLoginModal, isDarkMode, toggleDarkMode, 
    isPremium, togglePremium, userId, hasDriveAccess, setShowDriveModal,
    setShowProModal
  } = useAppContext();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (loaded && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [loaded, isAuthenticated, router]);

  const handleEnter = () => {
    playSwooshSound();
    playTapSound();
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleUpgrade = async () => {
    playSwooshSound();
    playTapSound();
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    if (!isPremium) {
      setShowProModal(true);
    } else {
      router.push('/dashboard');
    }
  };

  if (!loaded || (mounted && isAuthenticated)) return null;

  return (
    <div className={`relative h-screen overflow-y-auto snap-y snap-mandatory ${isDarkMode ? 'bg-[#1e1a1b] text-[#fffcf2]' : 'bg-[#fffcf2] text-[#2c2a25]'} selection:bg-[#ffcf54] selection:text-[#2c2a25] overflow-x-hidden custom-scrollbar transition-colors duration-700`}>
      
      {/* FLOATING THEME TOGGLE */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => { playTapSound(); toggleDarkMode(); }}
        className={`fixed bottom-8 left-8 z-[100] w-14 h-14 rounded-2xl flex items-center justify-center border-[3px] transition-all shadow-xl hover:scale-110 active:scale-90 ${isDarkMode ? 'bg-[#2c2a25] border-white/10 text-[#ffcf54]' : 'bg-white border-[#2c2a25] text-[#c65f4b]'}`}
      >
        {isDarkMode ? <Sun size={24} strokeWidth={2.5} /> : <Clock size={24} strokeWidth={2.5} />}
      </motion.button>
      
      {/* FIXED TEXTURE OVERLAY */}
      <div className="fixed inset-0 z-[1] opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />

      {/* SIDE NAVIGATION INDICATOR */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-[100] hidden md:flex flex-col gap-4">
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-white/20 border-white/10' : 'bg-[#2c2a25]/20 border-[#2c2a25]/10'} border`} />
        ))}
      </div>

      {/* 1. HERO SECTION - Minimal & Deep (Preserved) */}
      <section className="relative h-screen snap-start flex flex-col items-center justify-center px-6 overflow-hidden">
        <div 
          className={`absolute inset-0 z-0 bg-cover bg-center ${isDarkMode ? 'opacity-35' : 'opacity-70'} transition-all duration-1000`}
          style={{ backgroundImage: `url("/eggs.jpg")`, maskImage: 'radial-gradient(circle, black, transparent 80%)' }} 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          <div className={`flex items-center gap-3 px-5 py-2 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-[#2c2a25]/5 border-[#2c2a25]/10'} border rounded-full mb-8 backdrop-blur-sm`}>
            <Sparkles size={14} className={isDarkMode ? "text-[#ffcf54]" : "text-[#c65f4b]"} />
            <span className={`font-sans font-black text-[9px] uppercase tracking-[0.5em] ${isDarkMode ? 'text-[#ffcf54]' : 'text-[#c65f4b]'}`}>The Ferry Chronicles 2026</span>
          </div>

          <Logo size="lg" isDarkMode={isDarkMode} className="mb-6" />


          <h1 className={`font-serif font-black text-5xl md:text-9xl ${isDarkMode ? 'text-white' : 'text-[#2c2a25]'} uppercase tracking-tighter leading-[0.8] mb-6 md:mb-8`}>
            Gentle<br/><span className={`${isDarkMode ? 'text-[#ffcf54]' : 'text-[#c65f4b]'} italic text-6xl md:text-8xl`}>Ferry</span>
          </h1>

          <p className={`font-sans font-medium ${isDarkMode ? 'text-[#fffcf2]/60' : 'text-[#2c2a25]/60'} text-[10px] md:text-base uppercase tracking-[0.4em] max-w-xs md:max-w-xl mb-10 md:mb-12 leading-relaxed`}>
            <span className={`${isDarkMode ? 'text-white' : 'text-[#2c2a25]'} `}>A calm harbor for your daily work.</span>
          </p>

          <button 
            onClick={handleEnter}
            className={`group flex items-center gap-6 ${isDarkMode ? 'bg-[#ffcf54] text-[#2c2a25]' : 'bg-[#2c2a25] text-white'} pl-8 pr-4 py-4 rounded-full transition-all hover:scale-105 active:scale-95 shadow-2xl`}
          >
            <span className="font-sans font-black text-sm uppercase tracking-widest">Board the Ferry</span>
            <div className={`${isDarkMode ? 'bg-[#2c2a25] text-white' : 'bg-[#ffcf54] text-[#2c2a25]'} p-2 rounded-full group-hover:translate-x-1 transition-transform`}>
                <ArrowRight size={20} strokeWidth={3} />
            </div>
          </button>
        </motion.div>
      </section>

      {/* 2. THE RHYTHM (Habits & Journaling) - Compact Single Viewport */}
      <section className={`relative h-screen snap-start flex flex-col items-center justify-start pt-20 md:pt-12 px-6 overflow-hidden ${isDarkMode ? 'bg-[#1e1a1b]' : 'bg-[#fffcf2]'}`}>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[1000px] h-[300px] md:h-[1000px] ${isDarkMode ? 'bg-[#ff6b6b]/5' : 'bg-[#c65f4b]/5'} blur-[120px] md:blur-[200px] rounded-full pointer-events-none`} />
        
        <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10 w-full text-center">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-12 md:mb-10"
            >
                <div className={`inline-block px-4 py-1 ${isDarkMode ? 'bg-[#ff6b6b]/10 border-[#ff6b6b]/20 text-[#ff6b6b]' : 'bg-[#c65f4b]/10 border-[#c65f4b]/20 text-[#c65f4b]'} border rounded-full mb-6 italic font-serif text-xs md:text-sm uppercase tracking-widest`}>
                  Do the work.
                </div>
                <h2 className={`font-serif text-4xl md:text-8xl font-black ${isDarkMode ? 'text-white' : 'text-[#2c2a25]'} leading-[0.85] tracking-tighter uppercase mb-6 md:mb-8`}>
                    <span className={`italic ${isDarkMode ? 'text-[#ff6b6b]' : 'text-[#c65f4b]'} text-3xl md:text-7xl`}>Today, Daily, Weekdays, or Weekends.</span>
                </h2>
                {/* <p className={`font-sans text-[10px] md:text-sm ${isDarkMode ? 'text-[#fffcf2]/40' : 'text-[#2c2a25]/40'} uppercase tracking-[0.4em] font-black max-w-xl mx-auto leading-relaxed`}>
                   Simple duties for today, or recurring rituals that <span className={isDarkMode ? 'text-white' : 'text-[#2c2a25]'}>follow your rhythm</span> through the week.
                </p> */}
            </motion.div>

            {/* OVERFLOWING PREVIEW PORTAL */}
            <motion.div 
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative w-full max-w-3xl -mb-24 md:-mb-28"
            >
                {/* Floating Quill Accent - Repositioned for tight layout */}
                <motion.div 
                    animate={{ y: [0, -10, 0], rotate: [12, 15, 12] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -top-12 right-10 w-16 h-16 bg-[#ffcf54] rounded-2xl border-[4px] border-[#1e1a1b] shadow-2xl flex items-center justify-center z-20"
                >
                    <Ship size={32} className="text-[#2c2a25]" />
                </motion.div>

                {/* Window Frame with Half-Hidden Crop */}
                <div className={`relative ${isDarkMode ? 'bg-[#1e1a1b]' : 'bg-[#fffcf2]'} rounded-t-[32px] md:rounded-t-[60px] p-2 md:p-4 border-t-[8px] border-x-[8px] ${isDarkMode ? 'border-[#2c2a25]' : 'border-[#d1ccbf]'} shadow-[0_-20px_100px_rgba(0,0,0,0.4)] overflow-hidden`}>
                    {/* Toolbar */}
                    <div className={`flex items-center justify-between px-8 py-4 border-b-[3px] ${isDarkMode ? 'border-[#2c2a25] bg-[#1a1815] text-[#fdf8ea]' : 'border-[#d1ccbf] bg-white text-[#2c2a25]'} rounded-t-[24px] md:rounded-t-[48px]`}>
                        {/* <div className="flex gap-2">
                          {[1,2,3].map(i => <div key={i} className={`w-3 h-3 rounded-full border-[2px] ${isDarkMode ? 'border-white/10' : 'border-[#d1ccbf]'}`} />)}
                        </div> */}
                        <span className={`font-sans font-black text-[10px] uppercase tracking-[0.4em] ${isDarkMode ? 'opacity-20' : 'opacity-30'}`}>Active Ferry Logs</span>
                        <div className="w-10" />
                    </div>

                    {/* Masked Image - 60% visibility portal effect */}
                    <div className="aspect-[2/3] md:aspect-[4/3] relative overflow-hidden bg-[#2c2a25] flex justify-center">
                        <img 
                            src={isDarkMode ? "/dashboard-mobile-dark.png" : "/dashboard-mobile.png"} 
                            alt="Dashboard Mobile"
                            className="md:hidden w-full h-full object-cover object-top shadow-inner"
                        />
                        <img 
                            src={isDarkMode ? "/dashboard-dark.png" : "/dashboard.png"} 
                            alt="Dashboard Desktop"
                            className="hidden md:block w-full h-full object-contain object-top shadow-inner"
                        />
                        <div className={`absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t ${isDarkMode ? 'from-[#1e1a1b]' : 'from-[#fffcf2]'} to-transparent pointer-events-none`} />
                    </div>
                </div>
            </motion.div>
        </div>
      </section>

      {/* 2.5 THE REFLECTION (Journaling) */}
      <section className={`relative h-screen snap-start flex flex-col items-center justify-start md:justify-center pt-12 md:pt-0 px-6 ${isDarkMode ? 'bg-[#1e1a1b]' : 'bg-[#fffcf2]'} overflow-hidden transition-colors duration-700`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] opacity-[0.02] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-between md:justify-center h-full pt-8 pb-0 md:py-0 relative z-10 w-full text-center">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-4 relative"
            >
                {/* Standardized Accent Icons */}
                <div
                  className={`absolute -top-6 -left-8 md:-top-10 md:-left-16 w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center border-[2px] shadow-lg z-20 ${isDarkMode ? 'bg-[#ff6b6b] border-[#1e1a1b] text-white' : 'bg-[#c65f4b] border-white text-white'}`}
                >
                  <Camera size={14} className="md:w-6 md:h-6" strokeWidth={2.5} />
                </div>

                <div
                  className={`absolute -bottom-2 -right-4 md:-bottom-6 md:-right-12 w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center border-[2px] shadow-lg z-20 bg-[#ffcf54] ${isDarkMode ? 'border-[#1e1a1b]' : 'border-white'} text-[#2c2a25]`}
                >
                  <Mic size={14} className="md:w-6 md:h-6" strokeWidth={2.5} />
                </div>

                <div
                  className={`absolute top-0 -right-8 md:top-2 md:-right-20 w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center border-[2px] shadow-lg z-20 ${isDarkMode ? 'bg-[#ff6b6b] border-[#1e1a1b] text-white' : 'bg-[#c65f4b] border-white text-white'}`}
                >
                  <Type size={14} className="md:w-6 md:h-6" strokeWidth={2.5} />
                </div>

                <h2 className={`font-serif text-4xl md:text-8xl font-black ${isDarkMode ? 'text-white' : 'text-[#2c2a25]'} leading-[0.85] tracking-tighter uppercase mb-2`}>
                    Seal the<br/><span className={`italic ${isDarkMode ? 'text-[#ff6b6b]' : 'text-[#c65f4b]'} text-3xl md:text-7xl`}>memories.</span>
                </h2>
            </motion.div>

            {/* BOTTOM DOCKED PREVIEW */}
            <motion.div 
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative w-full mt-12 max-w-2xl md:translate-y-0"
            >
                <div className={`relative overflow-hidden rounded-t-[32px] md:rounded-[48px] border-t-[4px] border-x-[4px] md:border-[8px] ${isDarkMode ? 'border-[#2c2a25]' : 'border-[#d1ccbf]'} drop-shadow-[0_-20px_60px_rgba(0,0,0,0.4)] max-h-[95vh] md:max-h-none`}>
                    <img 
                        src={isDarkMode ? "/journal-mobile-dark.png" : "/journal-mobile.png"} 
                        alt="Journal Entry Mobile"
                        className="md:hidden w-full h-auto object-cover object-top"
                    />
                    <img 
                        src={isDarkMode ? "/journal-dark.png" : "/journal.png"} 
                        alt="Journal Entry Desktop"
                        className="hidden md:block w-full h-auto max-h-[45vh] object-cover"
                    />
                    {/* Portal fade gradient for mobile */}
                    <div className={`md:hidden absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t ${isDarkMode ? 'from-[#1e1a1b]' : 'from-[#fffcf2]'} to-transparent pointer-events-none`} />
                </div>
            </motion.div>
        </div>
      </section>

      {/* 3. THE ARCHIVE (Calendar & Analytics) */}
      <section className={`relative h-screen snap-start flex items-center justify-center px-6 ${isDarkMode ? 'bg-[#262123]' : 'bg-[#f7f3e8]'} overflow-hidden transition-colors duration-700`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-[0.03] pointer-events-none" />
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${isDarkMode ? 'bg-[#ffcf54]' : 'bg-[#c65f4b]'} opacity-[0.02] blur-[120px] rounded-full pointer-events-none`} />
        
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-24 relative z-10 w-full">
            {/* LEFT SIDE: TEXT CONTENT */}
            <motion.div 
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
               className="flex-1 text-center lg:text-left"
            >
                <div className={`w-12 md:w-16 h-1 ${isDarkMode ? 'bg-[#ffcf54]' : 'bg-[#c65f4b]'} rounded-full mb-6 md:mb-10 mx-auto lg:mx-0`} />
                <h2 className={`font-serif text-3xl md:text-7xl font-black ${isDarkMode ? 'text-white' : 'text-[#2c2a25]'} leading-[0.9] mb-4 md:mb-8 tracking-tighter uppercase`}>
                    Your life,<br/><span className={`italic ${isDarkMode ? 'text-[#ffcf54]' : 'text-[#c65f4b]'} text-2xl md:text-6xl`}>mapped in ink.</span>
                </h2>
                <p className={`font-sans text-sm md:text-lg ${isDarkMode ? 'text-[#fffcf2]/70' : 'text-[#2c2a25]/70'} leading-relaxed mb-6 md:mb-10 max-w-sm mx-auto lg:mx-0`}>
                    Step back and view the tapestry of your days. Every entry, sunset, and milestone organized in a timeless visual gallery.
                </p>
                <div className="flex flex-col gap-3 text-center lg:text-left items-center lg:items-start shrink-0">
                  <div className="flex items-center gap-3 text-[#ffcf54] font-sans font-black text-[8px] md:text-[10px] uppercase tracking-widest leading-none">
                    <CalendarDays size={12} className="md:w-4 md:h-4" /> Chronological Flow
                  </div>
                  <div className={`flex items-center gap-3 ${isDarkMode ? 'text-white/40' : 'text-[#2c2a25]/40'} font-sans font-black text-[8px] md:text-[10px] uppercase tracking-widest leading-none`}>
                    <Camera size={12} className="md:w-4 md:h-4" /> Visual Milestones
                  </div>
                </div>
            </motion.div>

            {/* RIGHT SIDE: RAW IMAGE PREVIEW (No Containers) */}
            <motion.div 
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="flex-1 w-full flex items-center justify-center lg:justify-end"
            >
                <img 
                    src={isDarkMode ? "/calender-dark.png" : "/calender.png"} 
                    alt="Archive Gallery"
                    className="w-full h-auto max-h-[80vh] object-contain drop-shadow-[20px_20px_50px_rgba(0,0,0,0.5)] rounded-2xl md:rounded-[32px]"
                />
            </motion.div>
        </div>
      </section>

      {/* 4. THE RITUAL (Newspaper & Letters) */}
      <section className={`relative h-screen snap-start flex items-center justify-center px-6 ${isDarkMode ? 'bg-[#262123]' : 'bg-[#f7f3e8]'} overflow-hidden transition-colors duration-700`}>
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${isDarkMode ? 'bg-[#ffcf54]' : 'bg-[#c65f4b]'} opacity-[0.03] blur-[120px] rounded-full pointer-events-none`} />
        
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-24 relative z-10 w-full">
            {/* LEFT SIDE: RAW IMAGE PREVIEW (news.png) */}
            <motion.div 
               initial={{ opacity: 0, x: -40 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 1.2, ease: "easeOut" }}
               className="flex-1 w-full flex items-center justify-center lg:justify-start"
            >
                <img 
                    src={isDarkMode ? "/news-dark.png" : "/news.png"} 
                    alt="Daily Post Preview"
                    className="w-full h-auto max-h-[75vh] object-contain drop-shadow-[-20px_20px_50px_rgba(0,0,0,0.5)] rounded-2xl md:rounded-[32px]"
                />
            </motion.div>

            {/* RIGHT SIDE: TEXT CONTENT */}
            <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex-1 text-center lg:text-left"
            >
                <div className={`w-12 md:w-16 h-1 ${isDarkMode ? 'bg-[#ffcf54]' : 'bg-[#c65f4b]'} rounded-full mb-6 md:mb-10 mx-auto lg:mx-0`} />
                <h2 className={`font-serif text-3xl md:text-6xl font-black ${isDarkMode ? 'text-white' : 'text-[#2c2a25]'} leading-[0.9] mb-4 md:mb-8 tracking-tighter uppercase`}>
                    Nice simple things<br/><span className={`italic ${isDarkMode ? 'text-[#ffcf54]' : 'text-[#c65f4b]'} text-2xl md:text-5xl`}>regularly delivered.</span>
                </h2>
                <p className={`font-sans text-sm md:text-lg ${isDarkMode ? 'text-[#fffcf2]/70' : 'text-[#2c2a25]/70'} leading-relaxed mb-6 md:mb-10 max-w-sm mx-auto lg:mx-0`}>
                    Hand-curated joys and simple facts. Personally shared by the developer to brighten your daily voyage.
                </p>
                <div className="flex flex-col gap-3 text-center lg:text-left items-center lg:items-start shrink-0">
                  <div className="flex items-center gap-3 text-[#ffcf54] font-sans font-black text-[8px] md:text-[10px] uppercase tracking-widest leading-none">
                    <Sun size={12} className="md:w-4 md:h-4" /> Real-time Weather
                  </div>
                  <div className={`flex items-center gap-3 ${isDarkMode ? 'text-white/40' : 'text-[#2c2a25]/40'} font-sans font-black text-[8px] md:text-[10px] uppercase tracking-widest leading-none`}>
                    <Sparkles size={12} className="md:w-4 md:h-4" /> Seasonal Resonance
                  </div>
                </div>
            </motion.div>
        </div>
      </section>

      {/* 5. THE PULSE (Analytics) */}
      <section className={`relative h-screen snap-start flex items-center justify-center px-6 ${isDarkMode ? 'bg-[#1e1a1b]' : 'bg-[#fffcf2]'} overflow-hidden transition-colors duration-700`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-[0.03] pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-[#ffcf54] opacity-[0.02] blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10 w-full">
            {/* TOP: TEXT CONTENT */}
            <motion.div 
               initial={{ opacity: 0, y: -20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="text-center mb-8 md:mb-12"
            >
                <div className={`w-12 md:w-16 h-1 ${isDarkMode ? 'bg-[#34d399]' : 'bg-[#5ba882]'} rounded-full mb-6 mx-auto`} />
                <h2 className={`font-serif text-4xl md:text-8xl font-black ${isDarkMode ? 'text-white' : 'text-[#2c2a25]'} leading-[0.85] mb-4 tracking-tighter uppercase`}>
                    The Life<br/><span className={`italic ${isDarkMode ? 'text-[#34d399]' : 'text-[#5ba882]'} text-3xl md:text-7xl`}>Pulse.</span>
                </h2>
                <p className={`font-sans text-xs md:text-base ${isDarkMode ? 'text-[#fffcf2]/50' : 'text-[#2c2a25]/50'} leading-relaxed max-w-xl mx-auto uppercase tracking-widest font-bold`}>
                    Analytics designed for reflection, not optimization.
                </p>
            </motion.div>

            {/* BOTTOM: ANALYTICS VISUAL (Raw, no container) */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
                className="w-full max-w-5xl mx-auto"
            >
                {/* Simple Artisan Stick Chart */}
                <div className="h-64 w-full relative flex gap-4 md:gap-8 px-4">
                    {/* Y-Axis Labels */}
                    <div className="flex flex-col justify-between py-[2px] shrink-0 h-full text-right relative z-20">
                        {['High', 'Mid', 'Low'].map(label => (
                            <span key={label} className={`font-sans font-black text-[8px] md:text-[10px] uppercase tracking-widest ${isDarkMode ? 'text-[#ffcf54]/30' : 'text-[#c65f4b]/40'} leading-none`}>
                                {label}
                            </span>
                        ))}
                    </div>

                    {/* Chart Area */}
                    <div className="flex-1 flex items-end justify-between h-full relative group/chart">
                        {/* Horizontal Guide Lines - Precisely Aligned */}
                        <div className={`absolute top-[5%] left-0 right-0 h-px ${isDarkMode ? 'bg-white/[0.05]' : 'bg-[#2c2a25]/[0.1]'} z-0`} />
                        <div className={`absolute top-[50%] left-0 right-0 h-px ${isDarkMode ? 'bg-white/[0.05]' : 'bg-[#2c2a25]/[0.1]'} z-0`} />
                        <div className={`absolute top-[95%] left-0 right-0 h-px ${isDarkMode ? 'bg-white/[0.05]' : 'bg-[#2c2a25]/[0.1]'} z-0`} />
                        
                        {[
                            {v: 0.45, c: '#ffcf54'}, {v: 0.9, c: '#34d399'}, {v: 0.45, c: '#ffcf54'}, {v: 0, c: '#ff6b6b'}, 
                            {v: 0.9, c: '#34d399'}, {v: 0.45, c: '#ffcf54'}, {v: 0.9, c: '#34d399'}, {v: 0.45, c: '#ffcf54'}, 
                            {v: 0, c: '#ff6b6b'}, {v: 0.45, c: '#ffcf54'}, {v: 0.9, c: '#34d399'}, {v: 0.45, c: '#ffcf54'}, 
                            {v: 0, c: '#ff6b6b'}, {v: 0.45, c: '#ffcf54'}, {v: 0, c: '#ff6b6b'}, {v: 0.9, c: '#34d399'}, 
                            {v: 0.9, c: '#34d399'}, {v: 0.45, c: '#ffcf54'}, {v: 0, c: '#ff6b6b'}, {v: 0.9, c: '#34d399'},
                            {v: 0.45, c: '#ffcf54'}, {v: 0.9, c: '#34d399'}, {v: 0.45, c: '#ffcf54'}, {v: 0, c: '#ff6b6b'}, 
                            {v: 0.9, c: '#34d399'}, {v: 0.45, c: '#ffcf54'}, {v: 0.9, c: '#34d399'}, {v: 0.45, c: '#ffcf54'}, 
                            {v: 0, c: '#ff6b6b'}, {v: 0.45, c: '#ffcf54'}, {v: 0.9, c: '#34d399'}, {v: 0.45, c: '#ffcf54'}, 
                            {v: 0, c: '#ff6b6b'}, {v: 0.45, c: '#ffcf54'}, {v: 0, c: '#ff6b6b'}, {v: 0.9, c: '#34d399'}, 
                            {v: 0.9, c: '#34d399'}, {v: 0.45, c: '#ffcf54'}, {v: 0, c: '#ff6b6b'}, {v: 0.9, c: '#34d399'}
                        ].map((data, i) => (
                            <div 
                                key={i} 
                                className={`relative flex-col items-center justify-end flex-1 h-full z-10 px-[1px] md:px-0.5 ${i % 2 !== 0 ? 'hidden md:flex' : 'flex'}`}
                            >
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    whileInView={{ height: `${data.v * 100}%`, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ 
                                        duration: 0.8, 
                                        delay: i * 0.015,
                                        ease: [0.16, 1, 0.3, 1]
                                    }}
                                    className={`w-[1px] ${isDarkMode ? 'bg-white/[0.15]' : 'bg-[#2c2a25]/[0.15]'} relative flex justify-center`}
                                >
                                    <div 
                                        className="absolute -top-[4px] w-2 md:w-2.5 h-2 md:h-2.5 rounded-full border-[1.5px] border-[#1e1a1b] shadow-xl" 
                                        style={{ backgroundColor: data.c }}
                                    />
                                </motion.div>
                                <div className="h-[5%]" />
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
      </section>

      {/* 6. THE PRICING (Pro vs Free) */}
      <section className={`relative min-h-screen md:h-screen snap-start flex items-center justify-center py-20 md:py-0 px-6 ${isDarkMode ? 'bg-[#1e1a1b]' : 'bg-[#fffcf2]'} overflow-x-hidden transition-colors duration-700`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] opacity-[0.02] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto w-full relative z-10 lg:scale-100 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-6 md:mb-8"
          >
            {/* <div className={`inline-block px-4 py-1 ${isDarkMode ? 'bg-[#ffcf54]/10 border-[#ffcf54]/20 text-[#ffcf54]' : 'bg-[#c65f4b]/10 border-[#c65f4b]/20 text-[#c65f4b]'} border rounded-full mb-3 italic font-serif text-xs md:text-sm uppercase tracking-widest`}>
              The Master's Voyage
            </div> */}
            <h2 className={`font-serif text-3xl md:text-6xl font-black ${isDarkMode ? 'text-white' : 'text-[#2c2a25]'} leading-[0.85] tracking-tighter uppercase`}>
              Choose your <br/><span className={`italic ${isDarkMode ? 'text-[#ffcf54]' : 'text-[#c65f4b]'} text-2xl md:text-5xl`}>Life's Format.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-4 lg:gap-8 max-w-6xl mx-auto items-stretch">
            {/* FREE TIER */}
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               className={`md:col-span-1 order-2 md:order-1 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-[#2c2a25]/20'} border-[3px] p-5 rounded-[24px] md:rounded-[32px] flex flex-col items-start relative group overflow-hidden`}
            >
              <div className="flex flex-col mb-4 md:mb-6">
                <h3 className={`font-serif text-3xl md:text-5xl ${isDarkMode ? 'text-white' : 'text-[#2c2a25]'} leading-none mb-2`}>Free Forever</h3>
                <p className={`font-sans text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-[#2c2a25]/40'}`}>Traveler Edition</p>
              </div>

              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6 w-full">
                {[
                  { text: 'Journaling' },
                  { text: 'Mood Tracking' },
                  { text: 'Plan Next Day' },
                  { text: '3 Habits' },
                  { text: 'Month Wise Analytics' },
                ].map((feature, i) => (
                  <div key={i} className={`flex items-center gap-2 font-sans text-[9px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-white/60' : 'text-[#2c2a25]/60'}`}>
                    <CheckCircle2 size={12} className="text-[#34d399] shrink-0" />
                    {feature.text}
                  </div>
                ))}
              </div>

              <button 
                onClick={handleEnter}
                className={`mt-auto w-full py-3 rounded-xl border-2 ${isDarkMode ? 'border-white/10 text-white hover:bg-white hover:text-[#1e1a1b]' : 'border-[#2c2a25]/20 text-[#2c2a25] hover:bg-[#2c2a25] hover:text-white'} font-sans uppercase transition-all flex flex-col items-center leading-tight`}
              >
                <span className="text-[11px] md:text-[13px] font-black tracking-widest leading-none">Free Forever</span>
                <span className="text-[8px] opacity-60 uppercase mt-1">Start Now</span>
              </button>
            </motion.div>

            {/* PRO TIER */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className={`md:col-span-3 order-1 md:order-2 ${isDarkMode ? 'bg-[#ffcf54] border-[#2c2a25]' : 'bg-white border-[#c65f4b]'} border-[4px] p-5 md:p-8 rounded-[24px] md:rounded-[40px] flex flex-col items-start relative shadow-[12px_12px_0_rgba(0,0,0,0.1)] group`}
            >
              <div className={`absolute -top-3 -right-3 ${isDarkMode ? 'bg-[#ff6b6b]' : 'bg-[#c65f4b]'} text-white px-4 py-2 rounded-lg border-[2.5px] border-[#2c2a25] font-sans font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-lg -rotate-3 group-hover:rotate-0 transition-transform z-10`}>
                LIFETIME MASTER VOYAGE
              </div>
              <div className="flex items-center gap-6 mb-8 w-full">
                 <div className="flex flex-col">
                   <h3 className="font-serif text-5xl md:text-7xl text-[#2c2a25] leading-none">$3.00</h3>
                   <div className="flex items-center gap-3 mt-2">
                      <p className="font-sans text-[11px] font-black uppercase tracking-widest text-[#2c2a25]">Master's Upgrade</p>
                      <span className="w-1 h-1 rounded-full bg-[#2c2a25]/20" />
                      <p className="font-sans text-[10px] font-bold text-[#2c2a25]/40 italic">Includes everything in Traveler +</p>
                   </div>
                 </div>
                 <div className="ml-auto hidden md:flex w-16 h-16 rounded-2xl bg-[#2c2a25] items-center justify-center shadow-lg shrink-0">
                    <Zap size={32} className="text-[#ffcf54]" fill="currentColor" />
                 </div>
              </div>

              <div className="grid md:grid-cols-2 gap-x-12 gap-y-3 md:gap-y-4 w-full mb-4 md:mb-6">
                {[
                  { title: 'Visual Journaling', desc: 'Add images to your entries that appear as rich thumbails in your calendar view.', icon: Camera },
                  { title: 'Audio Reflection', desc: 'Record voice notes for your achievements when writing feels like too much.', icon: Mic },
                  { title: 'Time Capsules', desc: 'Write letters to your future self that unlock automatically on specific dates.', icon: Mail },
                  { title: 'Grand Analytics', desc: 'Detailed yearly insights to track your long-term mood and habit trends.', icon: BarChart3 },
                  { title: 'Infinite Rhythm', desc: 'Remove the 3-habit limit and track every piece of your daily routine.', icon: Zap },
                  { title: 'Dark Theme', desc: 'Switch to a focused Midnight mode for those late-night reflection sessions.', icon: Sun },
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4 group/item">
                    <div className="mt-1 w-8 h-8 rounded-lg bg-black/5 border border-[#2c2a25]/10 flex items-center justify-center shrink-0 group-hover/item:bg-[#2c2a25] group-hover/item:text-[#ffcf54] transition-all">
                       <feature.icon size={16} color='black' />
                    </div>
                    <div>
                      <h4 className="font-sans font-black text-[11px] uppercase tracking-wider text-[#2c2a25]">{feature.title}</h4>
                      <p className="font-sans text-[9px] font-bold text-[#2c2a25]/50 leading-tight mt-0.5">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* FOOTER AREA OF PRO CARD */}
              <div className="mt-8 w-full grid md:grid-cols-2 gap-4 md:gap-6 pt-6 border-t border-[#2c2a25]/10">
                 <div className="flex items-center gap-3 bg-[#2c2a25]/5 p-3 md:p-4 rounded-2xl border border-[#2c2a25]/5">
                    <div className="w-10 h-10 bg-[#a8e6cf] border-[2px] border-[#2c2a25] rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      <HardDrive size={20} className="text-[#2c2a25]" />
                    </div>
                    <div>
                      <p className="font-sans font-black text-[9px] uppercase tracking-widest text-[#2c2a25]">Storage Safety</p>
                      <p className="font-sans text-[8px] font-bold text-[#2c2a25]/60 leading-tight">Private Google Drive storage for total privacy.</p>
                    </div>
                 </div>

                 <button 
                  onClick={handleUpgrade}
                  className="w-full py-4 rounded-2xl bg-[#2c2a25] text-[#ffcf54] font-sans font-black text-[11px] md:text-[13px] uppercase tracking-[0.2em] md:tracking-[0.4em] shadow-[8px_8px_0_rgba(44,42,37,0.1)] hover:-translate-y-1 hover:shadow-[12px_12px_0_rgba(44,42,37,0.1)] active:translate-y-0 active:shadow-none transition-all flex flex-col items-center justify-center leading-tight group"
                >
                  <span className="text-[12px] md:text-[15px] font-black tracking-widest leading-none">$3.00 Lifetime Access</span>
                  <span className="flex items-center gap-2 text-[9px] opacity-60 uppercase mt-1">Upgrade Now <ArrowRight size={10} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" /></span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className={`relative h-screen snap-start flex flex-col items-center justify-center px-6 overflow-hidden ${isDarkMode ? 'bg-[#262123]' : 'bg-[#f7f3e8]'} transition-colors duration-700`}>
        <div className={`absolute inset-0 bg-gradient-to-b ${isDarkMode ? 'from-[#1e1a1b]' : 'from-[#fffcf2]'} to-transparent opacity-50`} />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 flex-1 flex flex-col items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
                <div className={`w-20 h-[2px] ${isDarkMode ? 'bg-white/10' : 'bg-[#2c2a25]/10'} mx-auto mb-12`} />
                <h2 className={`font-serif text-4xl md:text-8xl font-black ${isDarkMode ? 'text-white' : 'text-[#2c2a25]'} tracking-tighter uppercase leading-[0.8] mb-8 md:mb-12`}>
                    Begin your <br/><span className={`italic ${isDarkMode ? 'text-[#ffcf54]' : 'text-[#c65f4b]'} text-3xl md:text-7xl`}>Voyage.</span>
                </h2>
                <button 
                    onClick={handleEnter}
                    className={`group relative inline-flex items-center gap-4 md:gap-6 bg-transparent border-2 ${isDarkMode ? 'border-[#ffcf54] text-[#ffcf54]' : 'border-[#c65f4b] text-[#c65f4b]'} px-8 md:px-12 py-4 md:py-6 rounded-full font-sans font-black text-sm md:text-xl uppercase tracking-[0.2em] md:tracking-[0.3em] overflow-hidden transition-all hover:text-[#1e1a1b] scale-[0.9] md:scale-100`}
                >
                    <div className={`absolute inset-0 ${isDarkMode ? 'bg-[#ffcf54]' : 'bg-[#c65f4b]'} -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out -z-10`} />
                    Board the Ferry
                    <ArrowRight size={16} className="md:w-5 md:h-5" />
                </button>
            </motion.div>
        </div>

        {/* FOOTER INTEGRATED AT BOTTOM OF LAST SECTION */}
        <div className={`w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left pb-16 relative z-10 border-t ${isDarkMode ? 'border-white/5' : 'border-[#2c2a25]/5'} pt-12`}>
            <div className="flex items-center gap-4">
                <Logo size="sm" isDarkMode={isDarkMode} />
                <span className={`font-serif font-black text-2xl uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-[#2c2a25]'}`}>Gentle Ferry</span>
            </div>
            <div className="flex flex-col items-center md:items-end gap-1">
              <p className={`font-sans text-[9px] font-black uppercase tracking-[0.6em] ${isDarkMode ? 'text-[#fffcf2]/20' : 'text-[#2c2a25]/20'}`}>
                  Crafted for 2026 • Digital Heirloom
              </p>
              <div className="w-24 h-px bg-white/5" />
            </div>
        </div>
      </section>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Nunito:wght@400;700;900&display=swap');
        
        :root {
          --font-sans: 'Nunito', sans-serif;
          --font-serif: 'Marcellus', serif;
        }

        body {
          font-family: var(--font-sans);
          background-color: ${isDarkMode ? '#1e1a1b' : '#fffcf2'};
          overflow: hidden;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDarkMode ? '#1e1a1b' : '#fffcf2'};
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? '#ffcf5430' : '#c65f4b30'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ffcf5460;
        }

        .font-sans { font-family: var(--font-sans); }
        .font-serif { font-family: var(--font-serif); }

        .snap-start {
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }
      `}</style>
    </div>
  );
}