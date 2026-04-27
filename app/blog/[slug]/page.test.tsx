import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  usePathname: () => "/blog/welcome",
  notFound: vi.fn(() => { throw new Error("NEXT_NOT_FOUND"); }),
}));
vi.mock("next-mdx-remote/rsc", () => ({
  MDXRemote: ({ source }: { source: string }) => <div data-testid="mdx">{source}</div>,
}));
vi.mock("../../../lib/content", () => ({
  getAllPosts: vi.fn().mockResolvedValue([
    { slug: "welcome", title: "Welcome to My Prologue", date: "2026-04-26", summary: "x", tags: [], body: "Body content here" },
  ]),
  getAllProjects: vi.fn().mockResolvedValue([
    { slug: "my-prologue", title: "My Prologue", date: "2026-04-26", summary: "x", status: "wip", links: {}, tech: [], body: "" },
  ]),
  getPostBySlug: vi.fn().mockImplementation(async (slug: string) =>
    slug === "welcome"
      ? { slug, title: "Welcome to My Prologue", date: "2026-04-26", summary: "x", tags: [], body: "Body content here" }
      : null,
  ),
}));

import * as nav from "next/navigation";
import * as content from "../../../lib/content";
import BlogPost, { generateStaticParams } from "./page";

describe("BlogPost", () => {
  it("renders the post title and the MDX body", async () => {
    const result = await BlogPost({ params: Promise.resolve({ slug: "welcome" }) });
    render(result);
    expect(screen.getByRole("heading", { name: "Welcome to My Prologue" })).toBeInTheDocument();
    expect(screen.getByTestId("mdx").textContent).toBe("Body content here");
  });

  it("renders the publish date in long format below the title", async () => {
    const result = await BlogPost({ params: Promise.resolve({ slug: "welcome" }) });
    render(result);
    const time = screen.getByText("26 April 2026");
    expect(time.tagName).toBe("TIME");
    expect(time).toHaveAttribute("datetime", "2026-04-26");
  });

  it("calls notFound for an unknown slug", async () => {
    await expect(BlogPost({ params: Promise.resolve({ slug: "missing" }) })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(nav.notFound).toHaveBeenCalled();
  });

  it("generateStaticParams returns slug for each post", async () => {
    const params = await generateStaticParams();
    expect(params).toEqual([{ slug: "welcome" }]);
  });

  it("renders sidebar navigation", async () => {
    const result = await BlogPost({ params: Promise.resolve({ slug: "welcome" }) });
    render(result);
    expect(screen.getByText("MY PROLOGUE")).toBeInTheDocument();
  });

  it("fetches projects for the sidebar", async () => {
    await BlogPost({ params: Promise.resolve({ slug: "welcome" }) });
    expect(content.getAllProjects).toHaveBeenCalled();
  });
});
