import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { 
  Sparkles, MoveRight, Anchor, BookOpen, Wind, Mail, X
} from 'lucide-react';
import { playTapSound } from '../utils/sound';

const STEPS = [
  {
    title: 'Welcome Wanderer',
    text: 'Step onto the Gentle Ferry. This is a sanctuary for your focus, designed to help you navigate your day with intention and peace.',
    icon: <Anchor size={64} />,
    color: '#B8D8E3', // Soft Blue
    lightColor: '#E1F0F5'
  },
  {
    title: 'Rhythms & Orbs',
    text: 'Set "Duties" for today, weekdays, or weekends. Recurring tasks transform into Habit Orbs—hover to peek, click to tick.',
    icon: <Sparkles size={64} />,
    color: '#F2E3A0', // Soft Yellow
    lightColor: '#FAF5D9'
  },
  {
    title: 'Seal the Record',
    text: 'Conclude your day manually to log your mood and a journal entry. Attach one image that captures the essence of your voyage.',
    icon: <BookOpen size={64} />,
    color: '#CCE2CB', // Soft Green
    lightColor: '#E6F2E5'
  },
  {
    title: 'Cozy Curiosities',
    text: 'Find local weather and curated global news. You can even mail a letter to your future self—it will unlock on the day you choose.',
    icon: <Mail size={64} />,
    color: '#F6CFC3', // Soft Coral/Orange
    lightColor: '#FBE8E2'
  },
  {
    title: 'Your Horizon',
    text: 'Explore deep Analytics in your Profile. Feeling overwhelmed? Toggle "Chill Mode" to hide tasks and focus only on journaling.',
    icon: <Wind size={64} />,
    color: '#D4C4E0', // Soft Purple
    lightColor: '#EAE2F0'
  }
];

export default function TutorialOverlay({ onComplete, isDarkMode }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;

  const handleNext = () => {
    try { playTapSound(); } catch (e) {}
    if (!isLastStep) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const jumpToStep = (index) => {
    try { playTapSound(); } catch (e) {}
    setCurrentStep(index);
  };

  const theme = {
    bg: isDarkMode ? 'bg-[#1C1A19]' : 'bg-[#FCF9F2]',
    text: isDarkMode ? 'text-[#F5F2ED]' : 'text-[#433F3B]',
    secondaryText: isDarkMode ? 'text-[#AFA9A2]' : 'text-[#7A746E]',
    border: isDarkMode ? 'border-[#3D3A37]' : 'border-[#EAE2D6]',
    shadow: 'shadow-[0_20px_50px_rgba(0,0,0,0.2)]',
    accent: step.color,
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 md:p-8">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#0D0C0B]/60 backdrop-blur-md"
          onClick={onComplete}
        />

        {/* Modal Container */}
        <div className="relative w-full max-w-4xl">
          {/* Bookmark Tabs */}
          <div className="absolute top-0 right-8 md:right-12 flex gap-1 z-20 -translate-y-[85%] md:-translate-y-[90%]">
            {STEPS.map((s, i) => (
              <motion.button
                key={i}
                whileHover={{ y: -4 }}
                onClick={() => jumpToStep(i)}
                className={`w-8 md:w-10 h-12 md:h-16 flex items-end justify-center pb-2 md:pb-3 transition-transform duration-300 font-serif font-bold text-sm md:text-base border-t-[1px] border-x-[1px] border-[#00000010]
                  ${i === currentStep ? 'translate-y-0' : 'translate-y-2 md:translate-y-3 opacity-80 hover:opacity-100'}`}
                style={{ 
                  backgroundColor: s.color,
                  color: '#433F3B',
                  boxShadow: i === currentStep ? '0 -4px 10px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                {i + 1}
              </motion.button>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`relative w-full ${theme.bg} ${theme.shadow} overflow-hidden flex flex-col md:flex-row min-h-[500px] md:h-[600px] border-[1px] ${theme.border}`}
          >
            {/* Left Side: Illustration Panel */}
            <motion.div 
              key={`side-${currentStep}`}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full md:w-[40%] flex flex-col items-center justify-center p-12 relative overflow-hidden shrink-0"
              style={{ backgroundColor: isDarkMode ? `${step.color}20` : step.lightColor }}
            >
              {/* Subtle pattern or circle behind icon */}
              <div 
                className="absolute w-64 h-64 rounded-full blur-3xl opacity-30" 
                style={{ backgroundColor: step.color }}
              />
              
              <div 
                className="relative z-10 p-10 flex items-center justify-center"
                style={{ color: isDarkMode ? step.color : '#433F3B' }}
              >
                {step.icon}
              </div>

              <div className={`mt-8 font-serif italic text-lg ${theme.secondaryText} opacity-60`}>
                Chapter {currentStep + 1}
              </div>
            </motion.div>

            {/* Right Side: Content Area */}
            <div className="flex-1 p-8 md:p-16 flex flex-col justify-between relative bg-opacity-50">
              {/* Skip Button */}
              <button 
                onClick={onComplete}
                className={`absolute top-6 right-8 p-2 transition-colors ${theme.secondaryText} hover:bg-black/5 opacity-40 hover:opacity-100 border-[1px] border-transparent hover:border-black/10`}
              >
                <X size={20} />
              </button>

              <div className="flex-1 flex flex-col justify-center max-w-md mx-auto md:mx-0">
                <motion.div
                  key={`content-${currentStep}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className={`font-serif text-4xl md:text-5xl font-bold mb-6 tracking-tight ${theme.text}`}>
                    {step.title}
                  </h2>

                  <p className={`text-lg md:text-xl leading-relaxed font-sans font-normal ${theme.secondaryText}`}>
                    {step.text}
                  </p>
                </motion.div>
              </div>

              {/* Interaction Row */}
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Progress Dots */}
                <div className="flex gap-2">
                  {STEPS.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 transition-all duration-500 ${
                        i === currentStep 
                        ? 'w-12' 
                        : 'w-2 opacity-20'
                      }`}                      style={{ backgroundColor: i === currentStep ? step.color : (isDarkMode ? '#F5F2ED' : '#433F3B') }}
                    />
                  ))}
                </div>

                {/* Continue Button */}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="group relative px-8 py-4 flex items-center gap-3 transition-all duration-300 shadow-sm border-[1px] border-black/10"
                  style={{ 
                    backgroundColor: step.color,
                    color: '#433F3B'
                  }}
                >
                  <span className="font-sans font-bold tracking-wide">
                    {isLastStep ? "Embark Now" : "Next Page"}
                  </span>
                  <MoveRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>,
    document.body
  );
}