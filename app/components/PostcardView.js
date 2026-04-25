'use client';

import { useState, useEffect } from 'react';
import { ImageIcon, Trash2, AlertTriangle, Loader2, FolderOpen, ChevronDown, Check } from 'lucide-react';
import { useAuth } from '../../utils/AuthContext';

/**
 * Get an embeddable image URL from a journal entry.
 * - New entries: driveImageUrl is already a lh3.googleusercontent.com URL
 * - Old entries: driveImageUrl is a webViewLink, so we fallback to driveFileId
 */
function getImageSrc(entry) {
  // If we have a driveFileId, always construct the direct URL (most reliable)
  if (entry.driveFileId) {
    return `https://lh3.googleusercontent.com/d/${entry.driveFileId}=s1200`;
  }
  // Fallback to whatever driveImageUrl we have (may not be embeddable)
  return entry.driveImageUrl || entry.imageBase64 || null;
}

/** Formats text to highlight @people, #places and custom user highlights */
function formatText(text, highlights = []) {
  if (!text) return null;
  
  const segments = [];
  
  // 1. Tags (@people, #places)
  const tagRegex = /(@\w+|#\w+)/g;
  let match;
  while ((match = tagRegex.exec(text)) !== null) {
    segments.push({ 
      start: match.index, 
      end: match.index + match[0].length, 
      type: 'tag', 
      content: match[0],
      bg: match[0].startsWith('@') ? 'rgba(59, 130, 246, 0.15)' : 'rgba(249, 115, 22, 0.15)',
      color: match[0].startsWith('@') ? '#2563eb' : '#ea580c'
    });
  }
  
  // 2. Custom Highlights (Phrase-based or Index-based)
  if (Array.isArray(highlights)) {
    highlights.forEach((h, idx) => {
      let start = -1;
      let end = -1;
      
      if (h.phrase) {
        start = text.indexOf(h.phrase);
        if (start !== -1) end = start + h.phrase.length;
      } else if (typeof h.start === 'number' && typeof h.end === 'number') {
        start = h.start;
        end = h.end;
      }
      
      if (start !== -1 && end > start) {
        segments.push({ 
          ...h, 
          start, 
          end, 
          type: 'highlight',
          color: h.color || '#ff8a80'
        });
      }
    });
  }
  
  // 3. Sorting (Highlights win over tags)
  segments.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    if (a.type !== b.type) return a.type === 'highlight' ? -1 : 1;
    return (b.end - b.start) - (a.end - a.start);
  });

  const result = [];
  let lastIdx = 0;
  segments.forEach((seg, idx) => {
    if (seg.start < lastIdx) return;
    
    // Add text before the segment
    if (seg.start > lastIdx) {
      result.push(<span key={`txt-${idx}`}>{text.substring(lastIdx, seg.start)}</span>);
    }
    
    // Add the segment
    const content = text.substring(seg.start, seg.end);
    if (seg.type === 'tag') {
      result.push(
        <span key={`seg-${idx}`} className="rounded-md px-1 mx-0.5" style={{ color: seg.color, backgroundColor: seg.bg, border: `1px solid ${seg.color}40`, boxShadow: `0 0 0 1px ${seg.color}20` }}>
          {content}
        </span>
      );
    } else {
      result.push(
        <span key={`seg-${idx}`} className="rounded-md px-1" style={{ backgroundColor: seg.bg, borderBottom: `2.5px solid ${seg.color}80`, boxShadow: `0 0 0 1px ${seg.color}20` }}>
          {content}
        </span>
      );
    }
    lastIdx = seg.end;
  });
  
  // Add remaining text
  if (lastIdx < text.length) {
    result.push(<span key="last">{text.substring(lastIdx)}</span>);
  }
  
  return result;
}

/** Get the Drive web view link for "Open in Drive" */
function getDriveLink(entry) {
  if (entry.driveFileId) {
    return `https://drive.google.com/file/d/${entry.driveFileId}/view`;
  }
  // Old entries might have webViewLink stored in driveImageUrl
  if (entry.driveImageUrl?.includes('drive.google.com')) {
    return entry.driveImageUrl;
  }
  return null;
}

/**
 * PostcardView — read-only postcard identical to JournalCard.
 * Sharp container, rounded inner elements, horizontal on desktop.
 */
