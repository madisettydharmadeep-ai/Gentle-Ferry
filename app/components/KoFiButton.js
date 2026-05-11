"use client";

import React from "react";
import Image from "next/image";

const KoFiButton = ({ className = "" }) => {
  return (
    <a
      href="https://ko-fi.com/kazama_studiooo"
      target="_blank"
      rel="noopener noreferrer"
      className={`
        group relative inline-flex items-center justify-center gap-3 
        w-full py-3.5 px-6 rounded-xl 
        bg-[#FFDD00] text-[#1a1a1a] 
        font-bold text-sm text-center
        transition-all duration-200
        hover:brightness-95 hover:-translate-y-0.5
        active:scale-[0.98] active:translate-y-0
        shadow-[0_4px_0_0_#d9bc00] hover:shadow-[0_6px_0_0_#d9bc00]
        active:shadow-none
        ${className}
      `}
    >
      <div className="flex items-center justify-center shrink-0">
        <Image
          src="/kofi_symbol.png"
          alt="Ko-fi"
          width={22}
          height={22}
          className="object-contain"
          priority
        />
      </div>
      <span>Support me on Ko-fi</span>
    </a>
  );
};

export default KoFiButton;
