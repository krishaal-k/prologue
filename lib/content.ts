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

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const all = await getAllPosts();
  return all.find((p) => p.slug === slug) ?? null;
}

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
