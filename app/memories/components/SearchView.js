"use client";

import { X, Search } from "lucide-react";
import { getImageSrc } from "../../../app/components/PostcardView";

export default function SearchView({
  query,
  isSearching,
  entries,
  onClear,
  onEntryClick
}) {
  if (!query.trim()) return null;

  return (
    <div className="mb-6">
      {/* Search header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-ink font-bold text-lg">
          {isSearching
            ? "Searching..."
            : `${entries.length} result${entries.length !== 1 ? "s" : ""} for "${query}"`}
        </h3>
        <button
          onClick={onClear}
          className="text-sm text-ink-soft hover:text-ink flex items-center gap-1.5 transition-colors"
        >
          <X size={14} /> Clear
        </button>
      </div>

      {/* Search results grid */}
      {!isSearching && entries.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((entry, idx) => {
            const date = new Date(entry.entryDate);
            const thumbUrl = entry.driveImageUrl ? getImageSrc(entry) : null;
            const textPreview = entry.text?.replace(/[@#]\w+/g, "").slice(0, 120) || "";

            return (
              <div
                key={entry._id || idx}
                onClick={() => onEntryClick([entry])}
                className="group relative bg-white/60 backdrop-blur-xl border border-white/50 rounded-lg p-4 pb-12 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[0.65rem] font-bold text-[#b8ad9e] uppercase tracking-wider">
                    {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  {entry.mood && (
                    <span className="text-[0.65rem] px-2 py-1 bg-blush/20 text-blush-dark rounded-full font-medium">
                      {entry.mood}
                    </span>
                  )}
                </div>

                {thumbUrl && (
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 shadow-md">
                    <img
                      src={thumbUrl}
                      alt=""
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                )}

                <p className="text-ink text-sm leading-relaxed line-clamp-4">
                  {textPreview || <span className="italic text-ink-faint">Photo memory</span>}
                  {entry.text?.length > 120 && "..."}
                </p>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="text-[0.6rem] text-ink-faint font-medium">{date.getFullYear()}</span>
                  <span className="text-xs text-blush font-bold group-hover:translate-x-0.5 transition-transform">View →</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* No results */}
      {!isSearching && entries.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-12 text-center bg-white/20 backdrop-blur-3xl border border-white/30 rounded-lg">
          <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center">
            <Search size={20} className="text-ink-faint" />
          </div>
          <p className="text-ink-soft text-sm">No memories found matching "{query}"</p>
          <button onClick={onClear} className="text-sm text-blush font-bold hover:underline">Clear search</button>
        </div>
      )}
    </div>
  );
}
