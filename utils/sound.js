const getContext = (() => {
  let ctx = null;
  return () => {
    if (typeof window === 'undefined') return null;
    if (!window.AudioContext && !window.webkitAudioContext) return null;
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  };
})();

// A tiny, tactile "mouse click" style tap for small UI elements
export const playTapSound = () => {
  const ctx = getContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  // A square wave gives that mechanical, plastic "click" texture
  osc.type = 'square';
  // Start high and drop instantly to simulate the "snap"
  osc.frequency.setValueAtTime(1000, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.02);
  
  gain.gain.setValueAtTime(0, ctx.currentTime);
  // Extremely sharp attack and release for a dry "tick"
  gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.001);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.03);
};

// A slightly deeper, satisfying mechanical press for bigger buttons
export const playPopSound = () => {
  const ctx = getContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  // Deeper square snap
  osc.type = 'square';
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.03);
  
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.001);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.04);
};

// Semantic checkmark toggle: Bright ascent to check, gentle descent to uncheck
export const playCheckSound = (isChecked) => {
  const ctx = getContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  
  if (isChecked) {
    // bright, ascending chime
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
  } else {
    // dull, descending thump
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);
  }
  
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.15);
};

// A lower rustle/thump for deleting tasks
export const playTrashSound = () => {
  const ctx = getContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
  
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.2);
};

// A sweeping 'air' sound for opening large modals or refreshing
export const playSwooshSound = () => {
  const ctx = getContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.2);
};

export const playSuccessSound = () => {
  const ctx = getContext();
  if (!ctx) return;
  const playTone = (freq, time, duration) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.15, time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + duration);
  };
  playTone(523.25, ctx.currentTime, 0.3);
  playTone(659.25, ctx.currentTime + 0.1, 0.4);
};

// A "Warm Paper Tap" sound: Smooth, non-distracting tactile feedback.
// Optimized for audibility while staying smooth and "woody."
export const playTypeSound = () => {
  const ctx = getContext();
  if (!ctx || ctx.state === 'suspended') return;

  const now = ctx.currentTime;
  
  // -- LAYER 1: THE BODY (Thud) --
  const thudOsc = ctx.createOscillator();
  const thudGain = ctx.createGain();
  thudOsc.type = 'sine';
  // Slightly higher frequency range for better audibility
  thudOsc.frequency.setValueAtTime(220 + Math.random() * 30, now);
  thudOsc.frequency.exponentialRampToValueAtTime(120, now + 0.03);
  
  thudGain.gain.setValueAtTime(0, now);
  thudGain.gain.linearRampToValueAtTime(0.12, now + 0.002); // Doubled gain
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

  // -- LAYER 2: THE SURFACE (Tack/Texture) --
  const tapOsc = ctx.createOscillator();
  const tapGain = ctx.createGain();
  tapOsc.type = 'triangle'; // Triangle for a bit more "presence" than sine
  tapOsc.frequency.setValueAtTime(450 + Math.random() * 100, now);
  tapOsc.frequency.exponentialRampToValueAtTime(250, now + 0.02);
  
  tapGain.gain.setValueAtTime(0, now);
  tapGain.gain.linearRampToValueAtTime(0.06, now + 0.001); // Doubled gain
  tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

  // Connections
  thudOsc.connect(thudGain);
  thudGain.connect(ctx.destination);
  
  tapOsc.connect(tapGain);
  tapGain.connect(ctx.destination);

  // Trigger
  thudOsc.start(now);
  tapOsc.start(now);
  
  thudOsc.stop(now + 0.04);
  tapOsc.stop(now + 0.03);
};
