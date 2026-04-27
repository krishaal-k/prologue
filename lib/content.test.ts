import { describe, it, expect } from "vitest";
import { promises as fs } from "node:fs";
import path from "node:path";
import { getAllPosts, getPostBySlug, getAllProjects, getProjectBySlug } from "./content";

describe("getAllPosts", () => {
  it("returns the seed welcome post with parsed frontmatter", async () => {
    const posts = await getAllPosts();
    const welcome = posts.find((p) => p.slug === "welcome");

    expect(welcome).toBeDefined();
    expect(welcome?.title).toBe("Welcome to My Prologue");
    expect(welcome?.summary).toMatch(/building in public/i);
    expect(welcome?.tags).toEqual(["meta", "intro"]);
    expect(welcome?.body).toMatch(/non-technical project manager/i);
  });

  it("returns posts sorted newest first by date", async () => {
    const posts = await getAllPosts();
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].date >= posts[i].date).toBe(true);
    }
  });
});

describe("getPostBySlug", () => {
  it("returns the matching post when slug exists", async () => {
    const post = await getPostBySlug("welcome");
    expect(post).not.toBeNull();
    expect(post?.title).toBe("Welcome to My Prologue");
  });

  it("returns null when slug does not exist", async () => {
    const post = await getPostBySlug("nonexistent-slug");
    expect(post).toBeNull();
  });
});

describe("getAllProjects", () => {
  it("returns the seed my-prologue project with parsed frontmatter", async () => {
    const projects = await getAllProjects();
    const me = projects.find((p) => p.slug === "my-prologue");

    expect(me).toBeDefined();
    expect(me?.title).toBe("My Prologue");
    expect(me?.status).toBe("wip");
    expect(me?.links?.github).toMatch(/^https?:\/\//);
    expect(me?.tech).toContain("next");
  });
});

describe("getProjectBySlug", () => {
  it("returns null when slug does not exist", async () => {
    const project = await getProjectBySlug("nope");
    expect(project).toBeNull();
  });
});

describe("malformed frontmatter", () => {
  const broken = path.join(process.cwd(), "content", "blogs", "__broken__.mdx");

  afterAll(async () => {
    await fs.unlink(broken).catch(() => {});
  });

  it("throws an error including the offending filename", async () => {
    await fs.writeFile(broken, "---\nthis is: : invalid yaml: : \n---\nbody\n", "utf8");
    await expect(getAllPosts()).rejects.toThrow(/__broken__\.mdx/);
  });
});
