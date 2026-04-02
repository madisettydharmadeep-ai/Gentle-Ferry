"use client";
import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { playTapSound, playSwooshSound } from "../utils/sound";
import { useAppContext } from "../app/context/AppContext";
import ProButton from "./ProButton";

export default function CoinFlipModeToggle() {
  const { isProductive, toggleProductive, isPremium, setShowProModal } = useAppContext();

  const coinControls = useAnimation();
  const shadowControls = useAnimation();
  const flareControls = useAnimation();
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const tossCoin = async () => {
      // 1. Shadow softens and shrinks slightly to imply the coin is moving closer to the camera, not up
      shadowControls.start({
        scale: [1, 0.8, 0.8, 1, 0.95, 1],
        opacity: [0.4, 0.2, 0.2, 0.4, 0.3, 0.4],
        transition: {
          duration: 1.2,
          times: [0, 0.4, 0.6, 0.85, 0.92, 1],
          ease: "easeInOut",
        },
      });

      // 2. The Treasure Burst triggers at the peak scale
      flareControls.start({
        opacity: [0, 1, 0],
        scale: [0.5, 2.5, 3],
        transition: { duration: 0.6, delay: 0.3, ease: "easeOut" },
      });

      // 3. The Physical Pop: Z-Axis Scale in place, Hang, Shrink, Squash settle
      await coinControls.start({
        scale: [1, 1.6, 1.6, 1, 1.05, 1],
        rotateY: isProductive ? 0 : 180,
        transition: {
          duration: 1.2,
          times: [0, 0.4, 0.6, 0.85, 0.92, 1], // Stays perfectly synced
          ease: "easeInOut",
        },
      });
    };

    tossCoin();
  }, [isProductive, coinControls, shadowControls, flareControls]);

  const handleToggle = () => {
    if (isProductive && !isPremium) {
      setShowProModal(true);
      return;
    }
    if (playTapSound) playTapSound();
    if (playSwooshSound) setTimeout(playSwooshSound, 100);
    toggleProductive();
  };

  const glowColor = isProductive
    ? "rgba(230, 144, 69, 0.5)"
    : "rgba(124, 168, 217, 0.5)";

  const ShineEffect = () => (
    <motion.div
      key={`shine-${isProductive}`}
      initial={{ x: "-200%", opacity: 0 }}
      animate={{ x: "200%", opacity: [0, 1, 0] }}
      transition={{ duration: 0.8, ease: "easeInOut", delay: 0.35 }}
      className="absolute inset-0 w-[200%] h-[200%] -top-[50%] -left-[50%] bg-gradient-to-r from-transparent via-white/90 to-transparent rotate-[35deg] pointer-events-none mix-blend-overlay z-20"
    />
  );

  return (
    <div className="flex flex-col items-center justify-center gap-16 py-20">
      <div className="relative perspective-[1000px] w-[240px] h-[240px] flex items-center justify-center">
        {/* Ambient Background Glow */}
        <div
          className="absolute inset-0 blur-3xl scale-125 transition-colors duration-1000 z-0"
          style={{ backgroundColor: glowColor }}
        />

        {/* The Treasure Burst Flare */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={flareControls}
          className="absolute inset-0 rounded-full bg-white blur-2xl pointer-events-none z-0"
        />

        {/* Dynamic Floor Shadow */}
        <motion.div
          initial={{ scale: 1, opacity: 0.4 }}
          animate={shadowControls}
          className="absolute -bottom-8 w-40 h-8 bg-black rounded-[100%] blur-md pointer-events-none z-0"
        />

        {/* The Coin */}
        <motion.div
          onClick={handleToggle}
          whileHover={{ scale: 1.05 }}
          initial={{ rotateY: isProductive ? 0 : 180, scale: 1 }}
          animate={coinControls}
          className="relative w-full h-full rounded-full cursor-pointer shadow-2xl z-10"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front Face (Productive) */}

          <div
            className="absolute inset-0 w-full h-full rounded-full border-[8px] border-white/80 bg-gradient-to-br from-[#fff9f0] to-[#f4e6d4] flex flex-col items-center justify-center overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              boxShadow:
                "inset 0 10px 20px rgba(0,0,0,0.1), inset 0 -4px 10px rgba(255,255,255,0.5)",
            }}
          >
            <div className="absolute top-0 left-[-50%] w-[200%] h-[50%] bg-white/40 rotate-[-15deg] pointer-events-none" />
            <img
              src="/light house.png"
              alt="Productive Mode"
              className="w-32 h-32 object-contain drop-shadow-xl"
            />
            <ShineEffect />
          </div>

          {/* Back Face (Chill) */}
          <div
            className="absolute inset-0 w-full h-full rounded-full border-[8px] border-white/80 bg-gradient-to-br from-[#f0f4f8] to-[#d9e2ec] flex flex-col items-center justify-center overflow-hidden"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              boxShadow:
                "inset 0 10px 20px rgba(0,0,0,0.1), inset 0 -4px 10px rgba(255,255,255,0.5)",
            }}
          >
            <div className="absolute top-0 left-[-50%] w-[200%] h-[50%] bg-white/40 rotate-[15deg] pointer-events-none" />
            <img
              src="/cloud.png"
              alt="Chill Mode"
              className="w-32 h-32 object-contain drop-shadow-xl"
            />
            <ShineEffect />
          </div>
        </motion.div>
      </div>

      {/* Label & Upgrade Action */}
      <div className="flex flex-col items-center gap-6">
        <motion.div
          key={isProductive ? "prod" : "chill"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`font-sans uppercase tracking-[0.3em] font-black text-sm
            ${isProductive ? "text-[#e69045]" : "text-[#7ca8d9]"}
          `}
        >
          {isProductive ? "Productive" : "Chill Space"}
        </motion.div>

        {isProductive && !isPremium && (
          <ProButton className="scale-90">Unlock Chill Space</ProButton>
        )}
      </div>
    </div>
  );
}
