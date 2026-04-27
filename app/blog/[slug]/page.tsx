import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sidebar } from "../../../components/shell/sidebar";
import { MdxContent } from "../../../components/content/mdx-content";
import { getAllPosts, getAllProjects, getPostBySlug } from "../../../lib/content";

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(
    new Date(dateStr),
  );
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(({ slug }) => ({ slug }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, allPosts, allProjects] = await Promise.all([
    getPostBySlug(slug),
    getAllPosts(),
    getAllProjects(),
  ]);
  if (!post) notFound();

  return (
    <div className="flex min-h-screen">
      <Sidebar
        blogs={allPosts.map(({ slug: s, title, date }) => ({ slug: s, title, date }))}
        projects={allProjects.map(({ slug: s, title, date }) => ({ slug: s, title, date }))}
      />
      <main className="flex-1 p-12 max-w-3xl">
        <Link
          href="/blog"
          className="inline-block text-xs uppercase tracking-[0.22em] text-muted hover:text-accent transition-colors mb-8"
        >
          ← Back to blog
        </Link>
        <article className="prose prose-lg prose-prologue max-w-none">
          <h1 className="font-serif text-4xl text-paper mb-4">{post.title}</h1>
          <time
            dateTime={post.date}
            className="block text-xs uppercase tracking-[0.18em] text-muted mb-8"
          >
            {formatDate(post.date)}
          </time>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-[0.16em] bg-bg text-muted border border-border"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <MdxContent source={post.body} />
          <p className="font-serif text-lg text-muted mt-12">—Krishaal</p>
        </article>
      </main>
    </div>
  );
}
