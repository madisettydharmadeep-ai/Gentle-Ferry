"use client";

import { clsx } from "clsx";
import { getImageSrc } from "../../../app/components/PostcardView";

export default function CalendarView({
  viewYear,
  viewMonth,
  cells,
  entryMap,
  isToday,
  openEntries,
  WEEKDAYS
}) {
  // Split flat cells array into weeks (chunks of 7)
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const DayCell = ({ day, mobile }) => {
    if (!day)
      return (
        <div
          className={clsx(
            "aspect-square border border-dashed border-[#ddd5c8]",
            mobile ? "rounded-md" : "rounded-xl border-2",
          )}
        />
      );

    const dayEntries = entryMap[day] || [];
    const hasEntry = dayEntries.length > 0;
    const thumbEntry = dayEntries.find(
      (e) => e.driveFileId || e.driveImageUrl || e.imageBase64,
    );
    const thumbUrl = thumbEntry ? getImageSrc(thumbEntry) : null;

    return (
      <div
        className={clsx(
          "aspect-square relative overflow-hidden transition-all select-none",
          mobile ? "rounded-md" : "rounded-xl",
          hasEntry && thumbUrl
            ? clsx(
                "cursor-pointer hover:scale-[1.03]",
                mobile
                  ? "border border-[#2a2a2a]/80 shadow-[1px_1px_0px_rgba(0,0,0,0.15)]"
                  : "border-2 border-[#2a2a2a]/80 shadow-[3px_3px_0px_rgba(0,0,0,0.18)]",
              )
            : hasEntry
              ? clsx(
                  "cursor-pointer border-dashed border-blush/50 bg-blush/5 hover:bg-blush/10",
                  mobile ? "border" : "border-2",
                )
              : clsx(
                  "border-dashed border-[#ddd5c8]",
                  mobile ? "border" : "border-2",
                ),
          isToday(day) &&
            !hasEntry &&
            "!border-blush !border-solid bg-blush/5",
        )}
        onClick={() => hasEntry && openEntries(dayEntries)}
      >
        {hasEntry && thumbUrl && (
          <img
            src={thumbUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover z-0"
            referrerPolicy="no-referrer"
          />
        )}
        {hasEntry && thumbUrl && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent z-10" />
        )}
        {hasEntry && thumbUrl ? (
          <span
            className={clsx(
              "absolute bottom-1 left-1 z-20 font-black leading-none drop-shadow-lg",
              mobile ? "text-[0.55rem]" : "text-lg",
              isToday(day) ? "text-honey" : "text-white",
            )}
          >
            {day}
          </span>
        ) : (
          <span
            className={clsx(
              "absolute font-bold leading-none",
              hasEntry
                ? "top-1.5 left-2 text-[0.6rem] text-ink-faint"
                : "inset-0 flex items-center justify-center",
              !hasEntry && (mobile ? "text-xs" : "text-xl"),
              !hasEntry &&
                (isToday(day) ? "text-blush" : "text-[#c8bfb3]"),
              hasEntry && isToday(day) && "text-blush",
            )}
          >
            {day}
          </span>
        )}
        {hasEntry &&
          !thumbUrl &&
          (() => {
            const mood = dayEntries[0]?.mood?.toLowerCase();
            const dot =
              mood === "happy"
                ? "#fbbf24"
                : mood === "sad"
                  ? "#60a5fa"
                  : mood === "angry"
                    ? "#f87171"
                    : mood === "anxious"
                      ? "#fb923c"
                      : mood === "calm"
                        ? "#34d399"
                        : mood === "excited"
                          ? "#f472b6"
                          : mood === "tired"
                            ? "#94a3b8"
                            : mood === "grateful"
                              ? "#4ade80"
                              : mood === "nostalgic"
                                ? "#f59e0b"
                                : mood === "lonely"
                                  ? "#818cf8"
                                  : "#e879f9";
            return (
              <>
                <div className="absolute inset-0 bg-[#fdf8f2] z-0" />
                <div className="absolute inset-0 z-[1] flex flex-col justify-center px-[18%] gap-[14%]">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-px rounded-full bg-[#d6cfc6]"
                      style={{ width: i === 2 ? "60%" : "100%" }}
                    />
                  ))}
                </div>
                <div
                  className="absolute bottom-1.5 right-1.5 z-[2] w-2 h-2 rounded-full"
                  style={{ backgroundColor: dot }}
                />
              </>
            );
          })()}
        {hasEntry &&
          thumbUrl &&
          (dayEntries.length > 1 || dayEntries[0]?.mood) && (
            <div className="absolute bottom-1 right-1 z-20">
              {dayEntries.length > 1 ? (
                <span
                  className={clsx(
                    "rounded-full bg-blush border border-white text-white font-black flex items-center justify-center shadow-md",
                    mobile
                      ? "w-3.5 h-3.5 text-[0.4rem]"
                      : "w-6 h-6 text-[0.5rem] border-2",
                  )}
                >
                  +{dayEntries.length - 1}
                </span>
              ) : (
                <span
                  className={clsx(
                    "rounded-full bg-white/90 border border-white font-black text-ink flex items-center justify-center shadow-md capitalize",
                    mobile
                      ? "w-3.5 h-3.5 text-[0.4rem]"
                      : "w-6 h-6 text-[0.5rem] border-2",
                  )}
                >
                  {dayEntries[0].mood[0]}
                </span>
              )}
            </div>
          )}
      </div>
    );
  };

  return (
    <div className="bg-[#f7f3ed]/70 backdrop-blur-3xl border border-[#e8e0d5] overflow-hidden shadow-xl rounded-lg w-full">
      {/* MOBILE View */}
      <div className="md:hidden p-2">
        {WEEKDAYS.map((w, wdIdx) => (
          <div key={w} className="flex items-center gap-1.5 mb-1.5">
            <div className="w-6 shrink-0 text-[0.5rem] font-bold text-[#b8ad9e] uppercase text-center">
              {w.slice(0, 2)}
            </div>
            {weeks.map((week, wkIdx) => (
              <div key={wkIdx} className="flex-1">
                <DayCell day={week[wdIdx]} mobile={true} />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* DESKTOP View */}
      <div className="hidden md:block">
        <div className="grid grid-cols-7 border-b border-[#e0d8ce]">
          {WEEKDAYS.map((w) => (
            <div
              key={w}
              className="py-3 text-center text-[0.65rem] font-bold text-[#b8ad9e] uppercase tracking-[0.2em]"
            >
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2.5 p-3">
          {cells.map((day, idx) => (
            <DayCell
              key={day ?? `b${idx}`}
              day={day}
              mobile={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
