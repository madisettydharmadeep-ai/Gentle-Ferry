'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from '../../../utils/AuthContext';
import Navbar from '../../components/Navbar';
import AnimatedBackground from '../../components/AnimatedBackground';
import PostcardView, { getImageSrc } from '../../components/PostcardView';
import { useWeather } from '../../contexts/WeatherContext';
import { ArrowLeft, FolderOpen, X, ChevronUp, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

function CollectionDetailContent() {
  const { user, loading } = useAuth();
  const { weather } = useWeather();
  const router = useRouter();
  const { id } = useParams();

  const [collection, setCollection] = useState(null);
  const [entries, setEntries] = useState([]);
  const [fetching, setFetching] = useState(true);

  const [selectedEntries, setSelectedEntries] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (!loading && !user) router.push('/');
  }, [user, loading, router]);

  const fetchData = useCallback(async () => {
    if (!user?.id || !id) return;
    setFetching(true);
    try {
      const [colRes, entRes] = await Promise.all([
        fetch(`/api/collections?userId=${user.id}`),
        fetch(`/api/entries?userId=${user.id}&collectionId=${id}`),
      ]);
      const colData = await colRes.json();
      const entData = await entRes.json();

      if (colData.success) {
        const found = colData.collections.find(c => c._id === id);
        setCollection(found || null);
      }
      if (entData.success) setEntries(entData.entries);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  }, [user, id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDeleteEntry = async (entryId) => {
    try {
      const res = await fetch(`/api/entries?id=${entryId}&userId=${user.id}`, { method: 'DELETE' });
      if (res.ok) {
        setEntries(prev => prev.filter(e => e._id !== entryId));
        closeModal();
      }
    } catch {}
  };

  const openModal = (entry) => {
    setSelectedEntries([entry]);
    setCurrentIdx(0);
  };

  const closeModal = () => {
    setSelectedEntries(null);
    setCurrentIdx(0);
  };

  if (loading || fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream">
        <div className="w-2.5 h-2.5 rounded-full bg-blush animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col relative overflow-x-hidden">
      <AnimatedBackground weather={weather} showClouds={true} />
      <Navbar />

      <main className="flex-1 max-w-[1060px] mx-auto px-4 md:px-6 py-12 w-full animate-fadeIn">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/collections')}
            className="w-9 h-9 rounded-full bg-white/50 border border-line flex items-center justify-center hover:bg-white transition-all shrink-0"
          >
            <ArrowLeft size={16} strokeWidth={2.5} className="text-ink" />
          </button>

          <div className="flex items-center gap-3">
            {collection && (
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: (collection.color || '#FFCA28') + '33' }}
              >
                <FolderOpen size={18} style={{ color: collection.color || '#FFCA28' }} />
              </div>
            )}
            <div>
              <h1 className={`text-2xl md:text-[2rem] font-bold leading-tight ${weather === 'thunderstorm' ? 'text-white' : 'text-ink'}`}>
                {collection?.name || 'Collection'}
              </h1>
              <p className={`text-xs ${weather === 'thunderstorm' ? 'text-white/70' : 'text-ink-faint'}`}>
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
              </p>
            </div>
          </div>
        </div>

        {/* Entries grid */}
        {entries.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center bg-white/20 backdrop-blur-3xl border border-white/30 rounded-3xl">
            <div className="w-14 h-14 rounded-full bg-white/50 flex items-center justify-center">
              <FolderOpen size={22} className="text-ink-faint" />
            </div>
            <p className={`font-bold text-lg ${weather === 'thunderstorm' ? 'text-white' : 'text-ink'}`}>No entries yet</p>
            <p className={`text-sm max-w-[240px] ${weather === 'thunderstorm' ? 'text-white/70' : 'text-ink-soft'}`}>
              Add entries to this collection from the dashboard or memories page.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.map((entry) => {
              const date = new Date(entry.entryDate);
              const thumbUrl = entry.driveImageUrl || entry.driveFileId ? getImageSrc(entry) : null;
              const textPreview = entry.text?.replace(/[@#]\w+/g, '').slice(0, 120) || '';

              return (
                <div
                  key={entry._id}
                  onClick={() => openModal(entry)}
                  className="group relative bg-card rounded-2xl p-4 pb-12 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden border border-line"
                >
                  {/* Date + mood */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[0.65rem] font-bold text-[#b8ad9e] uppercase tracking-wider">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {entry.mood && (
                      <span className="text-[0.65rem] px-2 py-1 bg-blush/20 text-blush-dark rounded-full font-medium capitalize">
                        {entry.mood}
                      </span>
                    )}
                  </div>

                  {/* Image thumbnail */}
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

                  {/* Text preview */}
                  <p className="text-ink text-sm leading-relaxed line-clamp-4">
                    {textPreview || <span className="italic text-ink-faint">Photo memory</span>}
                    {entry.text?.length > 120 && '...'}
                  </p>

                  {/* Bottom row */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="text-[0.6rem] text-ink-faint font-medium">{date.getFullYear()}</span>
                    <span className="text-xs text-blush font-bold group-hover:translate-x-0.5 transition-transform">View →</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Postcard modal */}
      {selectedEntries && (
        <div
          className="fixed inset-0 bg-ink/50 backdrop-blur-md z-[200] flex items-center justify-center p-4 md:p-8 animate-fadeIn"
          onClick={closeModal}
        >
          <div className="relative max-w-[960px] w-full" onClick={e => e.stopPropagation()}>
            {/* Close */}
            <button
              className="absolute -top-4 -right-4 md:-top-5 md:-right-5 z-[210] w-10 h-10 rounded-full bg-white border border-line-strong text-ink-soft flex items-center justify-center shadow-xl transition-all hover:bg-ink hover:text-cream hover:rotate-90"
              onClick={closeModal}
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            {/* Stacked ghost cards */}
            {selectedEntries.length > 2 && (
              <div className="absolute inset-x-12 top-16 h-[440px] bg-white/40 border-2 border-white/40 rounded-2xl scale-[0.94] blur-[1px] z-0 shadow-2xl -rotate-2" style={{ transformOrigin: 'bottom center' }} />
            )}
            {selectedEntries.length > 1 && (
              <div className="absolute inset-x-6 top-8 h-[440px] bg-white/60 border-2 border-white/60 rounded-2xl scale-[0.97] blur-[0.5px] z-[10] shadow-2xl rotate-1" style={{ transformOrigin: 'bottom center' }} />
            )}

            <div className="relative animate-[slideUpFade_0.4s_ease-out] z-[20] w-full shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
              <PostcardView entry={selectedEntries[currentIdx]} onDelete={handleDeleteEntry} />
            </div>

            {selectedEntries.length > 1 && (
              <>
                <div className="absolute top-1/2 -translate-y-1/2 -right-8 md:-right-20 flex flex-col gap-6 z-[300]">
                  <button
                    disabled={currentIdx === 0}
                    className={clsx("w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white shadow-2xl transition-all hover:bg-white/40 hover:scale-110 active:scale-90", currentIdx === 0 && "opacity-0 pointer-events-none")}
                    onClick={() => setCurrentIdx(i => i - 1)}
                  >
                    <ChevronUp size={28} strokeWidth={3} />
                  </button>
                  <button
                    disabled={currentIdx === selectedEntries.length - 1}
                    className={clsx("w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white shadow-2xl transition-all hover:bg-white/40 hover:scale-110 active:scale-90", currentIdx === selectedEntries.length - 1 && "opacity-0 pointer-events-none")}
                    onClick={() => setCurrentIdx(i => i + 1)}
                  >
                    <ChevronDown size={28} strokeWidth={3} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CollectionDetailPage() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <CollectionDetailContent />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
