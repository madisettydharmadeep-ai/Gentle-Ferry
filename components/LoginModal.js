'use client';
import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, X, Signature, UserPlus, LogIn, Key, Sparkles, Ship } from 'lucide-react';
import { playSwooshSound, playTapSound } from '../utils/sound';
import { useGoogleLogin } from '@react-oauth/google';
import Logo from './Logo';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [mounted, setMounted] = useState(false);
  
  const googleLoginHandler = useGoogleLogin({
    onSuccess: (codeResponse) => {
       playSwooshSound?.();
       onLogin(codeResponse.code);
    },
    flow: 'auth-code',
    // Only request basic identity scopes at login.
    include_granted_scopes: false,
    scope: 'openid email profile',
  });

  useEffect(() => setMounted(true), []);

  const handleGoogleSuccess = () => {
    googleLoginHandler();
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="login-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#241f1c]/90 backdrop-blur-sm p-4 sm:p-6"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-4xl flex flex-col md:flex-row relative group p-4"
          >
            <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-center">
              
              {/* The Guestbook Container */}
              <div className="w-full md:w-auto md:flex-1 relative z-10">
                {/* Close Button */}
                <button 
                  onClick={() => { playTapSound?.(); onClose(); }}
                  className="absolute -top-4 -right-4 md:-top-5 md:-right-5 bg-[#f5efde] border-[3px] border-[#31251c] shadow-[4px_4px_0_#31251c] text-[#31251c] p-2 hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0_#31251c] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all z-[60] rounded-full"
                >
                  <X size={20} className="md:w-6 md:h-6" strokeWidth={3} />
                </button>

                <div className="w-full bg-[#f5efde] border-[4px] md:border-[6px] border-[#31251c] shadow-[16px_16px_0_#1a130f] flex flex-col md:flex-row relative z-10 overflow-hidden rounded-md bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
               
               {/* Center Binding / Spine */}
               <div className="hidden md:flex w-16 bg-[#b46a55] border-x-[3px] border-[#31251c] flex-col items-center py-8 shrink-0 relative overflow-hidden shadow-[inset_4px_0_10px_rgba(0,0,0,0.1),inset_-4px_0_10px_rgba(0,0,0,0.1)]">
                  <div className="w-1 h-full border-l-[2px] border-r-[2px] border-[#31251c]/30 border-dashed absolute left-1/2 -translate-x-1/2 opacity-60" />
                  {/* Binding Rings */}
                  {[1,2,3,4,5,6].map((i) => (
                    <div key={i} className="w-16 h-4 bg-[#e6e2d3] border-[2px] border-[#31251c] rounded-full my-auto z-10 shadow-[2px_2px_0_#31251c]" />
                  ))}
               </div>

               {/* LEFT PAGE (Welcome & Lore) */}
               <div className="flex-1 p-8 md:p-12 border-b-[4px] border-[#31251c] md:border-b-0 flex flex-col justify-center relative min-h-[350px]">
                  <div className="absolute top-6 left-6 opacity-20 hover:opacity-100 transition-opacity">
                    <Logo size="xl" rotate={12} className="!border-none !shadow-none !bg-transparent opacity-10" />
                  </div>
                  <h2 className="font-serif font-black text-4xl md:text-5xl lg:text-6xl text-[#31251c] tracking-tighter uppercase leading-none mb-4 relative z-10">
                    The Ferry<br/>Manifest
                  </h2>
                  <div className="w-16 h-[4px] bg-[#31251c] mb-6 relative z-10" />
                  <p className="font-serif text-[#31251c] text-lg lg:text-xl leading-[1.6] italic relative z-10">
                    "Every soul needs a quiet harbor to dock their thoughts and record the day's voyage."
                  </p>
                  <p className="font-sans font-bold text-[#31251c]/80 mt-6 text-sm uppercase tracking-widest relative z-10">
                    Sign the manifest to board the ferry.
                  </p>
               </div>

               {/* RIGHT PAGE (Google Auth) */}
               <div className="flex-1 p-8 md:p-12 relative flex flex-col items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')] bg-repeat min-h-[350px]" style={{ backgroundSize: '100% 32px' }}>
                 
                 <div className="flex items-center gap-4 mb-8 bg-white/80 p-4 border-[3px] border-[#31251c] w-full shadow-[6px_6px_0_#31251c] -rotate-1 text-center justify-center">
                   <Logo size="sm" rotate={0} className="!shadow-none scale-125" />
                   <span className="font-sans font-black text-[#31251c] text-base md:text-lg uppercase tracking-widest">
                     Secure Passage
                   </span>
                 </div>

                 <div className="p-6 bg-white/40 border-[3px] border-dashed border-[#31251c]/30 rounded-xl w-full flex flex-col items-center gap-6">
                    <p className="font-serif italic text-[#31251c]/60 text-center text-sm md:text-base px-4">
                      Synchronize your records across all harbors.
                    </p>
                    
                    <button 
                      onClick={handleGoogleSuccess}
                      className="w-full flex items-center justify-center gap-4 bg-white px-8 py-4 border-[3px] border-[#31251c] shadow-[8px_8px_0_#31251c] hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all group"
                    >
                      <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-6 h-6" />
                      <span className="font-sans font-black text-[#31251c] uppercase tracking-widest text-sm">
                        Signature with Google
                      </span>
                    </button>
                    
                    <div className="flex items-center gap-3 w-full opacity-25 mt-2">
                       <div className="h-[1px] flex-1 bg-[#31251c]" />
                       <Ship size={16} />
                       <div className="h-[1px] flex-1 bg-[#31251c]" />
                    </div>
                 </div>

               </div>

               </div>
              </div>
            </div> 
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}