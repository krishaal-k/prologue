import { describe, it, expect, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "--font-geist-sans" }),
  Geist_Mono: () => ({ variable: "--font-geist-mono" }),
  Fraunces: () => ({ variable: "--font-fraunces" }),
}));

import { metadata } from "./layout";

describe("layout", () => {
  it("exports site metadata with the new title and description", () => {
    expect(metadata.title).toBe("My Prologue");
    expect(metadata.description).toMatch(/building in public/i);
  });

  it("sets metadataBase to the production origin so relative OG URLs resolve absolutely", () => {
    expect(metadata.metadataBase).toBeInstanceOf(URL);
    expect(metadata.metadataBase?.toString()).toBe("https://www.krishaal.dev/");
  });
});
