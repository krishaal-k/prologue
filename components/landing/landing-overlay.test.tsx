import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LandingOverlay } from "./landing-overlay";

describe("LandingOverlay", () => {
  it("renders both overlay strings", () => {
    render(<LandingOverlay />);
    expect(screen.getByText(/my prologue/i)).toBeInTheDocument();
    expect(screen.getByText(/click anywhere to enter/i)).toBeInTheDocument();
  });
});
