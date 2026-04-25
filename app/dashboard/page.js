'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from '../../utils/AuthContext';
import Navbar from '../components/Navbar';
import JournalCard from '../components/JournalCard';
import AnimatedBackground from '../components/AnimatedBackground';
import { useWeather } from '../contexts/WeatherContext';
import { AlertTriangle, CloudRain, CloudLightning, Snowflake, Sun } from 'lucide-react';

function DashboardContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { weather, setManualWeather } = useWeather();

  useEffect(() => {
    if (!loading && !user) router.push('/');
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream">
        <div className="w-2.5 h-2.5 rounded-full bg-blush animate-pulse" />
      </div>
    );
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const weatherVibes = [
    { key: 'clear',       icon: <Sun size={20} strokeWidth={2.5} />,          label: 'Sunny' },
    { key: 'rainy',       icon: <CloudRain size={20} strokeWidth={2.5} />,     label: 'Rainy' },
    { key: 'thunderstorm',icon: <CloudLightning size={20} strokeWidth={2.5} />,label: 'Storm' },
    { key: 'snowy',       icon: <Snowflake size={20} strokeWidth={2.5} />,     label: 'Snow'  },
  ];

  return (
    <div className="min-h-screen bg-cream flex flex-col relative overflow-x-hidden">
      <AnimatedBackground weather={weather} showClouds={true} />
      <Navbar />
      <main className="flex-1 max-w-[1060px] mx-auto px-4 md:px-6 py-12 md:pb-10 w-full animate-fadeIn">

        {/* Greeting */}
        <div className="flex items-start justify-between gap-5 flex-wrap mb-5 sm:mb-0">
          <div>
            <h1 className={`text-2xl md:text-[2.2rem] font-bold mb-1.5 ${weather === 'thunderstorm' ? 'text-white' : 'text-ink'}`}>
              {greeting}, {user.name?.split(' ')[0]}.
            </h1>
            <p className={`text-sm ${weather === 'thunderstorm' ? 'text-white/90' : 'text-ink-soft'}`}>
              What would you like to remember about today?
            </p>
          </div>
          
          {!user.hasDriveAccess && (
            <div className="flex items-center gap-2 px-3.5 py-2 bg-honey-light border border-honey rounded-lg text-xs text-[#7a5c00] max-w-[300px]">
              <AlertTriangle size={14} strokeWidth={2.5} />
              <span>Drive access missing</span>
            </div>
          )}
        </div>

        {/* Vibe Toggle - Bookmark style above journal */}
        <div className="flex items-end gap-1 mb-[-2px] px-1 justify-end mr-4">
          {weatherVibes.map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => setManualWeather(key)}
              className={`px-3.5 pt-2.5 rounded-t-lg transition-all ${
                weather === key
                  ? 'bg-card text-ink shadow-lg -translate-y-1 scale-105 font-medium pb-6'
                  : 'bg-white/50 text-ink/60 hover:bg-white/70 hover:-translate-y-0.5 pb-4'
              }`}
              title={label}
            >
              {icon}
            </button>
          ))}
        </div>

        {/* Journal postcard */}
        <JournalCard />

      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <DashboardContent />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
