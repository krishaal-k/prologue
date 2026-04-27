# Drafts

Drop polished blog drafts here as `.md` files. Claude won't auto-publish from this folder — `lib/content.ts` only reads `*.mdx` directly under `content/blogs/`, so anything in `_drafts/` is invisible to the site until promoted.

## Workflow

1. **Write in Obsidian.** Open the `prologue` repo as a vault, or just open this `_drafts/` folder. Save your post as `<slug>.md` (e.g. `how-i-built-prologue.md`).
2. **Drop in images alongside the post** if you have them — Obsidian will save them to a folder it manages. Don't worry about paths; Claude will move them.
3. **When ready, ask Claude to publish:** "publish the latest draft" or "publish how-i-built-prologue".

## What Claude does on publish

- Reads the `.md` file, applies any light copy polish you ask for.
- Adds frontmatter (`title`, `date`, `summary`, `tags`).
- Moves images into `public/blog-assets/<slug>/` and rewrites their paths.
- Writes the final post as `content/blogs/<slug>.mdx`.
- Optionally archives or deletes the draft once published.

## Conventions

- **Filename = slug.** Lowercase, hyphenated, no spaces. e.g. `learning-to-build.md` → published as `/blog/learning-to-build`.
- **First line as title is fine** — Claude will lift it into frontmatter, no need to write YAML yourself.
- **Links survive copy-paste from web pages** if you paste into Obsidian, not into chat.
- **Don't put `.mdx` files in `_drafts/`.** Use `.md` so there's no chance of accidental publishing.
