'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Image as ImageIcon, ArrowRight, Trash2, 
  Smile, Meh, Frown, Sparkles, CheckCircle2
} from 'lucide-react';
import { useAppContext } from '../app/context/AppContext';
import ReceiptCard from './ReceiptCard';

export default function AestheticJournal({ onSaveReceipt, tasks }) {
  const { isDarkMode, today } = useAppContext();
  const [photo, setPhoto] = useState(null);
  const [journal, setJournal] = useState('');
  const [selectedMood, setSelectedMood] = useState(3);
  const [isComplete, setIsComplete] = useState(false);

  const fileInputRef = useRef(null);

  const [currentPlaceholder] = useState(() => {
    const p = [
      "What has the day revealed to you?...",
      "Inscribe the rhythm of your afternoon...",
      "A quiet moment of reflection...",
      "Words for the future you...",
      "The small joys that caught your eye...",
      "The highlights of your journey...",
      "What did you build today?..."
    ];
    return p[Math.floor(Math.random() * p.length)];
  });

  // Dynamic Theme Colors
  const theme = {
    paper: isDarkMode ? 'bg-[#1a1a1a]' : 'bg-[#fffcf5]',
    lines: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
    text: isDarkMode ? 'text-stone-300' : 'text-stone-800',
    accent: '#d4a373', // Muted Gold/Leather color
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPhoto(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleArchive = () => {
    if (!journal.trim() && !photo) return;
    
    // 1. First trigger the cozy success view locally
    setIsComplete(true);

    // 2. After a brief delay to let them see the checkmark, trigger the actual save
    // which will then transition the parent to the "Ferry Sleeps" view
    setTimeout(() => {
      const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      
      onSaveReceipt?.({
        id: `${today.getTime()}-${Math.random().toString(36).substr(2, 5)}`,
        date: dateStr,
        tasks: tasks ? [...tasks] : [],
        photo,
        journal: journal.trim(),
        journalType: 'text',
        mood: selectedMood
      });
    }, 2000);
  };

  const handleReset = () => {
    setJournal('');
    setPhoto(null);
    setSelectedMood(3);
    setIsComplete(false);
  };

  if (isComplete) {
     return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="relative mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className={`w-32 h-32 ${isDarkMode ? 'bg-stone-800' : 'bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)]'} text-[#d4a373] rounded-full flex items-center justify-center shadow-2xl`}
            >
              <CheckCircle2 size={80} strokeWidth={1.5} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-[#d4a373]/20 blur-xl"
            />
          </div>

          <h2 className={`font-serif text-5xl md:text-6xl ${isDarkMode ? 'text-stone-300' : 'text-stone-800'} uppercase tracking-tighter mb-4 italic`}>
            Archived
          </h2>
          <p className={`font-serif italic text-xl ${isDarkMode ? 'text-stone-500' : 'text-stone-600'} opacity-60`}>
            Your record is safe in the chronicles.
          </p>
        </motion.div>
     );
  }

  return (
    <div className="w-full max-w-5xl mx-auto transition-colors duration-500">
      
      {/* Mood Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 px-6 gap-6">
        <div className="flex flex-col">
        </div>
        <div className={`flex justify-center gap-2 ${isDarkMode ? 'bg-black/40 backdrop-blur-xl' : 'bg-white shadow-2xl'} p-2 rounded-full border ${isDarkMode ? 'border-white/10' : 'border-stone-200/60'}`}>
          {[
            { v: 1, i: Frown, c: isDarkMode ? '#ff6b6b' : '#c1121f', l: 'LOW' },
            { v: 2, i: Meh,   c: isDarkMode ? '#ffcf54' : '#f48c06', l: 'MID' },
            { v: 3, i: Smile, c: isDarkMode ? '#b7b7a4' : '#5ba882', l: 'HIGH' }
          ].map((m) => (
            <button 
              key={m.v}
              onClick={() => setSelectedMood(m.v)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 ${selectedMood === m.v ? (isDarkMode ? 'bg-white text-stone-900 font-bold shadow-[0_10px_25px_-5px_rgba(255,255,255,0.3)]' : 'bg-stone-900 text-white shadow-xl font-bold') : (isDarkMode ? 'text-stone-500 hover:text-white hover:bg-white/5' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100/50')}`}
            >
              <m.i size={20} color={selectedMood === m.v ? (isDarkMode ? '#1a1a1a' : m.c) : (isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)')} strokeWidth={selectedMood === m.v ? 3 : 2} />
              {selectedMood === m.v && (
                <span className="text-[10px] font-black tracking-[0.2em]">{m.l}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* THE PAPER ELEMENT */}
      <motion.div 
        layout
        className={`relative ${theme.paper} min-h-[500px] flex flex-col md:flex-row shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-700`}
        style={{
          borderRadius: '2px', // Sharp Architectural Corners
        }}
      >
        {/* Heavy Binding Shadow */}
        <div className="absolute left-0 top-0 w-6 h-full bg-gradient-to-r from-black/25 via-black/5 to-transparent pointer-events-none z-20" />

        {/* Writing Area */}
        <div 
          className="flex-1 p-10 md:p-14 md:pr-10 relative overflow-hidden"
          style={{
            backgroundImage: `url('https://www.transparenttextures.com/patterns/natural-paper.png')`,
            backgroundBlendMode: isDarkMode ? 'hard-light' : 'multiply',
            opacity: isDarkMode ? 0.7 : 1
          }}
        >
          {/* Faint Noise Layer for Calmness */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />

          <textarea
            autoFocus
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            placeholder={currentPlaceholder}
            className={`w-full h-full min-h-[300px] bg-transparent border-none outline-none resize-none font-serif text-xl md:text-2xl italic leading-[3.6rem] ${theme.text} ${isDarkMode ? 'placeholder:text-stone-300/50' : 'placeholder:text-stone-500/40'} relative z-10 transition-colors duration-300`}
            style={{
              backgroundImage: `linear-gradient(transparent, transparent calc(3.4rem - 1px), ${theme.lines} 1px)`,
              backgroundSize: '100% 3.4rem',
              caretColor: isDarkMode ? '#ffcf54' : '#8b5e3c'
            }}
          />
        </div>

        {/* Thinner Sidebar: Memory Slot */}
        <div className={`w-full md:w-[320px] p-8 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l ${isDarkMode ? 'border-white/5 bg-white/[0.01]' : 'border-stone-500/10 bg-stone-500/[0.01]'}`}>
          <div 
            onClick={() => !photo && fileInputRef.current?.click()}
            className="relative group w-full max-w-[240px]"
          >
            {/* Washi Tape Effect */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#d4a373]/30 backdrop-blur-sm rotate-2 z-20 shadow-sm" />
            
            <div className={`aspect-square p-3 ${isDarkMode ? 'bg-[#2a2a2a]' : 'bg-white'} shadow-2xl transition-transform duration-500 group-hover:rotate-0 -rotate-2 relative`}>
              {photo ? (
                <div className="relative w-full h-full group overflow-hidden bg-stone-900">
                  <img src={photo} alt="Memory" className="w-full h-full object-cover opacity-90 sepia-[0.2]" />
                  <button 
                    onClick={(e) => { e.stopPropagation(); setPhoto(null); }}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity text-white"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              ) : (
                <div className="w-full h-full border border-dashed border-stone-500/10 flex flex-col items-center justify-center gap-3 text-stone-500">
                  <Camera size={32} strokeWidth={1} />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">Add Visual</span>
                </div>
              )}
            </div>
            
            <div className="mt-4 text-center">
               <span className="font-serif italic text-xs text-stone-500 opacity-60">
                 {today?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — Entry Log
               </span>
            </div>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
        </div>
      </motion.div>

      {/* Floating Action Button */}
      <div className="flex justify-center mt-12">
        <button 
          onClick={handleArchive}
          disabled={!journal.trim() && !photo}
          className={`
            group flex items-center gap-4 px-12 py-5 rounded-full font-black text-xs tracking-[0.4em] uppercase transition-all
            ${isDarkMode 
              ? 'bg-[#d4a373] text-stone-900 hover:bg-[#e9c46a]' 
              : 'bg-stone-900 text-[#fffcf5] hover:bg-stone-800'}
            disabled:opacity-20 disabled:scale-95
          `}
        >
          Archive This Moment
          <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </div>
  );
}