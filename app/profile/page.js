"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider, useAuth } from "../../utils/AuthContext";
import { useWeather } from "../contexts/WeatherContext";
import Navbar from "../components/Navbar";
import AnimatedBackground from "../components/AnimatedBackground";
import { LogOut, Coffee, Cloud, CloudOff, CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";

function ProfileContent() {
  const { user, loading, logout } = useAuth();
  const { weather } = useWeather();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [dailyFact, setDailyFact] = useState("");

  // Calendar State
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentDate = today.getDate();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => null);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    setMounted(true);
    if (!loading && !user) router.push("/");

    const reflections = [
      "The stars remember every wish you've whispered.",
      "A quiet mind is the canvas of the universe.",
      "Your journey is uniquely yours; honor the pace.",
      "Even clouds pass, but the sky remains.",
      "Breathe in the present. It belongs to you."
    ];
    const getDayOfYear = (dateObj) => {
      const start = new Date(dateObj.getFullYear(), 0, 0);
      return Math.floor((dateObj - start) / (1000 * 60 * 60 * 24));
    };
    setDailyFact(reflections[getDayOfYear(new Date()) % reflections.length]);
  }, [user, loading, router]);

  if (loading || !user || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#e6e2d8]">
        <div className="w-3 h-3 rounded-full bg-stone-800 animate-pulse" />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getJoinDate = () => {
    if (!user.createdAt) return "Unknown";
    return new Date(user.createdAt).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "2-digit",
    });
  };

  const passengerId = user._id?.slice(-6).toUpperCase() || "000000";

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden font-sans bg-[#e6e2d8]">
      <AnimatedBackground weather={weather} showClouds={true} />
      <Navbar />
      
      <main className="flex-1 max-w-[1100px] mx-auto px-4 py-8 md:py-16 w-full animate-fadeIn relative z-10 flex flex-col items-center justify-center">
        
        {/* THE FILM CEL TICKET */}
        <div className="relative w-full bg-[#fdfbf7] rounded-sm shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] flex flex-col md:flex-row overflow-hidden border border-stone-200/60 mb-8 group transition-transform duration-500 hover:scale-[1.01]">
          
          {/* Edge Perforations */}
          <div className="hidden md:block absolute top-1/2 -left-3 w-6 h-6 bg-[#e6e2d8] rounded-full shadow-inner transform -translate-y-1/2 z-20"></div>
          <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-6 bg-[#e6e2d8] rounded-full shadow-inner transform -translate-y-1/2 z-20"></div>

          {/* Background Texture */}
          <div className="absolute inset-0 opacity-[0.3] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none mix-blend-multiply" />

          {/* 1. LEFT SECTION: Identity & Manifest */}
          <div className="w-full md:w-[30%] p-8 flex flex-row md:flex-col items-start relative">
            
            {/* Japanese Vertical Text */}
            <div className="absolute top-8 left-6 md:left-8">
              <div style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }} className="font-serif text-xl md:text-2xl text-stone-800 tracking-[0.3em] font-light">
                星空の旅人
              </div>
            </div>

            {/* User Manifest Info */}
            <div className="ml-12 md:ml-16 mt-0 md:mt-2 w-full">
              {/* Avatar */}
              <div className="mb-6">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-16 h-16 rounded-full object-cover border border-stone-300 p-1 shadow-sm grayscale hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-stone-200 border border-stone-300 p-1 flex items-center justify-center text-stone-500 font-serif text-xl">
                    {user.name?.[0] ?? "?"}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <span className="block text-[0.6rem] font-mono text-stone-400 tracking-widest uppercase mb-1">Passenger</span>
                  <h2 className="font-sans text-lg text-stone-800 tracking-wide uppercase">{user.name}</h2>
                </div>

                <div>
                  <span className="block text-[0.6rem] font-mono text-stone-400 tracking-widest uppercase mb-1">Comm Channel</span>
                  <p className="font-mono text-xs text-stone-500 truncate">{user.email}</p>
                </div>

                <div>
                  <span className="block text-[0.6rem] font-mono text-stone-400 tracking-widest uppercase mb-1">Chronicle ID</span>
                  <p className="font-mono text-xs text-stone-500">NO. {passengerId}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. MIDDLE SECTION: The "Film Cel" Window & Drive Status */}
          <div className="w-full md:w-[42%] p-6 md:p-8 relative flex flex-col items-center justify-center">
             {/* The Stamp Border Effect Image */}
             <div className="relative w-full h-56 md:h-72 mb-8 flex items-center justify-center group">
                {/* Stamp Background Layer */}
                <div 
                  className="absolute inset-0 bg-transparent transition-colors duration-500 group-hover:bg-white/50"
                  style={{
                    maskImage: `linear-gradient(black, black), radial-gradient(circle at 8px 8px, black 4px, transparent 4.5px)`,
                    maskPosition: `0 0, -8px -8px`,
                    maskSize: `100% 100%, 16px 16px`,
                    WebkitMaskImage: `linear-gradient(black, black), radial-gradient(circle at 8px 8px, black 4px, transparent 4.5px)`,
                    WebkitMaskPosition: `0 0, -8px -8px`,
                    WebkitMaskSize: `100% 100%, 16px 16px`,
                    WebkitMaskComposite: `destination-out`,
                    maskComposite: `exclude`
                  }}
                />
                
                {/* The Image inside */}
                <div className="relative z-10 w-[calc(100%-24px)] h-[calc(100%)] overflow-hidden rounded-sm bg-stone-200">
                  <img 
                    src="https://i.pinimg.com/736x/85/f7/30/85f730467f76f414345302b9c5b963b7.jpg" 
                    alt="Scenic View" 
                    className="w-full h-full object-cover opacity-90 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100 mix-blend-multiply group-hover:mix-blend-normal"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-stone-900/10 via-transparent to-white/20 pointer-events-none mix-blend-overlay"></div>
                </div>
             </div>

             {/* Drive Status Indicator */}
             <div className={clsx(
               "flex items-center gap-2 px-4 py-2 rounded-full border text-[0.65rem] font-mono tracking-widest uppercase w-full justify-center transition-colors",
               user.hasDriveAccess ? "border-stone-300 bg-white/50 text-stone-600" : "border-red-200 bg-red-50/50 text-red-500"
             )}>
               {user.hasDriveAccess ? (
                 <>
                  <CheckCircle2 size={14} className="text-stone-400" />
                  <span>Vault Sync Active</span>
                 </>
               ) : (
                 <>
                  <CloudOff size={14} />
                  <span>Vault Disconnected</span>
                 </>
               )}
             </div>
          </div>

          {/* 3. RIGHT SECTION: Aesthetic Calendar & Journey Details */}
          <div className="w-full md:w-[28%] p-8 flex flex-col justify-center items-center relative">
            <div className="w-full max-w-[200px] mx-auto flex-1 flex flex-col">
              
              {/* Calendar Header */}
              <div className="text-center mb-6">
                <span className="block text-stone-800 font-serif text-xl tracking-wider">{monthNames[currentMonth]}</span>
                <span className="block text-stone-400 font-mono text-[0.65rem] tracking-[0.2em]">{currentYear}</span>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="text-center text-[0.55rem] font-bold text-stone-400">{day}</div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-y-1 gap-x-1 mb-auto">
                {blanks.map((_, i) => (
                  <div key={`blank-${i}`} className="w-5 h-5 md:w-6 md:h-6"></div>
                ))}
                {days.map((day) => {
                  const isToday = day === currentDate;
                  return (
                    <div 
                      key={day} 
                      className={clsx(
                        "w-5 h-5 md:w-6 md:h-6 mx-auto flex items-center justify-center text-[0.65rem] font-mono rounded-full transition-colors",
                        isToday ? "bg-stone-800 text-[#fdfbf7] shadow-md scale-110" : "text-stone-500 hover:bg-stone-200"
                      )}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
              
              {/* Embarkation Info */}
              <div className="mt-8 text-center border-t border-stone-200 pt-5">
                 <span className="block text-[0.6rem] font-mono text-stone-400 tracking-widest uppercase mb-1">
                    Date of Embarkation
                 </span>
                 <span className="font-serif text-sm text-stone-700 italic">
                    {getJoinDate()}
                 </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTIONS: Integrated beautifully with the theme */}
        <div className="w-full flex flex-col sm:flex-row gap-4 max-w-2xl mt-4">
          
          <a
            href="https://ko-fi.com/YOUR_KOFI_LINK" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-sm border border-stone-300/80 bg-[#fdfbf7]/80 backdrop-blur-sm text-stone-500 hover:text-stone-800 hover:bg-white hover:border-stone-400 transition-all font-mono text-[0.65rem] uppercase tracking-[0.2em] shadow-sm hover:shadow active:scale-[0.98]"
          >
            <Coffee size={16} strokeWidth={1.5} />
            Support the Ferry
          </a>

          <button
            onClick={handleLogout}
            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-sm border border-stone-300/80 bg-[#fdfbf7]/80 backdrop-blur-sm text-stone-500 hover:text-stone-800 hover:bg-white hover:border-stone-400 transition-all font-mono text-[0.65rem] uppercase tracking-[0.2em] shadow-sm hover:shadow active:scale-[0.98]"
          >
            <LogOut size={16} strokeWidth={1.5} />
            Conclude Journey
          </button>

        </div>

        {/* Daily reflection floating softly at the bottom */}
        <div className="mt-12 max-w-lg text-center">
          <p className="font-serif text-stone-500/80 text-sm italic tracking-wide">
            "{dailyFact}"
          </p>
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