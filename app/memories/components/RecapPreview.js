"use client";

import { Sparkles, Play } from "lucide-react";

// Subtle organic film grain
const NoiseOverlay = () => (
  <div
    className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay z-0"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
);

export default function RecapPreview({
  viewMonth,
  MONTHS,
  recapData,
  onWatchRecap,
}) {
  if (!recapData) return null;

  const month = MONTHS[viewMonth - 1];

  return (
    <div className="animate-fadeIn relative z-10 w-full">
      <div
        className="w-full relative overflow-hidden group"
        style={{
          borderRadius: 28,
          background: "radial-gradient(circle at 15% 15%, #F0F9FF 0%, #E0F2FE 60%, #D0EFFF 100%)",
          border: "1px solid rgba(14, 165, 233, 0.15)",
          boxShadow: "inset 0 1px 2px rgba(255, 255, 255, 0.8), 0 20px 50px rgba(14, 165, 233, 0.08), 0 2px 8px rgba(0, 0, 0, 0.02)",
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Double Glowing ambient corners for Luxury Aura Effect */}
        <div
          className="absolute pointer-events-none transition-transform duration-1000 group-hover:scale-110"
          style={{
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56, 189, 248, 0.28) 0%, transparent 70%)",
            top: -100,
            right: -60,
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(254, 215, 170, 0.25) 0%, transparent 70%)",
            bottom: -60,
            left: -40,
          }}
        />

        <NoiseOverlay />

        {/* Content */}
        <div
          className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          style={{ padding: "36px 44px" }}
        >
          {/* Left: text block */}
          <div className="flex-1 min-w-0">
            {/* Pill */}
            <div
              className="inline-flex items-center gap-1.5 font-bold uppercase mb-5"
              style={{
                fontSize: 9,
                letterSpacing: "0.25em",
                color: "#0284C7",
                border: "1px solid rgba(14, 165, 233, 0.25)",
                background: "rgba(14, 165, 233, 0.06)",
                padding: "6px 14px",
                borderRadius: 100,
              }}
            >
              <Sparkles size={9} strokeWidth={2.5} />
              your monthly story
            </div>
  
            {/* Month + Wrapped */}
            <div className="flex items-baseline gap-1 flex-wrap">
              <span
                className="font-black leading-none"
                style={{
                  fontSize: "clamp(48px, 8vw, 68px)",
                  letterSpacing: "-0.04em",
                  color: "#0F172A",
                  textShadow: "0 2px 10px rgba(14,165,233,0.05)"
                }}
              >
                {month}
              </span>
              <span
                className="font-serif italic font-bold"
                style={{
                  fontSize: 22,
                  color: "#0284C7",
                  letterSpacing: "0.02em",
                  textShadow: "0 0 20px rgba(14,165,233,0.15)",
                  marginLeft: 16
                }}
              >
                Wrapped ✦
              </span>
            </div>
  
            {/* Subtitle */}
            <p
              style={{
                fontSize: 14,
                color: "#334155",
                opacity: 0.85,
                lineHeight: 1.7,
                marginTop: 14,
                fontWeight: 400,
                maxWidth: 420,
              }}
            >
              Revisit the moods, people &amp; places that made this month yours.
            </p>
          </div>
  
          {/* Right: CTA */}
          <div className="flex-shrink-0 relative z-20">
            <button
              onClick={onWatchRecap}
              className="flex items-center justify-center gap-2.5 font-bold uppercase cursor-pointer active:scale-95 hover:shadow-[0_12px_40px_rgba(14,165,233,0.4)] transition-all duration-300"
              style={{
                padding: "18px 40px",
                borderRadius: 18,
                background: "linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)",
                color: "#ffffff",
                fontSize: 11,
                letterSpacing: "0.2em",
                border: "none",
                boxShadow: "0 8px 30px rgba(14, 165, 233, 0.25)",
                whiteSpace: "nowrap",
              }}
            >
              <Play size={12} strokeWidth={0} fill="#ffffff" />
              Watch Story
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}