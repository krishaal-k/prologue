"use client";
import { usePrefersReducedMotion } from "../../hooks/use-prefers-reduced-motion";

const MASK = "radial-gradient(ellipse 80% 78% at 50% 50%, black 55%, transparent 100%)";

export function LandingVideo() {
  const reduced = usePrefersReducedMotion();
  const className = "absolute inset-0 w-full h-full object-cover";
  const style = { maskImage: MASK, WebkitMaskImage: MASK };

  if (reduced) {
    return (
      <img
        src="/landing/poster.jpg"
        alt="A pug looking out a window at the rain"
        className={className}
        style={style}
      />
    );
  }

  return (
    <video
      src="/landing/pug-window.mp4"
      poster="/landing/poster.jpg"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label="A pug looking out a window at the rain"
      className={className}
      style={style}
    />
  );
}
