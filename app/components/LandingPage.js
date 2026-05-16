"use client";

import { useState, useMemo, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../utils/AuthContext";
import { useRouter } from "next/navigation";
import KoFiButton from "./KoFiButton";
import {
  ArrowRight,
  Heart,
  Coffee,
  Loader2,
  X,
  ImagePlus,
  NotebookPen,
  Highlighter,
  Lock,
  Feather,
  ShieldCheck,
  HardDrive,
  Sparkles,
  Check,
  Infinity,
  Star,
  Instagram,
  Twitter,
  Globe,
} from "lucide-react";
import PostcardView from "./PostcardView";

const TUTORIALS = [
  {
    _id: "t1",
    entryDate: new Date("2026-04-12T10:00:00Z").toISOString(),
    text: "Gentle Ferry is a cozy corner for those little moments that make life beautiful. A sunset, a coffee with a friend, or just a quiet thought -- capture it here and keep it close to your heart. Use our pastel markers to highlight the words that matter most",
    imageBase64:
      "https://i.pinimg.com/736x/b5/7b/a3/b57ba3256ef17e43992667b13aa2e5fe.jpg",
    mood: "joyful",
    highlights: [
      {
        phrase: "a cozy corner",
        bg: "rgba(255, 182, 193, 0.4)",
        color: "#ff69b4",
      },
      {
        phrase: "the words that matter most",
        bg: "rgba(128, 216, 255, 0.4)",
        color: "#0ea5e9",
      },
    ],
  },
  {
    _id: "t2",
    entryDate: new Date("2026-04-11T14:30:00Z").toISOString(),
    text: "Life is better shared. Mention @friends you spent time with or #places you have discovered. We will automatically bring them together in your gallery, building a map of your most cherished connections. Highlights work on mentions too",
    imageBase64:
      "https://i.pinimg.com/736x/32/71/ac/3271acbaa3e559a2db9defcc837ccd15.jpg",
    mood: "calm",
    highlights: [
      {
        phrase: "cherished connections",
        bg: "rgba(185, 246, 202, 0.4)",
        color: "#16a34a",
      },
      {
        phrase: "Highlights work on mentions too",
        bg: "rgba(255, 138, 128, 0.3)",
        color: "#ef4444",
      },
    ],
  },
  {
    _id: "t3",
    entryDate: new Date("2026-04-10T19:15:00Z").toISOString(),
    text: "Your photos deserve a safe home. Every image you add is uploaded directly to your personal Google Drive, keeping your visual memories secure and private. It is your own personal gallery, synced to a space you already trust.",
    imageBase64:
      "https://i.pinimg.com/1200x/1a/2a/bd/1a2abdd5250a5b4b85f82b71f09cb4ca.jpg",
    mood: "low",
    highlights: [
      {
        phrase: "secure and private",
        bg: "rgba(255, 255, 141, 0.4)",
        color: "#ca8a04",
      },
      {
        phrase: "space you already trust",
        bg: "rgba(234, 128, 252, 0.3)",
        color: "#9333ea",
      },
    ],
  },
];

const AVATAR_GIFS = [
  "https://media1.tenor.com/m/EvV2yv9uuhEAAAAC/luffy-luffing.gif",
  "https://media1.tenor.com/m/l54b4QxkuRUAAAAC/luffy-luffy-one-piece.gif",
  "https://media1.tenor.com/m/6OJbJR-mRTsAAAAC/bleach-watching.gif",
  "https://media.tenor.com/KUXIWC9D5_UAAAAi/my-hero-academia-boku-no-hero-academia.gif",
  "https://media1.tenor.com/m/sVZ7b5BkkJAAAAAC/gojo-satoru-yakana.gif",
];

export default function LandingPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTutorial, setActiveTutorial] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const [randomAvatar, setRandomAvatar] = useState(AVATAR_GIFS[0]);
  useEffect(() => {
    setRandomAvatar(
      AVATAR_GIFS[Math.floor(Math.random() * AVATAR_GIFS.length)],
    );
  }, []);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: tokenResponse.code }),
        });
        const data = await res.json();
        if (data.success) {
          login(data.user);
          router.push("/dashboard");
        } else {
          setError("Sign-in failed. Please try again.");
        }
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError("Google sign-in was cancelled."),
    flow: "auth-code",
    scope: [
      "openid",
      "email",
      "profile",
      "https://www.googleapis.com/auth/drive.file",
    ].join(" "),
    access_type: "offline",
    prompt: "consent",
  });

  return (
    <div className="min-h-screen bg-cream text-ink relative overflow-hidden">
      {/* ── Premium Background Elements ── */}
      {/* Dynamic Cursor Spotlight */}
      <div 
        className="fixed inset-0 pointer-events-none z-10 opacity-30 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 182, 193, 0.15), transparent 80%)`,
        }}
      />

      {/* Film Grain Texture */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-line) 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
          opacity: 0.25,
        }}
      />

      {/* Animated Blobs */}
      <div className="absolute top-[-10%] left-[-15%] w-[50%] h-[50%] bg-blush/10 rounded-full blur-[140px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[45%] h-[45%] bg-honey/10 rounded-full blur-[140px] animate-pulse [animation-delay:2s] pointer-events-none" />
      <div className="absolute top-[30%] right-[-5%] w-[35%] h-[35%] bg-sage/5 rounded-full blur-[120px] animate-pulse [animation-delay:4s] pointer-events-none" />
      <div className="absolute top-[60%] left-[-5%] w-[30%] h-[30%] bg-sky/5 rounded-full blur-[100px] animate-pulse [animation-delay:6s] pointer-events-none" />
      <div className="absolute top-[60%] left-[-5%] w-[30%] h-[30%] bg-sky/5 rounded-full blur-[100px] animate-pulse [animation-delay:6s] pointer-events-none" />

      {/* ── Margin Accents (Design Professional Touch) ── */}
      <div className="hidden lg:flex fixed left-8 xl:left-12 top-0 bottom-0 flex-col justify-between py-12 z-0 pointer-events-none">
        <div className="w-px h-32 bg-gradient-to-b from-line to-transparent opacity-40 mx-auto" />
        <div className="[writing-mode:vertical-rl] select-none opacity-20">
          <span className="text-[9px] font-bold tracking-[0.6em] text-ink uppercase">
            Gentle Ferry / Begin your journey
          </span>
        </div>
        <div className="w-px h-32 bg-gradient-to-t from-line to-transparent opacity-40 mx-auto" />
      </div>

      <div className="hidden lg:flex fixed right-8 xl:right-12 top-0 bottom-0 flex-col justify-between py-12 z-0 pointer-events-none">
        <div className="w-px h-32 bg-gradient-to-b from-line to-transparent opacity-40 mx-auto" />
        <div className="[writing-mode:vertical-rl] rotate-180 select-none opacity-20">
          <span className="text-[9px] font-bold tracking-[0.6em] text-ink uppercase">
            EST. 2026 / Built with heart
          </span>
        </div>
        <div className="w-px h-32 bg-gradient-to-t from-line to-transparent opacity-40 mx-auto" />
      </div>

      {/* Side Framing Lines */}
      <div className="hidden 2xl:block fixed left-24 top-0 bottom-0 w-px bg-line/10 z-0" />
      <div className="hidden 2xl:block fixed right-24 top-0 bottom-0 w-px bg-line/10 z-0" />

      <div className="relative z-10">
        {/* ── Header ── */}
        <header className="px-4 sm:px-8 py-4 sm:py-5 flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-blush-light flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Heart className="w-4 h-4 text-blush fill-current" />
            </div>
            <span className="font-bold text-lg text-ink tracking-tight">
              Gentle Ferry
            </span>
          </div>
          <button
            className="text-ink-faint hover:text-ink transition-colors text-sm font-medium"
            onClick={() => handleGoogleLogin()}
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "sign in"
            )}
          </button>
        </header>

        {/* ── Main ── */}
        <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-10 sm:pt-16 pb-16 sm:pb-24">
          {/* Hero */}
          <section className="mb-12 sm:mb-20 animate-fadeIn">
            {/* <div className="flex items-center gap-2 text-blush mb-6">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span className="text-sm font-medium">a tiny passion project</span>
          </div> */}

            <h1 className="text-[2rem] sm:text-[3rem] md:text-[5rem] font-bold text-ink leading-[1.05] mb-5 sm:mb-7 tracking-[-0.04em] text-center animate-fadeIn">
              Keep a little journal
              <br />
              <span className="bg-gradient-to-r from-blush via-[#9a78cf] to-honey bg-clip-text text-transparent">
                for the days that matter.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-center text-ink-soft leading-relaxed mb-10 max-w-3xl mx-auto opacity-0 animate-fadeIn [animation-delay:200ms]">
              Gentle Ferry is a calm, private space to write. Add a photo, jot a
              few lines — your photos are saved safely to your own Google Drive.
            </p>

            <div className="w-full flex justify-center opacity-0 animate-fadeIn [animation-delay:400ms]">
              <button
                onClick={() => handleGoogleLogin()}
                disabled={loading}
                className="w-full sm:w-auto min-w-[240px] inline-flex justify-center items-center gap-2 bg-blush text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blush-hover transition-all active:scale-[0.97] disabled:opacity-60 shadow-xl shadow-blush/20 animate-gleam"
              >
                {loading ? (
                  <Loader2 size={22} className="animate-spin" />
                ) : (
                  <>
                    start writing{" "}
                    <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                  </>
                )}
              </button>
            </div>

            {error && (
              <p className="mt-5 text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-lg border border-red-100 w-fit">
                {error}
              </p>
            )}
          </section>

          {/* Preview Cards */}
          <section className="mb-14 sm:mb-24 opacity-0 animate-fadeIn [animation-delay:500ms]">
            <h2 className="text-[10px] font-black text-ink-faint uppercase tracking-[0.3em] mb-6 sm:mb-10 text-center">
              made with Gentle Ferry
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8">
              {TUTORIALS.map((c, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] bg-muted rounded-lg overflow-hidden border border-line shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 cursor-pointer relative group"
                  onClick={() => setActiveTutorial(c)}
                >
                  <img
                    src={c.imageBase64}
                    alt={`Tutorial ${i + 1}`}
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[3px]">
                    <span className="text-white font-bold tracking-[0.2em] uppercase text-[10px] border border-white/40 px-6 py-3 rounded-full bg-white/10 shadow-xl scale-90 group-hover:scale-100 transition-transform duration-500">
                      Read Entry
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-[10px] font-medium text-ink-faint text-center leading-relaxed tracking-wide opacity-60">
              ✦ these are just little previews to show you what a journal entry
              feels like — photos are placeholders only 🌸
            </p>
          </section>

          {/* Story */}
          <section className="mb-14 sm:mb-24 opacity-0 animate-fadeIn [animation-delay:700ms]">
            <div className="relative overflow-hidden rounded-lg border border-white/50 shadow-lg bg-white/40 backdrop-blur-xl px-5 sm:px-12 py-10 sm:py-16 flex flex-col md:flex-row gap-8 sm:gap-14 items-center group">
              {/* Floating avatar */}
              <div className="shrink-0 flex flex-col items-center gap-4">
                <div className="w-40 h-40 rounded-full overflow-hidden border-8 border-white shadow-2xl ring-4 ring-blush/10 animate-float">
                  <img
                    src={randomAvatar}
                    alt="me"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <span className="text-[10px] font-black text-ink-faint uppercase tracking-[0.4em]">
                  the story
                </span>
              </div>
              {/* Content */}
              <div className="flex-1">
                <p className="font-bold text-4xl md:text-6xl text-ink mb-6 leading-tight tracking-tight">
                  hey,
                  <br />
                  it's me! 👋
                </p>
                <p className="text-ink-soft leading-relaxed max-w-sm mb-6 text-lg font-medium">
                  I built this because I wanted a quiet, simple place to keep my
                  thoughts. No ads, no noise — just you and your days. 💌
                </p>
                <a 
                  href="https://kazamastudio.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-base font-black text-blush hover:text-blush-hover transition-all mb-8 group tracking-wide"
                >
                  view my portfolio (Kazama Studio) <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" strokeWidth={3} />
                </a>
                <div className="flex flex-wrap gap-3">
                  {[
                    {
                      label: "no ads",
                      color: "bg-blush/10 text-blush border-blush/20",
                    },
                    {
                      label: "privacy first",
                      color: "bg-sage/10 text-sage border-sage/20",
                    },
                    {
                      label: "open source",
                      color: "bg-sky/10 text-sky border-sky/20",
                    },
                    {
                      label: "cute only",
                      color: "bg-honey/10 text-[#8B6914] border-honey/30",
                    },
                  ].map((t) => (
                    <span
                      key={t.label}
                      className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${t.color}`}
                    >
                      {t.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* What you can do */}
          <section className="mb-14 sm:mb-24 opacity-0 animate-fadeIn [animation-delay:900ms]">
            <span className="text-[10px] font-black text-ink-faint uppercase tracking-[0.4em] mb-8 block">
              what you can do
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  icon: ImagePlus,
                  title: "drop in photos",
                  desc: "Every image goes straight to your Google Drive — safe, private, yours.",
                  accent: "border-honey bg-honey/5",
                  iconColor: "text-[#8B6914] bg-honey/15 shadow-honey/20",
                },
                {
                  icon: NotebookPen,
                  title: "write little notes",
                  desc: "Capture a feeling, a quote, or a whole story. No pressure, no word count.",
                  accent: "border-blush bg-blush/5",
                  iconColor: "text-blush bg-blush/15 shadow-blush/20",
                },
                {
                  icon: Highlighter,
                  title: "magic highlights",
                  desc: "Paint over words with pastel markers. Tag moods, moments, and people.",
                  accent: "border-sky bg-sky/5",
                  iconColor: "text-sky bg-sky/15 shadow-sky/20",
                },
                {
                  icon: Lock,
                  title: "totally private",
                  desc: "Your journal is yours. No sharing, no algorithms, no eyes but your own.",
                  accent: "border-lavender bg-lavender/5",
                  iconColor: "text-lavender bg-lavender/15 shadow-lavender/20",
                },
              ].map((f, i) => (
                <div
                  key={f.title}
                  className={`rounded-lg border-2 ${f.accent} p-8 flex gap-6 items-start hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group`}
                >
                  <span
                    className={`shrink-0 mt-0.5 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6 ${f.iconColor}`}
                  >
                    <f.icon className="w-7 h-7" strokeWidth={2.5} />
                  </span>
                  <div>
                    <p className="font-bold text-ink text-xl mb-2 tracking-tight">
                      {f.title}
                    </p>
                    <p className="text-ink-soft text-base leading-relaxed font-medium">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing */}
          <section className="mb-14 sm:mb-24">
            <div className="mb-7 sm:mb-10">
              <span className="text-xs font-bold text-ink-faint uppercase tracking-[0.18em] mb-3 block">
                simple pricing
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-ink leading-tight tracking-[-0.02em]">
                free, forever.
                <br />
                <span className="text-ink-faint font-medium text-2xl md:text-3xl">
                  or buy us a coffee if you love it.
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Free tier */}
              <div className="relative rounded-lg border-2 border-line bg-white/80 backdrop-blur p-8 flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-xs font-bold text-ink-faint uppercase tracking-[0.18em] mb-1">
                      always free
                    </p>
                    <p className="text-4xl font-bold text-ink tracking-tight">
                      $0
                    </p>
                    <p className="text-ink-faint text-sm mt-1">
                      no card, no catch
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <Heart className="w-5 h-5 text-blush fill-current" />
                  </div>
                </div>
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {[
                    "unlimited journal entries",
                    "photos saved to your Google Drive",
                    "pastel highlights + mood tagging",
                    "@people and #places tagging",
                    "calendar memory view",
                    "fully private — only you can see it",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-3 text-sm text-ink"
                    >
                      <span className="w-5 h-5 rounded-full bg-sage/15 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-sage" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleGoogleLogin()}
                  disabled={loading}
                  className="w-full py-3 rounded-xl border-2 border-line font-bold text-ink hover:border-ink transition-all active:scale-[0.98] text-sm"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin mx-auto" />
                  ) : (
                    "get started — free"
                  )}
                </button>
              </div>

              {/* Buy me a coffee */}
              <div className="relative rounded-lg border-2 border-honey/40 bg-gradient-to-br from-honey-light/60 via-white to-blush-light/40 backdrop-blur p-8 flex flex-col overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-honey/20 rounded-full blur-[60px] pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blush/10 rounded-full blur-[50px] pointer-events-none" />

                <div className="relative flex-1 flex flex-col">
                  <div className="w-12 h-12 rounded-lg bg-honey/20 flex items-center justify-center mb-5">
                    <Coffee className="w-5 h-5 text-[#8B6914]" />
                  </div>

                  <p className="text-xs font-bold text-[#8B6914] uppercase tracking-[0.18em] mb-3">
                    from the maker
                  </p>

                  <p className="text-xl font-bold text-ink leading-snug mb-4 tracking-tight">
                    hey, i built this for you.
                    <br />
                    completely free.
                  </p>

                  <p className="text-ink-soft text-sm leading-relaxed mb-4">
                    Gentle Ferry is a passion project — just me, late nights,
                    and a lot of coffee. there's no company behind this, no
                    investors, no ads. just someone who wanted a quiet little
                    place to journal and thought you might want one too.
                  </p>

                  <p className="text-ink-soft text-sm leading-relaxed mb-8">
                    if it made your day a little softer, a coffee would
                    genuinely mean the world to me. no pressure — ever.
                  </p>

                  <KoFiButton />
                </div>
              </div>
            </div>

            {/* Bottom reassurance */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-ink-faint">
              <Infinity className="w-4 h-4" strokeWidth={2} />
              <span>
                the free plan is genuinely unlimited — no hidden walls, ever.
              </span>
            </div>
          </section>

          {/* CTA */}
          <section className="mb-8 px-0 sm:px-8 sm:-mx-8">
            <div className="relative overflow-hidden rounded-lg border border-line shadow-sm min-h-[320px] flex flex-col md:flex-row">
              {/* Left image */}
              <div className="md:w-2/5 shrink-0 relative min-h-[220px] md:min-h-0">
                <img
                  src="https://i.pinimg.com/1200x/97/f5/d1/97f5d1e93162be9c057a6e95cc19f8df.jpg"
                  alt="journal preview"
                  className="absolute inset-0 w-full h-full object-cover object-left"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blush/10 hidden md:block" />
              </div>
              {/* Right content */}
              <div className="flex-1 text-center bg-gradient-to-br from-blush-light/60 via-cream to-honey-light/40 flex flex-col justify-center iten-center px-10 py-12">
                <p className="text-xs font-bold text-ink-faint uppercase tracking-[0.2em] mb-3">
                  psst...
                </p>
                <p className="text-3xl md:text-5xl font-bold text-ink leading-tight mb-3">
                  ready to start
                  <br />
                  your journal?
                </p>
                <p className="text-ink-soft mb-8 text-base">
                  It only takes a second. No credit card, no fuss.
                </p>
                <div className="flex flex-wrap gap-3 items-center justify-center">
                  <button
                    onClick={() => handleGoogleLogin()}
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-blush text-white px-8 py-3.5 rounded-full font-bold text-lg hover:bg-blush-hover transition-all active:scale-[0.97] disabled:opacity-60 shadow-sm"
                  >
                    {loading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        yes, let's go{" "}
                        <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer — full width outside main */}
        <footer className="relative w-full border-t border-line bg-muted overflow-hidden">
          {/* Dot grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(var(--color-line-strong) 1.5px, transparent 1.5px)",
              backgroundSize: "28px 28px",
              opacity: 0.4,
            }}
          />
          {/* Blobs */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-blush/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-honey/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-10 pt-14 pb-10">
            {/* Top row: brand + pills */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-10">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-blush-light flex items-center justify-center">
                    <Heart className="w-4 h-4 text-blush fill-current" />
                  </div>
                  <span className="font-bold text-xl text-ink tracking-tight">
                    Gentle Ferry
                  </span>
                </div>
                <p className="text-ink-faint text-sm leading-relaxed max-w-xs">
                  a quiet little journal for the moments that make life
                  beautiful.
                </p>
              </div>

              {/* Feature pills & Socials */}
              <div className="flex flex-col items-start md:items-end gap-5">
                <div className="flex flex-wrap md:justify-end gap-2">
                  {[
                    {
                      icon: Feather,
                      label: "write freely",
                      color: "text-blush border-blush/20 bg-blush/5",
                    },
                    {
                      icon: HardDrive,
                      label: "your drive",
                      color: "text-[#8B6914] border-honey/30 bg-honey/5",
                    },
                    {
                      icon: ShieldCheck,
                      label: "private",
                      color: "text-sage border-sage/20 bg-sage/5",
                    },
                    {
                      icon: Sparkles,
                      label: "highlights",
                      color: "text-lavender border-lavender/20 bg-lavender/5",
                    },
                  ].map((f) => (
                    <span
                      key={f.label}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${f.color}`}
                    >
                      <f.icon className="w-3.5 h-3.5" strokeWidth={2} />
                      {f.label}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-3">
                  <a href="https://kazamastudio.vercel.app/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white border border-line shadow-sm flex items-center justify-center text-ink-faint hover:text-[#8B6914] hover:border-[#8B6914]/30 hover:bg-[#8B6914]/5 transition-all" aria-label="Portfolio">
                    <Globe size={14} />
                  </a>
                  <a href="https://x.com/Bot_code_2003" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white border border-line shadow-sm flex items-center justify-center text-ink-faint hover:text-sky hover:border-sky/30 hover:bg-sky/5 transition-all" aria-label="Twitter">
                    <Twitter size={14} />
                  </a>
                  <a href="https://www.instagram.com/kazama_studio/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white border border-line shadow-sm flex items-center justify-center text-ink-faint hover:text-lavender hover:border-lavender/30 hover:bg-lavender/5 transition-all" aria-label="Instagram">
                    <Instagram size={14} />
                  </a>
                </div>
              </div>
            </div>

            {/* Giant wordmark */}
            <div className="border-t border-line pt-8 mb-8">
              <p
                className="font-bold leading-none tracking-[-0.05em] select-none"
                style={{
                  fontSize: "clamp(3.5rem, 10vw, 7rem)",
                  background:
                    "linear-gradient(135deg, var(--color-line-strong) 0%, var(--color-blush) 50%, var(--color-line-strong) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Gentle Ferry
              </p>
            </div>

            {/* Bottom bar */}
            <div className="flex flex-col gap-4">
              {/* Top row: copyright + nav links */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <p className="text-[11px] text-ink-faint tracking-wide">
                  made with{" "}
                  <Heart
                    size={9}
                    className="inline text-blush fill-current mx-0.5"
                  />{" "}
                  and a lot of coffee — © 2026 Gentle Ferry
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-ink-faint uppercase tracking-[0.18em]">
                  <a href="/" className="hover:text-blush transition-colors">
                    home
                  </a>
                  <span className="text-line-strong">·</span>
                  <a
                    href="/privacy"
                    className="hover:text-ink transition-colors"
                  >
                    privacy
                  </a>
                  <span className="text-line-strong">·</span>
                  <a href="/terms" className="hover:text-ink transition-colors">
                    terms
                  </a>
                </div>
              </div>
              {/* BMAC #4 — full-width on mobile, auto on desktop */}
            </div>
          </div>
        </footer>

        {/* ── Tutorial Modal Overlay ── */}
        {activeTutorial && (
          <div
            className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-fadeIn"
            onClick={() => setActiveTutorial(null)}
          >
            <div
              className="relative w-full max-w-4xl max-h-[80vh] overflow-y-auto rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="sticky top-2 float-right mr-2 z-10 text-white hover:text-blush-light transition-colors flex items-center gap-2 font-medium bg-ink/40 px-3 py-1.5 rounded-full text-sm backdrop-blur-sm"
                onClick={() => setActiveTutorial(null)}
              >
                Close <X size={16} />
              </button>
              <PostcardView
                entry={{
                  ...activeTutorial,
                  highlights: activeTutorial.highlights?.map((h) => {
                    if (typeof h.phrase === "string") {
                      const start = activeTutorial.text.indexOf(h.phrase);
                      if (start !== -1) {
                        return { ...h, start, end: start + h.phrase.length };
                      }
                    }
                    return h;
                  }),
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
