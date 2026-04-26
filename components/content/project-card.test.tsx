import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProjectCard } from "./project-card";

const sample = {
  slug: "my-prologue",
  title: "My Prologue",
  date: "2026-04-26",
  summary: "The site you're reading.",
  status: "wip" as const,
  links: { github: "https://github.com/x/y" },
  tech: ["next", "react"],
  body: "ignored",
};

describe("ProjectCard", () => {
  it("renders title, summary, and a status pill with the status text", () => {
    render(<ProjectCard project={sample} />);
    expect(screen.getByText("My Prologue")).toBeInTheDocument();
    expect(screen.getByText(/WIP|wip/i)).toBeInTheDocument();
  });

  it("renders tech tags when present and omits when empty", () => {
    const { rerender } = render(<ProjectCard project={sample} />);
    expect(screen.getByText("next")).toBeInTheDocument();
    rerender(<ProjectCard project={{ ...sample, tech: [] }} />);
    expect(screen.queryByText("next")).not.toBeInTheDocument();
  });

  it("links the card to /projects/<slug>", () => {
    render(<ProjectCard project={sample} />);
    expect(screen.getByRole("link", { name: /My Prologue/ })).toHaveAttribute(
      "href",
      "/projects/my-prologue",
    );
  });
});
