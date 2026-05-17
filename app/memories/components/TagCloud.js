"use client";

export default function TagCloud({ tags, type, onTagClick }) {
  if (tags.length === 0) return null;

  const isPeople = type === "people";
  const accentColor = isPeople ? "text-blue-600 bg-blue-100/60" : "text-emerald-600 bg-emerald-100/60";
  const badgeColor = isPeople ? "bg-blue-500" : "bg-emerald-600";

  return (
    <div className="grid grid-cols-2 md:flex md:flex-wrap gap-4">
      {tags.map(([tag, entries]) => (
        <button
          key={tag}
          onClick={() => onTagClick(entries, tag)}
          className="group flex items-center gap-2 px-3 md:px-5 py-2 bg-white/20 backdrop-blur-3xl border border-white/30 hover:bg-white/40 transition-all rounded-lg shadow-lg hover:shadow-2xl active:scale-95 relative z-10"
        >
          <div className={`w-7 h-7 md:w-8 md:h-8 rounded-md ${accentColor} shadow-sm flex items-center justify-center font-bold text-xs md:text-sm shrink-0`}>
            {isPeople ? tag.substring(1, 2).toUpperCase() : "#"}
          </div>
          <span className="font-bold text-ink text-sm md:text-base truncate">
            {tag}
          </span>
          <span className={`px-2 py-0.5 ${badgeColor} text-white text-[0.6rem] font-bold rounded-md ml-auto md:ml-1 min-w-[20px] shadow-sm`}>
            {entries.length}
          </span>
        </button>
      ))}
    </div>
  );
}
