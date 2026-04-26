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
});
