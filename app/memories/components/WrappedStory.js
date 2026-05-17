"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Feather, Sparkles, Heart, Compass, Quote, CalendarDays } from "lucide-react";
import AnimatedBackground from "../../components/AnimatedBackground";
import { getImageSrc } from "../../../app/components/PostcardView";
import { useEffect } from "react";

const TOTAL_STEPS = 6;

// Rich, character-driven palettes with vibrant accents & luxury gradients
const SLIDE_THEMES = [
  { bg: "#13161A", gradient: "radial-gradient(circle at 30% 20%, #1a2029 0%, #0d0f12 100%)", text: "#F3F4F6", accent: "#FDE047", muted: "#9CA3AF", line: "rgba(255,255,255,0.12)", icon: CalendarDays }, // Midnight & Gold
  { bg: "#1C241E", gradient: "radial-gradient(circle at 30% 20%, #243329 0%, #111713 100%)", text: "#F1F5F9", accent: "#6EE7B7", muted: "#94A3B8", line: "rgba(255,255,255,0.12)", icon: Feather },      // Forest & Mint
  { bg: "#2A1A24", gradient: "radial-gradient(circle at 30% 20%, #3d2433 0%, #1a0f16 100%)", text: "#FAF5FF", accent: "#F472B6", muted: "#D8B4E2", line: "rgba(255,255,255,0.12)", icon: Sparkles },     // Plum & Rose
  { bg: "#2B1D19", gradient: "radial-gradient(circle at 30% 20%, #3e2821 0%, #1b110f 100%)", text: "#FFF7ED", accent: "#FB923C", muted: "#D6B0A5", line: "rgba(255,255,255,0.12)", icon: Heart },        // Mocha & Tangerine
  { bg: "#152433", gradient: "radial-gradient(circle at 30% 20%, #1f374e 0%, #0e1721 100%)", text: "#F0F9FF", accent: "#38BDF8", muted: "#93C5FD", line: "rgba(255,255,255,0.12)", icon: Compass },      // Deep Ocean & Sky
  { bg: "#1C1424", gradient: "radial-gradient(circle at 30% 20%, #2e1d3d 0%, #100b14 100%)", text: "#F9FAF7", accent: "#C084FC", muted: "#D8B4FE", line: "rgba(255,255,255,0.12)", icon: Quote },              // Deep Amethyst & Lavender Aurora
];

// Ultra-smooth easing
const easePremium = [0.16, 1, 0.3, 1];

// Stagger container
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.01 },
  },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

// Child element animation
const itemVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(2px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.22, ease: easePremium } },
};

// Subtle organic film grain
const NoiseOverlay = () => (
  <div
    className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-overlay z-0"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
);

