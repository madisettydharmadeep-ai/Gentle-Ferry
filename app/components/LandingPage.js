'use client';

import { useState, useMemo, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../utils/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowRight, Heart, Coffee, Loader2, X, ImagePlus, NotebookPen, Highlighter, Lock, Feather, ShieldCheck, HardDrive, Sparkles, Check, Infinity, Star } from 'lucide-react';
import PostcardView from './PostcardView';

const TUTORIALS = [
  {
    _id: "t1",
    entryDate: new Date('2026-04-12T10:00:00Z').toISOString(),
    text: "Gentle Ferry is a cozy corner for those little moments that make life beautiful. A sunset, a coffee with a friend, or just a quiet thought -- capture it here and keep it close to your heart. Use our pastel markers to highlight the words that matter most",
    imageBase64: 'https://i.pinimg.com/736x/b5/7b/a3/b57ba3256ef17e43992667b13aa2e5fe.jpg',
    mood: 'joyful',
    highlights: [
      { phrase: "a cozy corner", bg: 'rgba(255, 182, 193, 0.4)', color: '#ff69b4' },
      { phrase: "the words that matter most", bg: 'rgba(128, 216, 255, 0.4)', color: '#0ea5e9' }
    ]
  },
  {
    _id: "t2",
    entryDate: new Date('2026-04-11T14:30:00Z').toISOString(),
    text: "Life is better shared. Mention @friends you spent time with or #places you have discovered. We will automatically bring them together in your gallery, building a map of your most cherished connections. Highlights work on mentions too",
    imageBase64: 'https://i.pinimg.com/736x/32/71/ac/3271acbaa3e559a2db9defcc837ccd15.jpg',
    mood: 'calm',
    highlights: [
      { phrase: "cherished connections", bg: 'rgba(185, 246, 202, 0.4)', color: '#16a34a' },
      { phrase: "Highlights work on mentions too", bg: 'rgba(255, 138, 128, 0.3)', color: '#ef4444' }
    ]
  },
  {
    _id: "t3",
    entryDate: new Date('2026-04-10T19:15:00Z').toISOString(),
    text: "Your photos deserve a safe home. Every image you add is uploaded directly to your personal Google Drive, keeping your visual memories secure and private. It is your own personal gallery, synced to a space you already trust.",
    imageBase64: 'https://i.pinimg.com/1200x/1a/2a/bd/1a2abdd5250a5b4b85f82b71f09cb4ca.jpg',
    mood: 'low',
    highlights: [
      { phrase: "secure and private", bg: 'rgba(255, 255, 141, 0.4)', color: '#ca8a04' },
      { phrase: "space you already trust", bg: 'rgba(234, 128, 252, 0.3)', color: '#9333ea' }
    ]
  }
];

const AVATAR_GIFS = [
  'https://media1.tenor.com/m/EvV2yv9uuhEAAAAC/luffy-luffing.gif',
  'https://media1.tenor.com/m/l54b4QxkuRUAAAAC/luffy-luffy-one-piece.gif',
  'https://media1.tenor.com/m/6OJbJR-mRTsAAAAC/bleach-watching.gif',
  'https://media.tenor.com/KUXIWC9D5_UAAAAi/my-hero-academia-boku-no-hero-academia.gif',
  'https://media1.tenor.com/m/sVZ7b5BkkJAAAAAC/gojo-satoru-yakana.gif',
];

