import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/home",
}));

import { Sidebar } from "./sidebar";

const blogs = [
  { slug: "welcome", title: "Welcome to My Prologue", date: "2026-04-26" },
  { slug: "second", title: "Second Post", date: "2026-04-19" },
];
const projects = [
  { slug: "my-prologue", title: "My Prologue", date: "2026-04-26" },
];

describe("Sidebar", () => {
  it("renders brand wordmark linking to /home", () => {
    render(<Sidebar blogs={blogs} projects={projects} />);
    const brand = screen.getByRole("link", { name: /my prologue/i });
    expect(brand).toHaveAttribute("href", "/home");
  });

  it("does not show blog entries before the user expands Blogs", () => {
    render(<Sidebar blogs={blogs} projects={projects} />);
    expect(screen.queryByText("Welcome to My Prologue")).not.toBeInTheDocument();
  });

  it("expands Blogs cascade on click and shows up to 10 entries", async () => {
    const user = userEvent.setup();
    render(<Sidebar blogs={blogs} projects={projects} />);
    await user.click(screen.getByRole("button", { name: /^Blogs/i }));
    expect(screen.getByText("Welcome to My Prologue")).toBeInTheDocument();
    expect(screen.getByText("Second Post")).toBeInTheDocument();
  });

  it("collapses cascade on second click of the same parent", async () => {
    const user = userEvent.setup();
    render(<Sidebar blogs={blogs} projects={projects} />);
    const blogsBtn = screen.getByRole("button", { name: /^Blogs/i });
    await user.click(blogsBtn);
    await user.click(blogsBtn);
    expect(screen.queryByText("Welcome to My Prologue")).not.toBeInTheDocument();
  });

  it("allows Blogs and Projects to be open simultaneously", async () => {
    const user = userEvent.setup();
    render(<Sidebar blogs={blogs} projects={projects} />);
    await user.click(screen.getByRole("button", { name: /^Blogs/i }));
    await user.click(screen.getByRole("button", { name: /^Projects/i }));
    expect(screen.getByText("Welcome to My Prologue")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "My Prologue" })).toHaveAttribute(
      "href",
      "/projects/my-prologue",
    );
  });

  it("links cascade entries to their slug pages", async () => {
    const user = userEvent.setup();
    render(<Sidebar blogs={blogs} projects={projects} />);
    await user.click(screen.getByRole("button", { name: /^Blogs/i }));
    expect(screen.getByRole("link", { name: "Welcome to My Prologue" })).toHaveAttribute(
      "href",
      "/blog/welcome",
    );
  });

  it("includes a link to /about with no cascade", () => {
    render(<Sidebar blogs={blogs} projects={projects} />);
    expect(screen.getByRole("link", { name: /^About$/i })).toHaveAttribute("href", "/about");
  });
});
