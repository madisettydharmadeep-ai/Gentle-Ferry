'use client';
import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, CloudRain, Sun, X, Stamp, Sparkles, Mail, Send, CalendarDays, Lock } from 'lucide-react';
import { playSwooshSound, playTapSound } from '../utils/sound';
import { useAppContext } from '../app/context/AppContext';
import { navbarThemes } from '../utils/navbarThemes';

const getHolidayNews = (today) => {
  const year = today.getFullYear();
  
  const getNthSunday = (yr, month, n) => {
    const firstOfMonth = new Date(yr, month, 1);
    const firstSunday = 1 + ((7 - firstOfMonth.getDay()) % 7);
    return new Date(yr, month, firstSunday + (n - 1) * 7);
  };

  const holidays = [
    { date: getNthSunday(year, 4, 2), name: "Mother's Day", prepDays: 3, text: "The meadow is filled with chatter as the young fawns secretly gather wildflower bouquets" },
    { date: getNthSunday(year, 5, 3), name: "Father's Day", prepDays: 3, text: "The badger cubs are quietly carving wooden tokens of appreciation in the woods" },
    { date: new Date(year, 1, 14), name: "Valentine's Day", prepDays: 3, text: "The post owl is working overtime sorting hundreds of leaf-pressed valentines" },
    { date: new Date(year, 2, 8), name: "Women's Day", prepDays: 2, text: "A grand tea party is being organized by the riverbank to honor the ferry matriarchs" },
    { date: new Date(year, 3, 22), name: "Earth Day", prepDays: 2, text: "The moles and earthworms are holding a joint summit to organize a soil-enrichment festival" },
    { date: new Date(year, 9, 31), name: "Halloween", prepDays: 4, text: "Pumpkin patches are mysteriously emptying as raccoons prepare for the autumn masquerade" },
    { date: new Date(year, 10, 8), name: "Diwali", prepDays: 4, text: "The fireflies have been recruited for extra shifts to light up the woods" }, 
    { date: new Date(year, 10, 19), name: "Men's Day", prepDays: 2, text: "The elder bears are organizing a grand river-fishing tournament" },
    { date: new Date(year, 11, 25), name: "Christmas", prepDays: 5, text: "The pinecone committee has officially gathered to debate who gets to place the star on the Great Fir" },
    { date: new Date(year + 1, 0, 1), name: "New Year's", prepDays: 3, text: "The woodland creatures are hanging glowing moss lanterns across the canopy" }
  ];

  const todayMidnight = new Date(year, today.getMonth(), today.getDate()).getTime();

  for (let h of holidays) {
    const holidayTime = h.date.getTime();
    const diffTime = holidayTime - todayMidnight;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return `The whole ferry is celebrating *${h.name}* today! ${h.text}!`;
    if (diffDays > 0 && diffDays <= h.prepDays) {
      const timeString = diffDays === 1 ? "tomorrow" : `in ${diffDays} days`;
      return `${h.text} for *${h.name}* that's coming ${timeString}!`;
    }
  }
  return null;
};


const getDailyNewsSnippet = (date) => {
  const holidayNews = getHolidayNews(date);
  if (holidayNews) return holidayNews;

  return "It seems the *ferry fairies* forgot to fill the inkwell today, or perhaps our *hardworking developer* is taking a long nap under the Great Oak. There are no new reports for this morning... we are very sorry! Check back soon for more whispers from the valley.";
};

