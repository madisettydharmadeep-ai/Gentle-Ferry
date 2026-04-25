'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../utils/AuthContext';
import { useWeather } from '../contexts/WeatherContext';
import { Calendar, FolderOpen, BookOpen } from 'lucide-react';
import { clsx } from 'clsx';

export default function Navbar() {
  const { user } = useAuth();
  const { weather } = useWeather();
  const pathname = usePathname();
  const isStorm = weather === 'thunderstorm';

  return (
    <nav className="flex items-center justify-between px-3 md:px-10 h-[52px] bg-white/20 backdrop-blur-3xl border-b border-white/20 sticky top-0 z-[100] shadow-xl relative transition-all">

      {/* Logo — icon only on mobile */}
      <Link href="/dashboard" className={`flex items-center gap-2 font-bold text-lg no-underline hover:opacity-70 transition-opacity shrink-0 ${isStorm ? 'text-white' : 'text-ink'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7 shrink-0">
          <rect width="24" height="24" fill="#c65f4b" rx="4" />
          <g transform="translate(2, 2) scale(0.85)" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M12 6v16"/>
            <path d="m19 13 2-1a9 9 0 0 1-18 0l2 1"/>
            <path d="M9 11h6"/>
            <circle cx="12" cy="4" r="2"/>
          </g>
        </svg>
        <span className="hidden sm:inline">Gentle Ferry</span>
      </Link>

      {/* Nav tabs */}
      <div className={`flex items-center gap-0.5 border rounded-full p-[3px] ${isStorm ? 'bg-white/10 border-white/20' : 'bg-muted border-line'}`}>
        <Link
          href="/dashboard"
          className={clsx(
            "flex items-center gap-1.5 rounded-full font-medium no-underline transition-all",
            "px-3 py-1.5 sm:px-4 text-xs sm:text-sm",
            pathname === '/dashboard'
              ? isStorm ? "bg-white/20 text-white shadow-sm" : "bg-card text-ink shadow-sm"
              : isStorm ? "text-white/70 hover:text-white" : "text-ink-soft hover:text-ink"
          )}
        >
          <BookOpen size={13} strokeWidth={2} />
          <span>Today</span>
        </Link>
        <Link
          href="/memories"
          className={clsx(
            "flex items-center gap-1.5 rounded-full font-medium no-underline transition-all",
            "px-3 py-1.5 sm:px-4 text-xs sm:text-sm",
            pathname === '/memories'
              ? isStorm ? "bg-white/20 text-white shadow-sm" : "bg-card text-ink shadow-sm"
              : isStorm ? "text-white/70 hover:text-white" : "text-ink-soft hover:text-ink"
          )}
        >
          <Calendar size={13} strokeWidth={2} />
          <span>Memories</span>
        </Link>
        <Link
          href="/collections"
          className={clsx(
            "flex items-center gap-1.5 rounded-full font-medium no-underline transition-all",
            "px-3 py-1.5 sm:px-4 text-xs sm:text-sm",
            pathname === '/collections'
              ? isStorm ? "bg-white/20 text-white shadow-sm" : "bg-card text-ink shadow-sm"
              : isStorm ? "text-white/70 hover:text-white" : "text-ink-soft hover:text-ink"
          )}
        >
          <FolderOpen size={13} strokeWidth={2} />
          <span>Collections</span>
        </Link>
      </div>

      {/* Right — avatar */}
      <div className="flex items-center gap-3 shrink-0">
        <Link href="/profile" className="rounded-full overflow-hidden hover:ring-2 hover:ring-blush transition-all block focus:outline-none focus:ring-2 focus:ring-blush">
          {user?.image ? (
            <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full border-[1.5px] border-line object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blush-light text-blush flex items-center justify-center text-xs font-bold border-[1.5px] border-line">
              {user?.name?.[0] ?? '?'}
            </div>
          )}
        </Link>
      </div>

    </nav>
  );
}
