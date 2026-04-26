# Website Foundation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the foundation of the public site — cinematic looped-video landing, main page with sidebar nav + mission + recent posts, MDX-in-repo blog and project listings, About skeleton — per `docs/superpowers/specs/2026-04-26-website-foundation-design.md`.

**Architecture:** Next.js 16 App Router. File-system MDX in `content/`, parsed at build time with `gray-matter`, rendered server-side with `next-mdx-remote/rsc`. Cherry & Candlelight palette via Tailwind v4 `@theme` block. Cinematic landing video with CSS-mask edge feathering and a `prefers-reduced-motion` poster fallback. TDD-Guard gates the Vitest loop; visual components are produced via `compound-engineering:ce-frontend-design` to avoid generic-AI aesthetic drift; current framework patterns are pulled fresh via `context7` and `node_modules/next/dist/docs/` before code is written.

**Tech Stack:** Next.js 16.2.4, React 19.2.4, TypeScript 5, Tailwind CSS v4, `gray-matter`, `next-mdx-remote`, Vitest 4 + jsdom + RTL (TDD-Guard reporter), Playwright 1.59. Skills/MCPs: `compound-engineering:ce-frontend-design`, `context7` MCP, `serena` MCP (refactor only).

---

## Pre-execution setup

Before Task 0:

1. **Worktree.** This plan runs in its own branch (and ideally its own git worktree). From the project root:
   ```bash
   git checkout main && git pull
   git checkout -b feat/website-foundation
   ```
   (Or use `superpowers:using-git-worktrees` to create an isolated worktree.)

2. **Dev server, test runner, and TDD-Guard.** Open three terminals:
   - `pnpm dev` — keeps the app reloadable for manual checks.
   - `pnpm test` — Vitest in watch mode, gated by TDD-Guard.
   - A shell for git/install commands.

---

## Task 0: Pull current framework docs

**Why:** `AGENTS.md` mandates reading `node_modules/next/dist/docs/` before writing Next.js-specific code; training data is stale relative to Next 16 / React 19 / Tailwind v4 / `next-mdx-remote`. Skipping this is the most common source of plan drift.

**Files:** none modified — read-only research.

- [ ] **Step 1: Read local Next.js 16 App Router docs**

  Read these in order, ~5 min each:
  - `node_modules/next/dist/docs/01-app/01-getting-started/index.md`
  - `node_modules/next/dist/docs/01-app/01-getting-started/05-fonts.md`
  - `node_modules/next/dist/docs/01-app/02-guides/mdx.md`
  - `node_modules/next/dist/docs/01-app/03-api-reference/02-file-conventions/page.md`
  - `node_modules/next/dist/docs/01-app/03-api-reference/02-file-conventions/dynamic-routes.md`

  *(Adjust file paths if the doc tree shifted between Next versions; a `find node_modules/next/dist/docs -name '*mdx*'` confirms the right file.)*

- [ ] **Step 2: Pull `next-mdx-remote/rsc` docs via context7**

  Use the `context7` MCP:
  ```
  mcp__context7__resolve-library-id query="next-mdx-remote"
  mcp__context7__query-docs library-id="<resolved-id>" topic="rsc usage with App Router and frontmatter"
  ```

  Confirm: the API for compiling MDX server-side in Next 16 RSC, the import path (`next-mdx-remote/rsc`), and the `compileMDX` / `MDXRemote` shape.

- [ ] **Step 3: Pull Tailwind v4 `@theme` docs via context7**

  ```
  mcp__context7__resolve-library-id query="tailwindcss"
  mcp__context7__query-docs library-id="<resolved-id>" topic="theme block CSS variables custom colors fonts"
  ```

  Confirm: `@theme` block syntax for v4 (NOT `tailwind.config.js`), how `--color-*` and `--font-*` tokens become utility classes (e.g., `--color-bg` → `bg-bg`).

- [ ] **Step 4: Pull `gray-matter` API surface via context7**

  ```
  mcp__context7__resolve-library-id query="gray-matter"
  mcp__context7__query-docs library-id="<resolved-id>" topic="parse frontmatter content"
  ```

  Confirm: the default-export shape — `matter(rawString) → { data, content }` — and TypeScript types if any.

- [ ] **Step 5: No commit (research only)**

  This task produces no code. Capture any version-specific surprises in a scratchpad to refer back to during later tasks.

---

## Task 1: Replace globals.css palette + add Fraunces font

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

**TDD note:** Pure styling/config — no unit test. The smoke test is "the dev server boots and the page renders dark with the new tokens" (manual). Phase 6 e2e covers regressions.

- [ ] **Step 1: Rewrite `app/globals.css` with Cherry & Candlelight palette**

  ```css
  @import "tailwindcss";

  @theme {
    --color-bg: #16100e;
    --color-surface: #221412;
    --color-border: #3a1f1a;
    --color-cherry: #a4593a;
    --color-accent: #e3a44a;
    --color-paper: #f4e2c7;
    --color-muted: #b8a98a;
  }

  @theme inline {
    --font-sans: var(--font-geist-sans);
    --font-serif: var(--font-fraunces);
    --font-mono: var(--font-geist-mono);
  }

  html,
  body {
    background: var(--color-bg);
    color: var(--color-paper);
    font-family: var(--font-sans), system-ui, sans-serif;
  }
  ```

  Note: bare `@theme` is used for static color hex values; `@theme inline` is used for the font tokens because they reference `var(--font-*)` CSS variables that `next/font` injects on `<html>`. Per Tailwind v4 docs, mixing scopes without `inline` produces resolution surprises. The previous `:root` light/dark variables and `prefers-color-scheme` block are removed — site is always dark.

- [ ] **Step 2: Add Fraunces to `app/layout.tsx`**

  Replace the contents of `app/layout.tsx` with:
  ```tsx
  import type { Metadata } from "next";
  import { Geist, Geist_Mono, Fraunces } from "next/font/google";
  import "./globals.css";

  const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
  });

  const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
  });

  const fraunces = Fraunces({
    variable: "--font-fraunces",
    subsets: ["latin"],
  });

  export const metadata: Metadata = {
    title: "My Prologue",
    description: "Building in public — a portfolio in motion.",
  };

  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-bg text-paper">
          {children}
        </body>
      </html>
    );
  }
  ```

