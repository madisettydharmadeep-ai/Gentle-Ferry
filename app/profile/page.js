'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from '../../utils/AuthContext';
import { useWeather } from '../contexts/WeatherContext';
import Navbar from '../components/Navbar';
import AnimatedBackground from '../components/AnimatedBackground';
import { Cloud, Mail, CalendarDays, LogOut, Verified, Coffee } from 'lucide-react';
import { clsx } from 'clsx';

function ProfileContent() {
  const { user, loading, logout } = useAuth();
  const { weather } = useWeather();
  const router = useRouter();
  
  // This helps avoid hydration mismatches if user.createdAt is used
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!loading && !user) router.push('/');
  }, [user, loading, router]);

  if (loading || !user || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream">
        <div className="w-2.5 h-2.5 rounded-full bg-blush animate-pulse" />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getJoinDate = () => {
    if (!user.createdAt) return 'Check your journey timeline';
    const date = new Date(user.createdAt);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <AnimatedBackground weather={weather} showClouds={true} />
      <Navbar />
      <main className="flex-1 max-w-[1000px] mx-auto px-6 py-12 md:py-16 w-full animate-fadeIn relative z-10">
        <div className="bg-[#fdf9f3] rounded-[2rem] shadow-xl p-8 md:p-12 border border-white/60">
          

          {/* Profile Header - Horizontal Layout */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 pb-10 mb-10 border-b border-stone-200/60">
            {/* Avatar */}
            <div className="relative shrink-0">
              {user.image ? (
                <img 
                  src={user.image} 
                  alt={user.name} 
                  className="w-28 h-28 rounded-full object-cover shadow-lg ring-4 ring-white" 
                  referrerPolicy="no-referrer" 
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blush to-[#e07b73] shadow-lg ring-4 ring-white flex items-center justify-center text-3xl font-bold text-white">
                  {user.name?.[0] ?? '?'}
                </div>
              )}
              {user.hasDriveAccess && (
                <div 
                  className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-md ring-2 ring-white" 
                  title="Google Drive Connected"
                >
                  <Cloud size={16} className="text-blue-500 fill-blue-50" />
                </div>
              )}
            </div>

            {/* Info - Left aligned on desktop */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-stone-800 tracking-tight mb-2">
                {user.name}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-stone-500 text-sm mb-4">
                <Mail size={14} strokeWidth={2} />
                <span>{user.email}</span>
              </div>

              {/* Verified Badge */}
              {user.hasDriveAccess && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                  <Verified size={14} className="text-blue-500" />
                  Drive Connected
                </div>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            {/* Member Since */}
            <div className="flex-1 bg-white/60 rounded-2xl p-5 border border-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-blush">
                  <CalendarDays size={20} strokeWidth={2} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-0.5">Member Since</span>
                  <p className="text-stone-700 font-medium">{getJoinDate()}</p>
                </div>
              </div>
            </div>

            {/* Storage Status */}
            <div className={clsx(
              "flex-1 rounded-2xl p-5 border",
              user.hasDriveAccess 
                ? "bg-blue-50/50 border-blue-100" 
                : "bg-red-50/50 border-red-100"
            )}>
              <div className="flex items-center gap-3">
                <div className={clsx(
                  "w-12 h-12 rounded-xl shadow-sm flex items-center justify-center bg-white",
                  user.hasDriveAccess ? "text-blue-500" : "text-red-500"
                )}>
                  <Cloud size={20} strokeWidth={2} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-0.5">Storage</span>
                  <p className={clsx(
                    "font-medium",
                    user.hasDriveAccess ? "text-blue-600" : "text-red-500"
                  )}>
                    {user.hasDriveAccess ? "Google Drive Connected" : "Connection Required"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Support + Sign Out */}
          <div className="flex flex-col md:flex-row gap-4 pt-8 border-t border-stone-200/60">
            {/* Support Card */}
            <a
              href="https://buymeacoffee.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex-1 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 hover:border-amber-200 px-5 py-4 transition-all hover:shadow-md active:scale-[0.99]"
            >
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <Coffee className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-700">Enjoying Gentle Ferry?</p>
                <p className="text-xs text-stone-500">Buy me a coffee</p>
              </div>
              <span className="text-xs font-semibold text-amber-600 group-hover:translate-x-0.5 transition-transform">Support →</span>
            </a>

            {/* Sign Out */}
            <button 
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 hover:text-stone-800 transition-all active:scale-95"
            >
              <LogOut size={16} strokeWidth={2} />
              Sign Out
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <ProfileContent />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