export default function CozyNews() {
  const { isDarkMode, isPremium, setShowProModal } = useAppContext();
  const theme = isDarkMode ? navbarThemes.dark : navbarThemes.light;
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [weatherText, setWeatherText] = useState("Calm skies");
  const [weatherTemp, setWeatherTemp] = useState("--");
  const [newsSnippet, setNewsSnippet] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isSunny, setIsSunny] = useState(true);
  
  const [isWritingFuture, setIsWritingFuture] = useState(false);
  const [futureText, setFutureText] = useState("");
  const [capsuleDate, setCapsuleDate] = useState("");
  const [isSealed, setIsSealed] = useState(false);
  const [isDisplayingLetter, setIsDisplayingLetter] = useState(false);

  const [isDev, setIsDev] = useState(false);

  const { today } = useAppContext();

  useEffect(() => {
    setMounted(true);
    setIsDev(process.env.NEXT_PUBLIC_APP_MODE === 'dev' || !!localStorage.getItem('gentle_ferry_dev_mode'));

    async function fetchNews() {
      try {
        const d = new Date(today);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${day}`;
        
        const res = await fetch(`/api/broadcasts?date=${dateStr}`);
        const data = await res.json();
        
        if (data.success && data.data) {
          setNewsSnippet(data.data.message);
          // Use the broadcast's own image URL if set, otherwise fall back to default
          setPhotoUrl(data.data.imageUrl && data.data.imageUrl !== 'okaaa.jpg' 
            ? data.data.imageUrl 
            : 'okaaa.jpg');
        } else {
          setNewsSnippet(getDailyNewsSnippet(today));
          setPhotoUrl('okaaa.jpg');
        }
      } catch (err) {
        setNewsSnippet(getDailyNewsSnippet(today));
        setPhotoUrl('okaaa.jpg');
      }
    }

    fetchNews();
    setIsDisplayingLetter(false);

    async function fetchWeather() {
      try {
        const geoRes = await fetch('https://get.geojs.io/v1/ip/geo.json');
        if (!geoRes.ok) throw new Error();
        const geoData = await geoRes.json();
        
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${geoData.latitude}&longitude=${geoData.longitude}&current_weather=true`);
        if (!weatherRes.ok) throw new Error();
        const weatherData = await weatherRes.json();
        
        const code = weatherData.current_weather.weathercode;
        setWeatherTemp(`${Math.round(weatherData.current_weather.temperature)}°C`); 

        let feeling = "Gentle breeze";
        let sunny = true;
        if (code === 0) feeling = "Clear skies";
        else if (code >= 1 && code <= 3) feeling = "Soft clouds";
        else if (code >= 45 && code <= 48) { feeling = "Tranquil fog"; sunny = false; }
        else if (code >= 51 && code <= 67) { feeling = "Quiet rain"; sunny = false; }
        else if (code >= 71 && code <= 77) { feeling = "Snowflakes falling"; sunny = false; }
        
        setWeatherText(feeling);
        setIsSunny(sunny);
      } catch (e) {
        setWeatherTemp("--");
        setWeatherText("Calm skies");
      }
    }
    
    fetchWeather();
  }, [isOpen, today]);

  const handleSealCapsule = () => {
     if (!futureText.trim() || !capsuleDate) return;
     playSwooshSound?.();
     
     const existingLetters = JSON.parse(localStorage.getItem('future_letters') || '[]');
     existingLetters.push({ id: Date.now().toString(), text: futureText, deliveryDate: capsuleDate, isRead: false });
     localStorage.setItem('future_letters', JSON.stringify(existingLetters));

     setIsSealed(true);
     setTimeout(() => {
        setIsWritingFuture(false);
        setIsSealed(false);
        setFutureText("");
        setCapsuleDate("");
     }, 2000);
  };

  const dateStr = today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();

  const content = (
    <motion.div 
      key="cozy-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#2c2a25]/60 backdrop-blur-sm p-4 sm:p-6 shadow-2xl"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`w-full max-w-[900px] h-[90dvh] max-h-[620px] ${theme.taskCardBg} bg-[url('https://www.transparenttextures.com/patterns/lined-paper-2.png')] border-[4px] ${theme.taskCardBorder} rounded-xl ${isDarkMode ? 'shadow-[16px_16px_0_#00000060]' : 'shadow-[16px_16px_0_#2c2a25]'} relative flex flex-col p-4 sm:p-6 overflow-hidden`}
      >
        
        {/* Notebook Top Bar */}
        <div className={`absolute top-0 left-0 right-0 h-8 bg-[#c65f4b] border-b-[4px] ${theme.taskCardBorder} flex items-center justify-evenly px-8 z-30`}>
           {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
               <div key={i} className={`w-3 h-5 ${theme.modalBg} border-[2px] ${theme.taskCardBorder} rounded-full shadow-inner`} />
           ))}
        </div>

        <button 
           onClick={() => { playTapSound?.(); setIsOpen(false); }}
           className={`absolute top-10 right-4 ${theme.modalInputBg} border-[3px] ${theme.taskCardBorder} ${isDarkMode ? 'text-[#fdf8ea] hover:bg-[#3d2f1f]' : 'text-[#2c2a25] hover:bg-[#ffcf54]'} transition-colors p-2 rounded-xl ${isDarkMode ? 'shadow-[4px_4px_0_#00000040]' : 'shadow-[4px_4px_0_#2c2a25]'} active:translate-y-1 active:translate-x-1 active:shadow-none z-50 overflow-hidden`}
        >
           <X size={20} strokeWidth={3} />
        </button>

        {/* --- Header Section --- */}
        <div className="w-full flex flex-col items-center shrink-0 mb-3 sm:mb-4 pt-10 relative z-20">
          <h1 className={`font-serif font-black text-4xl sm:text-5xl ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'} tracking-tighter uppercase text-center mb-1`}>
            The Ferry Whisper
          </h1>
          <span className={`font-sans font-black ${isDarkMode ? 'text-[#fdf8ea]/40' : 'text-[#2c2a25]/40'} text-[10px] sm:text-[11px] uppercase tracking-[0.4em]`}>{dateStr}</span>
          <div className={`w-20 h-[3px] ${isDarkMode ? 'bg-[#ffcf54]' : 'bg-[#2c2a25]'} mt-4 rounded-full opacity-10`}></div>
        </div>

        {/* --- Grid Content Area --- */}
        <div className="flex-1 min-h-0 w-full relative z-10">
            {isWritingFuture ? (
              /* Future Letter Form */
              <div className="w-full h-full flex flex-col items-center justify-center">
                {isSealed ? (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`flex flex-col items-center justify-center gap-3 text-center ${theme.modalInputBg} p-10 rounded-2xl border-[4px] ${theme.taskCardBorder} ${isDarkMode ? 'shadow-[8px_8px_0_#00000040]' : 'shadow-[8px_8px_0_#2c2a25]'}`}>
                      <div className={`w-20 h-20 ${isDarkMode ? 'bg-[#3d2f1f]' : 'bg-[#ffcf54]'} border-[3px] ${theme.taskCardBorder} rounded-2xl flex items-center justify-center mb-2 shadow-[4px_4px_0_#00000010]`}>
                          <Mail size={32} className={isDarkMode ? 'text-[#ffcf54]' : 'text-[#2c2a25]'} strokeWidth={2.5} />
                      </div>
                      <h2 className={`font-serif font-black text-3xl ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'} uppercase tracking-tighter`}>Sealed Safely</h2>
                      <p className={`font-sans font-black ${isDarkMode ? 'text-[#fdf8ea]/40' : 'text-[#2c2a25]/40'} uppercase tracking-[0.2em] text-[10px]`}>Waiting for {new Date(capsuleDate).toLocaleDateString()}</p>
                    </motion.div>
                ) : (
                    <div className={`w-full max-w-xl h-full flex flex-col ${theme.modalInputBg} border-[4px] ${theme.taskCardBorder} rounded-2xl ${isDarkMode ? 'shadow-[8px_8px_0_#00000040]' : 'shadow-[8px_8px_0_#2c2a25]'} p-5 relative overflow-hidden`}>
                      <button onClick={() => setIsWritingFuture(false)} className={`absolute top-4 right-4 ${isDarkMode ? 'text-[#fdf8ea]/40 hover:text-[#ff8a8a]' : 'text-[#2c2a25]/40 hover:text-[#c65f4b]'}`}>
                          <X size={20} strokeWidth={3} />
                      </button>
                      <div className="shrink-0 mb-4">
                        <h2 className={`font-serif font-black text-2xl ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'} uppercase tracking-tight mb-1`}>Post a Letter</h2>
                        <p className={`font-sans font-black ${isDarkMode ? 'text-[#fdf8ea]/30' : 'text-[#2c2a25]/30'} text-[10px] uppercase tracking-widest leading-none`}>Write to your future self.</p>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0 mb-4">
                          <label className={`font-sans font-black text-[10px] uppercase tracking-widest ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'} flex items-center gap-2`}>
                            <CalendarDays size={14} strokeWidth={3} /> Delivery Date
                          </label>
                          <input 
                            type="date" value={capsuleDate} onChange={(e) => setCapsuleDate(e.target.value)}
                            className={`${theme.taskCardBg} border-[3px] ${theme.taskCardBorder} rounded-xl outline-none font-sans font-black ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'} p-3 text-sm ${isDarkMode ? 'focus:bg-[#2c2a25]' : 'focus:bg-white'} focus:border-[#ffcf54] transition-colors w-full sm:w-1/2`}
                          />
                      </div>
                      <textarea 
                          value={futureText} onChange={(e) => setFutureText(e.target.value)} placeholder="Dear future me..."
                          className={`flex-1 w-full min-h-0 ${theme.taskCardBg} border-[3px] ${theme.taskCardBorder} rounded-xl outline-none font-serif text-lg ${isDarkMode ? 'text-white' : 'text-[#2c2a25]'} p-4 resize-none ${isDarkMode ? 'focus:bg-[#2c2a25]' : 'focus:bg-white'} focus:border-[#ffcf54] transition-colors custom-scrollbar mb-4`}
                      />
                      <button 
                          onClick={handleSealCapsule} disabled={!futureText.trim() || !capsuleDate}
                          className={`shrink-0 flex items-center justify-center gap-3 w-full self-end px-8 py-4 ${isDarkMode ? 'bg-[#3d2f1f] text-[#d1a23b]' : 'bg-[#c65f4b] text-white'} border-[3px] ${isDarkMode ? 'border-[#d1a23b]' : theme.taskCardBorder} rounded-xl font-sans font-black text-xs uppercase tracking-widest ${isDarkMode ? 'shadow-[6px_6px_0_#00000040]' : 'shadow-[6px_6px_0_#2c2a25]'} hover:bg-[#332a1a] active:translate-y-1 active:translate-x-1 active:shadow-none disabled:opacity-20 transition-all`}
                      >
                          <Stamp size={20} strokeWidth={2.5} /> Seal Envelope
                      </button>
                    </div>
                )}
              </div>
            ) : (
              /* NEW BENTO LAYOUT */
              <div className="w-full h-full flex flex-col gap-3 sm:gap-4">
                
                {/* TOP ROW: Widgets side-by-side always */}
                <div className="flex flex-row gap-3 sm:gap-4 h-[80px] sm:h-[95px] shrink-0">
                  
                  {/* Weather Banner */}
                  <div className={`w-1/2 sm:w-[40%] ${theme.modalInputBg} border-[3px] ${theme.taskCardBorder} rounded-xl p-2.5 sm:p-4 ${isDarkMode ? 'shadow-[4px_4px_0_#00000040]' : 'shadow-[4px_4px_0_#2c2a25]'} flex flex-row items-center justify-between relative overflow-hidden group`}>
                     <div className="flex flex-col justify-center relative z-10 pl-1 sm:pl-2">
                        <span className={`font-sans font-black text-2xl sm:text-4xl ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'} leading-none mb-0.5`}>{weatherTemp}</span>
                        <span className={`font-serif ${isDarkMode ? 'text-[#fdf8ea]/60' : 'text-[#2c2a25]'} text-[9px] sm:text-xs leading-tight italic font-black truncate max-w-[70px] sm:max-w-none`}>{weatherText}</span>
                     </div>
                     <div className={`bg-[#ffcf54] p-1.5 sm:p-2 rounded-xl border-[2.5px] ${theme.taskCardBorder} ${isDarkMode ? 'shadow-[2px_2px_0_#00000040]' : 'shadow-[2px_2px_0_#2c2a25]'} shrink-0 mr-1 sm:mr-2 relative z-10`}>
                        {isSunny ? <Sun size={18} className="sm:w-6 sm:h-6 text-[#2c2a25]" strokeWidth={3} /> : <CloudRain size={18} className="sm:w-6 sm:h-6 text-[#2c2a25]" strokeWidth={3} />}
                     </div>
                  </div>

                  {/* Future Letter Banner */}
                  <button 
                    onClick={() => { 
                      playTapSound?.(); 
                      if (isPremium) {
                        setIsWritingFuture(true); 
                      } else {
                        setShowProModal(true);
                      }
                    }}
                    className={`flex-1 ${isDarkMode ? 'bg-[#3d2f1f]' : 'bg-[#ffcf54]'} ${!isPremium && (isDarkMode ? 'text-[#d1a23b]/50' : 'text-[#2c2a25]/50')} ${isPremium ? (isDarkMode ? 'text-[#d1a23b]' : 'text-[#2c2a25]') : ''} border-[3px] ${isDarkMode ? 'border-[#d1a23b]' : theme.taskCardBorder} rounded-xl p-2.5 sm:p-4 ${isDarkMode ? 'shadow-[4px_4px_0_#00000040]' : 'shadow-[4px_4px_0_#2c2a25]'} flex flex-row items-center gap-2 sm:gap-4 hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[5px_5px_0_#2c2a25] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all relative overflow-hidden group text-left`}
                  >
                    {!isPremium && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-[#2c2a25]/10 px-1.5 py-0.5 rounded-md border border-[#2c2a25]/10">
                         <Lock size={10} strokeWidth={3} className={isDarkMode ? 'text-[#d1a23b]' : 'text-[#2c2a25]'} />
                         <span className={`font-sans font-black text-[8px] uppercase tracking-widest ${isDarkMode ? 'text-[#d1a23b]' : 'text-[#2c2a25]'}`}>PRO</span>
                      </div>
                    )}
                    <div className={`${theme.modalInputBg} p-1.5 sm:p-2 rounded-xl border-[2.5px] ${theme.taskCardBorder} ${isDarkMode ? 'shadow-[2px_2px_0_#00000040]' : 'shadow-[2px_2px_0_#2c2a25]'} shrink-0 ml-1 sm:ml-2 relative z-10 transition-transform group-hover:scale-105`}>
                       <Send size={18} className={`sm:w-6 sm:h-6 ${isDarkMode ? (isPremium ? 'text-[#d1a23b]' : 'text-[#d1a23b]/40') : (isPremium ? 'text-[#2c2a25]' : 'text-[#2c2a25]/40')}`} strokeWidth={3} />
                    </div>
                    <div className="flex flex-col relative z-10 w-full">
                       <h4 className="font-sans font-black text-[10px] sm:text-base uppercase tracking-widest leading-none">
                         Future Letter
                       </h4>
                       <span className={`font-serif italic font-black text-[8px] sm:text-xs ${isDarkMode ? 'text-[#d1a23b]/60' : 'text-[#2c2a25]/60'} mt-1 leading-none`}>
                         <span className="sm:hidden">Archive message...</span>
                         <span className="hidden sm:block">Archive a message for later...</span>
                       </span>
                    </div>
                  </button>

                </div>

                {/* BOTTOM ROW: News Broadsheet */}
                <div className={`flex-1 ${theme.modalInputBg} border-[4px] ${theme.taskCardBorder} rounded-2xl ${isDarkMode ? 'shadow-[6px_6px_0_#00000040]' : 'shadow-[6px_6px_0_#2c2a25]'} p-3 sm:p-5 flex flex-col min-h-0 relative overflow-hidden`}>
                  
                  {/* News Header */}
                  <div className={`flex items-center justify-between border-b-[3px] ${isDarkMode ? 'border-[#ffcf54]/20' : 'border-[#2c2a25]/10'} pb-2 sm:pb-3 mb-3 sm:mb-4 shrink-0 relative z-10`}>
                     <h2 className={`font-serif font-black ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'} text-xl sm:text-3xl uppercase tracking-tighter leading-none`}>
                       {isDisplayingLetter ? "A Note From The Past" : "Latest Happenings"}
                     </h2>
                     <Sparkles size={20} className={`${isDarkMode ? 'text-[#ffcf54]' : 'text-[#2c2a25]'}/20 hidden sm:block`} strokeWidth={3} />
                  </div>
                  
                  {/* News Content */}
                  <div className="flex-1 min-h-0 flex flex-row gap-4 sm:gap-8 items-stretch relative z-10">
                    
                    {/* Article Text */}
                    <div className="flex-1 flex flex-col h-full min-h-0">
                      <div className={`flex-1 overflow-y-auto font-serif ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'} text-sm sm:text-lg lg:text-xl leading-[1.5] sm:leading-[1.6] text-justify custom-scrollbar pr-3`}>
                        <span className="float-left font-sans font-black text-5xl sm:text-7xl leading-[0.7] pr-3 sm:pr-5 pt-1 text-[#c65f4b]">
                          {newsSnippet.charAt(0)}
                        </span>
                        <div className="font-medium tracking-tight inline">
                          {newsSnippet.slice(1).split('*').map((part, i) => 
                            i % 2 === 1 ? (
                              <span key={i} className="text-[#c65f4b] font-black underline decoration-[2px] underline-offset-4">{part}</span>
                            ) : (part)
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Image */}
                    <div className={`w-[80px] h-[80px] sm:w-[32%] sm:h-full shrink-0 border-[4px] ${theme.taskCardBorder} rounded-xl overflow-hidden relative group ${theme.taskCardBg} shadow-[4px_4px_0_#00000010]`}>
                      <img 
                        src={photoUrl} alt="News Illustration" 
                        className="absolute inset-0 w-full h-full object-cover sm:group-hover:scale-105 transition-transform duration-1000"
                      />
                      <div className={`absolute bottom-1.5 left-1.5 sm:bottom-3 sm:left-3 ${theme.modalInputBg} px-1 sm:px-2 py-0.5 sm:py-1 border-[2.5px] ${theme.taskCardBorder} rounded-lg ${isDarkMode ? 'shadow-[2px_2px_0_#00000040]' : 'shadow-[2px_2px_0_#2c2a25]'}`}>
                        <span className={`text-[6px] sm:text-[9px] font-sans font-black uppercase tracking-widest ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'}`}>Fig 1.</span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}
        </div>

      </motion.div>
    </motion.div>
  );

  return (
    <>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { playSwooshSound?.(); setIsOpen(true); }}
        className={`flex items-center justify-center p-2 md:p-2.5 rounded-xl border-[3px] transition-all duration-200 ${
          isDarkMode 
            ? 'bg-[#1a242e] border-[#332f2b] text-[#8ea8c3] shadow-[4px_4px_0_#00000040] hover:shadow-[6px_6px_0_#00000050]' 
            : 'bg-[#fdfaf5] border-[#2c2a25] text-[#2c2a25] shadow-[4px_4px_0_#2c2a25] hover:shadow-[6px_6px_0_#2c2a25]'
        } hover:-translate-y-1 hover:-translate-x-1 active:translate-y-1 active:translate-x-1 active:shadow-none`}
      >
        <Newspaper size={18} className="md:w-5 md:h-5" strokeWidth={2.5} />
      </motion.button>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && content}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}