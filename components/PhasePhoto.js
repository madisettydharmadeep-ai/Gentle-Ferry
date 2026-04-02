'use client';
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

export default function PhasePhoto({ setPhase, photo, setPhoto }) {
  const [isPhotoDragging, setIsPhotoDragging] = useState(false);
  const photoInputRef = useRef(null);

  const handlePhotoUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPhoto(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="max-w-md mx-auto mt-4 text-[#2f2e2b]"
    >
      <div className="mb-6 text-center">
        <p className="text-sm font-sans uppercase tracking-[0.2em] opacity-50 mb-2">Specimen Collection</p>
        <p className="font-serif italic text-lg opacity-80">
          "A visual record of the day's pursuits."
        </p>
      </div>

      <div 
        className={`relative w-full aspect-[4/3] flex flex-col items-center justify-center cursor-pointer border-[1px] border-[#2f2e2b]/30 p-2 transition-all duration-300 ${
          isPhotoDragging ? 'bg-[#2f2e2b]/5' : 'hover:bg-[#2f2e2b]/5'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsPhotoDragging(true); }}
        onDragLeave={() => setIsPhotoDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsPhotoDragging(false);
          handlePhotoUpload(e.dataTransfer.files[0]);
        }}
        onClick={() => photoInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={photoInputRef} 
          className="hidden" 
          accept="image/*"
          capture="environment"
          onChange={(e) => handlePhotoUpload(e.target.files[0])}
        />
        
        <div className="w-full h-full border border-dashed border-[#2f2e2b]/20 relative overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            {photo ? (
              <motion.div
                key="uploaded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0"
              >
                {/* Vintage photo filter overlay */}
                <div className="absolute inset-0 bg-[#9c825a]/10 mix-blend-multiply pointer-events-none z-10" />
                <img 
                  src={photo} 
                  alt="Specimen" 
                  className="w-full h-full object-cover grayscale-[0.3] sepia-[0.3] contrast-[1.1]"
                />
              </motion.div>
            ) : (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 text-[#2f2e2b] opacity-40"
              >
                <Search size={32} strokeWidth={1} />
                <span className="text-xs font-sans uppercase tracking-widest text-center px-4">Attach Visual <br/> <span className="text-[10px] opacity-70">(Click or Drag)</span></span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {photo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 flex justify-end"
        >
          <button
            onClick={() => setPhase('receipt')}
            className="px-6 py-2 border border-[#2f2e2b] text-[#2f2e2b] text-xs font-sans uppercase tracking-[0.2em] hover:bg-[#2f2e2b] hover:text-[#f2eee3] transition-colors w-full sm:w-auto"
          >
            Archive Entry &rarr;
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
