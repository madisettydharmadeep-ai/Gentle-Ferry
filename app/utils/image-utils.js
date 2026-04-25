/**
 * Utility functions for image processing and aesthetic shutter sound effects.
 */

export const EXPORT_W = 1000;
export const EXPORT_H = 1000;

export function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (e) => reject(e));
    img.src = url;
  });
}

export async function getCroppedImg(imageSrc, pixelCrop) {
  const img = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = EXPORT_W;
  canvas.height = EXPORT_H;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(
    img, 
    pixelCrop.x, 
    pixelCrop.y, 
    pixelCrop.width, 
    pixelCrop.height, 
    0, 0, 
    EXPORT_W, 
    EXPORT_H
  );
  return canvas.toDataURL('image/jpeg', 0.85);
}

export const playShutterSound = () => {
    if (typeof window === 'undefined') return;
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const burstTime = audioCtx.currentTime;
        
        // Mechanical click mechanism
        const osc = audioCtx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, burstTime);
        osc.frequency.exponentialRampToValueAtTime(30, burstTime + 0.1);
        
        const oscGain = audioCtx.createGain();
        oscGain.gain.setValueAtTime(0.8, burstTime);
        oscGain.gain.exponentialRampToValueAtTime(0.01, burstTime + 0.1);
        osc.connect(oscGain).connect(audioCtx.destination);
        
        // White noise swish
        const bufferSize = audioCtx.sampleRate * 0.1;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = audioCtx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 1000;
        
        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.4, burstTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, burstTime + 0.1);
        noise.connect(noiseFilter).connect(noiseGain).connect(audioCtx.destination);
        
        osc.start(burstTime);
        osc.stop(burstTime + 0.1);
        noise.start(burstTime);
        noise.stop(burstTime + 0.1);
        
        // Second delayed click for the slow mirror drop
        const delay = 0.35;
        const osc2 = audioCtx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(250, burstTime + delay);
        osc2.frequency.exponentialRampToValueAtTime(40, burstTime + delay + 0.1);
        
        const osc2Gain = audioCtx.createGain();
        osc2Gain.gain.setValueAtTime(0.6, burstTime + delay);
        osc2Gain.gain.exponentialRampToValueAtTime(0.01, burstTime + delay + 0.1);
        osc2.connect(osc2Gain).connect(audioCtx.destination);
        osc2.start(burstTime + delay);
        osc2.stop(burstTime + delay + 0.1);
    } catch(e) {}
};
