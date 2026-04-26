# Website Foundation — Spec

_Created: 2026-04-26_

## Context

The user (a PM building their first software portfolio) has a Next.js 16 + React 19 + Tailwind v4 scaffold but no real site yet. The goal of this build is to ship the **foundation** of the public site: a cinematic landing, a navigated main page with mission + recent posts, blog and project listings backed by MDX-in-repo, and an About skeleton. This is Roadmap Milestones 1.1 + 1.2 (and seeds 1.3) executed in one coherent pass.

Two key contextual decisions made during brainstorm:

- **Publishing model: MDX in the repo.** Content is `.mdx` files committed to `content/blogs/` and `content/projects/`. "Publishing" = git push. No CMS, no admin UI, no DB.
- **Aesthetic: warm-dark "cabin in the woods, fireplace, rainy day."** Palette is locked to "Cherry & Candlelight" (subtle red-brown undertone, candlelight-amber accent, cream paper text). Always-dark; no theme toggle.

## Locked decisions (from brainstorm)

| Topic | Decision |
|---|---|
| Publishing | MDX-in-repo, frontmatter-driven |
| Landing | Looped muted video (user-supplied `pug-window.mp4`, ~720p, 21 MB → compress to 6–9 MB), edges feather to page background via CSS mask, "My Prologue" tracked-uppercase top-left, "click anywhere to enter" small caps bottom-right |
| Theme | Always dark |
| Palette | Cherry & Candlelight (`#16100e` bg, `#221412` surface, `#3a1f1a` border, `#a4593a` cherry, `#e3a44a` accent, `#f4e2c7` paper) |
| Typography | Geist sans (UI/nav/wordmark), Fraunces serif (headlines + post bodies), Geist Mono (code) |
| Cascade nav | Inline accordion. Click a parent → entries expand below in place; click again → collapse. Multiple cascades can be open simultaneously. State is per-page-load, not persisted. |
| Content pipeline | File-system MDX with `gray-matter` + `next-mdx-remote/rsc`. Loader in `lib/content.ts`. No Velite. |
| Landing on revisit | Always shown — not skipped via sessionStorage. |
| Reduced motion | `prefers-reduced-motion: reduce` → render poster `<img>` instead of `<video>`. |

## Routes / pages

| Route | Page | Notes |
|---|---|---|
| `/` | Landing | Looped muted video; full-viewport click target → `/home`. Keyboard Enter/Space activates. Aria-labelled "Enter site". |
| `/home` | Main page | Sidebar shell + mission statement + recent posts (5 most recent, link to `/blog`). Mission statement placeholder copy is **"You're not learning to code. You're learning to build. The portfolio is not the product. You are the product."** (drawn from the roadmap; user can edit `app/home/page.tsx` to change). |
| `/blog` | Blog list | All posts, newest first. |
| `/blog/[slug]` | Single post | MDX rendered server-side. |
| `/projects` | Project list | All projects, newest first. |
| `/projects/[slug]` | Single project | MDX rendered server-side. |
| `/about` | About skeleton | `<h1>About</h1>` + "more soon" placeholder. |

**Sidebar nav** (present on every route except `/`):
- `My Prologue` — brand wordmark, links to `/home` from any page.
- `Blogs ▸` — inline accordion. Click → up to 10 most recent post titles (sorted by `date` descending) expand below; clicking a title links to `/blog/[slug]`. If >10 posts exist, a "View all →" sits at the bottom of the cascade linking to `/blog`. Click parent again to collapse.
- `Projects ▸` — same pattern: up to 10 most recent (newest first), "View all →" → `/projects`.
- `About` — direct link to `/about`, no cascade.

## File / folder layout

```
app/
  layout.tsx                       # root — fonts, html shell, palette tokens applied
  globals.css                      # Tailwind v4 + @theme block
  page.tsx                         # / — landing
  home/page.tsx                    # /home
  blog/page.tsx                    # /blog list
  blog/[slug]/page.tsx             # /blog/[slug]
  projects/page.tsx                # /projects list
  projects/[slug]/page.tsx         # /projects/[slug]
  about/page.tsx                   # /about skeleton

components/
  shell/sidebar.tsx                # left nav + cascade accordion
  shell/nav-item.tsx               # one nav row (link or cascade trigger)
  shell/cascade-list.tsx           # the inline-expanded sub-list
  landing/landing-video.tsx        # <video> + edge mask + reduced-motion guard
  landing/landing-overlay.tsx      # title + click-anywhere text + click handler
  content/post-card.tsx            # listing card (blog)
  content/project-card.tsx         # listing card (project)
  content/mdx-content.tsx          # wraps next-mdx-remote/rsc; applies typography

lib/
  content.ts                       # all content loaders

content/
  blogs/*.mdx                      # blog source
  projects/*.mdx                   # project source

public/
  landing/pug-window.mp4           # compressed video (6-9 MB)
  landing/poster.jpg               # poster frame & reduced-motion fallback

e2e/
  landing.spec.ts
  navigation.spec.ts
  content.spec.ts
```

