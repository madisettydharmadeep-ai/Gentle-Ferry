'use client';

import { useState, useRef } from 'react';
import { clsx } from 'clsx';
import { getCroppedImg, playShutterSound } from '../utils/image-utils';

/**
 * CameraCropper - A high-fidelity, interactive camera viewfinder component
 * for cropping journal images with a vintage aesthetic.
 */
export default function CameraCropper({ rawImage, onCrop, onCancel }) {
  const imgRef = useRef(null);
  const [cameraPos, setCameraPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [shuttering, setShuttering] = useState(false);
  
  const startPos = useRef({ x: 0, y: 0 });
  const cameraStart = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    hasDragged.current = false;
    startPos.current = { x: e.clientX, y: e.clientY };
    cameraStart.current = { ...cameraPos };
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !imgRef.current) return;
    hasDragged.current = true;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    
    const { width, height } = imgRef.current.getBoundingClientRect();
    const maxX = Math.max(0, (width / 2) - 94);
    const maxY = Math.max(0, (height / 2) - 94);
    
    const newX = cameraStart.current.x + dx;
    const newY = cameraStart.current.y + dy;
    
    setCameraPos({
      x: Math.max(-maxX, Math.min(maxX, newX)),
      y: Math.max(-maxY, Math.min(maxY, newY)),
    });
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);
  };

  const handleCameraClick = (e) => {
    e.stopPropagation();
    if (!hasDragged.current) {
      triggerShutter();
    }
  };

  const triggerShutter = () => {
    if (!imgRef.current) return;
    
    playShutterSound();
    setShuttering(true);
    
    setTimeout(async () => {
      const img = imgRef.current;
      const { width: renderW, height: renderH } = img.getBoundingClientRect();
      const naturalW = img.naturalWidth;
      const naturalH = img.naturalHeight;
      const scaleX = naturalW / renderW;
      const scaleY = naturalH / renderH;

      const cssX = (renderW / 2) + cameraPos.x - 94;
      const cssY = (renderH / 2) + cameraPos.y - 94;
      
      const pixelCrop = {
        x: cssX * scaleX,
        y: cssY * scaleY,
        width: 188 * scaleX,
        height: 188 * scaleY,
      };

      const cropped = await getCroppedImg(rawImage, pixelCrop);
      onCrop(cropped);
      setShuttering(false);
    }, 550);
  };

  return (
    <div 
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center p-4 animate-fadeIn"
      onClick={onCancel}
    >
      <div 
        className="relative w-full max-w-[480px] bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center touch-none select-none p-0 overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* The Stationary Sharp Image */}
        <img 
          ref={imgRef}
          src={rawImage}
          alt="Raw upload"
          className="max-w-full max-h-full object-contain block pointer-events-none rounded-lg"
          draggable="false"
        />

        {/* ── Dynamic Black Viewfinder Overlay ── */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-lg">
           {/* Top mask */}
           <div 
             className="absolute top-0 left-0 right-0 bg-black/60" 
             style={{ height: `calc(50% + ${cameraPos.y}px - 94px)` }}
           />
           {/* Bottom mask */}
           <div 
             className="absolute bottom-0 left-0 right-0 bg-black/60" 
             style={{ height: `calc(50% - ${cameraPos.y}px - 94px)` }}
           />
           {/* Left mask */}
           <div 
             className="absolute left-0 bg-black/60" 
             style={{ 
                top: `calc(50% + ${cameraPos.y}px - 94px)`, 
                bottom: `calc(50% - ${cameraPos.y}px - 94px)`, 
                width: `calc(50% + ${cameraPos.x}px - 94px)` 
             }}
           />
           {/* Right mask */}
           <div 
             className="absolute right-0 bg-black/60" 
             style={{ 
                top: `calc(50% + ${cameraPos.y}px - 94px)`, 
                bottom: `calc(50% - ${cameraPos.y}px - 94px)`, 
                width: `calc(50% - ${cameraPos.x}px - 94px)` 
             }}
           />
        </div>

        {/* The Refined Aesthetic Black Camera Block (Compact) */}
        <div 
           className="absolute top-1/2 left-1/2 w-[220px] h-[220px] pointer-events-none z-20 flex flex-col items-center justify-center group"
           style={{ transform: `translate(calc(-50% + ${cameraPos.x}px), calc(-50% + ${cameraPos.y}px))` }}
        >
            {/* Vintage Flash Bulb Assembly */}
            <div className="absolute -top-4 left-6 w-10 h-5 bg-[#222] rounded-t-xl flex items-center justify-center border-t border-[#333] shadow-md z-10 transition-transform">
               <div className="w-6 h-[5px] bg-gradient-to-b from-white/90 to-white/40 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
            </div>
            
            {/* Mechanical Shutter Module */}
            <div className="absolute -top-3 right-8 flex flex-col items-center pointer-events-none z-10">
               <div className="w-5 h-2 bg-gradient-to-b from-[#FF453A] to-[#C90000] rounded-t-full shadow-[inset_0_-1px_2px_rgba(0,0,0,0.5)] group-active:translate-y-1.5 transition-transform duration-75" />
               <div className="w-7 h-1.5 bg-gradient-to-b from-[#E5E5EA] to-[#AEAEB2] rounded-t-sm border border-black/20" />
            </div>

            {/* Main Camera Body Outline */}
            <div 
               className="absolute inset-0 border-[16px] border-[#18181A] rounded-[32px] pointer-events-auto cursor-pointer shadow-[0_15px_40px_rgba(0,0,0,0.5)] ring-1 ring-white/10 active:scale-[0.99] transition-all z-20"
               onClick={handleCameraClick}
            >
               {/* Viewfinder Glass (Clear Hole) */}
               <div className="w-full h-full rounded-[14px] border border-white/5 bg-transparent pointer-events-none relative overflow-hidden" />
               
               {/* Center Graphic Reticle */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-60 mix-blend-overlay pointer-events-none">
                  <div className="w-5 h-[1.5px] bg-white absolute rounded-full" />
                  <div className="h-5 w-[1.5px] bg-white absolute rounded-full" />
                  <div className="w-1.5 h-1.5 border-[1.5px] border-white rounded-full absolute" />
               </div>

               {/* Focus Text */}
               <div className="absolute top-[28px] right-[28px] flex items-center gap-1 opacity-90 pointer-events-none">
                  <span className="text-[0.4rem] font-bold text-white uppercase tracking-[0.2em] drop-shadow-md">Focus</span>
                  <span className="w-1.5 h-1.5 bg-[#FF453A] rounded-full shadow-[0_0_6px_#FF453A] animate-pulse" />
               </div>
            </div>
            
            {/* Shutter Flash */}
            <div className={clsx(
               "absolute inset-[16px] bg-white rounded-[14px] pointer-events-none transition-all z-[400]", 
               shuttering ? "opacity-100 duration-150" : "opacity-0 duration-500"
            )} />
         </div>
      </div>
    </div>
   );
}