export default function WrappedStory({
  show, onClose, step, setStep,
  recapData, entries, totalWords, weather,
  MONTHS, viewMonth, viewYear,
  peopleList, placesList, allPeopleMap, allPlacesMap,
  openEntries,
}) {
  useEffect(() => {
    if (show) setStep(0);
  }, [show]);

  if (!show || !recapData) return null;

  const theme = SLIDE_THEMES[step];
  const isFinal = step === TOTAL_STEPS - 1;
  const CurrentIcon = theme.icon;

  const goNext = () => !isFinal && setStep(step + 1);
  const goPrev = () => step > 0 && setStep(step - 1);

  // Data extraction for personalized storytelling
  const topPerson = peopleList.length > 0 ? peopleList[0][0] : null;
  const otherPeople = peopleList.slice(1, 4);
  
  const topPlace = placesList.length > 0 ? placesList[0] : null; 
  const otherPlaces = placesList.slice(1, 4);

  // Helper for highlighting text
  const Highlight = ({ children }) => (
    <span className="font-serif italic" style={{ color: theme.accent, textShadow: `0 0 24px ${theme.accent}60` }}>
      {children}
    </span>
  );

  return (
    <AnimatePresence>
      <motion.div
        key="wrapped-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: easePremium }}
        className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-0"
        style={{ background: "rgba(0, 0, 0, 0.85)", backdropFilter: "blur(16px)" }}
      >
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none grayscale">
          <AnimatedBackground weather={weather} showClouds={false} />
        </div>

        {/* ELEVATED CARD */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`card-${step}`}
            initial={{ opacity: 0, y: 40, scale: 0.93, rotateX: 5 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: -30, scale: 0.96, rotateX: -5 }}
            transition={{ duration: 0.28, ease: easePremium }}
            className="relative flex flex-col w-full max-w-[420px] h-[700px] rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
            style={{ 
              background: theme.gradient || theme.bg, 
              border: `1px solid ${theme.line}`,
              boxShadow: `inset 0 1px 2px ${theme.line}, 0 30px 80px rgba(0,0,0,0.5)`
            }}
          >
            {/* Double Glowing ambient corners for Luxury Aura Effect */}
            <div 
              className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[120px] opacity-[0.22] pointer-events-none transition-colors duration-1000"
              style={{ background: theme.accent }}
            />
            <div 
              className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-[120px] opacity-[0.15] pointer-events-none transition-colors duration-1000"
              style={{ background: theme.muted }}
            />

            <NoiseOverlay />

            {/* Minimalist Header */}
            <div className="relative z-40 flex items-center justify-between px-8 pt-8 pb-2">
              <div className="flex items-center gap-2 flex-1 mr-12">
                {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      opacity: i === step ? 1 : i < step ? 0.4 : 0.1,
                      background: theme.text,
                      width: i === step ? "24px" : "100%",
                    }}
                    transition={{ duration: 0.2, ease: easePremium }}
                    className="h-[2px] flex-1 rounded-full"
                  />
                ))}
              </div>
              <button
                onClick={onClose}
                className="opacity-50 hover:opacity-100 hover:scale-110 transition-all z-50"
                style={{ color: theme.text }}
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Content Container */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="relative z-10 flex-1 flex flex-col px-10 pt-6 pb-12 overflow-hidden"
            >
              <AnimatePresence mode="wait">

                {/* ── Step 0: Cover ── */}
                {step === 0 && (
                  <div className="flex flex-col justify-between h-full">
                    <motion.div variants={itemVariants}>
                      <div className="flex items-center gap-3 mb-8">
                        <CurrentIcon size={20} style={{ color: theme.accent }} strokeWidth={1.5} />
                        <div className="uppercase tracking-[0.3em]" style={{ fontSize: 10, color: theme.muted }}>
                          Vol. {viewMonth.toString().padStart(2, '0')}
                        </div>
                      </div>
                      <div className="font-serif italic leading-[1.05] text-balance" style={{ fontSize: "clamp(56px, 14vw, 72px)", color: theme.text }}>
                        Reflections
                        <br />& <Highlight>Reveries.</Highlight>
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="border-t pt-8" style={{ borderColor: theme.line }}>
                      <div className="uppercase tracking-[0.2em] mb-3" style={{ fontSize: 10, color: theme.muted }}>
                        Archive Period
                      </div>
                      <div className="font-light tracking-wide text-3xl" style={{ color: theme.text }}>
                        {MONTHS[viewMonth - 1]} {viewYear}
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* ── Step 1: Words ── */}
                {step === 1 && (
                  <div className="flex flex-col justify-center h-full gap-10">
                    <motion.div variants={itemVariants} className="flex justify-between items-start">
                      <div>
                        <div className="font-light tracking-tighter tabular-nums leading-none mb-4" style={{ fontSize: "clamp(80px, 18vw, 110px)", color: theme.accent }}>
                          {entries.length}
                        </div>
                        <div className="font-serif italic text-2xl" style={{ color: theme.muted }}>
                          entries penned.
                        </div>
                      </div>
                      <CurrentIcon size={32} style={{ color: theme.line }} strokeWidth={1} />
                    </motion.div>

                    <motion.div variants={itemVariants} className="relative pt-10 mt-4">
                      <div className="absolute top-0 w-20 h-[1px]" style={{ background: theme.line }} />
                      <div className="font-light text-3xl mb-4 text-balance leading-snug" style={{ color: theme.text }}>
                        That's <Highlight>{totalWords.toLocaleString()} words</Highlight> dedicated to exploring your inner world.
                      </div>
                      <div className="uppercase tracking-[0.25em] mt-8 flex items-center gap-3" style={{ fontSize: 9, color: theme.muted }}>
                        <span className="w-4 h-[1px]" style={{ background: theme.accent }}/> Every word a footprint
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* ── Step 2: Mood ── */}
                {step === 2 && (
                  <div className="flex flex-col justify-center h-full">
                    <motion.div variants={itemVariants} className="mb-14 relative">
                      <CurrentIcon size={120} className="absolute -top-10 -right-4 opacity-5 pointer-events-none" style={{ color: theme.text }} />
                      <div className="uppercase tracking-[0.2em] mb-5" style={{ fontSize: 10, color: theme.muted }}>
                        Emotional Resonance
                      </div>
                      <div className="font-light text-4xl leading-snug" style={{ color: theme.text }}>
                        Your rhythm was primarily <Highlight>{recapData.topMood}</Highlight>.
                      </div>
                    </motion.div>

                    <div className="flex flex-col gap-6">
                      {recapData.moodCounts.slice(0, 4).map(([m, c], idx) => (
                        <motion.div key={m} variants={itemVariants}>
                          <div className="flex justify-between items-end mb-3">
                            <span className="font-light tracking-widest text-sm uppercase" style={{ color: idx === 0 ? theme.accent : theme.text }}>{m}</span>
                            <span className="font-serif italic text-sm" style={{ color: theme.muted }}>
                              {Math.round((c / entries.length) * 100)}%
                            </span>
                          </div>
                          <div className="h-[2px] w-full rounded-full" style={{ background: theme.line }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(c / entries.length) * 100}%` }}
                              transition={{ delay: 0.4 + idx * 0.1, duration: 1.4, ease: easePremium }}
                              className="h-[2px] rounded-full relative"
                              style={{ background: idx === 0 ? theme.accent : theme.text }}
                            >
                              {idx === 0 && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />}
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Step 3: Connections ── */}
                {step === 3 && (
                  <div className="flex flex-col h-full justify-center">
                    <motion.div variants={itemVariants} className="mb-10 flex items-center justify-between">
                      <div>
                        <div className="font-light text-7xl mb-2 tabular-nums tracking-tighter" style={{ color: theme.accent }}>
                          {allPeopleMap.size}
                        </div>
                        <div className="uppercase tracking-[0.2em]" style={{ fontSize: 10, color: theme.muted }}>
                          Souls Mentioned
                        </div>
                      </div>
                      <CurrentIcon size={40} style={{ color: theme.line }} strokeWidth={1} />
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex-1">
                      {topPerson ? (
                        <>
                          <div className="font-light text-3xl leading-[1.3] text-balance mb-10" style={{ color: theme.text }}>
                            You shared your pages with many, but your thoughts kept returning to <Highlight>{topPerson}</Highlight>.
                          </div>
                          
                          {otherPeople.length > 0 && (
                            <div className="pt-8 border-t relative" style={{ borderColor: theme.line }}>
                              <div className="absolute -top-[1px] left-0 w-8 h-[1px]" style={{ background: theme.accent }} />
                              <div className="uppercase tracking-[0.2em] mb-4" style={{ fontSize: 9, color: theme.muted }}>
                                Also gracing your story
                              </div>
                              <div className="font-serif italic text-xl" style={{ color: theme.text }}>
                                {otherPeople.map(p => p[0]).join("  ·  ")}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="font-serif italic text-3xl leading-relaxed" style={{ color: theme.muted }}>
                          A chapter written entirely in quiet solitude.
                        </div>
                      )}
                    </motion.div>
                  </div>
                )}

                {/* ── Step 4: Places ── */}
                {step === 4 && (
                  <div className="flex flex-col h-full justify-center">
                    <motion.div variants={itemVariants} className="mb-10 flex items-center justify-between">
                      <div>
                        <div className="font-light text-7xl mb-2 tabular-nums tracking-tighter" style={{ color: theme.accent }}>
                          {allPlacesMap.size}
                        </div>
                        <div className="uppercase tracking-[0.2em]" style={{ fontSize: 10, color: theme.muted }}>
                          Places Anchored
                        </div>
                      </div>
                      <CurrentIcon size={40} style={{ color: theme.line }} strokeWidth={1} />
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex flex-col">
                      {topPlace ? (
                        <>
                          <div className="font-light text-3xl leading-[1.3] text-balance mb-10" style={{ color: theme.text }}>
                            Of all the places you wandered, <Highlight>{topPlace[0]}</Highlight> was your sanctuary, appearing in {topPlace[1].length} moments.
                          </div>

                          {otherPlaces.length > 0 && (
                            <div className="pt-8 border-t relative" style={{ borderColor: theme.line }}>
                              <div className="absolute -top-[1px] left-0 w-8 h-[1px]" style={{ background: theme.accent }} />
                              <div className="uppercase tracking-[0.2em] mb-5" style={{ fontSize: 9, color: theme.muted }}>
                                Other coordinates
                              </div>
                              <div className="flex flex-col gap-4">
                                {otherPlaces.map(([p, ent]) => (
                                  <div key={p} className="flex justify-between items-center">
                                    <div className="font-light tracking-wide text-base" style={{ color: theme.text }}>{p}</div>
                                    <div className="font-serif italic text-sm" style={{ color: theme.muted }}>{ent.length} entries</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="font-serif italic text-3xl leading-relaxed" style={{ color: theme.muted }}>
                          Your story remained rooted in one place.
                        </div>
                      )}
                    </motion.div>
                  </div>
                )}

                {/* ── Step 5: Memory ── */}
                {step === 5 && (
                  <div className="flex flex-col h-full justify-between pb-2">
                    <motion.div variants={itemVariants} className="flex-1 flex flex-col justify-center">
                      
                      {/* Polaroid Container */}
                      {recapData.randomMemory?.driveImageUrl ? (
                        <motion.div 
                          variants={itemVariants}
                          className="relative p-3 pb-6 bg-white shadow-[0_20px_45px_rgba(0,0,0,0.25)] rotate-[-1.5deg] mb-8 mx-auto w-full max-w-[320px]" 
                          style={{ border: "1px solid rgba(0,0,0,0.06)", borderRadius: "2px" }}
                        >
                          <div className="w-full h-44 overflow-hidden bg-stone-950 relative">
                            <img
                              src={getImageSrc(recapData.randomMemory)}
                              alt="Polaroid Memory"
                              className="w-full h-full object-cover grayscale-[12%] contrast-[1.05] sepia-[6%]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                          </div>
                          <div className="pt-4 text-center font-serif italic text-xs text-stone-700 tracking-[0.2em]">
                            {MONTHS[viewMonth - 1]} {recapData.randomMemory?.entryDate ? new Date(recapData.randomMemory.entryDate).getDate() : ""}, {viewYear}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div 
                          variants={itemVariants}
                          className="relative p-6 py-10 bg-white/5 border border-white/10 rounded-[2rem] shadow-inner mb-8 flex flex-col items-center justify-center text-center"
                        >
                          <CurrentIcon size={38} className="opacity-35 mb-4" style={{ color: theme.accent }} strokeWidth={1.5} />
                          <div className="font-serif italic text-lg leading-relaxed text-balance" style={{ color: theme.text }}>
                            A quiet, beautiful chapter in your story...
                          </div>
                          <div className="uppercase tracking-[0.2em] mt-4" style={{ fontSize: 9, color: theme.muted }}>
                            {MONTHS[viewMonth - 1]} {recapData.randomMemory?.entryDate ? new Date(recapData.randomMemory.entryDate).getDate() : ""}, {viewYear}
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Typographic Quote Block */}
                      <div className="px-2 relative">
                        <span className="absolute -top-7 -left-3 font-serif text-[7rem] leading-none opacity-[0.08] select-none pointer-events-none" style={{ color: theme.accent }}>“</span>
                        <p 
                          className="font-serif italic text-xl leading-relaxed text-balance line-clamp-3 relative z-10" 
                          style={{ color: theme.text, textShadow: `0 0 40px ${theme.accent}20` }}
                        >
                          {recapData.randomMemory?.text || "Quiet reflections."}
                        </p>
                      </div>
                    </motion.div>

                    {/* Premium elevated actions footer */}
                    <motion.div 
                      variants={itemVariants} 
                      className="mt-6 flex items-center justify-between border-t pt-6 relative" 
                      style={{ borderColor: theme.line }}
                    >
                      <div className="absolute -top-[1px] left-0 w-12 h-[1px]" style={{ background: theme.accent }} />
                      <button
                        onClick={() => { onClose(); openEntries([recapData.randomMemory]); }}
                        className="font-medium tracking-[0.2em] text-xs uppercase hover:opacity-75 transition-all z-50 relative flex items-center gap-2"
                        style={{ color: theme.accent }}
                      >
                        Read Full Entry
                      </button>
                      <button
                        onClick={onClose}
                        className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-[0_8px_24px_rgba(0,0,0,0.15)] z-50 relative"
                        style={{ background: theme.accent, color: "#13161A" }}
                      >
                        <ArrowRight size={18} strokeWidth={2.5} />
                      </button>
                    </motion.div>
                  </div>
                )}

              </AnimatePresence>
            </motion.div>

            {/* Invisible Navigation Zones */}
            {!isFinal && (
              <>
                <div onClick={goPrev} className="absolute left-0 top-20 bottom-0 z-30 cursor-pointer w-[30%]" />
                <div onClick={goNext} className="absolute right-0 top-20 bottom-0 z-30 cursor-pointer w-[70%]" />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}