'use client';

import { Heart, ArrowLeft, Shield, Database, Image, Lock, Eye, Trash2, Coffee } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
  const router = useRouter();

  const sections = [
    {
      icon: Eye,
      title: 'what we can see',
      color: 'text-blush bg-blush/10',
      border: 'border-blush/20',
      content: `We store your name, email, and profile picture from your Google account — only so you can log in and we know whose journal is whose. That's it. We don't read your journal entries, we don't analyse them, and we definitely don't sell them.`,
    },
    {
      icon: Database,
      title: 'what we actually store',
      color: 'text-[#8B6914] bg-honey/10',
      border: 'border-honey/20',
      content: `Your journal entries — the text, mood, date, highlights, and tags — live in our database. But your photos? Those go directly to your own Google Drive. We only save the Drive URL that points to your image. We never host, see, or touch your photos ourselves.`,
    },
    {
      icon: Image,
      title: 'your images, your responsibility',
      color: 'text-sky bg-sky/10',
      border: 'border-sky/20',
      content: `Since your images are uploaded to your personal Google Drive under your own Google account, you are entirely in control. You can delete them from Drive any time and they'll disappear from your journal too. We have no copies. We never did.`,
    },
    {
      icon: Lock,
      title: 'your journal is private',
      color: 'text-lavender bg-lavender/10',
      border: 'border-lavender/20',
      content: `Whimsical is a personal journal, not a social platform. Your entries are only ever visible to you when you're signed in. There are no public profiles, no sharing links, no followers — just you and your days.`,
    },
    {
      icon: Shield,
      title: 'google oauth & drive',
      color: 'text-sage bg-sage/10',
      border: 'border-sage/20',
      content: `We use Google OAuth to sign you in securely and request scoped access to your Google Drive (only the files whimsical creates). We never access anything else in your Drive. You can revoke our access at any time from your Google account security settings.`,
    },
    {
      icon: Trash2,
      title: 'deleting your data',
      color: 'text-blush bg-blush/10',
      border: 'border-blush/20',
      content: `Want to leave? We get it. You can delete your account and all journal data from your profile page. Since your photos live in your own Drive, you'll need to remove those yourself — but we'll make sure everything on our end is gone.`,
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
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blush/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-honey/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s] pointer-events-none" />

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
          <span className="text-xs font-bold text-ink-faint uppercase tracking-[0.18em] mb-4 block">the legal-ish stuff</span>
          <h1 className="text-4xl md:text-5xl font-bold text-ink leading-tight mb-4 tracking-[-0.02em] flex items-center gap-4">
            privacy policy <Lock className="w-9 h-9 text-blush shrink-0" strokeWidth={2.5} />
          </h1>
          <p className="text-ink-soft text-lg leading-relaxed max-w-xl">
            Written like a human, not a lawyer. Here's exactly what happens to your data — no hidden surprises.
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
            Questions? Concerns? Just want to say hi? You know where to find us. whimsical is a tiny passion project — we genuinely care.
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
