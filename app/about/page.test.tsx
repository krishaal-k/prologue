import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({ usePathname: () => "/about" }));
vi.mock("../../lib/content", () => ({
  getAllPosts: vi.fn().mockResolvedValue([]),
  getAllProjects: vi.fn().mockResolvedValue([]),
}));

import * as content from "../../lib/content";
import AboutPage from "./page";

describe("AboutPage", () => {
  it("renders the heading and 'more soon' placeholder", async () => {
    render(await AboutPage());
    expect(screen.getByRole("heading", { name: /^About$/i })).toBeInTheDocument();
    expect(screen.getByText(/more soon/i)).toBeInTheDocument();
  });

  it("renders the sidebar with fetched data", async () => {
    render(await AboutPage());
    expect(screen.getByText("MY PROLOGUE")).toBeInTheDocument();
    expect(content.getAllPosts).toHaveBeenCalled();
    expect(content.getAllProjects).toHaveBeenCalled();
  });
});
