"use client";

import { useEffect } from "react";

const KOFI_OVERLAY_SCRIPT_ID = "kofi-overlay-script";
const KOFI_OVERLAY_SCRIPT_SRC =
  "https://storage.ko-fi.com/cdn/scripts/overlay-widget.js";
const DEFAULT_KOFI_USERNAME = "kazama_studiooo";

function loadKoFiOverlayScript(onLoad) {
  if (typeof document === "undefined") return;
  if (document.getElementById(KOFI_OVERLAY_SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = KOFI_OVERLAY_SCRIPT_ID;
  script.src = KOFI_OVERLAY_SCRIPT_SRC;
  script.async = true;
  script.onload = onLoad;
  document.body.appendChild(script);
}

function drawKoFiOverlay(username) {
  if (typeof window === "undefined" || !window.kofiWidgetOverlay) return;

  try {
    window.kofiWidgetOverlay.draw(username, {
      type: "floating-chat",
      "floating-chat.donateButton.text": "Support me",
      "floating-chat.donateButton.background-color": "#ff5f5f",
      "floating-chat.donateButton.text-color": "#fff",
    });
  } catch (error) {
    console.warn("Ko-fi overlay failed to initialize", error);
  }
}

export default function KoFiOverlay({ username = DEFAULT_KOFI_USERNAME }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.kofiWidgetOverlay) {
      drawKoFiOverlay(username);
      return;
    }

    loadKoFiOverlayScript(() => drawKoFiOverlay(username));
  }, [username]);

  return null;
}
