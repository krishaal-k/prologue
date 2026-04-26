import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("next/navigation", () => ({ usePathname: () => "/projects" }));
vi.mock("../../lib/content", () => ({
  getAllPosts: vi.fn().mockResolvedValue([
    { slug: "welcome", title: "Welcome", date: "2026-04-26", summary: "x", tags: [], body: "" },
  ]),
  getAllProjects: vi.fn().mockResolvedValue([
    { slug: "my-prologue", title: "My Prologue", date: "2026-04-26", summary: "x", status: "wip", links: {}, tech: [], body: "" },
    { slug: "second", title: "Second Project", date: "2026-04-25", summary: "y", status: "live", links: {}, tech: [], body: "" },
  ]),
}));

import * as content from "../../lib/content";
import ProjectsIndex from "./page";

describe("ProjectsIndex", () => {
  it("renders the page heading and the seed project", async () => {
    render(await ProjectsIndex());
    expect(screen.getByRole("heading", { name: /^Projects$/i })).toBeInTheDocument();
    expect(screen.getByText("My Prologue")).toBeInTheDocument();
  });

  it("fetches and renders all projects from the loader", async () => {
    render(await ProjectsIndex());
    expect(content.getAllProjects).toHaveBeenCalled();
    expect(screen.getByText("Second Project")).toBeInTheDocument();
  });

  it("renders project card links to /projects/<slug>", async () => {
    render(await ProjectsIndex());
    const links = screen.getAllByRole("link", { name: /My Prologue/i });
    expect(links.some((l) => l.getAttribute("href") === "/projects/my-prologue")).toBe(true);
  });

  it("renders sidebar with posts and projects", async () => {
    render(await ProjectsIndex());
    expect(screen.getByText("MY PROLOGUE")).toBeInTheDocument();
    expect(content.getAllPosts).toHaveBeenCalled();
  });

  it("sidebar projects cascade shows project entries when expanded", async () => {
    render(await ProjectsIndex());
    fireEvent.click(screen.getByRole("button", { name: /projects/i }));
    expect(screen.getAllByRole("link", { name: /My Prologue/i }).length).toBeGreaterThanOrEqual(2);
  });
});