- [ ] **Step 3: Replace scaffolded `app/page.tsx` with a placeholder**

  Until Task 13 builds the real landing, give `/` a one-line placeholder so the dev server doesn't show the create-next-app boilerplate while the rest of the build is in progress:
  ```tsx
  export default function Home() {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted text-sm tracking-[0.32em] uppercase">My Prologue · scaffolding</p>
      </main>
    );
  }
  ```

- [ ] **Step 4: Verify**

  ```bash
  pnpm dev
  ```
  Open `http://localhost:3000`. Expected: dark `#16100e` page, "MY PROLOGUE · SCAFFOLDING" centered in muted cream. No light flash, no scaffold logo.

- [ ] **Step 5: Commit**

  ```bash
  git add app/globals.css app/layout.tsx app/page.tsx
  git commit -m "feat(theme): apply cherry & candlelight palette + add fraunces font"
  ```

---

## Task 2: Install content pipeline deps

**Files:**
- Modify: `package.json`, `pnpm-lock.yaml`

- [ ] **Step 1: Install `gray-matter` and `next-mdx-remote`**

  ```bash
  pnpm add gray-matter next-mdx-remote
  ```

- [ ] **Step 2: Verify install + types**

  ```bash
  pnpm tsc --noEmit
  ```
  Expected: no type errors. (`gray-matter` ships its own types; `next-mdx-remote` ships ESM with TS support.)

- [ ] **Step 3: Commit**

  ```bash
  git add package.json pnpm-lock.yaml
  git commit -m "chore(deps): add gray-matter and next-mdx-remote for content pipeline"
  ```

---

## Task 3: Add seed content

**Why:** `lib/content.ts` tests need real fixtures. Committing seed content first means the loader tests can read actual files instead of mocking the filesystem (faster, more honest).

**Files:**
- Create: `content/blogs/welcome.mdx`
- Create: `content/projects/my-prologue.mdx`

- [ ] **Step 1: Create `content/blogs/welcome.mdx`**

  ```mdx
  ---
  title: "Welcome to My Prologue"
  date: 2026-04-26
  summary: "Why I'm building in public, and what I expect to learn doing it."
  tags: ["meta", "intro"]
  ---

  This is the first post on My Prologue. I'm a PM with seven years in IT
  and zero years writing code, and I'm using AI as my execution layer to
  see how far one person can go when the friction of "I don't know this
  yet" disappears.

  More soon.
  ```

  *(No inner `# Heading`. The page template renders the title from frontmatter; an inline H1 would duplicate it.)*

- [ ] **Step 2: Create `content/projects/my-prologue.mdx`**

  ```mdx
  ---
  title: "My Prologue"
  date: 2026-04-26
  summary: "The site you're reading right now — built end-to-end with AI."
  status: "wip"
  links:
    github: "https://github.com/ChocoDogg0/prologue"
  tech: ["next", "react", "tailwind", "claude-code", "mdx"]
  ---

  This site is the foundation. Cinematic landing, sidebar nav, MDX-driven
  blog and projects. Built one task at a time, with a real plan and real
  tests, while learning the tools.

  Status: `wip` — see [the spec](https://github.com/ChocoDogg0/prologue/blob/main/docs/superpowers/specs/2026-04-26-website-foundation-design.md).
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add content/
  git commit -m "feat(content): add seed blog post and project entry"
  ```

---

## Task 4: TDD `getAllPosts`

**Files:**
- Create: `lib/content.ts`
- Create: `lib/content.test.ts`

- [ ] **Step 1: Write the failing test**

  Create `lib/content.test.ts`:
  ```ts
  import { describe, it, expect } from "vitest";
  import { getAllPosts } from "./content";

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
  ```

- [ ] **Step 2: Run the test, confirm it fails**

  ```bash
  pnpm test:run lib/content.test.ts
  ```
  Expected: FAIL — `Cannot find module './content'`.

- [ ] **Step 3: Implement `getAllPosts` minimally**

  Create `lib/content.ts`:
  ```ts
  import "server-only";
  import { promises as fs } from "node:fs";
  import path from "node:path";
  import matter from "gray-matter";

  export type Post = {
    slug: string;
    title: string;
    date: string;
    summary: string;
    tags: string[];
    cover?: string;
    body: string;
  };

  const BLOGS_DIR = path.join(process.cwd(), "content", "blogs");

  export async function getAllPosts(): Promise<Post[]> {
    const files = await fs.readdir(BLOGS_DIR);
    const posts = await Promise.all(
      files
        .filter((f) => f.endsWith(".mdx"))
        .map(async (file): Promise<Post> => {
          const raw = await fs.readFile(path.join(BLOGS_DIR, file), "utf8");
          const { data, content } = matter(raw);
          return {
            slug: file.replace(/\.mdx$/, ""),
            title: String(data.title),
            date: String(data.date),
            summary: String(data.summary),
            tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
            cover: typeof data.cover === "string" ? data.cover : undefined,
            body: content,
          };
        }),
    );
    return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  }
  ```

- [ ] **Step 4: Run the test, confirm it passes**

  ```bash
  pnpm test:run lib/content.test.ts
  ```
  Expected: PASS — both `it` blocks green.

- [ ] **Step 5: Commit**

  ```bash
  git add lib/content.ts lib/content.test.ts
  git commit -m "feat(content): add getAllPosts loader with TDD"
  ```

---

## Task 5: TDD `getPostBySlug`

**Files:**
- Modify: `lib/content.ts`, `lib/content.test.ts`

- [ ] **Step 1: Add the failing test**

  Append to `lib/content.test.ts`:
  ```ts
  import { getPostBySlug } from "./content";

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
  ```

- [ ] **Step 2: Run, confirm failure**

  ```bash
  pnpm test:run lib/content.test.ts
  ```
  Expected: FAIL — `getPostBySlug is not exported`.

- [ ] **Step 3: Implement `getPostBySlug`**

  Append to `lib/content.ts`:
  ```ts
  export async function getPostBySlug(slug: string): Promise<Post | null> {
    const all = await getAllPosts();
    return all.find((p) => p.slug === slug) ?? null;
  }
  ```

- [ ] **Step 4: Run, confirm pass**

  ```bash
  pnpm test:run lib/content.test.ts
  ```
  Expected: PASS — all four tests green.

- [ ] **Step 5: Commit**

  ```bash
  git add lib/content.ts lib/content.test.ts
  git commit -m "feat(content): add getPostBySlug"
  ```

---

## Task 6: TDD `getAllProjects` + `getProjectBySlug`

**Files:**
- Modify: `lib/content.ts`, `lib/content.test.ts`

