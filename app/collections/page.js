'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from '../../utils/AuthContext';
import Navbar from '../components/Navbar';
import AnimatedBackground from '../components/AnimatedBackground';
import { useWeather } from '../contexts/WeatherContext';
import { Plus, X, Check } from 'lucide-react';

function FolderIcon({ color = '#FFCA28', className = '' }) {
  // Derive a darker shade for the back/tab by darkening the color
  const back = color + 'bb';
  return (
    <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Back body (darker, visible behind tab) */}
      <rect x="4" y="22" width="92" height="54" rx="9" fill={back} />
      {/* Tab */}
      <path d="M4 22 Q4 16 10 16 L34 16 Q39 16 41 21 L44 27 L4 27 Z" fill={back} />
      {/* Front body */}
      <rect x="4" y="27" width="92" height="49" rx="9" fill={color} />
      {/* Subtle top shine */}
      <rect x="4" y="27" width="92" height="14" rx="9" fill="white" fillOpacity="0.15" />
    </svg>
  );
}

const PRESET_COLORS = [
  '#E8B4B8', // blush
  '#B8D4E3', // powder blue
  '#C8E6C9', // mint
  '#FFF9C4', // pale yellow
  '#D1C4E9', // lavender
  '#FFCCBC', // peach
  '#B2DFDB', // aqua
  '#F8BBD0', // pink
];

function CollectionsContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { weather } = useWeather();
  const [collections, setCollections] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }
    if (user) {
      fetchCollections();
    }
  }, [user, loading, router]);

  const fetchCollections = async () => {
    try {
      const res = await fetch(`/api/collections?userId=${user.id}`);
      const data = await res.json();
      if (data.success) {
        setCollections(data.collections);
      }
    } catch (error) {
      console.error('Failed to fetch collections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: newCollectionName.trim(),
          color: selectedColor,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCollections([data.collection, ...collections]);
        setNewCollectionName('');
        setIsCreating(false);
        setSelectedColor(PRESET_COLORS[0]);
      }
    } catch (error) {
      console.error('Failed to create collection:', error);
    }
  };

  const deleteCollection = async (collectionId) => {
    if (!confirm('Delete this collection? Entries will remain but be ungrouped.')) return;
    
    try {
      const res = await fetch(`/api/collections?id=${collectionId}&userId=${user.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setCollections(collections.filter(c => c._id !== collectionId));
      }
    } catch (error) {
      console.error('Failed to delete collection:', error);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-2xl md:text-[2.2rem] font-bold mb-1.5 ${weather === 'thunderstorm' ? 'text-white' : 'text-ink'}`}>
              Collections
            </h1>
            <p className={`text-sm ${weather === 'thunderstorm' ? 'text-white/90' : 'text-ink-soft'}`}>
              Organize your memories into meaningful groups
            </p>
          </div>
          
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 px-3 py-2 sm:px-4 bg-ink text-white rounded-full font-medium text-xs sm:text-sm hover:bg-ink/90 transition-all shadow-sm shrink-0"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">New Collection</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>

        {/* Create Collection Form */}
        {isCreating && (
          <div className="mb-8 p-5 bg-card rounded-2xl border border-line shadow-sm">
            <form onSubmit={createCollection} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Collection name</label>
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="e.g., Summer 2024, Travel Memories..."
                  className="w-full px-3 py-2 bg-white border border-line rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blush"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Color</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full transition-all ${
                        selectedColor === color 
                          ? 'ring-2 ring-ink ring-offset-2' 
                          : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={!newCollectionName.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-ink text-white rounded-lg font-medium text-sm hover:bg-ink/90 transition-all disabled:opacity-50"
                >
                  <Check size={14} />
                  <span>Create</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setNewCollectionName('');
                    setSelectedColor(PRESET_COLORS[0]);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-muted text-ink rounded-lg font-medium text-sm hover:bg-line transition-all"
                >
                  <X size={14} />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Collections Grid */}
        {collections.length === 0 ? (
          <div className="text-center py-16">
            <FolderIcon className="w-20 h-20 mx-auto mb-4 opacity-60" />
            <h3 className={`text-lg font-medium mb-1 ${weather === 'thunderstorm' ? 'text-white' : 'text-ink'}`}>No collections yet</h3>
            <p className={`text-sm max-w-[280px] mx-auto ${weather === 'thunderstorm' ? 'text-white/90' : 'text-ink-soft'}`}>
              Create collections to organize your journal entries by theme, time, or anything you like.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {collections.map((collection) => (
              <div
                key={collection._id}
                className="group flex flex-col items-center gap-2 cursor-pointer select-none"
                onClick={() => router.push(`/collections/${collection._id}`)}
              >
                {/* Folder icon — square */}
                <div className="relative w-full aspect-square">
                  <FolderIcon color={collection.color} className="w-full h-full drop-shadow-md group-hover:drop-shadow-xl transition-all group-hover:scale-[1.04] group-active:scale-[0.97]" />
                  {/* Entry count badge — bottom right corner */}
                  {(collection.entryCount || 0) > 0 && (
                    <span className="absolute bottom-2 right-2 min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold bg-ink/70 text-white shadow-sm flex items-center justify-center">
                      {collection.entryCount}
                    </span>
                  )}
                  {/* Delete button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteCollection(collection._id); }}
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full bg-white border border-line shadow-md flex items-center justify-center text-ink-faint hover:text-red-500 transition-all"
                  >
                    <X size={12} />
                  </button>
                </div>
                {/* Label */}
                <p className={`text-sm font-semibold truncate max-w-[120px] text-center ${weather === 'thunderstorm' ? 'text-white' : 'text-ink'}`}>{collection.name}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <CollectionsContent />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
