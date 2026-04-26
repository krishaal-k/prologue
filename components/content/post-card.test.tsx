import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PostCard } from "./post-card";

const sample = {
  slug: "welcome",
  title: "Welcome to My Prologue",
  date: "2026-04-26",
  summary: "Why I'm building in public.",
  tags: ["meta", "intro"],
  body: "ignored",
};

describe("PostCard", () => {
  it("renders title, formatted date, and summary", () => {
    render(<PostCard post={sample} />);
    expect(screen.getByText("Welcome to My Prologue")).toBeInTheDocument();
    expect(screen.getByText(sample.summary)).toBeInTheDocument();
    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });

  it("renders tags when present", () => {
    render(<PostCard post={sample} />);
    expect(screen.getByText("meta")).toBeInTheDocument();
    expect(screen.getByText("intro")).toBeInTheDocument();
  });

  it("omits tags row when tags array is empty", () => {
    render(<PostCard post={{ ...sample, tags: [] }} />);
    expect(screen.queryByText("meta")).not.toBeInTheDocument();
  });

  it("links to /blog/<slug>", () => {
    render(<PostCard post={sample} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/blog/welcome");
  });
});
