"use client";

import { X, ChevronUp, ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import PostcardView from "../../components/PostcardView";

export default function MemoryModal({
  selectedEntries,
  currentIdx,
  setCurrentIdx,
  activeTagLabel,
  activeTab,
  onClose,
  onDelete
}) {
  if (!selectedEntries) return null;

  return (
    <div
      className="fixed inset-0 bg-ink/50 backdrop-blur-md z-[200] flex items-center justify-center p-4 md:p-8 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-[960px] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Info Header if viewing a group */}
        {activeTagLabel && (
          <div className="absolute -top-12 left-0 right-0 flex justify-center text-white font-bold drop-shadow-md text-lg items-center gap-2">
            <span>
              {activeTab === "people"
                ? "Viewing memories with"
                : "Viewing memories at"}
            </span>
            <span
              className={clsx(
                "px-3 py-1 bg-white/20 rounded-full",
                activeTab === "people"
                  ? "text-blue-100"
                  : "text-emerald-100",
              )}
            >
              {activeTagLabel}
            </span>
            <span className="text-sm font-normal opacity-80 ml-2">
              ({currentIdx + 1} of {selectedEntries.length})
            </span>
          </div>
        )}

        {/* Close button */}
        <button
          className="fixed top-4 right-4 md:absolute md:-top-5 md:-right-5 z-[210] w-10 h-10 rounded-full bg-white border border-line-strong text-ink-soft flex items-center justify-center shadow-xl transition-all hover:bg-ink hover:text-cream hover:border-ink hover:rotate-90 pointer-events-auto"
          onClick={onClose}
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        {/* Vertical Up/Down Controls — only if multiple */}
        {selectedEntries.length > 1 && (
          <>
            <div className="absolute top-1/2 -translate-y-1/2 right-2 md:-right-20 flex flex-col gap-6 z-[300] pointer-events-none">
              <button
                disabled={currentIdx === 0}
                className={clsx(
                  "w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/40 md:bg-white/20 backdrop-blur-xl border border-white/50 md:border-white/30 flex items-center justify-center text-ink md:text-white shadow-2xl transition-all hover:bg-white/60 md:hover:bg-white/40 hover:scale-110 active:scale-90 pointer-events-auto",
                  currentIdx === 0 && "opacity-0 pointer-events-none",
                )}
                onClick={() => setCurrentIdx((i) => i - 1)}
              >
                <ChevronUp size={28} strokeWidth={3} />
              </button>

              <button
                disabled={currentIdx === selectedEntries.length - 1}
                className={clsx(
                  "w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/40 md:bg-white/20 backdrop-blur-xl border border-white/50 md:border-white/30 flex items-center justify-center text-ink md:text-white shadow-2xl transition-all hover:bg-white/60 md:hover:bg-white/40 hover:scale-110 active:scale-90 pointer-events-auto",
                  currentIdx === selectedEntries.length - 1 &&
                    "opacity-0 pointer-events-none",
                )}
                onClick={() => setCurrentIdx((i) => i + 1)}
              >
                <ChevronDown size={28} strokeWidth={3} />
              </button>
            </div>

            {/* Vertical page indicators (The 'Spine') */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-20 flex flex-col gap-2 z-[300]">
              {selectedEntries.map((_, i) => (
                <button
                  key={i}
                  className={clsx(
                    "w-2 h-8 rounded-full transition-all duration-300 border border-white/10 shadow-lg",
                    i === currentIdx
                      ? "bg-white h-12 shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                      : "bg-white/40 hover:bg-white/60 md:bg-white/20 md:hover:bg-white/40",
                  )}
                  onClick={() => setCurrentIdx(i)}
                />
              ))}
            </div>
          </>
        )}

        {/* Stacked Postcard System */}
        <div className="relative w-full flex flex-col items-center max-h-[90vh] overflow-y-auto overflow-x-hidden hide-scrollbar">
          {selectedEntries.length > 2 && (
            <div
              className="absolute inset-x-12 top-16 h-[440px] bg-white/40 border-2 border-white/40 rounded-lg scale-[0.94] blur-[1px] z-0 shadow-2xl -rotate-2"
              style={{ transformOrigin: "bottom center" }}
            />
          )}
          {selectedEntries.length > 1 && (
            <div
              className="absolute inset-x-6 top-8 h-[440px] bg-white/60 border-2 border-white/60 rounded-lg scale-[0.97] blur-[0.5px] z-[10] shadow-2xl rotate-1"
              style={{ transformOrigin: "bottom center" }}
            />
          )}

          <div className="relative animate-[slideUpFade_0.4s_ease-out] z-[20] w-full shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
            <PostcardView
              entry={selectedEntries[currentIdx]}
              onDelete={onDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