## Content pipeline

### Frontmatter shapes

**Blog post** (`content/blogs/<slug>.mdx`):
```yaml
---
title: "The First Deploy"
date: 2026-04-26
summary: "What clicked, what's still fuzzy."
tags: ["deploy", "vercel"]            # optional
cover: "/blog/the-first-deploy/cover.jpg"   # optional
---
```

**Project** (`content/projects/<slug>.mdx`):
```yaml
---
title: "The Launchpad"
date: 2026-04-26
summary: "My personal site, built end-to-end with AI."
status: "live"                        # live | wip | archived
links:                                # any subset
  github: "..."
  live: "..."
  writeup: "..."
tech: ["next", "tailwind"]            # optional
cover: "..."                          # optional
---
```

Slug = filename without `.mdx`. Sorting = `date` descending.

### Loader API (`lib/content.ts`)

```ts
type Post = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  cover?: string;
  body: string;
};

type Project = {
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

export async function getAllPosts(): Promise<Post[]>;
export async function getPostBySlug(slug: string): Promise<Post | null>;
export async function getAllProjects(): Promise<Project[]>;
export async function getProjectBySlug(slug: string): Promise<Project | null>;
```

Server-only module (uses `node:fs`). Reads files at build time; no client-side fetching.

Malformed frontmatter throws with a clear, file-attributed error (rather than silently producing a broken post).

### Dependencies to add

- `gray-matter` — YAML frontmatter parser
- `next-mdx-remote` — MDX render-in-RSC
- (no others; existing scaffold already has Tailwind v4, Vitest, Playwright)

## Visual system

### Palette tokens (`app/globals.css`, Tailwind v4 `@theme` block)

```css
@theme {
  --color-bg: #16100e;
  --color-surface: #221412;
  --color-border: #3a1f1a;
  --color-cherry: #a4593a;
  --color-accent: #e3a44a;
  --color-paper: #f4e2c7;
  --color-muted: #b8a98a;
}
```

`html` and `body` set to `bg-bg text-paper` in `app/layout.tsx`. Existing dark-mode classes (`dark:`) on the scaffolded `app/page.tsx` are removed since there's only one theme.

### Typography

- **Geist (sans)** — already loaded via `next/font/google` in `app/layout.tsx`. UI chrome, nav, brand wordmark.
- **Fraunces (serif)** — added the same way; exposed as `--font-fraunces`. Used for `<h1>`/`<h2>` on `/home`, post titles, and post body copy in `components/content/mdx-content.tsx`.
- **Geist Mono** — already loaded. Code blocks in MDX.

The brand wordmark "My Prologue" stays sans + tracked-uppercase to match the locked C-style top-left composition.

## Landing video implementation

### Asset pipeline (one-time, manual, before commit)

User compresses their 21 MB source with Handbrake or ffmpeg:

```bash
ffmpeg -i pug-window-source.mp4 \
  -c:v libx264 -crf 23 -preset slow -an \
  public/landing/pug-window.mp4
ffmpeg -i pug-window-source.mp4 -vframes 1 \
  public/landing/poster.jpg
```

Targets: 6–9 MB final mp4, no audio (`-an` strips it), poster is frame 0.

### Component (`components/landing/landing-video.tsx`)

Renders one of:
- `<video src="/landing/pug-window.mp4" poster="/landing/poster.jpg" autoPlay muted loop playsInline preload="metadata" aria-label="A pug looking out a window at the rain" />`
- or `<img src="/landing/poster.jpg" alt="A pug looking out a window at the rain" />` when `usePrefersReducedMotion()` returns true.

`usePrefersReducedMotion` is a small custom hook (~10 lines) reading `window.matchMedia('(prefers-reduced-motion: reduce)')` with a `matches` listener — no new dependency.

Edge feather via inline style or a CSS class:

```css
.landing-media {
  mask-image: radial-gradient(ellipse 80% 78% at 50% 50%, black 55%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 80% 78% at 50% 50%, black 55%, transparent 100%);
}
```

