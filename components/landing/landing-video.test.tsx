import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("../../hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: vi.fn(),
}));

import { LandingVideo } from "./landing-video";
import { usePrefersReducedMotion } from "../../hooks/use-prefers-reduced-motion";

describe("LandingVideo", () => {
  it("renders a <video> with autoplay/muted/loop/playsinline when motion is OK", () => {
    vi.mocked(usePrefersReducedMotion).mockReturnValue(false);
    const { container } = render(<LandingVideo />);
    const video = container.querySelector("video");
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute("autoplay");
    expect(video).toHaveAttribute("loop");
    expect(video).toHaveAttribute("playsinline");
    expect(video?.muted).toBe(true);
  });

  it("renders an <img> poster fallback (no <video>) when reduced-motion is preferred", () => {
    vi.mocked(usePrefersReducedMotion).mockReturnValue(true);
    const { container } = render(<LandingVideo />);
    expect(container.querySelector("video")).not.toBeInTheDocument();
    const img = screen.getByAltText(/pug/i);
    expect(img).toBeInTheDocument();
    expect(img.tagName).toBe("IMG");
  });
});
