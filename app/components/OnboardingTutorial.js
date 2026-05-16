'use client';

import { useState } from 'react';
import { 
  AtSign, Calendar, Highlighter, FolderHeart, 
  Award, ArrowRight, ArrowLeft, X, Heart 
} from 'lucide-react';
import { clsx } from 'clsx';

const slides = [
  {
    icon: Heart,
    title: 'Welcome Aboard',
    text: 'Gentle Ferry is your cozy corner to capture life\'s little moments. Let\'s show you around your new sanctuary.',
    color: 'from-pink-400 to-rose-400',
    shadow: 'shadow-pink-300/50',
    tilt: '-rotate-6'
  },
  {
    icon: AtSign,
    title: 'People & Places',
    text: 'Type @name to tag friends, #place for locations. We\'ll magically weave them into your journey\'s index.',
    color: 'from-cyan-400 to-blue-500',
    shadow: 'shadow-cyan-300/50',
    tilt: 'rotate-6'
  },
  {
    icon: Highlighter,
    title: 'Pastel Highlights',
    text: 'Select any text and paint it with soft colors. Your memories deserve to be vibrant and beautiful.',
    color: 'from-amber-300 to-orange-400',
    shadow: 'shadow-amber-300/50',
    tilt: '-rotate-3'
  },
  {
    icon: Calendar,
    title: 'Memory Calendar',
    text: 'Every entry finds its place in time. Browse your months, and revisit your days effortlessly.',
    color: 'from-emerald-400 to-teal-500',
    shadow: 'shadow-emerald-300/50',
    tilt: 'rotate-3'
  },
  {
    icon: FolderHeart,
    title: 'Curated Collections',
    text: 'Group related entries into collections. Create stories, trips, or themes that matter most to you.',
    color: 'from-violet-400 to-fuchsia-400',
    shadow: 'shadow-violet-300/50',
    tilt: '-rotate-6'
  },
  {
    icon: Award,
    title: 'Your Boarding Pass',
    text: 'Head to your Profile to view your official ferry ticket. A keepsake of the day your journey began.',
    color: 'from-stone-700 to-stone-900',
    shadow: 'shadow-stone-400/50',
    tilt: 'rotate-0',
    isLast: true,
  },
];

export default function OnboardingTutorial({ onComplete }) {
  const [current, setCurrent] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const handleNext = () => {
    if (current < slides.length - 1) {
      setCurrent(c => c + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(c => c - 1);
    }
  };

  const handleComplete = () => {
    setIsExiting(true);
    setTimeout(() => {
      localStorage.setItem('gentle-ferry-onboarded', 'true');
      onComplete?.();
    }, 400); 
  };

  const slide = slides[current];
  const Icon = slide.icon;

  return (
    <div 
      className={clsx(
        "fixed inset-0 z-[200] bg-stone-900/30 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-500",
        isExiting ? "opacity-0" : "opacity-100"
      )}
      onClick={handleComplete}
    >
      <div 
        className={clsx(
          "relative w-full max-w-[750px] bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row transition-transform duration-500",
          isExiting ? "translate-y-8 scale-95" : "translate-y-0 scale-100"
        )}
        onClick={e => e.stopPropagation()}
      >
        
        {/* Minimal Skip Button */}
        <button 
          onClick={handleComplete}
          className="absolute top-6 right-6 z-50 text-stone-300 hover:text-stone-600 transition-colors bg-white/80 backdrop-blur-sm rounded-full p-2"
          aria-label="Skip tutorial"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* LEFT SIDE: Visual Stage */}
        <div className="w-full md:w-4/12 h-48 md:h-auto relative flex items-center justify-center bg-stone-50/50 border-r border-stone-100 overflow-hidden">
          {/* Subtle background pattern for the stage */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#292524_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Glowing Orb */}
            <div 
              key={`bg-${current}`}
              className={clsx(
                "absolute inset-0 rounded-full opacity-40 blur-3xl transition-all duration-700",
                slide.color.split(' ')[0].replace('from-', 'bg-') 
              )} 
            />
            
            {/* Tilted Icon Block */}
            <div 
              key={`icon-${current}`}
              className={clsx(
                "relative z-10 w-28 h-28 rounded-[2rem] bg-gradient-to-br flex items-center justify-center shadow-2xl transition-all duration-500",
                slide.color,
                slide.shadow,
                slide.tilt
              )}
            >
              <Icon size={52} className="text-white drop-shadow-sm" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Content & Controls */}
        <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-between min-h-[420px]">
          
          {/* Clean Typography */}
          <div 
            key={`text-${current}`} 
            className="animate-fadeIn flex-1 flex flex-col justify-center mb-8"
          >
            <span className="block text-[10px] font-bold font-mono text-stone-400 tracking-[0.2em] uppercase mb-4">
              Step 0{current + 1} of {slides.length}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-stone-800 tracking-tight mb-4 leading-tight">
              {slide.title}
            </h2>
            <p className="text-stone-500 text-lg font-medium leading-relaxed max-w-sm">
              {slide.text}
            </p>
          </div>

          <div>
            {/* Playful Pill Progress Indicator */}
            <div className="flex items-center gap-2 mb-10">
              {slides.map((_, i) => (
                <div 
                  key={i}
                  className={clsx(
                    "h-2.5 rounded-full transition-all duration-500",
                    i === current 
                      ? `w-10 bg-gradient-to-r ${slide.color}` 
                      : "w-2.5 bg-stone-100"
                  )}
                />
              ))}
            </div>

            {/* Navigation Controls */}
            <div className="w-full flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={current === 0}
                className={clsx(
                  "flex items-center justify-center w-12 h-12 rounded-full transition-all",
                  current === 0 
                    ? "opacity-0 pointer-events-none" 
                    : "text-stone-400 hover:bg-stone-100 hover:text-stone-800 active:scale-95"
                )}
                aria-label="Previous step"
              >
                <ArrowLeft size={20} strokeWidth={2.5} />
              </button>

              {/* Dynamic Color Button */}
              <button
                onClick={handleNext}
                className={clsx(
                  "flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-white shadow-lg transition-all hover:scale-105 active:scale-95 bg-gradient-to-r",
                  slide.color,
                  slide.shadow
                )}
              >
                {slide.isLast ? 'Begin Journey' : 'Continue'}
                {!slide.isLast && <ArrowRight size={18} strokeWidth={2.5} />}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}