### Click target (`app/page.tsx`)

The whole page is one `<button type="button" aria-label="Enter site" onClick={() => router.push('/home')}>` (or a div with `role="button"` and keydown handlers for Enter and Space). Wraps the video, the title overlay, and the bottom-right hint. Navigation is instant client-side `router.push` — no fade or transition in v1; transition polish is deferred.

## Testing strategy

**Unit/component tests** (Vitest + RTL, gated by TDD-Guard — write the failing test first):

- `lib/content.test.ts` — frontmatter parsing for both shapes; slug derivation; sort order (newest first); `getPostBySlug` returns `null` for missing files; malformed frontmatter throws an error that includes the offending filename.
- `components/shell/sidebar.test.tsx` — cascade opens on parent click; closes on second click; two cascades can be open simultaneously; entries link to correct slugs.
- `components/landing/landing-video.test.tsx` — when `useReducedMotion` returns true, renders `<img>` (not `<video>`); when false, renders `<video>` with required attributes (`autoPlay`, `muted`, `loop`, `playsInline`).
- `components/content/post-card.test.tsx`, `project-card.test.tsx` — title, date (formatted), summary render; optional `cover`, `tags`, and `tech` rendered when present, gracefully omitted when absent. `project-card` shows a small `status` pill (`live` / `wip` / `archived`) styled distinctly per state (e.g., accent for `live`, muted for `wip`, faded for `archived`).

**E2E tests** (Playwright):

- `e2e/landing.spec.ts` — `/` shows the video and overlay text; clicking anywhere navigates to `/home`; same with keyboard Enter; with `reducedMotion: 'reduce'` no `<video>` is in the DOM.
- `e2e/navigation.spec.ts` — on `/home`, sidebar visible; clicking "Blogs" expands the cascade and shows seed post titles; clicking a title navigates to `/blog/[slug]`; same flow for Projects.
- `e2e/content.spec.ts` — `/blog` lists seed post(s) newest-first; `/projects` lists seed project(s); both slug pages render their MDX bodies; `/about` renders without errors.

**Seed content** (committed, not throwaway):
- One real blog post in `content/blogs/` (e.g., `welcome.mdx`).
- One real project in `content/projects/` (e.g., `my-prologue.mdx` describing this site itself).

These exist so listing pages have something to render and e2e tests have stable fixtures.

## Verification (how to know it's done)

1. `pnpm build` passes.
2. `pnpm test:run` passes (all unit/component tests green).
3. `pnpm test:e2e` passes.
4. Manual smoke test:
   - `/` shows looped muted video with feathered edges; "My Prologue" top-left and "click anywhere to enter" bottom-right are visible; clicking the page (or pressing Enter/Space) navigates to `/home`.
   - `/home` shows the sidebar, mission statement, and recent posts (the seed post is listed).
   - On `/home`, clicking "Blogs" expands the cascade; clicking the seed post navigates to its slug page.
   - Same for "Projects."
   - `/about` renders the skeleton.
   - With `prefers-reduced-motion: reduce` set in the OS, the landing shows the poster image (no `<video>` in DOM).
5. Lighthouse accessibility score ≥ 90 on `/` and `/home`.
6. Two seed entries committed (1 blog + 1 project) and visible on their listings.

## Out of scope (deferred)

- Newsletter signup, contact form, RSS, search, analytics → Roadmap Milestones 1.3 / 1.4.
- Light/dark toggle (always dark; locked).
- Tag landing pages (`/blog/tag/foo`).
- Pagination on listings (revisit when content grows past ~20 entries).
- Table-of-contents inside long posts.
- Comments, mobile-specific nav drawer polish, admin authoring UX.
- Sentry / error monitoring (deferred per workflow.md).
- Adding Velite or Zod-validated content schemas (revisit when content scales).
- Image optimisation beyond Next's defaults.

## Open questions / risks

- **Mobile responsiveness:** the left sidebar collapses to a top-bar drawer on small screens; exact pattern (hamburger vs. always-visible top nav) is decided during implementation rather than now.
- **Domain:** custom domain wiring on Vercel happens during Roadmap Milestone 1.1 ship and isn't part of this spec — the build is environment-agnostic and works on the default `*.vercel.app` URL.
- **Video sourcing:** user supplies `pug-window-source.mp4`. The compression step lands the file in `public/landing/`. If the user hasn't compressed before commit, the implementation plan will include the ffmpeg command as a step.
