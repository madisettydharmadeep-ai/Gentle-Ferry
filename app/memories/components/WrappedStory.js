"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, MapPin, Sparkles, BookOpen, Users } from "lucide-react";
import AnimatedBackground from "../../components/AnimatedBackground";
import { getImageSrc } from "../../../app/components/PostcardView";
import { useEffect } from "react";

const TOTAL_STEPS = 6;

// Each slide has its own sophisticated, cozy light-pastel identity
const SLIDE_THEMES = [
  { bg: "#FAF6EE", text: "#3E2F27", accent: "#D48C7F", label: "linen" },    // Step 0 – Warm Antique Linen / Terracotta Rose
  { bg: "#F1F4EE", text: "#2B3A2C", accent: "#5E876B", label: "sage" },     // Step 1 – Pale Olive Sage / Forest Green
  { bg: "#F0F1FA", text: "#272B3A", accent: "#7A8AC4", label: "mist" },     // Step 2 – Delicate Mist Periwinkle / Slate Indigo
  { bg: "#FBF3EB", text: "#422C1D", accent: "#C58B64", label: "peach" },    // Step 3 – Sweet Honey Peach / Warm Caramel
  { bg: "#FAF0EF", text: "#40262A", accent: "#B97175", label: "rose" },     // Step 4 – Muted Petal Rose / Crimson
  { bg: "#F5EFE6", text: "#362C27", accent: "#A48364", label: "almond" },   // Step 5 – Cozy Almond Oats / Cinnamon
];

// Big typographic number stat component
function BigStat({ value, label, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="font-black leading-none tabular-nums"
        style={{ fontSize: "clamp(72px, 20vw, 110px)", letterSpacing: "-0.04em", color }}
      >
        {value}
      </div>
      <div
        className="font-bold uppercase mt-1"
        style={{ fontSize: 13, letterSpacing: "0.12em", color, opacity: 0.65 }}
      >
        {label}
      </div>
    </motion.div>
  );
}

