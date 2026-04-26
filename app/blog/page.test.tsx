import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({ usePathname: () => "/blog" }));
vi.mock("../../lib/content", () => ({
  getAllPosts: vi.fn().mockResolvedValue([
    { slug: "welcome", title: "Welcome to My Prologue", date: "2026-04-26", summary: "x", tags: [], body: "" },
    { slug: "second", title: "Second Post", date: "2026-04-25", summary: "y", tags: [], body: "" },
  ]),
  getAllProjects: vi.fn().mockResolvedValue([
    { slug: "my-prologue", title: "My Prologue", date: "2026-04-26", summary: "x", status: "wip", links: {}, tech: [], body: "" },
  ]),
}));

import * as content from "../../lib/content";
import BlogIndex from "./page";

describe("BlogIndex", () => {
  it("renders the page heading and the seed post", async () => {
    render(await BlogIndex());
    expect(screen.getByRole("heading", { name: /^Blog$/i })).toBeInTheDocument();
    expect(screen.getByText("Welcome to My Prologue")).toBeInTheDocument();
  });

  it("renders all posts from the loader", async () => {
    render(await BlogIndex());
    expect(screen.getByText("Welcome to My Prologue")).toBeInTheDocument();
    expect(screen.getByText("Second Post")).toBeInTheDocument();
  });

  it("renders the sidebar navigation", async () => {
    render(await BlogIndex());
    expect(screen.getByText("MY PROLOGUE")).toBeInTheDocument();
  });

  it("renders post links via PostCard", async () => {
    render(await BlogIndex());
    expect(screen.getByRole("link", { name: /Welcome to My Prologue/i })).toHaveAttribute("href", "/blog/welcome");
  });

  it("fetches and passes projects to sidebar", async () => {
    render(await BlogIndex());
    expect(content.getAllProjects).toHaveBeenCalled();
  });
});
