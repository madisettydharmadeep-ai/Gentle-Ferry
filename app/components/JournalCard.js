'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { X, Check, Loader2, ImagePlus, FolderOpen, ChevronDown, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import CameraCropper from './CameraCropper';

const MOODS = [
  { key: 'joyful', label: 'Joyful', emoji: '😊', color: '#E8837C', bg: '#FFF1EF', border: '#FFD3D0' },
  { key: 'calm',   label: 'Calm',   emoji: '😌', color: '#7FB69E', bg: '#F2F8F5', border: '#D5EBE1' },
  { key: 'low',    label: 'Low',    emoji: '😔', color: '#93BFEB', bg: '#F0F6FC', border: '#DCEBFA' },
];

const HIGHLIGHT_COLORS = [
  { name: 'Blush',   color: '#ff8a80', bg: 'rgba(255,138,128,0.3)' },
  { name: 'Sage',    color: '#b9f6ca', bg: 'rgba(185,246,202,0.3)' },
  { name: 'Sky',     color: '#80d8ff', bg: 'rgba(128,216,255,0.3)' },
  { name: 'Honey',   color: '#ffff8d', bg: 'rgba(255,255,141,0.3)' },
  { name: 'Lavender', color: '#ea80fc', bg: 'rgba(234,128,252,0.3)' },
];

