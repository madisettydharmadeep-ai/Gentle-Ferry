'use client';

import { Heart, ArrowLeft, FileText, UserCheck, ImageOff, AlertCircle, Handshake, Smile, Coffee } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
  const router = useRouter();

  const sections = [
    {
      icon: Smile,
      title: 'what whimsical is',
      color: 'text-blush bg-blush/10',
      border: 'border-blush/20',
      content: `Whimsical is a personal journalling tool. You sign in with Google, write entries, attach photos, and keep your memories. It's private, it's calm, and it's just for you. We're a tiny passion project — not a corporation.`,
    },
    {
      icon: UserCheck,
      title: 'your account',
      color: 'text-sage bg-sage/10',
      border: 'border-sage/20',
      content: `You need a Google account to use whimsical. By signing in, you authorise us to store your journal entries and save a link (not the file itself) to images you upload to your own Google Drive. You're responsible for keeping your Google account secure.`,
    },
    {
      icon: ImageOff,
      title: 'content & images — your call',
      color: 'text-[#8B6914] bg-honey/10',
      border: 'border-honey/20',
      content: `Your journal is private and visible only to you. Any images you add are uploaded directly to your own Google Drive — we never host them. Because it's private and the images live in your Drive, you are fully responsible for the content you choose to store. We don't moderate, review, or access your entries or files.`,
    },
    {
      icon: AlertCircle,
      title: 'what we ask you not to do',
      color: 'text-lavender bg-lavender/10',
      border: 'border-lavender/20',
      content: `Please don't try to access other users' data, reverse-engineer the app, or use it for anything harmful. Whimsical is built in good faith — we just ask you use it the same way. We reserve the right to suspend accounts that abuse the service.`,
    },
    {
      icon: Handshake,
      title: 'no warranties',
      color: 'text-sky bg-sky/10',
      border: 'border-sky/20',
      content: `Whimsical is provided as-is, with love but without guarantees. We do our best to keep your data safe and the app running, but we can't promise 100% uptime or that nothing will ever go wrong. Please back up anything truly irreplaceable.`,
    },
    {
      icon: FileText,
      title: 'changes to these terms',
      color: 'text-blush bg-blush/10',
      border: 'border-blush/20',
      content: `If we ever update these terms, we'll note the date below. Continued use of whimsical after a change means you're cool with it. We'll try to keep things as simple and honest as they are today.`,
    },
  ];

  return (
    <div className="min-h-screen bg-cream text-ink relative overflow-hidden">
      {/* Background dot grid */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(var(--color-line) 1.5px, transparent 1.5px)',
          backgroundSize: '32px 32px',
          opacity: 0.25,
        }}
      />
      {/* Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-honey/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[35%] h-[35%] bg-blush/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-8 pt-8 pb-24">

        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-8 h-8 rounded-lg bg-blush-light flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Heart className="w-4 h-4 text-blush fill-current" />
            </div>
            <span className="font-bold text-lg text-ink tracking-tight">whimsical</span>
          </div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-ink-faint hover:text-ink transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> back
          </button>
        </header>

        {/* Hero */}
        <div className="mb-14">
          <span className="text-xs font-bold text-ink-faint uppercase tracking-[0.18em] mb-4 block">the fine print</span>
          <h1 className="text-4xl md:text-5xl font-bold text-ink leading-tight mb-4 tracking-[-0.02em] flex items-center gap-4">
            terms of service <FileText className="w-9 h-9 text-blush shrink-0" strokeWidth={2.5} />
          </h1>
          <p className="text-ink-soft text-lg leading-relaxed max-w-xl">
            Short, honest, and actually readable. By using whimsical, you agree to these — but really it's just common sense stuff.
          </p>
          <p className="mt-3 text-xs text-ink-faint">Last updated: April 2026</p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-5">
          {sections.map((s) => (
            <div key={s.title} className={`rounded-2xl border ${s.border} bg-white/70 backdrop-blur p-6 flex gap-5 items-start shadow-sm`}>
              <span className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" strokeWidth={2} />
              </span>
              <div>
                <p className="font-bold text-ink text-base mb-1.5">{s.title}</p>
                <p className="text-ink-soft text-sm leading-relaxed">{s.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-14 pt-8 border-t border-line text-center">
          <p className="text-ink-soft text-sm leading-relaxed max-w-md mx-auto">
            Still confused? Totally fair — legal stuff is confusing. Just reach out and we'll explain in plain words.
          </p>
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-honey-light/80 border border-honey/30 text-[11px] font-bold text-[#8B6914] uppercase tracking-wider hover:border-honey/60 hover:bg-honey-light transition-all"
          >
            <Coffee className="w-3 h-3" /> kept free by people like you
          </a>
          <p className="mt-6 text-xs font-bold text-ink-faint uppercase tracking-[0.2em]">
            made with <Heart size={11} className="inline text-blush fill-current" /> 2026 whimsical
          </p>
        </div>

      </div>
    </div>
  );
}
