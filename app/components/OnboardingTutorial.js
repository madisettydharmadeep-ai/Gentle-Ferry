'use client';

import { useState } from 'react';
import { 
  AtSign, Calendar, Highlighter, FolderHeart, 
  Award, ArrowRight, ArrowLeft, Sparkles, X 
} from 'lucide-react';

const slides = [
  {
    icon: Sparkles,
    title: 'Welcome Aboard',
    text: 'Gentle Ferry is your cozy corner to capture life\'s little moments. Let\'s show you around.',
    color: 'from-blush to-rose-300',
  },
  {
    icon: AtSign,
    title: 'Mention People & Places',
    text: 'Type @name to tag friends, #place for locations. We\'ll magically organize them for you.',
    color: 'from-sky to-blue-300',
  },
  {
    icon: Highlighter,
    title: 'Pastel Highlights',
    text: 'Select any text and paint it with soft colors. Your memories deserve to be beautiful.',
    color: 'from-amber to-yellow-300',
  },
  {
    icon: Calendar,
    title: 'Memory Calendar',
    text: 'Every entry finds its place in time. Browse your months, revisit your days.',
    color: 'from-sage to-green-300',
  },
  {
    icon: FolderHeart,
    title: 'Collections',
    text: 'Group related entries into collections. Create stories, trips, or themes that matter.',
    color: 'from-violet to-purple-300',
  },
  {
    icon: Award,
    title: 'Your First Ferry Ticket',
    text: 'Head to your Profile to download your boarding pass. A keepsake of the day you began.',
    color: 'from-blush to-rose-300',
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
    if (current > 0) setCurrent(c => c - 1);
  };

  const handleComplete = () => {
    setIsExiting(true);
    setTimeout(() => {
      localStorage.setItem('gentle-ferry-onboarded', 'true');
      onComplete?.();
    }, 300);
  };

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      localStorage.setItem('gentle-ferry-onboarded', 'true');
      onComplete?.();
    }, 300);
  };

  const slide = slides[current];
  const Icon = slide.icon;

  return (
    <div 
      className={`fixed inset-0 z-[200] bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ${isExiting ? 'opacity-0' : 'opacity-100'}`}
      onClick={handleSkip}
    >
      <div 
        className="relative w-full max-w-md bg-card rounded-3xl shadow-2xl border border-line overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Gradient Header */}
        <div className={`h-32 bg-gradient-to-br ${slide.color} flex items-center justify-center relative`}>
          <button 
            onClick={handleSkip}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <Icon size={32} className="text-white" strokeWidth={1.5} />
          </div>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-ink mb-3">{slide.title}</h2>
          <p className="text-ink-soft leading-relaxed mb-6">{slide.text}</p>

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {slides.map((_, i) => (
              <div 
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? 'w-6 bg-blush' : 'bg-line'
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={current === 0}
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                current === 0 ? 'text-line cursor-not-allowed' : 'text-ink-soft hover:text-ink'
              }`}
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <button
              onClick={handleNext}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm text-white shadow-lg transition-all hover:scale-105 active:scale-95 bg-gradient-to-r ${slide.color}`}
            >
              {slide.isLast ? 'Start Writing' : 'Next'}
              {!slide.isLast && <ArrowRight size={16} />}
            </button>
          </div>
        </div>

        {/* Decorative corner */}
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-blush/10 to-transparent rounded-tl-full" />
      </div>
    </div>
  );
}
