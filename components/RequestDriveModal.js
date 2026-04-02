'use client';
import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HardDrive, X, Sparkles, ShieldCheck } from 'lucide-react';
import { playSwooshSound, playTapSound } from '../utils/sound';
import { useGoogleLogin } from '@react-oauth/google';

export default function RequestDriveModal({ isOpen, onClose, onPermissionGranted }) {
  const [mounted, setMounted] = useState(false);
  
  const googleDriveLoginHandler = useGoogleLogin({
    onSuccess: (codeResponse) => {
       playSwooshSound?.();
       onPermissionGranted(codeResponse.code);
       onClose();
    },
    flow: 'auth-code',
    scope: 'openid email profile https://www.googleapis.com/auth/drive.file',
    prompt: 'consent',
    hint: 'Give Gentle Ferry permission to store your photos and recordings in your Google Drive.'
  });

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[12000] flex items-center justify-center bg-[#241f1c]/80 backdrop-blur-md p-6"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg bg-[#f5efde] border-[6px] border-[#31251c] shadow-[16px_16px_0_#1a130f] p-8 relative rounded-2xl bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"
          >
            <button 
              onClick={() => { playTapSound?.(); onClose(); }}
              className="absolute -top-4 -right-4 bg-[#f5efde] border-[3px] border-[#31251c] shadow-[4px_4px_0_#31251c] p-2 hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all z-20 rounded-full"
            >
              <X size={20} className='text-[#31251c]' strokeWidth={3} />
            </button>

            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-20 h-20 bg-[#ffcf54] border-[4px] border-[#31251c] rounded-3xl shadow-[8px_8px_0_#31251c] flex items-center justify-center -rotate-3">
                <HardDrive size={40} className="text-[#31251c]" strokeWidth={2.5} />
              </div>

              <div>
                <h3 className="font-serif font-black text-3xl text-[#31251c] uppercase tracking-tighter leading-tight mb-2">
                  Master's Storage
                </h3>
                <div className="w-12 h-1 bg-[#31251c] mx-auto mb-4" />
                <p className="font-serif italic text-lg text-[#31251c]/80 leading-relaxed">
                  "A master voyager keeps their records in a private safe."
                </p>
              </div>

              <div className="w-full space-y-4">
                <div className="flex items-start gap-4 p-4 bg-white/40 border-[3px] border-dashed border-[#31251c]/20 rounded-xl text-left">
                  <ShieldCheck size={20} className="text-[#31251c] shrink-0 mt-1" />
                  <p className="text-xs font-bold text-[#31251c]/60 uppercase tracking-wider leading-relaxed">
                    Connecting to Google Drive allows you to securely store photos and audio reflections. We only access files created by this app.
                  </p>
                </div>

                <button 
                  onClick={() => googleDriveLoginHandler()}
                  className="w-full flex items-center justify-center gap-4 bg-[#31251c] text-white px-8 py-5 border-[3px] border-[#31251c] shadow-[8px_8px_0_#ffcf54] hover:shadow-[12px_12px_0_#ffcf54] hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all group rounded-xl"
                >
                  <Sparkles size={20} className="text-[#ffcf54] animate-pulse" />
                  <span className="font-sans font-black uppercase tracking-widest text-sm text-[#ffcf54]">
                    Authorize Secure Storage
                  </span>
                </button>
                
                <button 
                  onClick={onClose}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-[#31251c]/30 hover:text-[#31251c] transition-colors"
                >
                  I'll do this later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