export default function LandingPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTutorial, setActiveTutorial] = useState(null);

  const [randomAvatar, setRandomAvatar] = useState(AVATAR_GIFS[0]);
  useEffect(() => {
    setRandomAvatar(AVATAR_GIFS[Math.floor(Math.random() * AVATAR_GIFS.length)]);
  }, []);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: tokenResponse.code }),
        });
        const data = await res.json();
        if (data.success) {
          login(data.user);
          router.push('/dashboard');
        } else {
          setError('Sign-in failed. Please try again.');
        }
      } catch {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Google sign-in was cancelled.'),
    flow: 'auth-code',
    scope: [
      'openid', 'email', 'profile',
      'https://www.googleapis.com/auth/drive.file',
    ].join(' '),
    access_type: 'offline',
    prompt: 'consent',
  });

  return (
    <div className="min-h-screen bg-cream text-ink relative overflow-hidden">
      {/* ── Premium Background Elements ── */}
      <div 
        className="absolute inset-0 pointer-events-none z-0" 
        style={{ 
          backgroundImage: 'radial-gradient(var(--color-line) 1.5px, transparent 1.5px)', 
          backgroundSize: '32px 32px', 
          opacity: 0.25 
        }} 
      />
      
      {/* Animated Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blush/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-honey/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s] pointer-events-none" />
      <div className="absolute top-[40%] right-[10%] w-[25%] h-[25%] bg-sage/5 rounded-full blur-[100px] animate-pulse [animation-delay:4s] pointer-events-none" />

      <div className="relative z-10">

      {/* ── Header ── */}
      <header className="px-4 sm:px-8 py-4 sm:py-5 flex justify-between items-center max-w-4xl mx-auto">
        <div className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-blush-light flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Heart className="w-4 h-4 text-blush fill-current" />
          </div>
          <span className="font-bold text-lg text-ink tracking-tight">Gentle Ferry</span>
        </div>
        <button
          className="text-ink-faint hover:text-ink transition-colors text-sm font-medium"
          onClick={() => handleGoogleLogin()}
          disabled={loading}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : 'sign in'}
        </button>
      </header>

      {/* ── Main ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 pt-10 sm:pt-16 pb-16 sm:pb-24">

        {/* Hero */}
        <section className="mb-12 sm:mb-20 animate-fadeIn">
          {/* <div className="flex items-center gap-2 text-blush mb-6">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span className="text-sm font-medium">a tiny passion project</span>
          </div> */}

          <h1 className="text-[2rem] sm:text-[3rem] md:text-[4.5rem] font-bold text-ink leading-[1.08] mb-5 sm:mb-7 tracking-[-0.03em] text-center">
            Keep a little journal<br />
            for the days that matter.
          </h1>

          <p className="text-base sm:text-lg text-center text-ink-soft leading-relaxed mb-7 sm:mb-10 max-w-3xl mx-auto">
            Gentle Ferry is a calm, private space to write.
            Add a photo, jot a few lines — your photos
            are saved safely to your own Google Drive.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleGoogleLogin()}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-blush text-white px-7 py-3 rounded-full font-bold hover:bg-blush-hover transition-all active:scale-[0.97] disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>start writing <ArrowRight className="w-4 h-4" strokeWidth={2.5} /></>
              )}
            </button>

            <a
              href="https://buymeacoffee.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold bg-honey-light border-2 border-honey/40 text-[#8B6914] hover:scale-105 hover:shadow-[0_4px_20px_rgba(242,201,76,0.3)] hover:border-honey transition-all active:scale-[0.97] overflow-hidden"
            >
              <span className="absolute inset-0 bg-honey/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
              <Coffee className="w-4 h-4 relative" />
              <span className="relative">buy me a coffee</span>
            </a>
          </div>

          {error && (
            <p className="mt-5 text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-lg border border-red-100 w-fit">
              {error}
            </p>
          )}
        </section>

        {/* Preview Cards */}
        <section className="mb-14 sm:mb-24">
          <h2 className="text-xs font-bold text-ink-faint uppercase tracking-[0.15em] mb-5 sm:mb-8">
            made with Gentle Ferry
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
            {TUTORIALS.map((c, i) => (
              <div 
                key={i} 
                className="aspect-[3/4] bg-muted rounded-2xl overflow-hidden border-2 border-line shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer relative group"
                onClick={() => setActiveTutorial(c)}
              >
                <img src={c.imageBase64} alt={`Tutorial ${i+1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[2px]">
                   <span className="text-white font-bold tracking-[0.15em] uppercase text-xs border border-white/40 px-4 py-2 rounded-full bg-ink/20 shadow-sm">Read Entry</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-ink-faint text-center leading-relaxed">
            ✦ these are just little previews to show you what a journal entry feels like — the photos aren't mine and are placeholders only 🌸
          </p>

          {/* BMAC #2 — bold banner strip */}
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 flex items-center justify-between gap-4 w-full rounded-2xl bg-honey-light/60 border-2 border-honey/30 hover:border-honey/60 px-6 py-4 transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-honey/30 flex items-center justify-center shadow-sm">
                <Coffee className="w-4.5 h-4.5 text-[#8B6914]" />
              </div>
              <div>
                <p className="font-bold text-sm text-ink">this is free. your coffee keeps it that way.</p>
                <p className="text-[11px] text-ink-faint">no pressure — just a small gesture if you love it</p>
              </div>
            </div>
            <span className="shrink-0 text-xs font-bold text-[#8B6914] uppercase tracking-wider group-hover:translate-x-1 transition-transform">
              buy me one →
            </span>
          </a>
        </section>

        {/* Story */}
        <section className="mb-14 sm:mb-24">
          <div className="relative overflow-hidden rounded-3xl border border-line shadow-sm bg-gradient-to-br from-blush-light/50 via-cream to-honey-light/30 px-5 sm:px-8 py-8 sm:py-12 flex flex-col md:flex-row gap-6 sm:gap-10 items-center">
            {/* Circular avatar */}
            <div className="shrink-0 flex flex-col items-center gap-3">
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-blush/20">
                <img src={randomAvatar} alt="me" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-bold text-ink-faint uppercase tracking-[0.18em]">the story</span>
            </div>
            {/* Content */}
            <div className="flex-1">
              <p className="font-bold text-3xl md:text-4xl text-ink mb-4 leading-tight">hey,<br />it's me! 👋</p>
              <p className="text-ink-soft leading-relaxed max-w-sm mb-7">
                I built this because I wanted a quiet, simple place to keep my thoughts.
                No ads, no noise — just you and your days. 💌
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { label: 'no ads', color: 'bg-blush/10 text-blush border-blush/20' },
                  { label: 'privacy first', color: 'bg-sage/10 text-sage border-sage/20' },
                  { label: 'open source', color: 'bg-sky/10 text-sky border-sky/20' },
                  { label: 'cute only', color: 'bg-honey/10 text-[#8B6914] border-honey/30' },
                ].map((t) => (
                  <span key={t.label} className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${t.color}`}>
                    {t.label}
                  </span>
                ))}
              </div>

              {/* BMAC #3 — glowing pill CTA */}
              <a
                href="https://buymeacoffee.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-honey-light to-blush-light border border-honey/30 text-[#8B6914] font-bold text-sm shadow-[0_2px_12px_rgba(242,201,76,0.2)] hover:shadow-[0_4px_20px_rgba(242,201,76,0.3)] hover:-translate-y-0.5 transition-all active:scale-95"
              >
                <Coffee className="w-4 h-4" />
                keeping this free costs me real money — buy me a coffee?
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
              </a>
            </div>
          </div>
        </section>

        {/* What you can do */}
        <section className="mb-14 sm:mb-24">
          <span className="text-xs font-bold text-ink-faint uppercase tracking-[0.18em] mb-5 sm:mb-8 block">what you can do</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: ImagePlus, title: 'drop in photos', desc: 'Every image goes straight to your Google Drive — safe, private, yours.', accent: 'border-honey bg-honey/5', iconColor: 'text-[#8B6914] bg-honey/15' },
              { icon: NotebookPen, title: 'write little notes', desc: 'Capture a feeling, a quote, or a whole story. No pressure, no word count.', accent: 'border-blush bg-blush/5', iconColor: 'text-blush bg-blush/15' },
              { icon: Highlighter, title: 'magic highlights', desc: 'Paint over words with pastel markers. Tag moods, moments, and people.', accent: 'border-sky bg-sky/5', iconColor: 'text-sky bg-sky/15' },
              { icon: Lock, title: 'totally private', desc: 'Your journal is yours. No sharing, no algorithms, no eyes but your own.', accent: 'border-lavender bg-lavender/5', iconColor: 'text-lavender bg-lavender/15' },
            ].map((f) => (
              <div key={f.title} className={`rounded-2xl border-2 ${f.accent} p-6 flex gap-4 items-start`}>
                <span className={`shrink-0 mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center ${f.iconColor}`}><f.icon className="w-5 h-5" strokeWidth={2} /></span>
                <div>
                  <p className="font-bold text-ink text-base mb-1">{f.title}</p>
                  <p className="text-ink-soft text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-14 sm:mb-24">
          <div className="mb-7 sm:mb-10">
            <span className="text-xs font-bold text-ink-faint uppercase tracking-[0.18em] mb-3 block">simple pricing</span>
            <h2 className="text-3xl md:text-4xl font-bold text-ink leading-tight tracking-[-0.02em]">
              free, forever.<br />
              <span className="text-ink-faint font-medium text-2xl md:text-3xl">or buy us a coffee if you love it.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Free tier */}
            <div className="relative rounded-3xl border-2 border-line bg-white/80 backdrop-blur p-8 flex flex-col">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-xs font-bold text-ink-faint uppercase tracking-[0.18em] mb-1">always free</p>
                  <p className="text-4xl font-bold text-ink tracking-tight">$0</p>
                  <p className="text-ink-faint text-sm mt-1">no card, no catch</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                  <Heart className="w-5 h-5 text-blush fill-current" />
                </div>
              </div>
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {[
                  'unlimited journal entries',
                  'photos saved to your Google Drive',
                  'pastel highlights + mood tagging',
                  '@people and #places tagging',
                  'calendar memory view',
                  'fully private — only you can see it',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-ink">
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
                {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'get started — free'}
              </button>
            </div>

            {/* Buy me a coffee */}
            <div className="relative rounded-3xl border-2 border-honey/40 bg-gradient-to-br from-honey-light/60 via-white to-blush-light/40 backdrop-blur p-8 flex flex-col overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-honey/20 rounded-full blur-[60px] pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blush/10 rounded-full blur-[50px] pointer-events-none" />

              <div className="relative flex-1 flex flex-col">
                <div className="w-12 h-12 rounded-2xl bg-honey/20 flex items-center justify-center mb-5">
                  <Coffee className="w-5 h-5 text-[#8B6914]" />
                </div>

                <p className="text-xs font-bold text-[#8B6914] uppercase tracking-[0.18em] mb-3">from the maker</p>

                <p className="text-xl font-bold text-ink leading-snug mb-4 tracking-tight">
                  hey, i built this for you.<br />completely free.
                </p>

                <p className="text-ink-soft text-sm leading-relaxed mb-4">
                  Gentle Ferry is a passion project — just me, late nights, and a lot of coffee. there's no company behind this, no investors, no ads. just someone who wanted a quiet little place to journal and thought you might want one too.
                </p>

                <p className="text-ink-soft text-sm leading-relaxed mb-8">
                  if it made your day a little softer, a coffee would genuinely mean the world to me. no pressure — ever.
                </p>

                <a
                  href="https://buymeacoffee.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto w-full py-3.5 rounded-xl bg-[#FFDD00] text-[#1a1a1a] font-bold text-sm text-center hover:brightness-95 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
                >
                  <Coffee className="w-4 h-4" /> buy me a coffee
                </a>
              </div>
            </div>

          </div>

          {/* Bottom reassurance */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-ink-faint">
            <Infinity className="w-4 h-4" strokeWidth={2} />
            <span>the free plan is genuinely unlimited — no hidden walls, ever.</span>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-8 px-0 sm:px-8 sm:-mx-8">
          <div className="relative overflow-hidden rounded-3xl border border-line shadow-sm min-h-[320px] flex flex-col md:flex-row">
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
              <p className="text-xs font-bold text-ink-faint uppercase tracking-[0.2em] mb-3">psst...</p>
              <p className="text-3xl md:text-5xl font-bold text-ink leading-tight mb-3">
                ready to start<br />your journal?
              </p>
              <p className="text-ink-soft mb-8 text-base">It only takes a second. No credit card, no fuss.</p>
              <div className="flex flex-wrap gap-3 items-center justify-center">
                <button
                  onClick={() => handleGoogleLogin()}
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-blush text-white px-8 py-3.5 rounded-full font-bold text-lg hover:bg-blush-hover transition-all active:scale-[0.97] disabled:opacity-60 shadow-sm"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>yes, let's go <ArrowRight className="w-5 h-5" strokeWidth={2.5} /></>
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
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--color-line-strong) 1.5px, transparent 1.5px)', backgroundSize: '28px 28px', opacity: 0.4 }} />
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
                <span className="font-bold text-xl text-ink tracking-tight">Gentle Ferry</span>
              </div>
              <p className="text-ink-faint text-sm leading-relaxed max-w-xs">
                a quiet little journal for the moments that make life beautiful.
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: Feather, label: 'write freely', color: 'text-blush border-blush/20 bg-blush/5' },
                { icon: HardDrive, label: 'your drive', color: 'text-[#8B6914] border-honey/30 bg-honey/5' },
                { icon: ShieldCheck, label: 'private', color: 'text-sage border-sage/20 bg-sage/5' },
                { icon: Sparkles, label: 'highlights', color: 'text-lavender border-lavender/20 bg-lavender/5' },
              ].map((f) => (
                <span key={f.label} className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${f.color}`}>
                  <f.icon className="w-3.5 h-3.5" strokeWidth={2} />
                  {f.label}
                </span>
              ))}
            </div>
          </div>

          {/* Giant wordmark */}
          <div className="border-t border-line pt-8 mb-8">
            <p
              className="font-bold leading-none tracking-[-0.05em] select-none"
              style={{ fontSize: 'clamp(3.5rem, 10vw, 7rem)', background: 'linear-gradient(135deg, var(--color-line-strong) 0%, var(--color-blush) 50%, var(--color-line-strong) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              Gentle Ferry
            </p>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col gap-4">
            {/* Top row: copyright + nav links */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <p className="text-[11px] text-ink-faint tracking-wide">
                made with <Heart size={9} className="inline text-blush fill-current mx-0.5" /> and a lot of coffee — © 2026 Gentle Ferry
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-ink-faint uppercase tracking-[0.18em]">
                <a href="#" className="hover:text-blush transition-colors">instagram</a>
                <span className="text-line-strong">·</span>
                <a href="/privacy" className="hover:text-ink transition-colors">privacy</a>
                <span className="text-line-strong">·</span>
                <a href="/terms" className="hover:text-ink transition-colors">terms</a>
              </div>
            </div>
            {/* BMAC #4 — full-width on mobile, auto on desktop */}
            <a
              href="https://buymeacoffee.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center sm:justify-start gap-1.5 px-3 py-2 rounded-full bg-honey-light border border-honey/40 text-[#8B6914] font-bold text-[10px] uppercase tracking-wider hover:bg-honey/20 hover:scale-105 transition-all shadow-sm w-full sm:w-auto"
            >
              <Coffee className="w-3 h-3" /> buy me a coffee
            </a>
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
             className="relative w-full max-w-4xl max-h-[80vh] overflow-y-auto rounded-2xl"
             onClick={e => e.stopPropagation()}
          >
             <button 
                className="sticky top-2 float-right mr-2 z-10 text-white hover:text-blush-light transition-colors flex items-center gap-2 font-medium bg-ink/40 px-3 py-1.5 rounded-full text-sm backdrop-blur-sm"
                onClick={() => setActiveTutorial(null)}
             >
                Close <X size={16} />
             </button>
             <PostcardView entry={{
               ...activeTutorial,
               highlights: activeTutorial.highlights?.map(h => {
                 if (typeof h.phrase === 'string') {
                   const start = activeTutorial.text.indexOf(h.phrase);
                   if (start !== -1) {
                     return { ...h, start, end: start + h.phrase.length };
                   }
                 }
                 return h;
               })
             }} />
          </div>
        </div>
      )}
      </div>
    </div>
  );
}