// Pill tag
function Pill({ children, bg, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="font-black uppercase"
      style={{
        display: "inline-block",
        padding: "10px 20px",
        borderRadius: 100,
        fontSize: 13,
        letterSpacing: "0.06em",
        background: bg,
        color,
      }}
    >
      {children}
    </motion.div>
  );
}

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

  const goNext = () => !isFinal && setStep(step + 1);
  const goPrev = () => step > 0 && setStep(step - 1);

  return (
    <AnimatePresence>
      <motion.div
        key="wrapped-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] flex items-center justify-center"
        style={{
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {/* Ambient bg at very low opacity */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <AnimatedBackground weather={weather} showClouds={false} />
        </div>

        {/* THE CARD */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`card-${step}`}
            initial={{ opacity: 0, scale: 0.88, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -30 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col overflow-hidden w-full h-full md:w-[400px] md:h-[680px] md:rounded-[28px] md:shadow-[0_32px_80px_rgba(0,0,0,0.12)] md:border md:border-black/5"
            style={{
              background: theme.bg,
            }}
          >
          {/* Decorative circle blob */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: 320,
              height: 320,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.4)",
              top: -80,
              right: -80,
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.02)",
              bottom: -50,
              left: -50,
            }}
          />

          {/* Top bar: step indicator + close */}
          <div className="relative z-40 flex items-center justify-between px-6 pt-6 pb-2 flex-shrink-0">
            {/* Progress dots */}
            <div className="flex items-center gap-2">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: i === step ? 1 : 0.25, width: i === step ? 20 : 6 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    height: 6,
                    borderRadius: 3,
                    background: theme.text,
                  }}
                />
              ))}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-90"
              style={{ background: "rgba(0,0,0,0.05)", color: theme.text }}
            >
              <X size={14} strokeWidth={3} />
            </button>
          </div>

          {/* Slide content */}
          <div className="relative z-10 flex-1 flex flex-col justify-between px-7 pt-4 pb-6 overflow-hidden">
            <AnimatePresence mode="wait">

              {/* ── Step 0: Cover ── */}
              {step === 0 && (
                <motion.div
                  key="s0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col justify-between h-full"
                >
                  <div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="font-black uppercase mb-1"
                      style={{ fontSize: 11, letterSpacing: "0.4em", color: theme.text, opacity: 0.6 }}
                    >
                      your memories of
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.18 }}
                      className="font-black leading-none"
                      style={{ fontSize: "clamp(48px,14vw,72px)", letterSpacing: "-0.04em", color: theme.text }}
                    >
                      {MONTHS[viewMonth - 1]}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="font-black leading-none"
                      style={{ fontSize: "clamp(32px,9vw,48px)", letterSpacing: "-0.04em", color: theme.text, opacity: 0.55 }}
                    >
                      {viewYear}
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="self-center"
                  >
                    <motion.div
                      animate={{ rotate: [0, -8, 8, -4, 0], scale: [1, 1.08, 1] }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                      className="flex items-center justify-center"
                      style={{
                        width: 140,
                        height: 140,
                        borderRadius: 36,
                        background: "rgba(0,0,0,0.04)",
                      }}
                    >
                      <Heart size={64} style={{ color: theme.accent }} fill={theme.accent} />
                    </motion.div>
                  </motion.div>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.45 }}
                      style={{ fontSize: 15, color: theme.text, opacity: 0.7, lineHeight: 1.5 }}
                    >
                      A month of reflections,<br />captured by you.
                    </motion.p>
                  </motion.div>
                )}

                {/* ── Step 1: Activity ── */}
                {step === 1 && (
                  <motion.div
                    key="s1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col justify-between h-full"
                  >
                    <div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 mb-6"
                      >
                        <div
                          className="flex items-center justify-center"
                          style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(0,0,0,0.05)" }}
                        >
                          <BookOpen size={18} style={{ color: theme.accent }} />
                        </div>
                        <span className="font-black uppercase" style={{ fontSize: 11, letterSpacing: "0.3em", color: theme.text, opacity: 0.65 }}>
                          activity
                        </span>
                      </motion.div>

                      <BigStat value={entries.length} label="entries written" color={theme.text} delay={0.1} />
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        borderRadius: 20,
                        padding: "20px 24px",
                        background: "rgba(0,0,0,0.04)",
                        border: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      <div
                        className="font-black tabular-nums leading-none mb-1"
                        style={{ fontSize: "clamp(40px,11vw,60px)", letterSpacing: "-0.04em", color: theme.accent }}
                      >
                        {totalWords.toLocaleString()}
                      </div>
                      <div
                        className="font-bold uppercase"
                        style={{ fontSize: 12, letterSpacing: "0.1em", color: theme.text, opacity: 0.6 }}
                      >
                        words shared with yourself
                      </div>
                      <div
                        className="font-black italic mt-3 pt-3"
                        style={{ fontSize: 12, color: theme.text, opacity: 0.45, borderTop: "1px solid rgba(0,0,0,0.08)", lineHeight: 1.6 }}
                      >
                        "Every word is a footprint in time."
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* ── Step 2: Mood ── */}
                {step === 2 && (
                  <motion.div
                    key="s2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col justify-between h-full"
                  >
                    <div>
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-black uppercase mb-3"
                        style={{ fontSize: 11, letterSpacing: "0.4em", color: theme.text, opacity: 0.65 }}
                      >
                        your vibe
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-black leading-tight mb-6"
                        style={{ fontSize: "clamp(28px,8vw,40px)", letterSpacing: "-0.02em", color: theme.text }}
                      >
                        Mostly, you felt
                        <br />
                        <span style={{ opacity: 0.6 }}>{recapData.topMood}.</span>
                      </motion.div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {recapData.moodCounts.slice(0, 4).map(([m, c], idx) => (
                        <motion.div
                          key={m}
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + idx * 0.08 }}
                        >
                          <div
                            className="flex justify-between font-black uppercase mb-2"
                            style={{ fontSize: 11, letterSpacing: "0.1em", color: theme.text }}
                          >
                            <span>{m}</span>
                            <span style={{ opacity: 0.6 }}>{Math.round((c / entries.length) * 100)}%</span>
                          </div>
                          <div style={{ height: 8, borderRadius: 4, background: "rgba(0,0,0,0.06)" }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(c / entries.length) * 100}%` }}
                              transition={{ delay: 0.2 + idx * 0.09, duration: 0.9, ease: "easeOut" }}
                              style={{ height: "100%", borderRadius: 4, background: theme.accent }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ── Step 3: Connections ── */}
                {step === 3 && (
                  <motion.div
                    key="s3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col justify-between h-full"
                  >
                    <div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 mb-4"
                      >
                        <div
                          style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                          <Users size={18} style={{ color: theme.accent }} />
                        </div>
                        <span className="font-black uppercase" style={{ fontSize: 11, letterSpacing: "0.3em", color: theme.text, opacity: 0.65 }}>
                          connections
                        </span>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <BigStat
                          value={allPeopleMap.size}
                          label="people in your life"
                          color={theme.accent}
                          delay={0.15}
                        />
                      </motion.div>
                    </div>

                    <div className="flex flex-wrap" style={{ gap: 8 }}>
                      {peopleList.slice(0, 9).map(([p], i) => (
                        <Pill key={p} bg="rgba(0,0,0,0.05)" color={theme.text} delay={0.1 + i * 0.05}>
                          {p}
                        </Pill>
                      ))}
                      {allPeopleMap.size === 0 && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          style={{ fontSize: 16, color: theme.text, opacity: 0.7, lineHeight: 1.6 }}
                        >
                          This month was a quiet journey of self-reflection.
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ── Step 4: Places ── */}
                {step === 4 && (
                  <motion.div
                    key="s4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col justify-between h-full"
                  >
                    <div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 mb-4"
                      >
                        <div
                          style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                          <MapPin size={18} style={{ color: theme.accent }} />
                        </div>
                        <span className="font-black uppercase" style={{ fontSize: 11, letterSpacing: "0.3em", color: theme.text, opacity: 0.65 }}>
                          places
                        </span>
                      </motion.div>

                      <BigStat
                        value={allPlacesMap.size}
                        label="spots explored"
                        color={theme.accent}
                        delay={0.1}
                      />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {placesList.slice(0, 3).map(([p, ent], i) => (
                        <motion.div
                          key={p}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                          className="flex items-center justify-between"
                          style={{
                            background: "rgba(0,0,0,0.04)",
                            border: "1px solid rgba(0,0,0,0.05)",
                            borderRadius: 16,
                            padding: "14px 18px",
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="font-black tabular-nums"
                              style={{ fontSize: 20, color: theme.text, opacity: 0.3, width: 24, textAlign: "center" }}
                            >
                              {i + 1}
                            </div>
                            <div>
                              <div
                                className="font-black uppercase"
                                style={{ fontSize: 13, letterSpacing: "0.05em", color: theme.text }}
                              >
                                {p}
                              </div>
                              <div style={{ fontSize: 12, color: theme.text, opacity: 0.5, marginTop: 2 }}>
                                {ent.length} {ent.length === 1 ? "entry" : "entries"}
                              </div>
                            </div>
                          </div>
                          <MapPin size={16} style={{ color: theme.accent, opacity: 0.7 }} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ── Step 5: Memory ── */}
                {step === 5 && (
                  <motion.div
                    key="s5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col justify-between h-full"
                  >
                    <div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 mb-5"
                      >
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Sparkles size={18} style={{ color: theme.accent }} />
                        </div>
                        <span className="font-black uppercase" style={{ fontSize: 11, letterSpacing: "0.3em", color: theme.text, opacity: 0.65 }}>
                          a moment to remember
                        </span>
                      </motion.div>

                      {/* Memory card */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        style={{ borderRadius: 20, overflow: "hidden", background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)" }}
                      >
                        {recapData.randomMemory?.driveImageUrl && (
                          <div style={{ height: 160, overflow: "hidden" }}>
                            <img
                              src={getImageSrc(recapData.randomMemory)}
                              alt=""
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          </div>
                        )}
                        <div style={{ padding: "16px 18px" }}>
                          <div
                            className="font-black uppercase mb-2"
                            style={{ fontSize: 10, letterSpacing: "0.2em", color: theme.accent, opacity: 0.8 }}
                          >
                            {MONTHS[viewMonth - 1]}{" "}
                            {recapData.randomMemory?.entryDate
                              ? new Date(recapData.randomMemory.entryDate).getDate()
                              : ""}
                          </div>
                          <p
                            className="font-semibold italic leading-relaxed"
                            style={{
                              fontSize: 14,
                              color: theme.text,
                              opacity: 0.85,
                              lineHeight: 1.55,
                              display: "-webkit-box",
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            "{recapData.randomMemory?.text || "A quiet moment of reflection."}"
                          </p>
                        </div>
                      </motion.div>
                    </div>

                    {/* Action buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      style={{ display: "flex", flexDirection: "column", gap: 10 }}
                    >
                      <button
                        onClick={() => { onClose(); openEntries([recapData.randomMemory]); }}
                        className="w-full font-black uppercase cursor-pointer active:scale-95 transition-all"
                        style={{
                          padding: "14px 0",
                          borderRadius: 14,
                          fontSize: 12,
                          letterSpacing: "0.15em",
                          background: "rgba(0,0,0,0.05)",
                          color: theme.text,
                          border: "1px solid rgba(0,0,0,0.08)",
                        }}
                      >
                        Read full entry →
                      </button>
                      <button
                        onClick={onClose}
                        className="w-full font-black uppercase cursor-pointer active:scale-95 transition-all"
                        style={{
                          padding: "14px 0",
                          borderRadius: 14,
                          fontSize: 12,
                          letterSpacing: "0.15em",
                          background: theme.accent,
                          color: "#FFFFFF",
                          border: "none",
                        }}
                      >
                        Finish ✦
                      </button>
                    </motion.div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Hint text overlay at the bottom of the card */}
            {!isFinal && (
              <motion.div
                key={`hint-${step}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-4 left-0 right-0 text-center font-black uppercase pointer-events-none z-40"
                style={{ fontSize: 9, letterSpacing: "0.3em", color: theme.text, opacity: 0.35 }}
              >
                {/* tap to continue */}
              </motion.div>
            )}

            {/* Bottom tap zones (prev / next) – invisible, full-height side strips */}
            {!isFinal && (
              <>
                <div
                  onClick={goPrev}
                  className="absolute left-0 top-0 bottom-0 z-30 cursor-pointer"
                  style={{ width: "30%" }}
                />
                <div
                  onClick={goNext}
                  className="absolute right-0 top-0 bottom-0 z-30 cursor-pointer"
                  style={{ width: "70%" }}
                />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}