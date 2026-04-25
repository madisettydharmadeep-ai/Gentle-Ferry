'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from '../../utils/AuthContext';
import { useWeather } from '../contexts/WeatherContext';
import Navbar from '../components/Navbar';
import AnimatedBackground from '../components/AnimatedBackground';
import PostcardView, { getImageSrc } from '../components/PostcardView';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown, 
  PenLine, 
  X, 
  Search, 
  MapPin, 
  Users, 
  Calendar, 
  Heart, 
  Coffee, 
  Download 
} from 'lucide-react';
import { clsx } from 'clsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

function MemoriesContent() {
  const { user, loading } = useAuth();
  const { weather } = useWeather();
  const router = useRouter();

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1);
  const [entries, setEntries] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [activeTab, setActiveTab] = useState('calendar'); // calendar, people, places
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [selectedEntries, setSelectedEntries] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [activeTagLabel, setActiveTagLabel] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [testMode, setTestMode] = useState(false);

  // Test images for demo mode
  const TEST_IMAGES = [
    'https://i.pinimg.com/1200x/d2/2b/d6/d22bd6b8c5e421a10ce1c42db963dd4f.jpg',
    'https://i.pinimg.com/736x/32/71/ac/3271acbaa3e559a2db9defcc837ccd15.jpg',
    'https://i.pinimg.com/736x/8a/cb/3e/8acb3ec4556dedac39b4fcc93dc05ce5.jpg',
    'https://i.pinimg.com/1200x/a8/75/47/a875473a387f05e79525572e491a9f5c.jpg',
    'https://i.pinimg.com/736x/22/1d/52/221d523799273c3da13cf323ea2eac5e.jpg',
    'https://i.pinimg.com/736x/b3/01/81/b30181af441276424ee3eb26cc2e68ae.jpg',
    'https://i.pinimg.com/736x/67/ff/06/67ff06521cad09e1104307a40facedc1.jpg',
    'https://i.pinimg.com/1200x/40/73/ef/4073ef51fd0da58d52aecb104525e920.jpg',
    'https://i.pinimg.com/736x/48/9d/3b/489d3bacc10661221b4dc17f5d2587e6.jpg',
    'https://i.pinimg.com/736x/ff/1d/99/ff1d99302690271b1d14153463ce99b2.jpg',
    'https://i.pinimg.com/736x/94/4a/08/944a08d2e3ce5d0a1e1ed4443037a5ab.jpg',
    'https://i.pinimg.com/736x/ae/b4/a9/aeb4a989fc905298c68f012a4f457770.jpg',
    'https://i.pinimg.com/736x/01/33/0d/01330dc9f5902a229d9185f7edaa83e3.jpg',
    'https://i.pinimg.com/736x/12/8d/2f/128d2fa856863dad162355bc25d7ee6c.jpg',
    'https://i.pinimg.com/1200x/9f/77/fc/9f77fc3c31439e4539cecee5e4a0effa.jpg',
    'https://i.pinimg.com/736x/fd/de/9f/fdde9f4d3b5bac35a8e93ccce097ddfa.jpg',
    'https://i.pinimg.com/1200x/46/53/77/465377b4b1031c49f2e9c1ed04d5a6a7.jpg',
    'https://i.pinimg.com/736x/35/90/f5/3590f5d61aa5def282eed00d41d17fa6.jpg',
  ];

  const TEST_TEXTS = [
    "Woke up to birds singing outside my window. Spring is truly here.",
    "Had coffee with Sarah at the new café downtown. The pastries were divine.",
    "Long walk by the river today. Found a spot under a willow tree to read.",
    "Rainy afternoon, perfect for journaling and hot chocolate.",
    "Visited the botanical gardens. The cherry blossoms are at their peak.",
    "Late night conversation with mom. Sometimes you just need family.",
    "Started that book I've been meaning to read. Chapter one hooked me already.",
    "Found a four-leaf clover on my morning walk. Today's going to be lucky.",
    "Sunset at the beach. Watched the sky turn pink and orange.",
    "Baked my grandmother's cookie recipe. The kitchen smells like childhood.",
    "First bike ride of the season. My legs are going to hate me tomorrow.",
    "Discovered a hidden bookstore with the coziest reading nook.",
    "Rainbow after the storm. Nature's way of saying everything's okay.",
    "Meditated for twenty minutes. Mental clarity feels like a superpower.",
    "Tried that new restaurant everyone's talking about. Worth the hype.",
    "Morning yoga on the balcony. The city looks different from up here.",
    "Wrote letters to old friends. Sometimes snail mail is sweeter.",
    "Cloud watching in the park. Found a rabbit, a dragon, and a heart.",
    "Finally organized my desk. Clear space, clear mind.",
    "Listened to old playlists from high school. The nostalgia hit hard.",
  ];

  const TEST_MOODS = ['happy', 'calm', 'grateful', 'excited', 'nostalgic', 'joyful', null, 'peaceful'];

  const generateTestData = useCallback(() => {
    const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
    const fakeEntries = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const hasText = Math.random() > 0.15; // 85% have text
      const numEntries = Math.random() > 0.85 ? 2 : 1; // 15% chance of 2 entries
      
      for (let e = 0; e < numEntries; e++) {
        // Cycle through all images, reuse if more days than images
        const imageIndex = (day - 1 + e) % TEST_IMAGES.length;
        fakeEntries.push({
          _id: `test-${day}-${e}`,
          entryDate: new Date(viewYear, viewMonth - 1, day).toISOString(),
          text: hasText ? TEST_TEXTS[Math.floor(Math.random() * TEST_TEXTS.length)] : '',
          driveImageUrl: TEST_IMAGES[imageIndex], // Always include an image
          mood: TEST_MOODS[Math.floor(Math.random() * TEST_MOODS.length)],
          highlights: [],
          isTestData: true,
        });
      }
    }
    
    return fakeEntries;
  }, [viewYear, viewMonth]);

  useEffect(() => {
    if (!loading && !user) router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (testMode) {
      setEntries(generateTestData());
    }
  }, [testMode, viewYear, viewMonth, generateTestData]);

  const fetchEntries = useCallback(async () => {
    if (testMode) return; // Skip API calls in test mode
    if (!user) return;
    setFetching(true);
    try {
      const searchParam = searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : '';
      const res = await fetch(`/api/entries?userId=${user.id}&year=${viewYear}&month=${viewMonth}${searchParam}`);
      const data = await res.json();
      if (data.success) setEntries(data.entries);
    } catch {}
    setFetching(false);
  }, [user, viewYear, viewMonth, searchQuery, testMode]);

  // Proper debounce for search
  useEffect(() => {
    if (!searchQuery) {
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(() => {
      setIsSearching(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Helper to load image and convert to base64 for PDF
  const loadImageForPDF = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL('image/jpeg', 0.85);
          resolve(dataURL);
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  };

  const downloadPDF = async () => {
    if (entries.length === 0) return;
    setGeneratingPDF(true);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      
      // Calculate mood stats
      const moodCounts = {};
      entries.forEach(e => {
        if (e.mood) {
          moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
        }
      });
      const sortedMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
      const totalMoodEntries = entries.filter(e => e.mood).length;
      
      // Novel-style Cover Page
      pdf.setFillColor(252, 248, 240); // warm cream background
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Decorative top border
      pdf.setDrawColor(200, 180, 160);
      pdf.setLineWidth(1);
      pdf.line(margin, 40, pageWidth - margin, 40);
      pdf.setLineWidth(0.5);
      pdf.line(margin, 42, pageWidth - margin, 42);
      
      // Main title - elegant large font
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(28);
      pdf.setTextColor(50, 45, 40);
      pdf.text(`${MONTHS[viewMonth - 1]}`, pageWidth / 2, 85, { align: 'center' });
      
      pdf.setFontSize(48);
      pdf.setTextColor(80, 70, 60);
      pdf.text(`${viewYear}`, pageWidth / 2, 115, { align: 'center' });
      
      // Subtitle
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(11);
      pdf.setTextColor(140, 130, 120);
      pdf.text('A Collection of Memories', pageWidth / 2, 130, { align: 'center' });
      
      // Stats section
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(100, 90, 80);
      const statsY = 155;
      pdf.text(`${entries.length} entries  ·  ${totalWords.toLocaleString()} words`, pageWidth / 2, statsY, { align: 'center' });
      
      // Mood distribution bar chart
      if (sortedMoods.length > 0) {
        const chartY = statsY + 15;
        const barWidth = (pageWidth - margin * 2) * 0.6;
        const barHeight = 8;
        const startX = (pageWidth - barWidth) / 2;
        
        pdf.setFontSize(9);
        pdf.setTextColor(140, 130, 120);
        pdf.text('Mood Distribution', pageWidth / 2, chartY - 5, { align: 'center' });
        
        let currentX = startX;
        const moodColors = {
          'joyful': [232, 131, 124],
          'happy': [232, 131, 124],
          'calm': [127, 182, 158],
          'peaceful': [127, 182, 158],
          'excited': [255, 193, 7],
          'nostalgic': [180, 160, 180],
          'grateful': [255, 183, 77],
          'low': [147, 191, 235],
          'sad': [147, 191, 235],
        };
        
        sortedMoods.forEach(([mood, count]) => {
          const width = (count / totalMoodEntries) * barWidth;
          const color = moodColors[mood] || [180, 180, 180];
          pdf.setFillColor(color[0], color[1], color[2]);
          pdf.rect(currentX, chartY, width, barHeight, 'F');
          currentX += width;
        });
        
        // Legend below chart
        let legendY = chartY + 15;
        pdf.setFontSize(8);
        let legendX = startX;
        sortedMoods.slice(0, 4).forEach(([mood, count]) => {
          const color = moodColors[mood] || [180, 180, 180];
          pdf.setFillColor(color[0], color[1], color[2]);
          pdf.rect(legendX, legendY, 4, 4, 'F');
          pdf.setTextColor(120, 110, 100);
          pdf.text(`${mood} (${Math.round((count/totalMoodEntries)*100)}%)`, legendX + 6, legendY + 3);
          legendX += 35;
        });
      }
      
      // Decorative bottom border
      pdf.setDrawColor(200, 180, 160);
      pdf.setLineWidth(0.5);
      pdf.line(margin, pageHeight - 55, pageWidth - margin, pageHeight - 55);
      pdf.setLineWidth(1);
      pdf.line(margin, pageHeight - 53, pageWidth - margin, pageHeight - 53);
      
      // Author name at bottom
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(11);
      pdf.setTextColor(120, 110, 100);
      pdf.text('Written by', pageWidth / 2, pageHeight - 35, { align: 'center' });
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(50, 45, 40);
      pdf.text(user?.name || 'Anonymous', pageWidth / 2, pageHeight - 25, { align: 'center' });
      
      // Page number for cover
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(180, 170, 160);
      pdf.text('Gentle Ferry', margin, pageHeight - 10);
      
      // Entries pages
      for (let i = 0; i < entries.length; i++) {
        pdf.addPage();
        pdf.setFillColor(253, 250, 245);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        
        const entry = entries[i];
        const date = new Date(entry.entryDate);
        const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        
        let yPos = margin;
        
        // Date header with decorative line
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.setTextColor(200, 180, 160);
        pdf.text(dateStr.toUpperCase(), margin, yPos);
        yPos += 8;
        
        // Mood indicator if exists
        if (entry.mood) {
          pdf.setFontSize(10);
          pdf.setTextColor(180, 100, 120);
          pdf.text(`Feeling: ${entry.mood}`, margin, yPos);
          yPos += 8;
        }
        
        // Divider
        pdf.setDrawColor(220, 210, 200);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 10;
        
        // Try to add image if exists
        let imageAdded = false;
        if (entry.driveImageUrl) {
          const imageData = await loadImageForPDF(entry.driveImageUrl);
          if (imageData) {
            const imgWidth = pageWidth - (margin * 2);
            const imgHeight = imgWidth * 0.6; // 3:2 aspect ratio
            
            // Check if image fits with remaining text
            if (yPos + imgHeight + 20 < pageHeight - margin - 20) {
              pdf.addImage(imageData, 'JPEG', margin, yPos, imgWidth, imgHeight);
              yPos += imgHeight + 8;
              imageAdded = true;
            }
          }
        }
        
        // Entry text
        if (entry.text) {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(11);
          pdf.setTextColor(50, 45, 40);
          
          const availableHeight = pageHeight - margin - yPos - 15;
          const maxLines = Math.min(Math.floor(availableHeight / 6), 35);
          
          const textLines = pdf.splitTextToSize(entry.text.replace(/[@#]\w+/g, ''), pageWidth - (margin * 2));
          const linesToShow = Math.min(textLines.length, maxLines);
          
          for (let j = 0; j < linesToShow; j++) {
            pdf.text(textLines[j], margin, yPos);
            yPos += 6;
          }
          
          // If text continues, add indicator
          if (textLines.length > maxLines) {
            yPos += 4;
            pdf.setFont('helvetica', 'italic');
            pdf.setFontSize(9);
            pdf.setTextColor(160, 150, 140);
            pdf.text('... continues in app', margin, yPos);
          }
        }
        
        // Photo fallback - show URL if image couldn't be added
        if (entry.driveImageUrl && !imageAdded) {
          yPos += 8;
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(9);
          pdf.setTextColor(100, 100, 100);
          pdf.text('📷 Image:', margin, yPos);
          yPos += 5;
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(8);
          pdf.setTextColor(140, 140, 140);
          const urlLines = pdf.splitTextToSize(entry.driveImageUrl, pageWidth - (margin * 2));
          pdf.text(urlLines.slice(0, 3), margin, yPos); // Show first 3 lines of URL
        }
        
        // Page number
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(200, 190, 180);
        pdf.text(`${i + 1} / ${entries.length}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
      }
      
      // Generate personalized filename
      const userName = user?.name?.split(' ')[0] || 'Journal';
      const safeName = userName.replace(/[^a-zA-Z0-9]/g, '');
      pdf.save(`${safeName}s-Journal-${MONTHS[viewMonth - 1]}-${viewYear}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF. Please try again.');
    }
    
    setGeneratingPDF(false);
  };

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  // When test mode is turned off, refetch real data
  useEffect(() => {
    if (!testMode && user) {
      fetchEntries();
    }
  }, [testMode, user]);

  const firstDay = new Date(viewYear, viewMonth - 1, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();

  const entryMap = {};
  entries.forEach((e) => {
    const d = new Date(e.entryDate).getDate();
    if (!entryMap[d]) entryMap[d] = [];
    entryMap[d].push(e);
  });

  const prevMonth = () => {
    if (viewMonth === 1) { setViewYear(y => y - 1); setViewMonth(12); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 12) { setViewYear(y => y + 1); setViewMonth(1); }
    else setViewMonth(m => m + 1);
  };

  const isToday = (d) =>
    d === today.getDate() && viewMonth === today.getMonth() + 1 && viewYear === today.getFullYear();
  const isFuture = viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth() + 1);

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const totalWords = entries.reduce((acc, e) =>
    acc + (e.text?.split(/\s+/).filter(Boolean).length || 0), 0);

  // Extract People and Places dynamically
  const allPeopleMap = new Map();
  const allPlacesMap = new Map();

  entries.forEach(e => {
    if (!e.text) return;
    const people = Array.from(new Set(e.text.match(/@\w+/g) || []));
    const places = Array.from(new Set(e.text.match(/#\w+/g) || []));
    
    people.forEach(p => {
      if (!allPeopleMap.has(p)) allPeopleMap.set(p, []);
      allPeopleMap.get(p).push(e);
    });
    
    places.forEach(p => {
      if (!allPlacesMap.has(p)) allPlacesMap.set(p, []);
      allPlacesMap.get(p).push(e);
    });
  });

  const peopleList = Array.from(allPeopleMap.entries());
  const placesList = Array.from(allPlacesMap.entries());

  // Open modal
  const openEntries = (entryList, label = null) => {
    setSelectedEntries(entryList);
    setActiveTagLabel(label);
    setCurrentIdx(0);
  };

  const closeModal = () => {
    setSelectedEntries(null);
    setActiveTagLabel(null);
    setCurrentIdx(0);
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      const res = await fetch(`/api/entries?id=${entryId}&userId=${user.id}`, { method: 'DELETE' });
      if (res.ok) {
        setEntries(prev => prev.filter(e => e._id !== entryId));
        closeModal();
      }
    } catch {}
  };

  if (loading || !user) return (
    <div className="flex items-center justify-center min-h-screen bg-cream">
      <div className="w-2.5 h-2.5 rounded-full bg-blush animate-pulse" />
    </div>
  );

  return (
    <div className="min-h-screen bg-cream flex flex-col relative overflow-x-hidden">
      <AnimatedBackground weather={weather} showClouds={true} />
      <Navbar />
      {/* Removed animate-fadeIn from main so child background blurs work perfectly */}
      <main className="flex-1 max-w-[1060px] mx-auto px-2 md:px-6 py-12 md:pb-20 w-full">
        
        {/* Controls row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 relative z-10">

          {/* Month navigator + tooltip */}
          <div className="flex items-center gap-2 justify-center w-full md:w-auto">
            <button
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-ink transition-all hover:bg-white/60 hover:scale-110 active:scale-95 shadow-md"
              onClick={prevMonth}
              aria-label="Previous month"
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>

            {/* Month pill with tooltip */}
            <div className="relative group">
              <span className="text-lg font-bold text-ink flex items-baseline gap-1.5 bg-white/40 px-5 py-2 rounded-2xl backdrop-blur-md shadow-sm border border-white/30 cursor-default select-none">
                {MONTHS[viewMonth - 1]} <span className="text-sm text-ink-soft font-medium">{viewYear}</span>
              </span>
              {/* Tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
                <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl px-4 py-3 flex items-center gap-4 whitespace-nowrap">
                  <div className="text-center">
                    <p className="text-base font-bold text-ink leading-none">{entries.length}</p>
                    <p className="text-[0.6rem] text-ink-faint uppercase tracking-wider font-bold mt-0.5">entries</p>
                  </div>
                  <div className="w-px h-6 bg-line/50" />
                  <div className="text-center">
                    <p className="text-base font-bold text-ink leading-none">{entries.filter(e => e.driveImageUrl).length}</p>
                    <p className="text-[0.6rem] text-ink-faint uppercase tracking-wider font-bold mt-0.5">photos</p>
                  </div>
                  <div className="w-px h-6 bg-line/50" />
                  <div className="text-center">
                    <p className="text-base font-bold text-ink leading-none">{totalWords.toLocaleString()}</p>
                    <p className="text-[0.6rem] text-ink-faint uppercase tracking-wider font-bold mt-0.5">words</p>
                  </div>
                </div>
                {/* Arrow */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/80 border-t border-l border-white/40 rotate-45" />
              </div>
            </div>

            <button
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-ink transition-all hover:bg-white/60 hover:scale-110 active:scale-95 shadow-md disabled:opacity-30 disabled:cursor-not-allowed"
              onClick={nextMonth}
              disabled={isFuture}
              aria-label="Next month"
            >
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
            
            {/* Test Mode Toggle - only in testing environment */}
            {process.env.NEXT_PUBLIC_APP_MODE === 'testing' && (
              <button
                onClick={() => setTestMode(!testMode)}
                className={clsx(
                  "ml-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all",
                  testMode
                    ? "bg-honey text-white shadow-md"
                    : "bg-white/20 backdrop-blur-md border border-white/30 text-ink hover:bg-white/40"
                )}
                title={testMode ? "Exit test mode" : "Enable test mode with fake data"}
              >
                {testMode ? 'Test Mode: ON' : 'Test Mode'}
              </button>
            )}
          </div>

          {/* Search + Actions */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Search input */}
            <div className="relative flex-1 md:w-[220px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                type="text"
                placeholder="Search memories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm rounded-xl bg-white/20 backdrop-blur-md border border-white/30 placeholder:text-ink-faint text-ink focus:outline-none focus:bg-white/40 focus:border-blush/50 transition-all"
              />
              {isSearching ? (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-3.5 h-3.5 border-2 border-blush/30 border-t-blush rounded-full animate-spin" />
                </div>
              ) : searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            
            {/* PDF Download button - hidden during search */}
            {!searchQuery && (
              <button
                onClick={downloadPDF}
                disabled={generatingPDF || entries.length === 0}
                className={clsx(
                  "flex items-center justify-center w-10 h-10 rounded-xl transition-all shadow-md",
                  generatingPDF
                    ? "bg-white/40 cursor-wait"
                    : "bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/50 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                )}
                title="Download as PDF"
              >
                {generatingPDF ? (
                  <div className="w-4 h-4 border-2 border-ink-faint/30 border-t-ink-faint rounded-full animate-spin" />
                ) : (
                  <Download size={16} strokeWidth={2} className="text-ink" />
                )}
              </button>
            )}
          </div>

        </div>
        
        {/* Tabs row */}
        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-3xl border border-white/30 p-1 rounded-xl shadow-xl w-full md:w-auto mb-6">
          <button
            onClick={() => setActiveTab('calendar')}
            className={clsx("flex-1 md:flex-auto px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2", activeTab === 'calendar' ? "bg-white shadow-md text-ink" : "text-ink hover:bg-white/40")}
          >
            <Calendar size={15} strokeWidth={2.5} /> Calendar
          </button>
          <button
            onClick={() => { setSearchQuery(''); setActiveTab('people'); }}
            className={clsx("flex-1 md:flex-auto px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2", activeTab === 'people' ? "bg-white shadow-md text-[#2563eb]" : "text-ink hover:bg-white/40")}
          >
            <Users size={15} strokeWidth={2.5} /> People
          </button>
          <button
            onClick={() => { setSearchQuery(''); setActiveTab('places'); }}
            className={clsx("flex-1 md:flex-auto px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2", activeTab === 'places' ? "bg-white shadow-md text-[#059669]" : "text-ink hover:bg-white/40")}
          >
            <MapPin size={15} strokeWidth={2.5} /> Places
          </button>
        </div>

        {/* ── Search Results View ── */}
        {searchQuery.trim() && activeTab === 'calendar' && (
          <div className="mb-6">
            {/* Search header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-ink font-bold text-lg">
                {isSearching ? 'Searching...' : `${entries.length} result${entries.length !== 1 ? 's' : ''} for "${searchQuery}"`}
              </h3>
              <button
                onClick={() => setSearchQuery('')}
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
                  const textPreview = entry.text?.replace(/[@#]\w+/g, '').slice(0, 120) || '';
                  
                  return (
                    <div
                      key={entry._id || idx}
                      onClick={() => openEntries([entry])}
                      className="group relative bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl p-4 pb-12 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden"
                    >
                      {/* Header with date */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[0.65rem] font-bold text-[#b8ad9e] uppercase tracking-wider">
                          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        {entry.mood && (
                          <span className="text-[0.65rem] px-2 py-1 bg-blush/20 text-blush-dark rounded-full font-medium">
                            {entry.mood}
                          </span>
                        )}
                      </div>
                      
                      {/* Image preview */}
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
                      
                      {/* Bottom action - absolute positioned */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <span className="text-[0.6rem] text-ink-faint font-medium">
                          {date.getFullYear()}
                        </span>
                        <span className="text-xs text-blush font-bold group-hover:translate-x-0.5 transition-transform">
                          View →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* No results */}
            {!isSearching && entries.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-12 text-center bg-white/20 backdrop-blur-3xl border border-white/30 rounded-3xl">
                <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center">
                  <Search size={20} className="text-ink-faint" />
                </div>
                <p className="text-ink-soft text-sm">No memories found matching "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-sm text-blush font-bold hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── View: Calendar ── */}
        {activeTab === 'calendar' && !searchQuery.trim() && entries.length > 0 && !fetching && (() => {
          // Split flat cells array into weeks (chunks of 7)
          const weeks = [];
          for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

          // Shared day cell renderer
          const DayCell = ({ day, mobile }) => {
            if (!day) return (
              <div className={clsx(
                "aspect-square border border-dashed border-[#ddd5c8]",
                mobile ? "rounded-md" : "rounded-xl border-2"
              )} />
            );
            const dayEntries = entryMap[day] || [];
            const hasEntry = dayEntries.length > 0;
            const thumbEntry = dayEntries.find(e => e.driveFileId || e.driveImageUrl || e.imageBase64);
            const thumbUrl = thumbEntry ? getImageSrc(thumbEntry) : null;
            return (
              <div
                className={clsx(
                  "aspect-square relative overflow-hidden transition-all select-none",
                  mobile ? "rounded-md" : "rounded-xl",
                  hasEntry && thumbUrl
                    ? clsx("cursor-pointer hover:scale-[1.03]",
                        mobile
                          ? "border border-[#2a2a2a]/80 shadow-[1px_1px_0px_rgba(0,0,0,0.15)]"
                          : "border-2 border-[#2a2a2a]/80 shadow-[3px_3px_0px_rgba(0,0,0,0.18)]")
                    : hasEntry
                      ? clsx("cursor-pointer border-dashed border-blush/50 bg-blush/5 hover:bg-blush/10",
                          mobile ? "border" : "border-2")
                      : clsx("border-dashed border-[#ddd5c8]", mobile ? "border" : "border-2"),
                  isToday(day) && !hasEntry && "!border-blush !border-solid bg-blush/5",
                )}
                onClick={() => hasEntry && openEntries(dayEntries)}
              >
                {hasEntry && thumbUrl && (
                  <img src={thumbUrl} alt="" className="absolute inset-0 w-full h-full object-cover z-0" referrerPolicy="no-referrer" />
                )}
                {hasEntry && thumbUrl && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent z-10" />
                )}
                {hasEntry && thumbUrl ? (
                  <span className={clsx(
                    "absolute bottom-1 left-1 z-20 font-black leading-none drop-shadow-lg",
                    mobile ? "text-[0.55rem]" : "text-lg",
                    isToday(day) ? "text-honey" : "text-white"
                  )}>{day}</span>
                ) : (
                  <span className={clsx(
                    "absolute font-bold leading-none",
                    hasEntry
                      ? "top-1.5 left-2 text-[0.6rem] text-ink-faint"
                      : "inset-0 flex items-center justify-center",
                    !hasEntry && (mobile ? "text-xs" : "text-xl"),
                    !hasEntry && (isToday(day) ? "text-blush" : "text-[#c8bfb3]"),
                    hasEntry && isToday(day) && "text-blush",
                  )}>{day}</span>
                )}
                {hasEntry && !thumbUrl && (() => {
                  const mood = dayEntries[0]?.mood?.toLowerCase();
                  const dot = mood === 'happy' ? '#fbbf24' : mood === 'sad' ? '#60a5fa' : mood === 'angry' ? '#f87171' : mood === 'anxious' ? '#fb923c' : mood === 'calm' ? '#34d399' : mood === 'excited' ? '#f472b6' : mood === 'tired' ? '#94a3b8' : mood === 'grateful' ? '#4ade80' : mood === 'nostalgic' ? '#f59e0b' : mood === 'lonely' ? '#818cf8' : '#e879f9';
                  return (
                    <>
                      {/* paper bg */}
                      <div className="absolute inset-0 bg-[#fdf8f2] z-0" />
                      {/* ruled lines */}
                      <div className="absolute inset-0 z-[1] flex flex-col justify-center px-[18%] gap-[14%]">
                        {[0,1,2].map(i => (
                          <div key={i} className="h-px rounded-full bg-[#d6cfc6]" style={{ width: i === 2 ? '60%' : '100%' }} />
                        ))}
                      </div>
                      {/* mood dot bottom-right */}
                      <div className="absolute bottom-1.5 right-1.5 z-[2] w-2 h-2 rounded-full" style={{ backgroundColor: dot }} />
                    </>
                  );
                })()}
                {hasEntry && thumbUrl && (dayEntries.length > 1 || dayEntries[0]?.mood) && (
                  <div className="absolute bottom-1 right-1 z-20">
                    {dayEntries.length > 1 ? (
                      <span className={clsx("rounded-full bg-blush border border-white text-white font-black flex items-center justify-center shadow-md", mobile ? "w-3.5 h-3.5 text-[0.4rem]" : "w-6 h-6 text-[0.5rem] border-2")}>
                        +{dayEntries.length - 1}
                      </span>
                    ) : (
                      <span className={clsx("rounded-full bg-white/90 border border-white font-black text-ink flex items-center justify-center shadow-md capitalize", mobile ? "w-3.5 h-3.5 text-[0.4rem]" : "w-6 h-6 text-[0.5rem] border-2")}>
                        {dayEntries[0].mood[0]}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          };

          return (
            <div className="bg-[#f7f3ed]/70 backdrop-blur-3xl border border-[#e8e0d5] overflow-hidden shadow-xl rounded-2xl w-full">

              {/* ── MOBILE: transposed — weekdays as row labels, weeks as columns ── */}
              <div className="md:hidden p-2">
                {WEEKDAYS.map((w, wdIdx) => (
                  <div key={w} className="flex items-center gap-1.5 mb-1.5">
                    {/* Weekday label */}
                    <div className="w-6 shrink-0 text-[0.5rem] font-bold text-[#b8ad9e] uppercase text-center">
                      {w.slice(0, 2)}
                    </div>
                    {/* Cells for this weekday across all weeks */}
                    {weeks.map((week, wkIdx) => (
                      <div key={wkIdx} className="flex-1">
                        <DayCell day={week[wdIdx]} mobile={true} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* ── DESKTOP: normal 7-column layout ── */}
              <div className="hidden md:block">
                <div className="grid grid-cols-7 border-b border-[#e0d8ce]">
                  {WEEKDAYS.map(w => (
                    <div key={w} className="py-3 text-center text-[0.65rem] font-bold text-[#b8ad9e] uppercase tracking-[0.2em]">
                      {w}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2.5 p-3">
                  {cells.map((day, idx) => <DayCell key={day ?? `b${idx}`} day={day} mobile={false} />)}
                </div>
              </div>

            </div>
          );
        })()}

        {/* Generic Empty state for Calendar ONLY */}
        {activeTab === 'calendar' && entries.length === 0 && !fetching && !searchQuery.trim() && (
          <div className="flex flex-col items-center gap-2 py-16 px-6 text-center w-full mt-10 bg-white/20 backdrop-blur-3xl border border-white/30 shadow-xl rounded-[2.5rem] relative z-10">
            <div className="w-14 h-14 rounded-full bg-white/50 shadow-sm flex items-center justify-center mb-2">
              <PenLine size={24} strokeWidth={1.5} className="text-ink-soft" />
            </div>
            <h3 className="text-ink text-lg font-bold">No entries for {MONTHS[viewMonth - 1]} {viewYear}</h3>
            <p className="text-ink-soft text-sm mb-3">A blank canvas awaits. Capture a quiet thought or a sudden feeling.</p>
            <button className="px-6 py-2.5 rounded-full bg-ink text-white shadow-md text-sm font-bold transition-all hover:bg-blush hover:-translate-y-0.5 active:scale-95" onClick={() => router.push('/dashboard')}>
              Write today
            </button>
            <a
              href="https://buymeacoffee.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-ink-faint hover:text-[#8B6914] transition-colors"
            >
              <Coffee className="w-3 h-3" /> built with love — buy me a coffee?
            </a>
          </div>
        )}

        {/* ── View: People ── */}
        {activeTab === 'people' && peopleList.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 px-6 text-center w-full mt-10 bg-white/20 backdrop-blur-3xl border border-white/30 shadow-xl rounded-[2.5rem] relative z-10">
            <div className="w-14 h-14 rounded-full bg-white/50 shadow-sm flex items-center justify-center mb-2">
              <Users size={24} strokeWidth={1.5} className="text-blue-500" />
            </div>
            <h3 className="text-ink text-lg font-bold">No people tagged yet</h3>
            <p className="text-ink-soft text-sm mb-3">Include friends in your journal by typing <strong className="text-blue-500">@name</strong> inside your entries.</p>
          </div>
        )}

        {activeTab === 'people' && peopleList.length > 0 && (
          <div className="grid grid-cols-2 md:flex md:flex-wrap gap-4">
            {peopleList.map(([person, pEntries]) => (
              <button 
                key={person} 
                onClick={() => openEntries(pEntries, person)} 
                className="group flex items-center gap-2 px-3 md:px-5 py-2 bg-white/20 backdrop-blur-3xl border border-white/30 hover:bg-white/40 transition-all rounded-lg shadow-lg hover:shadow-2xl active:scale-95 relative z-10"
              >
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-md bg-blue-100/60 shadow-sm flex items-center justify-center text-blue-600 font-bold text-xs md:text-sm shrink-0">
                  {person.substring(1, 2).toUpperCase()}
                </div>
                <span className="font-bold text-ink text-sm md:text-base truncate">{person}</span>
                <span className="px-2 py-0.5 bg-blue-500 text-white text-[0.6rem] font-bold rounded-md ml-auto md:ml-1 min-w-[20px] shadow-sm">
                  {pEntries.length}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* ── View: Places ── */}
        {activeTab === 'places' && placesList.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 px-6 text-center w-full mt-10 bg-white/20 backdrop-blur-3xl border border-white/30 shadow-xl rounded-[2.5rem] relative z-10">
            <div className="w-14 h-14 rounded-full bg-white/50 shadow-sm flex items-center justify-center mb-2">
              <MapPin size={24} strokeWidth={1.5} className="text-emerald-600" />
            </div>
            <h3 className="text-ink text-lg font-bold">No places tagged yet</h3>
            <p className="text-ink-soft text-sm mb-3">Record the places you visit by typing <strong className="text-emerald-600">#place</strong> inside your entries.</p>
          </div>
        )}

        {activeTab === 'places' && placesList.length > 0 && (
          <div className="grid grid-cols-2 md:flex md:flex-wrap gap-4">
            {placesList.map(([place, pEntries]) => (
              <button 
                key={place} 
                onClick={() => openEntries(pEntries, place)} 
                className="group flex items-center gap-2 px-3 md:px-5 py-2 bg-white/20 backdrop-blur-3xl border border-white/30 hover:bg-white/40 transition-all rounded-lg shadow-lg hover:shadow-2xl active:scale-95 relative z-10"
              >
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-md bg-emerald-100/60 shadow-sm flex items-center justify-center text-emerald-600 font-bold text-xs md:text-sm shrink-0">
                  #
                </div>
                <span className="font-bold text-ink text-sm md:text-base truncate">{place}</span>
                <div className="px-2 py-0.5 bg-emerald-600 text-white text-[0.6rem] font-bold rounded-md ml-auto md:ml-1 min-w-[20px] shadow-sm">
                  {pEntries.length}
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* ── Postcard modal with left/right navigation ── */}
      {selectedEntries && (
        <div className="fixed inset-0 bg-ink/50 backdrop-blur-md z-[200] flex items-center justify-center p-4 md:p-8 animate-fadeIn" onClick={closeModal}>
          <div className="relative max-w-[960px] w-full" onClick={e => e.stopPropagation()}>

            {/* Modal Info Header if viewing a group */}
            {activeTagLabel && (
               <div className="absolute -top-12 left-0 right-0 flex justify-center text-white font-bold drop-shadow-md text-lg items-center gap-2">
                 <span>{activeTab === 'people' ? 'Viewing memories with' : 'Viewing memories at'}</span>
                 <span className={clsx("px-3 py-1 bg-white/20 rounded-full", activeTab === 'people' ? "text-blue-100" : "text-emerald-100")}>
                    {activeTagLabel}
                 </span>
                 <span className="text-sm font-normal opacity-80 ml-2">({currentIdx + 1} of {selectedEntries.length})</span>
               </div>
            )}

            {/* Close button */}
            <button
               className="absolute -top-4 -right-4 md:-top-5 md:-right-5 z-[210] w-10 h-10 rounded-full bg-white border border-line-strong text-ink-soft flex items-center justify-center shadow-xl transition-all hover:bg-ink hover:text-cream hover:border-ink hover:rotate-90 pointer-events-auto"
               onClick={closeModal}
             >
               <X size={18} strokeWidth={2.5} />
             </button>
 
            {/* ── Stacked Postcard System ── */}
            <div className="relative w-full flex flex-col items-center">
              {/* Ghost cards behind (Dramatically shifted & tilted for 'Naked Eye' visibility) */}
              {selectedEntries.length > 2 && (
                 <div 
                   className="absolute inset-x-12 top-16 h-[440px] bg-white/40 border-2 border-white/40 rounded-2xl scale-[0.94] blur-[1px] z-0 shadow-2xl -rotate-2" 
                   style={{ transformOrigin: 'bottom center' }}
                 />
              )}
              {selectedEntries.length > 1 && (
                 <div 
                   className="absolute inset-x-6 top-8 h-[440px] bg-white/60 border-2 border-white/60 rounded-2xl scale-[0.97] blur-[0.5px] z-[10] shadow-2xl rotate-1" 
                   style={{ transformOrigin: 'bottom center' }}
                 />
              )}
 
              {/* Front Postcard */}
              <div className="relative animate-[slideUpFade_0.4s_ease-out] z-[20] w-full shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
                <PostcardView 
                  entry={selectedEntries[currentIdx]} 
                  onDelete={handleDeleteEntry}
                />
              </div>
 
              {/* Vertical Up/Down Controls — only if multiple */}
              {selectedEntries.length > 1 && (
                <>
                  <div className="absolute top-1/2 -translate-y-1/2 -right-8 md:-right-20 flex flex-col gap-6 z-[300]">
                    <button
                      disabled={currentIdx === 0}
                      className={clsx(
                        "w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white shadow-2xl transition-all hover:bg-white/40 hover:scale-110 active:scale-90",
                        currentIdx === 0 && "opacity-0 pointer-events-none"
                      )}
                      onClick={() => setCurrentIdx(i => i - 1)}
                    >
                      <ChevronUp size={28} strokeWidth={3} />
                    </button>
 
                    <button
                      disabled={currentIdx === selectedEntries.length - 1}
                      className={clsx(
                        "w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white shadow-2xl transition-all hover:bg-white/40 hover:scale-110 active:scale-90",
                        currentIdx === selectedEntries.length - 1 && "opacity-0 pointer-events-none"
                      )}
                      onClick={() => setCurrentIdx(i => i + 1)}
                    >
                      <ChevronDown size={28} strokeWidth={3} />
                    </button>
                  </div>
 
                  {/* Vertical page indicators (The 'Spine') */}
                  <div className="absolute top-1/2 -translate-y-1/2 -left-8 md:-left-20 flex flex-col gap-2 z-[300]">
                    {selectedEntries.map((_, i) => (
                      <button
                        key={i}
                        className={clsx(
                          "w-2 h-8 rounded-full transition-all duration-300 border border-white/10",
                          i === currentIdx ? "bg-white h-12 shadow-[0_0_15px_rgba(255,255,255,1)]" : "bg-white/20 hover:bg-white/40"
                        )}
                        onClick={() => setCurrentIdx(i)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MemoriesPage() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <MemoriesContent />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}