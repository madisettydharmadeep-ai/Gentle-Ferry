'use client';

import { useEffect, useState, useMemo } from 'react';

// Simple weather types for animation
const WEATHER = {
  CLEAR: 'clear',
  CLOUDY: 'cloudy',
  RAINY: 'rainy',
  SNOWY: 'snowy',
  THUNDERSTORM: 'thunderstorm',
};

export default function AnimatedBackground({ 
  weather = WEATHER.CLEAR,
  showClouds = true,
  children 
}) {
  const [mounted, setMounted] = useState(false);

  // Random lightning pattern for thunderstorm (1-15)
  const lightningClass = useMemo(() => {
    return `flash-${Math.floor(Math.random() * 15) + 1}`;
  }, [weather]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        className="fixed inset-0 bg-cover bg-center bg-fixed z-0 pointer-events-none"
        style={{ backgroundImage: "url('/bgimage.jpg')" }}
      />
    );
  }

  return (
    <>
      {/* Base Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-fixed z-0 pointer-events-none"
        style={{ backgroundImage: "url('/bgimage.jpg')" }}
      />

      {/* Static Clouds Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Animated Solid SVG Clouds with depth */}
        {showClouds && (weather === WEATHER.CLEAR || weather === WEATHER.CLOUDY) && (
          <>
            {/* Massive background cloud - slowest, furthest back */}
            <svg 
              className="absolute cloud-anim cloud-bg" 
              style={{ top: '15%', left: '-450px', width: '400px', height: '200px' }}
              viewBox="0 0 200 100" 
            >
              <defs>
                <linearGradient id="cloudGradBg" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#f5f5f5" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <path fill="url(#cloudGradBg)" d="M20 75 Q15 55 35 45 Q40 25 70 30 Q95 15 130 25 Q165 20 175 50 Q195 55 180 80 Q185 100 140 95 L40 95 Q10 95 20 75Z" />
            </svg>

            {/* Large cloud - front, brightest, biggest shadow */}
            <svg 
              className="absolute cloud-anim cloud-slow" 
              style={{ top: '5%', left: '-350px', width: '300px', height: '150px' }}
              viewBox="0 0 200 100" 
            >
              <defs>
                <linearGradient id="cloudGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#fafafa" />
                  <stop offset="100%" stopColor="#f0f0f0" />
                </linearGradient>
              </defs>
              <path fill="url(#cloudGrad1)" d="M40 70 Q30 50 50 40 Q55 20 80 25 Q100 10 130 20 Q160 15 170 45 Q195 50 180 75 Q185 95 150 90 L50 90 Q20 90 40 70Z" />
            </svg>

            {/* Medium cloud - mid layer */}
            <svg 
              className="absolute cloud-anim cloud-medium" 
              style={{ top: '10%', left: '-280px', width: '220px', height: '110px' }}
              viewBox="0 0 200 100" 
            >
              <defs>
                <linearGradient id="cloudGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#f5f5f5" />
                </linearGradient>
              </defs>
              <path fill="url(#cloudGrad2)" d="M30 65 Q25 45 45 35 Q50 20 75 25 Q95 15 120 22 Q150 18 160 42 Q180 48 165 70 Q170 88 135 85 L45 85 Q25 85 30 65Z" />
            </svg>

            {/* Small cloud - back, more transparent */}
            <svg 
              className="absolute cloud-anim cloud-fast" 
              style={{ top: '25%', left: '-200px', width: '160px', height: '80px' }}
              viewBox="0 0 200 100" 
            >
              <defs>
                <linearGradient id="cloudGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#e8e8e8" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <path fill="url(#cloudGrad3)" d="M35 68 Q30 48 48 38 Q52 22 76 28 Q96 18 118 25 Q146 20 155 45 Q175 50 162 72 Q168 88 138 86 L42 86 Q30 86 35 68Z" />
            </svg>
          </>
        )}

        {/* Rain Animation */}
        {weather === WEATHER.RAINY && (
          <div className="rain-container">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="raindrop"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${0.5 + Math.random() * 0.5}s`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Thunderstorm - intense inclined rain + dramatic lightning */}
        {weather === WEATHER.THUNDERSTORM && (
          <>
            <div className={`lightning-flash ${lightningClass}`} />
            <div className="rain-container">
              {Array.from({ length: 120 }).map((_, i) => (
                <div
                  key={i}
                  className="raindrop-inclined"
                  style={{
                    left: `${Math.random() * 120 - 10}%`,
                    animationDuration: `${0.3 + Math.random() * 0.3}s`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* Snow Animation */}
        {weather === WEATHER.SNOWY && (
          <div className="snow-container">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="snowflake"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                  animationDelay: `${Math.random() * 5}s`,
                  fontSize: `${8 + Math.random() * 12}px`,
                }}
              >
                ❄
              </div>
            ))}
          </div>
        )}

        {/* Dark overlay for rainy weather */}
        {weather === WEATHER.RAINY && (
          <div className="absolute inset-0 bg-blue-900/25" />
        )}

        {/* Very dark overlay for thunderstorm */}
        {weather === WEATHER.THUNDERSTORM && (
          <div className="absolute inset-0 bg-slate-900/50" />
        )}

        {/* Weather overlay - clear gets warm, others subtle */}
        {weather === WEATHER.CLEAR && (
          <div className="absolute inset-0 bg-amber-100/5" />
        )}
        {weather === WEATHER.CLOUDY && (
          <div className="absolute inset-0 bg-gray-100/10" />
        )}
      </div>

        {/* CSS Animations - using dangerouslySetInnerHTML for keyframes */}
      <div 
        dangerouslySetInnerHTML={{
          __html: `
            <style>
              @keyframes float-cloud-slow {
                0% { left: -300px; transform: translateY(0px); }
                20% { transform: translateY(-5px); }
                40% { transform: translateY(0px); }
                60% { transform: translateY(5px); }
                80% { left: calc(100% + 100px); transform: translateY(0px); }
                100% { left: calc(100% + 100px); transform: translateY(0px); }
              }
              @keyframes float-cloud-medium {
                0% { left: -300px; transform: translateY(0px); }
                25% { transform: translateY(-8px); }
                50% { transform: translateY(3px); }
                65% { left: calc(100% + 100px); transform: translateY(0px); }
                100% { left: calc(100% + 100px); transform: translateY(0px); }
              }
              @keyframes float-cloud-fast {
                0% { left: -300px; transform: translateY(0px); }
                32% { transform: translateY(-6px); }
                50% { left: calc(100% + 100px); transform: translateY(0px); }
                100% { left: calc(100% + 100px); transform: translateY(0px); }
              }
              @keyframes float-cloud-bg {
                0% { left: -450px; transform: translateY(0px) scale(1); }
                7% { transform: translateY(-3px) scale(1.02); }
                13% { transform: translateY(0px) scale(1); }
                20% { transform: translateY(4px) scale(0.98); }
                97.5% { left: calc(100% + 100px); transform: translateY(0px) scale(1); }
                100% { left: calc(100% + 100px); transform: translateY(0px) scale(1); }
              }
              @keyframes inclined-fall {
                0% { transform: translateY(-20px) translateX(30px); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(100vh) translateX(-50px); opacity: 0; }
              }
              /* 15 different lightning bolt patterns - randomly applied via JS */
              @keyframes lightning-1 { 0%,100%{opacity:0} 5%{opacity:1} 6%{opacity:0} 7%{opacity:0.8} 8%{opacity:0} }
              @keyframes lightning-2 { 0%,100%{opacity:0} 3%{opacity:0.9} 4%{opacity:0} 6%{opacity:1} 7%{opacity:0} }
              @keyframes lightning-3 { 0%,100%{opacity:0} 2%{opacity:1} 3%{opacity:0} 5%{opacity:0.7} 6%{opacity:0} 8%{opacity:0.9} 9%{opacity:0} }
              @keyframes lightning-4 { 0%,100%{opacity:0} 4%{opacity:1} 5%{opacity:0} }
              @keyframes lightning-5 { 0%,100%{opacity:0} 1%{opacity:0.8} 2%{opacity:0} 3%{opacity:1} 4%{opacity:0} 5%{opacity:0.6} 6%{opacity:0} }
              @keyframes lightning-6 { 0%,100%{opacity:0} 6%{opacity:1} 7%{opacity:0} 9%{opacity:0.9} 10%{opacity:0} }
              @keyframes lightning-7 { 0%,100%{opacity:0} 2%{opacity:1} 4%{opacity:0} 5%{opacity:0.8} 6%{opacity:0} }
              @keyframes lightning-8 { 0%,100%{opacity:0} 3%{opacity:1} 4%{opacity:0} 7%{opacity:0.7} 8%{opacity:0} }
              @keyframes lightning-9 { 0%,100%{opacity:0} 5%{opacity:0.9} 6%{opacity:0} 8%{opacity:1} 9%{opacity:0} 11%{opacity:0.5} 12%{opacity:0} }
              @keyframes lightning-10 { 0%,100%{opacity:0} 2%{opacity:1} 3%{opacity:0} }
              @keyframes lightning-11 { 0%,100%{opacity:0} 4%{opacity:0.8} 5%{opacity:0} 7%{opacity:1} 8%{opacity:0} }
              @keyframes lightning-12 { 0%,100%{opacity:0} 1%{opacity:1} 2%{opacity:0} 4%{opacity:0.9} 5%{opacity:0} 6%{opacity:0.7} 7%{opacity:0} }
              @keyframes lightning-13 { 0%,100%{opacity:0} 3%{opacity:1} 5%{opacity:0} }
              @keyframes lightning-14 { 0%,100%{opacity:0} 6%{opacity:0.8} 7%{opacity:0} 9%{opacity:1} 10%{opacity:0} 12%{opacity:0.6} 13%{opacity:0} }
              @keyframes lightning-15 { 0%,100%{opacity:0} 2%{opacity:1} 3%{opacity:0} 5%{opacity:0.9} 6%{opacity:0} 8%{opacity:0.5} 9%{opacity:0} }
              @keyframes fall {
                0% { transform: translateY(-20px); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(100vh); opacity: 0; }
              }
              @keyframes snowfall {
                0% { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                100% { transform: translateY(100vh) translateX(30px) rotate(360deg); opacity: 0; }
              }
              .cloud-anim {
                animation-timing-function: linear;
                animation-iteration-count: infinite;
                animation-fill-mode: forwards;
                animation-duration: 40s;
                will-change: left, transform;
                filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.08));
              }
              /* Staggered delays for calming sequential entry */
              .cloud-bg {
                animation-name: float-cloud-bg;
                opacity: 0.95;
                z-index: 0;
                filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.06));
                animation-delay: 0s;
                animation-duration: 60s; /* 50% slower than other clouds */
              }
              .raindrop-inclined {
                position: absolute;
                width: 2px;
                height: 22px;
                background: linear-gradient(to bottom left, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.95));
                border-radius: 2px;
                animation-name: inclined-fall;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
                box-shadow: 0 0 6px rgba(255, 255, 255, 0.5);
                transform: rotate(-25deg);
              }
              .lightning-flash {
                position: absolute;
                inset: 0;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(200, 220, 255, 0.2) 50%, transparent 70%);
                pointer-events: none;
                z-index: 5;
                box-shadow: inset 0 0 100px rgba(255, 255, 255, 0.2);
              }
              /* Random intervals 5-10 seconds for realistic unpredictability */
              .lightning-flash.flash-1 { animation: lightning-1 6s ease-out infinite; animation-delay: 5s; }
              .lightning-flash.flash-2 { animation: lightning-2 7s ease-out infinite; animation-delay: 8s; }
              .lightning-flash.flash-3 { animation: lightning-3 5s ease-out infinite; animation-delay: 3s; }
              .lightning-flash.flash-4 { animation: lightning-4 9s ease-out infinite; animation-delay: 7s; }
              .lightning-flash.flash-5 { animation: lightning-5 6.5s ease-out infinite; animation-delay: 2s; }
              .lightning-flash.flash-6 { animation: lightning-6 8s ease-out infinite; animation-delay: 6s; }
              .lightning-flash.flash-7 { animation: lightning-7 5.5s ease-out infinite; animation-delay: 9s; }
              .lightning-flash.flash-8 { animation: lightning-8 7.5s ease-out infinite; animation-delay: 4s; }
              .lightning-flash.flash-9 { animation: lightning-9 6s ease-out infinite; animation-delay: 10s; }
              .lightning-flash.flash-10 { animation: lightning-10 8.5s ease-out infinite; animation-delay: 1s; }
              .lightning-flash.flash-11 { animation: lightning-11 5s ease-out infinite; animation-delay: 8.5s; }
              .lightning-flash.flash-12 { animation: lightning-12 9.5s ease-out infinite; animation-delay: 3.5s; }
              .lightning-flash.flash-13 { animation: lightning-13 7s ease-out infinite; animation-delay: 5.5s; }
              .lightning-flash.flash-14 { animation: lightning-14 6s ease-out infinite; animation-delay: 9.5s; }
              .lightning-flash.flash-15 { animation: lightning-15 8s ease-out infinite; animation-delay: 2.5s; }
              .cloud-medium { 
                animation-name: float-cloud-medium; 
                opacity: 0.85;
                z-index: 3;
                filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.05));
                animation-delay: 4s; /* 4s after bg cloud */
              }
              .cloud-fast { 
                animation-name: float-cloud-fast; 
                opacity: 0.55;
                z-index: 2;
                filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.04));
                animation-delay: 7s; /* 3s after medium */
              }
              .cloud-slow { 
                animation-name: float-cloud-slow; 
                opacity: 0.95;
                z-index: 4;
                animation-delay: 11s; /* 4s after fast, last to appear - main focus */
              }
              .raindrop {
                position: absolute;
                width: 2px;
                height: 18px;
                background: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.95));
                border-radius: 2px;
                animation-name: fall;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
                box-shadow: 0 0 4px rgba(255, 255, 255, 0.6);
              }
              .snowflake {
                position: absolute;
                color: white;
                text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
                animation-name: snowfall;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
                user-select: none;
              }
            </style>
          `
        }}
      />

      {children}
    </>
  );
}

// Weather presets for easy use
export const WeatherPresets = WEATHER;
