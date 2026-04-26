import { describe, it, expect } from "vitest";
import { getAllPosts, getPostBySlug } from "./content";

describe("getAllPosts", () => {
  it("returns the seed welcome post with parsed frontmatter", async () => {
    const posts = await getAllPosts();
    const welcome = posts.find((p) => p.slug === "welcome");

    expect(welcome).toBeDefined();
    expect(welcome?.title).toBe("Welcome to My Prologue");
    expect(welcome?.summary).toMatch(/building in public/i);
    expect(welcome?.tags).toEqual(["meta", "intro"]);
    expect(welcome?.body).toMatch(/first post on My Prologue/i);
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
