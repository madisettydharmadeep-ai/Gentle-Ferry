'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Send, Trash2, Edit2, Plus, X } from 'lucide-react';

export default function BroadcastDashboard({ isDarkMode, theme }) {
  const [broadcasts, setBroadcasts] = useState([]);
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const fetchBroadcasts = async () => {
    try {
      const res = await fetch('/api/broadcasts?admin=true');
      const data = await res.json();
      if (data.success) setBroadcasts(data.data);
    } catch (err) {
      console.error('Failed to fetch broadcasts', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!date || !message) return;
    setLoading(true);

    try {
      const res = await fetch('/api/broadcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, message, imageUrl: imageUrl.trim() || undefined, id: editingId }),
      });
      const data = await res.json();
      if (data.success) {
        setDate('');
        setMessage('');
        setImageUrl('');
        setEditingId(null);
        fetchBroadcasts();
      }
    } catch (err) {
      console.error('Failed to save broadcast', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this broadcast?')) return;
    try {
      const res = await fetch(`/api/broadcasts?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchBroadcasts();
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const startEdit = (b) => {
    setEditingId(b._id);
    setDate(b.date);
    setMessage(b.message);
    setImageUrl(b.imageUrl || '');
  };

  return (
    <div className="flex flex-col gap-6 h-full overflow-hidden">
      {/* Create/Edit Form */}
      <form onSubmit={handleSave} className={`${theme.modalInputBg} border-[3px] ${theme.taskCardBorder} p-4 rounded-xl shadow-[4px_4px_0_#00000040] space-y-4`}>
        <div className="flex items-center justify-between">
          <h3 className={`font-serif font-black uppercase text-lg ${isDarkMode ? 'text-[#fdf8ea]' : 'text-[#2c2a25]'}`}>
            {editingId ? 'Edit Broadcast' : 'New Broadcast'}
          </h3>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setDate(''); setMessage(''); setImageUrl(''); }} className="text-xs underline opacity-50">Cancel</button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black opacity-40 ml-1">Schedule Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border-[2.5px] ${theme.taskCardBorder} ${theme.modalInputBg}`} 
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black opacity-40 ml-1">Message Preview</label>
            <div className="text-[10px] italic opacity-60 ml-1 truncate">"{message || 'Type something cozy...'}"</div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase font-black opacity-40 ml-1">Ferry News Content</label>
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What's happening in the ferry today?"
            className={`w-full h-24 px-3 py-2 rounded-lg border-[2.5px] ${theme.taskCardBorder} ${theme.modalInputBg} resize-none`}
            required
          />
        </div>

        {/* Image URL Field */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-black opacity-40 ml-1">Illustration Image URL (optional)</label>
          <div className="flex gap-3 items-start">
            <input 
              type="url" 
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={`flex-1 px-3 py-2 rounded-lg border-[2.5px] ${theme.taskCardBorder} ${theme.modalInputBg} text-sm`}
            />
            {/* Live thumbnail preview */}
            {imageUrl && (
              <div className={`w-16 h-16 shrink-0 border-[2.5px] ${theme.taskCardBorder} rounded-lg overflow-hidden bg-black/10`}>
                <img 
                  src={imageUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
                <div className="hidden w-full h-full items-center justify-center text-[8px] opacity-40 text-center p-1">Bad URL</div>
              </div>
            )}
          </div>
          <p className="text-[9px] opacity-30 ml-1 italic">Paste any public image URL. Leave blank to keep the default illustration.</p>
        </div>

        <button 
          disabled={loading}
          type="submit"
          className={`w-full py-3 rounded-xl border-[3px] ${theme.taskCardBorder} ${isDarkMode ? 'bg-[#3d2f1f] text-[#ffcf54]' : 'bg-[#ffcf54] text-[#2c2a25]'} font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform`}
        >
          {loading ? 'Processing...' : (editingId ? 'Update Broadcast' : 'Deploy Broadcast')}
          <Send size={14} strokeWidth={3} />
        </button>
      </form>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
        <h3 className={`font-serif font-black uppercase text-sm ${isDarkMode ? 'text-[#fdf8ea]/60' : 'text-[#2c2a25]/60'}`}>
          Scheduled Reports ({broadcasts.length})
        </h3>
        {broadcasts.length === 0 ? (
          <div className="py-10 text-center opacity-30 text-sm italic">No broadcasts found.</div>
        ) : (
          broadcasts.map(b => (
            <div 
              key={b._id} 
              className={`${theme.modalInputBg} border-[2.5px] ${theme.taskCardBorder} p-3 rounded-xl flex items-center justify-between group hover:shadow-[4px_4px_0_#00000020] transition-all`}
            >
              <div className="flex flex-col gap-0.5 max-w-[70%]">
                <div className="flex items-center gap-2">
                   <Calendar size={12} className="opacity-40" />
                   <span className="font-sans font-black text-xs uppercase text-[#ff6b6b]">{b.date}</span>
                </div>
                <p className="text-sm line-clamp-2 opacity-80 leading-snug">{b.message}</p>
                {b.imageUrl && b.imageUrl !== 'okaaa.jpg' && (
                  <span className="text-[9px] opacity-40 truncate font-mono mt-0.5">{b.imageUrl}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {b.imageUrl && b.imageUrl !== 'okaaa.jpg' && (
                  <div className={`w-10 h-10 shrink-0 border-[2px] ${theme.taskCardBorder} rounded-lg overflow-hidden`}>
                    <img src={b.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <button 
                  onClick={() => startEdit(b)}
                  className={`p-2 rounded-lg border-[2px] ${theme.taskCardBorder} ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'} transition-colors`}
                >
                  <Edit2 size={14} strokeWidth={3} />
                </button>
                <button 
                  onClick={() => handleDelete(b._id)}
                  className={`p-2 rounded-lg border-[2px] border-[#ff6b6b] text-[#ff6b6b] hover:bg-[#ff6b6b] hover:text-white transition-colors`}
                >
                  <Trash2 size={14} strokeWidth={3} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