- [ ] **Step 1: Add the failing tests**

  Append to `lib/content.test.ts`:
  ```ts
  import { getAllProjects, getProjectBySlug } from "./content";

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
  ```

- [ ] **Step 2: Run, confirm failure**

  ```bash
  pnpm test:run lib/content.test.ts
  ```
  Expected: FAIL — `getAllProjects is not exported`.

- [ ] **Step 3: Implement both functions**

  Append to `lib/content.ts`:
  ```ts
  export type Project = {
    slug: string;
    title: string;
    date: string;
    summary: string;
    status: "live" | "wip" | "archived";
    links: { github?: string; live?: string; writeup?: string };
    tech: string[];
    cover?: string;
    body: string;
  };

  const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

  export async function getAllProjects(): Promise<Project[]> {
    const files = await fs.readdir(PROJECTS_DIR);
    const projects = await Promise.all(
      files
        .filter((f) => f.endsWith(".mdx"))
        .map(async (file): Promise<Project> => {
          const raw = await fs.readFile(path.join(PROJECTS_DIR, file), "utf8");
          const { data, content } = matter(raw);
          const status = data.status === "live" || data.status === "archived" ? data.status : "wip";
          return {
            slug: file.replace(/\.mdx$/, ""),
            title: String(data.title),
            date: String(data.date),
            summary: String(data.summary),
            status,
            links: typeof data.links === "object" && data.links !== null ? data.links : {},
            tech: Array.isArray(data.tech) ? data.tech.map(String) : [],
            cover: typeof data.cover === "string" ? data.cover : undefined,
            body: content,
          };
        }),
    );
    return projects.sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  export async function getProjectBySlug(slug: string): Promise<Project | null> {
    const all = await getAllProjects();
    return all.find((p) => p.slug === slug) ?? null;
  }
  ```

- [ ] **Step 4: Run, confirm pass**

  ```bash
  pnpm test:run lib/content.test.ts
  ```
  Expected: PASS — six tests green.

- [ ] **Step 5: Commit**

  ```bash
  git add lib/content.ts lib/content.test.ts
  git commit -m "feat(content): add getAllProjects and getProjectBySlug"
  ```

---

## Task 7: TDD malformed-frontmatter error

**Files:**
- Modify: `lib/content.ts`, `lib/content.test.ts`

**Why:** A typo in frontmatter should fail loud at build time, not silently produce a broken post. This task adds the friendly-error contract.

- [ ] **Step 1: Add the failing test**

  Append to `lib/content.test.ts`:
  ```ts
  import { promises as fs } from "node:fs";
  import path from "node:path";

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
  ```

  *(`afterAll` is from Vitest globals — already enabled in `vitest.config.ts`.)*

- [ ] **Step 2: Run, confirm failure**

  ```bash
  pnpm test:run lib/content.test.ts
  ```
  Expected: FAIL — current loader either swallows the error or rejects with a less-useful message that doesn't include the filename.

- [ ] **Step 3: Wrap the parse in a per-file try/catch**

  In `lib/content.ts`, replace the inner `map` body for *both* `getAllPosts` and `getAllProjects` with a try/catch that re-throws with file context. The `getAllPosts` version becomes:
  ```ts
  files
    .filter((f) => f.endsWith(".mdx"))
    .map(async (file): Promise<Post> => {
      const fullPath = path.join(BLOGS_DIR, file);
      const raw = await fs.readFile(fullPath, "utf8");
      let parsed;
      try {
        parsed = matter(raw);
      } catch (err) {
        throw new Error(`Failed to parse frontmatter in ${file}: ${(err as Error).message}`);
      }
      const { data, content } = parsed;
      return {
        slug: file.replace(/\.mdx$/, ""),
        title: String(data.title),
        date: String(data.date),
        summary: String(data.summary),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        cover: typeof data.cover === "string" ? data.cover : undefined,
        body: content,
      };
    })
  ```
  Apply the same try/catch to `getAllProjects`.

- [ ] **Step 4: Run, confirm pass**

  ```bash
  pnpm test:run lib/content.test.ts
  ```
  Expected: PASS — all seven tests green.

- [ ] **Step 5: Commit**

  ```bash
  git add lib/content.ts lib/content.test.ts
  git commit -m "feat(content): throw with file context on malformed frontmatter"
  ```

---

## Task 8: TDD `usePrefersReducedMotion` hook

**Files:**
- Create: `hooks/use-prefers-reduced-motion.ts`
- Create: `hooks/use-prefers-reduced-motion.test.tsx`

- [ ] **Step 1: Write the failing test**

  Create `hooks/use-prefers-reduced-motion.test.tsx`:
  ```tsx
  import { describe, it, expect, vi, beforeEach } from "vitest";
  import { renderHook } from "@testing-library/react";
  import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

  function mockMatchMedia(matches: boolean) {
    const listeners: Array<(e: { matches: boolean }) => void> = [];
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches,
      media: "(prefers-reduced-motion: reduce)",
      addEventListener: (_: string, fn: (e: { matches: boolean }) => void) => listeners.push(fn),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    return { fire: (next: boolean) => listeners.forEach((l) => l({ matches: next })) };
  }

  describe("usePrefersReducedMotion", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("returns true when the user prefers reduced motion", () => {
      mockMatchMedia(true);
      const { result } = renderHook(() => usePrefersReducedMotion());
      expect(result.current).toBe(true);
    });

    it("returns false when the user does not prefer reduced motion", () => {
      mockMatchMedia(false);
      const { result } = renderHook(() => usePrefersReducedMotion());
      expect(result.current).toBe(false);
    });
  });
  ```

- [ ] **Step 2: Run, confirm failure**

  ```bash
  pnpm test:run hooks/use-prefers-reduced-motion.test.tsx
  ```
  Expected: FAIL — module not found.

- [ ] **Step 3: Implement the hook**

  Create `hooks/use-prefers-reduced-motion.ts`:
  ```ts
  "use client";
  import { useEffect, useState } from "react";

  export function usePrefersReducedMotion(): boolean {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReduced(mq.matches);
      const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }, []);

    return reduced;
  }
  ```

- [ ] **Step 4: Run, confirm pass**

  ```bash
  pnpm test:run hooks/use-prefers-reduced-motion.test.tsx
  ```
  Expected: PASS — both tests green.

- [ ] **Step 5: Commit**

  ```bash
  git add hooks/
  git commit -m "feat(hooks): add usePrefersReducedMotion"
  ```

---

## Task 9: Build `post-card` and `project-card` (with `ce-frontend-design`)