export default function JournalCard({ onSaved }) {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [text, setText] = useState('');
  const [imageBase64, setImageBase64] = useState(null);
  const [mood, setMood] = useState(null);
  const [overrideDate, setOverrideDate] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  
  // Highlighting state
  const [highlights, setHighlights] = useState([]);
  const [selectionPopup, setSelectionPopup] = useState(null);
  const textareaRef = useRef(null);

  const [rawImage, setRawImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  
  // Collection state
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  const handleImageFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setRawImage(e.target.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  }, []);

  // Fetch collections on mount
  useEffect(() => {
    if (user?.id) {
      fetch(`/api/collections?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setCollections(data.collections);
          }
        })
        .catch(console.error);
    }
  }, [user]);

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim() || !user?.id) return;

    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: newCollectionName.trim(),
          color: '#E8B4B8', // Default blush color
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCollections([data.collection, ...collections]);
        setSelectedCollection(data.collection);
        setIsCreatingCollection(false);
        setNewCollectionName('');
        setShowCollectionDropdown(false);
      }
    } catch (err) {
      console.error('Failed to create collection:', err);
    }
  };

  const handleTextSelection = () => {
    const el = textareaRef.current;
    if (!el || saving || saved) return;
    
    const start = el.selectionStart;
    const end = el.selectionEnd;
    
    if (start !== end) {
      // Create a mirror for measurement
      const div = document.createElement('div');
      const style = window.getComputedStyle(el);
      
      const importantStyles = [
        'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 
        'paddingTop', 'paddingLeft', 'paddingRight', 'paddingBottom',
        'width', 'height', 'boxSizing', 'whiteSpace', 'wordBreak', 'wordWrap', 'letterSpacing'
      ];
      importantStyles.forEach(prop => { div.style[prop] = style[prop]; });
      
      div.style.position = 'absolute';
      div.style.visibility = 'hidden';
      div.style.left = '-9999px';
      div.style.top = '0';
      
      // Calculate up to selection end
      const textBefore = text.substring(0, end);
      div.innerText = textBefore;
      
      const span = document.createElement('span');
      span.innerText = '|'; 
      div.appendChild(span);
      
      document.body.appendChild(div);
      const spanRect = span.getBoundingClientRect();
      const divRect = div.getBoundingClientRect();
      document.body.removeChild(div);

      // Relative coordinates
      const x = spanRect.left - divRect.left;
      const y = spanRect.top - divRect.top;

      const container = el.parentElement;
      const containerRect = container.getBoundingClientRect();

      setSelectionPopup({ 
        start, 
        end,
        // Increased horizontal safe zones (150px) to prevent the wide popup from clipping on edges
        x: Math.min(containerRect.width - 150, Math.max(150, x + 32)), 
        y: Math.max(20, y - 10) // ABOVE text
      });
    } else {
      setSelectionPopup(null);
    }
  };

  const addHighlight = (colorInfo) => {
    if (!selectionPopup) return;
    
    // Remove any existing highlights that overlap with this new range to prevent glitches
    const newHighlights = highlights.filter(h => 
      !(h.start < selectionPopup.end && h.end > selectionPopup.start)
    );

    const newH = {
      start: selectionPopup.start,
      end: selectionPopup.end,
      bg: colorInfo.bg,
      color: colorInfo.color
    };
    
    setHighlights([...newHighlights, newH]);
    setSelectionPopup(null);
    if (textareaRef.current) {
      textareaRef.current.selectionStart = textareaRef.current.selectionEnd;
    }
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    const diff = newText.length - text.length;
    const cursorPos = e.target.selectionStart;

    // Adjust highlight ranges as user types
    setHighlights(prev => prev.map(h => {
      if (cursorPos <= h.start) {
        return { ...h, start: h.start + diff, end: h.end + diff };
      }
      if (cursorPos > h.start && cursorPos <= h.end) {
        return { ...h, end: h.end + diff };
      }
      return h;
    }).filter(h => h.start < h.end && h.start >= 0));

    setText(newText);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleImageFile(e.dataTransfer.files?.[0]);
  };

  const clearImage = () => {
    setImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    if (!text.trim() && !imageBase64) {
      setError('Add a note or a photo first.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          text: text, // Removed .trim() to keep indices stable
          imageBase64,
          mood,
          highlights,
          collectionId: selectedCollection?._id || null,
          entryDate: (overrideDate ? new Date(overrideDate.split('-')[0], overrideDate.split('-')[1] - 1, overrideDate.split('-')[2]) : new Date()).toISOString(),
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Save failed');
      
      setSaved(true);
      onSaved?.(data.entry);
      
      setTimeout(() => {
        setText('');
        clearImage();
        setMood(null);
        setHighlights([]);
        setSelectedCollection(null);
        setSaved(false);
      }, 3500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCroppedImage = (croppedBase64) => {
    setImageBase64(croppedBase64);
    setShowCropper(false);
    setRawImage(null);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setRawImage(null);
  };

  // Date parsing for UI display
  let activeDate = new Date();
  if (overrideDate) {
    const [y, m, d] = overrideDate.split('-');
    activeDate = new Date(y, m - 1, d);
  }
  const dayNum = activeDate.getDate();
  const monthShort = activeDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const yearStr = activeDate.getFullYear();
  const weekday = activeDate.toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <>
      <div className={clsx(
        "bg-card border border-line shadow-md overflow-hidden transition-all hover:shadow-lg rounded-2xl",
        "flex flex-col md:flex-row h-auto md:h-[440px]",
        dragOver && "border-blush shadow-[0_0_0_3px_rgba(232,131,124,0.15)]"
      )}>

        {/* ── Left: Image Section ── */}
        <div
          className={clsx(
            "relative cursor-pointer bg-muted flex items-center justify-center overflow-hidden group shrink-0",
            "w-full md:w-[44%] aspect-square"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !imageBase64 && fileInputRef.current?.click()}
        >
          <input 
            ref={fileInputRef} 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={(e) => handleImageFile(e.target.files?.[0])} 
          />

          {imageBase64 ? (
            <>
              <img src={imageBase64} alt="Journal" className="w-full h-full object-cover block" />
              <button
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 shadow-md text-white flex items-center justify-center hover:bg-black transition-colors z-10"
                onClick={(e) => { e.stopPropagation(); clearImage(); }}
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 text-ink-faint py-12">
              <div className="w-16 h-16 rounded-2xl bg-line/50 flex items-center justify-center">
                <ImagePlus size={28} strokeWidth={1.3} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold">Drop a photo here</p>
                <p className="text-xs opacity-70 mt-0.5">or click to browse · square crop</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Writing Section ── */}
        <div className="flex-1 flex flex-col border-t md:border-t-0 md:border-l border-line">

          {/* Header: Date + Mood */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-line gap-4 sm:gap-2">
            <div className="flex items-center gap-3">
              {/* Date - clickable to change only in testing mode */}
              {process.env.NEXT_PUBLIC_APP_MODE === 'testing' ? (
                <div className="relative group shrink-0" title="Override Date">
                  <input
                    type="date"
                    value={overrideDate || ''}
                    onChange={(e) => setOverrideDate(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <div className="w-12 h-12 rounded-lg border-2 border-dashed border-blush/40 bg-blush-light flex flex-col items-center justify-center leading-none group-hover:bg-blush transition-colors">
                    <span className="text-[0.6rem] font-bold text-blush group-hover:text-white uppercase transition-colors">{monthShort}</span>
                    <span className="text-lg font-bold text-ink group-hover:text-white leading-none transition-colors">{dayNum}</span>
                  </div>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg border-2 border-line bg-white flex flex-col items-center justify-center leading-none">
                  <span className="text-[0.6rem] font-bold text-blush uppercase">{monthShort}</span>
                  <span className="text-lg font-bold text-ink leading-none">{dayNum}</span>
                </div>
              )}
              <div>
                <p className="text-[0.95rem] font-bold text-ink leading-tight">{weekday}</p>
                <p className="text-xs text-ink-faint">{yearStr}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-start sm:justify-end w-full sm:w-auto">
              {MOODS.map((m) => {
                const isActive = mood === m.key;
                return (
                  <button
                    key={m.key}
                    className={clsx(
                      "group relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-[0.8rem] font-bold tracking-wide transition-all duration-300 ease-out border shadow-sm",
                      isActive 
                        ? "scale-[1.03] shadow-md z-10" 
                        : "border-line bg-white/50 text-ink-faint hover:text-ink hover:bg-white hover:border-line-strong hover:-translate-y-0.5 hover:shadow-md"
                    )}
                    style={isActive ? {
                      borderColor: m.border,
                      backgroundColor: m.bg,
                      color: m.color,
                      boxShadow: `0 4px 14px ${m.color}25, inset 0 2px 4px ${m.color}10`
                    } : undefined}
                    onClick={() => setMood(isActive ? null : m.key)}
                  >
                    <span className="text-base transition-transform duration-300">
                      {m.emoji}
                    </span>
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Textarea with Tag Highlighting - Wrapped for pixel-perfect alignment */}
          <div className="relative flex-1 bg-white/40 transition-colors focus-within:bg-white/60 min-h-[220px] p-8 select-none">
            {/* The Highlighter Layer (Behind) */}
            <div 
              className="absolute inset-0 p-8 pointer-events-none text-[1.10rem] tracking-[0.015em] leading-[1.85] font-[family:inherit] whitespace-pre-wrap break-words overflow-hidden"
              aria-hidden="true"
            >
              {(() => {
                const segments = [];
                const tagRegex = /(@\w+|#\w+)/g;
                let match;
                while ((match = tagRegex.exec(text)) !== null) {
                  segments.push({ 
                    start: match.index, 
                    end: match.index + match[0].length, 
                    type: 'tag', 
                    content: match[0],
                    // Default high-fidelity colors for auto-tags
                    bg: match[0].startsWith('@') ? 'rgba(59, 130, 246, 0.15)' : 'rgba(249, 115, 22, 0.15)',
                    color: match[0].startsWith('@') ? '#2563eb' : '#ea580c'
                  });
                }
                highlights.forEach(h => { segments.push({ ...h, type: 'highlight' }); });
                
                // Sort by start, but let custom HIGHLIGHTS win over TAGS at same position
                segments.sort((a, b) => {
                  if (a.start !== b.start) return a.start - b.start;
                  if (a.type !== b.type) return a.type === 'highlight' ? -1 : 1;
                  return (b.end - b.start) - (a.end - a.start);
                });

                const result = [];
                let lastIdx = 0;
                segments.forEach((seg, idx) => {
                  if (seg.start < lastIdx) return;
                  
                  result.push(<span key={`txt-${idx}`}>{text.substring(lastIdx, seg.start)}</span>);
                  const content = text.substring(seg.start, seg.end);
                  
                  if (seg.type === 'tag') {
                    result.push(
                      <span key={`seg-${idx}`} className="rounded-sm" style={{ color: seg.color, backgroundColor: seg.bg, boxShadow: `0 0 0 2px ${seg.bg}` }}>
                        {content}
                      </span>
                    );
                  } else {
                    result.push(
                      <span key={`seg-${idx}`} className="rounded-sm" style={{ backgroundColor: seg.bg, color: 'inherit', boxShadow: `0 0 0 2px ${seg.bg}` }}>
                        {content}
                      </span>
                    );
                  }
                  lastIdx = seg.end;
                });
                result.push(<span key="last">{text.substring(lastIdx)}</span>);
                return result;
              })()}
            </div>

            {/* The Actual Textarea (Front) */}
            <textarea
              ref={textareaRef}
              className="absolute inset-0 w-full h-full p-8 resize-none border-none outline-none font-[family:inherit] text-[1.10rem] tracking-[0.015em] leading-[1.85] bg-transparent placeholder:italic placeholder:text-ink-faint/40 disabled:opacity-60 transition-all caret-ink overflow-auto"
              style={{ 
                color: 'transparent', 
                WebkitTextFillColor: 'transparent',
                // Keep the selection background but hide the text inside it to prevent doubling
                textShadow: 'none',
              }}
              placeholder="What happened today?&#10;&#10;A quiet thought, a sudden feeling, an unforgettable moment…"
              value={text}
              onSelect={handleTextSelection}
              onMouseUp={handleTextSelection}
              onChange={handleTextChange}
              disabled={saving || saved}
            />

            <style jsx>{`
              textarea::selection {
                background-color: rgba(0, 0, 0, 0.08);
                color: transparent !important;
                -webkit-text-fill-color: transparent !important;
              }
            `}</style>

            {/* Selection Popup - Positioned near cursor */}
            {selectionPopup && (
              <div 
                className="absolute z-[100] bg-white border border-line shadow-2xl rounded-full p-1 flex items-center gap-1.5 animate-[scaleIn_0.25s_cubic-bezier(0.175,0.885,0.32,1.275)] origin-bottom"
                style={{ 
                  left: selectionPopup.x, 
                  top: selectionPopup.y,
                  transform: 'translate(-50%, -100%)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-1.5 px-1.5">
                  {/* Null/Clear option */}
                  <button 
                    className="w-7 h-7 rounded-full border border-line bg-white flex items-center justify-center transition-transform hover:scale-110 active:scale-90 shadow-sm overflow-hidden group"
                    onClick={() => {
                        const newHighlights = highlights.filter(h => 
                          !(h.start < selectionPopup.end && h.end > selectionPopup.start)
                        );
                        setHighlights(newHighlights);
                        setSelectionPopup(null);
                    }}
                    title="Clear Highlight"
                  >
                     <div className="w-full h-[1px] bg-red-400 -rotate-45" />
                  </button>

                  {HIGHLIGHT_COLORS.map(c => (
                    <button 
                      key={c.name}
                      className="w-7 h-7 rounded-full border border-black/5 transition-transform hover:scale-110 active:scale-90 shadow-sm"
                      style={{ backgroundColor: c.color }}
                      onClick={() => addHighlight(c)}
                      title={c.name}
                    />
                  ))}
                </div>
                <div className="w-px h-5 bg-line mx-0.5" />
                <button 
                  className="w-7 h-7 rounded-full bg-ink/5 flex items-center justify-center hover:bg-ink/10 transition-colors mr-0.5"
                  onClick={() => setSelectionPopup(null)}
                >
                  <X size={12} className="text-ink" />
                </button>
              </div>
            )}

            {/* Elegant word count flair */}
            {text.length > 0 && (
               <div className="absolute bottom-6 right-8 pointer-events-none opacity-40">
                  <span className="font-[family:inherit] italic text-xs text-ink-faint">{text.split(/\s+/).filter(Boolean).length} words</span>
               </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-line gap-2.5">
            <div className="flex-1 flex items-center gap-3">
              {error && <p className="text-sm text-blush font-medium">{error}</p>}
              
              {/* Collection Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowCollectionDropdown(!showCollectionDropdown)}
                  className={clsx(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                    selectedCollection 
                      ? "bg-muted text-ink" 
                      : "text-ink-faint hover:text-ink hover:bg-muted"
                  )}
                >
                  <FolderOpen size={13} strokeWidth={2} />
                  <span>{selectedCollection?.name || 'Add to collection'}</span>
                  <ChevronDown size={12} className={clsx("transition-transform", showCollectionDropdown && "rotate-180")} />
                </button>
                
                {showCollectionDropdown && (
                  <div className="absolute bottom-full left-0 mb-2 w-56 bg-card border border-line rounded-xl shadow-lg py-2 z-50">
                    {collections.length === 0 && !isCreatingCollection ? (
                      <div className="px-3 py-2">
                        <p className="text-xs text-ink-faint mb-2">No collections yet</p>
                        <button
                          onClick={() => setIsCreatingCollection(true)}
                          className="flex items-center gap-1.5 text-xs text-blush hover:text-blush-dark font-medium transition-colors"
                        >
                          <Plus size={12} />
                          Create new collection
                        </button>
                      </div>
                    ) : isCreatingCollection ? (
                      <div className="px-3 py-2">
                        <input
                          type="text"
                          value={newCollectionName}
                          onChange={(e) => setNewCollectionName(e.target.value)}
                          placeholder="Collection name..."
                          className="w-full px-2 py-1.5 text-xs border border-line rounded-md focus:outline-none focus:ring-1 focus:ring-blush mb-2"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newCollectionName.trim()) {
                              handleCreateCollection();
                            }
                            if (e.key === 'Escape') {
                              setIsCreatingCollection(false);
                              setNewCollectionName('');
                            }
                          }}
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleCreateCollection}
                            disabled={!newCollectionName.trim()}
                            className="flex items-center gap-1 px-2 py-1 text-xs bg-blush text-white rounded-md hover:bg-blush-dark transition-colors disabled:opacity-50"
                          >
                            <Check size={10} />
                            Create
                          </button>
                          <button
                            onClick={() => {
                              setIsCreatingCollection(false);
                              setNewCollectionName('');
                            }}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-ink-soft hover:text-ink transition-colors"
                          >
                            <X size={10} />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setSelectedCollection(null);
                            setShowCollectionDropdown(false);
                          }}
                          className={clsx(
                            "w-full px-3 py-2 text-left text-xs hover:bg-muted transition-colors",
                            !selectedCollection ? "text-ink font-medium" : "text-ink-soft"
                          )}
                        >
                          None
                        </button>
                        <button
                          onClick={() => setIsCreatingCollection(true)}
                          className="w-full px-3 py-2 text-left text-xs text-blush hover:bg-muted transition-colors flex items-center gap-2 border-t border-line mt-1"
                        >
                          <Plus size={12} />
                          Create new collection
                        </button>
                        {collections.map((collection) => (
                          <button
                            key={collection._id}
                            onClick={() => {
                              setSelectedCollection(collection);
                              setShowCollectionDropdown(false);
                            }}
                            className={clsx(
                              "w-full px-3 py-2 text-left text-xs hover:bg-muted transition-colors flex items-center gap-2",
                              selectedCollection?._id === collection._id ? "text-ink font-medium" : "text-ink-soft"
                            )}
                          >
                            <span 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: collection.color }}
                            />
                            {collection.name}
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {text.length > 0 && (
                <span className="text-xs text-ink-faint">{text.length}</span>
              )}
              <button
                className={clsx(
                  "inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-sm font-bold transition-all",
                  saved
                    ? "bg-sage text-white"
                    : "bg-ink text-cream hover:bg-blush",
                  (saving || saved) && "opacity-60 cursor-not-allowed"
                )}
                onClick={handleSave}
                disabled={saving || saved}
              >
                {saving ? (
                  <><Loader2 size={14} className="animate-spin" /> saving…</>
                ) : saved ? (
                  <><Check size={14} strokeWidth={2.5} /> saved!</>
                ) : (
                  'Save entry'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sub-components for Modals and Overlays ── */}
      {showCropper && rawImage && (
        <CameraCropper 
          rawImage={rawImage} 
          onCrop={handleCroppedImage} 
          onCancel={handleCropCancel} 
        />
      )}

    </>
  );
}