export default function PostcardView({ entry, onDelete }) {
  const { user } = useAuth();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Collection state
  const [collections, setCollections] = useState([]);
  const [showCollectionPicker, setShowCollectionPicker] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(entry.collectionId || null);
  const [savingCollection, setSavingCollection] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/collections?userId=${user.id}`)
        .then(r => r.json())
        .then(d => { if (d.success) setCollections(d.collections); })
        .catch(console.error);
    }
  }, [user]);

  const assignCollection = async (collectionId) => {
    setSavingCollection(true);
    try {
      const res = await fetch('/api/entries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId: entry._id, userId: user.id, collectionId: collectionId || null }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedCollection(collectionId);
      }
    } catch (err) {
      console.error('Failed to assign collection:', err);
    } finally {
      setSavingCollection(false);
      setShowCollectionPicker(false);
    }
  };

  const date = new Date(entry.entryDate);
  const dayNum = date.getDate();
  const monthShort = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const yearStr = date.getFullYear();
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });

  const imageSrc = getImageSrc(entry);
  const driveLink = getDriveLink(entry);

  const handleConfirmDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    await onDelete(entry._id);
    setIsDeleting(false);
  };

  return (
    <div className="bg-card border border-line shadow-md flex flex-col md:flex-row h-auto md:h-[440px] relative rounded-2xl" style={{overflow: 'clip'}}>

      {/* ── Left: Image — 4:3 ── */}
      {imageSrc && (
        <div className="relative w-full md:w-[44%] aspect-square md:h-full shrink-0 overflow-hidden bg-muted group">
          <img
            src={imageSrc}
            alt="Journal entry"
            className="w-full h-full object-cover block"
            referrerPolicy="no-referrer"
          />
          {driveLink && (
            <a
              href={driveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-bold hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100"
            >
              <ImageIcon size={12} strokeWidth={2} />
              Open in Drive
            </a>
          )}
        </div>
      )}

      {/* ── Right: Text zone ── */}
      <div className={`flex-1 flex flex-col ${imageSrc ? 'border-t md:border-t-0 md:border-l border-line' : ''}`} style={{overflow: 'visible'}}>

        {/* Date stamp + mood */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-line gap-4 sm:gap-3 shrink-0 relative z-[60] overflow-visible">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg border-2 border-dashed border-blush/40 bg-blush-light flex flex-col items-center justify-center leading-none shrink-0">
              <span className="text-[0.6rem] font-bold text-blush uppercase">{monthShort}</span>
              <span className="text-lg font-bold text-ink leading-none">{dayNum}</span>
            </div>
            <div>
              <p className="text-[0.95rem] font-bold text-ink leading-tight">{weekday}</p>
              <p className="text-xs text-ink-faint">{yearStr}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-start sm:justify-end w-full sm:w-auto flex-wrap">
            {entry.mood && (
              <span className="px-4 py-1.5 rounded-full bg-muted text-xs font-bold text-ink-soft capitalize border border-line">
                {entry.mood}
              </span>
            )}

            {/* Collection Picker */}
            <div className="relative">
              <button
                onClick={() => setShowCollectionPicker(!showCollectionPicker)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-line bg-muted hover:bg-white transition-all"
                title="Add to collection"
              >
                {savingCollection ? (
                  <Loader2 size={12} className="animate-spin text-ink-faint" />
                ) : (
                  <FolderOpen size={12} strokeWidth={2} className="text-ink-soft" />
                )}
                <span className="text-ink-soft">
                  {selectedCollection
                    ? (collections.find(c => c._id === selectedCollection)?.name || 'Collection')
                    : 'Add to collection'}
                </span>
                <ChevronDown size={11} className="text-ink-faint" />
              </button>

              {showCollectionPicker && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-card border border-line rounded-xl shadow-2xl py-1.5 z-[999]">
                  <button
                    onClick={() => assignCollection(null)}
                    className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-muted transition-colors text-ink-soft"
                  >
                    {!selectedCollection && <Check size={11} className="text-ink" />}
                    <span className={!selectedCollection ? 'font-medium text-ink' : ''}>None</span>
                  </button>
                  {collections.length === 0 && (
                    <p className="px-3 py-2 text-xs text-ink-faint italic">No collections yet</p>
                  )}
                  {collections.map(c => (
                    <button
                      key={c._id}
                      onClick={() => assignCollection(c._id)}
                      className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-muted transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                      {selectedCollection === c._id && <Check size={11} className="text-ink shrink-0" />}
                      <span className={selectedCollection === c._id ? 'font-medium text-ink' : 'text-ink-soft'}>{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {onDelete && (
              <button 
                onClick={() => setIsConfirmingDelete(true)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-ink-faint hover:bg-blush-light hover:text-blush transition-colors shrink-0"
                title="Delete Entry"
              >
                <Trash2 size={16} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>

        {/* Text on ruled lines */}
        {entry.text ? (
          <div
            className="px-6 py-5 text-[1.05rem] text-ink leading-[2.15] whitespace-pre-wrap flex-1 overflow-y-auto min-h-0"
            style={{
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 2.1em, var(--color-line) 2.1em, var(--color-line) 2.14em)',
              backgroundPositionY: '1.2em',
            }}
          >
            {formatText(entry.text, entry.highlights)}
          </div>
        ) : (
          <div className="px-6 py-6 text-sm text-ink-faint italic flex-1">
            (photo only — no words today)
          </div>
        )}
      </div>

      {/* ── Dangerous Action Modal Overlay ── */}
      {isConfirmingDelete && (
        <div className="absolute inset-0 z-50 bg-ink/70 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-card max-w-[400px] w-full rounded-2xl p-6 shadow-2xl border border-line-strong flex flex-col">
            <div className="w-12 h-12 rounded-full bg-[#FF453A]/10 flex items-center justify-center text-[#FF453A] mb-4">
               <AlertTriangle size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-ink mb-2">Delete this memory?</h3>
            <p className="text-sm text-ink-soft leading-relaxed mb-6">
              This action is permanent and cannot be undone. 
              {entry.driveFileId && " Since this entry contains an image, we will also permanently delete the file from your connected Google Drive."}
            </p>
            
            <div className="flex gap-3 mt-auto justify-end">
              <button 
                className="px-5 py-2.5 rounded-full text-sm font-bold text-ink-soft hover:bg-muted transition-colors disabled:opacity-50"
                onClick={() => setIsConfirmingDelete(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold bg-[#FF453A] text-white hover:bg-[#D9362B] active:scale-95 transition-all w-[120px] shadow-sm disabled:opacity-60 disabled:active:scale-100"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? <><Loader2 size={16} className="animate-spin" /> Deleting</> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Export helpers so Memories page can use them for thumbnails
export { getImageSrc };