**Files:**
- Create: `components/content/post-card.tsx`, `components/content/post-card.test.tsx`
- Create: `components/content/project-card.tsx`, `components/content/project-card.test.tsx`

**Build approach:** Behavior tests come first (TDD-Guard). Then invoke `compound-engineering:ce-frontend-design` with the test as the contract and the spec's palette/typography as the brief, so the component lands visually polished — not free-handed JSX.

- [ ] **Step 1: Write `post-card.test.tsx` (failing)**

  ```tsx
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
  ```

- [ ] **Step 2: Run, confirm failure**

  ```bash
  pnpm test:run components/content/post-card.test.tsx
  ```
  Expected: FAIL — module not found.

- [ ] **Step 3: Invoke `ce-frontend-design` to build `post-card.tsx`**

  Use the Skill tool:
  ```
  Skill: compound-engineering:ce-frontend-design
  Args: |
    Build components/content/post-card.tsx, a Server Component.
    Props: { post: Post } where Post = the type exported from lib/content.ts.
    Behavior contract from components/content/post-card.test.tsx (read first):
      - Renders title (Fraunces serif, larger weight)
      - Renders summary (sans, paper text, 1-2 lines)
      - Renders formatted date (e.g., "26 April 2026") — use Intl.DateTimeFormat
      - Renders tags as small accent-tinted pills, omits the row entirely if tags is empty
      - Wraps the whole card in a Link href={`/blog/${post.slug}`}
    Visual brief: Cherry & Candlelight palette (bg-bg, surface bg-surface,
    border border-border, accent text-accent, paper text text-paper,
    muted text-muted). Card has subtle border, gentle hover state (border
    brightens to accent, slight translate-y), generous padding. Avoid
    generic AI-card look — this is a fireside, paper-like aesthetic.
    Optional cover image, when present, sits above the title with a subtle
    inner border.
    After producing the file, run `pnpm test:run components/content/post-card.test.tsx`
    and confirm green before returning.
  ```

- [ ] **Step 4: Verify**

  ```bash
  pnpm test:run components/content/post-card.test.tsx
  ```
  Expected: PASS — all four tests green.

- [ ] **Step 5: Repeat for `project-card`**

  Write `components/content/project-card.test.tsx`:
  ```tsx
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
  ```

  Run, confirm failure, then invoke `ce-frontend-design` again with an analogous brief — same palette, same hover behavior, plus: a small status pill in the top-right corner styled per state (`live` = solid accent on dark, `wip` = outlined accent, `archived` = muted/faded). Optional `links.github`/`links.live` show as small icon-buttons in the card footer.

  Run `pnpm test:run components/content/project-card.test.tsx` until green.

- [ ] **Step 6: Commit**

  ```bash
  git add components/content/
  git commit -m "feat(components): add post-card and project-card with TDD + ce-frontend-design"
  ```

---

## Task 10: Build `sidebar` + `nav-item` + `cascade-list` (with `ce-frontend-design`)

**Files:**
- Create: `components/shell/sidebar.tsx`, `components/shell/sidebar.test.tsx`
- Create: `components/shell/nav-item.tsx`
- Create: `components/shell/cascade-list.tsx`

- [ ] **Step 1: Write the failing interaction tests**

  Create `components/shell/sidebar.test.tsx`:
  ```tsx
  import { render, screen } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import { describe, it, expect } from "vitest";
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
      expect(screen.getByText("My Prologue")).toBeInTheDocument();
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
  ```

- [ ] **Step 2: Run, confirm failure**

  ```bash
  pnpm test:run components/shell/sidebar.test.tsx
  ```
  Expected: FAIL — `Sidebar` not exported.

- [ ] **Step 3: Invoke `ce-frontend-design` to build the three components**

  ```
  Skill: compound-engineering:ce-frontend-design
  Args: |
    Build three components in components/shell/ as a unit:
      - sidebar.tsx (client component — uses useState for cascade open/close)
      - nav-item.tsx (one nav row — either a link OR a cascade trigger button)
      - cascade-list.tsx (the inline-expanded sub-list rendered when a nav-item with children is open)

    Sidebar props: { blogs: Array<{slug,title,date}>, projects: Array<{slug,title,date}> }.

    Behavior contract from components/shell/sidebar.test.tsx (read first).

    Layout: fixed-width left column (~220px on desktop), bg-surface, border-r border-border,
    full viewport height, scrollable. Brand wordmark at top: tracked-uppercase sans
    "MY PROLOGUE", links to /home. Below the brand: nav items in this order — Blogs,
    Projects, About. Blogs and Projects are cascade triggers (button role); About is a
    plain link. Active route highlighted with a 2px accent-color left border + subtle
    accent-tinted background.

    Cascade open/close: useState managed in Sidebar, passed to each nav-item. Multiple
    cascades can be open simultaneously. Animation: subtle height transition (CSS
    only, no framer-motion). Cascade entries are indented, smaller text, link color
    = muted, hover = paper. Show up to 10 entries newest-first; if more than 10
    entries, append a "View all →" link at the bottom of the cascade pointing to
    /blog or /projects respectively.

    Visual brief: Cherry & Candlelight palette. Quiet, paper-and-wood feel. The
    sidebar is the structural element of the site, not loud — accent only on
    active state and on hover.

    After producing the files, run `pnpm test:run components/shell/sidebar.test.tsx`
    and confirm all seven tests green before returning.
  ```

- [ ] **Step 4: Verify**

  ```bash
  pnpm test:run components/shell/sidebar.test.tsx
  ```
  Expected: PASS — all seven tests green.

- [ ] **Step 5: Commit**

  ```bash
  git add components/shell/
  git commit -m "feat(shell): add sidebar + nav-item + cascade-list with TDD + ce-frontend-design"
  ```

---

## Task 11: Build `landing-video` and `landing-overlay` (with `ce-frontend-design`)

**Files:**
- Create: `components/landing/landing-video.tsx`, `components/landing/landing-video.test.tsx`
- Create: `components/landing/landing-overlay.tsx`

