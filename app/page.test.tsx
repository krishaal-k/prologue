import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("renders the scaffolding placeholder text", () => {
    render(<Home />);
    expect(screen.getByText(/My Prologue/i)).toBeInTheDocument();
    expect(screen.getByText(/scaffolding/i)).toBeInTheDocument();
  });
});
