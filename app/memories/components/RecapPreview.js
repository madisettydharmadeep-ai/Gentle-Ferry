"use client";

import { Sparkles, Play } from "lucide-react";

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
        className="w-full relative overflow-hidden"
        style={{
          borderRadius: 18,
          background: "#FFF8F5",
          boxShadow: "0 8px 40px rgba(255,140,100,0.1), 0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        {/* Soft peach blob top-right */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, #FFD0BA 0%, transparent 70%)",
            top: -100,
            right: -60,
            opacity: 0.65,
          }}
        />
        {/* Soft rose blob bottom-left */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, #FFDDD0 0%, transparent 70%)",
            bottom: -60,
            left: -40,
            opacity: 0.5,
          }}
        />

        {/* Content */}
        <div
          className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          style={{ padding: "32px 36px" }}
        >
          {/* Left: text block */}
          <div className="flex-1 min-w-0">
            {/* Pill */}
            <div
              className="inline-flex items-center gap-1.5 font-black uppercase mb-5"
              style={{
                fontSize: 10,
                letterSpacing: "0.22em",
                color: "#F4845F",
                background: "#FEEAE0",
                padding: "5px 13px",
                borderRadius: 100,
              }}
            >
              <Sparkles size={10} strokeWidth={2.5} />
              your monthly story
            </div>

            {/* Month + Wrapped */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <span
                className="font-black leading-none"
                style={{
                  fontSize: "clamp(44px, 8vw, 64px)",
                  letterSpacing: "-0.04em",
                  color: "#222",
                }}
              >
                {month}
              </span>
              <span
                className="font-bold"
                style={{
                  fontSize: 18,
                  color: "#C4A99A",
                  letterSpacing: "0.01em",
                }}
              >
                Wrapped ✦
              </span>
            </div>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 14,
                color: "#A08880",
                lineHeight: 1.7,
                marginTop: 12,
                fontWeight: 500,
                maxWidth: 380,
              }}
            >
              Revisit the moods, people &amp; places that made this month yours.
            </p>
          </div>

          {/* Right: CTA */}
          <div className="flex-shrink-0">
            <button
              onClick={onWatchRecap}
              className="flex items-center justify-center gap-2 font-black uppercase cursor-pointer active:scale-95 hover:opacity-90 transition-all"
              style={{
                padding: "16px 36px",
                borderRadius: 16,
                background: "#F4845F",
                color: "#fff",
                fontSize: 12,
                letterSpacing: "0.18em",
                border: "none",
                boxShadow: "0 6px 20px rgba(244,132,95,0.28)",
                whiteSpace: "nowrap",
              }}
            >
              <Play size={13} strokeWidth={0} fill="white" />
              Watch Story
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}