- [ ] **Step 1: Write the failing test**

  Create `components/landing/landing-video.test.tsx`:
  ```tsx
  import { render, screen } from "@testing-library/react";
  import { describe, it, expect, vi } from "vitest";
  import { LandingVideo } from "./landing-video";

  vi.mock("../../hooks/use-prefers-reduced-motion", () => ({
    usePrefersReducedMotion: vi.fn(),
  }));
  import { usePrefersReducedMotion } from "../../hooks/use-prefers-reduced-motion";

  describe("LandingVideo", () => {
    it("renders a <video> with autoplay/muted/loop/playsinline when motion is OK", () => {
      vi.mocked(usePrefersReducedMotion).mockReturnValue(false);
      const { container } = render(<LandingVideo />);
      const video = container.querySelector("video");
      expect(video).toBeInTheDocument();
      expect(video).toHaveAttribute("autoplay");
      expect(video).toHaveAttribute("loop");
      expect(video).toHaveAttribute("playsinline");
      expect(video?.muted).toBe(true);
    });

    it("renders an <img> poster fallback (no <video>) when reduced-motion is preferred", () => {
      vi.mocked(usePrefersReducedMotion).mockReturnValue(true);
      const { container } = render(<LandingVideo />);
      expect(container.querySelector("video")).not.toBeInTheDocument();
      const img = screen.getByAltText(/pug/i);
      expect(img).toBeInTheDocument();
      expect(img.tagName).toBe("IMG");
    });
  });
  ```

- [ ] **Step 2: Run, confirm failure**

  ```bash
  pnpm test:run components/landing/landing-video.test.tsx
  ```
  Expected: FAIL — module not found.

- [ ] **Step 3: Invoke `ce-frontend-design` to build both landing components**

  ```
  Skill: compound-engineering:ce-frontend-design
  Args: |
    Build two components in components/landing/:
      - landing-video.tsx (client component — uses usePrefersReducedMotion).
        Renders <video src="/landing/pug-window.mp4" poster="/landing/poster.jpg"
        autoPlay muted loop playsInline preload="metadata"
        aria-label="A pug looking out a window at the rain" />
        UNLESS the hook reports reduced-motion preference, in which case it
        renders <img src="/landing/poster.jpg" alt="A pug looking out a window
        at the rain" />.
        Both elements must have the edge-feathering CSS mask applied:
          mask-image: radial-gradient(ellipse 80% 78% at 50% 50%, black 55%, transparent 100%);
          -webkit-mask-image: same;
        Position: absolute inset-0, object-fit: cover.
      - landing-overlay.tsx (Server Component fine — no state).
        Two pieces of text positioned absolutely:
          Top-left, 24px in from edges: "MY PROLOGUE" in tracked-uppercase
          sans, small (~12-13px), letter-spacing ~0.32em, color text-paper.
          Bottom-right, 24px in from edges: "click anywhere to enter →" in
          tracked-uppercase, even smaller (~11px), color text-muted.

    Behavior contract from components/landing/landing-video.test.tsx (read first).

    Visual brief: cinematic, full-bleed. The page background (bg-bg) shows
    through the feathered edges of the video so the room "blends into the
    cabin." Text overlays must remain legible against the moody video — no
    extra darkening overlay needed; rely on the video's own contrast.

    After producing the files, run `pnpm test:run components/landing/landing-video.test.tsx`
    and confirm both tests green before returning.
  ```

- [ ] **Step 4: Verify**

  ```bash
  pnpm test:run components/landing/landing-video.test.tsx
  ```
  Expected: PASS — both tests green.

- [ ] **Step 5: Commit**

  ```bash
  git add components/landing/
  git commit -m "feat(landing): add landing-video + landing-overlay with TDD + ce-frontend-design"
  ```

---

## Task 12: Build `mdx-content` wrapper

**Files:**
- Create: `components/content/mdx-content.tsx`

**Why:** All MDX rendering goes through one component so palette typography, code-block styling, prose width, etc., stay consistent across blog posts and project bodies.

**TDD note:** This is a thin wrapper around `next-mdx-remote/rsc`'s `MDXRemote`. We rely on Phase 6 e2e to verify rendering — unit-testing RSC MDX in jsdom is fragile.

- [ ] **Step 1: Implement `mdx-content.tsx`**

  Create `components/content/mdx-content.tsx`:
  ```tsx
  import { MDXRemote } from "next-mdx-remote/rsc";

  type Props = {
    source: string;
  };

  export function MdxContent({ source }: Props) {
    return (
      <article className="prose prose-invert max-w-prose font-serif text-paper [&_h1]:font-serif [&_h2]:font-serif [&_a]:text-accent [&_code]:font-mono [&_code]:text-cherry">
        <MDXRemote source={source} />
      </article>
    );
  }
  ```

  *(Confirm the import path against what context7 returned in Task 0; if the API differs in the installed `next-mdx-remote` version, adjust here.)*

- [ ] **Step 2: Verify it compiles**

  ```bash
  pnpm tsc --noEmit
  ```
  Expected: no type errors.

- [ ] **Step 3: Commit**

  ```bash
  git add components/content/mdx-content.tsx
  git commit -m "feat(content): add MdxContent wrapper for typography-consistent MDX rendering"
  ```

---

## Task 13: Build `app/page.tsx` (landing)

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace the placeholder with the real landing**

  ```tsx
  "use client";
  import { useRouter } from "next/navigation";
  import { useCallback } from "react";
  import { LandingVideo } from "../components/landing/landing-video";
  import { LandingOverlay } from "../components/landing/landing-overlay";

  export default function Landing() {
    const router = useRouter();

    const enter = useCallback(() => {
      router.push("/home");
    }, [router]);

    const onKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          enter();
        }
      },
      [enter],
    );

    return (
      <div
        role="button"
        tabIndex={0}
        aria-label="Enter site"
        onClick={enter}
        onKeyDown={onKeyDown}
        className="relative w-screen h-screen overflow-hidden cursor-pointer focus:outline-none"
      >
        <LandingVideo />
        <LandingOverlay />
      </div>
    );
  }
  ```

