import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));
vi.mock("../hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => false,
}));

import Home from "./page";

describe("Home (landing)", () => {
  it("renders the landing overlay text and a click-to-enter button", () => {
    render(<Home />);
    expect(screen.getByText(/My Prologue/i)).toBeInTheDocument();
    expect(screen.getByText(/click anywhere to enter/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /enter site/i })).toBeInTheDocument();
  });

  it("navigates to /home when clicked", () => {
    mockPush.mockClear();
    render(<Home />);
    fireEvent.click(screen.getByRole("button", { name: /enter site/i }));
    expect(mockPush).toHaveBeenCalledWith("/home");
  });

  it("navigates to /home on Enter key", () => {
    mockPush.mockClear();
    render(<Home />);
    fireEvent.keyDown(screen.getByRole("button", { name: /enter site/i }), { key: "Enter" });
    expect(mockPush).toHaveBeenCalledWith("/home");
  });

  it("renders the background video", () => {
    render(<Home />);
    expect(screen.getByLabelText(/pug looking out a window/i)).toBeInTheDocument();
  });
});
