'use client';

import { Check, Loader2 } from 'lucide-react';

/**
 * SaveOverlay - Displays a developing/saved animation for journal entries.
 */
export default function SaveOverlay({ saving, saved }) {
  if (!saving && !saved) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 animate-fadeIn pointer-events-none">
      {/* Subtle backdrop dim */}
      <div className="absolute inset-0 bg-ink/10 backdrop-blur-[2px]" />
      
      <div className="relative bg-white/80 backdrop-blur-3xl border border-white/50 shadow-2xl rounded-[2.5rem] p-10 flex flex-col items-center text-center w-64 animate-[scaleIn_0.3s_ease-out] pointer-events-auto">
        {saving ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blush/10 flex items-center justify-center mb-5">
              <Loader2 size={28} className="text-blush animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-ink">Developing…</h3>
            <p className="text-xs text-ink-soft mt-1.5 font-medium">Securing memory</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center mb-5 animate-[scaleIn_0.4s_ease-out]">
              <Check size={32} strokeWidth={3} className="text-sage" />
            </div>
            <h3 className="text-lg font-bold text-ink animate-[slideUp_0.4s_ease-out]">Saved!</h3>
            <div className="flex gap-1 mt-2">
               <div className="w-1.5 h-1.5 rounded-full bg-blush animate-bounce" />
               <div className="w-1.5 h-1.5 rounded-full bg-blush animate-bounce [animation-delay:0.2s]" />
               <div className="w-1.5 h-1.5 rounded-full bg-blush animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
