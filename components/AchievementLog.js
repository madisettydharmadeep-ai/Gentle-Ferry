'use client';
import { createPortal } from 'react-dom';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ArrowRight, Mic, Square, Play, Pause, Lock, Camera } from 'lucide-react';
import { playSwooshSound, playTapSound } from '../utils/sound';
import { useAppContext } from '../app/context/AppContext';
import { useReactMediaRecorder } from "react-media-recorder";
import ProButton from './ProButton';
import ReceiptCard from './ReceiptCard';

export default function AchievementLog({ isOpen, onClose, tasks, onReset, onSaveReceipt, mood }) {
  const { today, isDarkMode, isPremium, setShowProModal } = useAppContext();
  const [step, setStep] = useState('photo'); // 'photo' or 'receipt'
  const [photo, setPhoto] = useState(null);
  const [journal, setJournal] = useState('');
  const [journalType, setJournalType] = useState('text'); // 'text' or 'voice'
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  const placeholders = [
    "What did the day reveal to you?...",
    "The highlights that you'll carry forward...",
    "What has the afternoon brought to light?...",
    "A quiet moment of reflection on your progress...",
    "Words for the future you to remember...",
    "The small victories that made today whole...",
    "What did you create or discover today?..."
  ];

  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } = useReactMediaRecorder({ audio: true });

  useEffect(() => {
    if (isOpen) {
      setStep('photo');
      setPhoto(null);
      setJournal('');
      setJournalType('text');
      setAudioUrl(null);
      clearBlobUrl();
      setCurrentPlaceholder(placeholders[Math.floor(Math.random() * placeholders.length)]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (mediaBlobUrl) setAudioUrl(mediaBlobUrl);
  }, [mediaBlobUrl]);

  useEffect(() => setMounted(true), []);

  const handlePhotoUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPhoto(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateReceipt = () => {
    playSwooshSound();
    onSaveReceipt?.({
      id: `${today.getTime()}-${Math.random().toString(36).substr(2, 5)}`,
      date: dateStr,
      tasks: [...tasks],
      photo,
      journal: journalType === 'text' ? journal.trim() : null,
      audio: journalType === 'voice' ? audioUrl : null,
      journalType,
      mood
    });
    setStep('receipt');
  };

  useEffect(() => {
    if (step === 'receipt') {
      const timer = setTimeout(() => {
        onReset();
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const wordCount = journal.trim() ? journal.trim().split(/\s+/).length : 0;
  const isJournalValid = journalType === 'text' ? wordCount <= 250 : true;

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const content = (
    <motion.div 
      key="achievement-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[9999] flex items-center justify-center ${isDarkMode ? 'bg-black/90' : 'bg-[#1a1815]/40'} backdrop-blur-md p-4 sm:p-6`}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="w-full max-w-5xl flex flex-col items-center justify-center transition-all duration-300 relative"
      >
        <AnimatePresence mode="wait">
          {step === 'photo' ? (
            <motion.div 
              key="photo-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full h-full flex flex-col items-center gap-12"
            >
              <div className={`w-full ${isDarkMode ? 'bg-[#1a1815]' : 'bg-[#fffcf8]'} ${isDarkMode ? 'shadow-[0_60px_120px_-20px_rgba(0,0,0,0.8)]' : 'shadow-[0_80px_160px_-30px_rgba(44,42,37,0.35)]'} flex flex-col lg:flex-row lg:h-[550px] overflow-hidden relative border ${isDarkMode ? 'border-white/5' : 'border-stone-500/10'} rounded-[4px]`}>
                <button 
                  onClick={() => { playTapSound(); onClose(); }}
                  className="absolute top-8 right-8 z-50 p-2 rounded-full hover:bg-black/5 transition-all text-stone-400 hover:text-stone-800"
                >
                  <X size={24} strokeWidth={2.5} />
                </button>

                <div className={`flex-1 flex flex-col border-b lg:border-b-0 lg:border-r ${isDarkMode ? 'border-white/5' : 'border-stone-500/10'} relative overflow-hidden`}>
                  <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/natural-paper.png')`, backgroundBlendMode: isDarkMode ? 'hard-light' : 'multiply', opacity: isDarkMode ? 0.7 : 1 }} />
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/stardust.png')` }} />
                  <div className="p-12 pb-6 flex items-center justify-between relative z-10">
                    <div className="flex flex-col">
                      <span className={`text-2xl font-black uppercase tracking-[0.4em] ${isDarkMode ? 'text-stone-300' : 'text-stone-800'}`}>Field Report</span>
                    </div>
                    <div className={`flex ${isDarkMode ? 'bg-white/5' : 'bg-stone-500/5'} rounded-full p-1.5 border ${isDarkMode ? 'border-white/5' : 'border-stone-500/10'} mr-12`}>
                      <button onClick={() => setJournalType('text')} className={`px-6 py-2.5 rounded-full font-sans font-black text-[10px] uppercase tracking-widest transition-all ${journalType === 'text' ? (isDarkMode ? 'bg-stone-800 text-white shadow-sm' : 'bg-white text-stone-800 shadow-[0_8px_20px_-5px_rgba(0,0,0,0.15)]') : (isDarkMode ? 'text-stone-500 hover:text-stone-300' : 'text-stone-400 hover:text-stone-600')}`}>Text</button>
                      <button onClick={() => isPremium ? setJournalType('voice') : setShowProModal(true)} className={`px-6 py-2.5 rounded-full font-sans font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${journalType === 'voice' ? (isDarkMode ? 'bg-stone-800 text-white shadow-sm' : 'bg-white text-stone-800 shadow-[0_8px_20px_-5px_rgba(0,0,0,0.15)]') : (isDarkMode ? 'text-stone-500 hover:text-stone-300' : 'text-stone-400 hover:text-stone-600')}`}>
                        {!isPremium && <Lock size={12} strokeWidth={3} className="opacity-40" />} Voice
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 p-12 pt-0 relative z-10">
                    {journalType === 'text' ? (
                      <textarea
                        autoFocus
                        value={journal}
                        onChange={(e) => setJournal(e.target.value)}
                        placeholder={currentPlaceholder}
                        className={`w-full h-full min-h-[300px] bg-transparent border-none outline-none resize-none font-serif text-xl md:text-2xl italic leading-[3.6rem] ${isDarkMode ? 'text-stone-300' : 'text-stone-800'} ${isDarkMode ? 'placeholder:text-stone-300/50' : 'placeholder:text-stone-500/40'} scrollbar-hide`}
                        style={{ 
                          backgroundImage: `linear-gradient(transparent, transparent calc(3.6rem - 1px), ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px)`, 
                          backgroundSize: '100% 3.6rem',
                          caretColor: isDarkMode ? '#ffcf54' : '#8b5e3c'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-center">
                        <motion.div animate={status === 'recording' ? { scale: [1, 1.1, 1] } : {}} className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${status === 'recording' ? 'bg-[#ff6b6b] shadow-2xl' : (isDarkMode ? 'bg-stone-800' : 'bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]')}`}>
                          {status !== 'recording' ? (
                            !audioUrl ? (<button onClick={startRecording}><Mic size={40} className={isDarkMode ? 'text-[#ffcf54]' : 'text-stone-800'} strokeWidth={1} /></button>) :
                            (<button onClick={togglePlayback} className={isDarkMode ? 'text-white' : 'text-stone-800'}>{isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}</button>)
                          ) : (<button onClick={stopRecording}><Square size={36} fill={isDarkMode ? 'white' : 'stone-900'} /></button>)}
                        </motion.div>
                        <p className={`mt-8 font-serif text-xl ${isDarkMode ? 'text-stone-400' : 'text-stone-500'} italic opacity-60`}>{status === 'recording' ? 'Inscribing rhythm...' : audioUrl ? 'Review entry' : 'Click to record'}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`w-full lg:w-[320px] flex flex-col items-center justify-center p-12 ${isDarkMode ? 'bg-white/[0.02]' : 'bg-stone-500/[0.02]'}`}>
                  <div className="relative group w-full" onClick={() => isPremium && !photo && fileInputRef.current?.click()}>
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-20 h-8 bg-[#d4a373]/30 backdrop-blur-sm rotate-3 z-30 transition-transform group-hover:rotate-0" />
                    <div className={`aspect-square p-4 ${isDarkMode ? 'bg-[#252525]' : 'bg-white'} ${isDarkMode ? 'shadow-2xl' : 'shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)]'} transition-transform duration-700 group-hover:rotate-0 -rotate-2 relative cursor-pointer border ${isDarkMode ? 'border-white/5' : 'border-stone-100'}`}>
                      {photo ? (<img src={photo} alt="Record" className="w-full h-full object-cover grayscale-[0.05] opacity-95 transition-all group-hover:grayscale-0" />) : (
                        <div className="w-full h-full border border-dashed border-stone-500/10 flex flex-col items-center justify-center gap-6 text-stone-500/20">
                          <Camera size={48} strokeWidth={0.5} /><span className="text-[10px] font-black uppercase tracking-[0.3em]">{isPremium ? 'Capture' : 'Pro'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e.target.files[0])} />
                </div>
              </div>

              <button 
                onClick={handleGenerateReceipt}
                disabled={!isJournalValid || (!photo && journalType === 'text' && !journal.trim()) || (journalType === 'voice' && !audioUrl)}
                className={`px-16 py-6 rounded-full font-black text-xs tracking-[0.5em] uppercase transition-all duration-500 hover:-translate-y-1 flex items-center gap-4 disabled:opacity-20 ${isDarkMode ? 'bg-[#d4a373] text-stone-900 shadow-xl' : 'bg-stone-900 text-stone-50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.45)]'}`}
              >
                Seal the Entry <ArrowRight size={20} strokeWidth={4} />
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="receipt-step" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center"
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
          )}
        </AnimatePresence>
        <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
      </motion.div>
    </motion.div>
  );

  return mounted && createPortal(<AnimatePresence>{isOpen && content}</AnimatePresence>, document.body);
}
