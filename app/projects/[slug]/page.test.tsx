import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  usePathname: () => "/projects/my-prologue",
  notFound: vi.fn(() => { throw new Error("NEXT_NOT_FOUND"); }),
}));
vi.mock("next-mdx-remote/rsc", () => ({
  MDXRemote: ({ source }: { source: string }) => <div data-testid="mdx">{source}</div>,
}));
vi.mock("../../../lib/content", () => ({
  getAllPosts: vi.fn().mockResolvedValue([
    { slug: "welcome", title: "Welcome", date: "2026-04-26", summary: "x", tags: [], body: "" },
  ]),
  getAllProjects: vi.fn().mockResolvedValue([
    { slug: "my-prologue", title: "My Prologue", date: "2026-04-26", summary: "x", status: "wip", links: {}, tech: [], body: "Project body here" },
  ]),
  getProjectBySlug: vi.fn().mockImplementation(async (slug: string) =>
    slug === "my-prologue"
      ? { slug, title: "My Prologue", date: "2026-04-26", summary: "x", status: "wip", links: {}, tech: [], body: "Project body here" }
      : null,
  ),
}));

import * as nav from "next/navigation";
import * as content from "../../../lib/content";
import ProjectPost, { generateStaticParams } from "./page";

describe("ProjectPost", () => {
  it("renders the project title and the MDX body", async () => {
    const result = await ProjectPost({ params: Promise.resolve({ slug: "my-prologue" }) });
    render(result);
    expect(screen.getByRole("heading", { name: "My Prologue" })).toBeInTheDocument();
    expect(screen.getByTestId("mdx").textContent).toBe("Project body here");
  });

  it("calls notFound for an unknown slug", async () => {
    await expect(ProjectPost({ params: Promise.resolve({ slug: "missing" }) })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(nav.notFound).toHaveBeenCalled();
  });

  it("generateStaticParams returns slug for each project", async () => {
    const params = await generateStaticParams();
    expect(params).toEqual([{ slug: "my-prologue" }]);
  });

  it("renders the sidebar", async () => {
    const result = await ProjectPost({ params: Promise.resolve({ slug: "my-prologue" }) });
    render(result);
    expect(screen.getByText("MY PROLOGUE")).toBeInTheDocument();
  });

  it("fetches posts and projects for the sidebar", async () => {
    await ProjectPost({ params: Promise.resolve({ slug: "my-prologue" }) });
    expect(content.getAllPosts).toHaveBeenCalled();
    expect(content.getAllProjects).toHaveBeenCalled();
  });
});
