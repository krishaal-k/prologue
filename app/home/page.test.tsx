import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  usePathname: () => "/home",
}));
vi.mock("../../lib/content", () => ({
  getAllPosts: vi.fn().mockResolvedValue([
    { slug: "welcome", title: "Welcome to My Prologue", date: "2026-04-26", summary: "Why I'm building in public.", tags: [], body: "" },
  ]),
  getAllProjects: vi.fn().mockResolvedValue([
    { slug: "my-prologue", title: "My Prologue", date: "2026-04-26", summary: "x", status: "wip", links: {}, tech: [], body: "" },
  ]),
}));

import HomePage from "./page";

describe("HomePage", () => {
  it("renders mission text and the recent welcome post", async () => {
    render(await HomePage());
    expect(screen.getByText(/learning to build/i)).toBeInTheDocument();
    expect(screen.getByText("Welcome to My Prologue")).toBeInTheDocument();
  });
});