- [ ] **Step 2: Verify manually**

  ```bash
  pnpm dev
  ```
  Open `http://localhost:3000`. Expected: video plays muted+looped (after Task 21 ships the asset; until then, a broken-image poster is fine), feathered edges, top-left "MY PROLOGUE", bottom-right "click anywhere to enter →". Clicking anywhere → navigates to `/home` (which 404s until Task 14 — that's expected here).

- [ ] **Step 3: Commit**

  ```bash
  git add app/page.tsx
  git commit -m "feat(landing): wire / to LandingVideo + LandingOverlay with full-viewport click"
  ```

---

## Task 14: Build `app/home/page.tsx` (main page)

**Files:**
- Create: `app/home/page.tsx`

- [ ] **Step 1: Implement `/home`**

  Create `app/home/page.tsx`:
  ```tsx
  import { Sidebar } from "../../components/shell/sidebar";
  import { PostCard } from "../../components/content/post-card";
  import { getAllPosts, getAllProjects } from "../../lib/content";

  export default async function HomePage() {
    const [posts, projects] = await Promise.all([getAllPosts(), getAllProjects()]);
    const recent = posts.slice(0, 5);

    return (
      <div className="flex min-h-screen">
        <Sidebar
          blogs={posts.map(({ slug, title, date }) => ({ slug, title, date }))}
          projects={projects.map(({ slug, title, date }) => ({ slug, title, date }))}
        />
        <main className="flex-1 p-12 max-w-4xl">
          <section className="mb-16">
            <p className="text-xs uppercase tracking-[0.22em] text-muted mb-4">Mission</p>
            <h1 className="font-serif text-4xl leading-tight text-paper mb-4">
              You&rsquo;re not learning to code. You&rsquo;re learning to build.
            </h1>
            <p className="font-serif text-lg text-muted">
              The portfolio is not the product. <span className="text-paper">You</span> are the product.
            </p>
          </section>

          <section>
            <div className="flex items-baseline justify-between mb-6">
              <p className="text-xs uppercase tracking-[0.22em] text-muted">Recent posts</p>
              {posts.length > 5 && (
                <a href="/blog" className="text-xs uppercase tracking-[0.22em] text-accent hover:text-paper">
                  View all →
                </a>
              )}
            </div>
            <div className="grid gap-6">
              {recent.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }
  ```

- [ ] **Step 2: Verify manually**

  ```bash
  pnpm dev
  ```
  Open `http://localhost:3000/home`. Expected: sidebar on the left with brand + Blogs/Projects/About; mission section at top; one PostCard for the seed `welcome` post. Clicking the brand goes to `/home` (already there). Clicking Blogs cascade shows seed entry; clicking it navigates to `/blog/welcome` (404 until Task 15).

- [ ] **Step 3: Commit**

  ```bash
  git add app/home/
  git commit -m "feat(home): build /home with sidebar + mission + recent posts"
  ```

---

## Task 15: Build `app/blog/page.tsx` and `app/blog/[slug]/page.tsx`

**Files:**
- Create: `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`

- [ ] **Step 1: Implement `/blog` (list)**

  Create `app/blog/page.tsx`:
  ```tsx
  import { Sidebar } from "../../components/shell/sidebar";
  import { PostCard } from "../../components/content/post-card";
  import { getAllPosts, getAllProjects } from "../../lib/content";

  export default async function BlogIndex() {
    const [posts, projects] = await Promise.all([getAllPosts(), getAllProjects()]);

    return (
      <div className="flex min-h-screen">
        <Sidebar
          blogs={posts.map(({ slug, title, date }) => ({ slug, title, date }))}
          projects={projects.map(({ slug, title, date }) => ({ slug, title, date }))}
        />
        <main className="flex-1 p-12 max-w-4xl">
          <h1 className="font-serif text-3xl text-paper mb-8">Blog</h1>
          <div className="grid gap-6">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </main>
      </div>
    );
  }
  ```

- [ ] **Step 2: Implement `/blog/[slug]`**

  Create `app/blog/[slug]/page.tsx`:
  ```tsx
  import { notFound } from "next/navigation";
  import { Sidebar } from "../../../components/shell/sidebar";
  import { MdxContent } from "../../../components/content/mdx-content";
  import { getAllPosts, getAllProjects, getPostBySlug } from "../../../lib/content";

  type Params = Promise<{ slug: string }>;

  export default async function BlogPost({ params }: { params: Params }) {
    const { slug } = await params;
    const [post, posts, projects] = await Promise.all([
      getPostBySlug(slug),
      getAllPosts(),
      getAllProjects(),
    ]);

    if (!post) notFound();

    return (
      <div className="flex min-h-screen">
        <Sidebar
          blogs={posts.map(({ slug, title, date }) => ({ slug, title, date }))}
          projects={projects.map(({ slug, title, date }) => ({ slug, title, date }))}
        />
        <main className="flex-1 p-12">
          <header className="mb-10">
            <p className="text-xs uppercase tracking-[0.22em] text-muted mb-3">
              {new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(new Date(post.date))}
            </p>
            <h1 className="font-serif text-4xl leading-tight text-paper">{post.title}</h1>
          </header>
          <MdxContent source={post.body} />
        </main>
      </div>
    );
  }

  export async function generateStaticParams() {
    const posts = await getAllPosts();
    return posts.map((p) => ({ slug: p.slug }));
  }
  ```

  *(Note: in Next 16 App Router, `params` is a Promise — confirm against what Task 0 surfaced.)*

- [ ] **Step 3: Verify manually**

  ```bash
  pnpm dev
  ```
  - `http://localhost:3000/blog` → list shows seed `welcome`.
  - `http://localhost:3000/blog/welcome` → renders the MDX body (heading + paragraphs).
  - `http://localhost:3000/blog/does-not-exist` → 404.

- [ ] **Step 4: Commit**

  ```bash
  git add app/blog/
  git commit -m "feat(blog): /blog list + /blog/[slug] MDX page"
  ```

---

## Task 16: Build `app/projects/page.tsx` and `app/projects/[slug]/page.tsx`

**Files:**
- Create: `app/projects/page.tsx`, `app/projects/[slug]/page.tsx`

- [ ] **Step 1: Implement `/projects`**

  Create `app/projects/page.tsx`:
  ```tsx
  import { Sidebar } from "../../components/shell/sidebar";
  import { ProjectCard } from "../../components/content/project-card";
  import { getAllPosts, getAllProjects } from "../../lib/content";

  export default async function ProjectsIndex() {
    const [posts, projects] = await Promise.all([getAllPosts(), getAllProjects()]);

    return (
      <div className="flex min-h-screen">
        <Sidebar
          blogs={posts.map(({ slug, title, date }) => ({ slug, title, date }))}
          projects={projects.map(({ slug, title, date }) => ({ slug, title, date }))}
        />
        <main className="flex-1 p-12 max-w-4xl">
          <h1 className="font-serif text-3xl text-paper mb-8">Projects</h1>
          <div className="grid gap-6">
            {projects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </main>
      </div>
    );
  }
  ```

- [ ] **Step 2: Implement `/projects/[slug]`**

  Create `app/projects/[slug]/page.tsx`:
  ```tsx
  import { notFound } from "next/navigation";
  import { Sidebar } from "../../../components/shell/sidebar";
  import { MdxContent } from "../../../components/content/mdx-content";
  import { getAllPosts, getAllProjects, getProjectBySlug } from "../../../lib/content";

  type Params = Promise<{ slug: string }>;

  export default async function ProjectPage({ params }: { params: Params }) {
    const { slug } = await params;
    const [project, posts, projects] = await Promise.all([
      getProjectBySlug(slug),
      getAllPosts(),
      getAllProjects(),
    ]);

    if (!project) notFound();

    return (
      <div className="flex min-h-screen">
        <Sidebar
          blogs={posts.map(({ slug, title, date }) => ({ slug, title, date }))}
          projects={projects.map(({ slug, title, date }) => ({ slug, title, date }))}
        />
        <main className="flex-1 p-12">
          <header className="mb-10">
            <p className="text-xs uppercase tracking-[0.22em] text-muted mb-3">
              {project.status} · {new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(new Date(project.date))}
            </p>
            <h1 className="font-serif text-4xl leading-tight text-paper">{project.title}</h1>
          </header>
          <MdxContent source={project.body} />
        </main>
      </div>
    );
  }

  export async function generateStaticParams() {
    const projects = await getAllProjects();
    return projects.map((p) => ({ slug: p.slug }));
  }
  ```

- [ ] **Step 3: Verify manually**

  - `http://localhost:3000/projects` → seed `my-prologue` shown.
  - `http://localhost:3000/projects/my-prologue` → renders MDX body.

- [ ] **Step 4: Commit**

  ```bash
  git add app/projects/
  git commit -m "feat(projects): /projects list + /projects/[slug] MDX page"
  ```

---

## Task 17: Build `app/about/page.tsx` (skeleton)

**Files:**
- Create: `app/about/page.tsx`

- [ ] **Step 1: Implement skeleton**

  ```tsx
  import { Sidebar } from "../../components/shell/sidebar";
  import { getAllPosts, getAllProjects } from "../../lib/content";

  export default async function AboutPage() {
    const [posts, projects] = await Promise.all([getAllPosts(), getAllProjects()]);

    return (
      <div className="flex min-h-screen">
        <Sidebar
          blogs={posts.map(({ slug, title, date }) => ({ slug, title, date }))}
          projects={projects.map(({ slug, title, date }) => ({ slug, title, date }))}
        />
        <main className="flex-1 p-12 max-w-3xl">
          <h1 className="font-serif text-4xl text-paper mb-6">About</h1>
          <p className="font-serif text-lg text-muted">More soon.</p>
        </main>
      </div>
    );
  }
  ```

- [ ] **Step 2: Verify**

  `http://localhost:3000/about` renders the skeleton with the sidebar.

- [ ] **Step 3: Commit**

  ```bash
  git add app/about/
  git commit -m "feat(about): /about skeleton"
  ```

---

## Task 18: E2E — landing flow

**Files:**
- Create: `e2e/landing.spec.ts`

- [ ] **Step 1: Write the spec**

  ```ts
  import { test, expect } from "@playwright/test";

  test("landing renders title and click hint", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/MY PROLOGUE/i)).toBeVisible();
    await expect(page.getByText(/click anywhere to enter/i)).toBeVisible();
  });

  test("clicking anywhere navigates to /home", async ({ page }) => {
    await page.goto("/");
    await page.locator('[role="button"][aria-label="Enter site"]').click();
    await expect(page).toHaveURL(/\/home$/);
  });

  test("pressing Enter on the landing navigates to /home", async ({ page }) => {
    await page.goto("/");
    await page.locator('[role="button"][aria-label="Enter site"]').focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/home$/);
  });

  test("reduced-motion users see the poster, not a video element", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("video")).toHaveCount(0);
    await expect(page.locator('img[alt*="pug"]')).toBeVisible();
    await context.close();
  });
  ```

- [ ] **Step 2: Run**

  ```bash
  pnpm test:e2e e2e/landing.spec.ts
  ```
  Expected: 4/4 pass. (If the video file isn't yet present, the third test still passes because reduced-motion ignores it; the first two depend only on the overlay text.)

- [ ] **Step 3: Commit**

  ```bash
  git add e2e/landing.spec.ts
  git commit -m "test(e2e): landing click-to-enter, keyboard activation, reduced-motion"
  ```

---

## Task 19: E2E — sidebar + cascade navigation

**Files:**
- Create: `e2e/navigation.spec.ts`

- [ ] **Step 1: Write the spec**

  ```ts
  import { test, expect } from "@playwright/test";

  test("home shows the sidebar with brand and nav items", async ({ page }) => {
    await page.goto("/home");
    await expect(page.getByRole("link", { name: /my prologue/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Blogs/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Projects/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /^About$/i })).toBeVisible();
  });

  test("clicking Blogs cascade reveals seed entry and navigates", async ({ page }) => {
    await page.goto("/home");
    await page.getByRole("button", { name: /^Blogs/i }).click();
    const entry = page.getByRole("link", { name: /Welcome to My Prologue/i });
    await expect(entry).toBeVisible();
    await entry.click();
    await expect(page).toHaveURL(/\/blog\/welcome$/);
  });

  test("clicking Projects cascade reveals seed entry and navigates", async ({ page }) => {
    await page.goto("/home");
    await page.getByRole("button", { name: /^Projects/i }).click();
    const entry = page.getByRole("link", { name: "My Prologue", exact: true });
    await entry.click();
    await expect(page).toHaveURL(/\/projects\/my-prologue$/);
  });

  test("About link navigates to /about", async ({ page }) => {
    await page.goto("/home");
    await page.getByRole("link", { name: /^About$/i }).click();
    await expect(page).toHaveURL(/\/about$/);
  });
  ```

- [ ] **Step 2: Run**

  ```bash
  pnpm test:e2e e2e/navigation.spec.ts
  ```
  Expected: 4/4 pass.

- [ ] **Step 3: Commit**

  ```bash
  git add e2e/navigation.spec.ts
  git commit -m "test(e2e): sidebar nav cascade and link routing"
  ```

---

## Task 20: E2E — content listings + slug pages + about

**Files:**
- Create: `e2e/content.spec.ts`

- [ ] **Step 1: Write the spec**

  ```ts
  import { test, expect } from "@playwright/test";

  test("/blog lists the seed welcome post", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("heading", { name: /Welcome to My Prologue/i })).toBeVisible();
  });

  test("/blog/welcome renders the MDX body", async ({ page }) => {
    await page.goto("/blog/welcome");
    await expect(page.getByRole("heading", { name: /Welcome to My Prologue/i })).toBeVisible();
    await expect(page.getByText(/PM with seven years/i)).toBeVisible();
  });

  test("/projects lists the seed my-prologue entry", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.getByRole("heading", { name: /My Prologue/i })).toBeVisible();
  });

  test("/projects/my-prologue renders the MDX body", async ({ page }) => {
    await page.goto("/projects/my-prologue");
    await expect(page.getByText(/Cinematic landing/i)).toBeVisible();
  });

  test("/about renders the skeleton", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { name: /^About$/ })).toBeVisible();
    await expect(page.getByText(/More soon/i)).toBeVisible();
  });
  ```

- [ ] **Step 2: Run**

  ```bash
  pnpm test:e2e e2e/content.spec.ts
  ```
  Expected: 5/5 pass.

- [ ] **Step 3: Commit**

  ```bash
  git add e2e/content.spec.ts
  git commit -m "test(e2e): content listings, slug pages, about skeleton"
  ```

---

## Task 21: Compress landing video + extract poster

**Files:**
- Create: `public/landing/pug-window.mp4`, `public/landing/poster.jpg`

**This is a manual asset task** — the user runs ffmpeg locally on their source video; the agent only verifies the resulting files land in the right place.

- [ ] **Step 1: Confirm `ffmpeg` is installed**

  ```bash
  ffmpeg -version
  ```
  If not installed: `brew install ffmpeg`.

- [ ] **Step 2: Compress and strip audio**

  Assuming the user has placed their AI-generated source at `~/Downloads/pug-window-source.mp4`:
  ```bash
  mkdir -p public/landing
  ffmpeg -i ~/Downloads/pug-window-source.mp4 \
    -c:v libx264 -crf 23 -preset slow -an \
    -movflags +faststart \
    public/landing/pug-window.mp4
  ```
  Expected output size: 6–9 MB. If it lands above 12 MB, raise `-crf` to 26 and rerun. `-movflags +faststart` lets the browser start playback before download finishes.

- [ ] **Step 3: Extract poster frame**

  ```bash
  ffmpeg -i ~/Downloads/pug-window-source.mp4 -vframes 1 -q:v 2 public/landing/poster.jpg
  ```

- [ ] **Step 4: Verify file sizes and the dev server**

  ```bash
  ls -lh public/landing/
  ```
  Then open `http://localhost:3000/` and confirm the video plays muted/looped and the edges feather correctly.

- [ ] **Step 5: Commit**

  ```bash
  git add public/landing/
  git commit -m "feat(landing): add compressed pug-window video + poster frame"
  ```

---

## Task 22: Lighthouse a11y audit + final smoke

**Files:** none modified.

- [ ] **Step 1: Build and serve production**

  ```bash
  pnpm build && pnpm start
  ```
  Confirm: build passes with no TypeScript or content-frontmatter errors. Server starts on `:3000`.

- [ ] **Step 2: Run Lighthouse a11y audit on `/` and `/home`**

  Use the `chrome-devtools` MCP:
  ```
  mcp__chrome-devtools__lighthouse_audit url="http://localhost:3000" category="accessibility"
  mcp__chrome-devtools__lighthouse_audit url="http://localhost:3000/home" category="accessibility"
  ```
  Expected: both scores ≥ 90. If a finding lands below 90, fix the called-out issue (usually missing `aria-label`, low contrast, missing alt text) and rerun.

- [ ] **Step 3: Manual smoke checklist**

  In order, in a fresh browser tab:
  - `/` shows looped muted video, feathered edges, top-left "MY PROLOGUE", bottom-right "click anywhere to enter →"
  - Click anywhere on `/` → lands on `/home`. Same with keyboard Enter and Space.
  - On `/home`: sidebar visible, mission text rendered with serif, recent posts shows the seed `welcome` card.
  - Click the brand wordmark on any page → navigates to `/home`.
  - Sidebar Blogs cascade: click → expands → entry visible → click entry → lands on `/blog/welcome`.
  - Sidebar Projects cascade: click → expands → entry visible → click entry → lands on `/projects/my-prologue`.
  - Both cascades open simultaneously is allowed.
  - Click cascade parent again to collapse.
  - `/about` renders skeleton.
  - With OS-level "reduce motion" set: `/` shows the poster image, no `<video>` in DOM.

- [ ] **Step 4: Run the full test suites**

  ```bash
  pnpm test:run
  pnpm test:e2e
  ```
  Expected: all unit and component tests pass; all 13 e2e tests pass.

- [ ] **Step 5: No commit (verification only)**

  If any check fails, return to the relevant task to fix.

---

## Task 23: Update workflow + tooling registry

**Files:**
- Modify: `docs/workflow.md`, `docs/agent-tooling.md`

**Why:** Per `CLAUDE.md`'s update rule: when a tool is added/changed, both files get bumped. This build added new dependencies (`gray-matter`, `next-mdx-remote`) but no new plugins/skills/MCPs/subagents — both files only need a date bump.

- [ ] **Step 1: Bump `Last updated` on both files**

  In `docs/workflow.md` line 3: `_Last updated: <today>_`.
  In `docs/agent-tooling.md`: same field.

- [ ] **Step 2: Move this plan to `completed/`**

  ```bash
  mkdir -p docs/plans/completed
  git mv docs/plans/active/2026-04-26-2310-website-foundation.md docs/plans/completed/
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add docs/workflow.md docs/agent-tooling.md docs/plans/
  git commit -m "docs: bump workflow + tooling dates; mark website-foundation plan complete"
  ```

---

## Verification gate (against the spec)

Before declaring done, confirm every spec acceptance criterion:

| Spec criterion | How verified |
|---|---|
| `pnpm build` passes | Task 22 step 1 |
| `pnpm test:run` passes | Task 22 step 4 |
| `pnpm test:e2e` passes | Task 22 step 4 |
| Landing video plays muted/looped, feathered edges, click anywhere → `/home` | Task 22 step 3 |
| `/home` sidebar + mission + recent posts | Task 22 step 3 |
| Cascade nav opens/closes per spec | Task 22 step 3 |
| Reduced-motion shows poster, no video element | Task 18 + Task 22 step 3 |
| About skeleton loads | Task 22 step 3 + Task 20 |
| Lighthouse a11y ≥ 90 on `/` and `/home` | Task 22 step 2 |
| Two seed entries committed | Task 3 |

If any gap, return to the relevant task. Plan completion = all rows verified + Task 23 done.
