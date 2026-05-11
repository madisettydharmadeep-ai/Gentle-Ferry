"use client";

import { useEffect } from "react";
import { Coffee } from "lucide-react";

const DEFAULT_KOFI_USERNAME = "kazama_studiooo";
const KOFI_SCRIPT_ID = "kofi-button-script";
const KOFI_SCRIPT_SRC = "https://cdnjs.ko-fi.com/2.0.0/widget.js";

function loadKoFiScript() {
  if (typeof document === "undefined") return;
  if (document.getElementById(KOFI_SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = KOFI_SCRIPT_ID;
  script.src = KOFI_SCRIPT_SRC;
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
}

export default function KoFiButton({
  username = DEFAULT_KOFI_USERNAME,
  label = "Support on Ko-fi",
  className = "",
  description = "Support me on Ko-fi",
}) {
  useEffect(() => {
    loadKoFiScript();
  }, []);

  const href = `https://ko-fi.com/${username}`;

  return (
    <div
      className={className}
      data-name={username}
      data-description={description}
      data-color="#F1605D"
      data-size="medium"
      data-text={label}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2"
      >
        <Coffee className="w-3 h-3" />
        <span>{label}</span>
      </a>
    </div>
  );
}
