"use client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { LandingVideo } from "../components/landing/landing-video";
import { LandingOverlay } from "../components/landing/landing-overlay";

export default function Home() {
  const router = useRouter();

  const enter = useCallback(() => router.push("/home"), [router]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Enter site"
      onClick={enter}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          enter();
        }
      }}
      className="relative w-screen h-screen overflow-hidden cursor-pointer focus:outline-none"
    >
      <LandingVideo />
      <LandingOverlay />
    </div>
  );
}
